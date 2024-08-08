import {ActivityIndicator, Button, Icon, Text} from 'react-native-paper';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTrainingWord} from './model/useTrainingWord';
import {PagesStackProps} from '../../shared/model/types';
import {Grid} from '../../shared/ui/Grid';
import {Answers} from './model/types';
import {StyleSheet} from 'react-native';

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
      <Grid
        direction="column"
        rowGap={10}
        fillAwailableSpace
        alignItems="center"
        justifyContent="center"
        surfaceProps={{style: {borderRadius: 10}}}>
        <Text variant="displayMedium" style={styles.wordText}>
          {trainingWord}
        </Text>
        <Text
          variant="displayMedium"
          style={{
            display: isAnswerShown ? undefined : 'none',
            textAlign: 'center',
          }}
          textBreakStrategy="balanced">
          {translation}
        </Text>
        <Text
          textBreakStrategy="balanced"
          style={{
            display: isAnswerShown && examples ? undefined : 'none',
            textAlign: 'center',
          }}>
          {examples}
        </Text>
      </Grid>
      <Grid alignItems="center" justifyContent="center">
        {!isAnswerShown ? (
          <Button onPress={() => setAnswerShowing(true)} icon="eye">
            Show answer
          </Button>
        ) : (
          <Grid justifyContent="space-between">
            <Button
              mode="contained"
              onPress={() => setNextWord(Answers.Incorrect)}
              icon="close-thick">
              Incorrect
            </Button>
            <Button
              contentStyle={styles.checkButtonContent}
              mode="contained"
              icon="check-bold"
              onPress={() => setNextWord(Answers.Correct)}>
              Correct
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
