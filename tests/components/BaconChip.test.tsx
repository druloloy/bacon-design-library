import { render, screen, fireEvent } from '@testing-library/react-native';
import { BaconChip } from '../../src/atoms/BaconChip';
import { BaconSurfaceProvider, BaconThemeProvider } from '../../src/theme';
import { baconColors, baconLayout, baconRadii } from '../../src/foundations';
import type { BaconSurface } from '../../src/theme';

function renderOnSurface(node: React.ReactElement, surface: BaconSurface = 'paper') {
  return render(
    <BaconThemeProvider>
      <BaconSurfaceProvider surface={surface}>{node}</BaconSurfaceProvider>
    </BaconThemeProvider>,
  );
}

const CHIP_SURFACE = 'bacon-chip-surface';

describe('BaconChip', () => {
  it('renders its label and fires onPress', () => {
    const onPress = jest.fn();
    renderOnSurface(<BaconChip label="Weekly" onPress={onPress} />);
    fireEvent.press(screen.getByRole('radio', { name: 'Weekly' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows an emoji prefix for a category, as its own element', () => {
    renderOnSurface(<BaconChip label="Transportation" emoji="🚕" onPress={jest.fn()} />);
    // The emoji is deliberately hidden from assistive tech — the chip announces its label.
    expect(screen.getByText('🚕', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Transportation')).toBeOnTheScreen();
  });

  describe('shape (Brand Guide 08)', () => {
    it('is a pill', () => {
      renderOnSurface(<BaconChip label="Daily" onPress={jest.fn()} />);
      expect(screen.getByTestId(CHIP_SURFACE)).toHaveStyle({ borderRadius: baconRadii.pill });
    });

    it('stays 36pt tall visually', () => {
      renderOnSurface(<BaconChip label="Daily" onPress={jest.fn()} />);
      expect(screen.getByTestId(CHIP_SURFACE)).toHaveStyle({
        height: baconLayout.chipVisualHeight,
      });
    });

    it('carries a Regular label, not a Bold one', () => {
      renderOnSurface(<BaconChip label="Daily" onPress={jest.fn()} />);
      expect(screen.getByText('Daily')).toHaveStyle({ fontWeight: '400' });
    });
  });

  describe('selection (Brand Guide 08)', () => {
    it('is a hairline outline when unselected on paper', () => {
      renderOnSurface(<BaconChip label="Daily" onPress={jest.fn()} />, 'paper');
      const chip = screen.getByTestId(CHIP_SURFACE);
      expect(chip).toHaveStyle({ backgroundColor: 'transparent' });
      expect(chip).toHaveStyle({ borderColor: baconColors.navy900 });
    });

    it('inverts to a solid navy fill when selected on paper', () => {
      renderOnSurface(<BaconChip label="Weekly" selected onPress={jest.fn()} />, 'paper');
      expect(screen.getByTestId(CHIP_SURFACE)).toHaveStyle({
        backgroundColor: baconColors.navy900,
      });
      expect(screen.getByText('Weekly')).toHaveStyle({ color: baconColors.white });
    });

    it('inverts to the filled white pill when selected on navy', () => {
      renderOnSurface(<BaconChip label="System" selected onPress={jest.fn()} />, 'navy');
      expect(screen.getByTestId(CHIP_SURFACE)).toHaveStyle({
        backgroundColor: baconColors.white,
      });
      expect(screen.getByText('System')).toHaveStyle({ color: baconColors.navy900 });
    });
  });

  describe('accessibility (Brand Guide 12)', () => {
    it('is announced as a radio, not a button, so a group reads as a choice', () => {
      renderOnSurface(<BaconChip label="Weekly" onPress={jest.fn()} />);
      expect(screen.getByRole('radio', { name: 'Weekly' })).toBeOnTheScreen();
      expect(screen.queryByRole('button', { name: 'Weekly' })).toBeNull();
    });

    it('exposes its selected state', () => {
      const view = renderOnSurface(<BaconChip label="Weekly" selected onPress={jest.fn()} />);
      expect(view.getByRole('radio', { name: 'Weekly' })).toBeSelected();
      view.unmount();
      renderOnSurface(<BaconChip label="Weekly" onPress={jest.fn()} />);
      expect(screen.getByRole('radio', { name: 'Weekly' })).not.toBeSelected();
    });

    it('reads the category name rather than the raw emoji', () => {
      renderOnSurface(<BaconChip label="Vacation" emoji="🏖️" onPress={jest.fn()} />);
      expect(screen.getByRole('radio', { name: 'Vacation' })).toBeOnTheScreen();
    });

    it('expands a 36pt chip to a 48pt hit area with padding, not resizing', () => {
      renderOnSurface(<BaconChip label="Daily" onPress={jest.fn()} />);
      const chip = screen.getByRole('radio', { name: 'Daily' });
      const slop = chip.props.hitSlop as { top: number; bottom: number };
      expect(slop.top + slop.bottom + baconLayout.chipVisualHeight).toBeGreaterThanOrEqual(
        baconLayout.minTapTarget,
      );
      expect(screen.getByTestId(CHIP_SURFACE)).toHaveStyle({
        height: baconLayout.chipVisualHeight,
      });
    });

    it('announces and blocks a disabled chip', () => {
      const onPress = jest.fn();
      renderOnSurface(<BaconChip label="Daily" disabled onPress={onPress} />);
      const chip = screen.getByRole('radio', { name: 'Daily' });
      expect(chip).toBeDisabled();
      fireEvent.press(chip);
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  it('never renders red, which is not a chip colour', () => {
    const surfaces: BaconSurface[] = ['paper', 'navy'];
    for (const surface of surfaces) {
      for (const selected of [true, false]) {
        const view = renderOnSurface(
          <BaconChip label="Other" selected={selected} onPress={jest.fn()} />,
          surface,
        );
        expect(view.getByTestId(CHIP_SURFACE)).not.toHaveStyle({
          backgroundColor: baconColors.red,
        });
        view.unmount();
      }
    }
  });
});
