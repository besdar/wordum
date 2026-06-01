import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {DataTable, Icon} from 'react-native-paper';
import {learningTypeToIconMap} from '../../../features/collection-form';
import {translate} from '../../../shared/lib/i18n';
import {LearningCard} from '../../../shared/model/collection';
import {IconButton} from '../../../shared/ui/IconButton';

const styles = StyleSheet.create({
  primaryWordColumn: {
    flex: 2,
  },
  learningTypeColumn: {
    flex: 1.4,
    justifyContent: 'center',
  },
  actionColumn: {
    flex: 0.6,
    justifyContent: 'flex-end',
  },
  centeredHeader: {
    textAlign: 'center',
  },
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

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title style={styles.primaryWordColumn}>
          {translate('primary_word')}
        </DataTable.Title>
        <DataTable.Title
          style={styles.learningTypeColumn}
          textStyle={styles.centeredHeader}
          numberOfLines={2}>
          {translate('types_of_exercises')}
        </DataTable.Title>
        <DataTable.Title style={styles.actionColumn}>{''}</DataTable.Title>
      </DataTable.Header>

      {learningCards.slice(from, to).map(item => {
        const isItemMarkAsDeleted = deletedCards.includes(item);

        return (
          <DataTable.Row key={item.value + item.learningType}>
            <DataTable.Cell
              style={styles.primaryWordColumn}
              textStyle={
                isItemMarkAsDeleted ? styles.strikethroughRow : undefined
              }>
              {item.value}
            </DataTable.Cell>
            <DataTable.Cell style={styles.learningTypeColumn}>
              <Icon
                size={20}
                source={learningTypeToIconMap[item.learningType]}
              />
            </DataTable.Cell>
            <DataTable.Cell style={styles.actionColumn}>
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
