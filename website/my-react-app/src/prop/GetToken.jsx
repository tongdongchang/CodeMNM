import axios from "axios";
const AnxiosInstance= axios.create({
    baseURL: 'http://localhost:8000/api/',
}
);
AnxiosInstance.interceptors.request.use(
    config=>{
        const accessToken = localStorage.getItem('access_token');
        if(accessToken){
            config.headers['Authorization']=`Bearer ${accessToken}`
        }
        return config;
    },
    err => Promise.reject(err)
)
AnxiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const res = await axios.post(`http://localhost:8000/api/token/refresh/`, {
            refresh: localStorage.getItem('refresh_token')
          });
  
          const newToken = res.data.access; // thường là "access", không phải "accessToken"
          localStorage.setItem('access_token', newToken);
  
          // Gán lại header Authorization
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }
  
      return Promise.reject(error);
    }
  );
export default AnxiosInstance;