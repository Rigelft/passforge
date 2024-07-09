document.addEventListener('DOMContentLoaded', function() {
    var navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.forEach(function(link) {
          link.classList.remove('active');
        });
        this.classList.add('active');
        var target = this.getAttribute('href');
        var targetElement = document.querySelector(target);
        targetElement.scrollIntoView({ behavior: 'smooth' });
      });
    });
  });

  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }