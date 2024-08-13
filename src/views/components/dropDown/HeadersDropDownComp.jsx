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
	showIcon = false,
	logoutOptions,
	onMouseHoverFunc = false,
	outerContainerStyle,
	onChangeFunc,
	selectedValueStyle,
	showArrow = true,
	containerClassName = '',
}) => {
	const logoutFunc = useLogout();
	const [isOpen, setIsOpen] = useState(false);
	const toggleDropdown = () => setIsOpen((prev) => !prev);

	const handleOptionClick = (option) => {
		if (onChangeFunc) {
			onChangeFunc(option);
		}

		setIsOpen(false);
	};
	const handleClose = () => {
		setIsOpen(false);
	};
	const handleLogout = useCallback(async () => {
		logoutFunc();
	}, [logoutFunc]);

	const handleOpen = useCallback(async () => {
		setIsOpen(true);
	}, []);

	return (
		<div className="dropdown" style={outerContainerStyle || {}}>
			<div
				className={`dropdown-header ${containerClassName}`}
				style={{ ...(containerStyle || {}) }}
				onClick={toggleDropdown}
				onMouseOver={onMouseHoverFunc ? handleOpen : null}
				onMouseLeave={onMouseHoverFunc ? handleClose : null}
			>
				{showIcon ? (
					activeImage ? (
						<img src={activeImage} alt="ActiveLogo" className="activelogo" />
					) : (
						<div className="activeLogoName">
							{selectedValue && getBuisnessName(selectedValue)}
						</div>
					)
				) : (
					''
				)}
				<span
					className="selectedPage"
					style={{
						color: containerStyle?.color || 'rgba(224, 224, 224, 0.32)',
						...(selectedValueStyle || {}),
					}}
				>
					{selectedValue}
				</span>
				{showArrow ? <DownArrow /> : ''}
			</div>
			{isOpen ? (
				<>
					{!onMouseHoverFunc ? (
						<div className="dropdown-overlay" onClick={handleClose}></div>
					) : (
						''
					)}
					<div
						className="dropdown-menu"
						style={dropDownStyle || {}}
						onMouseOver={onMouseHoverFunc ? handleOpen : null}
						onMouseLeave={onMouseHoverFunc ? handleClose : null}
					>
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
			) : (
				''
			)}
		</div>
	);
};
export default memo(HeadersDropDownComp);
