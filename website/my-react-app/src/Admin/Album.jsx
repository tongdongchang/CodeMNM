import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import AnxiosInstance from "../prop/GetToken";
function Album(){
  const navigate = useNavigate()
  const [albumList, setAlbumList] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [newAlbum, setNewAlbum] = useState({title: "",decription: "",point: 0,artist: "",image_file: null,previewImage: null,});
  const [editAlbum, setEditAlbum] = useState(null);

  useEffect(() => {
    loadAlbums();
    loadArtists();
  }, []);

  const loadAlbums = () => {
    AnxiosInstance.get("albums/")
      .then(res => setAlbumList(res.data))
      .catch(err => console.error("Lỗi tải albums:", err));
  };

  const loadArtists = () => {
    AnxiosInstance.get("artists/")
      .then(res => setArtistList(res.data))
      .catch(err => console.error("Lỗi tải artists:", err));
  };
  // thêm 
  const handleAddAlbum = () => {
    const formData = new FormData();
    formData.append("title", newAlbum.title);
    formData.append("decription", newAlbum.decription);
    formData.append("point", newAlbum.point);
    formData.append("artist", newAlbum.artist);
    formData.append("category", newAlbum.category);
    if (newAlbum.image_file) {
      formData.append("image_url", newAlbum.image_file);
    }
    AnxiosInstance.post("albums/", formData, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        setNewAlbum({
          title: "",
          decription: "",
          point: 0,
          artist: "",
          image_file: null,
          previewImage: null,
          category: "Free",
        });
        loadAlbums();
        bootstrap.Modal.getInstance(document.getElementById("myModal"))?.hide();
      })
      .catch((err) => console.error("Lỗi thêm album:", err));
  };
  // Xóa
  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this album?")) {
      AnxiosInstance.delete(`albums/${id}/`)
        .then(() => loadAlbums())
        .catch(err => console.error("Lỗi xoá album:", err));
    }
  };
  // mở modal sửa
  const handleEdit = (album) => {
    setEditAlbum({
      ...album,
      artist: album.artists,
      image_file: null,
      previewImage: album.image_url // dùng để preview ảnh ban đầu
    });

    const modal = new bootstrap.Modal(document.getElementById("editAlbumModal"));
    modal.show();
    };
  // Sửa
  const handleUpdateAlbum = () => {
    const formData = new FormData();
    formData.append("title", editAlbum.title);
    formData.append("artist", editAlbum.artist);
    formData.append("decription", editAlbum.decription || "");
    formData.append("point", editAlbum.point || 0);

    if (editAlbum.image_file) {
      formData.append("image_url", editAlbum.image_file);
    }

    AnxiosInstance.patch(`albums/${editAlbum.id}/`, formData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        loadAlbums();
        bootstrap.Modal.getInstance(document.getElementById("editAlbumModal"))?.hide();
      })
      .catch((err) => console.error("Lỗi cập nhật album:", err));
  };
    return(
      <div className="ManageUsers Artists Album">
        <h1>Album</h1>
        <div>
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
            Add New
            </button>
            {/* Modal thêm */}
            <div className="modal" id="myModal">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add New</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      {/* Tiêu đề */}
                      <div className="mb-2">
                        <label htmlFor="albumTitle" className="form-label">Title</label>
                        <input
                          id="albumTitle"
                          type="text"
                          className="form-control"
                          placeholder="Title"
                          value={newAlbum.title}
                          onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                        />
                      </div>

                      {/* Mô tả */}
                      <div className="mb-2">
                        <label htmlFor="albumDescription" className="form-label">Description</label>
                        <textarea
                          id="albumDescription"
                          className="form-control"
                          placeholder="Description"
                          value={newAlbum.decription}
                          onChange={(e) => setNewAlbum({ ...newAlbum, decription: e.target.value })}
                        />
                      </div>

                      {/* Điểm */}
                      <div className="mb-2">
                        <label htmlFor="albumPoint" className="form-label">Point</label>
                        <input
                          id="albumPoint"
                          type="number"
                          className="form-control"
                          placeholder="Point"
                          value={newAlbum.point}
                          onChange={(e) => setNewAlbum({ ...newAlbum, point: e.target.value })}
                        />
                      </div>

                      {/* Artist */}
                      <div className="mb-2">
                        <label htmlFor="albumArtist" className="form-label">Artist</label>
                        <select
                          id="albumArtist"
                          className="form-select"
                          value={newAlbum.artist}
                          onChange={(e) => setNewAlbum({ ...newAlbum, artist: parseInt(e.target.value) })}
                        >
                          <option value="">-- Chọn artist --</option>
                          {artistList.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                              {artist.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Ảnh preview nếu đã chọn */}
                      {newAlbum.previewImage && (
                        <div className="mb-2">
                          <label className="form-label">Preview Image</label>
                          <img src={newAlbum.previewImage} alt="Preview" width="80" height="80" />
                          <p className="text-muted">Ảnh preview</p>
                        </div>
                      )}

                      {/* Upload ảnh */}
                      <div className="mb-2">
                        <label htmlFor="albumImage" className="form-label">Upload Image</label>
                        <input
                          id="albumImage"
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const previewURL = URL.createObjectURL(file);
                              setNewAlbum((prev) => ({
                                ...prev,
                                image_file: file,
                                previewImage: previewURL,
                              }));
                            }
                          }}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleAddAlbum}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal sửa */}
            <div className="modal" id="editAlbumModal">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Edit Album</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>

                  <div className="modal-body">
                    {/* Tiêu đề */}
                    <label htmlFor="albumTitle" className="form-label">Title</label>
                    <input type="text" className="form-control mb-2" placeholder="Title"
                      value={editAlbum?.title || ""}
                      onChange={(e) => setEditAlbum({ ...editAlbum, title: e.target.value })}
                    />

                    {/* Mô tả */}
                    <label htmlFor="albumDescription" className="form-label">Description</label>
                    <textarea className="form-control mb-2" placeholder="Description"
                      value={editAlbum?.decription || ""}
                      onChange={(e) => setEditAlbum({ ...editAlbum, decription: e.target.value })}
                    />

                    {/* Điểm */}
                    <label htmlFor="albumPoint" className="form-label">Point</label>
                    <input type="number" className="form-control mb-2" placeholder="Point"
                      value={editAlbum?.point || ""}
                      onChange={(e) => setEditAlbum({ ...editAlbum, point: e.target.value })}
                    />

                    {/* Artist */}
                    <label htmlFor="albumArtist" className="form-label">Artist</label>
                    <select className="form-select mb-2"
                      value={editAlbum?.artist || ""}
                      onChange={(e) => setEditAlbum({ ...editAlbum, artist: e.target.value })}
                    >
                      <option value="">-- Chọn artist --</option>
                      {artistList.map(artist => (
                        <option key={artist.id} value={artist.id}>{artist.name}</option>
                      ))}
                    </select>

                    {/* Hiển thị hình ảnh hiện tại */}
                    {editAlbum?.previewImage && (
                      <div className="mb-2">
                        <img src={editAlbum.previewImage} alt="Preview" width="80" height="80" />
                        <p className="text-muted">Ảnh preview</p>
                      </div>
                    )}

                    {/* Tải lên hình ảnh mới */}
                    <label htmlFor="albumImage" className="form-label">Upload Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const previewURL = URL.createObjectURL(file);
                          setEditAlbum(prev => ({
                            ...prev,
                            image_file: file,
                            previewImage: previewURL // hiển thị ảnh preview mới
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-primary" onClick={handleUpdateAlbum}>Update</button>
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
                <th>Image</th>
                <th>Name</th>
                <th>Artist</th>
                <th>Total song</th>
                <th>Point</th>
                <th>Release Date</th>
                <th>Description</th>
                <th>Detail</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {albumList.map(album => (
                <tr key={album.id}>
                  <td>
                    {album.image_url && (
                      <img src={album.image_url} alt="Album" width="50" height="50" />
                    )}
                  </td>
                  <td>{album.title}</td>
                  <td>{album.artist_name}</td>
                  <td>{album.total_tracks || 0}</td>
                  <td>{album.point}</td>
                  <td>{album.release_date}</td>
                  <td title={album.decription}>{album.decription?.length > 30 ? album.decription.slice(0, 30) + "..." : album.decription}</td>
                  <td> <button onClick={() => navigate('/admin/viewdetailalbum/'+album.id)}>View detail</button> </td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(album)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(album.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}
export default Album