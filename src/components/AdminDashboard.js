import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { AuthProvider } from "../context/AuthContext"; //Corrected import

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const { user } = AuthProvider(); //rrected use of useAuth

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "user-details"));
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);
      setTotalUsers(userData.length);
    };

    if (user) {
      auth.currentUser
        .getIdTokenResult()
        .then((tokenResult) => {
          if (tokenResult.claims["admin"]) {
            fetchUsers();
          } else {
            window.location.href = "/"; // Redirect non-admins
          }
        })
        .catch((error) => {
          console.error("Error checking admin status:", error);
          // Handle error appropriately (e.g., display an error message)
        });
    }
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteDoc(doc(db, "user-details", userId));
      setUsers(users.filter((user) => user.id !== userId));
      setTotalUsers(users.length - 1);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>User Details</h2>
      <p>Total Users: {totalUsers}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>ID Number</th>
            <th>Location</th>
            <th>Email</th>
            {/* Add other fields as needed from your user-details collection */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.mobileNumber}</td>
              <td>{user.idNumber}</td>
              <td>{user.location}</td>
              <td>{user.email}</td>
              {/* Add other fields as needed, handling nested objects like locationDetails */}
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
