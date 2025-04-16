import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function History() {
  const [wasteReports, setWasteReports] = useState([]); // Store status for each report
  //const [statusMap, setStatusMap] = useState({});
  // Load statuses from local storage when component mounts
  const navigate = useNavigate();

  // Fetch waste reports from the backend
  const fetchWasteReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/reports"); // API URL
      const result = await response.json();
      setWasteReports(result);
    } catch (error) {
      console.error("Error fetching waste reports:", error);
    }
  };

  // Function to set report status
  // Function to delete a report by ID
  // Fetch data when the component loads
  useEffect(() => {
    fetchWasteReports();
  }, []);
  // useEffect(() => {
  //   const storedStatus = JSON.parse(localStorage.getItem("reportStatus")) || {};
  //   setStatusMap(storedStatus);
  // }, []);
//for progress count

  if (wasteReports.length === 0) {
    return <p style={{ textAlign: "center", fontSize: "18px", color: "#777" }}>No waste reports available</p>;
  }
  //update progress
  return(
    <div>
      <button
        onClick={() => navigate("/")}
        style={{
          marginLeft: "10px",
          marginTop: "10px",
          padding: "8px 12px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back
      </button>

      <div style={{ padding: "20px", maxWidth: "80%", margin: "auto" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          History
        </h2>

        {/* Reports List - Stacked one by one */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {wasteReports.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                width: "100%",
                boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#f9f9f9",
              }}
            >
              {/* Image */}
              {item.image_path && (
                <img
                  src={`http://localhost:5000/uploads/${item.image_path}`}
                  alt="Waste"
                  style={{
                    width: "300px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              )}

              {/* Report Details */}
              <div
                style={{
                  flex: 1, // Ensures consistent width for all address divs
                  padding: "10px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  marginLeft: "40px",
                  marginRight:"100px"
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Address:</strong> {item.address}
                </p>
                <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                  <strong>Quantity:</strong> {item.quantity} kg
                </p>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  <strong>Reported On:</strong>{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <div
               style={{
                marginRight:"40px"
              }}
              >
                <h3 style={{ margin: "0%" }}>{item.status}</h3>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};