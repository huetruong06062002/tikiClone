import axios from '../utils/axios-customize'

/* ===================== User ================================ */
export const callRegister = (fullName, email, password , phone) => {
  return axios.post('api/v1/user/register', {fullName, email, password , phone})
} 

export const callLogin = (username, password) => {
  return axios.post('api/v1/auth/login', 
  { username,
    password,    
    // delay: 5000
  })
}


export const callFetchAccount = () => {
  return axios.get('/api/v1/auth/account');
}

export const callLogout = (accessToken) => {
  return axios.post('/api/v1/auth/logout', {}, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
}

export const callFetchListUsers = (query) => {
  return axios.get(`/api/v1/user?${query}`);
}

export const callCreateAUser = (fullName, password, email , phone) => {
  return axios.post('/api/v1/user', {fullName, password, email , phone})
} 

export const callBulkCreateUser = (data) => {
  return axios.post('/api/v1/user/bulk-create',data)
}

export const callDeleteUser = (id) => {
  return axios.delete(`api/v1/user/${id}`)
}

export const callUpdateUser = (_id, fullName, phone) => {
  return axios.put('/api/v1/user', {_id, fullName, phone})
}


/* ===================== Book ================================ */
export const callFetchListBooks = (query) => {
  return axios.get(`/api/v1/book?${query}`);
}

export const callFetchCategory = () => {
  return axios.get(`/api/v1/database/category`);
}


export const callCreateBook = (thumbnail, slider, mainText, author, price, sold, quantity, category) => {
  return axios.post('/api/v1/book', {
    thumbnail, slider, mainText, author, price, sold, quantity, category
  })
}

export const callUpdateBook = (id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
  return axios.put(`api/v1/book/${id}`, {
    thumbnail, slider, mainText, author, price, sold, quantity, category
  })
}

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return axios({
  method: 'post',
  url: '/api/v1/file/upload',
  data: bodyFormData,
  headers: {
  "Content-Type": "multipart/form-data",
  "upload-type": "book"
  },
  });
}

export const callDeleteBook  = (id) => {
  return axios.delete(`/api/v1/book/${id}`)
}

export const callFetchBookById = (id) => {
  return axios.get(`/api/v1/book/${id}`)
}

/* ===========Order============== */

export const callPlaceOrder = (data) => {
  return axios.post('/api/v1/order', {...data} )
}


/* ===========History============== */

export const callHistory = () => {
  return axios.get('/api/v1/history')
}


/* =========== USER ================= */


export const callUpdateAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return axios({
    method: 'post',
    url: '/api/v1/file/upload',
    data: bodyFormData,
    headers: {
      "Content-Type" : "multipart/form-data",
      "upload-type": "avatar",
    },
  })
}

export const callUpdateUserInfo = (_id, phone, fullName, avatar) => {
  return axios.put(`/api/v1/user`, {
    _id, phone, fullName, avatar
  })
}

export const callUpdatePassword = (email, oldpass, newpass)=> {
  return axios.post(`/api/v1/user/change-password`, {
    email, oldpass, newpass
  })
}