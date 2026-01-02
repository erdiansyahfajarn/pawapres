const CMS = (() => {
  const SHEET_ID = "1K_dUKV4kyLxkku2R2yxebY5m-o-xn3Ld5d76G3EwyuI";
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  function buildURL(sheet) {
    return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheet}`;
  }

  function parse(text) {
    return JSON.parse(text.substring(47).slice(0, -2)).table.rows;
  }

  async function fetchSheet(sheet) {
    const cacheKey = `cms_${sheet}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.time < CACHE_TTL) return data.rows;
    }

    const res = await fetch(buildURL(sheet));
    const text = await res.text();
    const rows = parse(text);

    localStorage.setItem(cacheKey, JSON.stringify({
      time: Date.now(),
      rows
    }));

    return rows;
  }

  function isAdmin() {
    return new URLSearchParams(location.search).get("admin") === "true";
  }

  return { fetchSheet, isAdmin };
})();

function paginate(data, page = 1, perPage = 5) {
  const start = (page - 1) * perPage;
  return data.slice(start, start + perPage);
}

function sortByDate(data, colIndex) {
  return data.sort((a, b) =>
    new Date(b.c[colIndex]?.v) - new Date(a.c[colIndex]?.v)
  );
}