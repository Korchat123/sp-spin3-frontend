/**
 * Centralized utility for owner app navigation.
 * This allows switching between external (separate app) and internal (integrated feature)
 * implementations via environment variables.
 */

export const getOwnerAppUrl = () => {
  // Use VITE_OWNER_APP_URL from .env
  // If set to "/owner", it will be treated as an internal route in the same build.
  // If set to "http://localhost:5174", it will be treated as an external redirect.
  return import.meta.env.VITE_OWNER_APP_URL || "/owner";
};

/**
 * Perform a redirect to the owner app.
 * Handles both cross-origin URLs and internal absolute paths.
 */
export const redirectToOwnerApp = (path = "") => {
  const target = getOwnerAppUrl() + path;
  console.log(`[Navigation] Redirecting to Owner App: ${target}`);

  if (target.startsWith("http")) {
    window.location.assign(target);
  } else {
    // For internal paths, we can use window.location.href to trigger a full
    // transition if needed, or if we are outside of a Router context.
    // If we want a smooth React Router transition, we should use navigate()
    // inside components, but this utility is a global helper.
    window.location.href = target;
  }
};
