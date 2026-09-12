import { render, screen } from '@testing-library/react-native';
import { BaconProgressBar } from '../../src/atoms/BaconProgressBar';
import { BaconSurfaceProvider, BaconThemeProvider } from '../../src/theme';
import { baconColors, baconLayout, baconRadii } from '../../src/foundations';
import type { BaconSurface } from '../../src/theme';

function renderOnSurface(node: React.ReactElement, surface: BaconSurface = 'white') {
  return render(
    <BaconThemeProvider>
      <BaconSurfaceProvider surface={surface}>{node}</BaconSurfaceProvider>
    </BaconThemeProvider>,
  );
}

const TRACK = 'bacon-progress-track';
const FILL = 'bacon-progress-fill';
const CHIP = 'bacon-progress-chip';

function flatten(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flatten));
  return (style ?? {}) as Record<string, unknown>;
}

/**
 * "This is the most recognisable detail in the product — do not replace it with a label above or
 * beside the bar." (Brand Guide 09)
 */
describe('BaconProgressBar', () => {
  it('is a 20pt pill', () => {
    renderOnSurface(<BaconProgressBar percent={50} />);
    expect(screen.getByTestId(TRACK)).toHaveStyle({
      height: baconLayout.progressBarHeight,
      borderRadius: baconRadii.pill,
    });
  });

  it('fills to the given percentage', () => {
    renderOnSurface(<BaconProgressBar percent={62} />);
    expect(screen.getByTestId(FILL)).toHaveStyle({ width: '62%' });
  });

  describe('the boundary chip', () => {
    it('renders the value in a chip when a value is given', () => {
      renderOnSurface(<BaconProgressBar percent={62} value={5000} />);
      expect(screen.getByText('5,000')).toBeOnTheScreen();
    });

    it('places the chip on the boundary of the fill, not above or beside the bar', () => {
      renderOnSurface(<BaconProgressBar percent={62} value={5000} />);
      expect(flatten(screen.getByTestId(CHIP).props.style).left).toBe('62%');
    });

    it('straddles the boundary rather than sitting fully to one side', () => {
      renderOnSurface(<BaconProgressBar percent={50} value={5000} />);
      const style = flatten(screen.getByTestId(CHIP).props.style);
      const transforms = style.transform as Array<{ translateX: number }> | undefined;
      expect(transforms?.[0]?.translateX).toBeDefined();
    });

    it('keeps the chip inside the bar at 0%', () => {
      renderOnSurface(<BaconProgressBar percent={0} value={10110} />);
      expect(flatten(screen.getByTestId(CHIP).props.style).left).toBe('0%');
      expect(screen.getByText('10,110')).toBeOnTheScreen();
    });

    it('keeps the chip inside the bar at 100%', () => {
      renderOnSurface(<BaconProgressBar percent={100} value={25000} />);
      expect(flatten(screen.getByTestId(CHIP).props.style).left).toBe('100%');
    });

    it('omits the chip only when no value is supplied', () => {
      renderOnSurface(<BaconProgressBar percent={40} />);
      expect(screen.queryByTestId(CHIP)).toBeNull();
    });
  });

  describe('clamping', () => {
    it('clamps below zero', () => {
      renderOnSurface(<BaconProgressBar percent={-20} />);
      expect(screen.getByTestId(FILL)).toHaveStyle({ width: '0%' });
    });

    it('clamps above one hundred', () => {
      renderOnSurface(<BaconProgressBar percent={140} />);
      expect(screen.getByTestId(FILL)).toHaveStyle({ width: '100%' });
    });
  });

  describe('surface states (Brand Guide 09)', () => {
    it('is a navy fill on a track on a white card', () => {
      renderOnSurface(<BaconProgressBar percent={50} />, 'white');
      expect(screen.getByTestId(TRACK)).toHaveStyle({ backgroundColor: baconColors.track });
      expect(screen.getByTestId(FILL)).toHaveStyle({ backgroundColor: baconColors.navy900 });
    });

    it('turns its fill white on a navy tile', () => {
      renderOnSurface(<BaconProgressBar percent={40} />, 'navy');
      expect(screen.getByTestId(FILL)).toHaveStyle({ backgroundColor: baconColors.white });
    });

    it('loses its track and becomes a white outline on a red tile', () => {
      renderOnSurface(<BaconProgressBar percent={0} />, 'red');
      const track = screen.getByTestId(TRACK);
      expect(track).toHaveStyle({ backgroundColor: 'transparent' });
      expect(track).toHaveStyle({ borderColor: baconColors.white });
      expect(flatten(track.props.style).borderWidth).toBeGreaterThan(0);
    });

    it('centres the value on a red tile, where there is no fill boundary to straddle', () => {
      renderOnSurface(<BaconProgressBar percent={0} value={10110} />, 'red');
      expect(flatten(screen.getByTestId(CHIP).props.style).left).toBe('50%');
      expect(screen.getByText('10,110')).toBeOnTheScreen();
    });

    it('does not draw a full-width track on red, which would read as already full', () => {
      renderOnSurface(<BaconProgressBar percent={0} />, 'red');
      expect(screen.getByTestId(TRACK)).not.toHaveStyle({ backgroundColor: baconColors.track });
    });
  });

  describe('accessibility', () => {
    it('exposes a progressbar role with a bounded value', () => {
      renderOnSurface(<BaconProgressBar percent={62} accessibilityLabel="Budget 2 progress" />);
      const bar = screen.getByRole('progressbar', { name: 'Budget 2 progress' });
      expect(bar.props.accessibilityValue).toEqual({ now: 62, min: 0, max: 100 });
    });

    it('reports a clamped value rather than an out-of-range one', () => {
      renderOnSurface(<BaconProgressBar percent={140} accessibilityLabel="Savings progress" />);
      expect(
        screen.getByRole('progressbar', { name: 'Savings progress' }).props.accessibilityValue
          .now,
      ).toBe(100);
    });
  });
});
