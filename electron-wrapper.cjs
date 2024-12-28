(async () => {
  try {
    await import('./electron.mjs');
  } catch (error) {
    console.error('Error loading electron.mjs:', error);
  }
})();
