import { Link } from "react-router-dom";
import "../styles/landing.css";
import logoImage from "../resources/logo.jpg";
import indiaMapImage from "../resources/india-map.png";
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function Landing() {
  return (
    <div className="landing-body">
      <div className="logo-section">
        <img src={logoImage} alt="Secure Bank of India logo" />
        <h1>Secure Bank of India</h1>
      </div>

      <div className="dropdown">
        <button id="loginBtn" className="dropbtn">
          Login as
        </button>
        <div className="dropdown-content" id="login-menu">
          <Link to="/login/manager">Manager</Link>
          <Link to="/login/user">Account Holder</Link>
        </div>
      </div>

      <main className="content-container">

        <p className="info-text">
        <h2>Welcome to Secure Bank of India</h2>
        <br>
        </br>
        <br>
        </br>
          Secure Bank of India offers comprehensive banking solutions with an
          extensive network of branches across India. Enjoy convenient access to
          personal and business accounts, loans, investment services, and
          digital banking tools tailored for your financial growth. Most of our
          banks are GPTW certified equipped with best employees to offer best
          services.
        </p>

        <div className="map-container">
          <img src={indiaMapImage} alt="India Map" />
        </div>
      </main>
    </div>
  );
}