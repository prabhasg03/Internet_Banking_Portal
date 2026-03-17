import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/manager.css";
import "bootstrap/dist/css/bootstrap.css";
import logo from "../resources/logo.jpg";
import logoutIcon from "../resources/logout.png";
import Welcome from "../components/Welcome";

export default function ManagerDashboard() {
  const SESSION_LIMIT_MS = 900000; // 15 minutes session

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loginTime] = useState(() => Number(localStorage.getItem("loginTime")) || Date.now());

  // Logout function
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("loginTime");
    window.location.href = "/login/manager";
  }

  // Auto logout after session expiry
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - loginTime >= SESSION_LIMIT_MS) {
        alert("Session expired. Please log in again.");
        logout();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loginTime]);

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get(`/api/users/${localStorage.getItem("username")}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Profile loading failed", error);
      }
      loadUsers();
    }
    init();
  }, []);

  async function loadUsers() {
    const res = await api.get("/api/users/all");
    setUsers(res.data);
  }

  async function selectUser(username) {
    const res = await api.get(`/api/users/${username}`);
    const t = await api.get(`/api/transactions/user/${res.data.id}`);

    setSelected({
      ...res.data,
      transactions: t.data,
      password: "",
    });
  }

  async function saveUser() {
    if (!selected) return alert("Select a user first");

    const payload = {
      username: selected.username,
      firstName: selected.firstName,
      lastName: selected.lastName,
      email: selected.email,
      phone: selected.phone,
      enabled: selected.enabled,
      roles: selected.roles.map((r) => r.roleName),
    };

    if (selected.password) {
      await api.put(`/api/users/${selected.username}/change-password?newPassword=${encodeURIComponent(selected.password)}`);
    }

    await api.put(
      `/api/users/${selected.username}?` +
        new URLSearchParams({
          username: payload.username,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
        })
    );

    alert("User updated");
    loadUsers();
    selectUser(selected.username);
  }

  async function deleteUser() {
    if (!selected) return alert("Select a user");
    if (!window.confirm(`Delete user '${selected.username}'?`)) return;

    await api.delete(`/api/users/${selected.username}`);
    alert("User deleted");
    setSelected(null);
    loadUsers();
  }

  async function addUser() {
    const username = prompt("Enter Username:");
    const password = prompt("Enter Password:");
    if (!username || !password) return alert("Username & Password required");

    const payload = {
      username,
      password,
      email: prompt("Enter Email"),
      firstName: prompt("Enter First Name"),
      lastName: prompt("Enter Last Name"),
      phone: prompt("Enter Phone"),
      balance: prompt("Enter Balance"),
      enabled: true,
      roleNames: (prompt("Roles (comma separated)") || "").split(",").map((r) => r.trim()),
    };

    await api.post("/api/users/create", payload);
    alert("User added");
    loadUsers();
  }

  async function addTransaction() {
    if (!selected) return alert("Select a user");

    const amount = parseFloat(prompt("Amount:"));
    if (isNaN(amount)) return alert("Invalid amount");

    const payload = {
      userId: selected.id,
      amount,
      purpose: prompt("Description") || "No description",
      type: prompt("Type (CREDIT/DEBIT)") || "CREDIT",
    };

    await api.post("/api/transactions/create", payload);
    alert("Transaction added");
    selectUser(selected.username);
  }

  async function updateTransaction(t) {
    const amount = parseFloat(prompt("Amount:", t.amount));
    if (isNaN(amount)) return;

    const purpose = prompt("Description:", t.purpose);
    const type = prompt("CREDIT or DEBIT:", t.type);

    await api.put(`/api/transactions/${t.id}`, { amount, purpose, type });
    alert("Transaction updated");
    selectUser(selected.username);
  }

  async function deleteTransaction(id) {
    if (!window.confirm("Delete transaction?")) return;
    await api.delete(`/api/transactions/${id}`);
    alert("Transaction deleted");
    selectUser(selected.username);
  }

  return (
    <div className="full-dashboard">
      {/* HEADER */}
      <div className="header">
        <div className="logo-section">
          <img src={logo} alt="logo" />
          <h1>Secure Bank of India</h1>
        </div>

        {profile && (
          <Welcome
            profile={profile}
            loginTime={
              localStorage.getItem("loginTime")
                ? new Date(Number(localStorage.getItem("loginTime")))
                : new Date()
            }
          />
        )}

        <button className="logout-button" onClick={logout} style={{ background: "none", border: "none" }}>
          <img src={logoutIcon} style={{ height: "52px", cursor: "pointer" }} alt="logout" />
        </button>
      </div>

      {/* USERS TABLE */}
      <h3 className="mt-4">Users Management</h3>
      <div className="table-container">
        <table className="table table-bordered table-hover table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} onClick={() => selectUser(u.username)}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.enabled ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT USER & TRANSACTIONS PANELS */}
      <div className="row mt-4">
        {/* LEFT PANEL */}
        <div className="col-md-6">
          <div className="panel-box">
            <h5>Edit User</h5>
            {selected ? (
              <>
                <label>Username</label>
                <input className="form-control mb-2" value={selected.username}  />

                <label>New Password</label>
                <input
                  className="form-control mb-2"
                  type="password"
                  placeholder="Enter new password"
                  value={selected.password}
                  onChange={(e) => setSelected({ ...selected, password: e.target.value })}
                />

                <label>Email</label>
                <input className="form-control mb-2" value={selected.email || ""} onChange={(e) => setSelected({ ...selected, email: e.target.value })} />

                <label>Phone</label>
                <input className="form-control mb-2" value={selected.phone || ""} onChange={(e) => setSelected({ ...selected, phone: e.target.value })} />

                <label>Balance</label>
                <input className="form-control mb-2" value={selected.balance || ""} onChange={(e) => setSelected({ ...selected, balance: e.target.value })} />

                <label>Status</label>
                <select className="form-control mb-2" value={selected.enabled} onChange={(e) => setSelected({ ...selected, enabled: e.target.value === "true" })}>
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>

                <label>Roles</label>
                <input
                  className="form-control mb-3"
                  value={selected.roles.map((r) => r.roleName).join(",")}
                  onChange={(e) => setSelected({ ...selected, roles: e.target.value.split(",").map((r) => ({ roleName: r.trim() })) })}
                />

                <button className="btn btn-success me-2" onClick={saveUser}>Save</button>
                <button className="btn btn-danger me-2" onClick={deleteUser}>Delete</button>
                <button className="btn btn-primary" onClick={addUser}>Add User</button>
              </>
            ) : (
              <p>Select a user</p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-6">
          <div className="panel-box">
            <h5>Transactions</h5>
            {selected ? (
              <>
                <table className="table table-bordered table-secondary">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Purpose</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.transactions.map((t) => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.amount}</td>
                        <td>{t.type}</td>
                        <td>{t.purpose}</td>
                        <td>
                          <button className="btn btn-sm btn-success me-2" onClick={() => updateTransaction(t)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteTransaction(t.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="btn btn-success" onClick={addTransaction}>Add Transaction</button>
              </>
            ) : (
              <p>No transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}