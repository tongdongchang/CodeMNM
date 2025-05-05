import React,{useState} from "react"
function ViewDetail(){
    const [isPrenium,setIsPrenium] = useState("Free");
return(
    <div className="ManageUsers Track ViewDetail">
    <h1>Detail</h1>
    <div> 
        <div className="Track-Category">
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
            <input type="text" className="form-control" id="email" placeholder="Enter name" name="name" />
            </div>
            <div>
            <input type="file" accept="image/*"/>

            </div>
        </form>
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-info" data-bs-dismiss="modal">Add</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
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
            <input className="form-control" list="browsers" name="browser" id="browser" />
  <datalist id="browsers">
    <option value="Edge" />
    <option value="Firefox" />
    <option value="Chrome" />
    <option value="Opera" />
    <option value="Safari" />
  </datalist>
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
<th>Release date</th>
<th>URL</th>
<th colSpan="2">Action</th>
</tr>
</thead>
<tbody>
<tr>
<td>ABC</td>
<td>25/2/2025</td>
<td>25/2/2025</td>
<td>Delete</td>
<td>Edit</td>
</tr>
</tbody>
</table>
    </div>


</div>
)
}
export default ViewDetail