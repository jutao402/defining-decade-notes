/* =========================================================
   整站交互：夜间模式、手机菜单、本地笔记、可选年龄提示
   这些数据只存在你自己的浏览器里，不会上传到任何服务器。
   ========================================================= */

(function () {
  const root = document.documentElement;
  const storageKeyTheme = "decade-theme";
  const storageKeyNotes = "decade-notes";
  const storageKeyAge = "decade-age";

  // 记住上次选择的日夜模式；如果没选过，就跟随系统
  const savedTheme = localStorage.getItem(storageKeyTheme);
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "night");
  }

  const themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    const syncLabel = () => {
      const night = root.getAttribute("data-theme") === "night";
      themeBtn.setAttribute("aria-label", night ? "切换到日间模式" : "切换到夜间模式");
      themeBtn.title = night ? "日间" : "夜间";
    };
    syncLabel();
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "night" ? "day" : "night";
      root.setAttribute("data-theme", next);
      localStorage.setItem(storageKeyTheme, next);
      syncLabel();
    });
  }

  // 手机上的导航展开 / 收起
  const menuBtn = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  // 章节页底部的笔记本：按页面分别保存
  const note = document.querySelector("[data-note]");
  if (note) {
    const page = note.getAttribute("data-note");
    const all = JSON.parse(localStorage.getItem(storageKeyNotes) || "{}");
    note.value = all[page] || "";
    note.addEventListener("input", () => {
      all[page] = note.value;
      localStorage.setItem(storageKeyNotes, JSON.stringify(all));
    });
  }

  // 首页可选填写年龄，只用于一句温柔的提示
  const ageInput = document.querySelector("[data-age]");
  const ageMsg = document.querySelector("[data-age-msg]");
  if (ageInput && ageMsg) {
    const savedAge = localStorage.getItem(storageKeyAge);
    if (savedAge) ageInput.value = savedAge;
    const updateAge = () => {
      const age = Number(ageInput.value);
      if (!age) {
        ageMsg.textContent = "";
        localStorage.removeItem(storageKeyAge);
        return;
      }
      localStorage.setItem(storageKeyAge, String(age));
      if (age >= 20 && age <= 30) {
        const n = age - 19;
        ageMsg.textContent = "这是你这十年里大约第 " + n + " 年。不急，也不假。此刻那些不起眼的选择，以后回头看，常常比想象中更重要。";
      } else if (age < 20) {
        ageMsg.textContent = "这十年还在前面。提前读一读，是给未来的自己留一盏灯。";
      } else {
        ageMsg.textContent = "无论哪一年开始认真对待自己的生活，都不算晚。这本书也常被三十岁之后的人拿起来，当作补课，也当作重新出发。";
      }
    };
    ageInput.addEventListener("input", updateAge);
    updateAge();
  }
})();
