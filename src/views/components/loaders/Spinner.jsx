// import React, { memo } from 'react';

// const Spinner = ({ width, height, color, cssstyle = {}, borderTopColor ,borderWidth=3}) => {
// 	const style = {
// 		width: width || '18px',
// 		height: height || '18px',
// 		border: `${borderWidth}px solid ${color || 'var(--primary-font)'}`,
// 		borderTop: `4px solid ${borderTopColor || 'transparent'}`,
// 		borderRadius: '50%',
// 		animation: 'spin 1s linear infinite',
// 		...cssstyle,
// 	};
// 	return <div style={style}></div>;
// };

// export default memo(Spinner);

import React from 'react';
import { Alert, Flex, Spin } from 'antd';
import './App.scss'; // Include this CSS file for custom styling
import useWindowSize from '../../../hooks/useWindowSize';

const contentStyle = {
	padding: 30,
	// borderRadius: 4,
	background: ' #121212 !important',
};

const content = <div style={contentStyle} />;

const App = ({ size }) => {
	const { width, height } = useWindowSize();
	return (
		<Flex gap="middle" vertical>
			<Flex gap="middle">
				<Spin
					size={size ? size : width > 768 ? 'large' : 'small'}
					className="custom-spinner"
				>
					{content}
				</Spin>
			</Flex>
		</Flex>
	);
};
export default App;
