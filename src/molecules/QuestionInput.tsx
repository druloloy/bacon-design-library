import { useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextStyle,
} from 'react-native';
import { baconColors } from '../foundations/colors';
import { baconLayout } from '../foundations/layout';
import { baconSpacing } from '../foundations/spacing';
import { baconTypography, resolveFont } from '../foundations/typography';
import { BaconText } from '../atoms/BaconText';
import { useBaconSurface, useBaconTheme } from '../theme';

/**
 * The Bacon input.
 *
 * BRAND GUIDE REQUIREMENT (08): "No box, no placeholder-as-label, no helper row. A centred value
 * on a 2pt navy rule, with the question centred above it in Bold. That is the entire input."
 *
 * BRAND GUIDE REQUIREMENT (02): the label *is* a question, in the second person. There is no
 * `label` prop — `question` is required, and passing a bare noun is a copy review problem rather
 * than something the API will help you do.
 *
 * The component also has no `placeholder` prop: placeholder-as-label is named in the guide as a
 * pattern Bacon does not use.
 */
export interface QuestionInputProps {
  /** The question, in the second person. Also the field's accessibility label. */
  question: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
  maxLength?: number;
  /** Rendered between the question and the rule — used by QuickAmountInput for its chips. */
  children?: React.ReactNode;
  onSubmitEditing?: () => void;
  testID?: string;
}

export function QuestionInput({
  question,
  value,
  onChangeText,
  keyboardType,
  autoFocus,
  maxLength,
  children,
  onSubmitEditing,
  testID,
}: QuestionInputProps): React.JSX.Element {
  const theme = useBaconTheme();
  const surface = useBaconSurface();

  /**
   * TextInput cannot be a BaconText, so the role is resolved here from the same tokens rather
   * than restated. The value takes the documented body role at 400 — "Light title, Bold question,
   * Regular value".
   */
  const fieldStyle = useMemo<TextStyle>(() => {
    const role = baconTypography.body;
    return {
      ...resolveFont(role.weight, theme.fontStrategy, theme.fontFamilyMap),
      color: surface.text,
      fontSize: role.fontSize,
      lineHeight: role.fontSize * role.lineHeightRatio,
      textAlign: 'center',
      paddingVertical: baconSpacing.sm,
      // No border, no background: the rule below is the entire affordance.
    };
  }, [theme.fontStrategy, theme.fontFamilyMap, surface.text]);

  const ruleColor = surface.onColor ? baconColors.white : baconColors.navy900;

  return (
    <View testID={testID}>
      <BaconText variant="question" align="center">
        {question}
      </BaconText>

      <View style={styles.field}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={fieldStyle}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          maxLength={maxLength}
          onSubmitEditing={onSubmitEditing}
          // The question is the label. No placeholder stands in for it (Brand Guide 08).
          accessibilityLabel={question}
          selectionColor={ruleColor}
          underlineColorAndroid="transparent"
          testID="bacon-question-field"
        />
        <View
          style={[styles.rule, { backgroundColor: ruleColor }]}
          testID="bacon-question-rule"
        />
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginTop: baconSpacing.screen },
  rule: { height: baconLayout.inputRuleHeight, borderRadius: baconLayout.inputRuleHeight },
});
