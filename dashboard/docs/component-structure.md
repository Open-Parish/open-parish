# Component structure

Each component (shared or page-level) lives in its own folder, with a dedicated component file and `types.ts` for props and shared types. Styling lives in a colocated CSS module and any dynamic CSS vars go in a small `styles.ts` helper.

## Conventions

- Component file: `.../<Component>/<Component>.tsx`
- Types file: `.../<Component>/<Component>.types.ts`
- CSS module: `.../<Component>/<Component>.module.css`
- Styles helper (when needed): `.../<Component>/<Component>.styles.ts`
- Imports prefer `.../<Component>/<Component>` and `.../<Component>/<Component>.types`
- For smaller subcomponents (menus, list items), still split props into `<Component>.types.ts`
- Move non-trivial event handlers and selection logic into named functions above JSX

## When creating a component

1. Create a new folder named after the component in the appropriate `components` directory.
2. Put the component implementation in `<Component>.tsx`.
3. Move props/types into `<Component>.types.ts`.
4. Move inline styles into `<Component>.module.css`.
5. If styles need theme-driven values, create `<Component>.styles.ts` and pass CSS variables via `style`.

## Example

```
src/components/Badge/Badge.tsx
src/components/Badge/Badge.types.ts
src/components/Badge/Badge.module.css
src/components/Badge/Badge.styles.ts
```

```tsx
import type { BadgeProps } from './Badge.types';
import { getBadgeStyleVars } from './Badge.styles';
import styles from './Badge.module.css';

export function Badge({ tone }: BadgeProps) {
  const styleVars = getBadgeStyleVars({ tone });
  return (
    <span className={styles.badge} style={styleVars}>
      {tone}
    </span>
  );
}
```

## Current shared components

- `src/components/Breadcrumbs/Breadcrumbs.tsx`
- `src/components/ConfirmDeleteModal/ConfirmDeleteModal.tsx`
- `src/components/PageShell/PageShell.tsx`
- `src/components/QueryState/QueryState.tsx`
- `src/components/Sidebar/Sidebar.tsx`
- `src/components/Topbar/Topbar.tsx`
