import { useState,useEffect,useRef } from "react"
import Alert from "./Alert"
import { Link,useNavigate } from "react-router-dom"
import axios from "axios";
function Login(){
    const[user,setUser] = useState({username:'',password:''});
    const handleUser = (e)=>setUser({...user,[e.target.name]:   e.target.value});
    const Ref = useRef(null);
    const[error,setError] = useState({type:null,mess:null});
    const navigate = useNavigate()
    const handlesubmit = (e)=>{
        e.preventDefault();
        axios.post('http://localhost:8000/api/token/',user)
        .then(res=>{
            localStorage.setItem('access_token',res.data.access)
            localStorage.setItem('refresh_token',res.data.refresh)
            console.log(user)
            setError({ type: 'message',mess:'Login success',timestamp:Date.now() })
            navigate('/')
        })
        .catch(err=>{
            setError({ type: 'error', mess: err.response.data.detail,timestamp:Date.now() })
        }
        )
    }
    return(
        <div className="register">
            <div>
            <Alert error={error.mess} type={error.type} id={error.timestamp}></Alert>
            <h1>Login</h1>
            <form onSubmit={handlesubmit}>
            <div>
                <label htmlFor=""className="form-label">UserName</label>
                <input type="text" name="username" id="" className="form-control"onChange={handleUser}/>
            </div>
            <div>
                <label htmlFor=""className="form-label">Password</label>
                <input type="password" name="password" className="form-control" onChange={handleUser}/>
            </div>
            <button type="submit">
                Login
            </button>
            </form>
            <Link to='/'>Back to home</Link>
            </div>
        </div>
    )
}
export default Login