export function get(id) {
  const json = localStorage.getItem(id);
  return json ? JSON.parse(json) : null;
}
