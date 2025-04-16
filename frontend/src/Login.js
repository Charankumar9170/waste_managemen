
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.error || "Login failed!");
      }
      localStorage.setItem("admin", JSON.stringify(data.admin));
      localStorage.setItem("isAuthenticated", "true");  // Store admin details
      navigate("dashboard"); // Redirect to dashboard

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div>
    <button onClick={() => navigate("/")} style={{marginLeft:"10px",marginTop:"10px"}}>back</button>
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button type="submit" disabled={loading} style={{ background: "#28a745", color: "#fff", padding: "10px", width: "100%", borderRadius: "5px", border: "none", cursor: "pointer" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div style={{display:"flex"}}>
        <p style={{margin:"0%",marginRight:"5%",paddingTop:"5px"}}>create an account</p>
        <a style={{margin:"0%",marginTop:"5px"}} href="/Signup">signup</a>
        </div>
      </form>
    </div>
    </div>
  );
}
