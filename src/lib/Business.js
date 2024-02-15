import { db, storage } from "../config/firebase";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { deleteObject, ref } from "firebase/storage";
import axios from "axios";

// Add New Business
const addBusiness = async (data) => {
    data.createdAt = new Date()
    const snapshot = collection(db, "businesses");
    let q = query(snapshot, where("email", "==", data.email));

    const BusinessExist = await getDocs(q);

    if (BusinessExist.docs.length > 0) {
        return {
            message: "Business already exist!",
            code: 0,
        };
    } else {
        // Create user
        await createUserWithEmailAndPassword(auth, data.email, data.email)

        // Add Business
        const ref = doc(db, "businesses", uuidv4());
        await setDoc(ref, data, { merge: true });
        const getRef = doc(db, "businesses", ref.id);
        const res = await getDoc(getRef);
        return res.data()
            ? {
                data: { ...res.data(), id: res.id },
                message: "Business added successfully!",
                code: 1,
            }
            : {
                message: "Something went wrong!",
                code: 0,
            };
    }
    // return BusinessExist
};

// Get Single Business By Id
// const getBusiness = async (id) => {
// };

// Get All businesses
const getBusinesses = async () => {
    const ref = collection(db, "businesses");
    const res = await getDocs(ref);
    let docs = [];
    if (res.docs.length <= 0) {
        return [];
    } else {
        res.forEach((doc) => {
            const data = doc.data();
            if (data.role === "spa" || data.role === "salon") {
                const milliseconds = data?.createdAt?.seconds * 1000 + Math.round(data?.createdAt?.nanoseconds / 1e6);
                docs.push({
                    ...data,
                    id: doc.id,
                    createdAt: data.createdAt ? new Date(milliseconds) : undefined,
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





// Get Single Product By Id
const getSalonsByUserId = async (userId) => {


    const businessesRef = collection(db, "businesses");

    // Get all documents from the "businesses" collection
    const querySnapshot = await getDocs(businessesRef);

    const businesses = [];
    querySnapshot.forEach((doc) => {
        // Compare each document ID with the userId
        if (doc.id === userId) {
            businesses.push({
                ...doc.data(),
                id: doc.id,
            });
        }
    });

    return businesses;

};
const getBusinessById = async (email) => {
    const businessesRef = collection(db, "businesses");
    const servicesRef = collection(db, "services");
    const categoriesRef = collection(db, "ServiceCategories");

    // Get all documents from the "businesses" collection
    const querySnapshot = await getDocs(businessesRef);
    const querySnapshot2 = await getDocs(servicesRef);
    const querySnapshot3 = await getDocs(categoriesRef);

    const businesses = [];
    const categories = [];
    const services = [];
    querySnapshot.forEach((doc) => {
        // Compare each document ID with the userId
        if (doc.data().email === email) {
            businesses.push({
                ...doc.data(),
                id: doc.id,
            });
        }
    });
    querySnapshot2.forEach((doc) => {
        // Compare each document ID with the userId
        if (doc.data().SpaEmail === email) {
            services.push({
                ...doc.data()
            });
        }
    }
    );
    querySnapshot3.forEach((doc) => {
        // Compare each document ID with the userId
        if (doc.data().SpaEmail === email) {
            categories.push({
                ...doc.data()
            });
        }
    }
    );


    return { businesses, categories, services };

};

const getBusinessDetails = async () => {
    const businessesRef = collection(db, "businesses");
    const querySnapshot = await getDocs(businessesRef);

    let data;
    querySnapshot.forEach((doc) => {
        if (doc.data().email === auth.currentUser.email) {
            data = doc.data()
        }
    });


    return data

};


// Update Business
const updateBusiness = async (id, Business) => {
    const ref = doc(db, "businesses", id);
    await setDoc(ref, Business, { merge: true });
    return {
        ...Business,
        id,
    };
};
const updateBusinessStatus = async (id, status) => {
    const ref = doc(db, "businesses", id);
    const dat = await getDoc(ref);
    await setDoc(ref, { status: status }, { merge: true });
    return {
        status,
        id,
        email: dat.data().email
    };
};

const updateBusinessDetails = async (Business) => {
    // finding the business with the email
    const businessesRef = collection(db, "businesses");
    const querySnapshot = await getDocs(businessesRef);

    let id;
    querySnapshot.forEach((doc) => {
        if (doc.data().email === auth.currentUser.email) {
            id = doc.id
        }
    });
    const ref = doc(db, "businesses", id);
    await setDoc(ref, Business, { merge: true });
    return {
        ...Business,
        id,
    };
};

const deleteImage = async (imagePath) => {
    const imageRef = ref(storage, imagePath);
  
    try {
        await deleteObject(imageRef);
    } catch (error) {
        console.error("An error occurred while deleting the file:", error);
    }
  };

// Delete Business
const deleteBusiness = async (record) => {
    deleteImage(record?.file)
    deleteImage(record?.proffFile)
    const ref = doc(db, "businesses", record?.id);
    await deleteDoc(ref);
    await axios.post('/api/delete-account', {User_id: record?.id})
    return 'deleted';
};

// Update Business Status
const activateBusiness = async (Business) => {
    const data = {
        id: Business.key,
        name: Business.name,
        isEnabled: true,
    };
    const ref = doc(db, "businesses", Business.key);
    await setDoc(ref, data, { merge: true });
    return data;
};
// Update Business Status
const deActivateBusiness = async (Business) => {
    const data = {
        id: Business.key,
        name: Business.name,
        isEnabled: false,
    };
    const ref = doc(db, "businesses", data.id);
    await setDoc(ref, data, { merge: true });
    return data;
};
const getReviewsAdmin = async () => {
    const businessesRef = collection(db, "reviews");
    const querySnapshot = await getDocs(businessesRef);
    const reviews = [];
    querySnapshot.forEach((doc) => {
        reviews.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return reviews;
};

const getReviews = async (email) => {
    const businessesRef = collection(db, "reviews");
    const querySnapshot = await getDocs(businessesRef);
    const reviews = [];
    querySnapshot?.forEach((doc) => {
        if (doc?.data()?.businessEmail === email) {
            reviews.push({
                ...doc.data(),
                id: doc.id,
            });
        }
    });
    return reviews;
};

const deleteReview = async (id) => {
    const ref = doc(db, "reviews", id);
    await deleteDoc(ref);
    return id;
};
const updateBusinessCommission = async (commission) => {
    const commissionRef = doc(db, "commission", "commission");
    await setDoc(commissionRef, { commission }, { merge: true });
    return commission;
}
const getCommission = async () => {
    const commissionRef = doc(db, "commission", "commission");
    const commission = await getDoc(commissionRef);
    return commission?.data()?.commission;
}
const getFinanceRecord = async (email, role) => {
    const commissionRef = doc(db, "commission", "commission");
    const commissionQ = await getDoc(commissionRef);
    let commission = parseInt(commissionQ?.data()?.commission);
    const ordersRef = collection(db, "Orders");
    const querySnapshot = await getDocs(ordersRef);
    const orders = [];
    if (role === "admin") {
        querySnapshot.forEach((doc) => {
            const data = doc?.data();
            const actualAmount = data?.amount;
            const commissionAmount = actualAmount * commission / 100;
            const afterCommission = actualAmount - commissionAmount;
            orders.push({
                ...data,
                id: doc?.id,
                actualAmount,
                commissionAmount,
                afterCommission
            });
        });
    } else {
        querySnapshot.forEach((doc) => {
            if (doc.data().allEmails.includes(email)) {
                const data = doc.data();
                const actualAmount = data.amount;
                const commissionAmount = actualAmount * commission / 100;
                const afterCommission = actualAmount - commissionAmount;
                orders.push({
                    ...data,
                    id: doc.id,
                    actualAmount,
                    commissionAmount,
                    afterCommission
                });
            }
        });
    }
    return orders;
};

const getDataForDashboard = async (role) => {
    const email = auth?.currentUser?.email;
    let totalClients = 0;
    let totalTreatments = 0;
    let totalAppotiments = 0;
    let totalBusinesses = 0
    if (role === 'admin') {
        const usersRef = collection(db, "Users");
        let q = query(usersRef, where("role", "!=", "admin"));
        const querySnapshot = await getDocs(q);
        totalClients = querySnapshot.docs.length || 0;

        const businessesRef = collection(db, "businesses");
        const querySnapshot1 = await getDocs(businessesRef);
        totalBusinesses = querySnapshot1.docs.length || 0;
        const OrdersRef = collection(db, "Orders");
        const querySnapshot2 = await getDocs(OrdersRef);
        totalAppotiments = querySnapshot2.docs.length || 0;
        return { totalClients, totalTreatments, totalAppotiments, totalBusinesses }
    } else {
        const usersRef = collection(db, "Users");
        const querySnapshot = await getDocs(usersRef);
        totalClients = querySnapshot.docs.length || 0;

        const OrdersRef = collection(db, "Orders");
        const querySnapshot2 = await getDocs(OrdersRef);
        querySnapshot2.forEach((doc) => {
            if (doc.data().allEmails.includes(email)) {
                totalTreatments++;
            }
        });
        return { totalClients, totalTreatments, totalAppotiments,totalBusinesses }
    }
}

const calenderData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = auth?.currentUser;
            const ordersRef = collection(db, "Orders");
            const querySnapshot = await getDocs(ordersRef);
            const orders = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().allEmails.includes(user?.email)) {
                    const dataa = doc.data();
                    doc.data().cartData.forEach((item) => {
                        orders.push({
                            isCompleted: item?.isCompleted,
                            isRejected: item?.isRejected,
                            isCancelled: item?.isCancelled,
                            cartId: item?.id,
                            name: dataa?.name,
                            email: dataa?.email,
                            businessEmail: item?.spaEmail,
                            businessName: item?.businessName,
                            phone: dataa?.contactNumber,
                            service: item?.serviceName,
                            date: item?.selectedDate,
                            time: item?.selectedTime,
                            specialist: item?.selectedSpecialist,
                            id: doc.id,
                        });
                    });
                }
            });
            resolve(orders); // Resolve the Promise with the 'orders' array.
        } catch (error) {
            reject(error); // Reject the Promise if there's an error.
        }
    });
}

// You can call the function like this to retrieve the data using Promises.

const deleteOrder = async (id, cartId) => {
    const ref = doc(db, "Orders", id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
        return {
            message: "Order not found!",
            code: 0,
        };
    }
    else{
        const newData = snapshot.data();
        newData.cartData = newData.cartData.filter((item) => item.id !== cartId);
        if(newData.cartData.length === 0){
            await deleteDoc(ref);
        }else{
            await setDoc(ref, newData, { merge: true });
        }
        return {
            message: "Order deleted successfully!",
            code: 1,
        };
    }
}
const addOrder = async (data) => {
    try {
        const id = auth?.currentUser?.uid;
        const businessRef = doc(db, "businesses", id);
        const business = await getDoc(businessRef);
        const servicesRef = collection(db, "services");
        const querySnapshot = await getDocs(servicesRef);
        let docsssss;

        // Use Promise.all to wait for all asynchronous operations in the loop to complete
        await Promise.all(querySnapshot.docs.map(async (doc) => {
            if (doc.data().name === data.service) {
                docsssss = doc.data();
            }
        }));

        data.cartData = [{ item: business.data(),
            item:{
                business: business.data(),
                service: docsssss,

            },
             service: docsssss, selectedDate: data.selectedDate, selectedTime: data.selectedTime, selectedSpecialist: data.selectedSpecialist }];
        data.createdAt = new Date();
        const user = auth?.currentUser;
        const allEmails = [user?.email];
        data.allEmails = allEmails;
        const ref = doc(db, "Orders", uuidv4());
        await setDoc(ref, data, { merge: true });
        const getRef = doc(db, "Orders", ref.id);
        const res = await getDoc(getRef);

        return res.data()
            ? {
                data: { ...res.data(), id: res.id },
                message: "Order added successfully!",
                code: 1,
            }
            : {
                message: "Something went wrong!",
                code: 0,
            };
    } catch (error) {
        console.error("Error adding order:", error);
        return {
            message: "An error occurred while adding the order.",
            code: 0,
        };
    }
};

const updateOrder = async (data) => {
    try {
        const ref = doc(db, "Orders", data.id);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) {
            return {
                message: "Order not found!",
                code: 0,
            };
        }else{
            const newData = snapshot.data();
            newData.cartData[0].selectedDate = data.date;
            newData.cartData[0].selectedTime = data.time;
            await setDoc(ref, newData, { merge: true });
        }
    } catch (error) {
        console.error("Error updating order:", error);
        return {
            message: "An error occurred while updating the order.",
            code: 0,
        };
    }
};
const updateOrderStatus = async (data) => {
    try {
        const ref = doc(db, "Orders", data.id);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) {
            return {
                message: "Order not found!",
                code: 0,
            };
        }else{
            const newData = snapshot.data();
            const index = newData.cartData.findIndex((item) => item.id === data?.cartId);
            newData.cartData[index].isCompleted = true;
            await setDoc(ref, newData, { merge: true });
        }
    } catch (error) {
        console.error("Error updating order:", error);
        return {
            message: "An error occurred while updating the order.",
            code: 0,
        };
    }
};

const rejectOrderStatus = async (data) => {
    try {
        const ref = doc(db, "Orders", data.id);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) {
            return {
                message: "Order not found!",
                code: 0,
            };
        }else{
            const newData = snapshot.data();
            const index = newData.cartData.findIndex((item) => item.id === data?.cartId);
            newData.cartData[index].isRejected = true;
            newData.cartData[index].rejectionReason = data?.reason;
            await setDoc(ref, newData, { merge: true });
        }
    } catch (error) {
        console.error("Error rejecting order:", error);
        return {
            message: "An error occurred while updating the order.",
            code: 0,
        };
    }
};

const cancelOrderStatus = async (data) => {
    try {
        const ref = doc(db, "Orders", data.id);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) {
            return {
                message: "Order not found!",
                code: 0,
            };
        }else{
            const newData = snapshot.data();
            // const index = newData.cartData.findIndex((item) => item.id === data?.cartId);
            newData.cartData[0].isCancelled = true;
            await setDoc(ref, newData, { merge: true });
        }
    } catch (error) {
        console.error("Error cancelling order:", error);
        return {
            message: "An error occurred while updating the order.",
            code: 0,
        };
    }
};

const addCalenderDate = async(data)=>{
    const id = auth?.currentUser?.uid;
    const businessRef = doc(db, "businesses", id);
    const business = await getDoc(businessRef);
    const dataa = business.data();
    let availability = dataa.availability || [];
    if(data.isOff){
        availability.push({isOff: true, date: data.date})
    }else{
        availability.push({isOff: false, openTime: data.openTime, closeTime: data.closeTime,date: data.date})
    }
    dataa.availability = availability
    const ref = doc(db, "businesses", id);
    await setDoc(ref, dataa, { merge: true });
    return dataa;
}

const getCalenderDate = async () => {
    const email = auth?.currentUser?.email;
    const businessesRef = collection(db, "businesses");
    const querySnapshot = await getDocs(businessesRef);
    let data;

    return new Promise((resolve, reject) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().email === email) {
                data = doc.data().availability;
            }
        });
        resolve(data);
    });
}


const updateCalenderData = async (data)=>{
    const id = auth?.currentUser?.uid;
    const businessRef = doc(db, "businesses", id);
    const business = await getDoc(businessRef);
    const dataa = business.data();
    dataa.availability = data;
    const ref = doc(db, "businesses", id);
    await setDoc(ref, dataa, { merge: true });
    return dataa;
}


const BusinessApi = {
    addBusiness,
    deleteOrder,
    updateOrder,
    getCommission,
    updateBusinessCommission,
    getReviewsAdmin,
    deleteReview,
    getReviews,
    getBusinesses,
    getDataForDashboard,
    updateBusiness,
    activateBusiness,
    deActivateBusiness,
    deleteBusiness,
    getSalonsByUserId,
    getBusinessById,
    getBusinessDetails,
    updateBusinessDetails,
    updateBusinessStatus,
    getFinanceRecord,
    calenderData,
    addOrder,
    addCalenderDate,
    getCalenderDate,
    updateCalenderData,
    updateOrderStatus,
    rejectOrderStatus,
    cancelOrderStatus
};

export default BusinessApi;
