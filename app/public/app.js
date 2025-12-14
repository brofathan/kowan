function calculate() {
  const r = parseFloat(document.getElementById("radius").value);
  if (r <= 0) {
    document.getElementById("result").innerText = "Radius harus > 0";
    return;
  }

  const area = Math.PI * r * r;
  const circum = 2 * Math.PI * r;

  document.getElementById("result").innerText =
    `Luas: ${area.toFixed(4)}, Keliling: ${circum.toFixed(4)}`;
}
