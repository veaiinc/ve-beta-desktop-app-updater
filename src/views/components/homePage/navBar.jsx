import React, { useEffect, useState, memo } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';

const NavBar = ({
	options,
	isNavbarFixed,
	selectedOption,
	handleSelectedOption,
	handleSearchValue,
}) => {
	return (
		<div
			className={`home-page-welcome-container-left-text-options ${
				isNavbarFixed ? 'fixed' : ''
			}`}
		>
			<div className="home-page-welcome-container-left-text-options-container">
				{options?.map((option) => (
					<div
						key={option?.id}
						className={`home-page-welcome-container-left-text-option ${
							selectedOption === option?.value ? 'active' : ''
						}`}
						onClick={() => handleSelectedOption(option?.value)}
					>
						{option?.title}
						{selectedOption === option?.value && (
							<div className="home-page-welcome-container-left-text-option-active-indicator"></div>
						)}
					</div>
				))}
			</div>
			<div className="home-page-welcome-container-right">
				<SearchIcon />
				<input
					type="text"
					placeholder="Search Tasks"
					className="search-bar-input"
					onChange={(e) => handleSearchValue(e?.target?.value)}
				/>
			</div>
		</div>
	);
};

export default memo(NavBar);
