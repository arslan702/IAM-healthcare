import { auth, db } from "../config/firebase";
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

// Add New Service
const addService = async (data) => {
  const snapshot = collection(db, "services");
  let q = query(snapshot, where("name", "==", data?.name), where("SpaEmail", "==", data?.SpaEmail));
  const serviceExist = await getDocs(q);

  if (serviceExist.docs.length > 0) {
    return {
      message: "Service already exist!",
      code: 0,
    };
  } else {
  const ref = doc(db, "services", uuidv4());
  await setDoc(ref, data, { merge: true });
  const getRef = doc(db, "services", ref.id);
  const res = await getDoc(getRef);
  return res.data()
    ? {
        data: { ...res.data(), id: res.id },
        message: "Service added successfully!",
        code: 1,
      }
    : {
        message: "Something went wrong!",
        code: 0,
      };
    }
};

// Get Single Service By Id
// const getService = async (id) => {
// };

// Get All services
const getServices = async (email) => {
  const ref = collection(db, "services");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      const data = doc.data();
      if (data.SpaEmail === email) {
        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      }
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
};
const getAllServices = async () => {
  const ref = collection(db, "services");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      docs.push({
        ...doc.data(),
        id: doc.id,
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
};
const getCategories = async () => {
  const ref = collection(db, "ServiceCategories");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      const data = doc.data();
      if (data.SpaEmail === auth.currentUser.email) {
        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      }
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
};
const getServicesForAdmin = async (email) => {
  const ref = collection(db, "services");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      const data = doc.data();
      if (data.SpaEmail === email) {
        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      }
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
};

// Update Service
const updateService = async (id, Service) => {
  // console.log("Service in api", Service);
  const ref = doc(db, "services", id);
  await setDoc(ref, Service, { merge: true });
  return {
    ...Service,
    id,
  };
};

// Delete Service
const deleteService = async (id) => {
  const ref = doc(db, "services", id);
  await deleteDoc(ref);
  console.log("DELETED");
  return id;
};

// Update Service Status
const activateService = async (Service) => {
  const data = {
    id: Service.key,
    name: Service.name,
    isEnabled: true,
  };
  const ref = doc(db, "services", Service.key);
  await setDoc(ref, data, { merge: true });
  return data;
};
// Update Service Status
const deActivateService = async (Service) => {
  const data = {
    id: Service.key,
    name: Service.name,
    isEnabled: false,
  };
  const ref = doc(db, "services", data.id);
  await setDoc(ref, data, { merge: true });
  return data;
};

// Add New Specialist
const addSpecialists = async (data) => {
  // console.log("data", data);
  data.createdAt = new Date();
  const snapshot = collection(db, "specialists");
  let q = query(snapshot, where("name", "==", data.name));
  const ServiceExist = await getDocs(q);

  if (ServiceExist.docs.length > 0) {
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
          message: "Specialist added successfully!",
          code: 1,
        }
      : {
          message: "Something went wrong!",
          code: 0,
        };
  }
  // return ServiceExist
};

// Get All services
const getSpecialists = async () => {
  const ref = collection(db, "specialists");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      const data = doc.data();
      if (data.SpaEmail === auth.currentUser.email) {
        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      }
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
};

const getContacts = async () => {
  const ref = collection(db, "contacts");
  const res = await getDocs(ref);
  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      docs.push({
        ...doc.data(),
        id: doc.id,
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
};

const ServiceApi = {
  addService,
  getServices,
  updateService,
  activateService,
  deActivateService,
  deleteService,
  getServicesForAdmin,
  getCategories,
  addSpecialists,
  getSpecialists,
  getAllServices,
  getContacts,
};

export default ServiceApi;
