import {Button} from 'react-native-paper';
import {Grid} from '../../../shared/ui/Grid';
import {Answers} from '../model/types';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();

  if (!isAnswerShown) {
    return (
      <Button onPress={onAnswerShow} icon="eye">
        {t('show_answer')}
      </Button>
    );
  }

  return (
    <Grid justifyContent="space-between">
      <Button
        mode="contained"
        onPress={() => onAnswerPress(Answers.Incorrect)}
        icon="close-thick">
        {t('incorrect')}
      </Button>
      <Button
        contentStyle={styles.checkButtonContent}
        mode="contained"
        icon="check-bold"
        onPress={() => onAnswerPress(Answers.Correct)}>
        {t('correct')}
      </Button>
    </Grid>
  );
};
