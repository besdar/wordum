import {IconButton} from 'react-native-paper';
import {Grid} from '../../../shared/ui/Grid';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {useForm} from 'react-hook-form';
import React from 'react';
import {Answers} from '../model/types';

type Props = {
  onAnswerPress: (answer: Answers) => void;
  learningWord: string;
  learningLanguage: string;
};

export const WritingLearning = ({
  onAnswerPress,
  learningWord,
  learningLanguage,
}: Props) => {
  const {control, handleSubmit} = useForm({defaultValues: {answer: ''}});
  const submitAnswer = handleSubmit(({answer}) =>
    onAnswerPress(
      answer.toLowerCase() === learningWord.toLowerCase()
        ? Answers.Correct
        : Answers.Incorrect,
    ),
  );

  return (
    <Grid columnGap={5}>
      <IconButton
        icon="skip-next"
        onPress={() => onAnswerPress(Answers.Incorrect)}
        mode="contained"
      />
      <ControlledTextInput
        label={`Write in ${learningLanguage}`}
        name="answer"
        control={control}
        onSubmitEditing={submitAnswer}
        rules={{required: true}}
        viewProps={{style: {flexGrow: 1}}}
      />
      <IconButton icon="check" mode="contained" onPress={submitAnswer} />
    </Grid>
  );
};
