import { db } from "../config/firebase";
import {
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

// Add New ServiceCategory
const addServiceCategory = async (data) => {
  const snapshot = collection(db, "ServiceCategories");
  let q = query(snapshot, where("name", "==", data?.name), where("SpaEmail", "==", data?.SpaEmail));
  const categoryExist = await getDocs(q);

  if (categoryExist.docs.length > 0) {
    return {
      message: "Category already exist!",
      code: 0,
    };
  } else {
  const ref = doc(db, "ServiceCategories", uuidv4());
  await setDoc(ref, data, { merge: true });
  const getRef = doc(db, "ServiceCategories", ref.id);
  const res = await getDoc(getRef);
  return res.data()
    ? {
        data: { ...res.data(), id: res.id },
        message: "ServiceCategory added successfully!",
        code: 1,
      }
    : {
        message: "Something went wrong!",
        code: 0,
      };
    }
};

const addSpecialists = async (data) => {
  const snapshot = collection(db, "specialists");
  let q = query(snapshot, where("name", "==", data?.name),where("SpaEmail", "==", data?.SpaEmail));
  const specialistExist = await getDocs(q);

  if (specialistExist.docs.length > 0) {
    return {
      message: "Specialist already exist!",
      code: 0,
    };
  } else {
  const ref = doc(db, "specialists", uuidv4());
  await setDoc(ref, data, { merge: true });
  const getRef = doc(db, "specialists", ref.id);
  const res = await getDoc(getRef);
  return res.data()
    ? {
        data: { ...res.data(), id: res.id },
        message: "specialist added successfully!",
        code: 1,
      }
    : {
        message: "Something went wrong!",
        code: 0,
      };
    }
};

// Get All ServiceCategories
const getServiceCategories = async (email) => {
  const ref = collection(db, "ServiceCategories");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      if (doc.data().SpaEmail === email) {
        const data = doc.data();
        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      }
    });
    // console.log("unsorted docs", docs);
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
    // console.log("sorted docs", docs);
    return docs;
  }
};
const getServiceCategoriesAdmin = async (email) => {
  const ref = collection(db, "ServiceCategories");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      if (doc.data().SpaEmail === email) {
        const data = doc.data();
        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      }
    });
    // console.log("unsorted docs", docs);
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
    // console.log("sorted docs", docs);
    return docs;
  }
};

const getSpecialists = async (email) => {
  const ref = collection(db, "specialists");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      if (doc.data().SpaEmail === email) {
        const data = doc.data();
        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      }
    });
    // console.log("unsorted docs", docs);
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
    // console.log("sorted docs", docs);
    return docs;
  }
};

// Update ServiceCategory
const updateServiceCategory = async (id, ServiceCategory) => {
  // console.log("ServiceCategory in update api", ServiceCategory);
  const ref = doc(db, "ServiceCategories", id);
  await setDoc(ref, ServiceCategory, { merge: true });
  return {
    ...ServiceCategory,
    id,
  };
};

const updateSpecialists = async (id, specialists) => {
  // console.log("specialists in update api", specialists);
  const ref = doc(db, "specialists", id);
  await setDoc(ref, specialists, { merge: true });
  return {
    ...specialists,
    id,
  };
};

// Delete ServiceCategory
const deleteServiceCategory = async (id) => {
  const ref = doc(db, "ServiceCategories", id);
  await deleteDoc(ref);
  console.log("DELETED");
  return id;
};

const deleteSpecialists = async (id) => {
  const ref = doc(db, "specialists", id);
  await deleteDoc(ref);
  console.log("DELETED");
  return id;
};

// Update ServiceCategory Status
const activateServiceCategory = async (ServiceCategory) => {
  const data = {
    id: ServiceCategory.key,
    name: ServiceCategory.name,
    isEnabled: true,
  };
  const ref = doc(db, "ServiceCategories", ServiceCategory.key);
  await setDoc(ref, data, { merge: true });
  return data;
};
// Update ServiceCategory Status
const deActivateServiceCategory = async (ServiceCategory) => {
  const data = {
    id: ServiceCategory.key,
    name: ServiceCategory.name,
    isEnabled: false,
  };
  const ref = doc(db, "ServiceCategories", data.id);
  await setDoc(ref, data, { merge: true });
  return data;
};
const updateServiceStatus = async (id, status) => {
  // console.log("stt--", status)
  const ref = doc(db, "services", id);
  await setDoc(ref, { status: status }, { merge: true });
  // console.log("DATA UPDATED with values", status);
  return {
    ...status,
    id,
  };
};

const ServiceCategoryApi = {
  addServiceCategory,
  getServiceCategories,
  updateServiceCategory,
  activateServiceCategory,
  deActivateServiceCategory,
  deleteServiceCategory,
  getServiceCategoriesAdmin,
  addSpecialists,
  getSpecialists,
  updateSpecialists,
  deleteSpecialists,
  updateServiceStatus,
};

export default ServiceCategoryApi;
