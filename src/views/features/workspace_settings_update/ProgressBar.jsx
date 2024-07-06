import React from 'react';

const ProgressBar = ({ progress }) => {
	const containerStyle = {
		width: '268px',
		backgroundColor: '#444',
		borderRadius: '50px',
		overflow: 'hidden',
		margin: '20px 0',
	};

	const barStyle = {
		height: '12px',
		width: `${progress}%`,
		backgroundColor: '#479A5F',
		borderRadius: '50px',
		textAlign: 'center',
		lineHeight: '30px',
		color: 'white',
		transition: 'width 0.5s ease-in-out',
	};

	return (
		<div style={containerStyle}>
			<div style={barStyle}></div>
		</div>
	);
};

export default ProgressBar;
