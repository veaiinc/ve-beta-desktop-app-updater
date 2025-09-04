import { memo } from 'react';

const Spinner = ({ width, height, color, cssstyle = {}, borderTopColor, borderWidth = 3 }) => {
	const style = {
		width: width || '32px',
		height: height || '32px',
		border: `${borderWidth}px solid ${color || 'var(--primary-button)'}`,
		borderTop: `1.5px solid ${borderTopColor || 'transparent'}`,
		borderRadius: '50%',
		animation: 'spin 1s linear infinite',
		...cssstyle,
	};
	return <div style={style}></div>;
};

export default memo(Spinner);
