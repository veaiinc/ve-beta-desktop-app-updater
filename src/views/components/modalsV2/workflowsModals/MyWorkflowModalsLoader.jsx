import React from 'react';
import Skeleton from 'react-loading-skeleton';
const MyWorkflowModalsLoader = ({ width = '366px', height = '59px' }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
				justifyContent: 'flex-start',
			}}
		>
			{[{}, {}, {}, {}, {}, {}, {}, {}, {}]?.map((item, index) => (
				<Skeleton
					width={width}
					height={height}
					style={{ borderRadius: '16px' }}
					key={index}
				/>
			))}
		</div>
	);
};

export default MyWorkflowModalsLoader;
