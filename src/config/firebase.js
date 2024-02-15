import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// const isLocal = process.env.NODE_ENV === "development";

const firebaseConfig =
{
  apiKey: "AIzaSyDIae9eJu4jYDZNChOFcymexWT3CcIDVoU",
  authDomain: "salon-be909.firebaseapp.com",
  databaseURL: "https://salon-be909-default-rtdb.firebaseio.com",
  projectId: "salon-be909",
  storageBucket: "salon-be909.appspot.com",
  messagingSenderId: "378065745816",
  appId: "1:378065745816:web:b5a8d9f07cdc2ac7171ded"
}



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
