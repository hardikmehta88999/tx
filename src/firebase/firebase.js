import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1bk-bWzRe_wSERJQ_SYB66Hn95H3sn3U",
  authDomain: "tweetx-6b8eb.firebaseapp.com",
  databaseURL: "https://tweetx-6b8eb.firebaseio.com",
  projectId: "tweetx-6b8eb",
  storageBucket: "tweetx-6b8eb.appspot.com",
  messagingSenderId: "495835158325",
  appId: "1:495835158325:web:b15998070057c1d2f15e7c",
  measurementId: "G-RNQXYF88E9"
};

export const myFirebase = firebase.initializeApp(firebaseConfig);

export default firebase;