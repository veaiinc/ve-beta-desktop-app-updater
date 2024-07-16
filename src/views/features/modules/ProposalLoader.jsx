import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';

const ProposalLoader = ({ alignment }) => {
	return (
		<div
			style={{
				flex: 1,
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: '12px',
			}}
		>
			{[{}, {}]?.map((ele, index) => (
				<Skeleton
					height={alignment === 'right' ? '421px' : '329px'}
					style={{ borderRadius: '16px' }}
					key={index}
				/>
			))}
		</div>
	);
};

export default memo(ProposalLoader);
