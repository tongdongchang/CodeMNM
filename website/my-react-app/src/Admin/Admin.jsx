import SilderAdmin from "./SliderAdmin"
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