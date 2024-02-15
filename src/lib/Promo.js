import { auth, db } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const addPromo = async (data) => {
  // console.log("data", data);
  data.status = "active";
  data.SpaEmail = auth.currentUser.email;
  data.createdAt = new Date();

  const ref = doc(db, "promoCodes", uuidv4());
  await setDoc(ref, data, { merge: true });
  const getRef = doc(db, "promoCodes", ref.id);
  const res = await getDoc(getRef);
  return res.data()
    ? {
        data: { ...res.data(), id: res.id },
        message: "Promo Code added successfully!",
        code: 1,
      }
    : {
        message: "Something went wrong!",
        code: 0,
      };
};

const getPromos = async () => {
  const promoQuery = query(collection(db, "promoCodes"));
  // Subscribe to changes in real-time
  const unsubscribe = onSnapshot(promoQuery, (querySnapshot) => {
    const docs = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().SpaEmail === auth.currentUser.email) {
        docs.push({ ...doc.data(), id: doc.id });
      }
    });
    return docs;
  });
  return () => unsubscribe();
};

const updatePromo = async (id, Promo) => {
  const ref = doc(db, "promoCodes", id);
  await setDoc(ref, Promo, { merge: true });
};

const PromoApi = {
  addPromo,
  getPromos,
  updatePromo,
};

export default PromoApi;
