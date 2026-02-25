import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "./context/AuthContext";

const API = "http://localhost:3000/api/v1/getuser";

const UserProduct = () => {
  const { accessToken,role } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (accessToken) fetchUsers();
  }, [accessToken]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const deactivateUser = async (id) => {
    try {
      const res = await axios.put(
        `${API}/deactivate/${id}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API}/${editUser._id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(users.map((u) => (u._id === editUser._id ? res.data : u)));
      setEditUser(null);
      setFormData({ name: "", email: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-container">
      <h2 className="title">👥 User Management Dashboard</h2>

      {editUser && (
        <form onSubmit={handleUpdate} className="edit-form">
          <h3>Edit User</h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="Edit Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Edit Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn save">Save</button>
          <button
            type="button"
            className="btn cancel"
            onClick={() => setEditUser(null)}
          >
            Cancel
          </button>
        </form>
      )}

      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? "✔️ Active" : "❌ Off"}</td>
              <td>
                <button
                  className="btn update"
                  onClick={() => {
                    setEditUser(user);
                    setFormData({ name: user.name, email: user.email });
                  }}
                >
                  Update
                </button>

                <button
                  className="btn delete"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>

                {user.isActive && (
                  <button
                    className="btn deactivate"
                    onClick={() => deactivateUser(user._id)}
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserProduct;
