import {elementInViewport} from "../utils/index";
export default {
  bind (el, binding) {
    let img = new Image();
    img.src = binding.value;

    img.onload = () => {
      if (elementInViewport(el)) {
        el.src = img.src;
      } else {
        setTimeout(() => {
          el.src = img.src;
        }, Math.floor(100 + (Math.random() * 300)))
      }
    }
  }
};
