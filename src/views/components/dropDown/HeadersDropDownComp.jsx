import React, { useState, memo, useCallback } from 'react';
import '../../../assets/scss/dropdown/headerDropdown.scss';
import { ReactComponent as DownArrow } from '../../../assets/svg/chat/downArrow.svg';
import { ReactComponent as Tick } from '../../../assets/svg/tick.svg';
import useLogout from '../../hooks/useLogout';
import { getBuisnessName } from '../../../helpers/index';
import InfiniteScroll from 'react-infinite-scroll-component';

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
	dropDownTextStyling = {},
	showSelectedValueTick = false,
	uniqueIdentifierForTickIcon = '',
	selectedValueObj = {},
	fetchMoreData,
	hasNextPage,
}) => {
	const logoutFunc = useLogout();
	const [isOpen, setIsOpen] = useState(false);
	const toggleDropdown = () => setIsOpen((prev) => !prev);
	const [searchValue, setSearchValue] = useState('');

	const handleOptionClick = (option) => {
		if (onChangeFunc) {
			onChangeFunc(option);
		}

		setSearchValue(option?.label);
		setIsOpen(false);
	};
	const handleClose = () => {
		setIsOpen(false);
		setSearchValue('');
	};
	const handleLogout = useCallback(async () => {
		logoutFunc();
	}, [logoutFunc]);

	const handleOpen = useCallback(async () => {
		setIsOpen(true);
	}, []);

	const handleInputChange = (e) => {
		const value = e?.target?.value;
		setSearchValue(value);
		if (onChangeFunc) {
			onChangeFunc({ searchQuery: value });
		}
	};
	return (
		<div className="dropdown" style={outerContainerStyle || {}}>
			<div
				className={`dropdown-header ${containerClassName} ${
					isOpen ? containerClassName + '-open' : 'close'
				}`}
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
				{/* <span
					className="selectedPage"
					style={{
						color: containerStyle?.color || 'var(--primary-button)',
						...(selectedValueStyle || {}),
					}}
				>
					{selectedValue}
				</span> */}
				<input
					type="text"
					value={searchValue}
					onChange={handleInputChange}
					className="selectedPage"
					placeholder="Search for a Lead"
				/>

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
						id="dropdown-menu"
						style={dropDownStyle || {}}
						onMouseOver={onMouseHoverFunc ? handleOpen : null}
						onMouseLeave={onMouseHoverFunc ? handleClose : null}
					>
						<InfiniteScroll
							dataLength={options?.length || 0}
							hasMore={hasNextPage}
							next={fetchMoreData}
							loader={<h4>Loading...</h4>}
							style={{ height: '150px' }}
							scrollableTarget="dropdown-menu"
						>
							{options.map((option, index) => (
								<div
									key={index}
									className="dropdown-item"
									onClick={() => handleOptionClick(option)}
									style={{ ...dropDownTextStyling }}
								>
									{option?.label}
									{showSelectedValueTick ? (
										option?.[uniqueIdentifierForTickIcon] ===
										selectedValueObj?.[uniqueIdentifierForTickIcon] ? (
											<Tick />
										) : (
											''
										)
									) : (
										''
									)}
								</div>
							))}
							{logoutOptions ? (
								<>
									<div
										style={{ flex: 1, padding: '0px 20px', margin: '8px 0px' }}
									>
										<div
											style={{
												flex: 1,
												height: '1px',
												backgroundColor: 'var(--primary-button)',
											}}
										></div>
									</div>

									<div
										className="dropdown-item"
										onClick={handleLogout}
										style={{
											color: 'var(--secondary-button)',
											fontFamily: 'var(--primary-font-family)',
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
						</InfiniteScroll>
					</div>
				</>
			) : (
				''
			)}
		</div>
	);
};
export default memo(HeadersDropDownComp);
