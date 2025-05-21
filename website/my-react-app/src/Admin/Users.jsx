import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    
    axios.get("http://localhost:8000/api/users/")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Lỗi khi tải user:", error);
      });
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá user này không?")) {
      axios.delete(`http://localhost:8000/api/users/${id}/`)
        .then(() => {
          setUsers(prev => prev.filter(user => user.id !== id));
        })
        .catch(err => console.error("Lỗi xoá user:", err));
    }
  };

  const handleSaveEdit = () => {
    axios.put(`http://localhost:8000/api/users/${editingUser.id}/`, editingUser)
      .then(res => {
        setUsers(prev =>
          prev.map(user => (user.id === editingUser.id ? res.data : user))
        );
        setShowModal(false);
      })
      .catch(err => console.error("Lỗi cập nhật user:", err));
  };

  return (
    <div className="ManageUsers">
      <h1>User</h1>
      <div className="scroll-table">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>UserName</th>
              <th>Email</th>
              <th>Status Premium</th>
              <th>Role</th>
              <th>Ngày tạo</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>
                  {user.image_url ? (
                    <img src={user.image_url} alt="Avatar" width="40" height="40" style={{ borderRadius: "50%" }} />
                  ) : (
                    <span>Không có ảnh</span>
                  )}
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.is_premium ? "Yes" : "No"}</td>
                <td>{user.is_staff ? "Admin" : "User"}</td>
                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                <td><button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button></td>
                <td><button className="btn btn-warning" onClick={() => handleEditClick(user)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content" ref={modalRef}>
            <h2>Chỉnh sửa người dùng</h2>
            <label>Username</label>
            <input
              value={editingUser.username}
              onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
            />
            <label>Email</label>
            <input
              value={editingUser.email}
              onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
            />
            <label>Premium</label>
            <select
              value={editingUser.is_premium}
              onChange={e => setEditingUser({ ...editingUser, is_premium: e.target.value === 'true' })}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
            <label>Role</label>
            <select
              value={editingUser.is_staff}
              onChange={e => setEditingUser({ ...editingUser, is_staff: e.target.value === 'true' })}
            >
              <option value="false">User</option>
              <option value="true">Admin</option>
            </select>
            <button onClick={handleSaveEdit}>Lưu</button>
            <button onClick={() => setShowModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
