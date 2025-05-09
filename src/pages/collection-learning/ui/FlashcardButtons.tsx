import {Grid} from '../../../shared/ui/Grid';
import {Answers} from '../model/types';
import React from 'react';
import {StyleSheet} from 'react-native';
import {translate} from '../../../shared/lib/i18n';
import {Button} from '../../../shared/ui/Button';
import {IconButton} from '../../../shared/ui/IconButton';
import {showConfirmationAlert} from '../../../shared/lib/message';

const styles = StyleSheet.create({
  checkButtonContent: {
    flexDirection: 'row-reverse',
  },
});

type Props = {
  onAnswerPress: (answer: Answers) => void;
  onAnswerShow: () => void;
  isAnswerShown: boolean;
};

export const FlashcardButtons = ({
  onAnswerPress,
  onAnswerShow,
  isAnswerShown,
}: Props) => {
  if (!isAnswerShown) {
    return (
      <Button onPress={onAnswerShow} icon="eye">
        {translate('show_answer')}
      </Button>
    );
  }

  return (
    <Grid justifyContent="space-between" alignItems="center">
      <Button
        mode="contained"
        onPress={() => onAnswerPress(Answers.Incorrect)}
        icon="close-thick">
        {translate('incorrect')}
      </Button>
      <IconButton
        accessibilityLabel={translate('card_deletion')}
        mode="contained"
        icon="delete"
        onPress={() =>
          showConfirmationAlert(
            translate('card_deletion'),
            translate('card_deletion_message'),
            translate('yes'),
          ).then(() => onAnswerPress(Answers.Delete))
        }
      />
      <Button
        contentStyle={styles.checkButtonContent}
        mode="contained"
        icon="check-bold"
        onPress={() => onAnswerPress(Answers.Correct)}>
        {translate('correct')}
      </Button>
    </Grid>
  );
};
