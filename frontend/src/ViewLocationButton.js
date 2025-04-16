import React from "react";

const ViewLocationButton = ({ latitude, longitude }) => {
  const openLocationInMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div >
      <button 
              onClick={openLocationInMaps} 
              style={{ 
                marginTop: "10px", 
                padding: "8px 12px", 
                backgroundColor: "lightgreen", 
                color: "black", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer", 
                marginLeft: "5px"
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "green")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "lightgreen")}
            >
              View Location
            </button>
    </div>
  );
};

export default ViewLocationButton;