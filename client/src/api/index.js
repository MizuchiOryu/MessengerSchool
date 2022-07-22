import axios from 'axios'

const URL = import.meta.env.VITE_API_URL

export function getFriendship(friendshipId){
  const headers = __headers(true)
  return axios.get(URL + '/friendships/' + friendshipId, { headers })
}

export function getMessages(friendshipId){
  const headers = __headers(true)
  return axios.get(URL + '/friendships/' + friendshipId + '/messages', { headers })
}

export function removeMessage(messageId){
  const headers = __headers(true)
  return axios.delete(URL + '/friendships/messages/' + messageId, { headers })
}

export function getFriends() {
  const headers = __headers(true)
  return axios.get(URL + '/friendships', { headers })
}

export function getPendingInvites() {
  const headers = __headers(true)
  return axios.get(URL + '/friendships/pending', { headers })
}

export function getInvites() {
  const headers = __headers(true)
  return axios.get(URL + '/friendships/invites', { headers })
}

export function sendFriendRequest(friendId){
  const headers =  __headers(true)
  return axios.post(URL + '/friendships', { friendId }, {headers})
}

export function acceptInvite(friendshipId){
  const headers =  __headers(true)
  return axios.put(URL + '/friendships/' + friendshipId, {}, {headers})
}

export function cancelInvite(friendId){
  const headers = __headers(true)
  return axios.delete(URL + '/friendships/invites/' + friendId, {headers})
}

export function deleteFriend(friendId){
  const headers = __headers(true)
  return axios.delete(URL + '/friendships/' + friendId, {headers})
}

export function __health(baseUrl) {
  return axios.get(baseUrl + '/health')
}

export function getAdminLogs() {
  const headers = __headers(true)
  return axios.get(URL + '/logs', { headers })
}

export function __headers(token = false) {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
  }
  return headers
}
