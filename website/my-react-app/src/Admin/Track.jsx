import {useState,useEffect,useRef} from "react"
import AnxiosInstance from "../prop/GetToken";
function Track(){
    const [isPrenium,setIsPrenium] = useState("Free");
    const name = useRef()
    const album = useRef()
    const category = useRef()
    const file = useRef()
    const artists = useRef()
    const handleSubmit = ()=>{
      const formdata = new FormData()
      formdata.append('title',name.current.value)
      formdata.append('album','')
      formdata.append('artists',artists.current.value)
      formdata.append('category',category.current.value)
      formdata.append('file',file.current.files[0])
      AnxiosInstance.post('TrackChanging/',formdata,{
        headers:{
          "Content-Type":'multipart/form-data'
        }
      }).then(res=>console.log(res.data))
      .catch(res=>console.log(res))
    }
return(
    <div className="ManageUsers Track">
    <h1>Track</h1>
    <div>
        <h3>Category</h3>
        <div className="Track-Category">
                    <select class="form-select">
  <option>Audio</option>
  <option>Video</option>
</select>
<select class="form-select">
  <option>Prenium</option>
  <option>Free</option>
</select>
<div class="modal" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Add New</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form action="" className="formADD">
            <div>
            <label  className="form-label">Name:</label>
            <input type="text" ref={name} className="form-control" id="email" placeholder="Enter name" name="name" />
            </div>
            <div>
            <label className="form-label" >Select Artist</label>
            <select ref={artists} className="form-select">
  <option>John</option>
  <option>Jack</option>
  <option>None</option>
</select>
            <label className="form-label" >Select Album</label>
            <select className="form-select" ref={album}>
  <option>John</option>
  <option>Jack</option>
  <option>None</option>
</select>
            </div>
            <div>
            <label className="form-label">Select Category</label>
            <select ref={category} className="form-select">
  <option value='video'>Video</option>
  <option value='audio'>Audio</option>
</select>
            </div>
            <div>
            <label className="form-label">Is Prenium?</label>
            <div className="form-checking">
                            <div class="form-check" >
  <input type="radio" class="form-check-input" id="radio1" name="optradio" value="Prenium" checked={isPrenium==='Prenium'} onClick={(e)=>setIsPrenium(e.target.value)}/>
  <label class="form-check-label" for="radio1">Prenium</label>
</div>
<div class="form-check">
  <input type="radio" class="form-check-input" id="radio2" name="optradio" value="Free" checked={isPrenium==='Free'} onClick={(e)=>setIsPrenium(e.target.value)} />
  <label class="form-check-label" for="radio2">Free</label>
</div>
            </div>
            </div>
            <div>
            <input type="file" ref={file}/>

            </div>
        </form>
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-info" onClick={handleSubmit}>Add</button>
      </div>
    </div>
  </div>
</div>
        </div>

    </div>
    <div>
    <label htmlFor="browser" className="form-label">Search:</label>
    <div className="d-flex">
      <div>
            <input className="form-control" type="search" name="browser"  />
      </div>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
  Add New
</button>
    </div>

    </div>

    <div className="scroll-table">
      <table className="table table-striped table-bordered table-hover">
<thead>
<tr>
<th>Name</th>
<th>Artistis</th>
<th>Release date</th>
<th>URL</th>
<th colSpan="2">Action</th>
</tr>
</thead>
<tbody>
<tr>
<td>ABC</td>
<td>Eddie</td>
<td>25/2/2025</td>
<td>1234</td>
<td>Delete</td>
<td>Edit</td>
</tr>
</tbody>
</table>
    </div>
</div>
)
}
export default Track