import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Uploadwaste() {
  const [formData, setFormData] = useState({
    image: null,
    address: "",
    quantity: "",
    location: { lat: "", lng: "" },
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error("Error fetching location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("image", formData.image);
    formDataObj.append("address", formData.address);
    formDataObj.append("quantity", formData.quantity);
    formDataObj.append("latitude", formData.location.lat);
    formDataObj.append("longitude", formData.location.lng);
  
    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        body: formDataObj,
      });
  
      const result = await response.json();
      console.log("Server Response:", result);
      alert("Data submitted successfully!");
      window.location.reload(); 
    } catch (error) {
      alert("Error submitting form:", error);
    }
  };
  

  return (
    <div>
    <button onClick={() => navigate("/")} style={{marginLeft:"10px",marginTop:"10px"}}>back</button>
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto",marginTop:"30px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "2px 2px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Report Waste</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} required style={{ padding: "5px" }} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
        <input type="number" name="quantity" placeholder="Estimated Quantity (kg)" value={formData.quantity} onChange={handleChange} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
        <button type="button" onClick={getLocation} style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Fetch Location</button>
        {formData.location.lat && (
          <p style={{ fontSize: "14px", color: "#666" }}>Location: {formData.location.lat}, {formData.location.lng}</p>
        )}
        <button type="submit" style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit</button>
      </form>
    </div>
    </div>
  );
}
