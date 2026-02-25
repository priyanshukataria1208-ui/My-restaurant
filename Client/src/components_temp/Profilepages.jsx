import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";

const ProfilePage = () => {

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false)



    useEffect(()=>{
const fetchUser=async()=>{
    try {
        const token=localStorage.getItem("accessToken");
        const res=await api.get("/v1/order",{Authorization:`Bearer${accessToken}`});

        setUser(res.data);

    } catch (error) {
        console.log("Profile fetch error",error)
    }
} ;  fetchUser()
    },[])

    const handleSave=()=>{
        localStorage.setItem("user",JSON.stringify(user));
        setIsEditing(false)
        toast.success("Profile updated ✅")
    }
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
    <div className="account-container">
      <div className="account-content">
        <h2>Welcome, {user.name} 👋</h2>

        <div className="profile-card">
          <div className="profile-header">
            <h3>My Profile</h3>
            <button
              className="edit-btn"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "💾 Save" : "✏️ Edit"}
            </button>
          </div>

          <div className="profile-details">
            <div className="detail-box">
              <span>Name</span>
              {isEditing ? (
                <input name="name" value={user.name} onChange={handleChange} />
              ) : (
                <p>{user.name}</p>
              )}
            </div>

            <div className="detail-box">
              <span>Email</span>
              <p>{user.email}</p>
            </div>

            <div className="detail-box">
              <span>Phone</span>
              {isEditing ? (
                <input name="phone" value={user.phone} onChange={handleChange} />
              ) : (
                <p>{user.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default ProfilePage;
