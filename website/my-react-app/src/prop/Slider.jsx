import { Link,useNavigate } from 'react-router-dom';
import img1 from '../assets/img6.jpg';
import AnxiosInstance from './GetToken';
import img2 from '../assets/musical-note.png';
import { useState,useEffect,useContext } from 'react';
import { MusicContext } from './Home';
function Slider(){
    const navigate = useNavigate();
    const [reload,setReload]=useState(false)
    const [audio,setAudio] = useState([])
    const {reloading} = useContext(MusicContext)
    useEffect(()=>{
        AnxiosInstance.get('playlist/')
        .then(res=>{setAudio(res.data);
        }
        )
        .catch(err=>console.log(err))
    },[reload,reloading])
    const handleAdd = ()=>{
        AnxiosInstance.post('playlist/', {
            title: 'My Playlist'
          }).then(()=>setReload(!reload))
          .catch(err=>console.log(err))
    }
    const ToPlaylist = (id)=>{
        navigate(`/Playlist?id=${id}`)
    };
    const listAudio = audio.map(res=>(  
    <div className="lib-box" onClick={()=>ToPlaylist(res.id)} key={res.id}>
        <div className="box">
            <img src={res.image_url?res.image_url:img2} alt="" />
            <h6>
  {res.title?.trim().toLowerCase() === 'my playlist' 
    ? `My Playlist#${res.id}` 
    : res.title}
</h6>
            <p>Playlist</p>
        </div>
    </div>))
return(
    <div className="slidebar">
        <div className="nav">
            <div className="nav-option">
                <Link to='/'><i class="fa-solid fa-house"></i>Home</Link>
            </div>
            <div className="nav-option">
                <Link to='/Search'><i class="fa-solid fa-magnifying-glass"></i>Search</Link>
            </div>
        </div>
        <div className="library">
            <div className="option">
             <div class="lib-option nav-option ">
                  <a href="#"><i class="fa-solid fa-list"></i>Your Library</a>
              </div>
              <div class="icons">
                <i class="fa-solid fa-plus" onClick={handleAdd}></i>
                <i class="fa-solid fa-arrow-left fa-flip-horizontal"></i>
                </div>
            </div>
            {listAudio}
        </div>
    </div>
)
}
export default Slider