
import { useState, useEffect } from "react";
import AnxiosInstance from "./GetToken";
import Head from "./Head";
import Footer from "./Footer";
import Alert from "./Alert";

function Profile() {
  // State để lưu thông tin profile
  const [profile, setProfile] = useState(null);
  // State để hiển thị trạng thái loading
  const [loading, setLoading] = useState(true);
  // State để hiển thị thông báo lỗi/thành công
  const [error, setError] = useState({ type: null, mess: null, timestamp: null });

  // Chạy khi component được tạo
  useEffect(() => {
    // Gọi API để lấy thông tin profile
    AnxiosInstance.get("profile/")
      .then((response) => {
        // Lưu thông tin profile vào state
        setProfile(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin profile:", err);
        setError({
          type: "error",
          mess: "Không thể lấy thông tin profile",
          timestamp: Date.now(),
        });
        setLoading(false);
      });
  }, []);

  // Hàm tải lên avatar mới
  const handleAvatarUpload = (event) => {
    // Lấy file từ input
    const file = event.target.files[0];
    
    if (!file) return;

    // Tạo form data để gửi file
    const formData = new FormData();
    formData.append("avatar", file);

    // Gọi API để tải lên avatar
    AnxiosInstance.post("upload-avatar/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        // Cập nhật lại profile với avatar mới
        setProfile({
          ...profile,
          avatar_url: response.data.image_url,
        });
        
        // Hiển thị thông báo thành công
        setError({
          type: "message",
          mess: "Đã cập nhật avatar thành công",
          timestamp: Date.now(),
        });
      })
      .catch((err) => {
        console.error("Lỗi khi tải lên avatar:", err);
        setError({
          type: "error",
          mess: err.response?.data?.error || "Không thể tải lên avatar",
          timestamp: Date.now(),
        });
      });
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="main">
        <Head />
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="main">
      <Head />
      
      {/* Hiển thị thông báo */}
      <Alert error={error.mess} type={error.type} id={error.timestamp} />
      
      <div className="profile-container">
        <h1>Hồ Sơ Của Bạn</h1>
        
        <div className="profile-card">
          {/* Phần avatar */}
          <div className="profile-avatar">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" />
            ) : (
              <div className="default-avatar">
                {profile?.username ? profile.username[0].toUpperCase() : "?"}
              </div>
            )}
            
            {/* Nút để thay đổi avatar */}
            <label className="change-avatar-button">
              Thay đổi avatar
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
                accept="image/*"
              />
            </label>
          </div>
          
          {/* Thông tin cá nhân */}
          <div className="profile-info">
            <div className="info-row">
              <div className="info-label">Tên người dùng:</div>
              <div className="info-value">{profile?.username}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Email:</div>
              <div className="info-value">{profile?.email}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Ngày tham gia:</div>
              <div className="info-value">
                {new Date(profile?.date_joined).toLocaleDateString()}
              </div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Loại tài khoản:</div>
              <div className="info-value">
                <span className={profile?.is_premium ? "premium-badge" : ""}>
                  {profile?.is_premium ? "Premium" : "Thường"}
                </span>
                
                {!profile?.is_premium && (
                  <button className="upgrade-button">
                    Nâng cấp lên Premium
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Profile;