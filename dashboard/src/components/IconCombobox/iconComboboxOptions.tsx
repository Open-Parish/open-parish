import type { IconComboboxOption } from './IconCombobox.types';
import {
  IconAlertTriangle,
  IconBook,
  IconBulb,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  IconMinus,
  IconQuestionMark,
  IconStar,
} from '@tabler/icons-react';

export const defaultIconOptions: IconComboboxOption[] = [
  { value: '', label: 'No icon', icon: <IconMinus size={16} /> },
  { value: 'info', label: 'Info', icon: <IconInfoCircle size={16} /> },
  { value: 'warning', label: 'Warning', icon: <IconAlertTriangle size={16} /> },
  { value: 'tip', label: 'Tip', icon: <IconBulb size={16} /> },
  { value: 'note', label: 'Note', icon: <IconBook size={16} /> },
  { value: 'check', label: 'Check', icon: <IconCircleCheck size={16} /> },
  { value: 'cross', label: 'Cross', icon: <IconCircleX size={16} /> },
  { value: 'question', label: 'Question', icon: <IconQuestionMark size={16} /> },
  { value: 'star', label: 'Star', icon: <IconStar size={16} /> },
];
