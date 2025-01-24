import React, { useState, useEffect, useContext } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { AuthContext } from "../context/AuthContext";
import ItemList from "./ItemList";
import { Modal, Button } from "react-bootstrap";

const TradingPlatform = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(null);
  const [showPopup, setShowPopup] = useState(true); // State for the popup

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const userDocRef = doc(db, "user-details", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUsername(userDocSnap.data().username);
        }
      }
    };
    fetchUsername();
  }, [user]);

  const handleClosePopup = () => setShowPopup(false);

  if (!user) {
    return <p>Please log in to access the trading platform.</p>;
  }

  return (
    <>
      <div>
        <h1>Welcome to SwapHub, {username || "User"}!</h1>
        {/*Conditional rendering in case the username is null*/}
        <p>Ready to make your first trade?</p>
      </div>
      <ItemList />

      {/* Modal Popup */}
      <Modal show={showPopup} onHide={handleClosePopup} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to SwapHub!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Congratulations on joining SwapHub! We're excited to help you
            exchange value with your community.{" "}
          </p>
          <p> Ready to make your first trade?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TradingPlatform;
