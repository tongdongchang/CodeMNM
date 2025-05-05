import pic from './assets/pic.jpg'
function Card(){
    return(
        <div className='Card'>
            <img src={pic} alt="" />
            <h2>Bro Code</h2>
            <p>you can have a browser window within vs code. Copy the localhost URL, open command palette</p>
        </div>
    )
}
export default Card