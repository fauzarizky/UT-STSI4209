const { createApp } = Vue;

createApp({
  data() {
    return {
      searchQuery: "",
      trackingData: null,
      showResult: false,
      dataTracking: {},
      paketList: [],
      ekspedisiList: [],
      showAddModal: false,
      selectedPaket: {},
      newTracking: {
        nomorDO: "",
        nim: null,
        nama: "",
        ekspedisi: "",
        paket: "",
        tanggalKirim: "",
        total: 0,
      },
    };
  },
  methods: {
    backToDashboard() {
      window.location.href = "index.html";
    },
    searchTracking() {
      const nomorDO = this.searchQuery.trim();
      if (this.dataTracking[nomorDO]) {
        this.trackingData = this.dataTracking[nomorDO];
        this.showResult = true;
      } else {
        alert("Nomor Delivery Order tidak ditemukan!");
        this.showResult = false;
        this.trackingData = null;
      }
    },
    openAddModal() {
      const currentYear = new Date().getFullYear();
      const sequenceNumber = Object.keys(this.dataTracking).length + 1;
      const paddedSequence = String(sequenceNumber).padStart(3, "0");
      this.newTracking.nomorDO = `DO${currentYear}-${paddedSequence}`;

      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
      this.resetNewTracking();
    },
    resetNewTracking() {
      this.newTracking = {
        nomorDO: "",
        nim: null,
        nama: "",
        ekspedisi: "",
        paket: "",
        tanggalKirim: "",
        total: 0,
      };
      this.selectedPaket = {};
    },
    addNewTracking() {
      if (!this.newTracking.nomorDO || !this.newTracking.nama || !this.newTracking.ekspedisi) {
        alert("Mohon isi semua field yang wajib diisi!");
        return;
      }

      const exists = this.dataTracking[this.newTracking.nomorDO];
      if (exists) {
        alert("Nomor Delivery Order sudah ada!");
        return;
      }

      // Add new tracking to dataTracking
      this.dataTracking[this.newTracking.nomorDO] = {
        ...this.newTracking,
        status: "Dibuat",
        perjalanan: [
          {
            waktu: new Date().toLocaleString("id-ID"),
            keterangan: "Delivery Order dibuat",
          },
        ],
      };

      this.closeAddModal();
      alert("Data berhasil ditambahkan!");
    },
  },
  mounted() {
    if (typeof dataTracking !== "undefined") {
      this.dataTracking = dataTracking;
    } else {
      console.error("Data tracking tidak ditemukan. Pastikan dataBahanAjar.js sudah dimuat.");
    }

    if (typeof paketList !== "undefined") {
      this.paketList = paketList;
    } else {
      console.error("Data paket tidak ditemukan. Pastikan dataBahanAjar.js sudah dimuat.");
    }

    if (typeof pengirimanList !== "undefined") {
      this.ekspedisiList = pengirimanList;
    } else {
      console.error("Data ekspedisi tidak ditemukan. Pastikan dataBahanAjar.js sudah dimuat.");
    }
  },
  watch: {
    "newTracking.paket"(newValue) {
      if (newValue && newValue !== "") {
        this.selectedPaket = paketList.find((p) => p.kode === newValue) || {};
        this.newTracking.total = this.selectedPaket.harga || 0;
      } else if (newValue === "") {
        this.newTracking.total = 0;
      } else {
        this.selectedPaket = {};
      }
    },
  },
  template: `
    <main>
      <header class="tracking-main-header">
      <div class="page-header">
        <button class="back-button" @click="backToDashboard">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="header-text">
          <h2>Tracking Pengiriman Bahan Ajar</h2>
          <p>Manajemen Tracking Bahan Ajar UT</p>
        </div>
      </div>
      <button class="add-button" @click="openAddModal">
          <i class="fa-solid fa-plus"></i> Input Delivery Order
        </button>
      </header>

      <section class="tracking-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            class="search-input" 
            placeholder="Nomor Delivery Order"
            @keyup.enter="searchTracking"
          />
          <button type="button" class="btn-submit" @click="searchTracking">Cari</button>
        </div>

        <div class="placeholder-box" v-if="!showResult">
          <i class="fa-solid fa-search"></i>
          <p>Masukkan nomor delivery order untuk melihat informasi pengiriman</p>
        </div>

        <div class="result-box" v-if="showResult && trackingData">
          <div class="user-info">
            <div>
              <p id="nama">{{ trackingData.nama }}</p>
              <p id="nomorDO">{{ trackingData.nomorDO }}</p>
            </div>
            <div>
              <p id="status">{{ trackingData.status }}</p>
              <p id="tanggalKirim">{{ trackingData.tanggalKirim }}</p>
            </div>
          </div>
          <div class="timeline">
            <p class="timeline-header">Perjalanan Paket</p>
            <div 
              v-for="(item, index) in trackingData.perjalanan" 
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <p class="timeline-date">{{ item.waktu }}</p>
                <p class="timeline-description">{{ item.keterangan }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal Add New Tracking -->
      <dialog 
        class="modal-stock"
        :open="showAddModal"
        @click="closeAddModal"
      >
        <div class="modal-stock-content" @click.stop>
          <div class="modal-stock-header">
            <h2>Input Delivery Order Baru</h2>
            <button type="button" class="close-modal" @click="closeAddModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-stock-body">
            <div class="detail-row">
              <span class="detail-label">Nomor DO *</span>
              <input class="detail-value" v-model="newTracking.nomorDO" placeholder="Masukkan nomor DO" required disabled />
            </div>
            <div class="detail-row">
              <span class="detail-label">NIM</span>
              <input class="detail-value" type="number" v-model.number="newTracking.nim" placeholder="Masukkan NIM" />
            </div>
            <div class="detail-row">
              <span class="detail-label">Nama Penerima *</span>
              <input class="detail-value" v-model="newTracking.nama" placeholder="Masukkan nama penerima" required />
            </div>
            <div class="detail-row">
              <span class="detail-label">Ekspedisi *</span>
              <select class="detail-value" v-model="newTracking.ekspedisi" required>
                <option value="">-- Pilih Ekspedisi --</option>
                <option v-for="ekspedisi in ekspedisiList" :key="ekspedisi.kode" :value="ekspedisi.nama">{{ ekspedisi.nama }}</option>
              </select>
            </div>
            <div class="detail-row">
              <span class="detail-label">Paket</span>
              <select class="detail-value" v-model="newTracking.paket">
                <option value="">-- Pilih Paket --</option>
                <option v-for="paket in paketList" :key="paket.kode" :value="paket.kode">
                  {{ paket.nama }}
                </option>
              </select>
              </div>
              <div v-if="selectedPaket.kode">
                <p>Detail Paket ({{ selectedPaket.nama }})</p>
                <p>Kode Paket: {{ selectedPaket.kode }}</p>
                <span>Isi: </span> <span v-for="(value, index) in selectedPaket.isi" :key="value">{{ value }}{{ index < selectedPaket.isi.length - 1 ? ', ' : '' }}</span>
              </div>
            <div class="detail-row">
              <span class="detail-label">Tanggal Kirim</span>
              <input class="detail-value" type="date" v-model="newTracking.tanggalKirim" />
            </div>
            <div class="detail-row">
              <span class="detail-label">Total</span>
              <input type="number" class="detail-value" v-model.number="newTracking.total" placeholder="Masukkan total" disabled />
            </div>
            <button class="action-button" @click="addNewTracking">
              <i class="fa-solid fa-check"></i>
              Simpan
            </button>
          </div>
        </div>
      </dialog>
    </main>
  `,
}).mount("#app");
