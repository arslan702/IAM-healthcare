import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
// get all orders
const getAllOrders = async (role) => {
  console.log("get all orders");
  const ref = collection(db, "Orders");
  const date = new Date().toLocaleDateString().split("/")
  const newDate = `${date[2]}-${addZero(date[0])}-${addZero(date[1])}`
  let earning = 0;
  let totalEarning = 0;
  if (role === "admin") {
    try {
      const querySnapshot = await getDocs(ref);

      const docs = [];

      if (querySnapshot.empty) {
        return [];
      }
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();

          // if (data.allEmails.includes(userEmail)) {
          //   await Promise.all(
          //     data.cartData.map(async (item) => {
          //       console.log("item", item)
          //       if (item.item.business.email === userEmail) {
          //         docs.push({
          //           name: data.name,
          //           email: data.email,
          //           id: doc.id,
          //           number: data.contactNumber,
          //           cartItem: item,
          //         });
          //       }
          //     })
          //   );
          // } else {
          await Promise.all(
            data.cartData.map(async (item) => {
              const newAmount = data?.discountAmount ? data?.discountAmount : item?.serviceAmount;
              const commissionPercentage = Number(data?.commission || 0) / 100;
              if (item?.selectedDate === newDate && !item?.isRejected && !item?.isCancelled) {
                earning += parseInt(newAmount) - (parseInt(newAmount) * commissionPercentage);
              }
              if(item?.isCompleted) {
                totalEarning += parseInt(newAmount) - (parseInt(newAmount) * commissionPercentage)
              }
              docs.push({
                isCompleted: item?.isCompleted,
                name: data?.name,
                email: data?.email,
                QST: data?.QST,
                GST: data?.GST,
                tax: Number(data?.GST) + Number(data?.QST),
                id: doc?.id,
                number: data?.contactNumber,
                cartItem: item,
                amount: data?.amount,
                discountAmount: data?.discountAmount,
                commission: data?.commission,
                createdAt: data?.createdAt?.toDate()?.toString(),
              });

            })
          );
          // }
        })
      );

      return {
        docs: docs,
        earning: earning,
        totalEarning: totalEarning
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // You might want to handle or log the error appropriately
    }
  } else {
    console.log('entered here')
    try {
      const querySnapshot = await getDocs(ref);

      const docs = [];

      if (querySnapshot.empty) {
        return [];
      }

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const userEmail = auth.currentUser.email;

          if (data.allEmails.includes(userEmail)) {
            await Promise.all(
              data.cartData.map(async (item) => {
                if (item?.spaEmail === userEmail) {
                  const newAmount = data?.discountAmount ? data?.discountAmount : item?.serviceAmount;
                  const commissionPercentage = Number(data?.commission || 0) / 100;
                  if (item?.selectedDate === newDate && !item?.isRejected && !item?.isCancelled) {
                    earning += parseInt(newAmount) - (parseInt(newAmount) * commissionPercentage);
                  }
                  if(item?.isCompleted) {
                    totalEarning += parseInt(newAmount) - (parseInt(newAmount) * commissionPercentage)
                  }
                  docs.push({
                    isCompleted: item?.isCompleted,
                    name: data?.name,
                    email: data?.email,
                    QST: data?.QST,
                    GST: data?.GST,
                    tax: Number(data?.GST) + Number(data?.QST),
                    id: doc?.id,
                    number: data?.contactNumber,
                    cartItem: item,
                    amount: data?.amount,
                    discountAmount: data?.discountAmount,
                    commission: data?.commission,
                    createdAt: data?.createdAt?.toDate()?.toString(),
                  });
                }
              })
            );
          }
          // else {
          //   await Promise.all(
          //     data.cartData.map(async (item) => {
          //       console.log("item", item)
          //       docs.push({
          //         name: data.name,
          //         email: data.email,
          //         id: doc.id,
          //         number: data.contactNumber,
          //         cartItem: item,
          //       });

          //     })
          //   );
          // }
        })
      );

      return {
        docs: docs,
        earning: earning,
        totalEarning: totalEarning
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // You might want to handle or log the error appropriately
    }
  }
};
const getAllOrdersForFinance = async (email, role) => {
  const ref = collection(db, "Orders");
  const commissionRef = doc(db, "commission", "commission");
  const commissionQ = await getDoc(commissionRef);
  let commission = parseInt(commissionQ.data()?.commission);

  if (role === "admin") {
    try {
      const querySnapshot = await getDocs(ref);

      const docs = [];

      if (querySnapshot.empty) {
        return [];
      }

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          await Promise.all(
            data.cartData.map(async (item) => {
              if (item?.isCompleted) {
                const actualAmount = parseInt(data?.amount);
                const commissionAmount = actualAmount * data?.commission / 100;
                const afterCommission = actualAmount - commissionAmount;
                docs.push({
                  businessEmail: item?.spaEmail,
                  name: data.name,
                  email: data.email,
                  QST: data?.QST,
                  GST: data?.GST,
                  tax: Number(data?.GST) + Number(data?.QST),
                  id: doc.id,
                  number: data.contactNumber,
                  afterCommission,
                  actualAmount,
                  commissionAmount,
                  date: item?.selectedDate,
                  time: item?.selectedTime,
                  cartItem: item,
                });
              }

            })
          );
        })
      );
      return docs;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // You might want to handle or log the error appropriately
    }
  } else {
    try {
      const querySnapshot = await getDocs(ref);
      const docs = [];

      if (querySnapshot.empty) {
        return [];
      }

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();

          if (data.allEmails.includes(email)) {
            await Promise.all(
              data.cartData.map(async (item) => {
                if (item?.isCompleted) {
                  if (item?.spaEmail === email) {
                    const actualAmount = parseInt(data?.amount);
                    const commissionAmount = actualAmount * data?.commission / 100;
                    const afterCommission = actualAmount - commissionAmount;
                    docs.push({
                      businessEmail: item?.spaEmail,
                      name: data.name,
                      email: data.email,
                      QST: data?.QST,
                      GST: data?.GST,
                      tax: Number(data?.GST) + Number(data?.QST),
                      id: doc.id,
                      number: data.contactNumber,
                      afterCommission,
                      actualAmount,
                      commissionAmount,
                      date: item?.selectedDate,
                      time: item?.selectedTime,
                      cartItem: item,
                    });

                  }
                }
              })
            );
          }
        })
      );
      return docs;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // You might want to handle or log the error appropriately
    }
  }
};

const getAllUpcomming = async (role) => {
  console.log("get all ipcomming orders");
  const ref = collection(db, "Orders");
  let totalBusinesses = 0
  const businessesRef = collection(db, "businesses");
  const querySnapshot1 = await getDocs(businessesRef);
  totalBusinesses = querySnapshot1.docs.length || 0;
  if (role === "admin") {
    try {
      const querySnapshot = await getDocs(ref);

      const docs = [];

      if (querySnapshot.empty) {
        return [];
      }
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          await Promise.all(
            data.cartData.map(async (item) => {
              if(!item?.isRejected && !item?.isCancelled && !item?.isCompleted) {
              docs.push({
                name: data.name,
                email: data.email,
                serviceName: item?.serviceName,
                discountAmount: item?.serviceAmount !== data?.amount ? data?.amount : 0,
                serviceAmount: item?.serviceAmount,
                businessName: item.businessName,
                businessEmail: item.spaEmail,
                id: doc.id,
                number: data.contactNumber,
                date: item?.selectedDate,
                time: item?.selectedTime,
                cartItem: item,
              });
            }
            })
          );
          // }
        })
      );

      const currentDateTime = new Date();

      // Sort the events by date and time
      const sortedEvents = docs.sort((a, b) => {
        const datetimeA = new Date(a.date + " " + a.time);
        const datetimeB = new Date(b.date + " " + b.time);
        return datetimeA - datetimeB;
      });

      const upcomingEvents = sortedEvents?.filter(event => {
        const eventDateTime = new Date(event.date + " " + event.time);
        return eventDateTime > currentDateTime;
      });
      return { data: docs, treatment: docs.length, appoitments: upcomingEvents.length, totalBusinesses: totalBusinesses };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // You might want to handle or log the error appropriately
    }
  } else {
    console.log('entered here')
    try {
      const querySnapshot = await getDocs(ref);

      const docs = [];

      if (querySnapshot.empty) {
        return [];
      }

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const userEmail = auth.currentUser.email;

          if (data.allEmails.includes(userEmail)) {
            await Promise.all(
              data.cartData.map(async (item) => {
                if (item?.spaEmail === userEmail && !item?.isRejected && !isCancelled && !item?.isCompleted) {
                  docs.push({
                    name: data.name,
                    email: data.email,
                    serviceName: item?.serviceName,
                    discountAmount: item?.serviceAmount !== data?.amount ? data?.amount : 0,
                    serviceAmount: item?.serviceAmount,
                    businessName: item?.businessName,
                    businessEmail: item?.spaEmail,
                    id: doc.id,
                    number: data.contactNumber,
                    date: item?.selectedDate,
                    time: item?.selectedTime,
                    cartItem: item,
                  });
                }
              })
            );
          }
        })
      );

      const currentDateTime = new Date();

      // Sort the events by date and time
      const sortedEvents = docs.sort((a, b) => {
        const datetimeA = new Date(a.date + " " + a.time);
        const datetimeB = new Date(b.date + " " + b.time);
        return datetimeA - datetimeB;
      });

      // Filter upcoming events
      const upcomingEvents = sortedEvents.filter(event => {
        const eventDateTime = new Date(event.date + " " + event.time);
        return eventDateTime > currentDateTime;
      });

      return { data: docs, treatment: docs.length, appoitments: upcomingEvents.length, totalBusinesses: totalBusinesses };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // You might want to handle or log the error appropriately
    }
  }
};

function aggregateData(data) {
  const result = [];

  data.forEach((item) => {
    const { name, amount } = item;
    const existingItem = result.find((x) => x.name === name);

    if (existingItem) {
      existingItem.amount += amount;
    } else {
      result.push({ name, amount });
    }
  });

  return result;
}

const getAllEarnings = async (role) => {
  const ref = collection(db, "Orders");
  if (role === "admin") {
    const ref = collection(db, "Orders");
    try {
      const querySnapshot = await getDocs(ref);

      const docs = [];

      if (querySnapshot.empty) {
        return [];
      }
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          await Promise.all(
            data.cartData.map(async (item) => {
              if (item?.isCompleted) {
                const commissionPercentage = Number(data?.commission || 0) / 100;
                const newAmount = data?.discountAmount ? data?.discountAmount : item?.serviceAmount;
                // const amountAfterCommission = parseInt(newAmount) - (parseInt(newAmount) * commissionPercentage);
                const amountAfterCommission = amtCommission(newAmount, Number(data?.commission));
                docs.push({
                  name: item?.serviceName,
                  amount: amountAfterCommission,
                });
              }

            })
          );
          // }
        })
      );

      const aggregatedData = aggregateData(docs);
      return aggregatedData;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // You might want to handle or log the error appropriately
    }
  } else {

    try {
      const querySnapshot = await getDocs(ref);

      const docs = [];

      if (querySnapshot.empty) {
        return [];
      }

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const userEmail = auth?.currentUser?.email;

          if (data.allEmails.includes(userEmail)) {
            await Promise.all(
              data.cartData.map(async (item) => {
                if (item?.spaEmail === userEmail) {
                  if (item?.isCompleted) {
                    const commissionPercentage = Number(data?.commission || 0) / 100;
                    const newAmount = data?.discountAmount ? data?.discountAmount : item?.serviceAmount;
                    const amountAfterCommission = parseInt(newAmount) - (parseInt(newAmount) * commissionPercentage);
                    docs.push({
                      name: item?.serviceName,
                      amount: amountAfterCommission,
                    });
                  }
                }
              })
            );
          }
        })
      );
      const aggregatedData = aggregateData(docs);
      return aggregatedData;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // You might want to handle or log the error appropriately
    }
  }
}


const getAppointments = async (timeframe, role) => {
  try {
    const currentEmail = auth.currentUser.email;

    const ref = collection(db, "Orders");
    const querySnapshot = await getDocs(ref);
    let data = querySnapshot.docs.map(doc => doc.data());
    const today = new Date();
    let startDate, endDate;

    switch (timeframe) {
      case "thisWeek":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
        break;
      case "lastWeek":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 1);
        break;
      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      case "lastYear":
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        break;
      default:
        return "Invalid timeframe";
    }

    const counts = { days: {}, months: {}, weeks: { week1: 0, week2: 0, week3: 0, week4: 0 } };

    // Initialize day and month counts to 0
    for (let i = 0; i < 7; i++) {
      const day = new Date(0, 0, i).toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
      counts.days[day] = 0;
    }

    for (let i = 0; i < 12; i++) {
      const month = new Date(0, i).toLocaleDateString("en-US", { month: "short" }).toLowerCase();
      counts.months[month] = 0;
    }

    if (role === "admin") {
      for (const item of data) {
        for (const cartItem of item?.cartData) {
          const appointmentDate = new Date(cartItem.selectedDate);
          if (appointmentDate >= startDate && appointmentDate <= endDate) {
            const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(appointmentDate).toLowerCase();
            const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(appointmentDate).toLowerCase();
            const week1 = new Date(today.getFullYear(), today.getMonth(), 1);
            const week2 = new Date(today.getFullYear(), today.getMonth(), 7);
            const week3 = new Date(today.getFullYear(), today.getMonth(), 14);
            const week4 = new Date(today.getFullYear(), today.getMonth(), 21);
            if (appointmentDate >= week1 && appointmentDate <= week2) {
              counts.weeks.week1++;
            }
            if (appointmentDate >= week3 && appointmentDate <= week4) {
              counts.weeks.week2++;
            }
            if (appointmentDate >= week4 && appointmentDate <= endDate) {
              counts.weeks.week3++;
            }
            if (appointmentDate >= startDate && appointmentDate <= week1) {
              counts.weeks.week4++;
            }

            counts.days[dayName]++;
            counts.months[monthName]++;
          }
        }
      }
    } else if (role !== "admin") {
      for (const item of data) {
        if (item?.allEmails.includes(currentEmail)) {
          for (const cartItem of item?.cartData) {
            const appointmentDate = new Date(cartItem.selectedDate);
            if (appointmentDate >= startDate && appointmentDate <= endDate) {
              const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(appointmentDate).toLowerCase();
              const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(appointmentDate).toLowerCase();
              const week1 = new Date(today.getFullYear(), today.getMonth(), 1);
              const week2 = new Date(today.getFullYear(), today.getMonth(), 7);
              const week3 = new Date(today.getFullYear(), today.getMonth(), 14);
              const week4 = new Date(today.getFullYear(), today.getMonth(), 21);
              if (appointmentDate >= week1 && appointmentDate <= week2) {
                counts.weeks.week1++;
              }
              if (appointmentDate >= week3 && appointmentDate <= week4) {
                counts.weeks.week2++;
              }
              if (appointmentDate >= week4 && appointmentDate <= endDate) {
                counts.weeks.week3++;
              }
              if (appointmentDate >= startDate && appointmentDate <= week1) {
                counts.weeks.week4++;
              }
              counts.days[dayName]++;
              counts.months[monthName]++;
            }
          }
        }
      }
    }

    if (timeframe === "thisWeek" || timeframe === "lastWeek") {
      return counts.days
    }
    else if (timeframe === "thisMonth") {
      return counts.weeks
    }
    else {
      return counts.months
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    throw error;
  }
};

function amtAfterCommission(amount, commission) {
  return amount - (amount * commission) / 100;
}
function amtCommission(amount, commission) {
  return (amount * commission) / 100;
}
const getEarnings = async (timeframe, role) => {
  const commissionRef = doc(db, "commission", "commission");
  const commissionQ = await getDoc(commissionRef);
  let commission = parseInt(commissionQ.data()?.commission);
  try {
    const currentEmail = auth.currentUser.email;

    const ref = collection(db, "Orders");
    const querySnapshot = await getDocs(ref);
    let data = querySnapshot.docs.map(doc => doc.data());
    const today = new Date();
    let startDate, endDate;

    switch (timeframe) {
      case "thisWeek":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
        break;
      case "lastWeek":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 1);
        break;
      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      case "lastYear":
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        break;
      default:
        return "Invalid timeframe";
    }

    const counts = { days: {}, months: {}, weeks: { week1: 0, week2: 0, week3: 0, week4: 0 } };

    // Initialize day and month counts to 0
    for (let i = 0; i < 7; i++) {
      const day = new Date(0, 0, i).toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
      counts.days[day] = 0;
    }

    for (let i = 0; i < 12; i++) {
      const month = new Date(0, i).toLocaleDateString("en-US", { month: "short" }).toLowerCase();
      counts.months[month] = 0;
    }

    if (role === "admin") {
      for (const item of data) {
        for (const cartItem of item?.cartData) {
          if (cartItem?.isCompleted) {
            const appointmentDate = new Date(cartItem.selectedDate);
            if (appointmentDate >= startDate && appointmentDate <= endDate) {
              const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(appointmentDate).toLowerCase();
              const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(appointmentDate).toLowerCase();
              const week1 = new Date(today.getFullYear(), today.getMonth(), 1);
              const week2 = new Date(today.getFullYear(), today.getMonth(), 7);
              const week3 = new Date(today.getFullYear(), today.getMonth(), 14);
              const week4 = new Date(today.getFullYear(), today.getMonth(), 21);
              const newAmount = item?.discountAmount ? item?.discountAmount : cartItem?.serviceAmount;
              if (appointmentDate >= week1 && appointmentDate <= week2) {
                counts.weeks.week1 += amtCommission(parseInt(newAmount), item?.commission);
              }
              if (appointmentDate >= week3 && appointmentDate <= week4) {
                counts.weeks.week2 += amtCommission(parseInt(newAmount), item?.commission);
              }
              if (appointmentDate >= week4 && appointmentDate <= endDate) {
                counts.weeks.week3 += amtCommission(parseInt(newAmount), item?.commission);
              }
              if (appointmentDate >= startDate && appointmentDate <= week1) {
                counts.weeks.week4 += amtCommission(parseInt(newAmount), item?.commission);
              }

              counts.days[dayName] += amtCommission(parseInt(newAmount), item?.commission);
              counts.months[monthName] += amtCommission(parseInt(newAmount), item?.commission);
            }
          }
        }
      }
    } else if (role !== "admin") {
      for (const item of data) {
        if (item?.allEmails.includes(currentEmail)) {
          for (const cartItem of item?.cartData) {
            if (cartItem?.isCompleted) {
              const appointmentDate = new Date(cartItem.selectedDate);
              if (appointmentDate >= startDate && appointmentDate <= endDate) {
                const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(appointmentDate).toLowerCase();
                const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(appointmentDate).toLowerCase();
                const week1 = new Date(today.getFullYear(), today.getMonth(), 1);
                const week2 = new Date(today.getFullYear(), today.getMonth(), 7);
                const week3 = new Date(today.getFullYear(), today.getMonth(), 14);
                const week4 = new Date(today.getFullYear(), today.getMonth(), 21);
                const newAmount = item?.discountAmount ? item?.discountAmount : cartItem?.serviceAmount;
                if (appointmentDate >= week1 && appointmentDate <= week2) {
                  counts.weeks.week1 += amtAfterCommission(parseInt(newAmount), item?.commission);
                }
                if (appointmentDate >= week3 && appointmentDate <= week4) {
                  counts.weeks.week2 += amtAfterCommission(parseInt(newAmount), item?.commission);
                }
                if (appointmentDate >= week4 && appointmentDate <= endDate) {
                  counts.weeks.week3 += amtAfterCommission(parseInt(newAmount), item?.commission);
                }
                if (appointmentDate >= startDate && appointmentDate <= week1) {
                  counts.weeks.week4 += amtAfterCommission(parseInt(newAmount), item?.commission);
                }
                counts.days[dayName] += amtAfterCommission(parseInt(newAmount), item?.commission);
                counts.months[monthName] += amtAfterCommission(parseInt(newAmount), item?.commission);
              }
            }
          }
        }
      }
    }
    if (timeframe === "thisWeek" || timeframe === "lastWeek") {
      return counts.days
    }
    else if (timeframe === "thisMonth") {
      return counts.weeks
    }
    else {
      return counts.months
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    throw error;
  }
};



const OrderApi = {
  getAllOrders,
  getAllOrdersForFinance,
  getAllUpcomming,
  getAllEarnings,
  getAppointments,
  getEarnings
};

export default OrderApi;
