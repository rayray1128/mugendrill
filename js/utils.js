// js/utils.js
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(list) {
  return list[getRandomInt(0, list.length - 1)];
}

function toNumber(v) {
  return Number(v);
}

function clampNumber(v, min, max, fallback) {
  if (Number.isNaN(v)) return fallback;
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// =============================
// 表示用フォーマット
// =============================
function formatAnswer(num) {
  if (Number.isInteger(num)) return num;
  return Number(num.toFixed(2));
}