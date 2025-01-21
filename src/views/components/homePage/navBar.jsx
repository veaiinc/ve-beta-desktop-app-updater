import React, { useEffect, useState, memo } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';

const options = ['All', 'Sales', 'Marketing', 'Operations'];
const NavBar = () => {
	const [isSticky, setIsSticky] = useState(false);
	const [selectedOption, setSelectedOption] = useState('All');
	const [searchText, setSearchText] = useState('');

	// useEffect(() => {
	// 	const scrollableElement = document.querySelector('.home-page-container');
	// 	const handleScroll = () => {
	// 		if (scrollableElement.scrollTop > 10) {
	// 			setIsSticky(true);
	// 			console.log('Function Triggered');
	// 		} else {
	// 			setIsSticky(false);
	// 		}
	// 	};
	// 	scrollableElement.addEventListener('scroll', handleScroll);
	// 	return () => {
	// 		scrollableElement.removeEventListener('scroll', handleScroll);
	// 	};
	// }, [setIsSticky]);
	return (
		<div className={`home-page-welcome-container-left-text-options`}>
			<div className="home-page-welcome-container-left-text-options-container">
				{options.map((option) => (
					<div
						className={`home-page-welcome-container-left-text-option ${
							selectedOption === option ? 'active' : ''
						}`}
						onClick={() => setSelectedOption(option)}
					>
						{option}
						{selectedOption === option && (
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
					value={searchText}
					onChange={(e) => setSearchText(e?.target?.value)}
				/>
			</div>
		</div>
	);
};

export default memo(NavBar);
