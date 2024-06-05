import firebase from 'firebase';
import 'firebase/firestore'

var firebaseConfig = {
   
    apiKey: "AIzaSyBEKnqWK47-Ft6Hn8gv9uLK-vy9rmack1w",
    authDomain: "appfood-74513.firebaseapp.com",
    projectId: "appfood-74513",
    storageBucket: "appfood-74513.appspot.com",
    messagingSenderId: "875720411376",
    appId: "1:875720411376:web:6f1041fd0f1f56c5d3da35"
    
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  
  const db = firebase.firestore()

  export default{
      firebase,
      db
  }
