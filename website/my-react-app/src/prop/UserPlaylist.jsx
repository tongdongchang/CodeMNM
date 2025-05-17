import img1 from '../assets/no-music.jpg';
import img2 from '../assets/play-button.png';
import img3 from '../assets/img3.jpg';
import Footer from './Footer';
import Head from './Head';
import img4 from '../assets/musical-note.png';
import { useState,useEffect,useContext,useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnxiosInstance from './GetToken';
import { MusicContext } from './Home';
import Alert from './Alert';
import { use } from 'react';
function UserPlaylist(){
    const [SearchParams] = useSearchParams()
    const params = SearchParams.get('id')
    const {setData,setReload,reloading} = useContext(MusicContext)
    const [track,setTrack] = useState()
    const SearchRef = useRef(null)
    const inputRef = useRef(null)
    const imgRef = useRef(null)
    const [idCheck,setIdCheck] = useState()
    const [trackSearch,setTrackSearch] = useState()
    const[error,setError] = useState({type:null,mess:null});
    const [SearchState,setSearchState] = useState('')
    const fileRef = useRef(null)
    const [file,setFile] = useState()
    useEffect(()=>{
        if(!params) return
        AnxiosInstance.get(`playlist`,{
            params:{id: params}
        }).then(res=>{setTrack(res.data)
        console.log(res.data)
        console.log(params)    
    })
        .catch(err=>console.log(err))
    },[params,error,reloading])

    const listAudio = track?track.song.map((res)=>(
        <tr key={res.id} className={idCheck==res.id?'HasChecked':null} onClick={()=>{setData({image_url:res.image_url,file:res.file,title:res.title,artists:res.artists})
        setIdCheck(res.id)
        }}>
        <td>
            <div className='UserPlaylist-title'>
                <img src={res.image_url} alt="Error"/>
                    <p>{res.title}</p>
                    <p>{res.artists}</p>
            </div>
        </td>
        <td>
            <p>{res.album}</p>
        </td>
        <td><p>{res.duration}</p></td>
    </tr>  
    )):null
    const handleOnchange = (e)=>{
        const title = e.target.value
        console.log(title)
        AnxiosInstance.get('search',{
            params:{
                title: title,
                category: 'audio',
            }
        }).then(res=>{setTrackSearch(res.data); 
        console.log(res.data)})
        .catch(err=>console.log(err))
        setSearchState(title)
    }
    const handleClose = ()=>{
        setSearchState('')
        SearchRef.current.focus()
    }
    const handleAdd = (id)=>{
        AnxiosInstance.post('addtracktoplaylist/',{id:id,playlistid:params})
        .then(res=>setError({type:'message',mess:'Add success',timestamp:Date.now()}))
        .catch(err=>setError({type:'error',mess:err.response.data.error,timestamp:Date.now()}))
    }
    const listSearchTrack =trackSearch? trackSearch.map((res)=>(
        <div className='UserPlaylistFind-content'>
        <div className='UserPlaylist-title'>
         <img src={res.image_url} alt="Error" />
            <p>{res.title}</p>
            <p>{res.artists}</p>
        </div>
        <p>{res.album}</p>
        <button onClick={()=>handleAdd(res.id)}>Add</button>
    </div>
    )):null
    const handleFile = (e)=> {
    const tempUrl = e.target.files[0]
    setFile(tempUrl)
    imgRef.current.src = URL.createObjectURL(tempUrl)
    }
    const handleEdit =()=>{  
        const formData = new FormData()
        formData.append('id',params)
        formData.append('title',inputRef.current.value)
        formData.append('image_url',file)     
        AnxiosInstance.post('EditPlaylist/',formData,{headers:{'Content-Type':'multipart/form-data'}})
        .then(res=>{setReload(reload=>!reload)
            console.log(file)
            })
        .catch(err =>console.log(err))
      }
    if (!track) return (<h1>Loading...</h1>)
return(
    <div className='UserPlaylist'>
        <div className='UserPlaylist-head'>
        <Alert error={error.mess} type={error.type} id={error.timestamp}></Alert>
                    <Head></Head>
        <div className='UserPlaylist-info' data-bs-toggle="modal" data-bs-target="#myModal">
            <div>
                <img src={track.image_url?track.image_url:img1} alt="error" width={200} height={200} />
                <div>
                    <p>Public Playlist</p>
                    <h1>{track.title?.trim().toLowerCase()==='my playlist'?`My Playlist#${track.id}`:track.title}</h1>
                    <p>{track.users}</p>
                </div>
            </div>
        </div>
        </div>
        <div class="modal" id="myModal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h4 className="modal-title">Edit detail</h4>
        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div className="modal-body">
        <div>
        <input ref={fileRef} type="file" style={{display:'none'}} onChange={(e)=>handleFile(e)}/>
        <img ref={imgRef} src={track.image_url ? track.image_url : img1} alt="error" width={200} height={200} onClick={()=>fileRef.current.click()} />
            <div className='modal-body-name'>
                <input type="text" className='form-control' ref={inputRef} placeholder='Add a name'/>
                <label className='form-label'>Name</label>
            </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleEdit}>Add</button>
      </div>
    </div>
  </div>
</div>
        <div className='UserPlaylist-list'>
            <img src={img2} alt="error" width={50} height={50}/>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Album</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {listAudio}
                </tbody>
            </table>
        </div>
            
        <div className='UserPlaylistFind'>
        <div className="Line"></div>
            <h3>Let's find something for your playlist</h3>
            <div className='UserPlaylistFind-Find'>
                <input type="text" placeholder='Search for songs' value={SearchState} ref={SearchRef} onChange={(e)=>handleOnchange(e)} />
                <span>🔍</span>
                <span onClick={handleClose}>❌</span>
            </div>
            <div>
                {listSearchTrack}
            </div>
        </div>
        <Footer></Footer>
    </div>
)
}
export default UserPlaylist