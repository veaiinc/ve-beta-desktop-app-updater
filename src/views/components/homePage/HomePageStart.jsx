import React, { memo } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
const HomePageStart = ({ cards, setInfo }) => {
	return (
		<div className={`home-page-cards-container `}>
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
					<div className="home-page-cards-container-card-sub-title">{card?.subTitle}</div>
					<div className="home-page-cards-container-card-title">{card?.title}</div>
				</div>
			))}
		</div>
	);
};

export default memo(HomePageStart);
