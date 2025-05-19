import { useState, useEffect, useRef } from "react";
import AnxiosInstance from "./GetToken";
import Head from "./Head";
import Footer from "./Footer";
import Alert from "./Alert";

function Profile() {
  // State lưu thông tin người dùng
  const [profile, setProfile] = useState(null);
  // State theo dõi trạng thái đang tải
  const [loading, setLoading] = useState(true);
  // State cho thông báo lỗi/thành công
  const [error, setError] = useState({
    type: null,
    mess: null,
    timestamp: null
  });
  
  // State cho chức năng đổi mật khẩu
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Ref cho input file upload
  const fileInputRef = useRef(null);
  
  // Tải thông tin người dùng khi component được tạo
  useEffect(() => {
    // Gọi API lấy thông tin người dùng
    AnxiosInstance.get("profile/")
      .then((response) => {
        // Cập nhật state với dữ liệu người dùng
        setProfile(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setLoading(false);
      });
  }, []);
  
  // Hàm xử lý khi người dùng nhấn nút đổi mật khẩu
  const handleTogglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    
    // Reset các trường nhập liệu nếu đang ẩn form
    if (showPasswordForm) {
      setCurrentPassword("");
      setNewPassword("");
    }
  };
  
  // Hàm xử lý khi người dùng gửi form đổi mật khẩu
  const handleChangePassword = () => {
    // Kiểm tra dữ liệu nhập vào
    if (!currentPassword || !newPassword) {
      setError({
        type: "error",
        mess: "Vui lòng nhập đầy đủ thông tin",
        timestamp: Date.now()
      });
      return;
    }
    
    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append('current_password', currentPassword);
    formData.append('password', newPassword);
    
    // Gọi API đổi mật khẩu
    AnxiosInstance.post('EditProfile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        // Hiển thị thông báo thành công
        setError({
          type: "message",
          mess: res.data.message || "Đổi mật khẩu thành công",
          timestamp: Date.now()
        });
        
        // Ẩn form và reset các trường nhập liệu
        setShowPasswordForm(false);
        setCurrentPassword("");
        setNewPassword("");
      })
      .catch(err => {
        // Hiển thị thông báo lỗi
        setError({
          type: "error",
          mess: err.response?.data?.error || "Lỗi khi đổi mật khẩu",
          timestamp: Date.now()
        });
      });
  };
  
  // Hàm xử lý khi người dùng chọn file ảnh đại diện mới
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append('image_url', file);
    
    // Hiển thị trạng thái đang tải
    setLoading(true);
    
    // Gọi API upload ảnh đại diện
    AnxiosInstance.post('EditProfile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        // Hiển thị thông báo thành công
        setError({
          type: "message",
          mess: response.data.message || "Cập nhật ảnh đại diện thành công",
          timestamp: Date.now()
        });
        
        // Sau khi upload thành công, tải lại thông tin profile
        return AnxiosInstance.get("profile/");
      })
      .then(response => {
        // Cập nhật profile với dữ liệu mới
        setProfile(response.data);
        setLoading(false);
      })
      .catch(err => {
        // Hiển thị thông báo lỗi
        setError({
          type: "error",
          mess: err.response?.data?.error || "Lỗi khi cập nhật ảnh đại diện",
          timestamp: Date.now()
        });
        setLoading(false);
      });
  };
  
  // Function to get full image URL
  const getImageUrl = (imageUrlPath) => {
    if (!imageUrlPath) return null;
    
    if (imageUrlPath.startsWith('http')) {
      return imageUrlPath;
    }
    
    return `http://localhost:8000${imageUrlPath.startsWith('/') ? '' : '/'}${imageUrlPath}`;
  }
  
  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <div className="main">
        <Head />
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }
  
  // Hiển thị nội dung chính
  return (
    <div className="main">
      <Head />
      
      {/* Hiển thị thông báo */}
      <Alert error={error.mess} type={error.type} id={error.timestamp} />
      
      <div className="profile-container">
        <h1 className="profile-title">Hồ Sơ Của Bạn</h1>
        
        <div className="profile-card">
          {/* Phần avatar với khả năng upload khi hover */}
          <div className="profile-avatar">
            <div className="avatar-upload-container">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="profile-avatar-img" />
              ) : profile?.image_url ? (
                <img 
                  src={getImageUrl(profile.image_url)} 
                  alt="Avatar" 
                  className="profile-avatar-img" 
                />
              ) : (
                <div className="default-avatar">
                  {profile?.username ? profile.username[0].toUpperCase() : "?"}
                </div>
              )}
              <div className="avatar-overlay" onClick={() => fileInputRef.current.click()}>
                <i className="fa-solid fa-camera"></i>
                <span>Thay đổi ảnh</span>
              </div>
            </div>
            
            {/* Input file ẩn cho việc upload ảnh */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
              accept="image/*"
            />
          </div>
          
          {/* Thông tin cá nhân */}
          <div className="profile-info">
            {/* Hàng thông tin: Tên người dùng */}
            <div className="info-row">
              <div className="info-label">
                Tên người dùng:
              </div>
              <div className="info-value">{profile?.username}</div>
            </div>
            
            {/* Hàng thông tin: Email */}
            <div className="info-row">
              <div className="info-label">
                Email:
              </div>
              <div className="info-value">{profile?.email}</div>
            </div>
            
            {/* Hàng thông tin: Ngày tham gia */}
            <div className="info-row">
              <div className="info-label">
                Ngày tham gia:
              </div>
              <div className="info-value">
                {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString() : "N/A"}
              </div>
            </div>
            
            {/* Hàng thông tin: Loại tài khoản */}
            <div className="info-row">
              <div className="info-label">
                Loại tài khoản:
              </div>
              <div className="info-value">
                <span className={`account-type ${profile?.is_premium ? "premium-badge" : ""}`}>
                  {profile?.is_premium ? "Premium" : "Thường"}
                </span>
                {!profile?.is_premium && (
                  <button 
                    onClick={() => window.location.href = '/paypal'} 
                    className="upgrade-button ml-3"
                  >
                    Nâng cấp Premium
                  </button>
                )}
              </div>
            </div>
            
            {/* Hàng thông tin: Mật khẩu */}
            <div className="info-row">
              <div className="info-label">
                Mật khẩu:
              </div>
              <div className="info-value">
                {/* Nút đổi mật khẩu hoặc form đổi mật khẩu */}
                {!showPasswordForm ? (
                  <button 
                    onClick={handleTogglePasswordForm} 
                    className="change-password-button"
                  >
                    Đổi mật khẩu
                  </button>
                ) : (
                  <div className="password-form-container">
                    {/* Form đổi mật khẩu */}
                    <div>
                      <input 
                        type="password" 
                        placeholder="Mật khẩu hiện tại" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="password-input"
                      />
                      
                      <input 
                        type="password" 
                        placeholder="Mật khẩu mới" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-input"
                      />
                    </div>
                    
                    <div className="password-actions">
                      <button 
                        onClick={handleChangePassword}
                        className="save-button"
                      >
                        Lưu
                      </button>
                      
                      <button 
                        onClick={handleTogglePasswordForm}
                        className="cancel-button"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
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