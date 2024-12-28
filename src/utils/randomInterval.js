/**
 * Generates a random interval between a minimum and maximum value.
 * @param {number} min - The minimum value in seconds.
 * @param {number} max - The maximum value in seconds.
 * @returns {number} - A random interval in milliseconds.
 */
const getRandomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
};

export default getRandomInterval;
