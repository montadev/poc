document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  let currentSlide = 0;
  let intervalId;

  function showSlide(index) {
      slides.forEach((slide, i) => {
          if (i === index) {
              slide.classList.add('active');
          } else {
              slide.classList.remove('active');
          }
      });
  }

  function activateDot(index) {
      dots.forEach((dot, i) => {
          if (i === index) {
              dot.classList.add('active');
          } else {
              dot.classList.remove('active');
          }
      });
  }

  function nextSlide() {
      currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
      showSlide(currentSlide);
      activateDot(currentSlide);
  }

  function startInterval() {
      intervalId = setInterval(nextSlide, 5000);
  }

  function goToSlide(index) {
      currentSlide = index;
      showSlide(currentSlide);
      activateDot(currentSlide);
      clearInterval(intervalId);
      startInterval();
  }

  startInterval();
  showSlide(0);
  activateDot(0);

  if (prevButton) {
      prevButton.addEventListener('click', () => {
          currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
          showSlide(currentSlide);
          activateDot(currentSlide);
          clearInterval(intervalId);
          startInterval();
      });
  }

  if (nextButton) {
      nextButton.addEventListener('click', () => {
          nextSlide();
          clearInterval(intervalId);
          startInterval();
      });
  }

  dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          goToSlide(index);
      });
  });
});



var modal = document.getElementById("modalLogin");
var span = document.getElementsByClassName("close-modal-login")[0];
var loginError = document.getElementById("message-error-login");
var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
var focusableElements;
var firstFocusableElement;
var lastFocusableElement;
var previouslyFocusableElements = [];

var firstFocusableElementsString =
  'input[type="text"], button:not([disabled])';

function openModal() {
  modal.style.display = "block";
  document.body.classList.add("no-scroll");

  focusableElements = modal.querySelectorAll(focusableElementsString);
  focusableElements2 = modal.querySelectorAll(firstFocusableElementsString);
  firstFocusableElement = focusableElements2[0];
  lastFocusableElement = focusableElements[focusableElements.length - 1];
  disableBackgroundFocus();
  firstFocusableElement.focus();
  modal.addEventListener("keydown", trapFocus);
}

function closeModal() {
  modal.style.display = "none";
  document.body.classList.remove("no-scroll");
  restoreBackgroundFocus();
  modal.removeEventListener("keydown", trapFocus);
}

function trapFocus(event) {
  if (event.key === "Tab") {
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    }
  }

  if (event.key === "Escape") {
    closeModal();
  }
}

function disableBackgroundFocus() {
  var allFocusableElements = document.querySelectorAll(focusableElementsString);
  
  allFocusableElements.forEach(function (element) {
    if (!modal.contains(element)) {
      previouslyFocusableElements.push({
        element: element,
        tabindex: element.getAttribute("tabindex")
      });
      element.setAttribute("tabindex", "-1");
    }
  });
}

function restoreBackgroundFocus() {
  previouslyFocusableElements.forEach(function (item) {
    if (item.tabindex !== null) {
      item.element.setAttribute("tabindex", item.tabindex);
    } else {
      item.element.removeAttribute("tabindex");
    }
  });
  previouslyFocusableElements = [];
}

// span.onclick = closeModal;

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

window.onload = function () {
  if (loginError) {
    openModal();
  }
};


$('.fa-eyes').click(function(){
    if ($(this).hasClass('fa-eye')) {
      $(this).closest('.password_container').find('input').prop('type', 'text');
      $(this).removeClass('fa-eye');
      $(this).addClass('fa-eye-slash');
    } else if ($(this).hasClass('fa-eye-slash')) {
      $(this).closest('.password_container').find('input').prop('type', 'password');
      $(this).removeClass('fa-eye-slash');
      $(this).addClass('fa-eye');
    }
  });



  function acceptCookies() {
    $(".modal .close").click();
    $("#epd").hide();
    var date = new Date();
    date.setTime(date.getTime()+(7*26*24*60*60*1000)); // 6 mois
    var expires = "; expires="+date.toGMTString();
    document.cookie = "cookiesConscent=1"+expires+"; path=/";
    $.get('/websvc/statsCookieConscent.ws.php?accept=1&nocache='+Math.random());
    
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'ad_storage': 'granted',
          'analytics_storage': 'granted'
        });
      } else {
        console.log('Google tag (gtag.js) not loaded yet');
      }
  
  }
  
  function refuseCookies() {
    $(".modal .close").click();
    $("#epd").hide();
    var date = new Date();
    date.setTime(date.getTime()+(7*26*24*60*60*1000)); // 6 mois
    var expires = "; expires="+date.toGMTString();
    document.cookie = "cookiesConscent=0"+expires+"; path=/";
    $.get('/websvc/statsCookieConscent.ws.php?accept=0&nocache='+Math.random());
  }

//pour block enfrant adultes
  const tabs = document.querySelectorAll('.tab-title');
  const sections = document.querySelectorAll('.tab-section');

  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          sections.forEach(s => s.classList.remove('active'));

          tab.classList.add('active');
          document.getElementById(tab.dataset.tab).classList.add('active');
      });
  });