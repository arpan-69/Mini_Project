const checkbox = document.getElementById("checkbox");
const pricing = {
  basic: { monthly: " Rs 19.99", annually: "Rs 199.99" },
  professional: { monthly: "Rs 24.99", annually: "Rs 249.99" },
  master: { monthly: "Rs 39.99", annually: "Rs 399.99" },
};

checkbox.addEventListener("change", () => {
  const isMonthly = checkbox.checked;
  document.getElementById("basic").textContent = isMonthly ? pricing.basic.monthly : pricing.basic.annually;
  document.getElementById("professional").textContent = isMonthly ? pricing.professional.monthly : pricing.professional.annually;
  document.getElementById("master").textContent = isMonthly ? pricing.master.monthly : pricing.master.annually;
});
