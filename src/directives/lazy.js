// @flow
import { isElementInViewport } from '../utils/index';

function lazyLoad(el: HTMLImageElement, img: HTMLImageElement) {
  if (isElementInViewport(el)) {
    el.src = img.src;
  } else {
    setTimeout(() => {
      el.src = img.src;
    }, Math.floor(100 + (Math.random() * 300)));
  }
}

function load(el: HTMLImageElement, binding: Object) {
  const img = new Image();
  img.src = binding.value;

  img.onload = () => {
    lazyLoad(el, img);
  };
  img.onerror = () => {
    lazyLoad(el, img);
  };
}

export default {
  bind(el: HTMLImageElement, binding: Object) {
    load(el, binding);
  },
  update(el: HTMLImageElement, binding: Object) {
    load(el, binding);
  },
};
