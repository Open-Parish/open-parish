import { useParams } from 'react-router-dom';

export function useRequiredParam(name: string): string {
  const params = useParams();
  const value = params[name];
  if (!value) {
    throw new Error(`${name} route param is required`);
  }

  return value;
}
