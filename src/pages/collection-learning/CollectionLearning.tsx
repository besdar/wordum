import {ActivityIndicator, Button, Icon, Text} from 'react-native-paper';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTrainingWord} from './model/useTrainingWord';
import {PagesStackProps} from '../../shared/model/types';
import {Grid} from '../../shared/ui/Grid';
import {Answers} from './model/types';
import {StyleSheet} from 'react-native';
import {FlashcardButtons} from './ui/FlashcardButtons';
import {FlashcardContainer} from './ui/FlashcardContainer';

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
    params: {collectionId},
  },
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'CollectionLearning'>) => {
  const [isAnswerShown, setAnswerShowing] = useState(false);

  const {
    trainingWord,
    setNextTrainingWord,
    translation,
    isItFinal,
    isLoading,
    examples,
  } = useTrainingWord(collectionId);

  if (isLoading) {
    return <ActivityIndicator animating />;
  } else if (isItFinal) {
    return (
      <Grid
        direction="column"
        fillAwailableSpace
        alignItems="center"
        justifyContent="center"
        rowGap={10}>
        <Icon source="check-circle-outline" size={100} color="green" />
        <Text>That's all for now</Text>
        <Button mode="outlined" onPress={() => navigation.goBack()}>
          Finish
        </Button>
      </Grid>
    );
  } else if (!trainingWord) {
    return (
      <Grid
        direction="column"
        fillAwailableSpace
        alignItems="center"
        justifyContent="center"
        rowGap={10}>
        <Icon source="emoticon-sad-outline" size={100} color="red" />
        <Text>Something went wrong</Text>
        <Button mode="outlined" onPress={() => navigation.goBack()}>
          Return back
        </Button>
      </Grid>
    );
  }

  const setNextWord = (answer: Answers) => {
    setNextTrainingWord(answer);
    setAnswerShowing(false);
  };

  return (
    <Grid direction="column" fillAwailableSpace rowGap={20}>
      <FlashcardContainer>
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
      </FlashcardContainer>
      <Grid alignItems="center" justifyContent="center">
        <FlashcardButtons
          onAnswerPress={setNextWord}
          onAnswerShow={() => setAnswerShowing(true)}
          isAnswerShown={isAnswerShown}
        />
      </Grid>
    </Grid>
  );
};
