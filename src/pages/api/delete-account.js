import { auth } from "./firebase";

// var admin = require("firebase-admin");
// delete the user from the database
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://salon-be909-default-rtdb.firebaseio.com"
//   }, 'customApp');
export default async (req, res) => {
    if (req.method === "POST") {
      const id = req.body.User_id;
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //     databaseURL: "https://salon-be909-default-rtdb.firebaseio.com"
    //   }, 'customApp');
  
      try {
        await auth.deleteUser(id);
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        console.log({error})
        res.status(500).json({ error: "Failed to delete user" });
      }
    } else {
      res.status(400).json({ error: "Wrong request method" });
    }
  };
  

// export default async (req, res) => {
//   if (req.method === "POST") {
//     console.log('heree   ---  ')
//       const  id  = req.body.User_id;
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//         databaseURL: "https://salon-be909-default-rtdb.firebaseio.com"
//       }, 'customApp');
//       return admin.auth().deleteUser(id);
//   } else {
//     res.status(400).json({ error: "Wrong request method" });
//   }
// };