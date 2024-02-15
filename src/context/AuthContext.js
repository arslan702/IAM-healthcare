import Loader from "@/components/utils/Loader";
import { auth, db } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const { createContext, useContext, useEffect, useState } = require("react");

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const businessRef = doc(db, "businesses", user.uid);
        const businessDoc = await getDoc(businessRef);
        if (businessDoc.exists()) {
          setUser({
            uid: user.uid,
            ...businessDoc.data(),
          });
          localStorage.setItem("role", businessDoc?.data()?.role);
          
        } else {
          const userRef = doc(db, "Users", user.uid); // Note: 'Users' should be lowercase unless it's a case-sensitive collection name
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUser({
              uid: user?.uid,
              ...userDoc.data(),
            });
            localStorage.setItem("role", userDoc?.data()?.role);
          } else {
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const data = await signInWithEmailAndPassword(auth, email, password);
    const ref = doc(db, "Users", data?.user?.uid);
    const res = await getDoc(ref);
    localStorage.setItem("token", data?.user?.accessToken);
    // localStorage.setItem("role", res.data()?.role);
    return { ...res.data(), id: data?.user?.uid };
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
