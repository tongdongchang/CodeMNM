import axios from "axios";
import {useState,useRef,useEffect,useContext} from "react"
import Alert from "./Alert";
import img1 from '../assets/no-music.jpg';
import { Link,useNavigate } from "react-router-dom";
import AnxiosInstance from "./GetToken";
import { MusicContext } from "./Home";
function Head(){
    const [open,setOpen] = useState(false)
    const dropdownRef = useRef(null); // Ref cho dropdown
    const userIconRef = useRef(null);
    const useInputRef= useRef(null);
    const fileRef = useRef(null);
    const [file,setFile]= useState()
    const {setUser} = useContext(MusicContext);
    const[profile,setProfile] = useState()
    useEffect(()=>{
      AnxiosInstance.get('profile/')
      .then(res =>{
        console.log(res.data)
        setProfile(res.data);
        setUser(res.data);
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
    const handleFile = (e)=>{
      setFile(e.target.files[0])
      fileRef.current.src = URL.createObjectURL(e.target.files[0])
    }
    const handleEdit = ()=>{
      const formdata = new FormData()
      formdata.append('password',useInputRef.current.value)
      formdata.append('image_url',file)
      AnxiosInstance.post('EditProfile/',formdata,{headers:{'Content-Type':'multipart/form-data'}})
    }
return(
    <div className="nav-header">
        <div className="nav-header-icon">
        <i class="fa-solid fa-angle-left"></i>
        <i class="fa-solid fa-angle-left fa-flip-horizontal hide"></i>
        </div>
        <div className="nav-header-user">
          {profile?.is_premium?<button>Your are prenium</button>:<button class="badge nav-items hide" onClick={()=>navigate('/paypal')}>Explore Premium</button>}
        
        {profile?<img src={`http://127.0.0.1:8000/${profile.image_url}/`}ref={userIconRef} onClick={()=>setOpen(open=>open=true)} width={40} height={40}></img>:<i className="fa-regular fa-user nav-items" ref={userIconRef} onClick={()=>setOpen(open=>open=true)}></i>}
        {open&&(
    <ul class="dropdown" ref={dropdownRef} >
      <li>{profile?<Link data-bs-toggle="modal" data-bs-target="#myModal123">Profile</Link>:<Link to='/login'>Login</Link>}</li>
      <li>{profile?<p onClick={handleLogout}>Log Out</p>:<Link to='/Register'>Register</Link>}</li>
    </ul>
        )}
        </div>
        <div class="modal" id="myModal123">
  <div class="modal-dialog">
    <div class="modal-content">
  
      <div class="modal-header">
        <h4 class="modal-title">EditProfile</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
                <div>
                <input  type="file" style={{display:'none'}} onChange={handleFile}/>
                <img src={img1} width={200}height={200} ref={fileRef} onClick={()=>fileRef.current.click()} />
                    <div className='modal-body-name'>
                        <input type="password" className='form-control' ref={useInputRef}  placeholder='Change password'/>
                        <label className='form-label'>Password</label>
                    </div>
                </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleEdit}>Edit</button>
      </div>

    </div>
  </div>
</div>
    </div>
)
}
export default Head