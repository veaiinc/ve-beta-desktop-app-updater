import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import s from './aiTranscriptionSuggestions.module.scss';
import { ReactComponent as CloseIcon } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as QuestionSvg } from '../../../assets/svg/question.svg';
import { ReactComponent as MemorySvg } from '../../../assets/svg/memory.svg';
import { ReactComponent as VeLogoSvg } from '../../../assets/svg/veLogo.svg';
import Context from '../../../context/context';
import { fileTypeIcons, redirectTo, redirectTypeMapper } from '../../../helpers';

const AiTranscriptionSuggestions = ({ closeModal, showAmbientAssistance }) => {
	const {
		templates: { aiTranscriptionSuggestions, updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		files: [],
		questions: [],
		actions: [],
	});
	const questionsRef = useRef(null);
	const filesRef = useRef(null);
	const actionsRef = useRef(null);

	useEffect(() => {
		if (aiTranscriptionSuggestions) {
			const questions = aiTranscriptionSuggestions?.prompts?.filter(
				(prompt) =>
					prompt?.entity === 'user' ||
					(prompt?.entity === 'agent' && prompt?.type === 'search'),
			);
			const actions = aiTranscriptionSuggestions?.prompts?.filter(
				(prompt) => prompt?.entity === 'agent' && prompt?.type === 'action',
			);
			setInfo((prev) => ({
				...prev,
				questions,
				actions,
				files: aiTranscriptionSuggestions?.similar_files || [],
			}));
		}
	}, [aiTranscriptionSuggestions]);

	useEffect(() => {
		return () => {
			updateStateValues({
				aiTranscriptionSuggestions: null,
			});
		};
	}, []);

	useEffect(() => {
		if (!questionsRef.current) return;
		if (info?.questions?.length > 0) {
			questionsRef.current.scrollTo({
				top: questionsRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [info?.questions?.length]);

	useEffect(() => {
		if (!actionsRef.current) return;
		if (info?.actions?.length > 0) {
			actionsRef.current.scrollTo({
				top: actionsRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [info?.actions?.length]);

	useEffect(() => {
		if (!filesRef.current) return;
		if (info?.files?.length > 0) {
			filesRef.current.scrollTo({
				bottom: filesRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [info?.files?.length]);

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
		<div
			className={s.aiTranscriptionSuggestions}
			style={{
				width: showAmbientAssistance ? '600px' : '0px',
			}}
		>
			<div className={s.header}>
				<div className={s.leftContainer}>
					{/* <div className={s.closeIconContainer} onClick={closeModal}>
						<CloseIcon />
					</div> */}
					<div className={s.text}>Ambient Assistance</div>
				</div>
			</div>

			<div className={s.body}>
				{info?.questions?.length > 0 && (
					<div
						className={s.questionsContainer}
						style={{
							height:
								info?.actions?.length > 0 || info?.files?.length > 0
									? '40vh'
									: '100%',
						}}
					>
						<div className={s.questionsHeading}>
							<QuestionSvg />
							Need Help
						</div>
						<div className={s.suggestedQuestionsContainer} ref={questionsRef}>
							{info?.questions?.map((question, index) => {
								return question?.entity === 'user' ? (
									<div className={s.wrapper}>
										<div className={s.suggestedUserQuestion} key={index}>
											<div className={s.answerContainer}>
												<div className={s.questionHeader}>
													<div className={s.text}>Ask User</div>
													{question?.is_memory_used && (
														<div className={s.isMemoryUsed}>
															<MemorySvg />
															Memory Used
														</div>
													)}
												</div>
												<div className={s.answerText}>{`"${
													question?.query || ''
												}"`}</div>
											</div>
										</div>
										<div className={s.horizontalLine}></div>
									</div>
								) : (
									<div className={s.wrapper}>
										<div className={s.suggestedAiQuestion} key={index}>
											<div className={s.answerContainer}>
												<div className={s.questionHeader}>
													<div className={s.text}>Ask AI</div>
													{question?.is_memory_used && (
														<div className={s.isMemoryUsed}>
															<MemorySvg />
															Memory Used
														</div>
													)}
												</div>
												<div
													className={s.answerText}
													onClick={() =>
														handleActionClick(question?.query || '')
													}
												>
													{`"${question?.query || ''}"`}
												</div>
											</div>
										</div>
										<div className={s.horizontalLine}></div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{info?.actions?.length > 0 && (
					<div className={s.actionsWrapper}>
						<div className={s.text}>Actions</div>
						<div className={s.actionsContainer} ref={actionsRef}>
							{info?.actions?.map((action, index) => (
								<div
									className={s.actionContainer}
									key={index}
									onClick={() => handleActionClick(action?.query || '')}
								>
									<ArrowRightSvg style={{ flexShrink: 0 }} />
									{action?.query || ''}
								</div>
							))}
						</div>
					</div>
				)}

				{info?.files?.length > 0 && (
					<div className={s.filesWrapper}>
						<div className={s.text}>Files</div>
						<div className={s.filesContainer} ref={filesRef}>
							{info?.files?.map((file, index) => (
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
