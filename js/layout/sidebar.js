// js/layout/sidebar.js
document.addEventListener("DOMContentLoaded", () => {
  const html = `
    <aside class="sidebar">
      <div class="brand">
        <h1 class="brand-title">無限ドリル</h1>
        <p class="brand-sub">必要なところだけ、必要なだけ練習できるドリル</p>
      </div>

      <div class="menu-title">目次</div>
      <div class="menu-list">
        <button class="menu-button active" data-mode="plusminus">
          正負の数（加減）-整数のみ
        </button>
        <button class="menu-button" data-mode="multiply">
          かけ算（準備中）
        </button>
      </div>
    </aside>
  `;

  const target = document.getElementById("sidebar");
  if (!target) return;

  target.innerHTML = html;
});