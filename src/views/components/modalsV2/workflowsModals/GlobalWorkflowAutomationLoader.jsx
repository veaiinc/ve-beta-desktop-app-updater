import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
const length = 2;
const GlobalWorkflowAutomationLoader = () => {
	return [{}, {}]?.map((ele, index) => (
		<div
			style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
			key={index}
		>
			<Skeleton width={'252px'} height={'208px'} style={{ borderRadius: '33px' }} />
			{index < length - 1 ? (
				<div
					style={{
						height: '64px',
						width: '1px',
						border: '1px dashed #414141',
					}}
				></div>
			) : (
				''
			)}
		</div>
	));
};

export default memo(GlobalWorkflowAutomationLoader);
