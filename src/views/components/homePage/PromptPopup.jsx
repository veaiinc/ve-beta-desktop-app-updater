import React, { useState, memo, useEffect, useCallback, useContext } from 'react';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import '../../../assets/scss/home_page/promptPopup.scss';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import { ReactComponent as ThumbsUp } from '../../../assets/svg/thumbsUp.svg';
import { ReactComponent as ThumbsDown } from '../../../assets/svg/thumbsDown.svg';
import { ReactComponent as ArrowUpRight } from '../../../assets/svg/sidebar/arrowupright.svg';

const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};

const spanStyles = {
	display: 'inline-flex',
	padding: '2px 8px 3px',
	border: '1px solid var(--stroke)',
	background: 'var(--card)',
	borderRadius: '16px',
	margin: '2px',
	lineHeight: '1.4',
};

const dummyFeedbacks = [
	{
		id: '3421',
		label: 'Not Relevant',
	},
	{
		id: '3422',
		label: 'Too generic',
	},
	{
		id: '3433',
		label: 'Incorrect Info',
	},
	{
		id: '3434',
		label: 'Hard to understand',
	},
	{
		id: '3435',
		label: 'Missing details',
	},
	{
		id: '3436',
		label: 'Essential information is absent.',
	},
	{
		id: '3437',
		label: 'Crucial details are lacking.',
	},
];

const PromptPopup = ({
	open,
	closeModal,
	selectedCard,
	isFeedbackPopupOpen = false,
	liked = null,
}) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		selectedOptions: {},
		dynamicValues: {},
		parsedPrompt: [],
		feedbackPopupOpen: isFeedbackPopupOpen,
		feedback: liked,
		selectedFeedback: null,
	});

	useEffect(() => {
		setInfo(prev => ({...prev, feedbackPopupOpen: isFeedbackPopupOpen}))
	}, [isFeedbackPopupOpen])

	const navigate = useNavigate();

	useEffect(() => {
		if (!selectedCard?.prompt) return;

		const matches = [...selectedCard.prompt.matchAll(/\[([^\]]+)\]/g)];

		let lastIndex = 0;
		const parts = [];

		matches.forEach((match) => {
			const index = match.index;
			if (lastIndex < index) {
				parts.push({ type: 'text', value: selectedCard.prompt.slice(lastIndex, index) });
			}
			parts.push({ type: 'variable', value: match[1] });
			lastIndex = index + match[0].length;
		});

		if (lastIndex < selectedCard.prompt.length) {
			parts.push({ type: 'text', value: selectedCard.prompt.slice(lastIndex) });
		}

		const initialValues = {};
		matches.forEach((m) => (initialValues[m[1]] = ''));

		setInfo((prev) => ({
			...prev,
			dynamicValues: initialValues,
			parsedPrompt: parts,
		}));
	}, [selectedCard]);

	const handleVariableChange = (key, value) => {
		setInfo((prev) => ({
			...prev,
			dynamicValues: {
				...prev.dynamicValues,
				[key]: value,
			},
		}));
	};

	const handleRemoveSelectedFile = (file) => {
		setInfo((prev) => {
			const cardId = selectedCard?.id;
			if (!cardId) return prev;

			const updated = { ...prev.selectedOptions };
			updated[cardId] = (updated[cardId] || []).filter((f) => f !== file);
			if (updated[cardId]?.length === 0) delete updated[cardId];

			return {
				...prev,
				selectedOptions: updated,
			};
		});
	};

	const handleClickRun = useCallback(() => {
		const finalPrompt = info.parsedPrompt
			.map((part) =>
				part.type === 'text'
					? part.value
					: info.dynamicValues[part.value] || `[${part.value}]`,
			)
			.join('');

		updateStateValues({ activePromptForChat: finalPrompt });
		closeModal();
		navigate(`/chat/${ObjectID().toString()}`);
	}, [info, updateStateValues, closeModal, navigate]);

	const handleFeedbackClick = (feedback) => {
		setInfo((prev) => ({ ...prev, feedbackPopupOpen: true, feedback }));
	};

	const handleFeedbackSubmit = () => {
		setInfo((prev) => ({ ...prev, feedbackPopupOpen: false }));
	};

	const handleFeedbackSelect = (feedback) => {
		console.log(feedback);
		setInfo((prev) => ({ ...prev, selectedFeedback: feedback.id }));
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className="promptPopupContainer">
				<div className="promptPopupContainerHeader">
					<div className="promptPopupContainerHeaderLeft">
						<div className="promptPopupContainerHeaderLeftTitle">
							{!info?.feedbackPopupOpen
								? selectedCard?.title
								: `Hey, I'm learning from you!`}
						</div>
					</div>
					<div className="promptPopupContainerHeaderRight">
						<button
							className={`${info?.feedback === 'like' ? 'active' : ''}`}
							onClick={() => handleFeedbackClick('like')}
						>
							<ThumbsUp />
						</button>
						<button
							className={`${info?.feedback === 'dislike' ? 'active' : ''}`}
							onClick={() => handleFeedbackClick('dislike')}
						>
							<ThumbsDown />
						</button>
					</div>
				</div>

				{!info.feedbackPopupOpen && (
					<div className="promptPopupContainerEditableFields">Editable Fields</div>
				)}

				<div className="promptPopupContainerBody">
					{info?.feedbackPopupOpen ? (
						<div className="feedbackInputContainer">
							<h4>Your thoughts help me improve how I respond next time.</h4>
							<textarea
								placeholder="Want to share what didn’t quite hit the mark? I’m all ears."
								className="feedbackInput"
							></textarea>
						</div>
					) : (
						<div
							className="promptPopupContainerBodyText"
							style={{ whiteSpace: 'pre-wrap' }}
						>
							{info.parsedPrompt.map((part, index) => {
								if (part.type === 'text') {
									return <span key={index}>{part.value}</span>;
								} else if (part.type === 'variable') {
									return (
										<span key={index} style={spanStyles}>
											<span
												contentEditable
												suppressContentEditableWarning
												style={{
													borderBottom: '1px dashed var(--stroke)',
													padding: '0 4px',
													color: 'var(--primary-font)',
													outline: 'none',
												}}
												onBlur={(e) =>
													handleVariableChange(
														part.value,
														e.target.innerText,
													)
												}
												dangerouslySetInnerHTML={{
													__html:
														info.dynamicValues[part.value] ||
														part.value,
												}}
											/>
										</span>
									);
								}
								return null;
							})}
						</div>
					)}
				</div>

				{info.selectedOptions?.[selectedCard?.id]?.length > 0 && (
					<div className="promptPopupContainerSelectedFilesDiv">
						{info.selectedOptions[selectedCard.id].map((file, index) => (
							<div className="promptPopupContainerEachSelectedFile" key={index}>
								<div className="promptPopupContainerEachSelectedFileText">
									{file}
								</div>
								<CrossSvg
									onClick={() => handleRemoveSelectedFile(file)}
									style={{ cursor: 'pointer' }}
								/>
							</div>
						))}
					</div>
				)}

				{info?.feedbackPopupOpen && (
					<div className="feedbacks-container" style={{ color: 'white' }}>
						{dummyFeedbacks.map((feedback) => (
							<span
								className={`feedback-label ${
									info?.selectedFeedback === feedback?.id
										? 'selected-feedback'
										: ''
								}`}
								onClick={() => handleFeedbackSelect(feedback)}
								key={feedback.id}
							>
								{feedback.label}
							</span>
						))}
					</div>
				)}

				<div className="promptPopupFooter">
					<div className="leftPart">
						<span>70%</span>
					</div>
					<div className="rightPart">
						<button
							className="cancel"
							onClick={() => {
								setInfo((prev) => ({ ...prev, feedbackPopupOpen: false }));
								closeModal();
							}}
						>
							Cancel
						</button>
						<button
							className="runPrompt"
							onClick={
								info?.feedbackPopupOpen ? handleFeedbackSubmit : handleClickRun
							}
						>
							{info?.feedbackPopupOpen ? (
								'Submit'
							) : (
								<>
									Run this prompt <ArrowUpRight />
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(PromptPopup);
