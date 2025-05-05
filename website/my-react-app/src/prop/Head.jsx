import axios from "axios";
import {useState,useRef,useEffect} from "react"
import Alert from "./Alert";
import { Link,useNavigate } from "react-router-dom";
import AnxiosInstance from "./GetToken";
function Head(){
    const [open,setOpen] = useState(false)
    const dropdownRef = useRef(null); // Ref cho dropdown
    const userIconRef = useRef(null);
    const[profile,setProfile] = useState()
    useEffect(()=>{
      AnxiosInstance.get('profile/')
      .then(res =>{
        setProfile(res.data);
      })
      .catch(err => {
        console.error('Error:', err);
      });
        const handleOuside = (event)=>{
            if(   dropdownRef?.current &&
              userIconRef?.current && !dropdownRef.current.contains(event.target) && !userIconRef.current.contains(event.target)) setOpen(false)
        }
    document.addEventListener('click',handleOuside)
    return ()=> document.removeEventListener('click',handleOuside)
    },[])
    const navigate = useNavigate()
    const handleLogout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // hoặc: sessionStorage.clear();
    
      // Optional: xóa thông tin user nếu có lưu
      setProfile(null);  // nếu dùng context hoặc state
    
      // Chuyển hướng về trang login
      navigate('/login'); 
    };
return(
    <div className="nav-header">
        <div className="nav-header-icon">
        <i class="fa-solid fa-angle-left"></i>
        <i class="fa-solid fa-angle-left fa-flip-horizontal hide"></i>
        </div>
        <div className="nav-header-user">
        <button class="badge nav-items hide">Explore Premium</button>
        {profile?<img src={`http://127.0.0.1:8000/${profile.image_url}/`}ref={userIconRef} onClick={()=>setOpen(open=>open=true)} width={40} height={40}></img>:<i className="fa-regular fa-user nav-items" ref={userIconRef} onClick={()=>setOpen(open=>open=true)}></i>}
        {open&&(
    <ul class="dropdown" ref={dropdownRef} >
      <li>{profile?<Link>Profile</Link>:<Link to='/login'>Login</Link>}</li>
      <li>{profile?<p onClick={handleLogout}>Log Out</p>:<Link to='/Register'>Register</Link>}</li>
    </ul>
        )}
        </div>
    </div>
)
}
export default Head