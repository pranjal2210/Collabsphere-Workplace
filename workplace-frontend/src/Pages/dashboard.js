import React from "react";
import '../styles/dashboard.css';
import Header from '../components/header';
import Footer from "../components/footer";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <Header />

      <div className="main">
        <div className="subHeader">
          <video className='videoTag' src='/images/video6.mp4' autoPlay loop muted />
          <div className="left">
            <h1>Take a deeper dive into a<br /> new way to work.</h1>
            <h3>Creating a collaborative sphere for effective workplace management.</h3>
          </div>
        </div>
        <div className="features" id="features">
          <div className="card">
            <div className="left1">
              <h1>Move faster with your tools <br />in one place</h1>
              <h3>Automate away routine tasks with the power of generative AI and simplify your workflow with all your favourite apps ready to go in CollabSphere.</h3>
            </div>
            <div className="right1">
              <img src="/images/07.png" alt="rightImg" />
            </div>

          </div>
          <div className="card">
            <div className="right1">
              <img src="/images/13.png" alt="rightImg" />
            </div>
            <div className="left1">
              <h1>Choose how you want to work</h1>
              <h3>In CollabSphere, you’ve got all the flexibility to work when, where and how it’s best for you. You can easily chat, send audio and video clips, or join a huddle to talk things through live.</h3>
            </div>


          </div>
          <div className="card">
            <div className="left1">
              <h1>Bring your team together</h1>
              <h3>At the heart of CollabSphere are channels: organised spaces for everyone and everything that you need for work. In channels, it’s easier to connect across departments, offices, time zones and even other companies.</h3>
            </div>
            <div className="right1">
              <img src="/images/15.png" alt="rightImg" />
            </div>

          </div>

        </div>
        <div className="community" id="community">
          <img src="/images/community2.jpg" style={{width:"100%",height:"100%",position:"absolute",top:"0",left:"0",objectFit:"cover",filter:'brightness(0.5)'}}/>
          <div className="left2">
            <h1>Introducing Communities</h1>
            <h3>Bring your community together in one place to make <br />announcements, plan events, and get more done.<br /> Join or create your own community today.</h3>
            <button className="btn">
              Create your community &rarr;
            </button>
          </div>
          <Footer />
        </div>
      </div>

    </>
  );
}
export default Dashboard;
