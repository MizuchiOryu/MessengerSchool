import axios from 'axios'

export function getConversation(friendshipId){
  return new Promise((resolve) => 
    setTimeout(() => {
      resolve(
        {
          messages: []
        }
      )
    }, 1500)
  );
  // return axios.get()
}

export function __health(baseUrl) {
  return axios.get(baseUrl + '/health')
}
