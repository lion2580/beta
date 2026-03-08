const btn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-panel');

btn.addEventListener('click', () => {
  nav.classList.toggle('open');
});

const moreBtn = document.getElementById("navMoreBtn");
const dropdown = document.getElementById("nav-dropdown");

moreBtn.addEventListener("click", function(e){

  e.stopPropagation();

  dropdown.classList.toggle("show");
  moreBtn.classList.toggle("active");

});

document.addEventListener("click", function(){

  dropdown.classList.remove("show");
  moreBtn.classList.remove("active");

});