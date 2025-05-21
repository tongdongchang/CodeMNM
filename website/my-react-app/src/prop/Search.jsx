import Head from './Head';
import img1 from '../assets/img1.jpg';
import Footer from './Footer';
import { useState,useEffect,useContext } from 'react';
import AnxiosInstance from './GetToken';
import { MusicContext } from './Home';
import { useNavigate } from 'react-router-dom';
function Search(){
  const [audio,setAudio] = useState()
  const [video,setVideo] = useState()
  const [album,setAlbum] = useState()
  const {setData} = useContext(MusicContext)

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      setAudio([]);
      setVideo([]);
      setAlbum([]);
      return;
    }

    AnxiosInstance.get('searchFull', {
      params: {
        title: value
      }
    })
      .then(res => {
        setAudio(res.data.audio);
        setVideo(res.data.video);
        setAlbum(res.data.album);
      })
      .catch(err => console.log(err));
  };
  const navigate = useNavigate()
  const handleNavigateVideo = (id)=>{
    navigate(`/video?id=${id}`)
  }
  const handleNavigateAlbum = (id)=>{
    navigate(`/album?id=${id}`)
  }
  const listAudio =audio? audio.map((res)=>(
    <div className="box1" onClick={()=>setData({image_url:res.image_url,file:res.file,title:res.title,artists:res.artists})}>
    <img src={res.image_url} alt="lõi" />
    <p>{res.title}</p>
    <i class="fa-sharp fa-solid fa-circle-play"></i>
  </div>
  )):null
  const listVideo =video? video.map((res)=>(
    <div className="Card" onClick={()=>handleNavigateVideo(res.id)}>
    <img src={res.image_url} alt="lõi" />
    <p className='card-title'>{res.title}</p>
    <p className='card-content'>{res.artists}</p>
    </div>
  )):null
  const listAlbum =album? album.map((res)=>(
    <div className="Card" onClick={()=>handleNavigateAlbum(res.id)}>
    <img src={res.image_url} alt="lõi" />
    <p className='card-title'>{res.title}</p>
    <p className='card-content'>{res.decription}</p>
    </div>
  )):null
    return(
        <div className="main">
            <Head></Head> 
            <div>
              <h1>Search:</h1>
              <div className='UserPlaylistFind-Find'>
                <input type="text" placeholder='Search for songs' onChange={(e)=>handleSearch(e)}/>
                <span>🔍</span>
                <span>❌</span>
            </div>
            </div>
            <div className="Header">
            <h1>Result Audio</h1>
        </div>
        <div className="upper-content">
          {listAudio}
        </div>
        <div className="Header">
            <h1>Result Album</h1>
        </div>
        <div className="card-container">
          {listAlbum}
        </div>
        <div className="Header">
            <h1>Result Video</h1>
        </div>
        <div className="card-container">
          {listVideo}
        </div>
        <Footer></Footer>
        </div>
    )
}
export default Search