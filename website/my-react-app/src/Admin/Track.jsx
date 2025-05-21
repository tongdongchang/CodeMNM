import { useState, useEffect, useRef } from "react";
import AnxiosInstance from "../prop/GetToken";

function Track() {
  const [isPrenium, setIsPrenium] = useState("Free");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tracks, setTracks] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [artistList, setArtistList] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [editPreviewURL, setEditPreviewURL] = useState(null);
  const [editPreviewType, setEditPreviewType] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [editThumbnailPreview, setEditThumbnailPreview] = useState(null);
  const [editTrack, setEditTrack] = useState(null);

  const name = useRef();
  const album = useRef();
  const category = useRef();
  const file = useRef();
  const artists = useRef();
  const image = useRef();

  // Load track khi mount hoặc thay đổi bộ lọc
  useEffect(() => {
    let url = "track/";
    const params = [];
    if (categoryFilter !== "all") params.push(`category=${categoryFilter}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    AnxiosInstance.get(url)
      .then(res => setTracks(res.data))
      .catch(err => console.error("Error loading tracks:", err));
    AnxiosInstance.get("artists/").then(res => setArtistList(res.data));
    AnxiosInstance.get("albums/").then(res => setAlbumList(res.data));
  }, [categoryFilter]);

  // kiểm tra loại file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewURL(url);

      if (selectedFile.type.startsWith("video")) {
        setPreviewType("video");
      } else if (selectedFile.type.startsWith("audio")) {
        setPreviewType("audio");
      } else {
        setPreviewType(null);
      }
    }
  };

  // Thêm track
  const handleSubmit = () => {
    if (!name.current.value) {
      alert("Vui lòng nhập tên của track!");
      return; // dừng submit
    }
    // Kiểm tra chọn artist chưa
    if (!artists.current.value) {
      alert("Vui lòng chọn một artist!");
      return; // dừng submit
    }
    
    const formdata = new FormData();
    formdata.append("title", name.current.value);
    formdata.append("album", album.current.value);
    formdata.append("artists", artists.current.value);
    formdata.append("category", category.current.value);
    formdata.append("is_Premium", isPrenium === "Prenium" ? "true" : "false");
    formdata.append("file", file.current.files[0]);
    formdata.append("image_url", image.current.files[0]);

    AnxiosInstance.post("addtrack/", formdata, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data"
      }
    })
      .then(() => {
        // Đóng modal nếu thêm thành công
        const modal = document.getElementById("myModal");
        if (modal) {
          const modalInstance = window.bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        return AnxiosInstance.get("track/");
      })
      .then(res => setTracks(res.data))
      .catch(err => console.error("Error adding track:", err));
  };

  // Xóa track
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      AnxiosInstance.delete(`deletetrack/${id}/`)
        .then(() => {
          setTracks(tracks.filter(track => track.id !== id));
        })
        .catch(err => console.log(err));
    }
  };

  // hiển thị modal sửa Track
  const handleEdit = (track) => {
    // Tìm id tương ứng từ tên artist và album
    const artist = artistList.find(a => a.name === track.artists);
    const album = albumList.find(a => String(a.id) === String(track.album));

    const updatedTrack = {
      ...track,
      artists: artist ? artist.id : "",
      album: album ? album.id : "",
    };

    // Cập nhật thông tin track để chỉnh sửa
    setEditTrack(updatedTrack);

    // Hiển thị preview media
    if (track.file) {
      setEditPreviewURL(track.file); // URL từ backend
      if (track.category === "video") {
        setEditPreviewType("video");
      } else if (track.category === "audio") {
        setEditPreviewType("audio");
      } else {
        setEditPreviewType(null);
      }
    }
    // Nếu có URL ảnh bìa từ backend
    if (track.image_url) {
      setEditThumbnailPreview(track.image_url); // Gán ảnh bìa hiện tại từ backend
    }

    // Hiện modal chỉnh sửa
    const modal = new window.bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  };

  //Sửa Track
  const handleUpdateTrack = () => {
    if (!editTrack) return;

    const formData = new FormData();
    formData.append("title", editTrack.title || "");
    formData.append("album", editTrack.album || "");
    formData.append("artists", editTrack.artists || "");
    formData.append("category", editTrack.category || "audio");
    formData.append("is_Premium", editTrack.is_Premium ? "true" : "false");

    // Nếu có file mới, thêm vào
    if (file.current.files.length > 0) {
      formData.append("file", file.current.files[0]);
    }

    if (editTrack.image instanceof File) {
      formData.append("image_url", editTrack.image);
    } else if (editTrack.image_url && typeof editTrack.image_url === "string") {
      formData.append("image_url", editTrack.image_url);
    }

    AnxiosInstance.patch(`updatetrack/${editTrack.id}/`, formData, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data"
      }
    })
      .then(() => {
        // Đóng modal sau khi cập nhật
        const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        if (modal) modal.hide();

        return AnxiosInstance.get("track/");
      })
      .then(res => setTracks(res.data))
      .catch(err => console.error("Error updating track:", err));
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ManageUsers Track">
      <h1>Track</h1>

      <div>
        <h3>Category</h3>
        <div className="Track-Category">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
          <select
            className="form-select"
            value={isPrenium}
            onChange={e => setIsPrenium(e.target.value)}
          >
            <option>Prenium</option>
            <option>Free</option>
          </select>

          {/* Modal thêm track */}
          <div className="modal" id="myModal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add New</h4>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <form className="formADD">
                    <div>
                      <label className="form-label">Name:</label>
                      <input type="text" ref={name} className="form-control" placeholder="Enter name" />
                    </div>
                    <div>
                      <label className="form-label">Select Artist</label>
                      <select ref={artists} name="artists" className="form-select">
                        <option value="">-- Choose artist --</option>
                        {artistList.map(artist => (
                          <option key={artist.id} value={artist.id}>
                            {artist.name}
                          </option>
                        ))}
                      </select>

                      <label className="form-label">Select Album</label>
                      <select ref={album} className="form-select">
                        <option value="">-- Choose album --</option>
                        {albumList.map(album => (
                          <option key={album.id} value={album.id}>
                            {album.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Select Category</label>
                      <select ref={category} className="form-select">
                        <option value="video">--Choose Category--</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Is Premium?</label>
                      <div className="form-checking">
                        <div className="form-check">
                          <input type="radio" className="form-check-input" name="optradio" value="Prenium" checked={isPrenium === "Prenium"} onClick={e => setIsPrenium(e.target.value)} />
                          <label className="form-check-label">Premium</label>
                        </div>
                        <div className="form-check">
                          <input type="radio" className="form-check-input" name="optradio" value="Free" checked={isPrenium === "Free"} onClick={e => setIsPrenium(e.target.value)} />
                          <label className="form-check-label">Free</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Ảnh bìa</label>
                      <input type="file" ref={image} accept="image/*" 
                        onChange={e => {
                          const selectedImage = e.target.files[0];
                          if (selectedImage) {
                            const previewURL = URL.createObjectURL(selectedImage);
                            setThumbnailPreview(previewURL);
                          } else {
                            setThumbnailPreview(null);
                          }
                        }}
                      />
                      {thumbnailPreview && (
                        <div className="mt-2">
                          <img src={thumbnailPreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="form-label">Nguồn</label>
                      <input type="file" ref={file} onChange={handleFileChange} />
                    </div>
                    {previewType === "video" && (
                      <video src={previewURL} width="100%" height="auto" controls />
                    )}
                    {previewType === "audio" && (
                      <audio src={previewURL} controls />
                    )}
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-info" onClick={handleSubmit}>Add</button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal chỉnh sửa track */}
          <div className="modal fade" id="editModal" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Edit Track</h4>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <form className="formEDIT">
                    <div>
                      <label className="form-label">Name:</label>
                      <input type="text" className="form-control" value={editTrack?.title || ""} onChange={e => setEditTrack({...editTrack, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">Select Artist</label>
                      <select
                        className="form-select"
                        value={editTrack?.artists || ""}
                        onChange={e => {
                          const val = e.target.value;
                          setEditTrack({ ...editTrack, artists: val === "" ? null : parseInt(val) });
                        }}
                      >
                        <option value="">-- Choose artist --</option>
                        {artistList.map(artist => (
                          <option key={artist.id} value={artist.id}>{artist.name}</option>
                        ))}
                      </select>

                      <label className="form-label">Select Album</label>
                      <select
                        className="form-select"
                        value={editTrack?.album || ""}
                        onChange={e => {
                          const val = e.target.value;
                          setEditTrack({ ...editTrack, album: val === "" ? null : parseInt(val) });
                        }}
                      >
                        <option value="">-- Choose album --</option>
                        {albumList.map(album => (
                          <option key={album.id} value={album.id}>{album.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Select Category</label>
                      <select className="form-select" value={editTrack?.category || "audio"} onChange={e => setEditTrack({...editTrack, category: e.target.value})}>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Is Premium?</label>
                      <div className="form-checking">
                        <div className="form-check">
                          <input type="radio" className="form-check-input" name="editPremium" value="true" checked={editTrack?.is_Premium === true} onChange={() => setEditTrack({...editTrack, is_Premium: true})} />
                          <label className="form-check-label">Premium</label>
                        </div>
                        <div className="form-check">
                          <input type="radio" className="form-check-input" name="editPremium" value="false" checked={editTrack?.is_Premium === false} onChange={() => setEditTrack({...editTrack, is_Premium: false})} />
                          <label className="form-check-label">Free</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Ảnh bìa</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const selectedImage = e.target.files[0];
                          if (selectedImage) {
                            setEditTrack({ ...editTrack, image: selectedImage }); // ⬅️ Lưu file ảnh bìa vào state
                            setEditThumbnailPreview(URL.createObjectURL(selectedImage)); // ⬅️ Preview ảnh
                          } else {
                            setEditTrack({ ...editTrack, image: null });
                            setEditThumbnailPreview(null);
                          }
                        }}
                      />
                      {editThumbnailPreview && (
                        <div className="mt-2">
                          <img
                            src={editThumbnailPreview}
                            alt="Ảnh bìa"
                            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="form-label">Nguồn</label>
                      <input
                        type="file"
                        onChange={e => {
                          const selectedFile = e.target.files[0];
                          if (selectedFile) {
                            setEditTrack({ ...editTrack, file: selectedFile });
                            const previewURL = URL.createObjectURL(selectedFile);
                            setEditPreviewURL(previewURL);
                            if (selectedFile.type.startsWith("video")) {
                              setEditPreviewType("video");
                            } else if (selectedFile.type.startsWith("audio")) {
                              setEditPreviewType("audio");
                            }
                          }
                        }}
                      />
                      {editPreviewType === "video" && (
                        <video src={editPreviewURL} controls width="100%" />
                      )}
                      {editPreviewType === "audio" && (
                        <audio src={editPreviewURL} controls />
                      )}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleUpdateTrack}>Update</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div>
        <label htmlFor="browser" className="form-label">Search:</label>
        <div className="d-flex">
          <input className="form-control" type="search" name="browser" onChange={e => setSearchTerm(e.target.value)} />
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">Add New</button>
        </div>
      </div>

      <div className="scroll-table mt-3">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Name</th>
              <th>Artist</th>
              <th>Release date</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map(track => (
              <tr key={track.id}>
                <td>
                  {track.image_url ? (
                    <img src={track.image_url} width="60" height="60" />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>{track.title}</td>
                <td>{track.artists}</td>
                <td>{track.release_date}</td>
                <td>
                  <button onClick={() => handleDelete(track.id)}>Delete</button>
                </td>
                <td>
                  <button className="btn btn-warning" onClick={() => handleEdit(track)}>Edit</button>
                </td>
              </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default Track;

