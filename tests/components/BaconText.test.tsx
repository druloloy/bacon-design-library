import { render, screen } from '@testing-library/react-native';
import { BaconText } from '../../src/atoms/BaconText';
import { BaconSurfaceProvider, BaconThemeProvider } from '../../src/theme';
import { baconColors } from '../../src/foundations';

function renderOnSurface(
  node: React.ReactElement,
  surface: 'paper' | 'navy' | 'red' = 'paper',
) {
  return render(
    <BaconThemeProvider>
      <BaconSurfaceProvider surface={surface}>{node}</BaconSurfaceProvider>
    </BaconThemeProvider>,
  );
}

describe('BaconText', () => {
  it('renders its children', () => {
    renderOnSurface(<BaconText variant="body">You have 4 active accounts</BaconText>);
    expect(screen.getByText('You have 4 active accounts')).toBeOnTheScreen();
  });

  it('applies the documented size and weight for a role', () => {
    renderOnSurface(<BaconText variant="pageTitle">Notifications</BaconText>);
    expect(screen.getByText('Notifications')).toHaveStyle({ fontSize: 34, fontWeight: '300' });
  });

  it('renders the hero money role at 44 / 700 — money is the headline', () => {
    renderOnSurface(<BaconText variant="heroMoney">20,000</BaconText>);
    expect(screen.getByText('20,000')).toHaveStyle({ fontSize: 44, fontWeight: '700' });
  });

  it('resolves lineHeight from the documented ratio', () => {
    renderOnSurface(<BaconText variant="question">How much will be your budget?</BaconText>);
    // 22 * 1.25
    expect(screen.getByText('How much will be your budget?')).toHaveStyle({ lineHeight: 27.5 });
  });

  it('uppercases and tracks a nav action', () => {
    renderOnSurface(<BaconText variant="navAction">Finish</BaconText>);
    expect(screen.getByText('Finish')).toHaveStyle({
      textTransform: 'uppercase',
      letterSpacing: 0.9,
    });
  });

  it('takes navy on paper and white on navy without being told', () => {
    const light = renderOnSurface(<BaconText variant="body">Balance</BaconText>, 'paper');
    expect(light.getByText('Balance')).toHaveStyle({ color: baconColors.navy900 });
    light.unmount();

    renderOnSurface(<BaconText variant="body">Balance</BaconText>, 'navy');
    expect(screen.getByText('Balance')).toHaveStyle({ color: baconColors.white });
  });

  it('uses muted grey for meta on a light surface', () => {
    renderOnSurface(<BaconText variant="meta">target 25,000</BaconText>, 'paper');
    expect(screen.getByText('target 25,000')).toHaveStyle({ color: baconColors.muted });
  });

  describe('the muted-on-colour correction (Brand Guide 12)', () => {
    it('never renders muted grey on a red surface', () => {
      renderOnSurface(<BaconText variant="meta">Monthly</BaconText>, 'red');
      expect(screen.getByText('Monthly')).not.toHaveStyle({ color: baconColors.muted });
    });

    it('raises 14pt meta to the 16pt / 500 role on a coloured surface', () => {
      renderOnSurface(<BaconText variant="meta">Monthly</BaconText>, 'red');
      expect(screen.getByText('Monthly')).toHaveStyle({ fontSize: 16, fontWeight: '500' });
    });

    it('leaves meta at 14pt on a light surface', () => {
      renderOnSurface(<BaconText variant="meta">Monthly</BaconText>, 'paper');
      expect(screen.getByText('Monthly')).toHaveStyle({ fontSize: 14, fontWeight: '400' });
    });
  });

  it('centres by default only where the guide centres', () => {
    renderOnSurface(<BaconText variant="pageTitle">Add New Budget</BaconText>);
    expect(screen.getByText('Add New Budget')).toHaveStyle({ textAlign: 'center' });
  });

  it('left-aligns body text, which the guide does not centre', () => {
    renderOnSurface(<BaconText variant="body">Updated by @ddruu1</BaconText>);
    expect(screen.getByText('Updated by @ddruu1')).toHaveStyle({ textAlign: 'left' });
  });

  it('marks a heading role for assistive technology when asked', () => {
    renderOnSurface(
      <BaconText variant="sectionHeading" heading>
        Budget Overview
      </BaconText>,
    );
    expect(screen.getByRole('header', { name: 'Budget Overview' })).toBeOnTheScreen();
  });

  it('never emits a 600 weight for any variant', () => {
    const variants = [
      'pageTitle',
      'heroMoney',
      'sectionHeading',
      'question',
      'cardTitle',
      'walletName',
      'label',
      'body',
      'meta',
      'navAction',
      'metaOnColor',
    ] as const;
    for (const variant of variants) {
      const view = renderOnSurface(<BaconText variant={variant}>{variant}</BaconText>);
      expect(view.getByText(variant)).not.toHaveStyle({ fontWeight: '600' });
      view.unmount();
    }
  });
});
