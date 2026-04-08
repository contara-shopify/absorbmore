export const initDevelopment = () => {
  window.clearCache = async () => {
    await caches.delete(`platter-modals--${window.theme_settings.development__cache_version}`);
    localStorage.clear();
    sessionStorage.clear();
    await idbKeyval.clear();

    console.log(`await caches.delete("platter-modals--${window.theme_settings.development__cache_version}");`);
    console.log(`localStorage.clear();`);
    console.log(`sessionStorage.clear();`);
    console.log(`await idbKeyval.clear();`);
    console.log("Platter Theme Cache Cleared");
  };
};

initDevelopment();

/* LAST HASH: ed703f38669e62276ca524fb7f2e38af29015c49 */
