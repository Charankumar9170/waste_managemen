import { useState} from "react";
import { useNavigate } from "react-router-dom";
export default function AdminSignup() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("registration completed");
        setAdminData({ name: "", email: "", password: "" });
      } else {
        setMessage(result.error || "Failed to sign up");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setMessage("Something went wrong. ");
    }
  };

  return (
    <div>
    <button onClick={() => navigate("/")} style={{marginLeft:"10px",marginTop:"10px"}}>back</button>
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" , border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"}}>
      
      <h2 style={{ textAlign: "center" }}>Admin Signup</h2>
      {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name="name"
          placeholder="Admin Name"
          value={adminData.name}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={adminData.email}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "8px"}}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={adminData.password}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" ,borderRadius:"10px"}}>
          Sign Up
        </button>
      </form>
      Already have an account ,<a href="/Login">login</a>
      
    </div>
    </div>
  );
}
