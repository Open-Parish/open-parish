import isString from 'lodash/isString';
import type { ClassValue } from './cx.types';

export const cx = (...values: ClassValue[]) => {
  const classes: string[] = [];
  values.forEach((value) => {
    if (!value) return;
    if (isString(value)) {
      classes.push(value);
      return;
    }
    Object.entries(value).forEach(([key, enabled]) => {
      if (enabled) classes.push(key);
    });
  });
  return classes.join(' ');
};
