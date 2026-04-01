const APP_STATE = {
  problems: [],
  isAnswerView: false,
};

const DOM = {
  problemCount: document.getElementById("problemCount"),
  termCount: document.getElementById("termCount"),
  numberMode: document.getElementById("numberMode"),
  usePower: document.getElementById("usePower"),
  generateButton: document.getElementById("generateButton"),
  sheet: document.getElementById("sheet"),
  printQuestionButton: document.getElementById("printQuestionButton"),
  printAnswerButton: document.getElementById("printAnswerButton"),
  emptyState: document.getElementById("emptyState"),
  pdfQuestionButton: document.getElementById("pdfQuestionButton"),
  pdfAnswerButton: document.getElementById("pdfAnswerButton"),
  pdfModal: document.getElementById("pdfModal"),
  pdfModalOk: document.getElementById("pdfModalOk"),
  alertModal: document.getElementById("alertModal"),
  alertModalOk: document.getElementById("alertModalOk"),
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

  // ★ここに移動（重要）
  DOM.pdfQuestionButton.addEventListener("click", () => {
    exportPDF(false);
  });

  DOM.pdfAnswerButton.addEventListener("click", () => {
    exportPDF(true);
  });

  DOM.pdfModalOk.addEventListener("click", () => {
    DOM.pdfModal.classList.remove("show");

    if (pendingPrint) {
      pendingPrint();
      pendingPrint = null;
    }
  });

  DOM.alertModalOk.addEventListener("click", () => {
    DOM.alertModal.classList.remove("show");
  });

  const digitField = document
    .querySelector('input[name="digit"]')
    ?.closest(".field");

  function updateDigitVisibility() {
    const mode = DOM.numberMode.value;

    const show =
      mode === "int" || mode === "int_fraction" || mode === "int_decimal";

    if (digitField) {
      digitField.style.display = show ? "block" : "none";
    }
  }

  DOM.numberMode.addEventListener("change", updateDigitVisibility);
  updateDigitVisibility();

  DOM.usePower.addEventListener("change", () => {
    powerOptions.classList.toggle("visible", DOM.usePower.checked);
  });
}

function generate() {
  const settings = getSettings();

  APP_STATE.problems = Array.from({ length: settings.problemCount }, () =>
    createProblem(settings),
  );

  render();
}

function getSettings() {
  const calcType = document.getElementById("calcType")?.value || "addsub";

  return {
    problemCount: clampNumber(toNumber(DOM.problemCount.value), 1, 60, 12),
    termCount: clampNumber(toNumber(DOM.termCount.value), 2, 6, 3),
    numberMode: DOM.numberMode.value,
    selectedDigits: getSelectedDigits(),
    calcType,

    // ★ここが分岐の核心
    usePower: calcType === "addsub" && DOM.usePower?.checked,
    selectedPowers: calcType === "addsub" ? getSelectedPowers() : [],
  };
}

function getSelectedPowers() {
  return Array.from(
    document.querySelectorAll('input[name="power"]:checked'),
  ).map((n) => Number(n.value));
}

function getSelectedDigits() {
  const list = Array.from(
    document.querySelectorAll('input[name="digit"]:checked'),
  ).map((n) => Number(n.value));

  return list.length ? list : [1];
}

let pendingPrint = null;

function exportPDF(withAnswer) {
  // ★ここ追加（最優先）
  if (APP_STATE.problems.length === 0) {
    DOM.alertModal.classList.add("show");
    return;
  }

  const original = APP_STATE.isAnswerView;
  const originalTitle = document.title;

  document.title = withAnswer ? "解答" : "問題";

  APP_STATE.isAnswerView = withAnswer;
  render();

  pendingPrint = () => {
    window.print();

    APP_STATE.isAnswerView = original;
    document.title = originalTitle;
    render();
  };

  DOM.pdfModal.classList.add("show");
}

function render() {
  const has = APP_STATE.problems.length > 0;

  DOM.sheet.innerHTML = "";

  if (!has) {
    DOM.emptyState.style.display = "block";
    return;
  }

  DOM.emptyState.style.display = "none";

  DOM.sheet.innerHTML = APP_STATE.problems
    .map(
      (p, i) => `
      <div class="question-item">
        Q${i + 1}. ${p.question} = ${
          APP_STATE.isAnswerView
            ? formatAnswer(p.answer)
            : '<span class="blank"></span>'
        }
      </div>
    `,
    )
    .join("");
}
