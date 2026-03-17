import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/managerLogin.css";
import logo from "../resources/logo.jpg";

export default function ManagerLogin() {
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

      // Check for manager role
      if (!res.roles.includes("ROLE_MANAGER")) {
        setError("Not authorized as Manager");
        return;
      }

      // Store JWT and session info
      if (res.token) localStorage.setItem("token", res.token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", "manager");
      localStorage.setItem("loginTime", Date.now());

      navigate("/manager");
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
        <h2>Manager Login</h2>

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
          Account Holder? <a href="/login/user"><strong>Click here</strong></a>
        </p>
        <p className="link">
          Main page? <a href="/"><strong>Click here</strong></a>
        </p>
      </main>
    </div>
  );
}