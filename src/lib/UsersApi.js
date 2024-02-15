import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth, db } from "@/config/firebase";

// Get All Users
const getUsers = async () => {
  try {
    const ref = collection(db, "Users");
    let q = query(ref, where("role","!=","admin"))
    const res = await getDocs(q);
    let docs = [];
    if (res.docs.length <= 0) {
      return [];
    } else {
      res.forEach((doc) => {
        docs.push({
          ...doc.data(),
          id: doc.id,
          createdAt: doc?.data()?.createdAt
            ? new Date(doc.data().createdAt)
            : undefined,
        });
      });
      // Sort the documents in descending order based on createdAt timestamp
      docs.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) {
          return 0; // If both are undefined, maintain the current order
        }
        if (!a.createdAt) {
          return 1; // If only a is undefined, b should come first
        }
        if (!b.createdAt) {
          return -1; // If only b is undefined, a should come first
        }
        return b.createdAt - a.createdAt;
      });

      return docs;
    }
  } catch (error) {
    console.log(error);
  }
};

// Update User
const updateUser = async (UserId, User) => {
  // console.log("project id", projectId);
  // console.log("project", project);
  const ref = doc(db, "Users", UserId);
  // delete project.id;
  await setDoc(ref, User, { merge: true });
  // console.log("project", project);
  return {
    ...User,
    id: UserId,
  };
};

// Add User

const addUser = async (data) => {
  // console.log("data of adding guser", data);
  const snapshot = collection(db, "Users");
  let q = query(snapshot, where("email", "==", data?.email));
  const userExist = await getDocs(q);

  if (userExist.docs.length > 0) {
    return {
      message: "User already exists!",
      code: 0,
    };
  } else {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data?.email,
      data?.email
    );
    const user = userCredential.user;
    // console.log("userID", user.uid);
    const collectionRef = collection(db, "Users");
    const docRef = doc(collectionRef, user.uid);
    await setDoc(docRef, data, { merge: true });
    const getRef = doc(db, "Users", user.uid);
    const res = await getDoc(getRef);
    return res.data()
      ? {
          data: { ...res.data(), id: res.id },
          message: "User added successfully!",
          code: 1,
        }
      : {
          message: "Something went wrong!",
          code: 0,
        };
  }
};

// Delete User also from authentication
const deleteUserr = async (id) => {
  const ref = doc(db, "Users", id);
  await deleteDoc(ref);
  deleteUser(id).then(() => {
    console.log("user deleted");
  }).catch((error) => {
    console.log("delete user error", error);
  });
  // try {
  //     await deleteUser(auth, id);
  // } catch (error) {
  //     console.log(error)
  // }
  return id;
};

const UsersApi = {
  getUsers,
  updateUser,
  addUser,
  deleteUser: deleteUserr,
};

export default UsersApi;
