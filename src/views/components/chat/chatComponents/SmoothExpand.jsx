import { memo, useRef, useState, useEffect } from 'react';
import '../../../../assets/scss/chat/chatComponents/smoothExpand.scss';

const SmoothExpand = ({ children, animate = true }) => {
	const containerRef = useRef(null);
	const [info, setInfo] = useState({
		expand: false,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, expand: true }));
	}, []);

	return (
		<div
			ref={containerRef}
			style={{
				'--height': `${containerRef?.current?.scrollHeight}px`,
				...(!animate && {
					height: 'auto',
				}),
			}}
			className={`smooth-expand-container ${
				info?.expand && animate ? 'expand-animation' : ''
			}`}
		>
			{children}
		</div>
	);
};

export default memo(SmoothExpand);
