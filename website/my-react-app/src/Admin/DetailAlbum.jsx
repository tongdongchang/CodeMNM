import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnxiosInstance from "../prop/GetToken";

function ViewDetail() {
  const { albumId } = useParams(); // Đổi tên biến cho đúng ngữ nghĩa
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    AnxiosInstance.get(`albums/${albumId}/tracks/`)
      .then(res => {
        setTracks(res.data);
      })
      .catch(err => console.error("Lỗi khi load tracks:", err));
  }, [albumId]);

  const handleRemoveTrack = (trackId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá track này khỏi album không?");
    if (!confirmDelete) return;

    AnxiosInstance.patch(`updatealbum/${trackId}/`, { album: null }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "multipart/form-data"
      }
    })
      .then(() => {
        setTracks((prevTracks) => prevTracks.filter((t) => t.id !== trackId));
      })
      .catch((err) => {
        console.error("Lỗi khi xoá track khỏi album:", err);
        alert("Đã xảy ra lỗi. Không thể xoá track.");
      });
  };

  return (
    <div className="ManageUsers Track ViewDetail">
      <h1>Tracks of Album #{albumId}</h1>

      <div className="scroll-table">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>ảnh</th>
              <th>Name</th>
              <th>Release date</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tracks) && tracks.map((track) => (
              <tr key={track.id}>
                <td>
                  {track.image_url ? (
                    <img src={track.image_url} width="60" height="60" />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>{track.title}</td>
                <td>{track.release_date}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveTrack(track.id)}
                  >
                    Delete
                  </button>
                </td>
                <td><button className="btn btn-warning">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewDetail;
