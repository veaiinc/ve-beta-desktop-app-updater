import React from 'react';

const Spinner = ({ width, height, color, cssstyle = {}, borderTopColor }) => {
	const style = {
		width: width || '30px',
		height: height || '30px',
		border: `3px solid ${color || '#fff'}`,
		borderTop: `4px solid ${borderTopColor || 'transparent'}`,
		borderRadius: '50%',
		animation: 'spin 1s linear infinite',
		...cssstyle,
	};
	return <div style={style}></div>;
};

export default Spinner;
