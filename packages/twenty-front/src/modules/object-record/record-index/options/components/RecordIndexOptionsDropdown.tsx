import { RecordIndexOptionsDropdownButton } from '@/object-record/record-index/options/components/RecordIndexOptionsDropdownButton';
import { RecordIndexOptionsDropdownContent } from '@/object-record/record-index/options/components/RecordIndexOptionsDropdownContent';
import { RECORD_INDEX_OPTIONS_DROPDOWN_ID } from '@/object-record/record-index/options/constants/RecordIndexOptionsDropdownId';
import { TableOptionsHotkeyScope } from '@/object-record/record-table/types/TableOptionsHotkeyScope';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { useViewBar } from '@/views/hooks/useViewBar';
import { ViewType } from '@/views/types/ViewType';

type RecordIndexOptionsDropdownProps = {
  viewType: ViewType;
  objectNameSingular: string;
  recordIndexId: string;
};

export const RecordIndexOptionsDropdown = ({
  recordIndexId,
  objectNameSingular,
  viewType,
}: RecordIndexOptionsDropdownProps) => {
  const { setViewEditMode } = useViewBar();

  return (
    <Dropdown
      dropdownId={RECORD_INDEX_OPTIONS_DROPDOWN_ID}
      clickableComponent={<RecordIndexOptionsDropdownButton />}
      dropdownHotkeyScope={{ scope: TableOptionsHotkeyScope.Dropdown }}
      dropdownOffset={{ y: 8 }}
      dropdownComponents={
        <RecordIndexOptionsDropdownContent
          viewType={viewType}
          objectNameSingular={objectNameSingular}
          recordIndexId={recordIndexId}
        />
      }
      onClickOutside={() => setViewEditMode('none')}
    />
  );
};
