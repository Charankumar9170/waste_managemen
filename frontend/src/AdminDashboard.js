
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/progress") // API call to backend
      .then((response) => response.json())
      .then((data) => setProgress(data.progress)) // Store value in state
      .catch((error) => console.error("Error fetching progress:", error));
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/processed") // API call to backend
      .then((response) => response.json())
      .then((data) => setProcessed(data.processed)) // Store value in state
      .catch((error) => console.error("Error fetching processed:", error));
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/total") // Adjust the URL if needed
      .then((response) => response.json())
      .then((data) => setTotal(data.total_records))
      .catch((error) => console.error("Error fetching total records:", error));
  }, []);

 
  // Fetch admin details from local storage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      navigate("/login", { replace: true }); // Redirect if no admin is logged in
    }

  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("admin"); // Clear stored admin data
    navigate("/", { replace: true }); // Redirect to login page
  };

  // Handle clicks outside the profile section
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  return (
    <div style={styles.body}>
      {/* Profile Icon at the Top Right */}
      <div style={styles.profileIcon} onClick={() => setShowProfile(!showProfile)}>
        👤
      </div>

      {/* Profile Dropdown (Visible on Click) */}
      {showProfile && (
        <div ref={profileRef} style={styles.profileCard}>
          <h3>👤 {admin?.name}</h3>
          <p><strong>Email:</strong> {admin?.email}</p>
          <p><strong>Role:</strong> Waste Management Admin</p>
          <button style={styles.logoutButton} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      <div style={styles.container}>
        <h2 style={styles.title}>Admin Dashboard</h2>

        {/* Waste Management Summary */}
        <div style={styles.summary}>
          <h3>Waste Management Summary</h3>
          <p>🔹 Total Reports Processed: {processed}</p>
          <p>🔹 Reports Received: {total}</p>
          <p>🔹 Pending Reports: {progress}</p>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button style={styles.button} 
          
          onClick={() => navigate("/reports")}>
            📑 View Reports
          </button>
        </div>
      </div>
    </div>
  );
}

// Updated Styles
const styles = {
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    position: "relative",
  },
  profileIcon: {
    position: "absolute",
    top: "15px",
    right: "20px",
    fontSize: "24px",
    cursor: "pointer",
    background: "#007bff",
    color: "#fff",
    padding: "10px",
    borderRadius: "50%",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  profileCard: {
    position: "absolute",
    top: "50px",
    right: "20px",
    padding: "15px",
    background: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    minWidth: "220px",
  },
  container: {
    maxWidth: "600px",
    marginTop: "80px",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  summary: {
    padding: "15px",
    background: "#e9ecef",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    background: "#007bff",
    color: "#fff",
  },
  logoutButton: {
    marginTop: "10px",
    background: "#dc3545",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
}; 
