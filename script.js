console.log("JavaScript Pertemuan 8 aktif");
const eventName = "TechStarter Day";
const maxSeats = 40;
const STORAGE_KEY = "techstarter.registrations.v1"
const registrationForm = document.querySelector("#registrationForm");
const participantNameInput = document.querySelector("#participantName");
const seatRequestInput = document.querySelector("#seatRequest");
const submitButton = document.querySelector("#submitButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const seatMessage = document.querySelector("#seatMessage");
const registrationList = document.querySelector("#registrationList");
const registrationSummary = document.querySelector("#registrationSummary");

console.log(eventName, maxSeats);

function setStatus(message, type) {
  seatMessage.textContent = message;
  seatMessage.classList.remove("neutral", "success", "error");
  seatMessage.classList.add(type);
}

function saveRegistrations() {
  try {
    const json = JSON.stringify(registrations);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error("Gagal menyimpan ke localStorage:", error);
  }
}

function loadRegistrations() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Data localStorage tidak valid:", error);
    return [];
  }
}

let registrations = loadRegistrations();
let editingId = null;

function getUsedSeats(excludeId = null) {
  return registrations
    .filter((item) => item.id !== excludeId)
    .reduce((total, item) => total + item.seats, 0);
}

function renderRegistrations() {
  registrationList.replaceChildren();

  for (const item of registrations) {
    const li = document.createElement("li");
    li.textContent = `${item.name} : ${item.seats} kursi`;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      startEdit(item);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", function () {
      deleteRegistration(item.id);
    });

    li.append(" ", editButton, " ", deleteButton);
    registrationList.append(li);
  }

  const used = getUsedSeats();
  const remaining = maxSeats - used;
  registrationSummary.textContent =
    `${registrations.length} registrasi • ${used}/${maxSeats} kursi terpakai • sisa ${remaining} kursi`;
}

function startEdit(item) {
  editingId = item.id;
  participantNameInput.value = item.name;
  seatRequestInput.value = item.seats;
  submitButton.textContent = "Simpan Perubahan";
  cancelEditButton.hidden = false;
  participantNameInput.focus();
  setStatus("Mode edit aktif", "neutral");
}

function exitEditMode() {
  editingId = null;
  submitButton.textContent = "Simpan Registrasi";
  cancelEditButton.hidden = true;
  registrationForm.reset();
}

cancelEditButton.addEventListener("click", function () {
  exitEditMode();
  setStatus("Edit dibatalkan.", "neutral");
});

function deleteRegistration(id) {
  registrations = registrations.filter((item) => item.id !== id);
  saveRegistrations();
  renderRegistrations();

  if (editingId === id) {
    exitEditMode();
  }
  setStatus("Registrasi dihapus.", "success");
}

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = participantNameInput.value.trim();
  const seats = Number(seatRequestInput.value);

  const usedWithoutCurrent = getUsedSeats(editingId);

  if (name.length < 2) {
    setStatus("Nama minimal 2 karakter.", "error");
    return;
  }
  if (!Number.isInteger(seats) || seats <= 0) {
    setStatus("Jumlah kursi harus bilangan bulat positif.", "error");
    return;
  }
  if (usedWithoutCurrent + seats > maxSeats) {
    const remaining = maxSeats - usedWithoutCurrent;
    setStatus(`Kursi tidak mencukupi. Sisa ${remaining} kursi.`, "error");
    return;
  }

  let message;
  if (editingId === null) {

    registrations.push({ id: Date.now(), name, seats });
    message = "Registrasi ditambahkan.";
  } else {

    const index = registrations.findIndex((item) => item.id === editingId);
    if (index !== -1) {
      registrations[index] = { ...registrations[index], name, seats };
    }
    message = "Registrasi diperbarui.";
  }

  saveRegistrations();
  renderRegistrations();
  exitEditMode();
  setStatus(message, "success");
  console.log("Form diterima tanpa reload", registrations);
});

renderRegistrations();