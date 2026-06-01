import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {translate} from '../../../shared/lib/i18n';
import {showConfirmationAlert} from '../../../shared/lib/message';
import {
  AppSupportedLanguages,
  LANGUAGE_FLAGS,
} from '../../../shared/model/lang';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {Grid} from '../../../shared/ui/Grid';
import {IconButton} from '../../../shared/ui/IconButton';
import {Answers} from '../model/types';

const styles = StyleSheet.create({
  correctAnswer: {
    flexShrink: 1,
  },
});

type Props = {
  onAnswerPress: (answer: Answers) => void;
  learningWord: string;
  learningLanguage: AppSupportedLanguages;
};

export const WritingFooter = ({
  onAnswerPress,
  learningWord,
  learningLanguage,
}: Props) => {
  const {control, handleSubmit, reset} = useForm({defaultValues: {answer: ''}});
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const goToNextWord = (answer: Answers) => {
    setShowCorrectAnswer(false);
    reset();

    return onAnswerPress(answer);
  };

  const submitAnswer = handleSubmit(({answer}) => {
    const learningWords = learningWord
      .toLocaleLowerCase()
      .split(',')
      .map(el => el.trim());

    const isCorrectAnswer = learningWords.includes(answer.trim().toLowerCase());

    if (!isCorrectAnswer) {
      setShowCorrectAnswer(true);

      return;
    }

    return goToNextWord(Answers.Correct);
  });

  if (showCorrectAnswer) {
    return (
      <Grid columnGap={5} justifyContent="space-between" alignItems="center">
        <Text style={styles.correctAnswer}>
          {translate('correct_answer')}: {learningWord}
        </Text>
        <IconButton
          accessibilityLabel={translate('skip')}
          icon="skip-next"
          onPress={() => goToNextWord(Answers.Incorrect)}
          mode="contained"
        />
      </Grid>
    );
  }

  return (
    <Grid columnGap={5}>
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
      <IconButton
        accessibilityLabel={translate('skip')}
        icon="skip-next"
        onPress={() => setShowCorrectAnswer(true)}
        mode="contained"
      />
      <ControlledTextInput
        label={`${translate('write_in')} ${LANGUAGE_FLAGS[learningLanguage]}`}
        name="answer"
        control={control}
        onSubmitEditing={submitAnswer}
        rules={{required: true}}
        autoComplete="off"
        autoCapitalize="none"
      />
      <IconButton
        accessibilityLabel={translate('proceed')}
        icon="check"
        mode="contained"
        onPress={submitAnswer}
      />
    </Grid>
  );
};
