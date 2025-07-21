import { memo, useState } from 'react';
import './guideMePopup.scss';
import { ReactComponent as UpdatingIcon } from './updatingIcon.svg';

const ReviewingOptions = [
	{
		idd: 1,
		title: 'New Design Walkthrough',
	},
	{ id: 2, title: 'Design Feedback Review' },
	{ id: 3, title: 'Design QA / Handoff' },
	{ id: 4, title: 'Cross-Functional Sync' },
];

const PrepOptions = [
	{
		id: 1,
		title: 'UX pain points',
	},
	{
		id: 2,
		title: 'Accessibility feedback',
	},
	{ id: 3, title: 'Feature alignment' },
];
const GuideMeAgenda = () => {
	const [info, setInfo] = useState({
		text: '',
	});
	return (
		<div className="guideMeAgendaMainContainer">
			<div className="guideMeAgendaContainerHeader">
				<div className="guideMeAgendaContainerHeaderTitle">Agenda</div>
				<textarea
					type="text"
					className="guideMeAgendaInputContainer"
					rows={4}
					placeholder="Enter your agenda here"
					value={info.text}
					onChange={(e) => setInfo({ ...info, text: e.target.value })}
				/>
			</div>
			<div className="guideMeAgendaContainerBody">
				<UpdatingIcon />
				<div className="guideMeAgendaContainerBodyText">Updating your agenda...</div>
			</div>
			<div className="guideMeAgendaMainBody">
				<div className="guideMeKnowledgeContainer">Knowledge base</div>
				<div className="guideMeReviewingContainer">
					<div className="guideMeReviewingContainerIcon"></div>
					<div className="guideMeReviewingContainerText">
						Reviewing designs? Is this a concept presentation or feedback sync?
					</div>
				</div>
				<div className="guideMeReviewingOptionsContainer">
					{ReviewingOptions.map((item) => (
						<div className="guideMeReviewingOptionsItem" key={item.id}>
							{item.title}
						</div>
					))}
				</div>
			</div>
			<div className="guideMeAgendaMainBody">
				<div className="guideMeReviewingContainer">
					<div className="guideMeReviewingContainerIcon"></div>
					<div className="guideMeReviewingContainerText">What should I prep for?</div>
				</div>
				<div className="guideMeReviewingOptionsContainer">
					{PrepOptions?.map((item) => (
						<div className="guideMeReviewingOptionsItem" key={item.id}>
							{item.title}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(GuideMeAgenda);
