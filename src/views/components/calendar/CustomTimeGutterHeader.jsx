import React, { memo } from 'react';

const CustomTimeGutterHeader = () => {
	return (
		<div className="customGutterHeader">
			<span>GMT +05:30</span>
		</div>
	);
};

export default memo(CustomTimeGutterHeader);
