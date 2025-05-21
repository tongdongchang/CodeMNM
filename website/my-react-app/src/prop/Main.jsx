
import Footer from './Footer';
import Head from './Head';
import { useNavigate } from 'react-router-dom';
import {useState,useEffect,useContext} from 'react';
import { MusicContext } from './Home';
import axios from 'axios';
function Main(){
  const {setData, setType} = useContext(MusicContext)
  const  [audio,setAudio] = useState([])
  const [video,setVideo] = useState([])
  const [album,setAlbum] = useState([])

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // hoặc bao nhiêu tùy ý
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAudio = audio.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(
    ()=>{
      axios.get('http://127.0.0.1:8000/api/track/?category=audio')
        .then(res=>{
        setAudio(res.data)
        console.log(res.data)
        }).catch(err=>{
        console.log(err)
      });
      axios.get('http://127.0.0.1:8000/api/track/?category=video')
        .then(res=>{
        setVideo(res.data)
        }).catch(err=>{
        console.log(err)
      });
      axios.get('http://127.0.0.1:8000/api/albums/')
        .then(res=>{
        setAlbum(res.data)
        }).catch(err=>{
        console.log(err)
      });
    }
    ,[])
  const navigate = useNavigate();
  const handleAlbum = (key)=>{
    navigate(`/album?id=${key}`)
  }
  const handleVideo = (key)=>{
    navigate(`/video?id=${key}`)
    setType('video');
  }
  const handleAudio = (track)=>{
    setData(track)
    setType('audio');
  }
  const listAudio = currentAudio.map(au => (
    <div className='box1' key={au.id} onClick={() => handleAudio({ file: au.file, artists: au.artists, image_url: au.image_url, title: au.title })}>
      <img src={au.image_url} alt={`http://localhost:8000/${au.image_url}/`} />
      <p>{au.title}</p>
      <i className="fa-sharp fa-solid fa-circle-play"></i>
    </div>
  ));
  const listAlbum = album.map(al=>(
    <div className="Card" key={al.id} onClick={()=>handleAlbum(al.id)}>
    <img src={`${al.image_url}/`} alt="lõi" />
    <p className='card-title'>{al.title}</p>
    <p className='card-content'>{al.decription}</p>
    </div>
  ))
  const listVideo = video.map(av=>(
    <div className="Card" key={av.id} onClick={()=>handleVideo(av.id)}>
    <img src={av.image_url} alt="lõi" />
    <p className='card-title'>{av.title}</p>
    <p className='card-content'>{av.artists}</p>
    </div>
  ))
return(<>
<div className="main">
        <Head 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={audio.length}
          itemsPerPage={itemsPerPage}>
        </Head>
        <div className="Header">
            <h1>Recomend for you</h1>
        </div>
        <div className="upper-content">
          {listAudio}
        </div>
        <h2>Album for you</h2>
        <div className='card-container'>
           {listAlbum}
        </div>  
        <h2>Trending Videos</h2>
        <div className='card-container'>
          {listVideo}
        </div>
        <Footer></Footer>
    </div>
</>

)
}
export default Main