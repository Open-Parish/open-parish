import { Combobox, Group, InputBase, Text, useCombobox } from '@mantine/core';
import { IconSelector } from '@tabler/icons-react';
import type { IconComboboxProps } from './IconCombobox.types';
import styles from './IconCombobox.module.css';

export function IconCombobox({ data, label, placeholder, value, onChange }: IconComboboxProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selectedOption = data.find((item) => item.value === (value ?? '')) ?? null;
  const displayLabel = selectedOption?.label ?? placeholder ?? 'Select icon';

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(optionValue) => {
        onChange(optionValue || null);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          label={label}
          className={styles.input}
          rightSection={<IconSelector size={16} />}
          onClick={() => combobox.toggleDropdown()}
        >
          <Group gap={0}>
            <span className={styles.optionIcon}>{selectedOption?.icon ?? <IconSelector size={16} />}</span>
            <Text size="sm">{displayLabel}</Text>
          </Group>
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {data.map((item) => (
            <Combobox.Option value={item.value} key={item.value}>
              <Group gap={0} className={styles.option}>
                <span className={styles.optionIcon}>{item.icon ?? <IconSelector size={16} />}</span>
                <Text size="sm">{item.label}</Text>
              </Group>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
