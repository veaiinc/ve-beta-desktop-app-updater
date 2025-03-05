import React, { memo } from 'react';
import '../../../assets/scss/home_page/homepage.scss';
const HomePageStart = ({ setInfo, promptsData }) => {
	return (
		<>
			<div className="home-page-cards-container">
				{promptsData?.data?.map((card) => (
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
							{card?.category}
						</div>
						<div className="home-page-cards-container-card-title">{card?.title}</div>
					</div>
				))}
			</div>
			{!promptsData?.data?.length && (
				<div className="home-page-cards-container-no-data">No data found</div>
			)}
		</>
	);
};

export default memo(HomePageStart);
