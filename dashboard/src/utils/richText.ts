import isEmpty from 'lodash/isEmpty';

export const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const isRichTextEmpty = (value?: string | null) => !value || isEmpty(stripHtml(value));
