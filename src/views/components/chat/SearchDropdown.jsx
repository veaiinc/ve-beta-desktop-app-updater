import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { ReactComponent as ChevronSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/home_page/Tick.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
const SearchDropdown = ({
	headerTitle,
	selectedOptions,
	isDropdownOpen,
	setIsDropdownOpen,
	options,
	handleOptionClick,
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const filteredKeys = Object.keys(options)?.filter((option) =>
		option?.includes(searchQuery?.toLowerCase()),
	);
	return (
		<div className="search-dropdown">
			<Tooltip
				placement="top"
				open={isDropdownOpen}
				onOpenChange={setIsDropdownOpen}
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				title={
					<div className="search-dropdown-container">
						<div className="input-container">
							<SearchSvg />
							<input
								type="text"
								placeholder="Search"
								onChange={(e) => setSearchQuery(e?.target?.value)}
							/>
						</div>
						<div className="options-container">
							{filteredKeys?.map((key) => (
								<div
									className="option"
									key={key}
									onClick={() => handleOptionClick(key)}
									style={{
										backgroundColor: selectedOptions[key]
											? '#2f3336'
											: 'transparent',
									}}
								>
									<div className="option-title">{options[key]}</div>
									{selectedOptions[key] && <TickSvg />}
								</div>
							))}
						</div>
					</div>
				}
			>
				<div className="search-dropdown-button">
					<div className="selected-options-count">
						{Object?.keys(selectedOptions)?.length}
					</div>
					<div className="header-title">{headerTitle}</div>

					<div className="chevron-container">
						<ChevronSvg />
					</div>
				</div>
			</Tooltip>
		</div>
	);
};

export default SearchDropdown;
