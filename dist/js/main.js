document.addEventListener('DOMContentLoaded', function () {
  const burgerIcon = document.getElementById('header__burger-btn');
  const menu = document.getElementById('menu');

  const closeIcon = document.getElementById('menu__btn-close');

  burgerIcon.addEventListener('click', function () {
    menu.classList.remove('menu__close')
  });

  closeIcon.addEventListener('click', function () {
    menu.classList.toggle('menu__close')
  });


  // Плавный скролл при клике на якорную ссылку
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
        menu.classList.toggle('menu__close');
      }
    });
  });


  // Добавляем слушатель события scroll
  window.addEventListener('scroll', function () {
    let scrolled = window.scrollY;

    if (scrolled === 0) {
      let currentActive = document.querySelector('.header__link-active');
      if (currentActive) {
        currentActive.classList.remove('header__link-active');
      }

      let firstMenuItem = document.querySelector('.header__link-first');
      if (firstMenuItem) {
        firstMenuItem.classList.add('header__link-active');
      }
    }

});
});

// Для изменения активного элемента при клике
function changeActive(event, sectionID) {
  event.preventDefault();
      let clickedElement = event.target;

      if (clickedElement.tagName === 'A') {
        let currentActive = document.querySelector('.header__link-active');
        if (currentActive) {
          currentActive.classList.remove('header__link-active');
        }

        clickedElement.classList.add('header__link-active');
      }

      let targetSection = document.getElementById(sectionID);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    }

