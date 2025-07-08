import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import s from './aiTranscriptionSuggestions.module.scss';
import { ReactComponent as CloseIcon } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as MemorySvg } from '../../../assets/svg/memory.svg';
import { ReactComponent as VeLogoSvg } from '../../../assets/svg/veLogo.svg';
import Context from '../../../context/context';
import { fileTypeIcons, redirectTo, redirectTypeMapper } from '../../../helpers';
import { Switch } from 'antd';

const AiTranscriptionSuggestions = ({ closeModal, showAmbientAssistance }) => {
	const {
		templates: { aiTranscriptionSuggestions, updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		userQuestions: [],
		aiQuestions: [],
		files: [],
	});
	const aiQuestionsRef = useRef(null);
	const userQuestionsRef = useRef(null);
	const filesRef = useRef(null);

	useEffect(() => {
		if (aiTranscriptionSuggestions) {
			const userQuestions = aiTranscriptionSuggestions?.prompts?.filter(
				(prompt) => prompt?.entity === 'user',
			);
			const aiQuestions = aiTranscriptionSuggestions?.prompts?.filter(
				(prompt) => prompt?.entity === 'agent',
			);

			setInfo((prev) => ({
				...prev,
				userQuestions,
				aiQuestions,
				files: aiTranscriptionSuggestions?.similar_files || [],
			}));
		}
		return () => {
			// Clear local state
			setInfo({
				userQuestions: [],
				aiQuestions: [],
				files: [],
			});
			// Clear context data
			updateStateValues({
				aiTranscriptionSuggestions: null,
				activePromptForChat: null,
			});
		};
	}, [aiTranscriptionSuggestions]);

	useEffect(() => {
		if (!userQuestionsRef.current) return;
		if (info?.userQuestions?.length > 0) {
			userQuestionsRef.current.scrollTo({
				top: userQuestionsRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [info?.userQuestions?.length]);

	useEffect(() => {
		if (!aiQuestionsRef.current) return;
		if (info?.aiQuestions?.length > 0) {
			aiQuestionsRef.current.scrollTo({
				top: aiQuestionsRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [info?.aiQuestions?.length]);

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
				{info?.userQuestions?.length > 0 && (
					<div
						className={s.suggestedQuestionsContainer}
						style={{
							height:
								info?.aiQuestions?.length > 0 || info?.files?.length > 0
									? '40vh'
									: '100%',
						}}
						ref={userQuestionsRef}
					>
						{info?.userQuestions?.map((question, index) => (
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

									{question?.is_memory_used && (
										<div className={s.extraInfo}>
											<div className={s.horizontalLine}></div>
											<div className={s.isMemoryUsed}>
												<MemorySvg />
												Memory Used
											</div>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}

				{info?.aiQuestions?.length > 0 && (
					<div className={s.actionsWrapper}>
						<div className={s.text}>Actions</div>
						<div className={s.actionsContainer} ref={aiQuestionsRef}>
							{info?.aiQuestions?.map((question, index) => (
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
