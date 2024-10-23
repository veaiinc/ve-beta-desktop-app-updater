import React from 'react';
import { Switch } from 'antd';

const WaterMarkComponent = () => {
	return (
		<div className="watermark_div">
			<div className="text_div">
				<h1>Apply watermark</h1>
				<p>Use AI people on edited photos for delightful client experience.</p>
			</div>

			{/* <div className='switch'></div> */}
			<Switch />
		</div>
	);
};

export default WaterMarkComponent;
