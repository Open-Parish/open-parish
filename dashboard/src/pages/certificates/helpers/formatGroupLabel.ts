function titleCaseWords(value: string): string {
  if (value.length === 0) return value;
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function spaceBeforeCapsAndDigits(value: string): string {
  let output = '';
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const prev = index > 0 ? value[index - 1] : '';
    const isUpper = char >= 'A' && char <= 'Z';
    const isDigit = char >= '0' && char <= '9';
    const prevIsSpace = prev === ' ';

    if (index > 0 && !prevIsSpace && (isUpper || isDigit)) {
      output += ' ';
    }

    output += char;
  }
  return output;
}

export function formatGroupLabel(parent: string): string {
  return titleCaseWords(spaceBeforeCapsAndDigits(parent).trim());
}
