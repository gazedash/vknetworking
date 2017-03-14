import {isElementInViewport} from "../utils/index";
export default {
  bind (el, binding) {
    function lazyLoad(el, img) {
      if (isElementInViewport(el)) {
        el.src = img.src;
      } else {
        setTimeout(() => {
          el.src = img.src;
        }, Math.floor(100 + (Math.random() * 300)))
      }
    }
    let img = new Image();
    img.src = binding.value;

    img.onload = () => {
      lazyLoad(el, img)
    };
    img.onerror = () => {
      lazyLoad(el, img)
    }
  }
};
