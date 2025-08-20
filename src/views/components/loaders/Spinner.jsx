import React from 'react';
import { Alert, Flex, Spin } from 'antd';
import './App.scss'; // Include this CSS file for custom styling
import useWindowSize from '../../../hooks/useWindowSize';

const contentStyle = {
	padding: 30,
	backgroundColor: ' #121212 !important',
};

const content = <div style={contentStyle} />;

const App = ({ size }) => {
	const { width, height } = useWindowSize();
	let theme = localStorage.getItem('theme');
	theme = 'light';
	// console.log(theme, 'theme');
	return (
		<Flex gap="middle" vertical>
			<Flex gap="middle">
				<Spin
					size={size ? size : width > 768 ? 'large' : 'small'}
					style={{
						background: theme == 'dark' ? '#121212 !important' : '#ffffff !important',
					}}
					className="custom-spinner"
				>
					{content}
				</Spin>
			</Flex>
		</Flex>
	);
};
export default App;
