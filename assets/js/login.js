import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { FIREBASE_CONFIG } from "../../firebase-config.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
const app = initializeApp(FIREBASE_CONFIG);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const onLogin = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const onAlreadyLoggedIn = () => {
  auth.onAuthStateChanged((user) => {
    console.log("user: ", user);
    if (!user) {
      return;
    }

    // Redirect user to homepage
    window.location.href = "./index.html";
  });
};
