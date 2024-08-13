import {Button, Icon, IconButton, Text} from 'react-native-paper';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTrainingWord} from './model/useTrainingWord';
import {LearningType, PagesStackProps} from '../../shared/model/types';
import {Grid} from '../../shared/ui/Grid';
import {Answers} from './model/types';
import {StyleSheet} from 'react-native';
import {FlashcardButtons} from './ui/FlashcardButtons';
import {FlashcardWrapper} from './ui/FlashcardWrapper';
import {WritingLearning} from './ui/WritingLearning';
import {playSound} from './lib/sound';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
  checkButtonContent: {
    flexDirection: 'row-reverse',
  },
  wordText: {
    textAlign: 'center',
  },
});

export const CollectionLearning = ({
  route: {
    params: {collection},
  },
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'CollectionLearning'>) => {
  const {t} = useTranslation();
  const [isAnswerShown, setAnswerShowing] = useState(false);

  const {
    trainingWord,
    setNextTrainingWord,
    translation,
    isItFinal,
    examples,
    learningType,
    learningLanguage,
  } = useTrainingWord(collection);

  if (isItFinal) {
    return (
      <Grid
        direction="column"
        fillAwailableSpace
        alignItems="center"
        justifyContent="center"
        rowGap={10}>
        <Icon source="check-circle-outline" size={100} color="green" />
        <Text>{t('all_for_now')}</Text>
        <Button mode="outlined" onPress={() => navigation.goBack()}>
          {t('finish')}
        </Button>
      </Grid>
    );
  }

  const setNextWord = (answer: Answers) => {
    setNextTrainingWord(answer);
    setAnswerShowing(false);
  };

  if (learningType === LearningType.Flascards) {
    return (
      <FlashcardWrapper
        footer={
          <FlashcardButtons
            onAnswerPress={setNextWord}
            onAnswerShow={() => setAnswerShowing(true)}
            isAnswerShown={isAnswerShown}
          />
        }>
        <Text variant="displayMedium" style={styles.wordText}>
          {trainingWord}
        </Text>
        {isAnswerShown && (
          <Text
            variant="displayMedium"
            style={styles.wordText}
            textBreakStrategy="balanced">
            {translation}
          </Text>
        )}
        {isAnswerShown && Boolean(examples) && (
          <Text textBreakStrategy="balanced" style={styles.wordText}>
            {examples}
          </Text>
        )}
      </FlashcardWrapper>
    );
  }

  if (learningType === LearningType.Writing) {
    return (
      <FlashcardWrapper
        footer={
          <WritingLearning
            onAnswerPress={setNextWord}
            learningWord={trainingWord as string}
            learningLanguage={learningLanguage as string}
          />
        }>
        <Text variant="displayMedium" style={styles.wordText}>
          {translation}
        </Text>
      </FlashcardWrapper>
    );
  }

  if (learningType === LearningType.Listening) {
    return (
      <FlashcardWrapper
        footer={
          <WritingLearning
            onAnswerPress={setNextWord}
            learningWord={translation as string}
            learningLanguage={learningLanguage as string}
          />
        }>
        <IconButton
          icon="volume-high"
          onPress={() => playSound(trainingWord as string)}
          size={100}
        />
        <Button
          onPress={() => setNextWord(Answers.SkipListening)}
          icon="volume-variant-off">
          {t('no_audio_message')}
        </Button>
      </FlashcardWrapper>
    );
  }

  return (
    <Grid
      direction="column"
      fillAwailableSpace
      alignItems="center"
      justifyContent="center"
      rowGap={10}>
      <Icon source="emoticon-sad-outline" size={100} color="red" />
      <Text>{t('something_went_wrong')}</Text>
      <Button mode="outlined" onPress={() => navigation.goBack()}>
        {t('return_back')}
      </Button>
    </Grid>
  );
};
