import { useNavigate } from "react-router-dom"
function Album(){
  const navigate = useNavigate()
    return(
        <div className="ManageUsers Artists Album">
        <h1>Album</h1>
        <div>
            <div className="Album-Category">
            <h3>Category</h3>
<select class="form-select" >
  <option>Prenium</option>
  <option>Free</option>
</select>
            </div>
<label htmlFor="browser" className="form-label">Search Album:</label>
<div className="d-flex">
<div>
      <input className="form-control" list="browsers" name="browser" id="browser" />
<datalist id="browsers">
<option value="Edge" />
<option value="Firefox" />
<option value="Chrome" />
<option value="Opera" />
<option value="Safari" />
</datalist>
</div>
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
Ad New
</button>


<div class="modal" id="myModal">
<div class="modal-dialog">
<div class="modal-content">


  <div class="modal-header">
    <h4 class="modal-title">Ad New</h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
  </div>

 
  <div class="modal-body">
    <form action="">
    <div>
        <label  className="form-label">Name</label>
        <input type="text" className="form-control" id="email" placeholder="Enter name" name="name" />
        </div>
          <div>
            <label className="form-label">Select Artist</label>
            <select className="form-select">
  <option>John</option>
  <option>Taylor</option>
</select>
            </div>
            <div>
            <label className="form-label">Select Category</label>
            <select className="form-select">
  <option>Prenium</option>
  <option>Free</option>
</select>
            </div>
    </form>
  </div>


  <div class="modal-footer">
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
  </div>

</div>
</div>
</div>
</div>
</div>

        <div className="scroll-table">
          <table className="table table-striped table-bordered table-hover">
<thead>
<tr>
  <th>Name</th>
  <th>Artist</th>
  <th>Total song</th>
  <th>Category</th>
  <th>Action</th>
</tr>
</thead>
<tbody>
<tr>
  <td>ABC</td>
  <td>John</td>
  <td>2</td>
  <td>Prenium</td>
  <td onClick={()=>navigate('/admin/viewdetailalbum')}>View detail</td>
</tr>
</tbody>
</table>
        </div>


    </div>
    )
}
export default Album