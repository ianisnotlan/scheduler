import axios from 'axios'

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
axios.defaults.xsrfCookieName = 'csrftoken'

export async function getUserProfile() {
  const resp = await axios.get('/api/user-profile/')
  return resp.data
}

export async function updateProfile(id, username, email, photo, birthday) {
  const resp = await axios.patch(`/api/user-profile/${id}/`, {
    username,
    email,
    photo,
    birthday,
  })
  return resp.data
}

export async function getUserList() {
  const resp = await axios.get('/api/user/')
  return resp.data
}

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

export async function getEvents(year, month, day) {
  const resp = await axios.get('/api/event/', { params: { year, month, day } })
  return resp.data
}

export async function newEvent(
  title,
  start_datetime,
  end_datetime,
  creator,
  shared_users
) {
  const resp = await axios.post('/api/event/', {
    title,
    start_datetime,
    end_datetime,
    creator,
    shared_users,
  })
  return resp.data
}

export async function updateEvent(
  id,
  title,
  start_datetime,
  end_datetime,
  creator,
  shared_users
) {
  const resp = await axios.patch(`/api/event/${id}/`, {
    title,
    start_datetime,
    end_datetime,
    creator,
    shared_users,
  })
  return resp.data
}

export async function deleteEvent(id) {
  const resp = await axios.delete(`/api/event/${id}/`)
  return resp.data
}
