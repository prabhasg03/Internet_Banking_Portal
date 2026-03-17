import { useEffect, useState, useRef, useMemo } from "react";
import api from "../api/api";
import "../styles/user-dashboard.css";
import "bootstrap/dist/css/bootstrap.css";
import logo from "../resources/logo.jpg";
import logoutIcon from "../resources/logout.png";
import Welcome from "../components/Welcome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserDashboard() {
  const SESSION_LIMIT_MS = 900000; // 15 minutes
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showFunds, setShowFunds] = useState(() => localStorage.getItem("showFunds") === "true");
  const [loginTime] = useState(() => Number(localStorage.getItem("loginTime")) || Date.now());
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDesc, setWithdrawDesc] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDesc, setDepositDesc] = useState("");

  const manageFundsRef = useRef(null);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // -------------------- Session Management --------------------
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - loginTime >= SESSION_LIMIT_MS) {
        alert("Session expired. Redirecting to login...");
        logout();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loginTime]);

  // -------------------- Load Data --------------------
  async function loadData() {
    try {
      const res = await api.get(`/api/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);

      const t = await api.get(`/api/transactions/user/${res.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(t.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data. Please login again.");
      logout();
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // -------------------- Transaction Handling --------------------
  async function doTransaction(type, amount, purpose) {
    if (!amount || amount <= 0 || isNaN(amount)) {
      return toast.error("Enter a valid amount");
    }

    if (type === "DEBIT" && amount > parseFloat(profile.balance || 0)) {
      return toast.error("Insufficient balance");
    }

    try {
      await api.post(
        "/api/transactions/create",
        {
          userId: profile.id,
          amount,
          purpose: purpose || "No description",
          type,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(type === "CREDIT" ? "Deposit successful" : "Withdrawal successful");

      resetFundsForm();
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Transaction failed");
    }
  }

  function resetFundsForm() {
    setWithdrawAmount("");
    setWithdrawDesc("");
    setDepositAmount("");
    setDepositDesc("");
  }

  // -------------------- Logout --------------------
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("showFunds");
    window.location.href = "/login/user";
  }

  // -------------------- Memoized Sorted Transactions --------------------
  const sortedTransactions = useMemo(
    () => transactions.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [transactions]
  );

  if (!profile) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="dashboard container-fluid mt-4 px-0">
      {/* HEADER */}
      <div className="header d-flex justify-content-between align-items-center mb-3 px-4 flex-wrap">
        <div className="logo-section d-flex align-items-center">
          <img src={logo} alt="Bank Logo" height={60} className="me-3" />
          <h1>Secure Bank of India</h1>
        </div>

        <Welcome
          profile={profile}
          loginTime={
            localStorage.getItem("loginTime")
              ? new Date(localStorage.getItem("loginTime"))
              : new Date()
          }
        />

        <button className="logout-btn btn btn-light" onClick={logout} title="Logout">
          <img src={logoutIcon} alt="Logout" height={50} />
        </button>
      </div>

      {/* Toggle Manage Funds */}
      <button
        className="btn btn-primary mb-3 ms-4"
        onClick={() => {
          setShowFunds((prev) => {
            const newVal = !prev;
            localStorage.setItem("showFunds", newVal);
            if (newVal && manageFundsRef.current) {
              setTimeout(() => {
                manageFundsRef.current.scrollIntoView({ behavior: "smooth" });
              }, 200);
            }
            return newVal;
          });
        }}
      >
        {showFunds ? "Hide Manage Funds" : "Go to Manage Funds"}
      </button>

      {/* USER DETAILS */}
      <div className="mb-4 px-4">
        <h4>User Details</h4>
        <table className="table table-bordered table-striped">
          <tbody>
            <tr><td>User ID</td><td>{profile.id}</td></tr>
            <tr><td>Username</td><td>{profile.username}</td></tr>
            <tr><td>First Name</td><td>{profile.firstName || "N/A"}</td></tr>
            <tr><td>Last Name</td><td>{profile.lastName || "N/A"}</td></tr>
            <tr><td>Email</td><td>{profile.email || "N/A"}</td></tr>
            <tr><td>Phone</td><td>{profile.phone || "N/A"}</td></tr>
            <tr>
              <td>Balance</td>
              <td>{parseFloat(profile.balance || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</td>
            </tr>
            <tr><td>Status</td><td>{profile.enabled ? "Active" : "Inactive"}</td></tr>
          </tbody>
        </table>
      </div>

      {/* MANAGE FUNDS */}
      {showFunds && (
        <div ref={manageFundsRef} className="border p-3 rounded bg-light text-dark mb-4 mx-4">
          <h5>Manage Funds</h5>

          <div className="row mb-3">
            {/* Withdraw */}
            <div className="col-md-6">
              <h6>Withdraw Funds</h6>
              <input
                type="number"
                min="0"
                className="form-control mb-2"
                placeholder="Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Purpose"
                value={withdrawDesc}
                onChange={(e) => setWithdrawDesc(e.target.value)}
              />
              <button
                className="btn btn-danger"
                onClick={() => doTransaction("DEBIT", parseFloat(withdrawAmount), withdrawDesc)}
              >
                Withdraw
              </button>
            </div>

            {/* Deposit */}
            <div className="col-md-6">
              <h6>Add Funds</h6>
              <input
                type="number"
                min="0"
                className="form-control mb-2"
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Purpose"
                value={depositDesc}
                onChange={(e) => setDepositDesc(e.target.value)}
              />
              <button
                className="btn btn-success"
                onClick={() => doTransaction("CREDIT", parseFloat(depositAmount), depositDesc)}
              >
                Deposit
              </button>
            </div>
          </div>

          {/* Transactions */}
          <h5>Recent Transactions</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{parseFloat(t.amount).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</td>
                  <td>{t.purpose}</td>
                  <td>{t.type}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}