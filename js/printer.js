// printer.js

function printQuestions(APP_STATE, render) {
  if (APP_STATE.problems.length === 0) {
    document.getElementById("alertModal").classList.add("show");
    return;
  }

  APP_STATE.isAnswerView = false;
  render();
  window.print();
}

function printAnswers(APP_STATE, render) {
  if (APP_STATE.problems.length === 0) {
    document.getElementById("alertModal").classList.add("show");
    return;
  }

  APP_STATE.isAnswerView = true;
  render();
  window.print();

  APP_STATE.isAnswerView = false;
  render();
}
