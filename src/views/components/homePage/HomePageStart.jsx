import React from 'react';
import '../../../assets/scss/home_page/homepage.scss';
const HomePageStart = ({ cards, info, setInfo }) => {
	return (
		<div className={`home-page-cards-container `}>
			{cards?.map((card) => (
				<div
					key={card?.id}
					className="home-page-cards-container-card"
					onClick={() => {
						setInfo({
							...info,
							showPromptPopup: true,
							selectedCard: card,
						});
					}}
				>
					<div className="home-page-cards-container-card-sub-title">{card?.subTitle}</div>
					<div className="home-page-cards-container-card-title">{card?.title}</div>
				</div>
			))}
		</div>
	);
};

export default HomePageStart;
