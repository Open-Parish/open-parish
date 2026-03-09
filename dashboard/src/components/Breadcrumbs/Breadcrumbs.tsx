import { Breadcrumbs as MantineBreadcrumbs, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { BreadcrumbsProps } from './Breadcrumbs.types';

export function Breadcrumbs({ items }: Readonly<BreadcrumbsProps>) {
  return (
    <MantineBreadcrumbs>
      {items.map((item, index) =>
        item.path ? (
          <Text key={`${item.label}-${index}`} component={Link} to={item.path} size="sm" fw={500}>
            {item.label}
          </Text>
        ) : (
          <Text key={`${item.label}-${index}`} size="sm" c="dimmed">
            {item.label}
          </Text>
        ),
      )}
    </MantineBreadcrumbs>
  );
}
