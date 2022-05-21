import { useParams } from 'react-router-dom';

export default function usePageEstateType() {
  const { estateType } = useParams();
  return estateType;
}
