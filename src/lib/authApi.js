import { notification } from "antd";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { sendPasswordResetEmail, signOut, updateEmail } from "firebase/auth";
import { auth, db } from "@/config/firebase";

// const { auth, db } = require("@/config/firebase");
// const { signOut, updateEmail, sendPasswordResetEmail } = require("firebase/auth");

// Logout user
const logout = async () => {
  await signOut(auth)
    .then(
      () => console.log("logout"),
      localStorage.removeItem("role"),
      localStorage.removeItem("token")
    )
    .catch((e) => console.log("error", e));
};

const updateProfile = async (email, data) => {
  const userRef = doc(db, "users", id);
  const res = await getDoc(userRef);
  if (res.data().email === data.email) {
    await setDoc(userRef, data, { merge: true });
    notification.open({
      type: "success",
      message: "Profile updated successfully",
      placement: "top",
    });
    return data;
  } else {
    updateEmail(auth.currentUser, data.email)
      .then(async () => {
        const ref = doc(db, "users", id);
        await setDoc(ref, data, { merge: true });
        return data;
      })
      .catch((e) => {
        notification.open({
          message: "Please login again to update profile!",
          type: "error",
          placement: "top",
        });
      });
  }
};

// get all orders
const getAllCustomers = async () => {
  const ref = collection(db, "customers");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });
    return docs;
  }
};

//get SPA and check it's status and then decide either login them or not
const getSPA = async (email) => {
  // Assuming you have a "products" collection in your database
  const productsRef = collection(db, "businesses");
  // console.log("ID OF SPA USERS", userId)

  // Query for products with matching userId
  const querySnapshot = await getDocs(
    query(productsRef, where("email", "==", email))
  );

  const products = [];
  querySnapshot.forEach((doc) => {
    products.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  if (products[0]?.status === "active") {
    return { code: 1, role: products[0]?.role };
  } else if (products[0]?.status === "deactive") {
    return { code: 0, role: products[0]?.role };
  } else if (products[0]?.status === "pending") {
    return { code: 2, role: products[0]?.role };
  }
};

// Reset password
const resetPassword = async (email) => {

  try {
    const buisnessCollection = collection(db, "businesses");

    const buisness = await getDocs(query(buisnessCollection, where("email", "==", email)));

    if (!buisness.empty) {
      const email = buisness.docs[0].data().email;
      if (email) {
        await sendPasswordResetEmail(auth, email);
        notification.open({
          message: "Password reset link sent to your email!",
          type: "success",
          placement: "top",
        });
        return Promise.resolve();
      }

      
    }

    notification.open({
      message: "Buisness does not exist!",
      type: "error",
      placement: "top",
    });
  } catch (error) {
          console.log(error);
  }

}
const authApi = {
  logout,
  resetPassword,
  updateProfile,
  getAllCustomers,
  getSPA,
};

export default authApi;
