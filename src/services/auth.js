import { auth } from "./firebase"; //Import your Firebase auth service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

//Sign up function
export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error("Signup failed: " + error.message);
  }
};

//Login function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

//Logout function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Logout failed: " + error.message);
  }
};

//Check authentication state function
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};
