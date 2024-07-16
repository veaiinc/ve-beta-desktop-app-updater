import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
const MyWorkflowPageLoader = () => {
	return (
		<div className="salesCardContainer">
			{[{}, {}, {}, {}, {}, {}, {}]?.map((ele, index) => (
				<Skeleton width={'22.4rem'} height={'177px'} key={index} />
			))}
		</div>
	);
};

export default memo(MyWorkflowPageLoader);
