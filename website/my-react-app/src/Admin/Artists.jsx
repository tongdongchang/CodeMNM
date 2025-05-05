function Artists(){
return(
    <div className="ManageUsers Artists">
            <h1>Artists</h1>
            <div>
  <label htmlFor="browser" className="form-label">Search Artists:</label>
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
            <label  className="form-label">Name:</label>
            <input type="text" className="form-control" id="email" placeholder="Enter name" name="name" />
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
      <th>Total Album</th>
      <th>Total song</th>
      <th colSpan="2">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ABC</td>
      <td>ABC@gmail.com</td>
      <td>Yes</td>
      <td>Delete</td>
      <td>Edit</td>
    </tr>
    <tr>
      <td>ABC</td>
      <td>ABC@gmail.com</td>
      <td>Yes</td>
      <td>Delete</td>
      <td>Edit</td>
    </tr>
       <tr>
      <td>ABC</td>
      <td>ABC@gmail.com</td>
      <td>Yes</td>
      <td>Delete</td>
      <td>Edit</td>
    </tr>
  </tbody>
</table>
            </div>


        </div>
)
}
export default Artists