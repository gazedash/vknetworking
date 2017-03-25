// @flow
import { buildVkAuthUrl } from '../vk_api/index';
import { strategy as st } from '../const/index';

export function isBottomOfPage() {
  return (window.innerHeight + window.scrollY + 800) >= document.body.scrollHeight;
}

export function iterateWithDelay(array: Array<any>, cb: Function = () => {}, delay: number = 1000) {
  let counter = 0;
  const inter = setInterval(() => {
    const items = array[counter];
    cb(items);
    counter++;
    if (counter === array.length) {
      clearInterval(inter);
    }
  }, delay);
}

export function show(strategy: string, cb: Function = () => {}) {
  switch (strategy) {
    case st.noop:
      return true;
    case st.darkenOnClick:
      return true;
    case st.darkenOnScroll:
      return cb;
    default:
      return true;
  }
}

export function mediaQueryWidth() {
  const width = window.innerWidth - 15;
  let mq = window.matchMedia('screen and (min-width: 1600px)');
  if (mq.matches) {
    const pixels = 280;
    return { name: 'extra-large', pixels, length: Math.floor(width / pixels) };
  }
  mq = window.matchMedia('screen and (min-width: 1440px)');
  if (mq.matches) {
    const pixels = 260;
    return { name: 'large', pixels, length: Math.floor(width / pixels) };
  }
  mq = window.matchMedia('screen and (min-width: 1200px)');
  if (mq.matches) {
    const pixels = 240;
    return { name: 'medium', pixels, length: Math.floor(width / pixels) };
  }
  mq = window.matchMedia('screen and (min-width: 480px)');
  if (mq.matches) {
    const pixels = 200;
    return { name: 'small', pixels, length: Math.floor(width / pixels) };
  }
  const pixels = 100;
  return { name: 'extra-small', pixels, length: Math.floor(width / pixels) };
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

export function windowClosedPromise(win: window) {
  return new Promise((resolve, reject) => {
    // A mock async action using setTimeout
    const winClosed = setInterval(() => {
      // console.log(win);
      if (win.closed) {
        clearInterval(winClosed);
        resolve(true);
      }
    }, 100);
  });
}

export function isElementFullyInViewport(el: Element) {
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

export function isElementHigher(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  // console.log({el});
  return (el.offsetTop + rect.height) <= window.pageYOffset;
}

export function isElementInViewport(el: HTMLElement) {
  const rect = el ? el.getBoundingClientRect() : null;
  if (rect) {
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
  }
  return false;
}

export function redirectToGetToken() {
  window.location.href = buildVkAuthUrl({});
}

export function createPopup({ url = '', popupWidth = 655, popupHeight = 350 }) {
  // url: string, popupWidth: number, popupHeight: number
  const xPosition = (window.innerWidth - popupWidth) / 2;
  const yPosition = (window.innerHeight - popupHeight) / 2;
  return window.open(url, '_blank', `${'location=1,scrollbars=1,' +
    'width='}${popupWidth},height=${popupHeight},` +
    `left=${xPosition},top=${yPosition}`);
}

export function createSignInPopup() {
  return createPopup({ url: buildVkAuthUrl({}) });
}

// eslint-disable-next-line func-names
export function onScroll(delta = 0, downCb = function () {}, upCb = function () {}) {
  // delta: number, downCb: Function = () {}, upCb: Function = () {}
  const offset = window.pageYOffset || document.documentElement.scrollTop;
  if (offset > delta) {
    downCb();
  } else {
    upCb();
  }
//          this.lastScrollTop = st;
  return offset;
}

export function addOrRemoveListener({ newStrategy, oldStrategy, cmpStrategy, listener }) {
  // newStrategy: string, oldStrategy: string, cmpStrategy: string, listener: EventListener
  if (newStrategy === cmpStrategy) {
    if (newStrategy !== oldStrategy) {
      window.addEventListener('scroll', listener);
    }
  } else if (oldStrategy === st.darkenOnScroll) {
    window.removeEventListener('scroll', listener);
  }
}
