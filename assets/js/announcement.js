const SHEET_NAME = "Announcements";
const TITLE_COL = 1;
const CONTENT_COL = 2;
const DATE_COL = 3;
const START_TIME_COL = 5;
const END_TIME_COL = 6;
const PER_PAGE = 2;

let currentPage = 1;
let allData = [];

/* ------------------ Mapper ------------------ */
function mapAnnouncement(row) {
  const dateStr = row.c[DATE_COL]?.f ?? "";
  return {
    date: dateStringToLocalDate(dateStr),
    start_time: row.c[START_TIME_COL]?.f ?? "",
    end_time: row.c[END_TIME_COL]?.f ?? "",
    title: row.c[TITLE_COL]?.v ?? "",
    content: row.c[CONTENT_COL]?.v ?? ""
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
      <div>
      <small>${item.start_time}</small>
      <small>s/d</small>
      <small>${item.end_time}</small>
      </div>
      <p>${item.content}</p>
    `;

    container.appendChild(el);
  });
}

function dateStringToLocalDate(dateStr) {
    if (dateStr == "") {
        return dateStr;
    }
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
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
