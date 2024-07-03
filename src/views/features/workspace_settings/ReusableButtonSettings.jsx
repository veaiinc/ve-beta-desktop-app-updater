import React from 'react';
import { ReactComponent as DownArrow } from '../../../assets/svg/chat/downArrow.svg';
import Spinner from '../../components/loaders/Spinner';

const ReusableButtonSettings = ({
	text,
	func,
	active = false,
	icon,
	downArrow = false,
	onClickFunc = null,
	href = null,
	loader = false,
}) => {
	return (
		<div
			style={{
				border: active ? '1px solid #6055EC' : '1px solid #1C1C1C',
				color: active ? '#6055EC' : '#666666',
				backgroundColor: '#1c1c1c',
				cursor: 'pointer',
				borderRadius: '20px',
				padding: '9px 16px',
				height: '40px',
				// marginTop: '1rem',
				width: 'fit-content',
				display: 'inline-block',
				transition: 'color 0.3s ease-in, border 0.3s ease-in',
			}}
			onClick={func}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				{icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
				<span
					style={{
						fontSize: '14px',
						fontStyle: 'normal',
						fontWeight: '400',
						lineHeight: '22px',
					}}
				>
					{text}
				</span>

				{loader ? (
					<Spinner width="10px" height={'10px'} cssstyle={{ border: '1px solid #fff' }} />
				) : (
					''
				)}
				{downArrow && (
					<span
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						<DownArrow />
					</span>
				)}
			</div>
		</div>
	);
};

export default ReusableButtonSettings;
