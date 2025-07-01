import { memo, useCallback, useContext } from 'react';
import s from './AiTranscriptionSuggestions.module.scss';
import { ReactComponent as CloseIcon } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import Context from '../../../context/context';

const AiTranscriptionSuggestions = ({ closeModal }) => {
	const {
		aiSetup: { aiTranscriptionSuggestions },
		templates: { updateStateValues },
	} = useContext(Context);
	const userQuestions = aiTranscriptionSuggestions?.prompts_to_ask?.filter(
		(question) => question?.entity === 'user',
	) || [{}];
	const aiQuestions = aiTranscriptionSuggestions?.prompts_to_ask?.filter(
		(question) => question?.entity === 'agent',
	);

	const handleActionClick = useCallback(
		(question) => {
			updateStateValues({
				activePromptForChat: question?.prompt,
			});
		},
		[updateStateValues],
	);

	return (
		<div className={s.aiTranscriptionSuggestions}>
			<div className={s.header}>
				<div className={s.leftContainer}>
					<div className={s.closeIconContainer} onClick={closeModal}>
						<CloseIcon />
					</div>
					<div className={s.text}>Ambient Assistance</div>
				</div>
			</div>

			<div className={s.body}>
				<div className={s.suggestedQuestionsContainer}>
					{userQuestions?.map((question, index) => (
						<div className={s.suggestedUserQuestion} key={index}>
							<div className={s.questionContainer}>
								<div className={s.questionType}>Detected Question</div>
								<div className={s.questionText}>{question?.question || ''}</div>
							</div>
							<div className={s.answerContainer}>
								<div className={s.text}>Suggested Answer to say</div>
								<div className={s.answerText}>{`"${question?.answer || ''}"`}</div>
							</div>
						</div>
					))}
				</div>

				<div className={s.actionsWrapper}>
					<div className={s.text}>Actions</div>
					<div className={s.actionsContainer}>
						{aiQuestions?.map((question, index) => (
							<div
								className={s.actionContainer}
								key={index}
								onClick={handleActionClick(question)}
							>
								<ArrowRightSvg />
								{question?.prompt || 'kjnkemklsmkvse'}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AiTranscriptionSuggestions);
