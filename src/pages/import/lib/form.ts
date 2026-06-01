import * as DocumentPicker from 'expo-document-picker';
import {File} from 'expo-file-system';
import {createEmptyCard} from 'ts-fsrs';
import {translate} from '../../../shared/lib/i18n';
import {showConfirmationAlert} from '../../../shared/lib/message';
import {
  Collection,
  CollectionFormFields,
  CollectionType,
} from '../../../shared/model/collection';
import {LearningType} from '../../../shared/model/learningType';
import {restructureOldCollection} from '../../../shared/model/restructure';

export const validateTextForTheImport = (value: string) => {
  const lines = value.toString().split('\n').filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().split(';');
    const isLineOk = line.length <= 3 && line.length > 0;

    if (!isLineOk) {
      return `${translate('import_line_error_message')} ${i + 1}`;
    }
  }

  return true;
};

const fixCollectionObjectFromFileAndImport = (
  versions: number[],
  collectionData: CollectionType,
) => {
  restructureOldCollection(collectionData, {
    major: versions[0],
    middle: versions[1],
    minor: versions[2],
  });

  collectionData.id = '';
  const dataEntries = Object.entries(collectionData);
  const wordsKeys = Object.keys(collectionData.words);

  for (const wordKey of wordsKeys) {
    for (const learningCard of collectionData.words[wordKey]) {
      learningCard.fsrsCard = createEmptyCard();
      learningCard.wordId = wordKey;
      learningCard.learningType =
        learningCard.learningType || LearningType.Flascards;
    }
  }

  const collection = new Collection(collectionData);
  const collectionObject = collection.dangerouslyGetInnerObject();
  const isCollectionOk =
    dataEntries.every(
      ([key, value]) =>
        typeof collectionObject[key as keyof CollectionFormFields] ===
        typeof value,
    ) &&
    wordsKeys.every(wordKey =>
      collectionObject.words[wordKey].every(
        learningCard =>
          Boolean(learningCard.value) && Boolean(learningCard.translation),
      ),
    );

  if (!isCollectionOk) {
    throw new Error();
  }

  return collection.saveCollection();
};

export const importCollectionFromFile = (version: string) =>
  showConfirmationAlert(
    translate('collection_import'),
    translate('import_collection_from_a_file_message'),
    translate('proceed'),
  )
    .then(() =>
      DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      }),
    )
    .then(result => {
      if (result.canceled || !result.assets.length) {
        throw new Error();
      }

      return new File(result.assets[0].uri).text();
    })
    .then(jsonString => JSON.parse(jsonString) as CollectionType | string[])
    .then((collectionData): Promise<Collection | Collection[]> => {
      const versions = version.split('.').map(Number);

      if (Array.isArray(collectionData)) {
        const filteredCollections: CollectionType[] = collectionData
          .map(collection => {
            try {
              const parsedCollection = JSON.parse(collection);

              return parsedCollection;
            } catch {}

            return undefined;
          })
          .filter(Boolean);

        return Promise.all(
          filteredCollections.map(collection =>
            fixCollectionObjectFromFileAndImport(versions, collection),
          ),
        );
      }

      return fixCollectionObjectFromFileAndImport(versions, collectionData);
    });
