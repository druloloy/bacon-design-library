import {
  BaconButton,
  BaconText,
  NavyStackTemplate,
  Panel,
  PanelGroup,
  RowLink,
} from '@druloloy/bacon-ui';

/**
 * Archetype 3 — Navy stack.
 *
 * The background is doing the work here: the user knows they are in settings rather than in their
 * money without a single label saying so (Brand Guide 04).
 */
export function SettingsScreen({ onBack }: { onBack: () => void }): React.JSX.Element {
  return (
    <NavyStackTemplate title="Settings" onBack={onBack}>
      <PanelGroup label="Security">
        <Panel>
          <BaconText variant="label" align="left">
            Sessions
          </BaconText>
          <BaconButton onPress={() => undefined}>View All</BaconButton>
        </Panel>
        <Panel>
          <BaconText variant="label" align="left">
            Password
          </BaconText>
          <BaconButton onPress={() => undefined}>Update</BaconButton>
        </Panel>
      </PanelGroup>

      <PanelGroup label="Customization">
        <Panel>
          <BaconText variant="label" align="left">
            Currency
          </BaconText>
          <BaconText variant="meta" align="left">
            Philippine peso
          </BaconText>
        </Panel>
        <Panel>
          <BaconText variant="label" align="left">
            Categories
          </BaconText>
          <BaconText variant="meta" align="left">
            8 in use
          </BaconText>
        </Panel>
      </PanelGroup>

      <RowLink
        title="My Data"
        subtitle="Export everything Bacon holds"
        onPress={() => undefined}
      />
    </NavyStackTemplate>
  );
}
