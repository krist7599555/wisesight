import axios from 'axios'
import ls from 'local-storage';

const CONFIG = require('../config');
const api = CONFIG.api;

const log = (x) => {console.log(x); return x;}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

function fetch_request(url, body) {
  console.log(url + ' ' + JSON.stringify(body))
  return axios.post(url, body, {
    // crossdomain: true,
    body,
    headers: {
      // "Content-Type": "application/x-www-form-urlencoded",
      // "Cache-Control": "no-cache"
    },
  })
}
// function get_fetch_request(url, body) {
//   console.log(url + ' ' + JSON.stringify(body))
//   return axios.get(url, {
//     params: body
//   })
// }
export function register({email, password}) {
  email = email.toLowerCase().trim();
  return fetch_request(api + '/register', {
    email,
    password
  })
}
export function login({email, password}) {
  email = email.toLowerCase().trim();
  return fetch_request(api + '/login', {
    email,
    password
  }).then((response) => {
    ls.set('token', response.data.token)
    ls.set('email', email)
    location.reload();
  })
}
export function logout() {
  ls.clear();
  location.reload();
}
export function _token() {
  return ls.get('token')
}
export function _auth() {
  return !!ls.get('token');
}
export function _email() {
  return ls.get('email')
}
export function resendMail({email}) {
  email = email.toLowerCase().trim();
  return fetch_request(api + '/resend-mail', {
    email
  })
}
export function forgotPassword({email}) {
  email = email.toLowerCase().trim();
  return fetch_request(api + '/forgot-password', {
    email
  })
}
export function resetPassword({token, password}) {
  return fetch_request(api + '/reset-password', {
    token,
    newPassword: password
  })
}
export function changePassword({token, password, newPassword}) {
  return fetch_request(api + '/change-password', {
    token, 
    password, 
    newPassword
  })
}
export function verifyToken({tokend}) {
  return fetch_request(api + '/verifyToken', {
    token
  })
}
