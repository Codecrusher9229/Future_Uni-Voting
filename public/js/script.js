//ye mtt htana yha se
if (window.innerWidth >= 769 && window.innerWidth <= 2560) {
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
      // Remove any inline styles first
      document.body.removeAttribute("style");

      // Apply the background color, overflow, and z-index with !important
      document.body.style.setProperty("overflow", "scroll", "important");
      document.body.style.setProperty("overflow-x", "hidden", "important");
      document.body.style.setProperty("z-index", "-1", "important");
    }, 7000); // 4000 milliseconds = 4 seconds
  });
}

// Set the target date and time for the countdown
const targetDate = new Date("April 5, 2025 15:00:00").getTime();

// Update the countdown every second
const countdownInterval = setInterval(() => {
  // Get the current date and time
  const now = new Date().getTime();

  // Calculate the time difference between the current date/time and the target date/time
  const timeDifference = targetDate - now;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Display the calculated time in the HTML elements
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

  // Check if the countdown has expired
  if (timeDifference < 0) {
    clearInterval(countdownInterval);
    document.getElementById("timer").innerHTML = "Countdown expired";
  }
}, 1000);

//slider js
let currentIndex = 0;
let imageArray = [];

async function fetchEventBanners() {
  try {
    // ✅ Fetch event banners from API
    const response = await fetch("https://future-uni-voting.onrender.com/api/events");
    const events = await response.json();

    // ✅ Check if events have images
    if (!events.length) {
      console.warn("No event banners found!");
      return;
    }

    // ✅ Extract banner images & update the slider
    imageArray = events.map(
      (event) => `https://future-uni-voting.onrender.com${event.imageUrl}`
    );
    updateSlider();
  } catch (error) {
    console.error("Error fetching event banners:", error);
  }
}

function updateSlider() {
  const slider = document.getElementById("slider");
  slider.innerHTML = ""; // Clear existing images

  imageArray.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Event Image ${index + 1}`;
    slider.appendChild(img);
  });

  showSlide(currentIndex);
}

function showSlide(index) {
  const slider = document.getElementById("slider");
  slider.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % imageArray.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
  showSlide(currentIndex);
}

// ✅ Load banners when page loads
document.addEventListener("DOMContentLoaded", fetchEventBanners);

function autoSlide() {
  nextSlide();
  setTimeout(autoSlide, 3000);
}

setTimeout(autoSlide, 3000);

// smooth scroll

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  // Select all anchor links within the nav
  const links = document.querySelectorAll("nav a");

  // Add event listener for each link
  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      // Prevent the default behavior (jumping to the section)
      event.preventDefault();

      // Get the target section's ID
      const targetId = link.getAttribute("href").substring(1);

      // Scroll smoothly to the target section
      document.getElementById(targetId).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});

//vote hidden section of html

// Set the specific date and time (format: YYYY, MM, DD, HH, MM, SS)
// March 16, 2025 at 3:00 PM (Please note: months are zero-indexed in JavaScript)
const ate = new Date(2025, 2, 15, 21, 38, 0); // March 16, 2025 at 3:00 PM

function checkDate() {
  const currentDate = new Date();

  // Check if the current date/time is past the target date/time
  if (currentDate >= ate) {
    document.getElementById("hidden-vote").style.display = "block"; // Show the div
  }
}

// Call the function to check the date and time
checkDate();

// Optionally, you can check every minute to ensure it shows exactly at the right time
setInterval(checkDate, 60000); // Check every 60 seconds

//typewriting effect in future university (card)
document.addEventListener("DOMContentLoaded", function () {
  let word6 = document.querySelector(".word6");
  let text = "Future University";
  let index = 0;

  // Start with empty content
  word6.innerHTML = "";

  function typeEffect() {
    if (index < text.length) {
      word6.innerHTML += text[index]; // Add one letter at a time
      index++;
      setTimeout(typeEffect, 150); // Typing speed (adjust if needed)
    } else {
      word6.style.borderRight = "none"; // Remove cursor after typing
    }
  }
  setTimeout(typeEffect, 5000); // Delay start after other words animate
});

// FETCH & DISPLAY EVENTS
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://future-uni-voting.onrender.com/api/events");
    const events = await response.json();
    const eventsContainer = document.getElementById("eventsContainer");
    eventsContainer.innerHTML = "";

    events.forEach((event) => {
      const eventCard = document.createElement("div");
      eventCard.classList.add("event-card");
      eventCard.innerHTML = `
          <div class="event-inner">
            <div class="event-front">
              <div class="event-info">
                <img src="https://future-uni-voting.onrender.com${event.imageUrl}" alt="${
        event.title
      }" />
                <p class="event-title">${event.title}</p>
                <p class="event-date">${new Date(event.date).toDateString()}</p>
              </div>
            </div>
          </div>`;
      eventCard.addEventListener("click", () => openAnimeWindow(event));
      eventsContainer.appendChild(eventCard);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
});

// EVENT DETAILS POPUP (ANIME-WINDOW)
function openAnimeWindow(event) {
  const animeWindow = document.getElementById("anime-window");
  const upcomingff = document.getElementById("upcomingff");

  // Scroll the content of the main3 container to the top
  const main3 = document.getElementById("main3");
  main3.scrollTop = 0; // Scroll the main3 container to the top

  // ✅ Set the content for the popup
  animeWindow.innerHTML = `
  <div class="anime-flexy">
    <div class="firsty">
      <img src="https://future-uni-voting.onrender.com${event.imageUrl}" alt="${event.title}" />
      <p class="anime-event-title">${event.title}</p>
      <p class="anime-event-date">${new Date(event.date).toDateString()}</p>
      <a href="/public/html/register.html" class="anime-btn" id="toggleregister2">Register now!</a> 
    </div>
    <div class="desci">
      <div class="back-card" onclick="backCard()">Close this tab <i class="fa-solid fa-xmark"></i></div>
      <h4>Description and guidelines(scroll):</h4>
      <p style="height:17vw; overflow:scroll">${event.description}</p>
    </div>
  </div>`;

  // ✅ Show the anime window after delay
  setTimeout(() => {
    main3.style.overflow = "hidden";
    animeWindow.style.display = "block";
    animeWindow.style.zIndex = "999"; // Ensure it's on top of other content
  }, 500); // Delay by 0.5 seconds

  // ✅ Ensure `toggleregister2` Disables After Rendering
  setTimeout(async () => {
    const toggleregister2 = document.getElementById("toggleregister2");

    if (!toggleregister2) {
      console.error("Error: `toggleregister2` not found!");
      return;
    }

    try {
      const response = await fetch("https://future-uni-voting.onrender.com/api/toggle");
      const data = await response.json();

      // ✅ Apply disable styles
      toggleregister2.style.pointerEvents = data.registerDisabled
        ? "none"
        : "auto";
      toggleregister2.style.opacity = data.registerDisabled ? "0.5" : "1";
      toggleregister2.style.cursor = data.registerDisabled
        ? "not-allowed"
        : "pointer";

      // ✅ Prevent Click & Show Alert if Disabled
      toggleregister2.addEventListener("click", (event) => {
        if (data.registerDisabled) {
          event.preventDefault();
          alert("❌ Registration is currently disabled!");
        }
      });
    } catch (error) {
      console.error("❌ Error fetching toggle state:", error);
    }
  }, 800); // ✅ Small delay to ensure element exists

  // Animate other elements
  gsap.to("#upcomingff", {
    y: -600,
    duration: 1,
  });

  gsap.to(".mobile", {
    y: -600,
    duration: 1,
  });

  gsap.to(".event-card", {
    y: -1200,
    duration: 1,
    stagger: 0.1,
  });
}

// CLOSE EVENT DETAILS
function backCard() {
  const animeWindow = document.getElementById("anime-window");
  const upcomingff = document.getElementById("upcomingff");
  const main3 = document.getElementById("main3");

  animeWindow.style.display = "none";
  animeWindow.style.zIndex = "-1"; // Move the anime window out of view

  // Animate the closing of the #anime-window and reset other elements
  gsap.to("#upcomingff", {
    y: 0,
    duration: 1,
    delay: 0,
  });

  gsap.to(".mobile", {
    y: 0,
    duration: 1,
    delay: 0,
  });

  gsap.to(".event-card", {
    y: 0,
    duration: 0.4,
    delay: 0,
    stagger: 0.1,
  });

  // Restore the overflow of main3 to scroll after closing the window
  main3.style.overflow = "scroll"; // Enable scrolling on main3
}

//other animation buddyyy
if (window.innerWidth >= 769 && window.innerWidth <= 2560) {
  const tl = gsap.timeline();
  tl.from(".futurelogo img", {
    scale: 2,
    x: "41vw",
    y: "20vw",
    duration: 1,
    delay: 2,
  });
  tl.to(".coverpg", {
    y: "-62vw",
    duration: 3.5,
  });
  tl.from(".nav2 a", {
    y: "-6vw",
    stagger: 0.1,
    delay: 0,
    duration: 0.4,
  });

  gsap.from(".supermain", {
    opacity: 0,
    delay: 4,
    duration: 2,
  });
  gsap.from("#sick", {
    x: 500,
    duration: 2,
    delay: 4,
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.from("#main2", {
    opacity: 0,
    scrollTrigger: {
      trigger: "#main2",
      start: "top 90%",
      end: "top 50%",
      scrub: 1,
    },
  });

  gsap.from("#main2 h2", {
    x: 50,
    scrollTrigger: {
      trigger: "#main2 h2",
      start: "top 80%",
      end: "top 50%",
      scrub: 1,
    },
  });

  gsap.from("#timer", {
    y: 400,
    scrollTrigger: {
      trigger: "#main2",
      start: "top 30%",
      end: "top 10%",
      scrub: 1,
    },
  });

  gsap.to("#main2", {
    y: -200,
    scrollTrigger: {
      trigger: ".middle",
      start: "top 25%",
      end: "top 10%",
      scrub: 1,
    },
  });

  gsap.from(".guess", {
    x: -600,
    scrollTrigger: {
      trigger: ".middle",
      start: "top 75%",
      end: "top 10%",
      scrub: 1,
    },
  });

  gsap.from(".attach h2", {
    x: 1100,
    scrollTrigger: {
      trigger: ".attach",
      start: "top 75%",
      end: "top 50%",
      scrub: 1,
    },
  });

  gsap.from(".star-btn", {
    x: -1200,
    scrollTrigger: {
      trigger: ".star-btn",
      start: "top 98%",
      end: "top 80%",
      scrub: 1,
    },
  });

  gsap.from("body", {
    scrollTrigger: {
      lerp: 0.001,
    },
  });
}
// GSAP wala
document.querySelectorAll("a").forEach((anchor) => {
  anchor.addEventListener("click", function () {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500); // Thoda delay de sakte ho
  });
});

// Toggle Logic
document.addEventListener("DOMContentLoaded", async () => {
  const toggleVote = document.getElementById("toggleVote");
  const toggleRegister = document.getElementById("toggleRegister");
  const statusMessage = document.getElementById("statusMessage"); // ✅ Select status message

  if (!toggleVote || !toggleRegister) {
    console.error("Error: One or more buttons not found!");
    return; // Stop execution if any button doesn't exist
  }

  async function checkToggleState() {
    try {
      const response = await fetch("https://future-uni-voting.onrender.com/api/toggle");
      const data = await response.json();

      // ✅ Disable buttons & block cursor based on toggle states
      toggleVote.disabled = data.voteDisabled;
      toggleVote.style.opacity = data.voteDisabled ? "0.5" : "1";
      toggleVote.style.cursor = data.voteDisabled ? "not-allowed" : "pointer";

      toggleRegister.disabled = data.registerDisabled;
      toggleRegister.style.opacity = data.registerDisabled ? "0.5" : "1";
      toggleRegister.style.cursor = data.registerDisabled
        ? "not-allowed"
        : "pointer";

      // ✅ Prevent clicks when disabled
      if (data.voteDisabled) {
        toggleVote.addEventListener("click", (event) => event.preventDefault());
      }
      if (data.registerDisabled) {
        toggleRegister.addEventListener("click", (event) =>
          event.preventDefault()
        );
      }
      // ✅ Display message when disabled
      if (data.voteDisabled) {
        statusMessage.textContent = "❌ Can not vote now.";
        statusMessage.style.color = "red";
      } else if (data.registerDisabled) {
        statusMessage.textContent = "❌ Can not register now.";
        statusMessage.style.color = "red";
      } else {
        statusMessage.textContent = ""; // Clear message if both are enabled
      }
    } catch (error) {
      // console.error("Error fetching toggle state:", error);
    }
  }

  checkToggleState(); // Fetch state on page load
});

// ✅ Check for toggle updates using localStorage
function checkForToggleUpdate() {
  const lastUpdate = localStorage.getItem("toggleUpdate");

  // ✅ Compare timestamps to detect any changes
  if (lastUpdate) {
    console.log("🔄 Detected Toggle Update. Refreshing...");
    localStorage.removeItem("toggleUpdate"); // Clean up
    location.reload(); // Refresh the page
  }
}

// ✅ Check every second (adjust if necessary)
setInterval(checkForToggleUpdate, 1000);

// Club Container Logic
const swiper = new Swiper(".slider-wrapper", {
  loop: true,
  grabCursor: true,
  spaceBetween: 30,
  // Pagination bullets
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  // Responsive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Railgadi wale cards
async function fetchParticipants() {
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Show loader

  try {
    const response = await fetch(
      "https://future-uni-voting.onrender.com/api/future/participants"
    );
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const participants = await response.json();
    // console.log("Fetched Participants:", participants); // Debugging

    const participantTrack = document.getElementById("participantTrack");

    if (!participantTrack) {
      console.error("Participant Track not found!");
      return;
    }

    // Clear previous data
    participantTrack.innerHTML = "";

    participants.forEach((participant) => {
      const card = document.createElement("div");
      card.classList.add("participant-card");
      card.innerHTML = `
        <img src="https://future-uni-voting.onrender.com${participant.candidateImg}" alt="${participant.fullName}">
        <h3>${participant.fullName}</h3>

        
       
        <span>${participant.category}</span>
      `;
       // <p>${participant.department}</p>
      participantTrack.appendChild(card);
    });

    // Duplicate for Infinite Loop Effect
    duplicateCards(participantTrack);
  } catch (error) {
    console.error("Error fetching participants:", error);
    // alert("Failed to load participants. Please try again later.");
  } finally {
    loader.style.display = "none"; // Hide loader
  }
}

function duplicateCards(container) {
  if (!container) return;
  const cards = Array.from(container.children);
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    container.appendChild(clone);
  });
}

fetchParticipants();

// Disable right-click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Disable specific keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
    alert("Inspecting is disabled!");
  }
});

document.addEventListener("keydown", function (e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // Prevent the default action (scrolling)
  }
});

// Block
// window.onload = function () {
//   const maxRefreshes = 10; //kitni baar refresh kar sakte hai ye declare kr rhe hai yha par
//   const blockTime = 10 * 60 * 1000; // 10 min ka block time

//   // Check if the user was previously blocked and now allowed
//   if (localStorage.getItem("unblocked")) {
//     localStorage.removeItem("unblocked");
//     alert("✅ You are now unblocked! Welcome back.");
//     resetData();
//     return;
//   }

//   // Get refresh data from localStorage or initialize it
//   const refreshData = JSON.parse(localStorage.getItem("refreshData")) || {
//     count: 0,
//     firstRefresh: Date.now(),
//     blockedUntil: null,
//   };

//   // Reset data if block time has passed and the user is still stuck
//   if (refreshData.blockedUntil && Date.now() >= refreshData.blockedUntil) {
//     resetData();
//   }

//   // Check if user is currently blocked
//   if (refreshData.blockedUntil && Date.now() < refreshData.blockedUntil) {
//     const remainingTime = Math.ceil(
//       (refreshData.blockedUntil - Date.now()) / 1000
//     );
//     showCountdown(remainingTime, refreshData.blockedUntil);
//     return; // Stop further execution
//   }

//   // Reset data if block time has passed
//   if (Date.now() - refreshData.firstRefresh > blockTime) {
//     resetData();
//   }

//   // Increment refresh count
//   refreshData.count++;

//   if (refreshData.count > maxRefreshes) {
//     alert(
//       "🚫 You are blocked due to excessive refresh attempts. Please try again later."
//     );
//     refreshData.blockedUntil = Date.now() + blockTime;
//     const remainingBlockTime = Math.ceil(blockTime / 1000);
//     localStorage.setItem("refreshData", JSON.stringify(refreshData));
//     showCountdown(remainingBlockTime, refreshData.blockedUntil);
//     return;
//   }

//   localStorage.setItem("refreshData", JSON.stringify(refreshData));
// };

// function showCountdown(remainingTime, blockedUntil) {
//   const container = document.createElement("div");
//   container.innerHTML = `<h2>You are temporarily blocked. Please try again in <span id="countdown">${remainingTime}</span> seconds.</h2>`;
//   document.body.innerHTML = "";
//   document.body.appendChild(container);

//   const countdownInterval = setInterval(() => {
//     const currentRemaining = Math.max(
//       0,
//       Math.ceil((blockedUntil - Date.now()) / 1000)
//     );
//     if (currentRemaining <= 0) {
//       clearInterval(countdownInterval);
//       resetData();
//       localStorage.setItem("unblocked", "true");
//       window.location.href = location.origin + "/public/index.html";
//     } else {
//       document.getElementById("countdown").textContent = currentRemaining;
//     }
//   }, 1000);
// }

// function resetData() {
//   localStorage.removeItem("refreshData");
//   localStorage.removeItem("unblocked");
// }
