export function isBottomOfPage() {
  return (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
}
