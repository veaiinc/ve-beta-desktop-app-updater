// import React, { useEffect } from 'react';
// import { Alert, Flex, Spin } from 'antd';
// import './App.scss'; // Include this CSS file for custom styling
// import useWindowSize from '../../../hooks/useWindowSize';

// const contentStyle = {
// 	padding: 30,
// };
// const content = <div style={contentStyle} />;

// const App = ({ size }) => {
// 	const { width, height } = useWindowSize();
// 	let theme = localStorage.getItem('theme');

// 	// Set CSS variables based on theme
// 	useEffect(() => {
// 		// Fix: Default to dark theme if no theme is set or if theme is 'dark'
// 		const spinnerBgColor = !theme || theme == 'dark' ? '#121212' : '#ffffff';
// 		// const dotColor = theme === 'dark' ? '#79ecc9' : '#1890ff';
// 		document.documentElement.style.setProperty('--spinner-bg-color', spinnerBgColor);

// 		// document.documentElement.style.setProperty('--spinner-dot-color', dotColor);
// 	}, [theme]);

// 	return (
// 		<Flex gap="middle" vertical>
// 			<Flex gap="middle">
// 				<Spin
// 					size={size ? size : width > 768 ? 'large' : 'small'}
// 					className="custom-spinner"
// 				>
// 					{content}
// 				</Spin>
// 			</Flex>
// 		</Flex>
// 	);
// };

// export default App;
import React, { useEffect } from 'react';
import './App.scss';
import useWindowSize from '../../../hooks/useWindowSize';

const CustomSpinner = ({ size }) => {
	const { width, height } = useWindowSize();
	let theme = localStorage.getItem('theme');

	// Set CSS variables based on theme - same logic as original component
	useEffect(() => {
		// Fix: Default to dark theme if no theme is set or if theme is 'dark'
		const spinnerBgColor = !theme || theme === 'dark' ? '#121212' : '#ffffff';
		// const spinnerDotColor = !theme || theme === 'dark' ? '#79ecc9' : '#1890ff';

		document.documentElement.style.setProperty('--spinner-bg-color', spinnerBgColor);
		// document.documentElement.style.setProperty('--spinner-dot-color', spinnerDotColor);
	}, [theme]);

	const contentStyle = {
		padding: 30,
	};

	return (
		<div className="custom-spinner-wrapper">
			<div className="custom-spinner-container">
				<div
					className={`custom-spinner custom-spinner-${
						size ? size : width > 768 ? 'large' : 'small'
					}`}
				>
					{/* Content area matching the original */}
					<div className="custom-spinner-content" style={contentStyle}></div>

					{/* Spinning dots exactly like the image */}
					<div className="custom-spinner-dots">
						<div className="custom-spinner-dot custom-spinner-dot-1"></div>
						<div className="custom-spinner-dot custom-spinner-dot-2"></div>
						<div className="custom-spinner-dot custom-spinner-dot-3"></div>
						<div className="custom-spinner-dot custom-spinner-dot-4"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomSpinner;
