document.addEventListener("DOMContentLoaded", () => {
  const footerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <a href="/">トップ</a>
        <a href="/terms.html">利用規約</a>
        <span class="footer-domain"><a href="https://mugendrill.com/">mugendrill.com</a></span>
      </div>
    </footer>
  `;

  // ★ここを変更
  const app = document.querySelector(".app");
  app.insertAdjacentHTML("afterend", footerHTML);
});