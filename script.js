import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

console.log("Script loaded!");
document.addEventListener("DOMContentLoaded", () => {
  // HOMEPAGE SCROLL ANIMATION 
  // referenced fro this youtube video: https://www.youtube.com/watch?v=KE2NeszFQl0

  const spotlightSection = document.querySelector(".spotlight");
  
  // Only run GSAP animations if spotlight section exists (homepage)
  if (spotlightSection) {
    console.log("Spotlight section found - initializing GSAP animations");
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const spotlightImgFinalPos = [
      [-140, -140],
      [40, -130],
      [-160, 40],
      [20, 30],
    ];

    const spotlightImages = document.querySelectorAll(".spotlight-img");

    ScrollTrigger.create({
      trigger: ".spotlight",
      start: "top top",
      end: `+${window.innerHeight * 6}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const initialRotations = [5, -3, 3.5, -1];
        const phaseOneStartOffsets = [0, 0.1, 0.2, 0.3];

        spotlightImages.forEach((img, index) => {
          const initialRotation = initialRotations[index];
          const phase1Start = phaseOneStartOffsets[index];
          const phase1End = Math.min(
            phase1Start + (0.45 - phase1Start) * 0.9,
            0.45
          );

          let x = -50;
          let y, rotation;

          if (progress < phase1Start) {
            y = 200;
            rotation = initialRotation;
          } else if (progress <= 0.45) {
            let phase1Progress;

            if (progress >= phase1End) {
              phase1Progress = 1;
            } else {
              const linearProgress =
                (progress - phase1Start) / (phase1End - phase1Start);
              phase1Progress = 1 - Math.pow(1 - linearProgress, 3);
            }

            y = 200 - phase1Progress * 250;
            rotation = initialRotation;
          } else {
            y = -50;
            rotation = initialRotation;
          }

          const phaseTwoStartOffsets = [0.5, 0.55, 0.6, 0.65];
          const phase2Start = phaseTwoStartOffsets[index];
          const phase2End = Math.min(
            phase2Start + (0.95 - phase2Start) * 0.9,
            0.95
          );
          const finalX = spotlightImgFinalPos[index][0];
          const finalY = spotlightImgFinalPos[index][1];

          if (progress >= phase2Start && progress <= 0.95) {
            let phase2Progress;

            if (progress >= phase2End) {
              phase2Progress = 1;
            } else {
              const linearProgress =
                (progress - phase2Start) / (phase2End - phase2Start);
              phase2Progress = 1 - Math.pow(1 - linearProgress, 3);
            }

            x = -50 + (finalX + 50) * phase2Progress;
            y = -50 + (finalY + 50) * phase2Progress;
            rotation = initialRotation * (1 - phase2Progress);
          } else if (progress > 0.95) {
            x = finalX;
            y = finalY;
            rotation = 0;
          }

          gsap.set(img, {
            transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)`,
          });
        });
      },
    });
  }

  // gallery
  console.log("Gallery script loaded!");

  const gallery = document.querySelector(".gallery");
  console.log("Gallery element:", gallery);

  const heroImg = document.getElementById("hero-img");
  const thumbsContainer = document.getElementById("thumbs");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const leftArrow = document.querySelector(".arrow.left");
  const rightArrow = document.querySelector(".arrow.right");

  let currentIndex = 0;
  let images = [];

  if (gallery) {
    const city = gallery.dataset.city;
    console.log("City:", city);

    const imageSets = {
      fairbanks: Array.from({ length: 14 }, (_, i) => `./photos/fairbanks/fb${i + 1}.jpg`),
      jaipur: Array.from({ length: 16 }, (_, i) => `./photos/jaipur/j${i + 1}.jpg`),
      hk: Array.from({ length: 18 }, (_, i) => `./photos/hk/hk${i + 1}.jpg`)
    };

    images = imageSets[city];
    console.log("Images array:", images);
    console.log("Number of images:", images.length);

    images.forEach((src, index) => {
      console.log(`Creating thumb ${index + 1}:`, src);
      
      const thumbDiv = document.createElement("div");
      thumbDiv.className = "thumb";
      
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${city} ${index + 1}`;
      
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };
      
      img.onload = () => {
        console.log(`Successfully loaded: ${src}`);
      };
      
      thumbDiv.appendChild(img);
      thumbsContainer.appendChild(thumbDiv);

      thumbDiv.addEventListener("click", () => {
        currentIndex = index;
        heroImg.src = images[currentIndex];
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    console.log("Thumbnails created!");

    heroImg.addEventListener("click", () => {
      lightbox.classList.add("active");
      lightboxImg.src = images[currentIndex];
    });

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      heroImg.src = images[currentIndex];
      lightboxImg.src = images[currentIndex];
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      heroImg.src = images[currentIndex];
      lightboxImg.src = images[currentIndex];
    }

    if (leftArrow) {
      leftArrow.addEventListener("click", prevImage);
    }

    if (rightArrow) {
      rightArrow.addEventListener("click", nextImage);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
      }
    });
  } else {
    console.log("No gallery element found on this page"); //for error handling
  }
});