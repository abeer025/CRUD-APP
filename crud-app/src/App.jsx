import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppRoutes } from "./AppRoutes";

const App = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch Users (READ)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(AppRoutes.getUsers);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Create or Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(AppRoutes.updateUser.replace(":id", editId), form);
        setIsEditing(false);
      } else {
        await axios.post(AppRoutes.createUser, form);
      }
      setForm({ name: "", email: "" });
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    try {
      await axios.delete(AppRoutes.deleteUser.replace(":id", id));
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
    setEditId(user._id);
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">{isEditing ? "Update" : "Create"}</button>
      </form>

      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email})
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
