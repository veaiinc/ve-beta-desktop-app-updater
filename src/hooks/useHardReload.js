import { useEffect } from 'react';

const useHardReload = (duration = 15000) => {
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			window.location.reload(true);
		}, duration);
		return () => clearTimeout(timeoutId);
	}, []);
};

export default useHardReload;
