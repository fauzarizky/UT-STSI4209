const backBtn = document.getElementById("back-btn");
const backToDashboard = () => window.location.replace("dashboard.html");

backBtn.addEventListener("click", backToDashboard);

const getStockClass = (stok) => {
  if (stok < 200) return "stock-low";
  if (stok < 400) return "stock-medium";
  return "stock-high";
};

const renderStockItems = (items) => {
  const stockList = document.getElementById("stockList");
  stockList.innerHTML = "";

  if (items.length === 0) {
    stockList.innerHTML = '<p style="text-align: center; color: #999;">Tidak ada data ditemukan</p>';
    return;
  }

  items.forEach((item) => {
    const stockItem = document.createElement("div");
    stockItem.className = "stock-item";
    stockItem.onclick = () => showDetailModal(item);

    stockItem.innerHTML = `
      <img src="${item.cover}" alt="${item.namaBarang}" class="stock-item-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
      <div class="stock-item-info">
        <p class="label">Kode Lokasi</p>
        <p class="value">${item.kodeLokasi}</p>
        
        <p class="label">Kode Barang</p>
        <p class="value">${item.kodeBarang}</p>
        
        <p class="label">Nama Barang</p>
        <p class="value">${item.namaBarang}</p>
        
        <p class="label">Jenis Barang</p>
        <p class="value">${item.jenisBarang}</p>
        
        <p class="label">Edisi</p>
        <p class="value">${item.edisi}</p>
        
        <p class="label">Stok</p>
        <p class="value"><span class="stock-badge ${getStockClass(item.stok)}">${item.stok} unit</span></p>
      </div>
    `;

    stockList.appendChild(stockItem);
  });
};

const showDetailModal = (item) => {
  // Create modal if it doesn't exist
  let modal = document.getElementById("stockModal");
  if (!modal) {
    modal = document.createElement("dialog");
    modal.id = "stockModal";
    modal.className = "modal-stock";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-stock-content">
      <div class="modal-stock-header">
        <h2>Detail Bahan Ajar</h2>
        <button type="button" class="close-modal" onclick="document.getElementById('stockModal').close()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-stock-body">
        <img src="${item.cover}" alt="${item.namaBarang}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="detail-row">
          <span class="detail-label">Kode Lokasi</span>
          <span class="detail-value">${item.kodeLokasi}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Kode Barang</span>
          <span class="detail-value">${item.kodeBarang}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Nama Barang</span>
          <span class="detail-value">${item.namaBarang}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Jenis Barang</span>
          <span class="detail-value">${item.jenisBarang}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Edisi</span>
          <span class="detail-value">${item.edisi}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Stok</span>
          <span class="detail-value"><span class="stock-badge ${getStockClass(item.stok)}">${item.stok} unit</span></span>
        </div>
      </div>
    </div>
  `;

  modal.showModal();
};

const searchInput = document.getElementById("searchStock");
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredData = dataBahanAjar.filter((item) => {
    return item.namaBarang.toLowerCase().includes(searchTerm) || item.kodeBarang.toLowerCase().includes(searchTerm) || item.kodeLokasi.toLowerCase().includes(searchTerm);
  });
  renderStockItems(filteredData);
});

// Initial render
renderStockItems(dataBahanAjar);
