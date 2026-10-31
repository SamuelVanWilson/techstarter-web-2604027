console.log("JavaScript Pertemuan 7 aktif");

const eventName = "TechStarter Day";
const maxSeats = 40;
let registered = 27;

console.log(eventName);
console.log(maxSeats);
console.log(registered);

function checkSeats(requested) {
  const remaining = maxSeats - registered;
  if (!Number.isInteger(requested) || requested <= 0) {
    return "Masukkan jumlah kursi berupa bilangan bulat lebih dari 0.";
  }
  if (requested <= remaining) {
    return `Tersedia. Sisa saat ini ${remaining} kursi.`;
  }
  return `Tidak cukup. Hanya tersisa ${remaining} kursi.`;
}

function registerSeats(requested) {
  const remaining = maxSeats - registered;
  if (!Number.isInteger(requested) || requested <= 0) {
    return "Input tidak valid.";
  }
  if (requested > remaining) {
    return `Gagal. Hanya tersisa ${remaining} kursi.`;
  }
  registered = registered + requested;
  return `Berhasil. Total terdaftar sekarang ${registered}.`;
}


const seatForm = document.querySelector("#seatForm");
const seatRequestInput = document.querySelector("#seatRequest");
const seatMessage = document.querySelector("#seatMessage");

console.log(seatForm);
console.log(seatRequestInput);
console.log(seatMessage);

function setStatus(message, type) {
  seatMessage.textContent = message;
  seatMessage.classList.remove("neutral", "success", "error");
  seatMessage.classList.add(type);
}

seatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const requested = Number(seatRequestInput.value);
  const remaining = maxSeats - registered;

  if (!Number.isInteger(requested) || requested <= 0) {
    setStatus("Masukkan jumlah kursi bulat lebih dari 0.", "error");
    return;
  }

  if (requested <= remaining) {
    setStatus(`Tersedia. Masih ada ${remaining} kursi.`, "success");
  } else {
    setStatus(`Tidak cukup. Sisa kursi hanya ${remaining}.`, "error");
  }
  console.log("Form diterima tanpa reload");
});

// console.log("BENAR  #seatForm    :", document.querySelector("#seatForm"));
// console.log("BENAR  #seatRequest :", document.querySelector("#seatRequest"));
// console.log("BENAR  #seatMessage :", document.querySelector("#seatMessage"));
 
// const wrongTarget = document.querySelector("#seatMessages"); 
// console.log("SALAH  #seatMessages:", wrongTarget);
// wrongTarget.textContent = "Tes"; 
