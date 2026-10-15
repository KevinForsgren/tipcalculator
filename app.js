const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const billInput = document.getElementById("bill");
const customTip = document.getElementById("customTip");
const peopleInput = document.getElementById("people");
const chips = [...document.querySelectorAll(".chip")];
const themeToggle = document.getElementById("themeToggle");

const tipAmountEl = document.getElementById("tipAmount");
const grandTotalEl = document.getElementById("grandTotal");
const perPersonEl = document.getElementById("perPerson");
const peopleMeta = document.getElementById("peopleMeta");
const statusHint = document.getElementById("statusHint");

let selectedTip = 18;

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("tip-theme", theme);
  const next = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
}

function parseAmount(value) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parsePeople(value) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 1 ? Math.min(n, 99) : 1;
}

function activateChip(percent) {
  chips.forEach((chip) => {
    chip.classList.toggle("is-active", Number(chip.dataset.tip) === percent);
  });
}

function calculate() {
  const bill = parseAmount(billInput.value);
  const people = parsePeople(peopleInput.value);
  const custom = customTip.value.trim() === "" ? null : parseAmount(customTip.value);
  const tipPercent = custom === null ? selectedTip : custom;

  if (custom === null) {
    activateChip(selectedTip);
  } else {
    chips.forEach((chip) => chip.classList.remove("is-active"));
  }

  const tip = bill * (tipPercent / 100);
  const total = bill + tip;
  const share = total / people;

  tipAmountEl.textContent = money.format(tip);
  grandTotalEl.textContent = money.format(total);
  perPersonEl.textContent = money.format(share);
  peopleMeta.textContent = people === 1 ? "1 guest" : `${people} guests`;

  if (!bill) {
    statusHint.textContent = "Enter a bill to see totals.";
  } else {
    statusHint.textContent = `${tipPercent}% tip · split ${people === 1 ? "solo" : `across ${people}`}.`;
  }
}

themeToggle.addEventListener("click", () => {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    selectedTip = Number(chip.dataset.tip);
    customTip.value = "";
    activateChip(selectedTip);
    calculate();
  });
});

billInput.addEventListener("input", calculate);
customTip.addEventListener("input", calculate);

peopleInput.addEventListener("input", () => {
  peopleInput.value = String(parsePeople(peopleInput.value));
  calculate();
});

document.getElementById("peopleMinus").addEventListener("click", () => {
  peopleInput.value = String(Math.max(1, parsePeople(peopleInput.value) - 1));
  calculate();
});

document.getElementById("peoplePlus").addEventListener("click", () => {
  peopleInput.value = String(Math.min(99, parsePeople(peopleInput.value) + 1));
  calculate();
});

document.getElementById("reset").addEventListener("click", () => {
  billInput.value = "";
  customTip.value = "";
  peopleInput.value = "1";
  selectedTip = 18;
  activateChip(18);
  calculate();
  billInput.focus();
});

setTheme(currentTheme());
calculate();
