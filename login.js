document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");
  const loginForm = document.getElementById("loginForm");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const userArea = document.getElementById("userArea");
  const errorBox = document.getElementById("loginError");

  let isLoggedIn = false;

  if(!loginBtn || !loginModal){
    console.error("Login: elementos no encontrados");
    return;
  }

  /* ========= ABRIR / CERRAR MODAL ========= */
  loginBtn.addEventListener("click", () => {

    if(!isLoggedIn){
      loginModal.classList.remove("hidden");
    } else {
      // Cerrar sesión
      usernameDisplay.textContent = "Invitado";
      loginBtn.textContent = "Iniciar sesión";
      userArea.classList.remove("logged");
      localStorage.removeItem("cv_user");
      isLoggedIn = false;
    }

  });

  closeLogin.addEventListener("click", () => {
    loginModal.classList.add("hidden");
  });

  /* ========= LOGIN ========= */
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const user = document.getElementById("loginUser").value.trim();

    if(!user){
      if(errorBox){
        errorBox.textContent = "Debes ingresar un usuario";
        errorBox.classList.remove("hidden");
      }
      return;
    }

    // Login exitoso
    usernameDisplay.textContent = user;
    loginBtn.textContent = "Cerrar sesión";
    userArea.classList.add("logged");
    loginModal.classList.add("hidden");

    localStorage.setItem("cv_user", user);
    isLoggedIn = true;

    if(errorBox){
      errorBox.classList.add("hidden");
    }

    loginForm.reset();
  });

  /* ========= RECUPERAR SESIÓN ========= */
  const savedUser = localStorage.getItem("cv_user");

  if(savedUser){
    usernameDisplay.textContent = savedUser;
    loginBtn.textContent = "Cerrar sesión";
    userArea.classList.add("logged");
    isLoggedIn = true;
  }

});
