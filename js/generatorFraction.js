// =============================
// 整数
// =============================
function createInteger(settings) {
  const base = createNumberByDigit(settings.selectedDigits);
  const formatted = formatNumber(base);

  if (settings.usePower && settings.selectedPowers.length && Math.random() > 0.5) {
    const exponent = pickRandom(settings.selectedPowers);

    return {
      display: `(${formatted})${toSuperscript(exponent)}`,
      value: Math.pow(base, exponent),
    };
  }

  return {
    display: formatted,
    value: base,
  };
}

// =============================
// 分数
// =============================
function createFraction() {
  const denominator = getRandomInt(2, 9);
  const numerator = getRandomInt(1, denominator - 1);
  const sign = Math.random() > 0.5 ? -1 : 1;

  return {
    display: `
      <span class="fraction">
        <span class="num">${sign === -1 ? "-" : ""}${numerator}</span>
        <span class="den">${denominator}</span>
      </span>
    `,
    value: sign * (numerator / denominator),
  };
}

function createFractionGroup(termCount) {
  const denominator = pickRandom([2,3,4,5]);

  return Array.from({ length: termCount }, () => {
    const numerator = getRandomInt(1, denominator - 1);
    const sign = Math.random() > 0.5 ? -1 : 1;

    return {
      display: `${sign === -1 ? "-" : ""}${numerator}/${denominator}`,
      value: sign * (numerator / denominator),
    };
  });
}

function createFractionsWithLimit(termCount) {
  while (true) {
    const denominators = Array.from(
      { length: termCount },
      () => pickRandom([2,3,4,5,6,7,8,9])
    );

    if (isValidDenominators(denominators, 30)) {
      return denominators.map(d => {
        const n = getRandomInt(1, d - 1);
        const sign = Math.random() > 0.5 ? -1 : 1;

        return {
          display: `${sign === -1 ? "-" : ""}${n}/${d}`,
          value: sign * (n / d),
        };
      });
    }
  }
}

function createFractionSet(termCount) {
  while (true) {
    const denominators = Array.from(
      { length: termCount },
      () => pickRandom([2,3,4,5,6,7,8,9])
    );

    if (isValidDenominators(denominators, 30)) {
      return denominators.map(d => {
        const n = getRandomInt(1, d - 1);
        const sign = Math.random() > 0.5 ? -1 : 1;

        return {
          display: `${sign === -1 ? "-" : ""}${n}/${d}`,
          value: sign * (n / d),
        };
      });
    }
  }
}

// =============================
// 小数
// =============================
function createDecimal() {
  const num = getRandomInt(1, 99);
  const value = num / 10;
  const sign = Math.random() > 0.5 ? -1 : 1;

  const finalValue = sign * value;

  return {
    display: formatNumber(finalValue),
    value: finalValue,
  };
}

// =============================
// 整数（桁指定）
// =============================
function createNumberByDigit(selectedDigits) {
  const digit = pickRandom(selectedDigits);

  let min, max;
  if (digit === 1) [min, max] = [1, 9];
  if (digit === 2) [min, max] = [10, 99];
  if (digit === 3) [min, max] = [100, 999];

  const value = getRandomInt(min, max);
  return Math.random() > 0.5 ? value : -value;
}

// =============================
// 混合数
// =============================
function createMixedNumber(settings) {
  const type = pickRandom(settings.numberTypes);

  if (type === "fraction") return createFraction();
  if (type === "decimal") return createDecimal();

  return createInteger(settings);
}
// =============================
// 数列生成
// =============================
function createNumbers(settings) {
  return Array.from(
    { length: settings.termCount },
    () => createMixedNumber(settings)
  );
}

// =============================
// 問題生成
// =============================
function createProblem(settings) {
  const numbers = createNumbers(settings);

  const ops = Array.from(
    { length: settings.termCount - 1 },
    () => pickRandom(settings.useMultiply ? ["+","-","×"] : ["+","-"])
  );

  let q = numbers[0].display;
  let ans = numbers[0].value;

  for (let i = 1; i < numbers.length; i++) {
    q += ` ${ops[i - 1]} (${numbers[i].display})`;
    ans = calc(ans, numbers[i].value, ops[i - 1]);
  }

  return { question: q, answer: ans };
}

// =============================
// 計算
// =============================
function calc(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "×") return a * b;
}