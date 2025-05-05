import {useState,useEffect,useRef} from "react"
import Alert from "./Alert";
import axios from "axios";
import { Link } from "react-router-dom";
function Register(){
    const[user,setUser] = useState({username:'',password:'',confirmPassword:'',email:''});
    const handleUser = (e)=>setUser({...user,[e.target.name]:   e.target.value});
    const Ref = useRef(null);
    const[error,setError] = useState({type:null,mess:null});
    const handlesubmit = (e)=>{
        e.preventDefault();
        axios.post('http://localhost:8000/api/register/',user)
        .then(res=>{
            setError({ type: 'message', mess: 'Đăng ký thành công',timestamp:Date.now() })
        })
        .catch(err=>{
            setError({ type: 'error', mess: err.response.data.error,timestamp:Date.now() })
        }
        )

    }
    return(
        <div className="register">
            <div>
            <Alert error={error.mess} type={error.type} id={error.timestamp}></Alert>
            <h1>Register</h1>
            <form onSubmit={handlesubmit}>
            <div>
                <label htmlFor=""className="form-label">UserName</label>
                <input type="text" name="username" id="" className="form-control"onChange={handleUser}/>
            </div>
            <div>
                <label htmlFor=""className="form-label">Password</label>
                <input type="password" name="password" className="form-control" onChange={handleUser}/>
            </div>
            <div>
             <label htmlFor=""className="form-label">Comfirm Password</label>
                <input type="password" name="confirmPassword" className="form-control" onChange={handleUser}/>
            </div>
            <div>
                <label htmlFor=""className="form-label">Email</label>
                <input type="email" name="email" className="form-control" onChange={handleUser}/>
            </div>
            <button type="submit">
                Register
            </button>
            </form>
            <Link to='/'>Back to home</Link>
            </div>
        </div>
    )
}
export default Register