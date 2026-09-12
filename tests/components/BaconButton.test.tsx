import { render, screen, fireEvent } from '@testing-library/react-native';
import { BaconButton, BACON_BUTTON_VARIANTS } from '../../src/atoms/BaconButton';
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

const BUTTON_TEST_ID = 'bacon-button-surface';

describe('BaconButton', () => {
  it('renders its label and fires onPress', () => {
    const onPress = jest.fn();
    renderOnSurface(<BaconButton onPress={onPress}>Create an Account</BaconButton>);
    fireEvent.press(screen.getByRole('button', { name: 'Create an Account' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  describe('shape (Brand Guide 08)', () => {
    it('is a full pill — there are no rectangular buttons in Bacon', () => {
      renderOnSurface(<BaconButton onPress={jest.fn()}>Add Expense</BaconButton>);
      expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({ borderRadius: baconRadii.pill });
    });

    it('is 48pt tall with 28pt side padding', () => {
      renderOnSurface(<BaconButton onPress={jest.fn()}>Add Expense</BaconButton>);
      expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({
        height: baconLayout.buttonHeight,
        paddingHorizontal: baconLayout.buttonPaddingHorizontal,
      });
    });

    it('carries a Bold label', () => {
      renderOnSurface(<BaconButton onPress={jest.fn()}>Add Expense</BaconButton>);
      expect(screen.getByText('Add Expense')).toHaveStyle({ fontWeight: '700' });
    });
  });

  describe('surface awareness (Brand Guide 04 / 08)', () => {
    it('is a navy fill on paper', () => {
      renderOnSurface(
        <BaconButton onPress={jest.fn()}>Create an Account</BaconButton>,
        'paper',
      );
      expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({
        backgroundColor: baconColors.navy900,
      });
      expect(screen.getByText('Create an Account')).toHaveStyle({ color: baconColors.white });
    });

    it('is a navy hairline on nothing when secondary on paper', () => {
      renderOnSurface(
        <BaconButton variant="secondary" onPress={jest.fn()}>
          I already have an account
        </BaconButton>,
        'paper',
      );
      const surfaceEl = screen.getByTestId(BUTTON_TEST_ID);
      expect(surfaceEl).toHaveStyle({ backgroundColor: 'transparent', borderWidth: 1.5 });
      expect(surfaceEl).toHaveStyle({ borderColor: baconColors.navy900 });
    });

    it('becomes an outline-white button on a navy screen', () => {
      renderOnSurface(<BaconButton onPress={jest.fn()}>Update Password</BaconButton>, 'navy');
      const surfaceEl = screen.getByTestId(BUTTON_TEST_ID);
      expect(surfaceEl).toHaveStyle({ backgroundColor: 'transparent' });
      expect(surfaceEl).toHaveStyle({ borderColor: baconColors.white });
      expect(screen.getByText('Update Password')).toHaveStyle({ color: baconColors.white });
    });

    it('never renders a filled white pill as a call to action', () => {
      // A filled white pill is reserved for a selected chip (Brand Guide 08).
      for (const variant of BACON_BUTTON_VARIANTS) {
        const view = renderOnSurface(
          <BaconButton variant={variant} onPress={jest.fn()}>
            Go
          </BaconButton>,
          'navy',
        );
        expect(view.getByTestId(BUTTON_TEST_ID)).not.toHaveStyle({
          backgroundColor: baconColors.white,
        });
        view.unmount();
      }
    });

    it('uses Navy 600 for a button inside a Navy 700 panel', () => {
      renderOnSurface(
        <BaconButton onPress={jest.fn()}>View All Sessions</BaconButton>,
        'panel',
      );
      expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({
        backgroundColor: baconColors.navy600,
      });
    });
  });

  describe('the red doctrine (Brand Guide 04)', () => {
    it('offers no destructive or danger variant at all', () => {
      expect(BACON_BUTTON_VARIANTS).toEqual(['primary', 'secondary']);
      expect(BACON_BUTTON_VARIANTS).not.toContain('danger');
      expect(BACON_BUTTON_VARIANTS).not.toContain('destructive');
    });

    it('never renders a red fill for any variant on any surface', () => {
      const surfaces: BaconSurface[] = ['paper', 'white', 'navy', 'panel'];
      for (const surface of surfaces) {
        for (const variant of BACON_BUTTON_VARIANTS) {
          const view = renderOnSurface(
            <BaconButton variant={variant} onPress={jest.fn()}>
              Delete
            </BaconButton>,
            surface,
          );
          expect(view.getByTestId(BUTTON_TEST_ID)).not.toHaveStyle({
            backgroundColor: baconColors.red,
          });
          view.unmount();
        }
      }
    });
  });

  describe('states', () => {
    it('announces and blocks a disabled button', () => {
      const onPress = jest.fn();
      renderOnSurface(
        <BaconButton onPress={onPress} disabled>
          Next
        </BaconButton>,
      );
      const button = screen.getByRole('button', { name: 'Next' });
      expect(button).toBeDisabled();
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('shows a busy state, keeps the label for screen readers, and blocks presses', () => {
      const onPress = jest.fn();
      renderOnSurface(
        <BaconButton onPress={onPress} loading>
          Finish
        </BaconButton>,
      );
      const button = screen.getByRole('button', { name: 'Finish' });
      expect(button).toBeBusy();
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  it('meets the 48pt minimum tap target', () => {
    renderOnSurface(<BaconButton onPress={jest.fn()}>Add Expense</BaconButton>);
    expect(screen.getByTestId(BUTTON_TEST_ID)).toHaveStyle({
      height: expect.any(Number) as unknown as number,
    });
    const style = screen.getByTestId(BUTTON_TEST_ID).props.style;
    const flattened = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(flattened.height).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
  });
});
