export let user = {
  authenticated: false,
  doNotShowAgain: false,
};

export function logout () {
  delete localStorage.token;
  user.authenticated = false;
}

export function redirected(to, from, next) {
  if (to.hash) {
    const userId = to.hash.split('user_id=')[1];
    localStorage.setItem("lastLoginUserId", userId);
    const token = to.hash.split('access_token=')[1].split("&")[0];
    if (token) {
      localStorage.setItem("token", token);
      user.authenticated = true;
    } else {
      window.close();
      next('/login');
    }
  }
  window.close();
  next('/');
}

export function ifLoggedIn(to, from, next) {
  console.log('to login');
  if (checkAuth()) {
    next('/')
  } else {
    next();
  }
}

export function requireAuth (to, from, next) {
  if (!checkAuth()) {
    console.log(!checkAuth());
    next({
      path: '/login',
      // query: {redirect: to.fullPath}
    })
  } else {
    console.log('else');
    next()
  }
}

export function checkFirstTimeAndSet() {
  if (localStorage.firstTime) {
    user.firstTime = false;
    return false;
  } else {
    user.firstTime = true;
    localStorage.firstTime = 'no';
    return true;
  }
}

export function checkAuth() {
  let token = localStorage.getItem('token');
  user.authenticated = !!token;
  return !!token;
}

export function initialCheck() {
  checkAuth();
  checkShow();
  checkFirstTimeAndSet();
}

export function checkShow() {
  let doNotShowAgain = localStorage.getItem('doNotShowAgain');
  user.doNotShowAgain = !!doNotShowAgain;
  return doNotShowAgain;
}

export function setDoNotShowAgain() {
  let doNotShowAgain = localStorage.setItem('doNotShowAgain', true);
  user.doNotShowAgain = true;
  return true;
}
