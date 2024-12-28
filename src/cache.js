const EMAIL_CACHE_KEY = 'email_cache';

export const getCachedEmails = (username) => {
  const cachedData = localStorage.getItem(EMAIL_CACHE_KEY);
  if (!cachedData) {
    return null;
  }
  try {
    const cache = JSON.parse(cachedData);
    return cache[username] || null;
  } catch (error) {
    console.error("Error parsing cached emails:", error);
    return null;
  }
};

export const setCachedEmails = (username, emails) => {
  const cachedData = localStorage.getItem(EMAIL_CACHE_KEY);
  let cache = {};
  if (cachedData) {
    try {
      cache = JSON.parse(cachedData);
    } catch (error) {
      console.error("Error parsing cached emails:", error);
    }
  }
  cache[username] = emails;
  localStorage.setItem(EMAIL_CACHE_KEY, JSON.stringify(cache));
};

export const invalidateCache = (username) => {
  const cachedData = localStorage.getItem(EMAIL_CACHE_KEY);
  if (cachedData) {
    try {
      const cache = JSON.parse(cachedData);
      if (cache[username]) {
        delete cache[username];
        localStorage.setItem(EMAIL_CACHE_KEY, JSON.stringify(cache));
      }
    } catch (error) {
      console.error("Error invalidating cache:", error);
    }
  }
};
