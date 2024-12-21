"use client";

import { memo, useCallback, useEffect, useState } from "react";
import Checkbox from "./Checkbox";
import { cn } from "@/config/utils";
import Accordion from "./Accordion";

interface DataFilter {
  key: string;
  label: string;
  options: {
    value: BaseValueInputType;
    name: string;
    isChecked?: boolean;
  }[];
}

interface FilterProps {
  data: DataFilter[];
  className?: string;
  onChange?: (filter: { [key: string]: BaseValueInputType[] }) => void;
}

const Filter = ({ data, className, onChange }: FilterProps) => {
  const [filters, setFilters] = useState<DataFilter[]>(data);
  const [selectedFilter, setSelectedFilter] = useState<{
    [key: string]: BaseValueInputType[];
  }>({});

  const handleFilterChange = (
    checkedItems: BaseValueInputType[],
    key: string
  ) => {
    const newFilter = { ...selectedFilter, [key]: checkedItems };
    onChange?.(newFilter);
    setSelectedFilter(newFilter);
  };

  useEffect(() => {
    setFilters(data);
  }, [data]);

  return (
    <div className={cn(className)}>
      {filters.map((filterItem, index) => (
        <FilterItem
          key={index}
          filter={filterItem}
          onChange={handleFilterChange}
        />
      ))}
    </div>
  );
};

export default memo(Filter);

interface FilterItemProps {
  filter: DataFilter;
  onChange: (checkedItems: BaseValueInputType[], key: string) => void;
}

const FilterItem = ({ filter, onChange }: FilterItemProps) => {
  const [checkedItems, setCheckedItems] = useState<BaseValueInputType[]>([]);

  const handleCheckboxChange = (
    checkedKey: BaseValueInputType,
    isChecked: boolean
  ) => {
    const updatedCheckedItems = isChecked
      ? [...checkedItems, checkedKey]
      : checkedItems.filter((item) => item !== checkedKey);

    setCheckedItems(updatedCheckedItems);
    onChange(updatedCheckedItems, filter.key);
  };

  return (
    <Accordion
      headerTitle={filter.label}
      className="border-b border-primary-100"
    >
      {filter.options.map((item, index) => (
        <Checkbox
          key={`${index}${item.value}`}
          label={item.name}
          defaultChecked={item.isChecked || false}
          onChange={(isChecked: boolean) =>
            handleCheckboxChange(item.value, isChecked)
          }
        />
      ))}
    </Accordion>
  );
};
