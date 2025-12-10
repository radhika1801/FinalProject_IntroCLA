console.log("✅ Script loaded!");

document.addEventListener("DOMContentLoaded", () => {
  //homepage animation
  //referenced from this youtube video: https://www.youtube.com/watch?v=KE2NeszFQl0&t=314s

  const spotlightSection = document.querySelector(".spotlight");

  if (spotlightSection) {
    console.log("Spotlight section found - initializing GSAP");

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
        const phaseTwoStartOffsets = [0.5, 0.55, 0.6, 0.65];

        spotlightImages.forEach((img, index) => {
          const initialRotation = initialRotations[index];
          const finalX = spotlightImgFinalPos[index][0];
          const finalY = spotlightImgFinalPos[index][1];

          let x = -50;
          let y = 200;
          let rotation = initialRotation;

          if (progress > 0.45) y = -50;

          if (progress > phaseTwoStartOffsets[index]) {
            const t = Math.min(
              (progress - phaseTwoStartOffsets[index]) / 0.4,
              1
            );

            const ease = 1 - Math.pow(1 - t, 3);

            x = -50 + (finalX + 50) * ease;
            y = -50 + (finalY + 50) * ease;
            rotation = initialRotation * (1 - ease);
          }

          gsap.set(img, {
            transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)`,
          });
        });
      },
    });
  }

  //gallery

  console.log("Gallery script active");

  const gallery = document.querySelector(".gallery");
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

    images.forEach((src, index) => {
      const thumbDiv = document.createElement("div");
      thumbDiv.className = "thumb";

      const img = document.createElement("img");
      img.src = src;
      img.alt = `${city} ${index + 1}`;

      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
      };

      thumbDiv.appendChild(img);
      thumbsContainer.appendChild(thumbDiv);

      thumbDiv.addEventListener("click", () => {
        currentIndex = index;
        heroImg.src = images[currentIndex];
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

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

    if (leftArrow) leftArrow.addEventListener("click", prevImage);
    if (rightArrow) rightArrow.addEventListener("click", nextImage);

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
    console.log(" No gallery found on this page");//error handling
  }
});
