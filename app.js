const phoneNumber = "62895370022540";
const whatsappUrl = (message) => `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
const toast = (message) => {
  const element = document.querySelector(".toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("show");
  window.setTimeout(() => element.classList.remove("show"), 2800);
};

const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
document.querySelectorAll(".main-nav a").forEach((link) => {
  const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "") || "/";
  if (linkPath === currentPath) link.classList.add("nav-active");
});
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  const isBotPage = window.location.pathname.includes("bot") || window.location.pathname.includes("scm");
  link.href = whatsappUrl(isBotPage ? "Halo Dils, saya ingin tahu lebih banyak tentang Dils SCM." : "Halo Dils, saya ingin order top-up.");
  link.target = "_blank";
  link.rel = "noreferrer";
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));

const products = [
  { name: "Free Fire", icon: "fa-fire", detail: "Diamond instant", price: "Mulai Rp 5.000", color: "orange", popular: true, amounts: ["70 Diamond", "140 Diamond", "355 Diamond", "720 Diamond"] },
  { name: "Mobile Legends", icon: "fa-gem", detail: "Diamond semua server", price: "Mulai Rp 3.000", color: "blue", popular: true, amounts: ["86 Diamonds", "172 Diamonds", "257 Diamonds", "706 Diamonds"] },
  { name: "PUBG Mobile", icon: "fa-crosshairs", detail: "UC global", price: "Mulai Rp 16.000", color: "gold", popular: false, amounts: ["60 UC", "325 UC", "660 UC", "1800 UC"] },
  { name: "Valorant", icon: "fa-v", detail: "Valorant Points", price: "Mulai Rp 15.000", color: "pink", popular: true, amounts: ["125 VP", "420 VP", "700 VP", "1375 VP"] },
];
const storeGrid = document.querySelector("[data-store-grid]");
const modal = document.querySelector("[data-modal]");
const openModal = (gameName) => {
  if (!modal) return;
  const product = products.find((item) => item.name === gameName);
  modal.querySelector("[data-modal-game]").textContent = gameName;
  modal.querySelector("[data-modal-amount]").innerHTML = product.amounts.map((amount) => `<option>${amount}</option>`).join("");
  modal.classList.add("open");
  modal.querySelector("input")?.focus();
};
const renderStore = (filter = "all") => {
  if (!storeGrid) return;
  const visible = products.filter((product) => filter === "all" || filter === "game" || product.popular);
  storeGrid.innerHTML = visible.map((product) => `<article class="store-card reveal is-visible"><div class="store-card-top"><span class="game-icon ${product.color}"><i class="fa-solid ${product.icon}"></i></span><span class="availability"><i></i> Instant</span></div><h3>${product.name}</h3><p>${product.detail}</p><div class="store-card-bottom"><strong>${product.price}</strong><button class="button button-primary button-order" data-game="${product.name}"><i class="fa-solid fa-cart-plus"></i> Pilih nominal</button></div></article>`).join("");
  storeGrid.querySelectorAll(".button-order").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.game)));
};
renderStore();
document.querySelectorAll("[data-store-filter]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-store-filter]").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderStore(button.dataset.storeFilter);
}));
document.querySelector("[data-close-modal]")?.addEventListener("click", () => modal.classList.remove("open"));
modal?.addEventListener("click", (event) => { if (event.target === modal) modal.classList.remove("open"); });
document.querySelector("[data-order-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const game = document.querySelector("[data-modal-game]").textContent;
  const message = [
    "Halo Dils, saya ingin order top-up.",
    "",
    `Game: ${game}`,
    `Detail Akun / ID: ${form.get("gameId")}`,
    `Nominal: ${form.get("amount")}`,
    "Metode Pembayaran: QRIS",
    `Catatan: ${form.get("note") || "-"}`,
    "",
    "Mohon konfirmasi total pembayaran dan proses ordernya."
  ].join("\n");
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  modal.classList.remove("open");
  toast("Detail order sudah disiapkan di WhatsApp.");
});

document.querySelector(".chat-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  const value = input.value.trim();
  if (!value) return;
  const messages = document.querySelector(".chat-messages");
  messages.insertAdjacentHTML("beforeend", `<div class="message user">${value.replace(/[<>]/g, "")}</div><div class="message bot">Command diterima. Admin Dils siap membantu order kamu melalui WhatsApp.</div>`);
  input.value = "";
  messages.scrollTop = messages.scrollHeight;
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}