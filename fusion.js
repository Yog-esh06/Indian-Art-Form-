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
  let capturedArtwork = false;
  let animationRestarted = false;

  try {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("The PDF library could not be loaded. Check your internet connection and try again.");
    }

    const imgData1 = canvas.toDataURL("image/jpeg", 1.0);
    capturedArtwork = true;
    drawArtwork(1, randomBetween(0, Math.PI * 2));
    const imgData2 = canvas.toDataURL("image/jpeg", 1.0);
    generateSynthesis();
    animationRestarted = true;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const posterWidth = 280;
    const posterHeight = posterWidth * (height / width);
    const posterX = (pageWidth - posterWidth) / 2;
    const posterY = (pageHeight - posterHeight) / 2;
    if (posterWidth * posterHeight < pageWidth * pageHeight * 0.75) {
      throw new Error("The artwork does not cover enough of the landscape page.");
    }

    doc.setFillColor(253, 251, 247);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.addImage(imgData1, "JPEG", posterX, posterY, posterWidth, posterHeight);
    doc.setProperties({
      title: "Indian Art Fusion Poster",
      subject: "Warli and Kalamkari generative artwork",
      author: "Indian Art Form"
    });

    doc.setFillColor(33, 30, 27);
    doc.rect(0, 0, pageWidth, 17, "F");
    doc.rect(0, pageHeight - 18, pageWidth, 18, "F");

    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(253, 251, 247);
    doc.text("INDIAN ART FORM", pageWidth / 2, 7.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(212, 175, 55);
    doc.text(
      "WARLI: Rhythm in line, circle and triangle.  |  KALAMKARI: Vines and stories drawn by hand.",
      pageWidth / 2,
      13.5,
      { align: "center" }
    );

    const thumbnailWidth = 19;
    const thumbnailHeight = thumbnailWidth * (height / width);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.35);
    doc.addImage(imgData2, "JPEG", pageWidth - thumbnailWidth - 8, 1.5, thumbnailWidth, thumbnailHeight);
    doc.rect(pageWidth - thumbnailWidth - 8, 1.5, thumbnailWidth, thumbnailHeight, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(212, 175, 55);
    doc.text("TEAM ROSTER", 12, pageHeight - 12);

    const teamMembers = [
      "YOGESH R MEHTA (RA2411003010776)",
      "DARSH M SARAF (RA2411003010731)",
      "MINK RANGA (RA2411003010717)",
      "PRAKARSH AWASTHI (RA2411003010736)",
      "ARIEVE BALORIA (RA2411003010743)"
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(253, 251, 247);
    doc.text(`${teamMembers[0]}   |   ${teamMembers[1]}   |   ${teamMembers[2]}`, pageWidth / 2, pageHeight - 8, { align: "center" });
    doc.text(`${teamMembers[3]}   |   ${teamMembers[4]}`, pageWidth / 2, pageHeight - 3.5, { align: "center" });

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.rect(posterX, posterY, posterWidth, posterHeight, "S");

    doc.save("Indian_Art_Fusion_Poster.pdf");
    pdfStatus.textContent = "Your PDF has been downloaded.";
  } catch (error) {
    console.error("Could not export the fusion artwork as a PDF.", error);
    pdfStatus.textContent = error instanceof Error
      ? `PDF export failed: ${error.message}`
      : "PDF export failed. Please try again.";
  } finally {
    if (capturedArtwork && !animationRestarted) {
      generateSynthesis();
    }
    downloadPdfButton.disabled = false;
  }
}

generateButton.addEventListener("click", generateSynthesis);
canvas.addEventListener("click", generateSynthesis);
downloadPdfButton.addEventListener("click", downloadArtworkPdf);
drawArtwork(1, randomBetween(0, Math.PI * 2));
