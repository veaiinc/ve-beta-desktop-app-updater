import React, { useState, memo, useCallback } from 'react';
import '../../../assets/scss/dropdown/headerDropdown.scss';
import { ReactComponent as DownArrow } from '../../../assets/svg/chat/downArrow.svg';
import useLogout from '../../hooks/useLogout';
import { getBuisnessName } from '../../features/profile_settings/getInitials';

const iconComponent = (
	<div
		style={{
			display: 'flex',
			width: '18px',
			height: '18px',
			justifyContent: 'center',
			alignItems: 'center',
			gap: '5.625px',
			borderRadius: '56.25px',
			background:
				'url(https://s3-alpha-sig.figma.com/img/1785/4816/6b242fa46aaac2dc8b45609480a257a7?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iiGtkJltYhmFpJEjLTL3da5weMk3RS~kz41rEB5FRlBc7f5Z6QrYajx4l9J6rFkjM7PJRErDB-hUwGrIvRwQqxiIFy9OiPSnkxmCNj1KJoPjLg8BT5jb3GoxoTz2tZmxic1R5iAUYRX-f~y8FTCqERjIVkZhGEd60SyrfgLPpS97Ruxuq6zCvwAPOorZM8qOS0nlM4~Drp0pqddZRxNtxLDTY4VuIPlXw2O~oz-dbBB5I6-SEyLHx~xKPFeD8ph5DARXtHktw3bpU0VCmDNecA2UZfpP5hgDsXeM9bINAGidL-2zyfO~8QNFGleIJThiCaIrxgQ-ZcdhDygd7BWvBQ__)',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		}}
	></div>
);
const HeadersDropDownComp = ({
	containerStyle,
	dropDownStyle,
	selectedValue,
	activeImage,
	options,
	showIcon = true,
	logoutOptions,
}) => {
	const logoutFunc = useLogout();
	const [isOpen, setIsOpen] = useState(false);
	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleOptionClick = (option) => {
		option?.onClickFunc();
		setIsOpen(false);
	};
	const handleClose = () => {
		setIsOpen(false);
	};
	const handleLogout = useCallback(async () => {
		logoutFunc();
	}, [logoutFunc]);

	return (
		<div className="dropdown">
			<div className="dropdown-header" style={containerStyle || {}} onClick={toggleDropdown}>
				{activeImage ? (
					<img src={activeImage} alt="ActiveLogo" className="activelogo" />
				) : (
					<div>{selectedValue && getBuisnessName(selectedValue)}</div>
				)}
				<span className="selectedPage">{selectedValue}</span>
				<DownArrow />
			</div>
			{isOpen && (
				<>
					<div className="dropdown-overlay" onClick={handleClose}></div>
					<div className="dropdown-menu" style={dropDownStyle || {}}>
						{options.map((option, index) => (
							<div
								key={index}
								className="dropdown-item"
								onClick={() => handleOptionClick(option)}
							>
								{option?.label}
							</div>
						))}
						{logoutOptions ? (
							<>
								<div style={{ flex: 1, padding: '0px 20px', margin: '8px 0px' }}>
									<div
										style={{
											flex: 1,
											height: '1px',
											backgroundColor: 'rgba(40, 39, 40, 0.48)',
										}}
									></div>
								</div>

								<div
									className="dropdown-item"
									onClick={handleLogout}
									style={{
										color: 'rgba(202, 90, 79, 0.64)',
										fontFamily: 'Inter',
										fontSize: '14px',
										fontStyle: 'normal',
										fontWeight: '400',
										lineHeight: '16px',
										letterSpacing: '-0.3px',
									}}
								>
									Logout
								</div>
							</>
						) : (
							''
						)}
					</div>
				</>
			)}
		</div>
	);
};
export default memo(HeadersDropDownComp);
