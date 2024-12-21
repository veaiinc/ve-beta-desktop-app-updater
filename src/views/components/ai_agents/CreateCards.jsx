import React, { memo } from 'react';
import '../../../assets/scss/ai_agents/customCards.scss';
import { ReactComponent as Loader } from '../../../assets/svg/ai_agents/loader.svg';
const createCardsOptions = [
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Pitch Deck', subText: 'Create your Brand Pitch Deck ', dotColor: '#F95A2C' },
	{ title: 'Workflow', subText: 'Create a Workflow ', dotColor: '#07982F' },
	{ title: 'Notes', subText: 'Create a Note ', dotColor: '#6055EC' },
	{ title: 'Schedule', subText: 'Check the Schedule ', dotColor: '#FCD7A5' },
	{ title: 'New Design', subText: 'Check New Designs for and templates ', dotColor: '#4F8E8D' },
];

const activityCards = [
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},

	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},

	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
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
						<span className="createOptionsSubTextStyling">{ele?.subText}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(CreateCards);

const Activity = memo(() => {
	return (
		<div className="aiAgentsAcitivityContainer">
			<div className="createCardsHeader">
				<span className="createCardsHeaderTexct">Activity</span>
				<Loader />
			</div>

			<div className="aiAgentsactivityCardsholder">
				{activityCards?.map((ele, index) => (
					<div className="aiAgentsActivityCards" key={index}>
						<span className="aiAgentsActivityCardsHeaderText">{ele?.title}</span>
						<div className="aiAgentsActivityCardsSubTextHolder">
							<span className="aiAgentsActivityCardssubTextStyling">
								{ele?.subtext}
							</span>
							<span className="aiAgentsActivityCardTime">{ele?.time}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

const Drafts = memo(() => {
	return (
		<div className="aiAgentsAcitivityContainer">
			<div className="createCardsHeader">
				<span className="createCardsHeaderTexct">Drafts</span>
			</div>

			<div className="aiAgentsactivityCardsholder">
				{activityCards?.map((ele, index) => (
					<div
						className="aiAgentsActivityCards"
						key={index}
						style={{ justifyContent: 'center' }}
					>
						{/* <span className="aiAgentsActivityCardsHeaderText">{ele?.title}</span> */}
						<div className="aiAgentsActivityCardsSubTextHolder">
							<span
								className="aiAgentsActivityCardssubTextStyling"
								style={{
									fontFamily: 'Inter',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '500',
									lineHeight: 'normal',
									color: '#E8E8E8',
								}}
							>
								{ele?.subtext}
							</span>
							<span className="aiAgentsActivityCardTime">{ele?.time}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

export { Activity, Drafts };
