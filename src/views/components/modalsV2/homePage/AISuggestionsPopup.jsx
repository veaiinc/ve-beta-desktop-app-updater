import { memo, useContext, useEffect, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/home_page/modals/aiSuggestionsPopup.scss';
import Context from '../../../../context/context';
import { useNavigate } from 'react-router-dom';

const AISuggestionsPopup = ({ open, closeModal, data }) => {
	const {
		templates: { updateStateValues, currentSessionId },
	} = useContext(Context);
	const [info, setInfo] = useState({
		questionsAnswers: {},
		dynamicPrompt: data?.researchTopics?.[0]?.prompt || '',
	});
	const navigate = useNavigate();

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			dynamicPrompt: data?.researchTopics?.[0]?.prompt || '',
		}));
	}, [data]);

	const handleRunBtnClick = () => {
		let prompt = info?.dynamicPrompt;
		let questions = data?.informationRequests;
		let hasAnswer = false; // Track if there's at least one valid answer

		if (questions?.length > 0) {
			Object?.keys(info?.questionsAnswers)?.forEach((key) => {
				if (info?.questionsAnswers?.[key]?.trim()?.length > 0) {
					hasAnswer = true; // Set to true if any answer is valid
				}
			});

			if (!hasAnswer) {
				updateStateValues({ activePromptForChat: prompt });
				navigate(`/chat/${currentSessionId}`);
				return;
			}

			prompt += '\n\n';
			prompt += 'These are answers of your questions : \n';
			questions?.forEach((questionData, index) => {
				if (info?.questionsAnswers?.[index]?.trim()?.length > 0) {
					prompt += `Q${index + 1} : ${questionData?.question}\n`;
					prompt += `A${index + 1} : ${info?.questionsAnswers?.[index]}\n\n`;
				}
			});
		}
		updateStateValues({ activePromptForChat: prompt });
		navigate(`/chat/${currentSessionId}`);
	};

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="popup-container">
				<div className="title-container">{data?.researchTopics?.[0]?.title || ''}</div>
				<div className="description-container">
					{data?.researchTopics?.[0]?.description || ''}
				</div>
				<div className="source-container">
					<div className="module-type-container">
						<div className="text-container">Triggered Source</div>
						<div className="module-type-text">{data?.moduleType || ''}</div>
					</div>
				</div>
				{data?.researchTopics?.length > 0 && (
					<div className="prompt-container">
						<div className="prompt-title">Prompt</div>
						<textarea
							className="prompt-text"
							onChange={(e) => {
								setInfo({
									...info,
									dynamicPrompt: e?.target?.value,
								});
							}}
							value={info?.dynamicPrompt}
						></textarea>
					</div>
				)}
				{data?.informationRequests?.length > 0 && (
					<div className="questions-container">
						<div className="title">Clarify</div>
						{data?.informationRequests?.map((questionData, index) => (
							<div className="question-container">
								<div className="question">{questionData?.question || ''}</div>
								<input
									type="text"
									className="answer-input"
									placeholder="Enter your answer..."
									value={info?.questionsAnswers?.[index] || ''}
									onChange={(e) => {
										setInfo({
											...info,
											questionsAnswers: {
												...info?.questionsAnswers,
												[index]: e?.target?.value,
											},
										});
									}}
								/>
							</div>
						))}
					</div>
				)}

				<button className="run-btn" onClick={handleRunBtnClick}>
					Run
				</button>
			</div>
		</ReactModal>
	);
};

export default memo(AISuggestionsPopup);
