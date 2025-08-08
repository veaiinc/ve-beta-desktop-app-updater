import { useState, useEffect } from 'react';

const useWindowSize = () => {
	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleResize = () =>
		setSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});

	return size;
};

export default useWindowSize;
