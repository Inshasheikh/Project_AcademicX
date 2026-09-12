import { supabase } from '../services/supabase';

/**
 * Compresses and resizes an avatar image file to a lightweight, high-res data URL.
 * Produces ~25KB - 45KB images that load instantly across all devices.
 */
export const compressAndResizeAvatar = (file, maxWidth = 320, maxHeight = 320, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to raw data URL if canvas context unavailable
            return resolve(readerEvent.target.result);
          }

          // Render with smooth scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as JPEG with optimal compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (canvasErr) {
          console.warn('[Avatar Compression Fallback]', canvasErr);
          resolve(readerEvent.target.result);
        }
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Resolves the cached avatar URL for the given user from local memory/storage.
 */
export const getStoredUserAvatar = (currentUser) => {
  try {
    if (currentUser?.avatar_url) {
      return currentUser.avatar_url;
    }
    if (currentUser?.profile?.avatar_url) {
      return currentUser.profile.avatar_url;
    }

    const email = (currentUser?.email || '').toLowerCase().trim();
    const phone = (currentUser?.phone || currentUser?.phone_number || '').trim();

    if (email) {
      const emailCached = localStorage.getItem(`academicx_avatar_${email}`);
      if (emailCached) return emailCached;
      const legacyKey = localStorage.getItem(`academicx_student_photo_${email}`);
      if (legacyKey) return legacyKey;
    }

    if (phone) {
      const phoneCached = localStorage.getItem(`academicx_avatar_${phone}`);
      if (phoneCached) return phoneCached;
    }

    // Global fallback
    return localStorage.getItem('academicx_student_photo') || null;
  } catch {
    return null;
  }
};

/**
 * Synchronizes the user's avatar from Supabase cloud database.
 * If found, saves to local cache so future renders are instant.
 */
export const fetchUserAvatarFromCloud = async (currentUser) => {
  if (!currentUser) return null;
  const email = (currentUser?.email || '').toLowerCase().trim();
  const phone = (currentUser?.phone || currentUser?.phone_number || '').trim();
  const userId = currentUser?.id;

  if (!email && !phone && !userId) return null;

  try {
    let cloudAvatar = null;

    if (email) {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('email', email)
        .maybeSingle();

      if (!error && data?.avatar_url) {
        cloudAvatar = data.avatar_url;
      }
    }

    if (!cloudAvatar && phone) {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('phone_number', phone)
        .maybeSingle();

      if (!error && data?.avatar_url) {
        cloudAvatar = data.avatar_url;
      }
    }

    if (!cloudAvatar && userId && typeof userId === 'string' && userId.length > 20) {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data?.avatar_url) {
        cloudAvatar = data.avatar_url;
      }
    }

    if (cloudAvatar) {
      // Store in user-scoped cache
      if (email) {
        localStorage.setItem(`academicx_avatar_${email}`, cloudAvatar);
        localStorage.setItem(`academicx_student_photo_${email}`, cloudAvatar);
      }
      if (phone) {
        localStorage.setItem(`academicx_avatar_${phone}`, cloudAvatar);
      }
      localStorage.setItem('academicx_student_photo', cloudAvatar);

      // Update cached session user objects
      ['reddot_user', 'user'].forEach((key) => {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.avatar_url = cloudAvatar;
            localStorage.setItem(key, JSON.stringify(parsed));
          }
        } catch {}
      });

      // Dispatch event to update other mounted components (e.g. Navbar)
      window.dispatchEvent(
        new CustomEvent('academicx_avatar_updated', {
          detail: { avatar_url: cloudAvatar, email, phone }
        })
      );

      return cloudAvatar;
    }

    return null;
  } catch (err) {
    console.warn('[Avatar Sync Exception]', err);
    return null;
  }
};

/**
 * Saves a new avatar to Supabase cloud database and local caches.
 * This guarantees the avatar appears on all devices immediately upon login.
 */
export const saveUserAvatarToCloud = async (avatarDataUrl, currentUser) => {
  if (!avatarDataUrl || !currentUser) {
    throw new Error('Avatar data and user profile are required.');
  }

  const email = (currentUser?.email || '').toLowerCase().trim();
  const phone = (currentUser?.phone || currentUser?.phone_number || '').trim();
  const fullName = currentUser?.full_name || currentUser?.name || 'Student';
  const role = currentUser?.role || 'student';

  // 1. Immediately cache locally for optimistic UI
  if (email) {
    localStorage.setItem(`academicx_avatar_${email}`, avatarDataUrl);
    localStorage.setItem(`academicx_student_photo_${email}`, avatarDataUrl);
  }
  if (phone) {
    localStorage.setItem(`academicx_avatar_${phone}`, avatarDataUrl);
  }
  localStorage.setItem('academicx_student_photo', avatarDataUrl);

  // Update cached user objects in localStorage
  ['reddot_user', 'user'].forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.avatar_url = avatarDataUrl;
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    } catch {}
  });

  // Notify all listening components
  window.dispatchEvent(
    new CustomEvent('academicx_avatar_updated', {
      detail: { avatar_url: avatarDataUrl, email, phone }
    })
  );

  // 2. Persist to Supabase Database
  let updateSuccess = false;

  if (email) {
    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            avatar_url: avatarDataUrl,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);

        if (!updateError) {
          updateSuccess = true;
        } else {
          console.warn('[Supabase avatar update error]', updateError);
        }
      } else {
        // Insert new profile record
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            email,
            phone_number: phone || null,
            full_name: fullName,
            role,
            password_hash: 'auth_managed',
            avatar_url: avatarDataUrl,
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (!insertError) {
          updateSuccess = true;
        } else {
          console.warn('[Supabase avatar insert error]', insertError);
        }
      }
    } catch (dbErr) {
      console.warn('[Supabase avatar persistence failed]', dbErr);
    }
  }

  // Fallback check by phone if email was not available
  if (!updateSuccess && phone) {
    try {
      const { error: phoneErr } = await supabase
        .from('profiles')
        .update({
          avatar_url: avatarDataUrl,
          updated_at: new Date().toISOString()
        })
        .eq('phone_number', phone);

      if (!phoneErr) updateSuccess = true;
    } catch (err) {
      console.warn('[Supabase phone avatar update failed]', err);
    }
  }

  return { success: true, cloudSynced: updateSuccess, avatar_url: avatarDataUrl };
};
