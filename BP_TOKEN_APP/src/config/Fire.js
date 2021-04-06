import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAJcr_WZYCfBCH8wCzFdHvWm68nx7PLqY8",
    authDomain: "bpdb-7ba8b.firebaseapp.com",
    databaseURL: "https://bpdb-7ba8b.firebaseio.com",
    projectId: "bpdb-7ba8b",
    storageBucket: "bpdb-7ba8b.appspot.com",
    messagingSenderId: "522918608439",
    appId: "1:522918608439:web:90e40853c7108c52b149b2",
    measurementId: "G-ELEHYGNH81"
  };

  const fire = firebase.initializeApp(firebaseConfig);
  export default fire;