import img1 from '../assets/img1.jpg';
import img2 from '../assets/heart-line.png';
import img3 from '../assets/controls5.png';
import audio1 from '../assets/Audio/MatKetNoi-DuongDomic-16783113.mp3'
import {useState,useEffect,useRef,useContext} from 'react';
import {MusicContext} from './Home'
function MusicPlayer(){
   const [currentTime,setcurrentTime] = useState(0)
   const [maxTime,setmaxTime] = useState(0)
   const {data} =useContext(MusicContext);
   const [isPlay,setIsPlay] = useState(false)
   const audioRef = useRef(null)
   const progressRef = useRef(null)
   useEffect(
    ()=>{
        const audio = audioRef.current
        audio.addEventListener('loadedmetadata',()=>setmaxTime(audio.duration))
        audio.addEventListener('timeupdate',()=>{
            setcurrentTime(audio.currentTime)
            if(progressRef.current){
                progressRef.current.value = (audio.currentTime/audio.duration)*100
            }
        })
        audio.addEventListener('canplay',()=>{audio.play();setIsPlay(true)})
    }
    ,[])
    const handlePlay = ()=>{
        const audio = audioRef.current
        if(!audio) return
        if(!isPlay){
            audio.play()
        }else{
            audio.pause()
        }
        setIsPlay(!isPlay)
    }
    const handlesProgess= (e)=>{
        const audio = audioRef.current
        const seekTime = (e.target.value / 100) *maxTime
        audio.currentTime = seekTime;
        setcurrentTime(seekTime) 
    }
    const fomat = (time)=>{
        if (isNaN(time)) return "00:00";
        const minute = Math.floor(time/60)
        const second = Math.floor(time % 60 )
        return `${minute.toString().padStart(2,'0')}:${second.toString().padStart(2,'0')}`
    }
    const handleVolume = (e)=>{
        const audio= audioRef.current;
        audio.volume = parseFloat(e.target.value);
    }
return(<>
<div className="music-player">
            <div className="album">
                <img src={data.image_url} alt="No music" />
                <div className="name">
                    <h6>{data.title}</h6>
                    <p>{data.artists}</p>
                </div>
                <img src={img2} alt="" class="heart"></img>
            </div>
            <div className="Player">
                <div className="playercontrol">
                         <i class="fa-solid fa-backward-step "></i>
                         {isPlay ? <i class="fa-solid fa-pause run" onClick={handlePlay}></i>:<i class="fa-regular fa-circle-play run" onClick={handlePlay}></i>}
                
                <i class="fa-solid fa-forward-step"></i>
                </div>
           <div className="player-bar">
            <audio  ref={audioRef} src={data.file} onEnded={()=>setIsPlay(false)}></audio>
           <span class="curr-time">{fomat(currentTime)}</span>
           <input type="range" min="0" max="100" className="progress-bar" ref={progressRef} onChange={handlesProgess}/>
                <span class="tot-time">{fomat(maxTime)}</span>
           </div>
            </div>
            <div className="controller">
            <img src={img3} alt="" class="heart"></img>
            <input type="range" min="0" max="1"class="progress-bar1" step='0.1' onChange={handleVolume}></input>
            </div>
        </div>
</>)
}
export default MusicPlayer