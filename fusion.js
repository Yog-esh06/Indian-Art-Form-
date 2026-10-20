const canvas = document.querySelector("#fusion-canvas");
const ctx = canvas.getContext("2d");
const generateButton = document.querySelector("#generate-button");
const downloadPdfButton = document.querySelector("#download-pdf-button");
const pdfStatus = document.querySelector("#pdf-status");
const width = canvas.width;
const height = canvas.height;
let animationFrame = 0;
let randomState = 1;

function randomBetween(min, max) {
  randomState = (1664525 * randomState + 1013904223) >>> 0;
  return min + (randomState / 4294967296) * (max - min);
}

function drawBorder() {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.93)";
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  const inset = 25;
  const step = 22;

  [0, height - inset].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(inset, y);
    let direction = 1;
    for (let x = inset; x < width - inset; x += step) {
      ctx.lineTo(x + step / 2, y + direction * 15);
      ctx.lineTo(x + step, y);
      direction *= -1;
    }
    ctx.stroke();
  });

  [0, width - inset].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, inset);
    let direction = 1;
    for (let y = inset; y < height - inset; y += step) {
      ctx.lineTo(x + direction * 15, y + step / 2);
      ctx.lineTo(x, y + step);
      direction *= -1;
    }
    ctx.stroke();
  });
  ctx.restore();
}

function drawWarliFigure(x, y, size, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = "#FFFFFF";
  ctx.fillStyle = "#FFFFFF";
  ctx.lineWidth = 2.1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const headY = -size * 0.44;
  ctx.beginPath();
  ctx.arc(0, headY, size * 0.1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, headY + size * 0.1);
  ctx.lineTo(0, size * 0.02);
  ctx.moveTo(0, -size * 0.16);
  ctx.lineTo(-size * 0.32, -size * 0.34);
  ctx.moveTo(0, -size * 0.16);
  ctx.lineTo(size * 0.34, -size * 0.31);
  ctx.moveTo(0, size * 0.02);
  ctx.lineTo(-size * 0.25, size * 0.45);
  ctx.moveTo(0, size * 0.02);
  ctx.lineTo(size * 0.3, size * 0.42);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -size * 0.16);
  ctx.lineTo(-size * 0.19, size * 0.04);
  ctx.lineTo(0, size * 0.24);
  ctx.closePath();
  ctx.moveTo(0, -size * 0.16);
  ctx.lineTo(size * 0.2, size * 0.04);
  ctx.lineTo(0, size * 0.24);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

function drawDanceRing(seed) {
  const count = 12;
  const orbitRadius = 213;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count + seed;
    const radius = orbitRadius + randomBetween(-8, 8);
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius * 0.7;
    const facing = angle + Math.PI / 2 + randomBetween(-0.13, 0.13);
    drawWarliFigure(x, y, randomBetween(25, 33), facing);
  }
}

function drawPetal(x, y, angle, length, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(length * 0.56, -length * 0.1, length * 0.54, -length * 0.88, 0, -length);
  ctx.bezierCurveTo(-length * 0.56, -length * 0.88, -length * 0.56, -length * 0.1, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawFlower(x, y, radius, rotation) {
  const colors = ["#8B261F", "#D49B36", "#C66A3D"];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = "#2B1713";
  ctx.lineWidth = 1.65;
  for (let index = 0; index < 8; index += 1) {
    drawPetal(0, 0, (Math.PI * 2 * index) / 8, radius, colors[index % colors.length]);
  }
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.19, 0, Math.PI * 2);
  ctx.fillStyle = "#D9AC45";
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawVine(startX, startY, endX, endY, bend, seed) {
  ctx.save();
  ctx.strokeStyle = "#321711";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(startX + bend, startY - 90, endX - bend, endY + 82, endX, endY);
  ctx.stroke();

  for (let index = 1; index <= 7; index += 1) {
    const t = index / 8;
    const x = startX + (endX - startX) * t + Math.sin(t * Math.PI * 2 + seed) * bend * 0.43;
    const y = startY + (endY - startY) * t - Math.sin(t * Math.PI) * 36;
    const direction = index % 2 === 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + direction * 17, y - 7, x + direction * 24, y - 21, x + direction * 35, y - 19);
    ctx.bezierCurveTo(x + direction * 26, y - 7, x + direction * 19, y + 4, x, y);
    ctx.fillStyle = index % 2 === 0 ? "#6E291E" : "#D29B3A";
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawKalamkari(seed) {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(randomBetween(-0.06, 0.06));
  ctx.translate(-width / 2, -height / 2);

  drawVine(315, 303, 483, 295, randomBetween(30, 48), seed);
  drawVine(485, 296, 400, 202, randomBetween(-22, 20), seed + 1.8);
  drawVine(400, 404, 481, 307, randomBetween(-24, 19), seed + 3.2);
  drawFlower(400 + randomBetween(-8, 8), 300 + randomBetween(-8, 8), randomBetween(35, 45), seed);
  drawFlower(475, 291, 17, -seed * 0.6);
  drawFlower(401, 211, 14, seed * 0.7);

  ctx.restore();
}

function drawArtwork(progress, seed) {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalAlpha = progress;
  // Reset the random sequence on each frame so one synthesis fades in without flickering.
  randomState = Math.floor(seed * 1_000_000) >>> 0;
  ctx.fillStyle = "#B35A42";
  ctx.fillRect(0, 0, width, height);
  drawBorder();
  drawDanceRing(seed);
  drawKalamkari(seed * 0.83);
  ctx.restore();
}

function generateSynthesis() {
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
  const start = performance.now();
  const duration = 650;
  const seed = randomBetween(0, Math.PI * 2);

  function animate(now) {
    const elapsed = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - elapsed) ** 3;
    drawArtwork(eased, seed);
    if (elapsed < 1) animationFrame = window.requestAnimationFrame(animate);
    else animationFrame = 0;
  }

  animationFrame = window.requestAnimationFrame(animate);
}

function downloadArtworkPdf() {
  downloadPdfButton.disabled = true;
  pdfStatus.textContent = "Preparing your artwork…";
  let artworkSnapshot = null;
  let artworkWasRestored = false;
  let resumeAnimation = false;

  try {
    const imgData1 = canvas.toDataURL('image/png', 1.0);
    artworkSnapshot = document.createElement("canvas");
    artworkSnapshot.width = width;
    artworkSnapshot.height = height;
    artworkSnapshot.getContext("2d").drawImage(canvas, 0, 0);

    resumeAnimation = animationFrame !== 0;
    if (resumeAnimation) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    drawArtwork(1, randomBetween(0, Math.PI * 2));
    const imgData2 = canvas.toDataURL('image/png', 1.0);

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(artworkSnapshot, 0, 0);
    artworkWasRestored = true;

    if (!window.jspdf?.jsPDF) {
      throw new Error("The PDF library could not be loaded. Check your internet connection and try again.");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(253, 251, 247);
    doc.rect(0, 0, pageWidth, 297, "F");
    doc.setFillColor(226, 114, 91);
    doc.circle(18, 19, 1.5, "F");
    doc.setFillColor(212, 175, 55);
    doc.circle(pageWidth - 18, 19, 1.5, "F");

    doc.setTextColor(38, 35, 32);
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("INDIAN ART FORM", pageWidth / 2, 25, { align: "center" });

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(226, 114, 91);
    doc.text("01", 20, 45);
    doc.setTextColor(45, 42, 39);
    doc.text("Warli", 34, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(112, 105, 97);
    doc.text("Rhythm in line, circle and triangle.", 34, 53);
    doc.setDrawColor(226, 114, 91);
    doc.setLineWidth(0.35);
    doc.line(20, 57, 190, 57);

    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.setTextColor(150, 133, 107);
    doc.text("+", pageWidth / 2, 65, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(226, 114, 91);
    doc.text("02", 20, 75);
    doc.setTextColor(45, 42, 39);
    doc.text("Kalamkari", 34, 75);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(112, 105, 97);
    doc.text("Vines and stories drawn by hand.", 34, 83);

    const variationWidth = 85;
    const variationHeight = variationWidth * (height / width);
    doc.setFillColor(239, 232, 220);
    doc.roundedRect(13, 98, 89, 68.5, 2, 2, "F");
    doc.roundedRect(108, 98, 89, 68.5, 2, 2, "F");
    doc.addImage(imgData1, "PNG", 15, 100, variationWidth, variationHeight);
    doc.addImage(imgData2, "PNG", 110, 100, variationWidth, variationHeight);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.35);
    doc.roundedRect(15, 100, variationWidth, variationHeight, 1, 1, "S");
    doc.roundedRect(110, 100, variationWidth, variationHeight, 1, 1, "S");

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(112, 105, 97);
    doc.text(
      "Generative Iterations: Displaying the synthesis of structural geometry and organic form.",
      pageWidth / 2,
      175,
      { align: "center" }
    );

    doc.setDrawColor(220, 212, 201);
    doc.setLineWidth(0.5);
    doc.line(20, 240, 190, 240);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(45, 42, 39);
    doc.text("TEAM ROSTER", 20, 250);

    const teamMembers = [
      "YOGESH R MEHTA (RA2411003010776)",
      "DARSH M SARAF (RA2411003010731)",
      "MINK RANGA (RA2411003010717)",
      "PRAKARSH AWASTHI (RA2411003010737)",
      "ARIEVE BALORIA (RA2411003010743)"
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(teamMembers[0], 20, 261);
    doc.text(teamMembers[1], 110, 261);
    doc.text(teamMembers[2], 20, 272);
    doc.text(teamMembers[3], 110, 272);
    doc.text(teamMembers[4], pageWidth / 2, 283, { align: "center" });

    doc.save("Indian_Art_Fusion_Collage.pdf");
    pdfStatus.textContent = "Your PDF has been downloaded.";
  } catch (error) {
    console.error("Could not export the fusion artwork as a PDF.", error);
    pdfStatus.textContent = error instanceof Error
      ? `PDF export failed: ${error.message}`
      : "PDF export failed. Please try again.";
  } finally {
    if (artworkSnapshot && !artworkWasRestored) {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(artworkSnapshot, 0, 0);
    }
    if (resumeAnimation && !animationFrame) {
      generateSynthesis();
    }
    downloadPdfButton.disabled = false;
  }
}

generateButton.addEventListener("click", generateSynthesis);
canvas.addEventListener("click", generateSynthesis);
downloadPdfButton.addEventListener("click", downloadArtworkPdf);
drawArtwork(1, randomBetween(0, Math.PI * 2));
