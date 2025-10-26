const greeting = () => {
  const hours = new Date().getHours();
  const userId = new URLSearchParams(window.location.search).get("id");
  const user = dataPengguna.find((user) => user.id === Number(userId));

  let greetText = "";

  if (hours < 12) {
    greetText = `Selamat pagi ${user ? `, ${user.nama}` : ""}`;
  } else if (hours < 15) {
    greetText = `Selamat siang${user ? `, ${user.nama}` : ""}`;
  } else if (hours < 18) {
    greetText = `Selamat sore${user ? `, ${user.nama}` : ""}`;
  } else {
    greetText = `Selamat malam${user ? `, ${user.nama}` : ""}`;
  }

  const greetingElement = document.getElementById("greetingText");
  if (greetingElement) {
    greetingElement.textContent = greetText;
  }
};

greeting();
