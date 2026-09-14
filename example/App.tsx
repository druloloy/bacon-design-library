import { useCallback, useMemo, useState } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BaconThemeProvider } from '@druloloy/bacon-ui';

import { DashboardScreen } from './src/screens/DashboardScreen';
import { CreateBudgetNameScreen } from './src/screens/CreateBudgetNameScreen';
import { CreateBudgetAmountScreen } from './src/screens/CreateBudgetAmountScreen';
import { CompletionScreen } from './src/screens/CompletionScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import type { Budget, Route } from './src/types';

/**
 * The example app.
 *
 * Its only job is to prove the package is usable from outside: every import below comes from
 * `@druloloy/bacon-ui`, never from an internal path.
 *
 * Note what lives here and not in the library — the routing, the draft budget state, the wallet
 * data, and the decision about *which* screen is a money screen. The design system answers "what
 * does Bacon look and feel like"; this app answers "what does this feature do".
 *
 * Navigation is a switch statement on purpose. The Brand Guide gives Bacon no tab bar and a single
 * FAB, so a navigator would add a dependency without demonstrating anything about the system.
 */
export default function App(): React.JSX.Element {
  const [route, setRoute] = useState<Route>('dashboard');
  const [draft, setDraft] = useState<Budget>({
    name: '',
    category: null,
    amount: null,
    period: null,
  });

  /**
   * Quicksand, loaded per weight. Each file is registered under its own name, so the provider below
   * asks for fonts by those names on every platform (fontStrategy="named").
   */
  const [fontsLoaded] = useFonts({
    'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
    'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
  });

  const resetDraft = useCallback(() => {
    setDraft({ name: '', category: null, amount: null, period: null });
  }, []);

  const screen = useMemo(() => {
    switch (route) {
      case 'createName':
        return (
          <CreateBudgetNameScreen
            draft={draft}
            onChange={setDraft}
            onBack={() => setRoute('dashboard')}
            onNext={() => setRoute('createAmount')}
          />
        );
      case 'createAmount':
        return (
          <CreateBudgetAmountScreen
            draft={draft}
            onChange={setDraft}
            onBack={() => setRoute('createName')}
            onFinish={() => setRoute('completion')}
          />
        );
      case 'completion':
        return (
          <CompletionScreen
            draft={draft}
            onClose={() => {
              resetDraft();
              setRoute('dashboard');
            }}
            onNavigate={(next) => {
              resetDraft();
              setRoute(next);
            }}
          />
        );
      case 'settings':
        return <SettingsScreen onBack={() => setRoute('dashboard')} />;
      case 'dashboard':
      default:
        return (
          <DashboardScreen
            onCreateBudget={() => setRoute('createName')}
            onOpenSettings={() => setRoute('settings')}
          />
        );
    }
  }, [route, draft, resetDraft]);

  if (!fontsLoaded) return <></>;

  return (
    <SafeAreaProvider>
      {/*
        Bacon is configured once, here. fontStrategy="named" matches how useFonts registered the four
        Quicksand files above. It is the one setting that depends on the app, not on the brand.
      */}
      <BaconThemeProvider fontStrategy="named">
        <StatusBar style={route === 'settings' ? 'light' : 'dark'} />
        {screen}
      </BaconThemeProvider>
    </SafeAreaProvider>
  );
}
