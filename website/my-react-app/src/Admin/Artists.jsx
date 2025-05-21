import { useEffect, useState } from "react";
import AnxiosInstance from "../prop/GetToken";
function Artists() {
  const [artistList, setArtistList] = useState([]);
  const [newArtist, setNewArtist] = useState({ name: "", image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [editArtist, setEditArtist] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

  useEffect(() => {
    AnxiosInstance.get("artists/")
      .then(res => setArtistList(res.data))
      .catch(err => console.error("Lỗi khi tải artist:", err));
  }, []);

  // Thêm
  const handleAddArtist = () => {
    const formData = new FormData();
    formData.append("name", newArtist.name);
    if (newArtist.image) {
      formData.append("image_url", newArtist.image); // đúng tên field trong model Django
    }

    AnxiosInstance.post("artists/", formData, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data"
      }
    })
      .then((res) => {
        // reset form
        setNewArtist({ name: "", image: null });
        setPreviewImage(null);
        // reload artist list
        return AnxiosInstance.get("artists/");
      })
      .then(res => setArtistList(res.data))
      .catch(err => console.error("Lỗi khi thêm artist:", err));

    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("myModal"));
    if (modal) modal.hide();
  };

  // Xóa
  const handleDeleteArtist = (id) => {
    if (!window.confirm("Are you sure you want to delete this artist?")) return;

    AnxiosInstance.delete(`artists/${id}/`)
      .then(() => {
        setArtistList(prev => prev.filter(artist => artist.id !== id));
      })
      .catch(err => console.error("Lỗi khi xóa artist:", err));
  };

  // Sửa
  const handleUpdateArtist = () => {
    const formData = new FormData();
    formData.append("name", editArtist.name);
    if (editArtist.image instanceof File) {
      formData.append("image_url", editArtist.image);
    }

    AnxiosInstance.put(`artists/${editArtist.id}/`, formData, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data"
      }
    })
      .then(() => {
        // reset edit state
        setEditArtist(null);
        setEditPreviewImage(null);
        return AnxiosInstance.get("artists/");
      })
      .then(res => setArtistList(res.data))
      .catch(err => console.error("Lỗi khi cập nhật artist:", err));

    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    if (modal) modal.hide();
  };

  return (
    <div className="ManageUsers Artists">
      <h1>Artists</h1>
      <div className="d-flex justify-content-between mb-3">
        <input className="form-control w-50" placeholder="Search Artists..." />
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
          Add New
        </button>
      </div>

      <div className="scroll-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artistList.map(artist => (
              <tr key={artist.id}>
                <td style={{ width: "120px" }}>
                  <img
                    src={`http://localhost:8000${artist.image_url}`} // ✅ chỉnh theo domain backend của bạn
                    alt={artist.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                </td>
                <td>{artist.name}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditArtist(artist);
                      setEditPreviewImage(`http://localhost:8000${artist.image_url}`);
                      new bootstrap.Modal(document.getElementById("editModal")).show();
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteArtist(artist.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm mới */}
      <div className="modal" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add New Artist</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <label className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter artist name"
                  value={newArtist.name}
                  onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                />

                <label className="form-label">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewArtist({ ...newArtist, image: file });
                      setPreviewImage(URL.createObjectURL(file));
                    } else {
                      setNewArtist({ ...newArtist, image: null });
                      setPreviewImage(null);
                    }
                  }}
                />

                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleAddArtist}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal chỉnh sửa */}
      <div className="modal" id="editModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Artist</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {editArtist && (
                <form>
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={editArtist.name}
                    onChange={(e) =>
                      setEditArtist({ ...editArtist, name: e.target.value })
                    }
                  />

                  <label className="form-label">Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditArtist({ ...editArtist, image: file });
                        setEditPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />

                  {editPreviewImage && (
                    <div className="mt-2">
                      <img
                        src={editPreviewImage}
                        alt="Preview"
                        style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleUpdateArtist}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Artists