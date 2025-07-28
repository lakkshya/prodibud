/**
 * Ensures that an async operation (promise) takes at least a minimum delay before completing.
 * Useful for keeping loaders visible for a consistent time to improve UX.
 *
 * @param {Promise} promise - The async operation to wrap.
 * @param {number} minDelay - Minimum time (in ms) that must pass before the result is returned.
 * @returns {Promise} - The resolved value of the original promise, delayed if necessary.
 */
const withMinDelay = async (promise, minDelay = 2000) => {
  // Record the start time (in milliseconds)
  const start = Date.now();
  // Wait for the actual async operation to complete
  const result = await promise;
  // Calculate how long the operation took
  const elapsed = Date.now() - start;
  // Determine how much more time to wait (if any)
  const remaining = Math.max(0, minDelay - elapsed);

  // Wait for the remaining time (if the promise resolved too quickly)
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
  // Return the original result after the minimum delay
  return result;
};

export default withMinDelay;
