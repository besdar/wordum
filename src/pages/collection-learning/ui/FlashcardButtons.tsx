import {Button} from 'react-native-paper';
import {Grid} from '../../../shared/ui/Grid';
import {Answers} from '../model/types';
import React from 'react';
import {StyleSheet} from 'react-native';

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
        Show answer
      </Button>
    );
  }

  return (
    <Grid justifyContent="space-between">
      <Button
        mode="contained"
        onPress={() => onAnswerPress(Answers.Incorrect)}
        icon="close-thick">
        Incorrect
      </Button>
      <Button
        contentStyle={styles.checkButtonContent}
        mode="contained"
        icon="check-bold"
        onPress={() => onAnswerPress(Answers.Correct)}>
        Correct
      </Button>
    </Grid>
  );
};
