// ui-motion.js

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold:0.2 }
);

document
  .querySelectorAll(".section-header, .reveal")
  .forEach(el => observer.observe(el));
