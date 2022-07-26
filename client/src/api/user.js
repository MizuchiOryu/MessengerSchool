import { __headers,URL } from "."
import axios from 'axios'


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