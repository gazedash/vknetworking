export let user = {
  authenticated: false,
};

export function getToken () {
  return localStorage.token;
}

export function logout (to, from, next) {
  delete localStorage.token;
  user.authenticated = false;
  console.log('logout', user.authenticated);
  next('/login')
}

export function redirected(to, from, next) {
  if (to.hash) {
    const userId = to.hash.split('user_id=')[1];
    localStorage.setItem("lastLoginUserId", userId);
    console.log(userId);
    const token = to.hash.split('access_token=')[1].split("&")[0];
    localStorage.setItem("token", token);
    user.authenticated = true;
  }
  window.close();
}

export function ifLoggedIn(to, from, next) {
  if (checkAuth()) {
    next('/')
  } else {
    console.log('to login');
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
    console.log('esle');
    next()
  }
}

export function checkAuth() {
  let token = localStorage.getItem('token');
  user.authenticated = !!token;
  return !!token;
}
