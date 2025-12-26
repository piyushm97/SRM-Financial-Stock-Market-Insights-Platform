// server/src/utils/logRequest.js
export function logRequest(req, _res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
}
