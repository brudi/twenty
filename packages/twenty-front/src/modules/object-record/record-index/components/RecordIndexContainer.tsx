import { useState } from 'react';
import styled from '@emotion/styled';
import { useSetRecoilState } from 'recoil';

import { useColumnDefinitionsFromFieldMetadata } from '@/object-metadata/hooks/useColumnDefinitionsFromFieldMetadata';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectNameSingularFromPlural } from '@/object-metadata/hooks/useObjectNameSingularFromPlural';
import { RecordIndexBoardContainer } from '@/object-record/record-index/components/RecordIndexBoardContainer';
import { RecordIndexBoardContainerEffect } from '@/object-record/record-index/components/RecordIndexBoardContainerEffect';
import { RecordIndexTableContainer } from '@/object-record/record-index/components/RecordIndexTableContainer';
import { RecordIndexTableContainerEffect } from '@/object-record/record-index/components/RecordIndexTableContainerEffect';
import { RecordIndexViewBarEffect } from '@/object-record/record-index/components/RecordIndexViewBarEffect';
import { RecordIndexOptionsDropdown } from '@/object-record/record-index/options/components/RecordIndexOptionsDropdown';
import { RECORD_INDEX_OPTIONS_DROPDOWN_ID } from '@/object-record/record-index/options/constants/RecordIndexOptionsDropdownId';
import { recordIndexFieldDefinitionsState } from '@/object-record/record-index/states/recordIndexFieldDefinitionsState';
import { recordIndexFiltersState } from '@/object-record/record-index/states/recordIndexFiltersState';
import { recordIndexSortsState } from '@/object-record/record-index/states/recordIndexSortsState';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { SpreadsheetImportProvider } from '@/spreadsheet-import/provider/components/SpreadsheetImportProvider';
import { ViewBar } from '@/views/components/ViewBar';
import { ViewType } from '@/views/types/ViewType';
import { mapViewFieldsToColumnDefinitions } from '@/views/utils/mapViewFieldsToColumnDefinitions';
import { mapViewFiltersToFilters } from '@/views/utils/mapViewFiltersToFilters';
import { mapViewSortsToSorts } from '@/views/utils/mapViewSortsToSorts';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
  padding-left: ${({ theme }) => theme.table.horizontalCellPadding};
`;

type RecordIndexContainerProps = {
  recordIndexId: string;
  objectNamePlural: string;
  createRecord: () => Promise<void>;
};

export const RecordIndexContainer = ({
  createRecord,
  recordIndexId,
  objectNamePlural,
}: RecordIndexContainerProps) => {
  const [recordIndexViewType, setRecordIndexViewType] = useState<
    ViewType | undefined
  >(undefined);

  const { objectNameSingular } = useObjectNameSingularFromPlural({
    objectNamePlural,
  });

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { columnDefinitions } =
    useColumnDefinitionsFromFieldMetadata(objectMetadataItem);

  const setRecordIndexFieldDefinitions = useSetRecoilState(
    recordIndexFieldDefinitionsState,
  );
  const setRecordIndexFilters = useSetRecoilState(recordIndexFiltersState);
  const setRecordIndexSorts = useSetRecoilState(recordIndexSortsState);

  const { setTableFilters, setTableSorts, setTableColumns } = useRecordTable({
    recordTableId: recordIndexId,
  });

  return (
    <StyledContainer>
      <SpreadsheetImportProvider>
        <ViewBar
          viewBarId={recordIndexId}
          optionsDropdownButton={
            <RecordIndexOptionsDropdown
              recordIndexId={recordIndexId}
              objectNameSingular={objectNameSingular}
              viewType={recordIndexViewType ?? ViewType.Table}
            />
          }
          optionsDropdownScopeId={RECORD_INDEX_OPTIONS_DROPDOWN_ID}
          onViewFieldsChange={(viewFields) => {
            setTableColumns(
              mapViewFieldsToColumnDefinitions(viewFields, columnDefinitions),
            );
            setRecordIndexFieldDefinitions(
              mapViewFieldsToColumnDefinitions(viewFields, columnDefinitions),
            );
          }}
          onViewFiltersChange={(viewFilters) => {
            setTableFilters(mapViewFiltersToFilters(viewFilters));
            setRecordIndexFilters(mapViewFiltersToFilters(viewFilters));
          }}
          onViewSortsChange={(viewSorts) => {
            setTableSorts(mapViewSortsToSorts(viewSorts));
            setRecordIndexSorts(mapViewSortsToSorts(viewSorts));
          }}
          onViewTypeChange={(viewType: ViewType) => {
            setRecordIndexViewType(viewType);
          }}
        />
        <RecordIndexViewBarEffect
          objectNamePlural={objectNamePlural}
          viewBarId={recordIndexId}
        />
      </SpreadsheetImportProvider>
      {recordIndexViewType === ViewType.Table && (
        <>
          <RecordIndexTableContainer
            recordTableId={recordIndexId}
            viewBarId={recordIndexId}
            objectNameSingular={objectNameSingular}
            createRecord={createRecord}
          />
          <RecordIndexTableContainerEffect
            objectNameSingular={objectNameSingular}
            recordTableId={recordIndexId}
            viewBarId={recordIndexId}
          />
        </>
      )}
      {recordIndexViewType === ViewType.Kanban && (
        <>
          <RecordIndexBoardContainer
            recordBoardId={recordIndexId}
            viewBarId={recordIndexId}
            objectNameSingular={objectNameSingular}
            createRecord={createRecord}
          />
          <RecordIndexBoardContainerEffect
            objectNameSingular={objectNameSingular}
            recordBoardId={recordIndexId}
            viewBarId={recordIndexId}
          />
        </>
      )}
    </StyledContainer>
  );
};
