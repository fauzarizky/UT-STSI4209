const greeting = () => {
  const hours = new Date().getHours();
  const userId = new URLSearchParams(window.location.search).get("id");
  const user = dataPengguna.find((user) => user.id === Number(userId));

  let greetText = "";

  if (hours < 12) {
    greetText = `Selamat pagi, ${user ? user.nama : " Nama Pengguna"}`;
  } else if (hours < 15) {
    greetText = `Selamat siang, ${user ? user.nama : " Nama Pengguna"}`;
  } else if (hours < 18) {
    greetText = `Selamat sore, ${user ? user.nama : " Nama Pengguna"}`;
  } else {
    greetText = `Selamat malam, ${user ? user.nama : " Nama Pengguna"}`;
  }

  const greetingElement = document.getElementById("greetingText");
  const navbarElement = document.querySelector(".navbar");
  if (greetingElement) {
    greetingElement.textContent = greetText;
    navbarElement.querySelector("#name").textContent = user ? user.nama : " Nama Pengguna";
  }
};

greeting();

const searchInput = document.getElementById("search-input");
const btnSearch = document.getElementById("search-btn");

btnSearch.addEventListener("click", () => {
  const nomorDO = searchInput.value.trim();
  if (dataTracking[nomorDO]) {
    const trackingData = dataTracking[nomorDO];

    document.getElementById("nama").textContent = trackingData.nama;
    document.getElementById("nomorDO").textContent = trackingData.nomorDO;
    document.getElementById("status").textContent = trackingData.status;
    document.getElementById("tanggalKirim").textContent = trackingData.tanggalKirim;

    const timelineContainer = document.querySelector(".timeline");
    timelineContainer.innerHTML = '<p class="timeline-header">Perjalanan Paket</p>';

    trackingData.perjalanan.forEach((item) => {
      const timelineItem = document.createElement("div");
      timelineItem.className = "timeline-item";

      timelineItem.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <p class="timeline-date">${item.waktu}</p>
          <p class="timeline-description">${item.keterangan}</p>
        </div>
      `;

      timelineContainer.appendChild(timelineItem);
    });

    // Hide placeholder and show result box
    document.getElementById("placeholderBox").style.display = "none";
    document.querySelector(".result-box").classList.add("show");
  } else {
    alert("Nomor Delivery Order tidak ditemukan!");
  }
});
