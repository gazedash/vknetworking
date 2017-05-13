// @flow
export const user = {
  authenticated: false,
  firstTime: true,
  doNotShowAgain: false,
};

export function logout() {
  delete localStorage.token;
  user.authenticated = false;
}

export function redirected(to: Object, from: Object, next: Function = () => {
}) {
  if (to.hash) {
    const user_id = to.hash.split('user_id=')[1];
    localStorage.setItem('lastLoginUserId', user_id);
    const token = to.hash.split('access_token=')[1].split('&')[0];
    if (token) {
      localStorage.setItem('token', token);
      user.authenticated = true;
    } else {
      window.close();
      next('/login');
    }
  }
  window.close();
  next('/');
}

export function checkAuth() {
  const token = localStorage.getItem('token');
  user.authenticated = !!token;
  return !!token;
}

export function ifLoggedIn(to: Object, from: Object, next: Function = () => {
}) {
  console.log('to login');
  if (checkAuth()) {
    next('/');
  } else {
    next();
  }
}

export function requireAuth(to: Object, from: Object, next: Function = () => {
}) {
  if (!checkAuth()) {
    console.log(!checkAuth());
    next({
      path: '/login',
      // query: {redirect: to.fullPath}
    });
  } else {
    console.log('else');
    next();
  }
}

export function checkFirstTimeAndSet() {
  if (localStorage.firstTime) {
    user.firstTime = false;
    return false;
  }
  user.firstTime = true;
  localStorage.firstTime = 'no';
  return true;
}

export function checkShow() {
  const doNotShowAgain = localStorage.getItem('doNotShowAgain');
  user.doNotShowAgain = !!doNotShowAgain;
  return doNotShowAgain;
}

export function initialCheck() {
  checkAuth();
  checkShow();
  checkFirstTimeAndSet();
}

export function setDoNotShowAgain() {
  // const doNotShowAgain = localStorage.setItem('doNotShowAgain', true);
  localStorage.setItem('doNotShowAgain', true);
  user.doNotShowAgain = true;
  return true;
}
