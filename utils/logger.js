// utils/logger.js
export function logInfo(message, extra = {}) {
  console.log(
    JSON.stringify({ level: "info", message, time: new Date().toISOString(), ...extra })
  );
}

export function logError(message, extra = {}) {
  console.error(
    JSON.stringify({ level: "error", message, time: new Date().toISOString(), ...extra })
  );
}
