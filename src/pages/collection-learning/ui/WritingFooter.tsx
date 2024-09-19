import {Text} from 'react-native-paper';
import {Grid} from '../../../shared/ui/Grid';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {useForm} from 'react-hook-form';
import React, {useState} from 'react';
import {Answers} from '../model/types';
import {translate} from '../../../shared/lib/i18n';
import {
  AppSupportedLanguages,
  LANGUAGE_FLAGS,
} from '../../../shared/model/lang';
import {showConfirmationAlert} from '../../../shared/lib/message';
import {IconButton} from '../../../shared/ui/IconButton';

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
        <Text style={{flexShrink: 1}}>
          {translate('correct_answer')}: {learningWord}
        </Text>
        <IconButton
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
      <IconButton icon="check" mode="contained" onPress={submitAnswer} />
    </Grid>
  );
};
