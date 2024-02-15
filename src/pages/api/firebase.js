var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://salon-be909-default-rtdb.firebaseio.com"
});

const auth = admin.auth()

export { auth };