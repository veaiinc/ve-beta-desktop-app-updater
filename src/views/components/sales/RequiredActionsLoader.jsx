import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
const RequiredActionsLoader = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				padding: '16px',
				gap: '8px',
				justifyContent: 'flex-start',
			}}
		>
			{[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]?.map((_, index) => (
				<Skeleton
					width={'200px'}
					height={'284px'}
					style={{ borderRadius: '16px' }}
					key={index}
				/>
			))}
		</div>
	);
};

export default memo(RequiredActionsLoader);
