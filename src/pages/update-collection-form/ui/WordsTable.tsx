import {DataTable} from 'react-native-paper';
import {
  CollectionItems,
  LearningCard,
  LearningType,
} from '../../../shared/model/collection';
import React, {useMemo} from 'react';
import {IconButton} from '../../../shared/ui/IconButton';
import {translate} from '../../../shared/lib/i18n';

type Props = {
  words: CollectionItems | undefined;
  onDelete: (card: LearningCard) => void;
};

export const WordsTable = ({words, onDelete}: Props) => {
  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(10);
  const learningCards = useMemo(
    () => Object.values(words || {}).flat(),
    [words],
  );

  if (!learningCards.length) {
    return null;
  }

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>{translate('primary_word')}</DataTable.Title>
        <DataTable.Title>Calories</DataTable.Title>
        <DataTable.Title>{''}</DataTable.Title>
      </DataTable.Header>

      {learningCards.map(item => (
        <DataTable.Row key={item.value + item.learningType}>
          <DataTable.Cell>
            {item.learningType === LearningType.Listening
              ? item.translation
              : item.value}
          </DataTable.Cell>
          <DataTable.Cell>{item.learningType}</DataTable.Cell>
          <DataTable.Cell>
            <IconButton icon="delete" onPress={() => onDelete(item)} />
          </DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(learningCards.length / itemsPerPage)}
        onPageChange={setPage}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
      />
    </DataTable>
  );
};
