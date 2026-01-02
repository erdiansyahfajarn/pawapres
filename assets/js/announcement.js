const SHEET_NAME = "Announcements";
const DATE_COL = 3;
const PER_PAGE = 2;

let currentPage = 1;
let allData = [];

/* ------------------ Mapper ------------------ */
function mapAnnouncement(row) {
  return {
    date: row.c[DATE_COL]?.v ?? "",
    title: row.c[1]?.v ?? "",
    content: row.c[2]?.v ?? ""
  };
}

/* ------------------ Render ------------------ */
function renderAnnouncements(data) {
  const container = document.getElementById("announcements");
  container.innerHTML = "";

  if (!data.length) {
    container.innerHTML = "<p>Tidak ada pengumuman</p>";
    return;
  }

  data.forEach(item => {
    const el = document.createElement("div");
    el.className = "announcement-card";

    el.innerHTML = `
      <h3>${item.title}</h3>
      <small>${item.date}</small>
      <p>${item.content}</p>
    `;

    container.appendChild(el);
  });
}

/* ------------------ Pagination ------------------ */
function renderPagination(total) {
  const pages = Math.ceil(total / PER_PAGE);
  const el = document.getElementById("pagination");
  el.innerHTML = "";

  if (pages <= 1) return;

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.onclick = () => {
      currentPage = i;
      update();
    };
    el.appendChild(btn);
  }
}

/* ------------------ Update Flow ------------------ */
function update() {
  const pageData = paginate(allData, currentPage, PER_PAGE)
    .map(mapAnnouncement);

  renderAnnouncements(pageData);
  renderPagination(allData.length);
}

/* ------------------ Bootstrap ------------------ */
(async () => {
  try {
    const rows = await CMS.fetchSheet(SHEET_NAME);
    allData = sortByDate(rows, DATE_COL);
    update();
  } catch (err) {
    document.getElementById("announcements").innerHTML =
      "<p>Gagal memuat pengumuman</p>";
    console.error(err);
  }
})();
