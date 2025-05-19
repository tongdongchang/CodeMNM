import axios from "axios";
import {useState, useRef, useEffect, useContext} from "react"
import Alert from "./Alert";
import img1 from '../assets/no-music.jpg';
import { Link, useNavigate } from "react-router-dom";
import AnxiosInstance from "./GetToken";
import { MusicContext } from "./Home";

function Head(){
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null); // Ref cho dropdown
    const userIconRef = useRef(null);
    const useInputRef = useRef(null);
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState({ type: null, mess: null, timestamp: null });
    const {setUser} = useContext(MusicContext);
    const [profile, setProfile] = useState(null);
    
    useEffect(() => {
      AnxiosInstance.get('profile/')
        .then(res => {
          console.log(res.data);
          setProfile(res.data);
          setUser(res.data);
        })
        .catch(err => {
          console.error('Error:', err);
        });
        
      const handleOutside = (event) => {
        if (dropdownRef?.current && 
            userIconRef?.current && 
            !dropdownRef.current.contains(event.target) && 
            !userIconRef.current.contains(event.target)) {
          setOpen(false);
        }
      }
      
      document.addEventListener('click', handleOutside);
      return () => document.removeEventListener('click', handleOutside);
    }, []);
    
    const navigate = useNavigate();
    
    const handleLogout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Optional: xóa thông tin user nếu có lưu
      setProfile(null);
      setUser(null);
    
      // Chuyển hướng về trang login
      navigate('/login'); 
    };
    
    const handleFile = (e) => {
      if (!e.target.files || !e.target.files[0]) return;
      
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Tạo URL cho preview ảnh
      if (fileRef.current) {
        fileRef.current.src = URL.createObjectURL(selectedFile);
      }
    }
    
    const handleEdit = () => {
      if (!file && !useInputRef.current.value) {
        setError({
          type: "error",
          mess: "Vui lòng nhập mật khẩu hoặc chọn ảnh để thay đổi",
          timestamp: Date.now()
        });
        return;
      }
      
      const formData = new FormData();
      
      if (useInputRef.current.value) {
        formData.append('password', useInputRef.current.value);
      }
      
      if (file) {
        formData.append('image_url', file);
      }
      
      AnxiosInstance.post('EditProfile/', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
        .then(res => {
          setError({
            type: "message",
            mess: res.data.message || "Cập nhật thành công",
            timestamp: Date.now()
          });
          
          // Refresh profile data
          return AnxiosInstance.get('profile/');
        })
        .then(res => {
          setProfile(res.data);
          setUser(res.data);
          
          // Reset form
          if (useInputRef.current) {
            useInputRef.current.value = '';
          }
          setFile(null);
        })
        .catch(err => {
          setError({
            type: "error",
            mess: err.response?.data?.error || "Lỗi khi cập nhật",
            timestamp: Date.now()
          });
        });
    }
    
    // Function to get full image URL
    const getImageUrl = (imageUrlPath) => {
      if (!imageUrlPath) return img1;
      
      if (imageUrlPath.startsWith('http')) {
        return imageUrlPath;
      }
      
      return `http://localhost:8000${imageUrlPath.startsWith('/') ? '' : '/'}${imageUrlPath}`;
    }

    return(
        <div className="nav-header">
            <Alert error={error.mess} type={error.type} id={error.timestamp} />
            
            <div className="nav-header-icon">
              <i className="fa-solid fa-angle-left"></i>
              <i className="fa-solid fa-angle-left fa-flip-horizontal hide"></i>
            </div>
            
            <div className="nav-header-user">
              {profile?.is_premium
                ? <button>You are premium</button>
                : <button className="badge nav-items hide" onClick={() => navigate('/paypal')}>Explore Premium</button>
              }
            
              {profile 
                ? <img 
                    src={getImageUrl(profile.image_url)} 
                    ref={userIconRef} 
                    onClick={() => setOpen(true)} 
                    width={40} 
                    height={40} 
                    alt="Avatar"
                  />
                : <i className="fa-regular fa-user nav-items" ref={userIconRef} onClick={() => setOpen(true)}></i>
              }
              
              {open && (
                <ul className="dropdown" ref={dropdownRef}>
                  <li>
                    {profile 
                      ? <Link to="/profile">Profile</Link> 
                      : <Link to='/login'>Login</Link>
                    }
                  </li>
                  <li>
                    {profile 
                      ? <p onClick={handleLogout}>Log Out</p> 
                      : <Link to='/Register'>Register</Link>
                    }
                  </li>
                </ul>
              )}
            </div>
            
            <div className="modal" id="myModal123">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Edit Profile</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  
                  <div className="modal-body">
                    <div>
                      <input 
                        type="file" 
                        style={{display: 'none'}} 
                        onChange={handleFile} 
                        accept="image/*"
                      />
                      <img 
                        src={profile?.image_url ? getImageUrl(profile.image_url) : img1} 
                        width={200}
                        height={200} 
                        ref={fileRef} 
                        onClick={() => fileRef.current.click()} 
                        style={{cursor: 'pointer', borderRadius: '50%'}}
                        alt="Profile"
                      />
                      <div className='modal-body-name'>
                        <input 
                          type="password" 
                          className='form-control' 
                          ref={useInputRef}  
                          placeholder='Change password'
                        />
                        <label className='form-label'>Password</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      data-bs-dismiss="modal" 
                      onClick={handleEdit}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
}

export default Head;