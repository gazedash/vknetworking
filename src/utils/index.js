import {buildVkAuthUrl} from "../vk_api/index";
import {strategy as st} from "../const/index";

export function isBottomOfPage() {
  return (window.innerHeight + window.scrollY + 800) >= document.body.scrollHeight;
}

export function iterateWithDelay(array, cb, delay = 1000) {
  let counter = 0;
  let inter = setInterval(() => {
    const items = array[counter];
    cb(items);
    counter++;
    if (counter === array.length) {
      clearInterval(inter);
    }
  }, delay);
}

export function show(strategy, cb) {
  switch (strategy) {
    case st.noop:
      return true;
      break;
    case st.darkenOnClick:
      return true;
      break;
    case st.darkenOnScroll:
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

export function isElementFullyInViewport (el) {
  const rect = el.getBoundingClientRect();
  const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

  return (
    (rect.left >= 0)
    && (rect.top >= 0)
    && ((rect.left + rect.width) <= windowWidth)
    && ((rect.top + rect.height) <= windowHeight)
  );
}

export function isElementHigher(el) {
  const rect = el.getBoundingClientRect();
  // console.log({el});
  return (el.offsetTop + rect.height) <= window.pageYOffset;
}

export function isElementInViewport(el) {
  const rect = el ? el.getBoundingClientRect() : null;
  if (rect) {
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  } else {
    return false;
  }
}

export function redirectToGetToken() {
  window.location.href = buildVkAuthUrl({});
}

export function createPopup({url = '', popupWidth = 655, popupHeight = 350}) {
  const xPosition = (window.innerWidth - popupWidth) / 2;
  const yPosition = (window.innerHeight - popupHeight) / 2;
  return window.open(url, '_blank', "location=1,scrollbars=1," +
    "width=" + popupWidth + ",height=" + popupHeight + "," +
    "left=" + xPosition + ",top=" + yPosition);
}

export function createSignInPopup() {
  return createPopup({url: buildVkAuthUrl({})});
}

export function onScroll(delta = 0, downCb = function() {}, upCb = function() {}) {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > delta) {
    downCb();
    // downscroll code
  } else {
    upCb();
    // upscroll code
  }
//          this.lastScrollTop = st;
  return st;
}

export function addOrRemoveListener({newStrategy, oldStrategy, cmpStrategy, listener}) {
  if (newStrategy === cmpStrategy) {
    if (newStrategy !== oldStrategy) {
      window.addEventListener('scroll', listener)
    }
  } else {
    if (oldStrategy === st.darkenOnScroll) {
      window.removeEventListener('scroll', listener)
    }
  }
}
