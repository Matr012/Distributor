// localStorage-based store for upload data
export function setUploadData(key, value) {
  try {
    console.log(`📦 setUploadData('${key}'):`, value);
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save upload data:', err);
  }
}

export function getUploadData(key) {
  try {
    const data = localStorage.getItem(key);
    const parsed = data ? JSON.parse(data) : null;
    console.log(`📤 getUploadData('${key}'):`, parsed);
    return parsed;
  } catch (err) {
    console.error('Failed to get upload data:', err);
    return null;
  }
}

export function removeUploadData(key) {
  try {
    console.log(`🗑️ removeUploadData('${key}')`);
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Failed to remove upload data:', err);
  }
}
