import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
const WorkflowBuilderLoader = () => {
	return (
		<div
			className="loadingScreen"
			style={{
				display: 'flex',
				flexDirection: 'column',

				alignItems: 'center',
				flex: 1,
				gap: '24px',
				color: '#fff',
				padding: '16px',
			}}
		>
			<Skeleton width={'312px'} height={'44px'} style={{ borderRadius: '14px' }} />
			<Skeleton count={5} width={'312px'} height={'12px'} />
			<Skeleton width={'312px'} height={'44px'} style={{ borderRadius: '14px' }} />
			<Skeleton count={5} width={'312px'} height={'12px'} />
			<Skeleton width={'312px'} height={'44px'} style={{ borderRadius: '14px' }} />
			<Skeleton count={5} width={'312px'} height={'12px'} />
		</div>
	);
};

export default memo(WorkflowBuilderLoader);
