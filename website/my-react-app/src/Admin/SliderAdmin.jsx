
import img1 from '../assets/album.jpg';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from "react";
function SilderAdmin(){
    const navigate = useNavigate()
    const [user, setUser] = useState({ username: "", email: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user_info");
        if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser({ username: parsedUser.username, email: parsedUser.email });
        }
    }, []);
    return(
        <div className='SliderAdmin'>
            <div className="Avartar">
                <img src={user.image_url} alt="Avatar" width={150} height={150} />
                <h5>{user.username}</h5>
                <p>{user.email}</p>
            </div>
            <div className="Manage">
            <div className="Dashboard">
                <p>📊 Dashboard</p>
            </div>
            <div className="Users" onClick={()=>navigate('/admin/users')}>
                <p>👤 Users</p>
            </div>
            <div className="Tracks"onClick={()=>navigate('/admin/track')}>
                <p>🎵 Tracks</p>
            </div>
            <div className="Albums"onClick={()=>navigate('/admin/albums')}>
            <p>💽 Albums</p>
            </div>
            <div className="Artists"onClick={()=>navigate('/admin/artists')}>
            <p>🧑‍🎤 Artists</p>
            </div>
            <div className="LogOut" onClick={()=>navigate('/login')}>
            <p>⬅️ Log Out</p>
            </div>
        </div>
        </div>
    )
}
export default SilderAdmin