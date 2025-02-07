import React, { memo, useState } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
const HomePageStart = ({ cards, setInfo, searchValue }) => {
	return (
		<div className="home-page-cards-container">
			{cards
				?.filter((cards) =>
					cards?.title?.toLowerCase()?.includes(searchValue?.toLowerCase()),
				)
				?.map((card) => (
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
						<div className="home-page-cards-container-card-sub-title">
							{card?.type[0]}
						</div>
						<div className="home-page-cards-container-card-title">{card?.title}</div>
					</div>
				))}
		</div>
	);
};

export default memo(HomePageStart);
