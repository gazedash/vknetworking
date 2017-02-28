export function isBottomOfPage() {
  return (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
}

export function createPopup(url, title, {popupWidth = 500, popupHeight = 300} = {}) {
  const xPosition=(window.innerWidth-popupWidth)/2;
  const yPosition=(window.innerHeight-popupHeight)/2;
  window.open(url, title, "location=1,scrollbars=1,"+
    "width="+popupWidth+",height="+popupHeight+","+
    "left="+xPosition+",top="+yPosition);
}
