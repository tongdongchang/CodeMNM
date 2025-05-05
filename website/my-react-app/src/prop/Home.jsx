import Slider from "./Slider"
import MusicPlayer from "./MusicPlayer"
import { Routes, Route, Link,Outlet } from 'react-router-dom';
import { createContext, useContext,useState,useRef } from "react";
export const MusicContext = createContext();
function Home(){
  const [data,setData]=useState({})
  const [reloading,setReload]=useState(false)
return(
    <div className="container">
      <MusicContext.Provider value={{data,setData,reloading,setReload}}> 
      <Slider></Slider>
            <Outlet></Outlet>
    <MusicPlayer></MusicPlayer>
      </MusicContext.Provider>
    </div>

)
}
export default Home