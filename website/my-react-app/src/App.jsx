
import Home from './prop/Home';
import Main from './prop/Main';
import SilderAdmin from './Admin/SliderAdmin';
import Admin from './Admin/Admin';
import Register from './prop/Register'
import PlayList from './prop/PlayList';
import PlayVideoMusic from './prop/PlayVideoMusic';
import Search from './prop/Search';
import UserPlaylist from './prop/UserPlaylist';
import Users from "./Admin/Users"
import Track from "./Admin/Track"
import Artists from "./Admin/Artists"
import Album from "./Admin/Album"
import ViewDetail from './Admin/DetailAlbum';
import Login from './prop/Login';
import PayPal from './prop/paypal';
import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
function App() {
  return (
  <Routes>
    <Route path='/'element={<Home></Home>}>
    <Route index element={<Main></Main>}></Route>
    <Route path='/album' element={<PlayList></PlayList>}></Route>
    <Route path='/video' element={<PlayVideoMusic></PlayVideoMusic>}></Route>
    <Route path='/paypal' element={<PayPal></PayPal>}></Route>
    <Route path='/search' element={<Search></Search>}></Route>
    <Route path='/playlist' element={<UserPlaylist></UserPlaylist>}></Route>
    </Route>
    <Route path='/admin' element={<Admin></Admin>}>
    <Route index element={<Users></Users>}></Route>
    <Route path='users' element={<Users></Users>}></Route>
    <Route path='track' element={<Track></Track>}></Route>
    <Route path='artists' element={<Artists></Artists>}></Route>
    <Route path='album' element={<Album></Album>}></Route>
    <Route path='viewdetailalbum' element={<ViewDetail></ViewDetail>}></Route>
    </Route>
    <Route path='/login' element={<Login></Login>}></Route>
  <Route path='/register' element={<Register></Register>}></Route>
  </Routes>
  );
}

export default App;