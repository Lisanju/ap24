// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
// ...
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(e) {
        e.preventDefault();
        var username = document.getElementById("inputUsername").value;
        var password = document.getElementById("inputPassword").value;

        if (username === "ap24" && password === "nana7353") {
            window.location.href = "home.html";
        } else {
            alert("Nome ou senha incorretos! Tente novamente.");
        }
    });
});
