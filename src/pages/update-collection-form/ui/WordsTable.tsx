import {DataTable, Icon} from 'react-native-paper';
import {LearningCard} from '../../../shared/model/collection';
import React, {useState} from 'react';
import {IconButton} from '../../../shared/ui/IconButton';
import {translate} from '../../../shared/lib/i18n';
import {StyleSheet} from 'react-native';
import {learningTypeToIconMap} from '../model/learningTypeToIconMap';

const styles = StyleSheet.create({
  strikethroughRow: {
    textDecorationLine: 'line-through',
  },
});

type Props = {
  learningCards: LearningCard[];
  onDelete: (card: LearningCard) => void;
};

export const WordsTable = ({learningCards, onDelete}: Props) => {
  const [page, setPage] = useState<number>(0);
  const [deletedCards, setCardToBeDeleted] = useState<LearningCard[]>([]);

  if (!learningCards.length) {
    return null;
  }

  const itemsPerPage = 10;
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, learningCards.length);

  // TODO: fix table's columns alignments
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>{translate('primary_word')}</DataTable.Title>
        <DataTable.Title>{translate('types_of_exercises')}</DataTable.Title>
        <DataTable.Title>{''}</DataTable.Title>
      </DataTable.Header>

      {learningCards.slice(from, to).map(item => {
        const isItemMarkAsDeleted = deletedCards.includes(item);

        return (
          <DataTable.Row key={item.value + item.learningType}>
            <DataTable.Cell
              textStyle={
                isItemMarkAsDeleted ? styles.strikethroughRow : undefined
              }>
              {item.value}
            </DataTable.Cell>
            <DataTable.Cell>
              <Icon
                size={20}
                source={learningTypeToIconMap[item.learningType]}
              />
            </DataTable.Cell>
            <DataTable.Cell>
              <IconButton
                disabled={isItemMarkAsDeleted}
                icon="delete"
                onPress={() => {
                  onDelete(item);
                  setCardToBeDeleted(prev => [...prev, item]);
                }}
              />
            </DataTable.Cell>
          </DataTable.Row>
        );
      })}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(learningCards.length / itemsPerPage)}
        onPageChange={setPage}
        numberOfItemsPerPage={itemsPerPage}
        showFastPaginationControls
      />
    </DataTable>
  );
};
