import axios from 'axios'


export function getUser()
{
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }
  return axios.get(import.meta.env.VITE_API_URL + '/user', { headers })
}

export function createUser(email,firstName,lastName,isAdmin)
{
  const body = {email,firstName,lastName,isAdmin}
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }
  return axios.post(import.meta.env.VITE_API_URL + '/user',body, { headers })
}


export function bannedUser(id_user)
{
  const body = {id_user}
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + sessionStorage.getItem('token')
  }
  return axios.patch(import.meta.env.VITE_API_URL + '/user/banned',body, { headers })
}


