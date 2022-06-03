import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
axios.defaults.xsrfCookieName = 'csrftoken'

export async function getUser() {
  const resp = await axios.get('/api/user/me/')
  return resp.data
}

export async function signUp(username, password, email) {
  const resp = await axios.post('/api/user/signup/', {
    username,
    password,
    email,
  })
  return resp.data
}

export async function logIn(username, password) {
  const resp = await axios.post('/api/user/login/', { username, password })
  return resp.data
}

export async function logOut() {
  const resp = await axios.post('/api/user/logout/')
  return resp.data
}

export async function update(id) {
  const resp = await axios.patch(`/api/user/${id}/`, {
    first_name: 'test',
    password: 'try',
  })
  return resp.data
}
