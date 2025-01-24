import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Assuming you use a context for auth
import { auth } from "./services/firebase";

// Import your components
import ItemList from "./components/ItemList";
import ItemDetails from "./components/ItemDetails";
import UploadForm from "./components/UploadForm";
import UserLogin from "./components/UserLogin";
import UserProfile from "./components/UserProfile";
import TradeRequest from "./components/TradeRequest";
import NotFound from "./components/NotFound"; // Handle not found routes
import HomePage from "./components/home";
import UserRegistration from "./components/UserRegistration";
/**
 * The App component serves as the main entry point of the application, managing
 * user authentication state and defining the routing structure using React Router.
 * It utilizes Firebase Authentication to track the logged-in user and provides
 * the AuthContext to share user data across components. The component renders
 * different routes, including login, item browsing, item details, item upload,
 * user profile, trade requests, and a 404 Not Found page for undefined routes.
 */

function App() {
  const [user, setUser] = useState(null); // Track the logged-in user

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      // Set the user state based on Firebase auth state change
      setUser(authUser);
    });
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  return (
    <Router>
      {" "}
      {/* Wrap your app in a Router */}
      <AuthProvider value={{ user, setUser }}>
        {" "}
        {/* Provide user context */}
        <div className="App">
          <Routes>
            {" "}
            {/* Use Routes for defining routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/ItemList" element={<ItemList />} />
            <Route path="/items/:itemId" element={<ItemDetails />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route
              path="/profile"
              element={user ? <UserProfile /> : <UserLogin />}
            />{" "}
            {/* Protect profile route */}
            <Route path="/trade/:itemId" element={<TradeRequest />} />
            <Route path="*" element={<NotFound />} />{" "}
            {/* Catch-all for undefined routes */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
