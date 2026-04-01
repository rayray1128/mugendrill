// =============================
// 分数
// =============================
function createFraction() {
  const denominator = getRandomInt(2, 9);
  const numerator = getRandomInt(1, denominator - 1);
  const sign = Math.random() > 0.5 ? -1 : 1;

  return {
    display: `
      <span class="fraction-wrap">
        ${sign === -1 ? '<span class="minus">−</span>' : ''}
        <span class="fraction">
          <span class="num">${numerator}</span>
          <span class="den">${denominator}</span>
        </span>
      </span>
    `,
    value: sign * (numerator / denominator),
  };
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
// 分母制御（LCM対応）
// =============================
const BASE_PRIMES = [2, 3, 5, 7];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lcmArray(arr) {
  return arr.reduce((acc, val) => lcm(acc, val));
}

function factorize(n) {
  const result = [];
  BASE_PRIMES.forEach(p => {
    while (n % p === 0) {
      result.push(p);
      n /= p;
    }
  });
  return result;
}

function generateDenominator() {
  const p1 = pickRandom(BASE_PRIMES);

  // 2要素合成
  if (Math.random() < 0.3) {
    const p2 = pickRandom(BASE_PRIMES);
    return p1 * p2;
  }

  // 平方
  if (Math.random() < 0.3) {
    return p1 * p1;
  }

  return p1;
}

function isValidCombination(denoms) {
  const primesUsed = new Set();

  denoms.forEach(d => {
    factorize(d).forEach(p => primesUsed.add(p));
  });

  // 2,3,5,7全部使ったらNG
  return primesUsed.size < 4;
}

function getLcmLimit(count) {
  if (count <= 2) return 100;
  if (count === 3) return 60;
  return 50;
}

// =============================
// 分母セット生成（メイン）
// =============================
function generateDenominators(count) {
  while (true) {
    const denoms = Array.from({ length: count }, generateDenominator);

    const lcmValue = lcmArray(denoms);
    const limit = getLcmLimit(count);

    if (lcmValue <= limit && isValidCombination(denoms)) {
      return denoms;
    }
  }
}

// =============================
// 分数セット生成（LCM制御付き）
// =============================
function createFractionSet(termCount) {
  const denoms = generateDenominators(termCount);

  return denoms.map(d => {
    const n = getRandomInt(1, d - 1);
    const sign = Math.random() > 0.5 ? -1 : 1;

    return {
      display: `
        <span class="fraction-wrap">
          ${sign === -1 ? '<span class="minus">−</span>' : ''}
          <span class="fraction">
            <span class="num">${n}</span>
            <span class="den">${d}</span>
          </span>
        </span>
      `,
      value: sign * (n / d),
    };
  });
}