import {buildVkAuthUrl} from "../vk_api/index";
import {strategy as st} from "../const/index";

export function isBottomOfPage() {
  return (window.innerHeight + window.scrollY + 800) >= document.body.scrollHeight;
}

export function show(strategy, cb) {
  switch (strategy) {
    case st.noop:
      return true;
      break;
    case st.darken:
      return true;
      break;
    case st.hide:
    case st.aggressive:
      return cb;
  }
}

export function isContentSmallerThanWindow() {
             // Browser window height:
             // window.innerHeight
             // 954
             // Content page height:
             // document.documentElement.scrollHeight
             // 2594
  return window.innerHeight >= document.documentElement.scrollHeight;
}

export function windowClosedPromise(win) {
  return new Promise((resolve, reject) => {
    // A mock async action using setTimeout
    let winClosed = setInterval(() => {
      // console.log(win);
      if (win.closed) {
        clearInterval(winClosed);
        resolve(true);
      }
    }, 100);
  })
}

export function elementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}

export function redirectToGetToken() {
  window.location.href = buildVkAuthUrl({});
}

export function createPopup({url = '', popupWidth = 655, popupHeight = 350}) {
  const xPosition=(window.innerWidth-popupWidth)/2;
  const yPosition=(window.innerHeight-popupHeight)/2;
  return window.open(url, '_blank', "location=1,scrollbars=1,"+
    "width="+popupWidth+",height="+popupHeight+","+
    "left="+xPosition+",top="+yPosition);
}

export function createSignInPopup() {
  return createPopup({url: buildVkAuthUrl({})});
}
