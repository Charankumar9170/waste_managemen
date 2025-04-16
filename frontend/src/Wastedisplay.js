import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViewLocationButton from "./ViewLocationButton";
export default function Wastedisplay() {
  const [wasteReports, setWasteReports] = useState([]);
  const [statusMap, setStatusMap] = useState({}); // Store status for each report
  // Load statuses from local storage when component mounts
  const navigate = useNavigate();
  const[progress,setProgress]=useState(0);
  const[processed,setProcessed]=useState(0);
  const[rewards,setRewards] =useState();
  useEffect(() => {
    fetch("http://localhost:5000/progress")
      .then((response) => response.json())
      .then((data) => setProgress(data.progress))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/processed")
      .then((response) => response.json())
      .then((data) => setProcessed(data.processed))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/fetch_rewards") // API call to backend
      .then((response) => response.json())
      .then((data) => setRewards(data.rewards)) // Store value in state
      .catch((error) => console.error("Error fetching progress:", error));
  }, []);
  

  useEffect(() => {
    const storedStatus = JSON.parse(localStorage.getItem("reportStatus")) || {};
    setStatusMap(storedStatus);
  }, []);

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
  const setStatus = (id) => {
    const updatedStatus = { ...statusMap, [id]: "Under Progress" };
    setStatusMap(updatedStatus);
    localStorage.setItem("reportStatus", JSON.stringify(updatedStatus)); // Save to local storage
  };
  // Function to delete a report by ID
  const deleteReport = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/reports/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWasteReports(wasteReports.filter((report) => report.id !== id)); // Update state
        alert("Report completed!");
        window.location.reload();
      } else {
        alert("Failed to delete report.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchWasteReports();
  }, []);
//for progress count

  if (wasteReports.length === 0) {
    return <p style={{ textAlign: "center", fontSize: "18px", color: "#777" }}>No waste reports available</p>;
  }
  //update status
const updateStatus = (id) => {
  fetch("http://localhost:5000/update_status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fieldValue: id }), // Send correct fieldValue
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      if (data.message === "Field updated successfully!") {
        // Only update state if the database update was successful
        setStatus(id);
        incrementProgress();
      }
    })
    .catch((error) => console.error("Error updating data:", error));
};

  //update progress
  const incrementProgress = () => {
    const Value = progress + 1;
    setProgress(Value);
  
    fetch("http://localhost:5000/api/update_progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fieldValue: Value }), // Update specific field
    })
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((error) => console.error("Error updating data:", error));
  };
  //update processed
  const incrementProcessed = () => {
    const newValue = processed + 1;
    setProcessed(newValue);
    const Value = progress - 1;
    setProgress(Value);
  
    fetch("http://localhost:5000/api/update_processed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fieldValue: newValue }), // Update specific field
    })
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((error) => console.error("Error updating data:", error));
      fetch("http://localhost:5000/api/update_progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fieldValue: Value }), // Update specific field
      })
        .then((response) => response.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.error("Error updating data:", error));
  };
    //update progress
    const updateRewards = () => {
      const Value = rewards + 5;
      setProgress(Value);
    
      fetch("http://localhost:5000/api/update_rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fieldValue: Value }), // Update specific field
      })
        .then((response) => response.json())
        .then((data) => console.log(data.message))
        .catch((error) => console.error("Error updating data:", error));
    };

  return (
    <div>
    <button onClick={() => navigate("/Login/dashboard")} style={{marginLeft:"10px",marginTop:"10px"}}>back</button>
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px", textAlign: "center" }}>Waste Reports</h2>
      {/* Reports List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
        {wasteReports.map((item) => (
          <div 
            key={item.id} 
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "220px",
              boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#f9f9f9",
              textAlign: "center"
            }}
          >
            <h3 style={{ margin: "0%" }}>{statusMap[item.id] || "New"}</h3>
            {item.image_path && (
              <img 
                src={`http://localhost:5000/uploads/${item.image_path}`} 
                alt="Waste" 
                style={{ width: "100%", height: "auto", borderRadius: "5px", marginBottom: "10px" }} 
              />
            )}
            <p style={{ fontSize: "14px" }}><strong>Address:</strong> {item.address}</p>
            <p style={{ fontSize: "14px" }}><strong>Quantity:</strong> {item.quantity} kg</p>
            
            <p style={{ fontSize: "10px", color: "#666" }}><strong>Reported On:</strong> {new Date(item.created_at).toLocaleString()}</p>
            
            {/* Assign Button (Disabled if already assigned) */}
            <button 
              style={{ 
                marginTop: "10px", 
                padding: "8px 12px", 
                backgroundColor: statusMap[item.id] ? "gray" : "orange", 
                color: "black", 
                border: "none", 
                borderRadius: "5px", 
                cursor: statusMap[item.id] ? "not-allowed" : "pointer"
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "rgb(200,100,0)")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "orange")}
              onClick={() => {setStatus(item.id);incrementProgress();updateStatus(item.id)}}
              disabled={!!statusMap[item.id]} // Disable if already assigned
            >
              Assign
            </button>

            {/* Delete Button */}
            <button 
              onClick={() => {deleteReport(item.id);incrementProcessed();updateRewards()}} 
              onMouseEnter={(e) => (e.target.style.backgroundColor = "rgb(0,200,0)")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "green")}
              style={{ 
                marginTop: "10px", 
                padding: "8px 12px", 
                backgroundColor: "green", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer", 
                marginLeft: "5px",
              }}
            >
              Completed
            </button>
            <ViewLocationButton latitude={item.latitude} longitude={item.longitude} />
          </div>
        ))}
      </div>
      
    </div>
    </div>
  );
}


