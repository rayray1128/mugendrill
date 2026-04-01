document.addEventListener("DOMContentLoaded", () => {
  const footerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <a href="/">トップ</a>
        <a href="/terms.html">利用規約</a>
        <a href="https://forms.gle/8w97cB2f3q8kF1Ut8" target="_blank">お問い合わせ</a>
        <a href="https://konohana-fusion.jp/" target="_blank">運営会社:コノハナ・フュージョン合同会社</a>
        <span class="footer-domain"><a href="https://mugendrill.com/">©2026 無限アプリ - mugendrill.com</a></span>
      </div>
    </footer>
  `;

  // ★ここを変更
  const app = document.querySelector(".app");
  app.insertAdjacentHTML("afterend", footerHTML);
});
