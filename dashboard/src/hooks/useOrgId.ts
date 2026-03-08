import { useParams } from 'react-router-dom';

export function useOrgId(): string {
  const { orgId } = useParams();
  if (!orgId) {
    throw new Error('orgId route param is required');
  }
  return orgId;
}
