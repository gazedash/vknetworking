import {isElementInViewport} from "../utils/index";

function lazyLoad(el, img) {
  if (isElementInViewport(el)) {
    el.src = img.src;
  } else {
    setTimeout(() => {
      el.src = img.src;
    }, Math.floor(100 + (Math.random() * 300)))
  }
}

function load(el, binding) {
  let img = new Image();
  img.src = binding.value;

  img.onload = () => {
    lazyLoad(el, img)
  };
  img.onerror = () => {
    lazyLoad(el, img)
  }
}

export default {
  bind (el, binding) {
    load(el, binding)
  },
  update (el, binding) {
    load(el, binding)
  }
};
