import {Icon, ProgressBar, Text} from 'react-native-paper';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTrainingWord} from './model/useTrainingWord';
import {LearningType} from '../../shared/model/collection';
import {Grid} from '../../shared/ui/Grid';
import {Answers} from './model/types';
import {StyleSheet} from 'react-native';
import {FlashcardButtons} from './ui/FlashcardButtons';
import {FlashcardWrapper} from './ui/FlashcardWrapper';
import {WritingFooter} from './ui/WritingFooter';
import {playSound} from './lib/sound';
import {translate} from '../../shared/lib/i18n';
import {Button} from '../../shared/ui/Button';
import {PagesStackProps} from '../../shared/model/navigator';
import {FlashcardHeader} from './ui/FlashcardHeader';
import {AppSupportedLanguages} from '../../shared/model/lang';
import {appSettings} from '../../shared/model/AppSettings';
import Tts from 'react-native-tts';
import {CenteredActivityIndicator} from '../../shared/ui/CenteredActivityIndicator';
import {IconButton} from '../../shared/ui/IconButton';

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
  const [isAnswerShown, setAnswerShowing] = useState(false);

  const {
    trainingWord,
    setNextTrainingWord,
    translation,
    isItFinal,
    examples,
    learningType,
    learningLanguage,
    statistics,
    progress,
    sound,
  } = useTrainingWord(collection);

  const setNextWord = (answer: Answers) => {
    setNextTrainingWord(answer);
    setAnswerShowing(false);
  };

  if (isItFinal) {
    return (
      <Grid
        direction="column"
        fillAwailableSpace
        alignItems="center"
        justifyContent="center"
        rowGap={10}>
        <Icon source="check-circle-outline" size={100} color="green" />
        <Text>{translate('all_for_now')}</Text>
        <Button mode="outlined" onPress={() => navigation.goBack()}>
          {translate('finish')}
        </Button>
      </Grid>
    );
  }

  if (learningType === LearningType.Flascards) {
    return (
      <FlashcardWrapper
        header={<FlashcardHeader statistics={statistics} />}
        footer={
          <Grid direction="column" rowGap={5}>
            <FlashcardButtons
              onAnswerPress={setNextWord}
              onAnswerShow={() => setAnswerShowing(true)}
              isAnswerShown={isAnswerShown}
            />
            <ProgressBar visible progress={progress} />
          </Grid>
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
        header={<FlashcardHeader statistics={statistics} />}
        footer={
          <Grid direction="column" rowGap={5}>
            <WritingFooter
              onAnswerPress={setNextWord}
              learningWord={trainingWord as string}
              learningLanguage={learningLanguage as AppSupportedLanguages}
            />
            <ProgressBar visible progress={progress} />
          </Grid>
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
        header={<FlashcardHeader statistics={statistics} />}
        footer={
          <Grid direction="column" rowGap={5}>
            <WritingFooter
              onAnswerPress={setNextWord}
              learningWord={trainingWord as string}
              learningLanguage={learningLanguage as AppSupportedLanguages}
            />
            <ProgressBar visible progress={progress} />
          </Grid>
        }>
        <IconButton
          icon="volume-high"
          onPress={() =>
            appSettings.getSetting('useExternalVoiceWhenAvailable')
              ? playSound(sound as string)
              : Tts.speak(trainingWord as string)
          }
          size={100}
          noLoading
        />
        <Button
          onPress={() => setNextWord(Answers.SkipListening)}
          icon="volume-variant-off">
          {translate('no_audio_message')}
        </Button>
      </FlashcardWrapper>
    );
  }

  if (!trainingWord && !isItFinal) {
    return <CenteredActivityIndicator />;
  } else if (!trainingWord) {
    // not reachable
    return (
      <Grid
        direction="column"
        fillAwailableSpace
        alignItems="center"
        justifyContent="center"
        rowGap={10}>
        <Icon source="emoticon-neutral-outline" size={100} />
        <Text>{translate('nothing_to_learn')}</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddWordForm', {collection})}>
          {translate('add_word_to_this_collection')}
        </Button>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          {translate('return_back')}
        </Button>
      </Grid>
    );
  }

  return (
    <Grid
      direction="column"
      fillAwailableSpace
      alignItems="center"
      justifyContent="center"
      rowGap={10}>
      <Icon source="emoticon-dead-outline" size={100} color="red" />
      <Text>{translate('something_went_wrong')}</Text>
      <Button mode="outlined" onPress={() => navigation.goBack()}>
        {translate('return_back')}
      </Button>
    </Grid>
  );
};
