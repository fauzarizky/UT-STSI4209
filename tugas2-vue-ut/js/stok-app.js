const { createApp } = Vue;

createApp({
  data() {
    return {
      stokData: [],
      searchQuery: "",
      selectedItem: null,
      showModal: false,
      showAddModal: false,
      showInput: false,
      selectedUpbjj: "",
      selectedKategori: "",
      filterQtyBelowSafety: false,
      filterQtyZero: false,
      upbjjList: [],
      kategoriList: [],
      sortKey: "", // Key to sort by
      sortOrder: "asc", // Sorting order: 'asc' or 'desc'
      newItem: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: "",
      },
    };
  },
  computed: {
    filteredStok() {
      let filtered = this.stokData;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((item) => item.judul.toLowerCase().includes(query) || item.kode.toLowerCase().includes(query) || item.lokasiRak.toLowerCase().includes(query));
      }

      if (this.selectedUpbjj) {
        filtered = filtered.filter((item) => item.upbjj === this.selectedUpbjj);
      }

      if (this.selectedKategori) {
        filtered = filtered.filter((item) => item.kategori === this.selectedKategori);
      }

      if (this.filterQtyBelowSafety) {
        filtered = filtered.filter((item) => item.qty < item.safety);
      }

      if (this.filterQtyZero) {
        filtered = filtered.filter((item) => item.qty === 0);
      }

      if (this.sortKey) {
        filtered = filtered.slice().sort((a, b) => {
          const valueA = a[this.sortKey];
          const valueB = b[this.sortKey];

          if (valueA === valueB) return 0; // If values are equal, no sorting needed

          const isAscending = this.sortOrder === "asc";
          return isAscending ? (valueA > valueB ? 1 : -1) : valueA < valueB ? 1 : -1;
        });
      }

      return filtered;
    },

    availableKategori() {
      if (!this.selectedUpbjj) {
        return [...new Set(this.stokData.map((item) => item.kategori))];
      }
      return [...new Set(this.stokData.filter((item) => item.upbjj === this.selectedUpbjj).map((item) => item.kategori))];
    },
  },
  methods: {
    getStockClass(qty, safety) {
      if (qty === 0) return "stock-low";
      if (qty < safety) return "stock-medium";
      return "stock-high";
    },
    showDetailModal(item) {
      this.selectedItem = item;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedItem = null;
    },
    formatRupiah(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    },
    backToDashboard() {
      window.location.href = "index.html";
    },
    editItem() {
      if (this.selectedItem) {
        this.showInput = !this.showInput;
      }
    },
    resetFilters() {
      this.selectedUpbjj = "";
      this.selectedKategori = "";
      this.filterQtyBelowSafety = false;
      this.filterQtyZero = false;
    },
    setSort(key) {
      if (this.sortKey === key) {
        // Toggle sort order if the same key is clicked
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        // Set new sort key and default to ascending order
        this.sortKey = key;
        this.sortOrder = "asc";
      }
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
      this.resetNewItem();
    },
    resetNewItem() {
      this.newItem = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: "",
      };
    },
    addNewItem() {
      if (!this.newItem.kode || !this.newItem.judul || !this.newItem.kategori || !this.newItem.upbjj) {
        alert("Mohon isi semua field yang wajib diisi!");
        return;
      }

      const exists = this.stokData.some((item) => item.kode === this.newItem.kode);
      if (exists) {
        alert("Kode bahan ajar sudah ada!");
        return;
      }

      this.stokData.push({ ...this.newItem });

      this.closeAddModal();
      alert("Data berhasil ditambahkan!");
    },
  },
  mounted() {
    if (typeof stokBahanAjar !== "undefined") {
      this.stokData = stokBahanAjar;
    } else {
      console.error("Data tidak ditemukan. Pastikan dataBahanAjar.js sudah dimuat.");
    }

    if (typeof upbjjList !== "undefined") {
      this.upbjjList = upbjjList;
    }

    if (typeof kategoriList !== "undefined") {
      this.kategoriList = kategoriList;
    }
  },
  watch: {
    selectedUpbjj(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== "") {
        this.selectedKategori = "";
      }
    },

    selectedKategori(newVal) {
      if (newVal && this.sortKey) {
        this.sortKey = "";
        this.sortOrder = "asc";
      }
    },

    filterQtyBelowSafety(newVal) {
      if (newVal && this.filterQtyZero) {
        this.filterQtyZero = false;
      }
    },

    filterQtyZero(newVal) {
      if (newVal && this.filterQtyBelowSafety) {
        this.filterQtyBelowSafety = false;
      }
    },
  },
  template: `
    <main>
      <header class="page-header">
        <button class="back-button" @click="backToDashboard">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="header-text">
          <h2>Informasi Stok Bahan Ajar</h2>
          <p>Manajemen Stok Bahan Ajar UT</p>
        </div>
      </header>

      <section class="stock-container">
        <div class="search-filter">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Cari bahan ajar berdasarkan kode, judul, lokasi rak.." 
            class="search-input"
          >
          <div class="filter-container">
            <select v-model="selectedUpbjj">
              <option value="">Semua UPBJJ</option>
              <option v-for="upbjj in upbjjList" :key="upbjj" :value="upbjj">
                {{ upbjj }}
              </option>
            </select>

            <select v-model="selectedKategori" :disabled="!selectedUpbjj">
              <option value="">Semua Kategori</option>
              <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">
                {{ kategori }}
              </option>
            </select>

            <label>
              <input type="checkbox" v-model="filterQtyBelowSafety">
              Stok di bawah Safety
            </label>

            <label>
              <input type="checkbox" v-model="filterQtyZero">
              Stok Habis
            </label>

            <button @click="resetFilters">Reset Filter</button>
          </div>
        </div>

        <div class="sort-container">
          <button @click="setSort('judul')">Sort by Judul</button>
          <button @click="setSort('qty')">Sort by Stok</button>
          <button @click="setSort('harga')">Sort by Harga</button>
          <button @click="openAddModal" class="add-button">
            <i class="fa-solid fa-plus"></i> Tambah Bahan Ajar
          </button>
        </div>

        <div class="stock-list" v-if="filteredStok.length > 0">
          <div 
            v-for="item in filteredStok" 
            :key="item.kode"
            class="stock-item"
            @click="showDetailModal(item)"
          >
            <div class="stock-item-info">
              <p class="label">Kode Bahan Ajar</p>
              <p class="value">{{ item.kode }}</p>
              
              <p class="label">Judul</p>
              <p class="value">{{ item.judul }}</p>
              
              <p class="label">Kategori</p>
              <p class="value">{{ item.kategori }}</p>
              
              <p class="label">UPBJJ</p>
              <p class="value">{{ item.upbjj }}</p>
              
              <p class="label">Lokasi Rak</p>
              <p class="value">{{ item.lokasiRak }}</p>
              
              <p class="label">Harga</p>
              <p class="value">{{ formatRupiah(item.harga) }}</p>
              
              <p class="label">Stok Tersedia</p>
              <p class="value">
                <span class="stock-badge" :class="getStockClass(item.qty, item.safety)">
                  {{ item.qty }} unit
                </span>
              </p>
              
              <p class="label">Safety Stock</p>
              <p class="value">{{ item.safety }} unit</p>
            </div>
          </div>
        </div>
        
        <div v-else style="text-align: center; color: #999; padding: 40px;">
          <p>Tidak ada data ditemukan</p>
        </div>
      </section>

      <!-- Modal Detail -->
      <dialog 
        class="modal-stock"
        :open="showModal"
        @click="closeModal"
      >
        <div class="modal-stock-content" v-if="selectedItem" @click.stop>
          <div class="modal-stock-header">
            <h2>Detail Bahan Ajar</h2>
            <button type="button" class="close-modal" @click="closeModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-stock-body">
            <div class="detail-row">
              <span class="detail-label">Kode Bahan Ajar</span>
              <template v-if="showInput">
                <input class="detail-value" v-model="selectedItem.kode" />
              </template>
              <template v-else>
                <span class="detail-value">{{ selectedItem.kode }}</span>
              </template>
            </div>
            <div class="detail-row">
              <span class="detail-label">Judul</span>
              <template v-if="showInput">
                <input class="detail-value" v-model="selectedItem.judul" />
              </template>
              <template v-else>
                <span class="detail-value">{{ selectedItem.judul }}</span>
              </template>
            </div>
            <div class="detail-row">
              <span class="detail-label">Kategori</span>
              <template v-if="showInput">
                <input class="detail-value" v-model="selectedItem.kategori" />
              </template>
              <template v-else>
                <span class="detail-value">{{ selectedItem.kategori }}</span>
              </template>
            </div>
            <div class="detail-row">
              <span class="detail-label">UPBJJ</span>
              <template v-if="showInput">
                <input class="detail-value" v-model="selectedItem.upbjj" />
              </template>
              <template v-else>
                <span class="detail-value">{{ selectedItem.upbjj }}</span>
              </template>
            </div>
            <div class="detail-row">
              <span class="detail-label">Lokasi Rak</span>
              <template v-if="showInput">
                <input class="detail-value" v-model="selectedItem.lokasiRak" />
              </template>
              <template v-else>
                <span class="detail-value">{{ selectedItem.lokasiRak }}</span>
              </template>
            </div>
            <div class="detail-row">
              <span class="detail-label">Harga</span>
              <template v-if="showInput">
                <input class="detail-value" v-model.number="selectedItem.harga" />
              </template>
              <template v-else>
                <span class="detail-value">{{ formatRupiah(selectedItem.harga) }}</span>
              </template>
            </div>
            <div class="detail-row">
              <span class="detail-label">Stok Tersedia</span>
              <template v-if="showInput">
                <input class="detail-value" v-model.number="selectedItem.qty" />
              </template>
              <template v-else>
                <span class="detail-value">
                  <span class="stock-badge" :class="getStockClass(selectedItem.qty, selectedItem.safety)">
                    {{ selectedItem.qty }} unit
                  </span>
                </span>
              </template>
            </div>
            <div class="detail-row">
              <span class="detail-label">Safety Stock</span>
              <template v-if="showInput">
                <input class="detail-value" v-model.number="selectedItem.safety" />
              </template>
              <template v-else>
                <span class="detail-value">{{ selectedItem.safety }} unit</span>
              </template>
            </div>
            <div class="detail-row" v-if="selectedItem.catatanHTML">
              <span class="detail-label">Catatan</span>
              <template v-if="showInput">
                <textarea class="detail-value" v-model="selectedItem.catatanHTML"></textarea>
              </template>
              <template v-else>
                <span class="detail-value" v-html="selectedItem.catatanHTML"></span>
              </template>
            </div>
            <button class="action-button" @click="editItem">
              <i v-if="showInput" class="fa-solid fa-check"></i>
              <i v-else class="fa-solid fa-pencil"></i>
              {{ showInput ? 'Simpan' : 'Edit' }}
            </button>
          </div>
        </div>
      </dialog>

      <!-- Modal Add New Item -->
      <dialog 
        class="modal-stock"
        :open="showAddModal"
        @click="closeAddModal"
      >
        <div class="modal-stock-content" @click.stop>
          <div class="modal-stock-header">
            <h2>Tambah Bahan Ajar Baru</h2>
            <button type="button" class="close-modal" @click="closeAddModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-stock-body">
            <div class="detail-row">
              <span class="detail-label">Kode Bahan Ajar *</span>
              <input class="detail-value" v-model="newItem.kode" placeholder="Masukkan kode" required />
            </div>
            <div class="detail-row">
              <span class="detail-label">Judul *</span>
              <input class="detail-value" v-model="newItem.judul" placeholder="Masukkan judul" required />
            </div>
            <div class="detail-row">
              <span class="detail-label">Kategori *</span>
              <select class="detail-value" v-model="newItem.kategori" required>
                <option value="">Pilih kategori</option>
                <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">
                  {{ kategori }}
                </option>
              </select>
            </div>
            <div class="detail-row">
              <span class="detail-label">UPBJJ *</span>
              <select class="detail-value" v-model="newItem.upbjj" required>
                <option value="">Pilih UPBJJ</option>
                <option v-for="upbjj in upbjjList" :key="upbjj" :value="upbjj">
                  {{ upbjj }}
                </option>
              </select>
            </div>
            <div class="detail-row">
              <span class="detail-label">Lokasi Rak</span>
              <input class="detail-value" v-model="newItem.lokasiRak" placeholder="Masukkan lokasi rak" />
            </div>
            <div class="detail-row">
              <span class="detail-label">Harga</span>
              <input class="detail-value" type="number" v-model.number="newItem.harga" placeholder="Masukkan harga" />
            </div>
            <div class="detail-row">
              <span class="detail-label">Stok Tersedia</span>
              <input class="detail-value" type="number" v-model.number="newItem.qty" placeholder="Masukkan jumlah stok" />
            </div>
            <div class="detail-row">
              <span class="detail-label">Safety Stock</span>
              <input class="detail-value" type="number" v-model.number="newItem.safety" placeholder="Masukkan safety stock" />
            </div>
            <div class="detail-row">
              <span class="detail-label">Catatan</span>
              <textarea class="detail-value" v-model="newItem.catatanHTML" placeholder="Masukkan catatan (opsional)"></textarea>
            </div>
            <button class="action-button" @click="addNewItem">
              <i class="fa-solid fa-check"></i>
              Simpan
            </button>
          </div>
        </div>
      </dialog>
    </main>
  `,
}).mount("#app");
