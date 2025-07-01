import { memo, useCallback, useContext } from 'react';
import s from './AiTranscriptionSuggestions.module.scss';
import { ReactComponent as CloseIcon } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import Context from '../../../context/context';

const AiTranscriptionSuggestions = ({ closeModal }) => {
	const {
		templates: { aiTranscriptionSuggestions, updateStateValues },
	} = useContext(Context);
	const userQuestions = aiTranscriptionSuggestions?.prompts?.filter(
		(prompt) => prompt?.entity === 'user',
	);
	const aiQuestions = aiTranscriptionSuggestions?.prompts?.filter(
		(prompt) => prompt?.entity === 'agent',
	);

	const handleActionClick = useCallback(
		(prompt) => {
			updateStateValues({
				activePromptForChat: prompt,
			});
		},
		[updateStateValues],
	);

	return (
		<div className={s.aiTranscriptionSuggestions}>
			<div className={s.header}>
				<div className={s.leftContainer}>
					{/* <div className={s.closeIconContainer} onClick={closeModal}>
						<CloseIcon />
					</div> */}
					<div className={s.text}>Ambient Assistance</div>
				</div>
			</div>

			<div className={s.body}>
				{userQuestions?.length > 0 && (
					<div className={s.suggestedQuestionsContainer}>
						{userQuestions?.map((question, index) => (
							<div className={s.suggestedUserQuestion} key={index}>
								<div className={s.questionContainer}>
									{/* <div className={s.questionType}>Detected Question</div> */}
									{/* <div className={s.questionText}>{question?. || ''}</div> */}
								</div>
								<div className={s.answerContainer}>
									{/* <div className={s.text}>Suggested Answer to say</div> */}
									<div className={s.answerText}>{`"${
										question?.query || ''
									}"`}</div>
								</div>
							</div>
						))}
					</div>
				)}

				{Object?.keys(aiTranscriptionSuggestions?.responses || {})?.map((key, index) => (
					<div className={s.suggestedUserQuestion} key={index}>
						<div className={s.questionContainer}>
							{/* <div className={s.questionType}>Detected Question</div> */}
							{/* <div className={s.questionText}>{question?. || ''}</div> */}
						</div>
						<div className={s.answerContainer}>
							<div className={s.text}>Response</div>
							<div className={s.answerText}>{`"${
								aiTranscriptionSuggestions?.responses?.[key] || ''
							}"`}</div>
						</div>
					</div>
				))}

				{aiQuestions?.length > 0 && (
					<div className={s.actionsWrapper}>
						<div className={s.text}>Actions</div>
						<div className={s.actionsContainer}>
							{aiQuestions?.map((question, index) => (
								<div
									className={s.actionContainer}
									key={index}
									onClick={() => handleActionClick(question?.query || '')}
								>
									<ArrowRightSvg style={{ flexShrink: 0 }} />
									{question?.query || ''}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(AiTranscriptionSuggestions);
