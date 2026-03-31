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
  const numbers = Array.from({ length: settings.termCount }, () =>
    createMixedNumber(settings)
  );

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

function calc(a,b,op){
  if(op === "+") return a+b;
  if(op === "-") return a-b;
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

