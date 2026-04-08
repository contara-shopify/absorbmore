export const initSearch = () => {
  const query = new URL(window.location.href).searchParams.get("q") ?? "";

  window.Alpine.store("search", {
    query: query,
  });

  const searchStore = window.Alpine.store("search");

  Alpine.effect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", searchStore.query);

    if (!searchStore.query) {
      url.searchParams.delete("q");
    }
    barba.history.add(url.toString(), "barba", "replace");
  });

  window.Alpine.magic("search", () => searchStore);
};

document.addEventListener("alpine:init", initSearch);

/* LAST HASH: 5f4e88200b6f5dceb905674651c1fa836a4d20cc */
