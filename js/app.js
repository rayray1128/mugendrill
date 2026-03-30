const APP_STATE = {
  problems: [],
  isAnswerView: false,
};

const DOM = {
  problemCount: document.getElementById("problemCount"),
  termCount: document.getElementById("termCount"),
  useMultiply: document.getElementById("useMultiply"),
  usePower: document.getElementById("usePower"),
  generateButton: document.getElementById("generateButton"),
  sheet: document.getElementById("sheet"),
  printQuestionButton: document.getElementById("printQuestionButton"),
  printAnswerButton: document.getElementById("printAnswerButton"),
  emptyState: document.getElementById("emptyState"), // ★これ追加
};

init();

function init() {
  DOM.generateButton.addEventListener("click", generate);

  DOM.printQuestionButton.addEventListener("click", () => {
  printQuestions(APP_STATE, render);
});

DOM.printAnswerButton.addEventListener("click", () => {
  printAnswers(APP_STATE, render);
});

}

function generate() {
  const settings = getSettings();

  APP_STATE.problems = Array.from(
    { length: settings.problemCount },
    () => createProblem(settings)
  );

  render();
}

function getSettings() {
  return {
    problemCount: clampNumber(toNumber(DOM.problemCount.value),1,60,12),
    termCount: clampNumber(toNumber(DOM.termCount.value),2,6,3),
    numberTypes: getSelectedNumberTypes(),
    useMultiply: DOM.useMultiply.checked,
    usePower: DOM.usePower.checked,
    selectedPowers: getSelectedPowers(),
    selectedDigits: getSelectedDigits(),
  };
}

function getSelectedNumberTypes() {
  const list = Array.from(document.querySelectorAll('input[name="numberType"]:checked'))
    .map(n => n.value);

  return list.length ? list : ["int"];
}

function getSelectedPowers(){
  return Array.from(document.querySelectorAll('input[name="power"]:checked'))
    .map(n => Number(n.value));
}

function getSelectedDigits(){
  const list = Array.from(document.querySelectorAll('input[name="digit"]:checked'))
    .map(n => Number(n.value));

  return list.length ? list : [1];
}

function render() {
  const has = APP_STATE.problems.length > 0;

  console.log("render:", APP_STATE.problems.length);

  DOM.sheet.innerHTML = "";

  if (!has) {
    DOM.emptyState.style.display = "block";
    return;
  }

  DOM.emptyState.style.display = "none";

  DOM.sheet.innerHTML = APP_STATE.problems
    .map((p, i) => `
      <div class="question-item">
        Q${i + 1}. ${p.question} = ${
          APP_STATE.isAnswerView ? p.answer : '<span class="blank"></span>'
        }
      </div>
    `)
    .join("");
}