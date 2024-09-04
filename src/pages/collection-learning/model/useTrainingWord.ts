import {useState, useMemo, useEffect} from 'react';
import {
  Collection,
  LearningCard,
  LearningType,
} from '../../../shared/model/collection';
import {fsrs, Rating} from 'ts-fsrs';
import {getFsrsRatingFromUserAnswer, getCardsToLearn} from '../lib/learning';
import {Answers} from './types';
import {setLearningVoice} from '../lib/sound';
import {showToastMessage} from '../../../shared/lib/message';
import {translate} from '../../../shared/lib/i18n';
import {appSettings} from '../../../shared/model/AppSettings';
import {ToastAndroid} from 'react-native';

export const useTrainingWord = (collection: Collection) => {
  const learingInstance = useMemo(() => fsrs(), []);
  const [isItFinal, setIsItFinal] = useState(false);
  const [learningCard, setCollectionItem] = useState<
    LearningCard | undefined
  >();
  const [timer, setTimer] = useState(Date.now());
  const [wordsToLearn, setWordsToLearn] = useState<LearningCard[]>([]);
  const [wordsCount, setWordsCount] = useState(0);
  const [statistics, setStat] = useState({
    [Rating.Easy]: 0,
    [Rating.Hard]: 0,
    [Rating.Good]: 0,
    [Rating.Again]: 0,
  });

  useEffect(() => {
    const supportedLearningTypes = collection.getProperty(
      'supportedLearningTypes',
    );
    const listOfCardsMappedToWordsToLearn = collection
      .getWordsToLearn()
      .slice(0, collection.getProperty('wordsToTrain'))
      .flat();

    const result = getCardsToLearn(
      listOfCardsMappedToWordsToLearn,
      supportedLearningTypes,
    ).sort(() => Math.random() - 0.5);

    setWordsToLearn(result);
    setCollectionItem(result[0]);
    setIsItFinal(!result[0]);
    setTimer(Date.now());

    if (
      supportedLearningTypes.includes(LearningType.Listening) &&
      !appSettings.getSetting('useExternalVoiceWhenAvailable')
    ) {
      setLearningVoice(collection.getLearningLanguage()).catch(e =>
        showToastMessage(
          translate('voice_is_not_set_message'),
          ToastAndroid.LONG,
        ),
      );
    }
  }, [collection]);

  const setNextTrainingWord = async (previousAnswer: Answers) => {
    let words = wordsToLearn;
    if ([Answers.Correct, Answers.Incorrect].includes(previousAnswer)) {
      const grade = getFsrsRatingFromUserAnswer(
        previousAnswer,
        Date.now() - timer,
        learningCard!.learningType,
        learningCard!.value,
      );

      // TODO: put this mutating inside Collection class
      learingInstance.next(
        learningCard!.fsrsCard,
        Date.now(),
        grade,
        ({card}) => {
          learningCard!.fsrsCard = card;
        },
      );

      setStat(prev => ({...prev, [grade]: prev[grade] + 1}));
    } else if (previousAnswer === Answers.Delete) {
      await collection
        .setCollectionItemForDeletion(learningCard as LearningCard)
        .saveCollection();

      words = words.filter(word => word.value !== learningCard!.value);
    } else if (previousAnswer === Answers.SkipListening) {
      words = wordsToLearn.filter(
        ({learningType}) => learningType !== LearningType.Listening,
      );
      setWordsToLearn(words);
    }

    const filteredWords = getCardsToLearn(
      words,
      collection.getProperty('supportedLearningTypes'),
    );
    setWordsCount(words.length - filteredWords.length);
    const nextWord = filteredWords[0];

    if (!nextWord) {
      setIsItFinal(true);

      if (wordsToLearn.length) {
        return collection.saveCollection();
      }
    }

    setCollectionItem(nextWord);
    setTimer(Date.now());
  };

  return {
    trainingWord: learningCard?.value,
    setNextTrainingWord,
    translation: learningCard?.translation,
    isItFinal,
    examples: learningCard?.examples,
    learningType: learningCard?.learningType,
    learningLanguage:
      collection.getProperty('learningLanguage') === 'source'
        ? collection.getProperty('sourceLanguage')
        : collection.getProperty('targetLanguage'),
    statistics,
    progress: wordsCount / wordsToLearn.length,
    sound: learningCard?.sound,
  };
};
