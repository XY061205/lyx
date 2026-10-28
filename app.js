// 页面共用交互：轮播、移动端导航、语音讲解和出行路线。
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const slides = [...document.querySelectorAll(".hero-slide")];
  if (slides.length) {
    const dots = [...document.querySelectorAll(".carousel-dot")];
    const indexLabel = document.querySelector(".hero-index");
    let activeSlide = 0;

    const showSlide = (index) => {
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeSlide);
      });
      dots.forEach((dot, dotIndex) => {
        const selected = dotIndex === activeSlide;
        dot.classList.toggle("is-active", selected);
        if (selected) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (indexLabel) indexLabel.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    };

    document.querySelector('[data-carousel="previous"]')?.addEventListener("click", () => showSlide(activeSlide - 1));
    document.querySelector('[data-carousel="next"]')?.addEventListener("click", () => showSlide(activeSlide + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
    window.setInterval(() => {
      if (!document.hidden) showSlide(activeSlide + 1);
    }, 6500);
  }

  const originSelect = document.querySelector("#origin-city");
  const routeRows = document.querySelector("#route-rows");
  if (originSelect && routeRows) {
    const routes = {
      beijing: {
        city: "北京",
        options: [["高铁", "约 7.5—9 小时", "¥1,540—2,200"], ["直飞航班", "约 3 小时", "¥1,200—2,600"]],
        plan: [["第 1 天 · 市井初见", "宽窄巷子、人民公园、锦里"], ["第 2 天 · 熊猫与城市", "成都大熊猫繁育研究基地、春熙路"], ["第 3 天 · 水利山色", "都江堰与青城山（建议一日往返）"]],
        introduction: "抵达后先在市区安顿，分日体验人文街区、熊猫与山水，减少跨城折返。"
      },
      shanghai: {
        city: "上海",
        options: [["高铁", "约 11—13 小时", "¥1,100—1,600"], ["直飞航班", "约 3 小时", "¥1,000—2,400"]],
        plan: [["第 1 天 · 轻松抵达", "人民公园、宽窄巷子"], ["第 2 天 · 川味与古迹", "武侯祠、锦里、品尝川菜"], ["第 3 天 · 绿意慢行", "大熊猫繁育研究基地、春熙路"]],
        introduction: "长途到达建议预留休息时间；市内行程串联古街、川味与熊猫基地。"
      },
      guangzhou: {
        city: "广州",
        options: [["高铁", "约 9—11 小时", "¥1,000—1,500"], ["直飞航班", "约 2.5 小时", "¥1,000—2,400"]],
        plan: [["第 1 天 · 老街慢游", "杜甫草堂、宽窄巷子"], ["第 2 天 · 古蜀与川味", "武侯祠、锦里、体验成都火锅"], ["第 3 天 · 近郊一日", "都江堰与青城山"]],
        introduction: "可按假期长度选择直飞或高铁，行程由市区人文延伸至都江堰山水。"
      },
      chongqing: {
        city: "重庆",
        options: [["高铁 / 动车", "约 1.5—2.5 小时", "¥180—360"], ["自驾", "约 3.5—4.5 小时", "¥500—900"]],
        plan: [["第 1 天 · 成都慢生活", "人民公园喝茶、宽窄巷子"], ["第 2 天 · 古迹寻味", "武侯祠、锦里、春熙路"], ["第 3 天 · 近郊山水", "都江堰与青城山（可按时间选其一）"]],
        introduction: "两地往返交通选择多，可轻装出行；近郊建议提前确认返程班次。"
      }
    };

    const renderRoutes = () => {
      const route = routes[originSelect.value];
      document.querySelector("#route-caption").textContent = `${route.city} ⇄ 成都 · 成人往返参考`;
      routeRows.replaceChildren(...route.options.map(([name, time, cost]) => {
        const row = document.createElement("tr");
        [name, time, cost].forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.append(cell);
        });
        return row;
      }));
      document.querySelector("#itinerary-title").textContent = `${route.city}出发 · 成都三日漫游`;
      document.querySelector("#itinerary-intro").textContent = route.introduction;
      const itinerary = document.querySelector("#itinerary-list");
      itinerary.replaceChildren(...route.plan.map(([title, sights]) => {
        const item = document.createElement("li");
        const heading = document.createElement("strong");
        const details = document.createElement("span");
        heading.textContent = title;
        details.textContent = sights;
        item.append(heading, details);
        return item;
      }));
      document.querySelector("#voice-text").textContent = `${route.city}往返成都可选高铁或航班。建议安排三天，游览${route.plan.map(([, sights]) => sights.split("、")[0]).join("、")}。票价与班次请出发前查询实时信息。`;
    };

    originSelect.addEventListener("change", renderRoutes);
    renderRoutes();
  }

  const cultureScript = [
    { title: "太阳神鸟的古老想象", caption: "金沙遗址出土的太阳神鸟金饰，以流畅的金色纹样呈现古蜀先民对太阳与自然的想象。" },
    { title: "都江堰的千年智慧", caption: "两千多年前，古人顺应地势修建都江堰，让岷江水滋养川西平原，至今仍发挥作用。" },
    { title: "诗意融入成都日常", caption: "从杜甫草堂的诗篇到街头茶馆的闲谈，历史文脉也在成都人的日常生活中延续。" }
  ];
  const storyCard = document.querySelector(".story-card");
  const storyPlay = document.querySelector("#story-play");
  if (storyCard && storyPlay) {
    let storyTimer;
    let storyIndex = 0;
    const playStory = () => {
      window.clearInterval(storyTimer);
      storyIndex = 0;
      storyCard.classList.add("is-playing");
      const showStory = () => {
        const scene = cultureScript[storyIndex];
        document.querySelector("#story-title").textContent = scene.title;
        document.querySelector("#story-caption").textContent = scene.caption;
        storyIndex += 1;
        if (storyIndex === cultureScript.length) {
          window.clearInterval(storyTimer);
          storyCard.classList.remove("is-playing");
          storyPlay.textContent = "再次播放文化短片";
        }
      };
      storyPlay.textContent = "短片播放中…";
      showStory();
      storyTimer = window.setInterval(showStory, 3200);
    };
    storyPlay.addEventListener("click", playStory);
    playStory();
  }

  document.querySelectorAll('[data-speak]').forEach((button) => {
    button.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) {
        button.textContent = "此浏览器暂不支持语音";
        button.disabled = true;
        return;
      }
      if (button.dataset.speaking === "true") {
        window.speechSynthesis.cancel();
        button.dataset.speaking = "false";
        button.textContent = button.dataset.speak === "culture" ? "🐼 熊猫语音讲解" : "▶ 听行程播报";
        return;
      }
      const text = button.dataset.speak === "culture"
        ? cultureScript.map((scene) => scene.caption).join("")
        : document.querySelector("#voice-text")?.textContent;
      if (!text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.92;
      button.dataset.speaking = "true";
      button.textContent = "⏸ 停止播报";
      utterance.onend = () => {
        button.dataset.speaking = "false";
        button.textContent = button.dataset.speak === "culture" ? "🐼 熊猫语音讲解" : "▶ 听行程播报";
      };
      utterance.onerror = () => {
        button.dataset.speaking = "false";
        button.textContent = "语音播放失败，请重试";
      };
      window.speechSynthesis.speak(utterance);
    });
  });
});
