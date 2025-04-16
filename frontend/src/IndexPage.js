import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./IndexPage.css"; // Import the CSS file

function IndexPage() {
  const navigate = useNavigate();
  const [rewards,setRewards]=useState();
  useEffect(() => {
    fetch("http://localhost:5000/fetch_rewards") // API call to backend
      .then((response) => response.json())
      .then((data) => setRewards(data.rewards)) // Store value in state
      .catch((error) => console.error("Error fetching progress:", error));
  }, []);
  return (
    <div>
    

      {/* Hero Section */}
      <div className="hero">
        <div className="rewards">
          <h4><bold>💰 Rewards : </bold>{rewards}</h4>
        </div>
        <div className="items">
        <h2>Join Us in Keeping Our Streets Clean!</h2>
        <p>Report waste in your area, and let’s work together for a cleaner environment.</p>
        <button id ="uploads" onClick={() => navigate("/uploadwaste")} >Upload Waste</button>
        <button id="history" onClick={() => navigate("/history")} >History</button>
        </div>
      </div>

      {/* Buttons for Admin Login & Signup */}
      <div className="button-container">
        <button onClick={() => navigate("/Login")}>Admin Login</button>
        <button onClick={() => navigate("/Signup")}>Sign Up</button>
      </div>

      {/* Waste Management Content */}
      <div className="content">
        <h3>Why Waste Management Matters</h3>
        <div className="card-container">
          <div className="card">
            <img src="https://images.unsplash.com/flagged/photo-1572213426852-0e4ed8f41ff6?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Garbage Issue" />
            <h4>The Impact of Waste</h4>
            <p>Poor waste disposal leads to pollution, harming both the environment and public health.</p>
          </div>

          <div className="card">
            <img src="https://plus.unsplash.com/premium_photo-1683133531613-6a7db8847c72?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Recycling" />
            <h4>Recycling Benefits</h4>
            <p>Recycling helps reduce waste, conserve natural resources, and lower pollution levels.</p>
          </div>

          <div className="card">
            <img src="https://media.istockphoto.com/id/1002555134/photo/cleaning-the-environment-together.jpg?s=612x612&w=0&k=20&c=3tu8y7n_yrEIZ-R3gNAoQS5xxfMKDmqNeRbibGuTvlI=" alt="Clean Environment" />
            <h4>How You Can Help</h4>
            <p>Report waste, segregate recyclables, and spread awareness to create a sustainable future.</p>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>© 2025 Streetclean Connect , Waste Management.</p>
        <div id="details" class="contact-info">
            <h3>Contact Us</h3>
            <p>Email: <a href="mailto:charansagar721@gmail.com">charansagar721@gmail.com</a></p>
            <p>Phone: <a href="tel:+1234567890">+91 9133064628</a></p>
            <p>Address: 203, Prime View, Film Nagar Road No 07, Hyderabad - 500096</p>
        </div>
    </div>
    </div>
  );
}
export default IndexPage;
