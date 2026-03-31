//js\generator.js
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

function createSingleNumber(settings) {
  const base = createNumberByDigit(settings.selectedDigits);
  const formatted = formatNumber(base);

  if (settings.usePower && settings.selectedPowers.length && Math.random() > 0.5) {
    const exponent = pickRandom(settings.selectedPowers);
    return {
      display: `(${formatted})${toSuperscript(exponent)}`,
      value: Math.pow(base, exponent),
    };
  }

  return { display: formatted, value: base };
}

// =============================
// 混合数生成（ここ追加）
// =============================
function createMixedNumber(settings) {
  const types = settings.numberTypes?.length
    ? settings.numberTypes
    : ["int"];

  const type = pickRandom(types);

  if (type === "fraction") return createFraction();
  if (type === "decimal") return createDecimal();

  return createSingleNumber(settings); // 整数
}
function createProblem(settings) {
  let numbers;
  const mode = settings.numberMode;

  // =============================
  // 分数系（LCM制御あり）
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

      const value = createNumberByDigit(settings.selectedDigits);
      return {
        display: formatNumber(value),
        value: value,
      };
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

      const value = createNumberByDigit(settings.selectedDigits);
      return {
        display: formatNumber(value),
        value: value,
      };
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
  const ops = Array.from(
    { length: settings.termCount - 1 },
    () => pickRandom(settings.useMultiply ? ["+","−","×"] : ["+","−"])
  );

  let q = numbers[0].display;
  let ans = numbers[0].value;

  for (let i = 1; i < numbers.length; i++) {
    q += ` ${ops[i - 1]} (${numbers[i].display})`;
    ans = calc(ans, numbers[i].value, ops[i - 1]);
  }

  return { question: q, answer: ans };
}

function calc(a,b,op){
  if(op === "+") return a+b;
  if(op === "−") return a-b;
  if(op === "×") return a*b;
}


// =============================
// 数学ユーティリティ（LCM系）
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

