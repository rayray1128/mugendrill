function formatNumber(num) {
  return num >= 0 ? `+${num}` : `${num}`;
}

function toSuperscript(num) {
  const map = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴"};
  return String(num).split("").map(d => map[d] || d).join("");
}

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
// 整数（累乗対応）
// =============================
function createSingleNumber(settings) {
  const usePowerNow = settings.usePower && Math.random() < 0.7;

  const base = usePowerNow
    ? createNumberByDigit([1]) // 累乗時は1桁
    : createNumberByDigit(settings.selectedDigits);

  const formatted = formatNumber(base);

  if (usePowerNow) {
    const powers = settings.selectedPowers.length
      ? settings.selectedPowers
      : [2];

    const exponent = pickRandom(powers);

    return {
      display: `(${formatted})${toSuperscript(exponent)}`,
      value: Math.pow(base, exponent),
    };
  }

  return { display: formatted, value: base };
}

// =============================
// 混合数生成
// =============================
function createMixedNumber(settings) {
  const mode = settings.numberMode;

  if (mode === "fraction") return createFraction();
  if (mode === "decimal") return createDecimal();

  if (mode === "int_fraction") {
    return Math.random() < 0.5
      ? createFraction()
      : createSingleNumber(settings);
  }

  if (mode === "int_decimal") {
    return Math.random() < 0.5
      ? createDecimal()
      : createSingleNumber(settings);
  }

  return createSingleNumber(settings);
}

// =============================
// 問題生成
// =============================
function createProblem(settings) {
  let numbers;
  const mode = settings.numberMode;

  // =============================
  // 分数系（LCM制御）
  // =============================
  if (mode === "fraction" || mode === "int_fraction") {
    const denoms = generateDenominators(settings.termCount);

    numbers = denoms.map(d => {
      const type = mode === "fraction"
        ? "fraction"
        : pickRandom(["fraction", "int"]);

      if (type === "fraction") {
        const numerator = rand(1, d - 1);
        const sign = Math.random() > 0.5 ? -1 : 1;

        return {
          display: `
            <span class="fraction-wrap">
              ${sign === -1 ? '<span class="minus">−</span>' : ''}
              <span class="fraction">
                <span class="num">${numerator}</span>
                <span class="den">${d}</span>
              </span>
            </span>
          `,
          value: sign * (numerator / d),
        };
      }

      return createSingleNumber(settings);
    });

  // =============================
  // 小数系
  // =============================
  } else if (mode === "decimal" || mode === "int_decimal") {
    numbers = Array.from({ length: settings.termCount }, () => {
      const type = mode === "decimal"
        ? "decimal"
        : pickRandom(["decimal", "int"]);

      if (type === "decimal") return createDecimal();

      return createSingleNumber(settings);
    });

  // =============================
  // 整数のみ
  // =============================
  } else {
    numbers = Array.from({ length: settings.termCount }, () =>
      createSingleNumber(settings)
    );
  }

  // =============================
  // 演算子
  // =============================
  const operatorSet = settings.calcType === "muldiv"
    ? ["×","÷"]
    : ["+","−"];

  const ops = Array.from(
    { length: settings.termCount - 1 },
    () => pickRandom(operatorSet)
  );

  let q = numbers[0].display;
  let ans = numbers[0].value;

  // =============================
  // 計算（除算だけ制御）
  // =============================
 for (let i = 1; i < numbers.length; i++) {
  const op = ops[i - 1];
  let next = numbers[i];

  // =============================
  // 除算の安全処理（ここ重要）
  // =============================
  if (op === "÷") {
    const abs = Math.abs(ans);

    if (abs !== 0) {
      const divisors = [];

      for (let d = 1; d <= abs; d++) {
        if (abs % d === 0) divisors.push(d);
      }

      // ★ここ追加（NaN防止）
if (divisors.length === 0) {
  if (settings.numberMode === "fraction") {
    next = createFraction();
  } else if (settings.numberMode === "decimal") {
    next = createDecimal();
  } else {
    next = {
      display: formatNumber(1),
      value: 1,
    };
  }
}
    } else {
      // 0のときも保険
      next = {
        display: formatNumber(1),
        value: 1,
      };
    }
  }

  // =============================
  // 通常処理
  // =============================
  q += ` ${op} (${next.display})`;
  ans = calc(ans, next.value, op);
}

  return { question: q, answer: ans };
}

// =============================
// 計算
// =============================
function calc(a, b, op) {
  if (b === undefined || isNaN(b)) return a;

  if (op === "+") return a + b;
  if (op === "−") return a - b;
  if (op === "×") return a * b;
  if (op === "÷") return a / b;
}
// =============================
// 数学ユーティリティ
// =============================
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function isValidDenominators(list, maxLCM = 20) {
  let current = list[0];

  for (let i = 1; i < list.length; i++) {
    current = lcm(current, list[i]);
    if (current > maxLCM) return false;
  }

  return true;
}