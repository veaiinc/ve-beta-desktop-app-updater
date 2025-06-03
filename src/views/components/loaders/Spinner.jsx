import React, { memo } from 'react';

const Spinner = ({ width, height, color, cssstyle = {}, borderTopColor }) => {
	const style = {
		width: width || '18px',
		height: height || '18px',
		border: `1.5px solid ${color || 'var(--primary-font)'}`,
		borderTop: `4px solid ${borderTopColor || 'transparent'}`,
		borderRadius: '50%',
		animation: 'spin 1s linear infinite',
		...cssstyle,
	};
	return <div style={style}></div>;
};

export default memo(Spinner);
