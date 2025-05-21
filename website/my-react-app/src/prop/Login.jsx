import { useState, useRef } from "react";
import Alert from "./Alert";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState({ type: null, mess: null });
  const navigate = useNavigate();
  const Ref = useRef(null);

  const handleUser = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/token/", user);
      const { access, refresh } = res.data;
      const decoded = parseJwt(access);
      const userId = decoded.user_id;
      const role = decoded.role === "admin" ? "admin" : "user";
      await axios.get("http://localhost:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const resProfile = await axios.get(`http://localhost:8000/api/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      
      // ✅ Giải mã access token để lấy role
      
      // Tiếp tục gọi profile nếu cần thêm thông tin khác
      
      const userInfo = resProfile.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_info", JSON.stringify(userInfo));

      setError({ type: "message", mess: "Login success", timestamp: Date.now() });

      // if (role === "admin") {
      //   navigate("/admin");
      // } else {
        navigate("/");
      // }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError({ type: "error", mess: msg, timestamp: Date.now() });
    }
  };


  return (
    <div className="register">
      <div>
        <Alert error={error.mess} type={error.type} id={error.timestamp} />
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              onChange={handleUser}
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleUser}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <Link to="/">Back to home</Link>
      </div>
    </div>
  );
}

export default Login;
