import React, { memo, useState } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
import { handleError } from '@apollo/client/link/http/parseAndCheckHttpResponse';
const HomePageStart = ({ cards, setInfo, isNavbarFixed }) => {
	return (
		<div
			className={`home-page-cards-container
		   ${isNavbarFixed ? 'add-margin-top' : ''}
		 `}
		>
			{cards?.map((card) => (
				<div
					key={card?.id}
					className="home-page-cards-container-card"
					onClick={() => {
						setInfo((prev) => ({
							...prev,
							showPromptPopup: true,
							selectedCard: card,
						}));
					}}
				>
					<div className="home-page-cards-container-card-sub-title">{card?.type[0]}</div>
					<div className="home-page-cards-container-card-title">{card?.title}</div>
				</div>
			))}
		</div>
	);
};

export default memo(HomePageStart);
