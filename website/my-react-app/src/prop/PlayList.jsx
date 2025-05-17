import img1 from '../assets/img2.jpg'
import Head from './Head'
import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect,useState,useRef,useContext } from 'react';
import axios from "axios";
import {MusicContext} from './Home'

function PlayList(){
    const [searchParams] = useSearchParams(); 
    const id = searchParams.get('id');
    const {setData,user} = useContext(MusicContext);
    const [album,setAlbum]=useState();
    const [currentId,setCurrentId] = useState();
    useEffect(()=>{
        axios.get('http://localhost:8000/api/trackalbum/', {
            params: { id: id }
          }
        ).then(res=>{setAlbum(res.data)
        console.log(res.data)}
    )
        .catch(err=>console.log(err))
    },[])
    if (!album) return (<h1>Loading...</h1>)
    const listTrack=album.track_set.map((res,index)=>(<tr key={res.id} onClick={()=>{
        if(!res.is_Prenium ||(res.is_Prenium&&user.is_premium)){
        setData({title:res.title,artists:album.artists,image_url:res.image_url,file:res.file}) 
       setCurrentId(res.id)
        }

    }
    } className={currentId==res.id ? 'HasChecked':''}>
        <td>{index+1}</td>
        <td>{res.title}</td>
        <td>{res.release_date}</td>
        <td>{res.is_Prenium?'Yes':'No'}</td>
        <td>{res.duration}</td>
        </tr>))
    return(
        <div className='PlayAll'>
             <div className='play'>
                <Head></Head>
<div className='nav-play'>
<img src={album.image_url} alt="" />
<div className='nav-title'>
    <p>Album</p>
    <h1>{album.title}</h1>
    <p>{album.decription}</p>
    <p>{album.artists}</p>
</div>
</div>
<table>
<thead>
<tr>
<th>#</th>
<th>Title</th>
<th>Date Added</th>
<th>Prenium</th>
<th>Time</th>
</tr>
</thead>
<tbody>
    {listTrack}
</tbody>
</table>
</div>
        </div>
    )
   
}
export default PlayList