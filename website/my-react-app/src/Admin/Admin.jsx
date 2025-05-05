import SilderAdmin from "./SliderAdmin"
import Users from "./Users"
import Track from "./Track"
import Artists from "./Artists"
import Album from "./Album"
import ViewDetail from "./DetailAlbum"
import { Outlet } from "react-router-dom"
function Admin(){
    return(
        <div className="Admin"> 
            <SilderAdmin></SilderAdmin>
            <Outlet></Outlet>
        </div>
    )
}
export default Admin