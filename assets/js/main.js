(() => {
  document.documentElement.classList.add("js-enabled");

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".site-header__toggle");
  const menu = document.querySelector("#menu-principal");

  if (!header || !menuToggle || !menu) {
    return;
  }

  const closeMenu = () => {
    header.classList.remove("is-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  };

  const openMenu = () => {
    header.classList.add("is-menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      closeMenu();
      return;
    }

    openMenu();
  });

  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (link) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
})();

(() => {
  // Com movimento reduzido, deixa o <details> abrir e fechar nativamente.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.querySelectorAll(".faq-item").forEach((item) => {
    const summary = item.querySelector(".faq-item__question");
    const content = item.querySelector(".faq-item__answer");

    if (!summary || !content) {
      return;
    }

    let animating = false;

    const finish = () => {
      content.style.removeProperty("height");
      animating = false;
    };

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (animating) {
        return;
      }

      animating = true;

      if (item.open) {
        content.style.height = `${content.scrollHeight}px`;
        // Lê o layout para o navegador aplicar a altura atual antes de ir a zero,
        // senão as duas mudanças caem no mesmo recálculo e não há transição.
        void content.offsetHeight;
        content.style.height = "0px";

        content.addEventListener("transitionend", () => {
          item.open = false;
          finish();
        }, { once: true });

        return;
      }

      item.open = true;

      const target = content.scrollHeight;

      content.style.height = "0px";
      void content.offsetHeight;
      content.style.height = `${target}px`;

      content.addEventListener("transitionend", finish, { once: true });
    });
  });
})();

(() => {
  const popup = document.querySelector("#popup-lancamento");

  if (!popup) {
    return;
  }

  const closeButton = popup.querySelector(".popup__close");
  const lastFocused = document.activeElement;

  const closePopup = () => {
    popup.hidden = true;
    document.body.style.removeProperty("overflow");

    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  const openPopup = () => {
    popup.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  };

  closeButton.addEventListener("click", closePopup);

  popup.querySelector(".popup__link").addEventListener("click", closePopup);

  // Clique fora do conteúdo fecha.
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popup.hidden) {
      closePopup();
    }
  });

  openPopup();
})();

(() => {
  const ROTATE = 30;
  const DEPTH = 100;

  document.querySelectorAll(".carousel").forEach((carousel) => {
    const slides = [...carousel.querySelectorAll(".carousel__slide")];
    const prev = carousel.querySelector(".carousel__control--prev");
    const next = carousel.querySelector(".carousel__control--next");
    const dotsWrapper = carousel.querySelector(".carousel__dots");
    const total = slides.length;

    if (total === 0 || !prev || !next) {
      return;
    }

    let active = 0;

    const dots = slides.map((slide, index) => {
      if (!dotsWrapper) {
        return null;
      }

      const dot = document.createElement("button");

      dot.className = "carousel__dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir para a foto ${index + 1} de ${total}`);
      dot.addEventListener("click", () => render(index));
      dotsWrapper.appendChild(dot);

      return dot;
    });

    // Distância assinada até o slide ativo, dando a volta pelo caminho mais curto.
    const offsetOf = (index) => {
      let offset = index - active;

      if (offset > total / 2) {
        offset -= total;
      }

      if (offset < -total / 2) {
        offset += total;
      }

      return offset;
    };

    const previousOffsets = new Map();

    function render(index) {
      active = (index + total) % total;

      const slideWidth = slides[0].getBoundingClientRect().width;

      slides.forEach((slide, i) => {
        const offset = offsetOf(i);
        const depth = -DEPTH * Math.abs(offset);
        const previous = previousOffsets.get(i);

        // Quem dá a volta pula mais de uma posição e atravessaria a área
        // visível durante a transição. Esse reposiciona sem animar.
        const jumped = previous === undefined || Math.abs(offset - previous) > 1;

        if (jumped) {
          slide.style.transition = "none";
        }

        slide.style.transform = `translate3d(${offset * slideWidth}px, 0, ${depth}px) rotateY(${-ROTATE * offset}deg)`;
        slide.style.zIndex = String(total - Math.abs(offset));
        slide.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
        previousOffsets.set(i, offset);

        if (jumped) {
          // Lê uma propriedade de layout para o navegador aplicar a posição
          // agora, sem animar, antes de devolver a transição ao slide.
          void slide.offsetWidth;
          slide.style.transition = "";
        }
      });

      dots.forEach((dot, i) => {
        if (dot) {
          dot.setAttribute("aria-current", i === active ? "true" : "false");
        }
      });
    }

    prev.addEventListener("click", () => render(active - 1));
    next.addEventListener("click", () => render(active + 1));

    let touchStartX = null;

    carousel.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
      if (touchStartX === null) {
        return;
      }

      const distance = event.changedTouches[0].clientX - touchStartX;

      touchStartX = null;

      if (Math.abs(distance) < 40) {
        return;
      }

      render(distance < 0 ? active + 1 : active - 1);
    }, { passive: true });

    window.addEventListener("resize", () => render(active));

    render(0);
  });
})();
