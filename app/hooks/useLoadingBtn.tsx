import { useState } from 'react';

export default function useLoadingBtn() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
