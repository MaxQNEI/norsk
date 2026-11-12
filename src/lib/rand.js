/**
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const rkey = () => `rk${Date.now().toString(36)}x${(Math.random() * Math.pow(10, 18)).toString(36)}`;
