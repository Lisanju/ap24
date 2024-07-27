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
