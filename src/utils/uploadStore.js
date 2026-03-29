// In-memory store for upload data (avoids localStorage size limits)
const store = {};

export function setUploadData(key, value) {
  store[key] = value;
}

export function getUploadData(key) {
  return store[key] ?? null;
}

export function removeUploadData(key) {
  delete store[key];
}
