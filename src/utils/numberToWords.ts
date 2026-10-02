const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function convertGroup(num: number): string {
  let result = '';
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  if (num > 0) {
    result += ones[num] + ' ';
  }
  return result.trim();
}

export function numberToNairaWords(amount: number): string {
  if (amount === 0) return 'Zero Naira Only';
  if (isNaN(amount)) return '';

  const wholeNaira = Math.floor(Math.abs(amount));
  const kobo = Math.round((Math.abs(amount) - wholeNaira) * 100);

  if (wholeNaira === 0 && kobo === 0) return 'Zero Naira Only';

  let num = wholeNaira;
  const billions = Math.floor(num / 1_000_000_000);
  num %= 1_000_000_000;
  const millions = Math.floor(num / 1_000_000);
  num %= 1_000_000;
  const thousands = Math.floor(num / 1_000);
  num %= 1_000;
  const remainder = num;

  const parts: string[] = [];

  if (billions > 0) {
    parts.push(convertGroup(billions) + ' Billion');
  }
  if (millions > 0) {
    parts.push(convertGroup(millions) + ' Million');
  }
  if (thousands > 0) {
    parts.push(convertGroup(thousands) + ' Thousand');
  }
  if (remainder > 0) {
    parts.push(convertGroup(remainder));
  }

  let text = parts.join(' ').trim();
  if (!text) text = 'Zero';

  let result = text + ' Naira';

  if (kobo > 0) {
    result += ` and ${convertGroup(kobo)} Kobo`;
  }

  return result + ' Only';
}

export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
