import img1 from '../assets/img1.jpg';
import vd1 from '../assets/Video/NuocMatCaSau.mp4'
import Head from './Head';
import axios from 'axios';
import { useSearchParams,useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
function PlayVideoMusic(){
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const [OriginVideo,setOriginVideo] = useState()
    const [MoreVideo,setMoreVideo] = useState()
    useEffect(() => {
        axios.get(`http://localhost:8000/api/track/?category=video&id=${id}`)
        .then(res=>{setOriginVideo(res.data)
            console.log(res.data)
        })
        .catch(err=>console.log(err))
        axios.get(`http://localhost:8000/api/track/?category=video`)
        .then(res=>{setMoreVideo(res.data)
        })
        .catch(err=>console.log(err))    
      }, [id]);
      const navigate = useNavigate()
      const handlleNavigate = (id)=>{
        navigate(`.?id=${id}`)
      }
      if (!OriginVideo || !MoreVideo) {return(<h1>Loading...</h1>)};
      const listVideo = MoreVideo.map((res,index)=>(
        <div className="Card" key={res.id} onClick={()=>handlleNavigate(res.id)}>
        <img src={res.image_url} alt="lõi" />
        <p className='card-title'>{res.title}</p>
        <p className='card-content'>{res.artists}</p>
        </div>
      ))
    return(
        <div className='PlayVideoMusic-All'>
        <div className="PlayVideoMusic">
        <Head></Head>
    <div className="PlayVideoMusic-Video">
        <video src={OriginVideo.file} width="100%"  controls autoPlay loop></video>
    </div>
    <div className="PlayVideoMusic-Info">
        <h1 className='PlayVideoMusic-H1'>Information</h1>
        <ul className='PlayVideoMusic-Info-Name'>
            <li>{OriginVideo.title}</li>
            <li>-</li>
           <li>{OriginVideo.artists}</li>
        </ul>
        <ul className='PlayVideoMusic-Info-Love'>
            <li>❤️ Love</li>
            <li>
            <a href={`http://localhost:8000/api/download-track/${OriginVideo.id}/`} download>
                ⬇️ Download
            </a>
            </li>
        </ul>
    </div>
    <div className="PlayVideoMusic-Description">
        <h1 className='PlayVideoMusic-H1'>Lyrics</h1>
        <p>{OriginVideo.lyrics}</p>
    </div>
    <div className="PlayVideoMusic-Description-Next">
        <h1 className='PlayVideoMusic-H1'>Next Video</h1>
        <div className='card-container card-container-extend'>
            {listVideo}
        </div>
    </div>
</div>   
        </div>
    )
}
export default PlayVideoMusic