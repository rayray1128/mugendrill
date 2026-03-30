// printer.js

function printQuestions(APP_STATE, render) {
  if (!APP_STATE.problems.length) {
    alert("先に問題を作ってください。");
    return;
  }

  APP_STATE.isAnswerView = false;
  render();
  window.print();
}

function printAnswers(APP_STATE, render) {
  if (!APP_STATE.problems.length) {
    alert("先に問題を作ってください。");
    return;
  }

  APP_STATE.isAnswerView = true;
  render();
  window.print();

  APP_STATE.isAnswerView = false;
  render();
}