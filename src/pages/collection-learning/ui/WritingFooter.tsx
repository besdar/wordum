import {IconButton, Text} from 'react-native-paper';
import {Grid} from '../../../shared/ui/Grid';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {useForm} from 'react-hook-form';
import React, {useState} from 'react';
import {Answers} from '../model/types';
import {translate} from '../../../shared/lib/i18n';

type Props = {
  onAnswerPress: (answer: Answers) => void;
  learningWord: string;
  learningLanguage: string;
};

export const WritingFooter = ({
  onAnswerPress,
  learningWord,
  learningLanguage,
}: Props) => {
  const {control, handleSubmit, reset} = useForm({defaultValues: {answer: ''}});
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const goToNextWord = (answer: Answers) => {
    reset();
    setShowCorrectAnswer(false);

    return onAnswerPress(answer);
  };

  const submitAnswer = () =>
    handleSubmit(({answer}) => {
      const isCorrectAnswer =
        answer.trim().toLowerCase() === learningWord.toLowerCase();

      if (!isCorrectAnswer) {
        setShowCorrectAnswer(true);

        return;
      }

      return goToNextWord(Answers.Correct);
    });

  if (showCorrectAnswer) {
    return (
      <Grid columnGap={5} justifyContent="space-between">
        <Grid direction="column" columnGap={5}>
          <Text>{translate('correct_answer')}</Text>
          <Text>{learningWord}</Text>
        </Grid>
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
        onPress={() => onAnswerPress(Answers.Delete)}
      />
      <IconButton
        icon="skip-next"
        onPress={() => onAnswerPress(Answers.Incorrect)}
        mode="contained"
      />
      <ControlledTextInput
        label={`${translate('write_in')} ${learningLanguage}`}
        name="answer"
        control={control}
        onSubmitEditing={submitAnswer}
        rules={{required: true}}
        viewProps={{style: {flexGrow: 1}}}
        autoComplete="off"
        autoCapitalize="none"
      />
      <IconButton icon="check" mode="contained" onPress={submitAnswer} />
    </Grid>
  );
};
