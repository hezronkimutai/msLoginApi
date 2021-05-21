import dotenv from "dotenv";
dotenv.config();

import * as firebase from "firebase";

// const {
//   apiKey,
//   authDomain,
//   databaseURL,
//   projectId,
//   storageBucket,
//   messagingSenderId,
//   appId,
//   measurementId,
// } = process.env;

// const firebaseConfig = {
//   apiKey,
//   authDomain,
//   databaseURL,
//   projectId,
//   storageBucket,
//   messagingSenderId,
//   appId,
//   measurementId,
// };

// export default firebase.initializeApp(firebaseConfig);
// export const db = firebase.database();

export const writeFbData = async (url, data) => {
  // return await db.ref(url).push(data);
};
export const editFbData = (url, data) => {
  // db.ref(url).set(data);
};
export const readFbData = (url, cb) => { }
  // db.ref(url).on("value", (snapshot) => {
  //   cb(snapshot.val() || {});
  // });
