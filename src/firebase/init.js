import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: process.env.FIREBASE_API,
    authDomain: "moneysaveapp-yuki.firebaseapp.com",
    databaseURL: "https://moneysaveapp-yuki.firebaseio.com",
    projectId: "moneysaveapp-yuki",
    storageBucket: "moneysaveapp-yuki.appspot.com",
    messagingSenderId: process.env.SENDER_ID
  };
  

  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true })


  export default firebaseApp.firestore()