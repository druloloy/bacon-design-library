import {
  HARD_SPACE,
  formatMoney,
  formatMoneyChange,
  formatChange,
  formatTarget,
  formatPercent,
  formatHandle,
  formatAttribution,
  maskMoney,
  moneyAccessibilityLabel,
} from '../../src/utils/formatting';

describe('formatMoney', () => {
  it('renders the guide example exactly: ₱ 20,000', () => {
    expect(formatMoney(20000)).toBe(`₱${HARD_SPACE}20,000`);
  });

  it('separates the glyph from the number with a hard space, never a normal space', () => {
    expect(formatMoney(1)).toContain('\u00A0');
    expect(formatMoney(1)).not.toContain('₱ 1');
  });

  it('keeps the minus sign on a negative balance: ₱ -110', () => {
    expect(formatMoney(-110)).toBe(`₱${HARD_SPACE}-110`);
  });

  it('keeps zero as an explicit numeric state rather than an empty string', () => {
    expect(formatMoney(0)).toBe(`₱${HARD_SPACE}0`);
  });

  it('groups thousands with commas', () => {
    expect(formatMoney(1234567)).toBe(`₱${HARD_SPACE}1,234,567`);
  });

  it('omits decimals on whole amounts and shows them otherwise', () => {
    expect(formatMoney(2000)).toBe(`₱${HARD_SPACE}2,000`);
    expect(formatMoney(2000.5)).toBe(`₱${HARD_SPACE}2,000.50`);
  });

  it('can drop the glyph for contexts that already imply currency', () => {
    expect(formatMoney(5000, { showSymbol: false })).toBe('5,000');
  });
});

describe('formatMoneyChange', () => {
  it('renders the guide example exactly: ₱ 2,000 +50', () => {
    expect(formatMoneyChange(2000, 50)).toBe(`₱${HARD_SPACE}2,000 +50`);
  });

  it('renders a deduction with a minus', () => {
    expect(formatMoneyChange(2000, -50)).toBe(`₱${HARD_SPACE}2,000 -50`);
  });
});

describe('formatChange', () => {
  it.each([
    [50, '+50'],
    [-50, '-50'],
    [0, '0'],
    [1500, '+1,500'],
  ])('formats %p as %p', (input, expected) => {
    expect(formatChange(input)).toBe(expected);
  });
});

describe('supporting formats', () => {
  it('states a savings target in lower case, without a glyph', () => {
    expect(formatTarget(25000)).toBe('target 25,000');
  });

  it('rounds percentages to whole numbers', () => {
    expect(formatPercent(49.6)).toBe('50%');
    expect(formatPercent(0)).toBe('0%');
  });

  it('keeps the @ on a handle and never doubles it', () => {
    expect(formatHandle('ddruu1')).toBe('@ddruu1');
    expect(formatHandle('@ddruu1')).toBe('@ddruu1');
  });

  it('attributes a transaction by handle', () => {
    expect(formatAttribution('ddruu1')).toBe('Updated by @ddruu1');
  });
});

describe('maskMoney', () => {
  it('keeps the glyph and hides every digit', () => {
    const masked = maskMoney(20000);
    expect(masked.startsWith(`₱${HARD_SPACE}`)).toBe(true);
    expect(masked).not.toMatch(/\d/);
    expect(masked).toContain('\u2022');
  });
});

describe('moneyAccessibilityLabel', () => {
  it('speaks the currency name rather than the glyph', () => {
    expect(moneyAccessibilityLabel(20000)).toBe('20,000 pesos');
  });

  it('speaks the minus sign so a negative is never carried by colour alone', () => {
    expect(moneyAccessibilityLabel(-110)).toBe('minus 110 pesos');
  });
});
