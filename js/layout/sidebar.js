document.addEventListener("DOMContentLoaded", () => {
  const html = `
    <aside class="sidebar">
      <div class="brand">
        <h1 class="brand-title">無限ドリル</h1>
        <p class="brand-sub">必要なところだけ、必要なだけ練習できるドリル</p>
      </div>

      <div class="menu-title">目次</div>
      <div class="menu-list">
        <a href="/" class="menu-button">正負の数（整数）</a>
        <a href="/fraction.html" class="menu-button">正負の数（整数・分数・小数）</a>
        <a href="/decimal.html" class="menu-button">小数</a>
      </div>
    </aside>
  `;

  document.getElementById("sidebar").innerHTML = html;
});