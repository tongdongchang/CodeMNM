import {useState,useRef,useEffect} from "react"
import { Link,useNavigate } from "react-router-dom";
import AnxiosInstance from "./GetToken";
function Head({ currentPage, setCurrentPage, totalItems, itemsPerPage }){
    const [open,setOpen] = useState(false)
    const dropdownRef = useRef(null); // Ref cho dropdown
    const userIconRef = useRef(null);
    const[profile,setProfile] = useState()
    const role = localStorage.getItem("user_role");
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
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_info');
    
      // Optional: xóa thông tin user nếu có lưu
      setProfile(null);  // nếu dùng context hoặc state
    
      // Chuyển hướng về trang login
      navigate('/login'); 
    };
return(
    <div className="nav-header">
        <div className="nav-header-icon">
        <div className="pagination">
        <i
          className={`fa-solid fa-angle-left ${currentPage === 1 ? 'hide' : ''}`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        ></i>

        <span style={{ margin: '0 10px' }}>Page {currentPage}</span>

        <i
          className={`fa-solid fa-angle-left fa-flip-horizontal ${currentPage * itemsPerPage >= totalItems ? 'hide' : ''}`}
          onClick={() => currentPage * itemsPerPage < totalItems && setCurrentPage(currentPage + 1)}
        ></i>
      </div>
        </div>
        <div className="nav-header-user">
        <button class="badge nav-items hide">Explore Premium</button>
        {profile?<img src={`http://127.0.0.1:8000/${profile.image_url}/`}ref={userIconRef} onClick={()=>setOpen(open=>open=true)} width={40} height={40}></img>:<i className="fa-regular fa-user nav-items" ref={userIconRef} onClick={()=>setOpen(open=>open=true)}></i>}
        {open&&(
    <ul className="dropdown" ref={dropdownRef}>
      <li>
        {profile ? <Link to="/profile">Profile</Link> : <Link to="/login">Login</Link>}
      </li>
      {profile && role === "admin" && (
        <li>
          <Link to="/admin">Trang quản trị</Link>
        </li>
      )}

      <li>
        {profile ? (
          <p onClick={handleLogout}>Log Out</p>
        ) : (
          <Link to="/register">Register</Link>
        )}
      </li>
    </ul>
        )}
        </div>
    </div>
)
}
export default Head