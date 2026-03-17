import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/user-login.css";
import logo from "../resources/logo.jpg";

export default function UserLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await login(username, password);

      // Check user role
      if (res.username !== username && !res.roles.includes("ROLE_USER")) {
        setError("Not authorized as User");
        return;
      }

      // Store JWT and loginTime
      if (res.token) {
        localStorage.setItem("token", res.token);
      }
      localStorage.setItem("username", username);
      localStorage.setItem("role", "user");
      localStorage.setItem("loginTime", new Date().toISOString());

      navigate("/user");
    } catch (e) {
      setError("Invalid Username or Password: " + e);
    }
  }

  return (
    <div className="login-wrapper">
      <main className="login-container">
        <h1>
          <img src={logo} alt="Bank Logo" />
          Secure Bank of India
        </h1>
        <h2>Account Holder Login</h2>

        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>

          {error && <p className="error">{error}</p>}
        </form>

        <p className="link">
          Manager? <a href="/login/manager"><strong>Click here</strong></a>
        </p>

        <p className="link">
          Main page? <a href="/"><strong>Click here</strong></a>
        </p>
      </main>
    </div>
  );
}