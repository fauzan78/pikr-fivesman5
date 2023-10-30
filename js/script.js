// toggle class active//
const navbarNav = document.querySelector(".navbar-nav");
//ketika hamburger menu di click //
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};
// klik wdiluar sidebarb //
const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});
// slider baru

const initSlider = () => {
  const imageList = document.querySelector(".slider-wrapper .image-list");
  const slideButtons = document.querySelectorAll(
    ".slider-wrapper .slide-button"
  );
  const sliderScrollbar = document.querySelector(
    ".container .slider-scrollbar"
  );
  const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
  const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

  // Handle scrollbar thumb drag
  scrollbarThumb.addEventListener("mousedown", (e) => {
    const startX = e.clientX;
    const thumbPosition = scrollbarThumb.offsetLeft;
    const maxThumbPosition =
      sliderScrollbar.getBoundingClientRect().width -
      scrollbarThumb.offsetWidth;

    // Update thumb position on mouse move
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const newThumbPosition = thumbPosition + deltaX;

      // Ensure the scrollbar thumb stays within bounds
      const boundedPosition = Math.max(
        0,
        Math.min(maxThumbPosition, newThumbPosition)
      );
      const scrollPosition =
        (boundedPosition / maxThumbPosition) * maxScrollLeft;

      scrollbarThumb.style.left = `${boundedPosition}px`;
      imageList.scrollLeft = scrollPosition;
    };

    // Remove event listeners on mouse up
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Add event listeners for drag interaction
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });

  // Slide images according to the slide button clicks
  slideButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.id === "prev-slide" ? -1 : 1;
      const scrollAmount = imageList.clientWidth * direction;
      imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  });

  // Show or hide slide buttons based on scroll position
  const handleSlideButtons = () => {
    slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "flex";
    slideButtons[1].style.display =
      imageList.scrollLeft >= maxScrollLeft ? "none" : "flex";
  };

  // Update scrollbar thumb position based on image scroll
  const updateScrollThumbPosition = () => {
    const scrollPosition = imageList.scrollLeft;
    const thumbPosition =
      (scrollPosition / maxScrollLeft) *
      (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
    scrollbarThumb.style.left = `${thumbPosition}px`;
  };

  // Call these two functions when image list scrolls
  imageList.addEventListener("scroll", () => {
    updateScrollThumbPosition();
    handleSlideButtons();
  });
};

window.addEventListener("resize", initSlider);
window.addEventListener("load", initSlider);
// wrapper
const wrapper1 = document.querySelector(".wrapper");
const carousel1 = document.querySelector(".carousel");
const firstCardWidth1 = carousel1.querySelector(".card").offsetWidth;
const arrowBtns1 = document.querySelectorAll(".wrapper i");
const carouselChildrens1 = [...carousel1.children];
let isDragging1 = false,
  isAutoPlay1 = true,
  startX1,
  startScrollLeft1,
  timeoutId1;

// Get the number of cards that can fit in the carousel at once
let cardPerView1 = Math.round(carousel1.offsetWidth / firstCardWidth1);

// Insert copies of the last few cards to the beginning of the carousel for infinite scrolling
carouselChildrens1
  .slice(-cardPerView1)
  .reverse()
  .forEach((card) => {
    carousel1.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to the end of the carousel for infinite scrolling
carouselChildrens1.slice(0, cardPerView1).forEach((card) => {
  carousel1.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at the appropriate position to hide the first few duplicate cards on Firefox
carousel1.classList.add("no-transition");
carousel1.scrollLeft = carousel1.offsetWidth;
carousel1.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns1.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel1.scrollLeft +=
      btn.id == "left" ? -firstCardWidth1 : firstCardWidth1;
  });
});

// Define common functions for both carousels
const dragStart = (e) => {
  isDragging1 = true;
  carousel1.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX1 = e.pageX;
  startScrollLeft1 = carousel1.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging1) return; // if isDragging is false, return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel1.scrollLeft = startScrollLeft1 - (e.pageX - startX1);
};

const dragStop = () => {
  isDragging1 = false;
  carousel1.classList.remove("dragging");
};

const infiniteScroll = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel1.scrollLeft === 0) {
    carousel1.classList.add("no-transition");
    carousel1.scrollLeft = carousel1.scrollWidth - 2 * carousel1.offsetWidth;
    carousel1.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel1.scrollLeft) ===
    carousel1.scrollWidth - carousel1.offsetWidth
  ) {
    carousel1.classList.add("no-transition");
    carousel1.scrollLeft = carousel1.offsetWidth;
    carousel1.classList.remove("no-transition");
  }
  // Clear existing timeout and start autoplay if the mouse is not hovering over the carousel
  clearTimeout(timeoutId1);
  if (!wrapper1.matches(":hover")) autoPlay1();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay1) return; // Return if the window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId1 = setTimeout(
    () => (carousel1.scrollLeft += firstCardWidth1),
    2500
  );
};

// Attach event listeners to the first carousel
carousel1.addEventListener("mousedown", dragStart);
carousel1.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel1.addEventListener("scroll", infiniteScroll);
wrapper1.addEventListener("mouseenter", () => clearTimeout(timeoutId1));
wrapper1.addEventListener("mouseleave", autoPlay);

// The second carousel can be defined similarly with unique variable names and reused functions.
