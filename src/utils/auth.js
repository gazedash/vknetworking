export default {
  login (email, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return
    }
    pretendRequest(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token;
        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  getToken () {
    return localStorage.token;
  },

  logout (to, from, next) {
    delete localStorage.token;
    this.onChange(false);
    next('/')
  },

  onChange () {
  },

  redirected(to, from, next) {
    if (to.hash) {
      // const userId = to.hash.split('user_id=')[1];
      const token = to.hash.split('access_token=')[1].split("&")[0];
      localStorage.setItem("token", token);
    }
    window.close();
  },

  requireAuth (to, from, next) {
    if (!isLoggedIn()) {
      console.log(!isLoggedIn());
      next({
        path: '/login',
        // query: {redirect: to.fullPath}
      })
    } else {
      console.log('esle');
      next()
    }
  },
}

export function isLoggedIn() {
  console.log('hui', localStorage.token);
  return !!localStorage.token
}

function pretendRequest(email, pass, cb) {
  setTimeout(() => {
    if (email === 'joe@example.com' && pass === 'password1') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      })
    } else {
      cb({authenticated: false})
    }
  }, 0)
}
