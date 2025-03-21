import React, { useEffect, useState } from 'react';
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
	disableHover = false, // New prop to disable hover effect
}) => {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		if (!disableHover) {
			setIsHovered(true);
		}
	};

	const handleMouseLeave = () => {
		if (!disableHover) {
			setIsHovered(false);
		}
	};

	const handleConnectToThirdParty = async () => {};

	// const styles = {
	// 	base: {
	// 		border: active ? '1px solid #6055EC' : '1px solid #262626',
	// 		color: '#E4E5E6',
	// 		backgroundColor: active ? '#6055EC' : '#262626',
	// 		cursor: 'pointer',
	// 		borderRadius: '20px',
	// 		padding: '9px 16px',
	// 		height: '40px',
	// 		width: 'auto',
	// 		display: 'inline-block',
	// 		transition: 'color 0.3s ease-in, border 0.3s ease-in',
	// 	},
	// 	hover: {
	// 		color: '#fff',
	// 		background: 'rgba(176, 176, 176, 0.16)',
	// 	},
	// };
	// const combinedStyles = isHovered ? { ...styles.base, ...styles.hover } : styles.base;

	return (
		<div
			className="reusableBtn"
			onClick={handleConnectToThirdParty}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{ width: '100%' }}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					background: 'var(--card)',
					padding: '8px 16px',
					borderRadius: '20px',
					justifyContent: 'center',
					cursor: 'pointer',
					// minWidth: '150px',
					border: '1px solid var(--stroke)',
				}}
			>
				{icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
				<span
					style={{
						fontSize: '14px',
						fontStyle: 'normal',
						fontWeight: '400',
						lineHeight: '22px',
						color: 'var(--primary-font)',
					}}
				>
					{text}
				</span>

				{loader ? (
					<Spinner
						width="10px"
						height={'10px'}
						cssstyle={{ border: '1px solid var(--primary-font)' }}
					/>
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
