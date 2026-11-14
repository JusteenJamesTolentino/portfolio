import { useEffect, useState } from 'react';

const DESKTOP_QUERY = '(min-width: 1024px)';

function useOsViewEligibility() {
  const [eligible, setEligible] = useState(() => (
    typeof window === 'undefined' ? false : window.matchMedia(DESKTOP_QUERY).matches
  ));

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const update = event => setEligible(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return eligible;
}

export default useOsViewEligibility;
