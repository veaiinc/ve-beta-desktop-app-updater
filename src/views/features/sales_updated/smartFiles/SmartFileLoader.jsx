import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ReactComponent as BackArrowSvg } from '../../../../assets/svg/workflow/backarrow.svg';
const SmartFileLoader = () => {
	return (
		<div
			style={{
				height: '100%',
				flex: '1 1',
				alignSelf: 'stretch',
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'flex-start',
					gap: '12px',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '18px',
						color: '#e4e5e6',
						fontFamily: 'Inter',
						fontSize: '16px',
						fontStyle: 'normal',
						fontWeight: '500',
						lineHeight: '26px',
						cursor: 'pointer',
						textTransform: 'capitalize',
					}}
				>
					<BackArrowSvg />
					Client Name
				</div>
				<div
					style={{
						display: 'flex',
						paddingLeft: '38px',
						alignItems: 'flex-end',
						gap: '12px',
					}}
				>
					<span
						style={{
							color: 'rgba(228, 229, 230, 0.48)',
							fontFamily: 'Inter',
							fontSize: '16px',
							fontStyle: 'normal',
							fontWeight: '500',
							lineHeight: '16px',
							letterSpacing: '0.32px',
							cursor: 'pointer',
							transition: 'all 0.3s ease-in-out',
						}}
					>
						Form Response
					</span>
					<span
						style={{
							color: 'rgba(228, 229, 230, 0.48)',
							fontFamily: 'Inter',
							fontSize: '16px',
							fontStyle: 'normal',
							fontWeight: '500',
							lineHeight: '16px',
							letterSpacing: '0.32px',
							cursor: 'pointer',
							transition: 'all 0.3s ease-in-out',
						}}
					>
						Smart File
					</span>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flex: '1 1',
					alignItems: 'flex-start',
					gap: '32px',
					flexShrink: '0',
					alignSelf: 'stretch',
					height: '100%',
				}}
			>
				<Skeleton width={'386px'} height={'700px'} style={{ borderRadius: '20px' }} />
				<Skeleton width={'650px'} height={'690px'} style={{ borderRadius: '16px' }} />
			</div>
		</div>
	);
};

export default memo(SmartFileLoader);
{
	/* <Skeleton width={'2500px'} height={'291px'} style={{ borderRadius: '20px' }} /> */
}
