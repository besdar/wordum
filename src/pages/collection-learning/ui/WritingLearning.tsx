import {IconButton} from 'react-native-paper';
import {Grid} from '../../../shared/ui/Grid';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {useForm} from 'react-hook-form';
import React from 'react';
import {Answers} from '../model/types';
import {translate} from '../../../shared/lib/i18n';

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
  const {control, handleSubmit, reset} = useForm({defaultValues: {answer: ''}});
  const submitAnswer = handleSubmit(({answer}) => {
    onAnswerPress(
      answer.trim().toLowerCase() === learningWord.toLowerCase()
        ? Answers.Correct
        : Answers.Incorrect,
    );
    reset();
  });

  return (
    <Grid columnGap={5}>
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
