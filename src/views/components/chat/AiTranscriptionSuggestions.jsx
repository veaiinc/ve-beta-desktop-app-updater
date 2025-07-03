import { memo, useCallback, useContext } from 'react';
import s from './aiTranscriptionSuggestions.module.scss';
import { ReactComponent as CloseIcon } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as VeLogoSvg } from '../../../assets/svg/veLogo.svg';
import Context from '../../../context/context';
import { fileTypeIcons, redirectTo, redirectTypeMapper } from '../../../helpers';

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

	const handleFileClick = useCallback((file) => {
		redirectTo?.(file?.type, file?.[redirectTypeMapper?.[file?.type]]);
	}, []);

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
					<div
						className={s.suggestedQuestionsContainer}
						style={{
							height:
								aiQuestions?.length > 0 ||
								aiTranscriptionSuggestions?.similar_files?.length > 0
									? '40vh'
									: '100%',
						}}
					>
						{userQuestions?.map((question, index) => (
							<div className={s.suggestedUserQuestion} key={index}>
								{/* <div className={s.questionContainer}>
									<div className={s.questionType}>Detected Question</div>
									<div className={s.questionText}>{question?. || ''}</div>
								</div> */}
								<div className={s.answerContainer}>
									<div className={s.text}>Ask User</div>
									<div className={s.answerText}>{`"${
										question?.query || ''
									}"`}</div>
								</div>
							</div>
						))}
					</div>
				)}

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

				{aiTranscriptionSuggestions?.similar_files?.length > 0 && (
					<div className={s.filesWrapper}>
						<div className={s.text}>Files</div>
						<div className={s.filesContainer}>
							{aiTranscriptionSuggestions?.similar_files?.map((file, index) => (
								<div
									className={s.file}
									key={index}
									onClick={() => handleFileClick(file)}
								>
									{fileTypeIcons[
										file?.type === 's3_key'
											? file?.name?.match(/\.(\w+)$/)?.[1] // to check the file format
											: file?.type
									] || <VeLogoSvg />}
									<div className={s.fileName}>{file?.name}</div>
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
