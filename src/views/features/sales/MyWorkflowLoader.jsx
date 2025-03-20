import React, { memo } from 'react';

import Skeleton from 'react-loading-skeleton';
const MyWorkflowLoader = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
				justifyContent: 'flex-start',
			}}
		>
			{[{}, {}, {}]?.map((ele, index) => (
				<div
					key={index}
					style={{
						display: 'flex',
						padding: '24px',
						alignItems: 'flex-start',
						gap: '28px',
						alignSelf: 'stretch',
						borderRadius: '24px',
						background: '#111',
						transition: 'all 0.24s ease-out',
						cursor: 'pointer',
					}}
				>
					<Skeleton height={'284px'} width={'200px'} style={{ borderRadius: '24px' }} />
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							flex: '1 0',
							alignSelf: 'stretch',
						}}
					>
						<span
							style={{
								overflow: 'hidden',
								color: '#e4e5e6',
								textOverflow: 'ellipsis',
								fontFamily: 'var(--primary-font-family)',
								fontSize: '14px',
								fontStyle: 'normal',
								fontWeight: '500',
								lineHeight: '22px',
								letterSpacing: '-0.28px',
							}}
						>
							Fetching Details...
						</span>
						<div
							style={{
								display: 'flex',
								alignSelf: 'stretch',
								alignItems: 'flex-start',
								gap: '7px',
								flexShrink: '0',
							}}
						>
							{[{}, {}, {}]?.map((item, ind) => (
								<Skeleton
									key={ind}
									height={'66px'}
									width={'130px'}
									style={{ borderRadius: '16px' }}
								/>
							))}
						</div>
						<div
							style={{
								display: 'flex',
								alignSelf: 'stretch',
								alignItems: 'flex-start',
								gap: '7px',
								flexShrink: '0',
							}}
						>
							{[{}, {}, {}, {}]?.map((item, lowerInd) => (
								<Skeleton
									key={lowerInd}
									height={'160px'}
									width={'130px'}
									style={{ borderRadius: '16px' }}
								/>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(MyWorkflowLoader);
