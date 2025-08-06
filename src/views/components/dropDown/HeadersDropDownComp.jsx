import { useState, memo, useEffect, useCallback } from 'react';
import '../../../assets/scss/dropdown/headerDropdown.scss';
import { ReactComponent as DownArrow } from '../../../assets/svg/chat/downArrow.svg';
import { ReactComponent as Tick } from '../../../assets/svg/tick.svg';
import { getBuisnessName } from '../../../helpers/index';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers/index';
import logout from '../../../helpers/logout';

const logoutStyles = {
	color: 'var(--secondary-button)',
	fontFamily: 'var(--primary-font-family)',
	fontSize: '14px',
	fontStyle: 'normal',
	fontWeight: '400',
	lineHeight: '16px',
	letterSpacing: '-0.3px',
};
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
	showArrow = true,
	containerClassName = '',
	dropDownTextStyling = {},
	showSelectedValueTick = false,
	uniqueIdentifierForTickIcon = '',
	selectedValueObj = {},
	fetchMoreData,
	hasNextPage,
	labelField = 'label',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const toggleDropdown = () => setIsOpen((prev) => !prev);
	const [searchValue, setSearchValue] = useState('');

	useEffect(() => {
		setSearchValue(selectedValue);
	}, [selectedValue]);

	const handleOptionClick = (option) => {
		if (onChangeFunc) {
			onChangeFunc(option);
		}

		setSearchValue(option?.[labelField]);
		setIsOpen(false);
	};
	const handleClose = () => {
		setIsOpen(false);
		setSearchValue('');
	};

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
				<input
					type="text"
					value={searchValue}
					onChange={handleInputChange}
					className="selectedPage"
					placeholder={
						isOpen ? 'Type here to search' : selectedValue || 'Type here to search'
					}
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
							loader={<FetchMoreLoaderComp />}
							style={{ backgroundColor: 'var(--card)' }}
							scrollableTarget="dropdown-menu"
						>
							{options.map((option, index) => (
								<div
									key={index}
									className="dropdown-item"
									onClick={() => handleOptionClick(option)}
									style={{ ...dropDownTextStyling }}
								>
									{option?.[labelField]}
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
										onClick={logout}
										style={{
											...logoutStyles,
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
