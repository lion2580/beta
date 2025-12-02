// LOGIN TÁCTICO
document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const screen = document.getElementById("loginScreen");
    screen.style.opacity = "0";
    screen.style.transition = "0.8s";

    setTimeout(()=>{
        screen.style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    }, 800);
});


// MENSAJE DE ÉXITO FORMULARIO
document.getElementById("escortForm").addEventListener("submit", function(e){
    e.preventDefault();

    const msg = document.getElementById("success");
    msg.style.display = "block";

    setTimeout(()=>{
        msg.style.display = "none";
    }, 4000);
});
