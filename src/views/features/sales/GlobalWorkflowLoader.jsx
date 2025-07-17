import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
const GlobalWorkflowLoader = () => {
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
						flex: '1 1',
						padding: '24px',
						flexDirection: 'column',
						gap: '24px',
						borderRadius: '24px',
						border: '1px solid rgba(215, 215, 216, 0)',
						background: '#111',
						color: '#fff',
						transition: 'all 0.3s ease-out',
						cursor: 'pointer',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							gap: '16px',
							alignSelf: 'stretch',
						}}
					>
						<span
							style={{
								color: '#e4e5e6',
								fontFamily: 'var(--primary-font-family)',
								fontSize: '18px',
								fontStyle: 'normal',
								fontWeight: '500',
								lineHeight: '18px',
							}}
						>
							Fetching Your Global Templates Information ...
						</span>
						<span
							style={{
								color: 'rgba(228, 229, 230, 0.48)',
								fontFamily: 'var(--primary-font-family)',
								fontSize: '14px',
								fontStyle: 'normal',
								fontWeight: '400',
								lineHeight: '20px',
								letterSpacing: '-0.004px',
							}}
						>
							Ideal for wedding photography business with multiple events, selectable
							packages and services, this workflow provides customisable design in
							enquiry forms, proposals, invoices for multiple payment schedule and
							hassle contracts with e-sign contracts
						</span>
					</div>
					<Skeleton width={'240px'} height={'291px'} style={{ borderRadius: '20px' }} />
				</div>
			))}
		</div>
	);
};

export default memo(GlobalWorkflowLoader);
