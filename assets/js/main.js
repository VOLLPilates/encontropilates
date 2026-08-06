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
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            content.style.height = "0px";

            content.addEventListener("transitionend", () => {
              item.open = false;
              finish();
            }, { once: true });
          });
        });

        return;
      }

      item.open = true;

      const target = content.scrollHeight;

      content.style.height = "0px";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          content.style.height = `${target}px`;
          content.addEventListener("transitionend", finish, { once: true });
        });
      });
    });
  });
})();

(() => {
  const modal = document.querySelector("#modal-inscricao");

  if (!modal) {
    return;
  }

  const closeButton = modal.querySelector(".form-modal__close");
  const firstField = modal.querySelector(".form-modal__input");
  const form = modal.querySelector(".form-modal__form");
  // Apenas o CTA da section de ingressos abre o formulário.
  const openers = document.querySelectorAll(".ingressos-section__cta");
  let lastFocused = null;

  // Enquanto o formulário for placeholder, não envia nada.
  // Quando o RD Station for configurado no HTML, remover este bloco.
  if (form && form.dataset.placeholder === "true") {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.removeProperty("overflow");

    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  const openModal = () => {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    firstField.focus();
  };

  openers.forEach((opener) => {
    opener.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();

(() => {
  const modal = document.querySelector("#modal-palestrante");
  const cards = [...document.querySelectorAll(".speaker-card")];

  if (!modal || cards.length === 0) {
    return;
  }

  // Biografias do site original, indexadas pelo nome do palestrante.
  const bios = {
    "Lolita San Miguel": [
      "Lolita San Miguel, nascida em Nova York, filha de pais porto-riquenhos, é uma professora de Pilates de primeira geração e pratica o método há 59 anos. Ela iniciou seus estudos de movimento corporal aos sete anos de idade como aluna de balé e teve uma carreira distinta na dança a partir dos 15 anos, integrando companhias como a Slavenska Franklin Ballet, Joffrey Ballet, e foi solista do Metropolitan Opera Ballet por dez anos.",
      "Apaixonou-se pelo Método Pilates, tornou-se aprendiz de Carola Trier e, posteriormente, de Joseph e Clara Pilates, sendo certificada por Joseph Pilates em 1967. Acreditando na educação contínua, também obteve um certificado da Polestar Pilates em 2003.",
      "Lolita mudou-se com o marido para Porto Rico em 1977. Lá, fundou o Ballet Concierto de Puerto Rico, onde atuou como Diretora Artística por 26 anos, e também fundou a Pilates y Más, Inc., em 2000. Retornou ao continente em 2005, iniciou seu bem-sucedido Programa de Mentoria para Mestres em Pilates, com 160 horas de duração, e produziu onze DVDs que se tornaram best-sellers. Em 2013, lançou seu programa de formação de professores Lolita's Legacy, com 500 horas de duração, que é ministrado ao redor do mundo: na Austrália, América do Sul, América Central, Porto Rico, Japão, Escócia, Ucrânia, Europa e, naturalmente, nos Estados Unidos.",
      "A Sra. San Miguel se orgulha especialmente de suas iniciativas para homenagear Joseph Pilates, tanto em seu local de nascimento quanto em seu local de descanso no Cemitério Ferncliff, em Nova York. Essas iniciativas resultaram na instalação de uma placa memorial no local onde ele nasceu, em Mönchengladbach, e na realização de conferências internacionais bienais de Pilates, como a que você está participando agora e, desde 2016, também em Nova York."
    ],
    "Kathy Corey": [
      "Kathy Corey é considerada a Mestre dos Mestres pois além de ter mais de 40 anos de experiência no universo do Pilates, ela foi a única até hoje a ser treinada por 4 Elders – discípulos diretos de Joseph. Ela é uma Master Teacher que iniciou sua carreira em 1979 e é Diretora da Kathy Corey Pilates."
    ],
    "Ricardo Jaramillo": [
      "Licenciado em Educação Física e em Osteopatia Estrutural. Ricardo é treinador da Federação Internacional de Fisiculturismo & Fitness (IFBB) e instrutor de Pilates certificado pela Pilates Method Alliance (PMA®). É autor do livro “Pilates en la práctica” (Pilates na prática)."
    ],
    "Jason Williams": [
      "Jason está na indústria de saúde e bem-estar desde 2002. Como ex-atleta universitário de atletismo, seu foco é integrar técnicas mente-corpo usando fitness, pilates, barre, reiki e meditação. Ele criou programas para formação de professores de pilates barre, escreveu artigos para mindbodygreen, Pilates Style Magazine, Prevention Health e outros. Além disso, é instrutor do Pilates Anytime e educador da Balanced Body. Jason escreveu quatro livros infantis de saúde e bem-estar, chamados “As Aventuras de Frankie Fitness”. Atualmente, ele dá aulas e treina em Baltimore, Maryland, e realiza cursos em Miami, Califórnia, Charleston, Chicago e outras cidades. Em 2023, foi eleito Best of Baltimore Fitness Influencer (Melhor Influenciador de Fitness de Baltimore)."
    ],
    "Lisa Hubbard": [
      "Educadora internacional de Pilates, palestrante e certificada como Health Coach (Treinadora de Saúde) com mais de 25 anos de experiência. Fundadora do Rhythm Pilates, possui credenciais em Yoga e GYROTONIC®, sendo conhecida mundialmente por sua abordagem criativa e técnica refinada no Método Pilates."
    ],
    "Carrie Pages": [
      "Com mais de 20 anos de experiência no ensino, Carrie Pages é fundadora do primeiro estúdio de Pilates de Wilmington, o In Balance Pilates Studio, e criadora do CarriePagesPilates.com, uma plataforma online com mais de 400 aulas para instrutores e alunos dedicados ao redor do mundo. Vencedora da 2016 Pilates Anytime Next Instructor Competition (Competição de Próximo Instrutor do Pilates Anytime 2016), ela combina as raízes do Pilates clássico com aplicações criativas e do mundo real, inspirando instrutores a reacender sua paixão pelo ensino."
    ],
    "Glaucia Adriana": [
      "Fisioterapeuta e oradora internacional, com 24 anos de experiência. É da segunda geração do Método Pilates e educadora de Lolita San Miguel. Participou de cursos com várias lendas do Método."
    ],
    "Thalyssa Larangeiras": [
      "Uma das profissionais mais admiradas e seguidas do Brasil pelo seu talento, carisma e técnica apurada. Fisioterapeuta, especialista em Movimento Funcional e instrutora de Pilates desde 2011. Possui formação no Método Pilates, MAT Pilates Avançado com acessórios, aeropilates, alongamento consciente, Ballness, Slide Board e Barre Pilates. Proprietária da clínica LIFE – Pilates, Estética e RPG."
    ],
    "Keyner Luiz": [
      "Um dos maiores profissionais do movimento no Brasil. Foi sócio do Grupo VOLL por 10 anos e é criador do MIT (Movimento Inteligente). Instrutor de Pilates e Treinamento Funcional. Fisioterapeuta formado pela UNISANTA, com pós-graduação em Fisiologia do Exercício pela CEFE. Também possui formação em MAT Pilates, Pilates Studio, Pilates Fisioterapêutico e Pilates Clássico. Ministra palestras e workshops nos maiores eventos da América Latina. Considerado um dos maiores influenciadores do país na área, tem milhares de mentorados no Brasil e no exterior."
    ],
    "Rodrigo Nanô": [
      "Formado pela Escola Pilates Wellness & Energy, em Madrid – Espanha. Possui título de certificação da Pilates Method Alliance. Participou de cursos, conferências e workshops na Europa, Ásia e América, trazendo profissionais renomados para o Brasil. Hoje ministra cursos em Portugal, Itália e Espanha. É formado pela escola americana referência no Autêntico Método Pilates – Metropolitan Pilates, com a renomada professora Dorothee Vandewalle, Seattle/EUA."
    ],
    "Mariana Dias": [
      "Um dos grandes talentos brasileiros atuais. Criadora da Metodologia Pilates Construtivo, sócia-proprietária do Instituto VOLL e vencedora do Prêmio Contrology 2023. Fisioterapeuta pela Universidade Estadual de Londrina (UEL), pós-graduada em Fisioterapia Aplicada em Traumato-Ortopedia e Esportiva. Viaja pelo Brasil e o exterior ensinando sua metodologia e é parte integrante do Pilates Trip, uma comunidade que roda o mundo mostrando diferentes vertentes do Pilates."
    ],
    "Marcella Contursi": [
      "Bailarina clássica, fisioterapeuta e pós-graduada em Pilates e prescrição do exercício físico. Atua no Método Pilates desde 2011 e ministra cursos desde 2014. Proprietária do Studio Pilates Marcella Contursi, em Santos/SP. Viaja o Brasil ensinando sua metodologia e é reconhecida por formar uma comunidade engajada, com foco em qualidade do exercício, sequências criativas e planejamento inteligente de aulas."
    ],
    "Morgana Peroni": [
      "Fisioterapeuta formada pela Universidade de Caxias do Sul (RS), com mais de 15 anos de experiência na área do Pilates. Estudou com grandes nomes do Pilates nacional e internacional. Em 2020 concluiu sua certificação internacional com Erica Almodovar, do Authentic Pilates Learning Center – EUA, que foi aluna direta de Romana Kryzanowska, sendo considerada 3ª geração direta de Joseph Pilates. Atualmente, ministra cursos e workshops por todo o Brasil e Europa."
    ],
    "Adriana Coldebella": [
      " Adriana Coldebella é artista da dança, educadora física, autora e especialista em Pilates Clássico. É fundadora da Fênix Academy, plataforma de educação continuada para professores de Pilates, idealizadora da Formação Completa em Pilates Clássico e do MAT Camp, uma imersão que une o método, natureza e movimento. Dedica sua carreira à preservação da essência do método de Joseph Pilates por meio do ensino, da prática e da formação de novos profissionais."
    ],
    "Maria Lina": [
      "Fisioterapeuta, com formação em Pilates Clássico, Moderno, Pilates Suspensed Treinner e Reabilitação. Criadora e mentora em diversas formações, ministra palestras e cursos relacionados à saúde, disfunções posturais e tratamento da dor."
    ],
    "Diego Castro": []
  };

  // Palestrantes cuja bio é uma lista de itens em vez de parágrafos.
  const bioLists = {
    "Diego Castro": [
      "Fisioterapeuta com 20 anos de atuação no Método Pilates no RJ;",
      "Certificação Internacional em Pilates Contemporâneo pela STOTT PILATES;",
      "Certificação em PILATES CLÁSSICO por Fernando Albernaz;",
      "Mentor e Treinador de Instrutores;",
      "Campeão Casa Voll+ 2025",
      "Palestrante no Contrologia Brasil 2026",
      "Palestrante na Pré-Conferência online Your Health 2026"
    ]
  };

  // Palestrantes cujo texto rola dentro do card (bio muito longa).
  const scrollableBios = new Set(["Lolita San Miguel"]);

  const speakers = cards.map((card) => {
    const img = card.querySelector(".speaker-card__photo");
    const name = card.querySelector(".speaker-card__name").textContent.trim();

    return {
      name,
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt"),
      bio: bios[name] || [],
      list: bioLists[name] || null,
      scrollable: scrollableBios.has(name)
    };
  });

  const box = modal.querySelector(".speaker-modal__box");
  const content = modal.querySelector(".speaker-modal__content");
  const photo = modal.querySelector(".speaker-modal__photo");
  const nameEl = modal.querySelector(".speaker-modal__name");
  const bioEl = modal.querySelector(".speaker-modal__bio");
  const closeButton = modal.querySelector(".speaker-modal__close");
  const prev = modal.querySelector(".speaker-modal__nav--prev");
  const next = modal.querySelector(".speaker-modal__nav--next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let animating = false;
  let lastFocused = null;

  const paint = (index) => {
    const speaker = speakers[index];

    photo.src = speaker.src;
    photo.alt = speaker.name;
    nameEl.textContent = speaker.name;

    if (speaker.list) {
      bioEl.innerHTML = `<ul class="speaker-modal__list">${speaker.list.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    } else {
      bioEl.innerHTML = speaker.bio.map((p) => `<p>${p}</p>`).join("");
    }

    bioEl.classList.toggle("is-scrollable", speaker.scrollable);
    bioEl.scrollTop = 0;
    box.scrollTop = 0;
  };

  const SLIDE_MS = 300;

  const goTo = (index) => {
    const target = (index + speakers.length) % speakers.length;

    if (target === current) {
      return;
    }

    if (reduceMotion) {
      current = target;
      paint(current);
      return;
    }

    if (animating) {
      return;
    }

    animating = true;
    // Sai descendo e some.
    content.classList.add("is-leaving");

    window.setTimeout(() => {
      current = target;
      paint(current);
      // Reposiciona embaixo e invisível, sem animar, para então subir.
      content.classList.add("is-entering");
      content.classList.remove("is-leaving");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          content.classList.remove("is-entering");

          window.setTimeout(() => {
            animating = false;
          }, SLIDE_MS);
        });
      });
    }, SLIDE_MS);
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.removeProperty("overflow");

    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  const openModal = (index) => {
    lastFocused = document.activeElement;
    current = index;
    paint(current);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  };

  cards.forEach((card, index) => {
    card.querySelector(".speaker-card__button")?.addEventListener("click", () => openModal(index));
  });

  prev.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));
  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowLeft") {
      goTo(current - 1);
    } else if (event.key === "ArrowRight") {
      goTo(current + 1);
    }
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
    if (popup.hidden) {
      popup.hidden = false;
    }

    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    }

    // O diálogo já nasce visível; o foco aguarda a primeira pintura para não
    // forçar o cálculo completo do layout no caminho crítico do mobile.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
    });
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

  const initializeCarousel = (carousel) => {
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
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              slide.style.transition = "";
            });
          });
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

    let resizeFrame = null;

    window.addEventListener("resize", () => {
      if (resizeFrame !== null) {
        return;
      }

      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        render(active);
      });
    });

    render(0);
  };

  document.querySelectorAll(".carousel").forEach((carousel) => {
    if (!("IntersectionObserver" in window)) {
      initializeCarousel(carousel);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      observer.disconnect();
      initializeCarousel(carousel);
    }, { rootMargin: "400px 0px" });

    observer.observe(carousel);
  });
})();

(() => {
  document.querySelectorAll(".prog-lista--workshops").forEach((table) => {
    let startX = 0;
    let startScrollLeft = 0;
    let activePointerId = null;

    table.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) {
        return;
      }

      activePointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = table.scrollLeft;
      table.classList.add("is-dragging");
      table.setPointerCapture(event.pointerId);
    });

    table.addEventListener("pointermove", (event) => {
      if (event.pointerId !== activePointerId) {
        return;
      }

      event.preventDefault();
      table.scrollLeft = startScrollLeft - (event.clientX - startX);
    });

    const stopDragging = (event) => {
      if (event.pointerId !== activePointerId) {
        return;
      }

      activePointerId = null;
      table.classList.remove("is-dragging");

      if (table.hasPointerCapture(event.pointerId)) {
        table.releasePointerCapture(event.pointerId);
      }
    };

    table.addEventListener("pointerup", stopDragging);
    table.addEventListener("pointercancel", stopDragging);
  });
})();

/* Efeito "aparecer ao rolar" para elementos com .reveal-on-scroll.
   Usa IntersectionObserver — adiciona .is-visible quando o elemento entra na tela,
   e para de observar em seguida (o efeito acontece uma vez só). */
(() => {
  const alvos = document.querySelectorAll(".reveal-on-scroll");

  if (alvos.length === 0) {
    return;
  }

  // Sem IntersectionObserver ou com movimento reduzido, mostra tudo imediatamente.
  const semAnimacao =
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (semAnimacao) {
    alvos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    },
    {
      // Dispara quando 15% do elemento já apareceu na viewport.
      threshold: 0.15,
      // Margem para começar a animação um pouco antes de o elemento chegar.
      rootMargin: "0px 0px -60px 0px"
    }
  );

  alvos.forEach((el) => observer.observe(el));
})();
