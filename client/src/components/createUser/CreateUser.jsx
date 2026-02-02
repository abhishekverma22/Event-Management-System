import React, { useState } from "react";
import api from "../../api/axios";
import "./CreateUser.css";
import { useDispatch } from "react-redux";
import { addProfile } from "../../redux/store/profileSlice";

const CreateUser = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            if (!name || !password) return;

            const res = await api.post("/api/create-profile", {
                name,
                password,
                role
            });

            if (res.data.success) {
                setMsg("User created successfully!");
                setError(false);
                setName("");
                setPassword("");
              
                if (res.data.data) {
                    dispatch(addProfile(res.data.data));
                }
            }
        } catch (err) {
            setError(true);
            setMsg(err.response?.data?.message || "Failed to create user");
        }
    };

    return (
        <div className="create-user-card">
            <h3>Create New User</h3>
            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Create User</button>
            </form>
            {msg && <p className={error ? "error-text" : "success-text"}>{msg}</p>}
        </div>
    );
};

export default CreateUser;
