import React, { memo } from 'react';
import '../../../assets/scss/ai_agents/customCards.scss';

const createCardsOptions = [
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
];

const CreateCards = () => {
	return (
		<div className="aiAgentsCreatecards">
			<div className="createCardsHeader">
				<span className="createCardsHeaderTexct">Create</span>+
			</div>

			<div className="createCardsHolderContainer">
				{createCardsOptions?.map((ele, index) => (
					<div className="createSubCardOptionsdcards" key={index}>
						<div className="createSubCardOptionsdcardsHeader">
							<div
								className="createOptionsCardDotContainer"
								style={{ backgroundColor: ele?.dotColor || '' }}
							></div>
							<span className="createcardOprtionsTitle">{ele?.title}</span>
						</div>
						<span className="createOptionsSubTextStyling"></span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(CreateCards);
