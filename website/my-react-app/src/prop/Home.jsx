import Slider from "./Slider"
import MusicPlayer from "./MusicPlayer"
import {Outlet } from 'react-router-dom';
import { createContext,useState } from "react";
export const MusicContext = createContext();
function Home(){
  const [data,setData]=useState({})
  const [reloading,setReload]=useState(false)
  const [type, setType] = useState('');
return(
    <div className="container">
      <MusicContext.Provider value={{data,setData,reloading,setReload,type, setType}}> 
        <Slider></Slider>
        <Outlet></Outlet>
        <MusicPlayer></MusicPlayer>
      </MusicContext.Provider>
    </div>

)
}
export default Home