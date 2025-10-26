const loginForm = document.querySelector(".login-form");

const login = (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  const email = formData.get("email");
  const password = formData.get("password");

  const user = dataPengguna.find((user) => user.email === email && user.password === password);

  if (user) {
    window.location.replace(`dashboard.html?id=${user.id}`);
  } else {
    alert("Email atau password salah. Silakan coba lagi.");
  }
};

loginForm.addEventListener("submit", login);

const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const signupBtn = document.getElementById("signupBtn");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const signupModal = document.getElementById("signupModal");
const closeButtons = document.querySelectorAll(".close-modal");

// Open modals
forgotPasswordBtn.addEventListener("click", () => {
  forgotPasswordModal.showModal();
});

signupBtn.addEventListener("click", () => {
  signupModal.showModal();
});

// Close modals
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.closest("dialog").close();
  });
});

// Close modal when clicking outside
forgotPasswordModal.addEventListener("click", (e) => {
  if (e.target === forgotPasswordModal) {
    forgotPasswordModal.close();
  }
});

signupModal.addEventListener("click", (e) => {
  if (e.target === signupModal) {
    signupModal.close();
  }
});
