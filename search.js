document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-bar input");
  if (!searchInput) return;
  const isMusicPage = window.location.pathname.includes("music.html");
  const mosaicItems = document.querySelectorAll(".mosaic-item");
  if (isMusicPage) {
    const releases = Array.from(mosaicItems).map(item => {
      const titleEl = item.querySelector(".item-title");
      const creatorEl = item.querySelector(".item-creator");

      return {
        element: item,
        title: (titleEl?.textContent || "").trim(),
        creator: (creatorEl?.textContent || "").trim(),
      };
    });

    const filterReleases = (query) => {
      query = query.trim().toLowerCase();

      if (query === "") {
        mosaicItems.forEach(item => item.style.display = "block");
        removeNoResultsMessage();
        return;
      }
      let foundAny = false;
      releases.forEach(release => {
        const matchesTitle = release.title.toLowerCase().includes(query);
        const matchesCreator = release.creator.toLowerCase().includes(query);

        if (matchesTitle || matchesCreator) {
          release.element.style.display = "block";
          foundAny = true;
        } else {
          release.element.style.display = "none";
        }
      });
      if (!foundAny) showNoResultsMessage();
      else removeNoResultsMessage();
    };

    const showNoResultsMessage = () => {
      if (document.getElementById("no-results")) return;
      const msg = document.createElement("div");
      msg.id = "no-results";
      msg.textContent = "NO MATCHES // 404";
      msg.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        font-size: 1.8rem;
        font-weight: bold;
        color: #0f0;
        text-shadow: 0 0 20px #0f0;
        letter-spacing: 4px;
      `;
      document.querySelector(".mosaic-gallery").appendChild(msg);
    };
    const removeNoResultsMessage = () => {
      document.getElementById("no-results")?.remove();
    };
    searchInput.addEventListener("input", () => {
      filterReleases(searchInput.value);
    });
    const savedQuery = localStorage.getItem("mmzSearchQuery");
    if (savedQuery) {
      searchInput.value = savedQuery;
      filterReleases(savedQuery);
      localStorage.removeItem("mmzSearchQuery");
    }
  }
  if (!isMusicPage) {
    searchInput.addEventListener("input", function () {
      const query = this.value.trim();
      if (query.length >= 2) {
        localStorage.setItem("mmzSearchQuery", query);
        window.location.href = "music.html";
      }
    });
  }
});