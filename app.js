(() => {
  const doc = document;
  const indexView = doc.querySelector("#index-view");
  const readerView = doc.querySelector("#reader-view");
  const readers = new Map(
    Array.from(doc.querySelectorAll(".reader-article")).map((el) => [el.dataset.reader, el])
  );
  const skipLink = doc.querySelector(".skip-link");
  const siteTitle = doc.title;
  let lastIndexScroll = 0;
  let lastTrigger = null;
  let currentId = null;

  const articleTitle = (id) => {
    const article = readers.get(id);
    return article?.querySelector(".article-title")?.textContent?.trim() || "";
  };

  const showIndex = () => {
    if (!readerView || readerView.hidden) return;
    const trigger = lastTrigger;
    readerView.hidden = true;
    indexView.hidden = false;
    doc.body.classList.remove("is-reading");
    doc.documentElement.classList.remove("is-reading");
    if (skipLink) {
      skipLink.href = "#index-view";
      skipLink.textContent = "跳到专栏目录";
    }
    readers.forEach((article) => {
      article.hidden = true;
    });
    doc.title = siteTitle;
    currentId = null;
    requestAnimationFrame(() => {
      window.scrollTo(0, lastIndexScroll);
      if (trigger && doc.contains(trigger)) trigger.focus({ preventScroll: true });
    });
  };

  const showArticle = (id) => {
    const article = readers.get(id);
    if (!article) {
      showIndex();
      return;
    }
    if (readerView.hidden) {
      lastIndexScroll = window.scrollY;
      const active = doc.activeElement;
      lastTrigger =
        (active && active.closest && active.closest(".article-row")) ||
        doc.querySelector(`.article-row[data-article="${id}"]`);
    }
    indexView.hidden = true;
    readerView.hidden = false;
    doc.body.classList.add("is-reading");
    doc.documentElement.classList.add("is-reading");
    if (skipLink) {
      skipLink.href = "#reader-view";
      skipLink.textContent = "跳到正文";
    }
    readers.forEach((item, key) => {
      item.hidden = key !== id;
    });
    doc.title = `${articleTitle(id)} · ${siteTitle}`;
    currentId = id;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      article.querySelector(".article-title")?.focus({ preventScroll: true });
    });
  };

  const route = () => {
    const match = window.location.hash.match(/^#read\/([a-z0-9-]+)/i);
    if (match) showArticle(match[1]);
    else showIndex();
  };

  window.addEventListener("hashchange", route);
  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && currentId) {
      window.location.hash = "#/";
    }
  });

  route();
})();
