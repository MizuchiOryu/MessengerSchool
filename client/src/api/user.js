import axios from 'axios'
import { __headers,URL } from "."

export function getUser()
{
  const headers = __headers(true)
  return axios.get(URL + '/user', { headers })
}

export function createUser(email,firstName,lastName,isAdmin)
{
  const body = {email,firstName,lastName,isAdmin}
  const headers = __headers(true)
  return axios.post(URL + '/user',body, { headers })
}


export function bannedUser(id_user)
{
  const body = {id_user}
  const headers = __headers(true)
  return axios.patch(URL + '/user/banned',body, { headers })
}


export function editProfile(firstName,lastName,bio){
  const headers = __headers(true)
  const body = { firstName,lastName,bio };
  return axios.patch(URL + '/user/edit',body, {headers})
}


export function addTag(tag){
  const headers = __headers(true)
  const body = { tag };
  return axios.post(URL + '/user/tags',body, {headers})
}

export function removeTag(tag){
  const headers = __headers(true)
  const body = { tag };
  return axios.delete(URL + '/user/tags',{data:body,headers} )
}

export function all_tags() {
  const headers = __headers(true)
  return axios.get(URL + '/user/tags', {headers})
}

export function randomTags(tag) {
  const headers = __headers(true)
  let url = `${URL}/user/recommend_tags`
  if(tag) url += `?tag=${tag}`
  return axios.get(url, {headers})
}
