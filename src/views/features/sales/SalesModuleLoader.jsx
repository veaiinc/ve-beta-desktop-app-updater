import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
const SalesModuleLoader = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '12px',
				justifyContent: 'flex-start',
			}}
		>
			{[{}, {}, {}]?.map((ele, index) => (
				<div
					key={index}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						justifyContent: 'flex-start',
					}}
				>
					<span style={{ color: '#fff' }}>Loading Templates ....</span>
					<Skeleton height={'350px'} style={{ borderRadius: '2.5rem' }} />
				</div>
			))}
		</div>
	);
};

export default memo(SalesModuleLoader);
