import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
const GlobalWorkflowDesignModalLoader = () => {
	return [{}, {}]?.map((ele, index) => (
		<Skeleton width={'368px'} height={'578px'} style={{ borderRadius: '16px' }} key={index} />
	));
};

export default memo(GlobalWorkflowDesignModalLoader);
