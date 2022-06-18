import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR7TNQ2KuurfXcHoaTB0lT2ngLkVtuP2w",
  authDomain: "comms-chatapp.firebaseapp.com",
  projectId: "comms-chatapp",
  storageBucket: "comms-chatapp.appspot.com",
  messagingSenderId: "1007242372255",
  appId: "1:1007242372255:web:9214cf49945939fca92eaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { auth };