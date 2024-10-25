import React from 'react';
import { Switch } from 'antd';

const WaterMarkComponent = ({ info }) => {
	return (
		<div className="watermark_div">
			<div className="text_div">
				<h1>Apply watermark</h1>
				<p>Use AI people on edited photos for delightful client experience.</p>
			</div>

			<Switch checked={info?.isWaterMarkApply || false} />
		</div>
	);
};

export default WaterMarkComponent;
