import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDirar6-sJlqPzVO3t9_uml6Hf1KVg_usc",
    authDomain: "planilhaap24.firebaseapp.com",
    projectId: "planilhaap24",
    storageBucket: "planilhaap24.appspot.com",
    messagingSenderId: "469771009152",
    appId: "1:469771009152:web:f799f2987ab573cc86ba65",
    measurementId: "G-C38P9C31LN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage, ref, uploadString, getDownloadURL };
