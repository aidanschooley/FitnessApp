// src/pages/Dashboard.jsx
import SideMenu from "../components/sideMenu.jsx";
import Login from "./Login.jsx";
import DashCard from "../components/Dashcard.jsx";
import FeedPost from "../components/feedpost.jsx";
import ActivityAnalyzer from "../components/ActivityAnalyzer.jsx";

function Dashboard() {
   const user = localStorage.getItem('user'); // Retrieve user data from local strorage
  
      // If the user is not logged in render the login form
      if (!user){
          return <>
              <div className="d-flex">
              {/* Sidebar */}
              <SideMenu />
              {/* Main content */}
              <div className="flex-grow-1 p-4">
                <h1>Dashboard Page</h1>
                <h3>Welcome to the Dashboard!</h3>
                <div className="container">
                  <div className="row">
                   <DashCard
                    content={{title:"Water Intake", content:"Track your daily water consumption here.", defaultValue:"0 oz"}}
                    />
                    <DashCard
                    content={{title:"Calories Consumed", content:"Monitor your daily calorie intake.", defaultValue:"0 kcal"}}
                    />
                  </div>
                  <div className="row">
                    <DashCard
                    content = {{title:"Distance", content:"Log the distance you've covered today.", defaultValue:"0 miles"}}
                    />
                    <DashCard
                    content={{title: "Current Weight", content:"Keep an eye on your weight progress.", defaultValue:"0 lbs"
                    }}
                    />
                  </div>  
              </div>
            </div>
          </div>
          <h1>Feed</h1>
          <FeedPost />
          <FeedPost />
          <FeedPost />
          </>  
      } else{
          return <>
              {/*Sends not signed in guest to login page */}
              <Login />
          </>   
      }
  } 
 
export default Dashboard;
