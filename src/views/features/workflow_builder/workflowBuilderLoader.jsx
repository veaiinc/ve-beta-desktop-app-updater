import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
const length = 2;
const workflowBuilderLoader = () => {
	return [{}, {}]?.map((e, index) => (
		<div
			style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
			key={index}
		>
			<Skeleton
				width={'300px'}
				height={'291px'}
				style={{ borderRadius: '40px', backgroundColor: 'rgba(22, 21, 31, 0.80)' }}
			/>
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

export default memo(workflowBuilderLoader);
