import React, { memo, useEffect, useContext } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import Context from '../../../context/context';
import SearchSvg from '../../../assets/svg/activity/SearchSvg';
import Voice from '../chat/Voice';

const NavBar = ({
	options,
	selectedOption,
	handleSelectedOption,
	handleSearchValue,
	showSearchBar = true,
	tabItemCount,
}) => {
	const overrideShowSearchBar = selectedOption === 'Workflows';
	return (
		<div className="home-page-welcome-container-left-text-options">
			<div className="home-page-welcome-container-left-text-options-container">
				{options?.map((option) => (
					<div
						key={option?.id}
						className={`home-page-welcome-container-left-text-option ${
							selectedOption === option?.value ? 'active' : ''
						}`}
						onClick={() => handleSelectedOption(option?.value)}
					>
						{option?.title === 'Priority' && (
							<div className="priority-count">
								{tabItemCount?.all > 99 ? '99+' : tabItemCount?.all}
							</div>
						)}
						<p>{option?.title}</p>
						{selectedOption === option?.value && (
							<div className="home-page-welcome-container-left-text-option-active-indicator"></div>
						)}
					</div>
				))}
			</div>
			{/* <Voice /> */}

			{(showSearchBar || overrideShowSearchBar) && (
				<div className="home-page-welcome-container-right">
					<SearchSvg />
					<input
						type="text"
						placeholder="Search here"
						className="search-bar-input"
						onChange={(e) => handleSearchValue(e?.target?.value)}
					/>
				</div>
			)}
		</div>
	);
};

export default memo(NavBar);
