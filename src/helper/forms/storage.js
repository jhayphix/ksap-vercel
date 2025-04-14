export const setLocalStorage = (key, data) => {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = (key) => {
  if (!key) return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
