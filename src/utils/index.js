import {SING_IN_VK_TITLE} from "../const/index";
import {redirect_uri, client_id, buildVkAuthUrl} from "../vk_api/index";
export function isBottomOfPage() {
  return (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
}

export function isContentSmallerThanWindow() {
  //            Browser window height
  //            window.innerHeight
  //            954
  //            Content height
  //            document.documentElement.scrollHeight
  //            2594
  return window.innerHeight >= document.documentElement.scrollHeight;
}

export function windowClosedPromise(win) {
  return new Promise((resolve, reject) => {
    // A mock async action using setTimeout
    let winClosed = setInterval(() => {
      if (win.closed) {
        clearInterval(winClosed);
        resolve(true);
      }
    }, 100);
  })
}

export function createPopup(url, title, {popupWidth = 655, popupHeight = 350}) {
  const xPosition=(window.innerWidth-popupWidth)/2;
  const yPosition=(window.innerHeight-popupHeight)/2;
  return window.open(url, title, "location=1,scrollbars=1,"+
    "width="+popupWidth+",height="+popupHeight+","+
    "left="+xPosition+",top="+yPosition);
}

export function createSignInPopup() {
  return createPopup(buildVkAuthUrl({
    client_id,
    redirect_uri,
  }), SING_IN_VK_TITLE);
}
