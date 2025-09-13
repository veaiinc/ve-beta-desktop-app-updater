import { Fragment, memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import s from './aiTranscriptionSuggestions.module.scss';
import { ReactComponent as CloseIcon } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as QuestionSvg } from '../../../assets/svg/question.svg';
import { ReactComponent as MemorySvg } from '../../../assets/svg/memory.svg';
import { ReactComponent as VeLogoSvg } from '../../../assets/svg/veLogo.svg';
import Context from '../../../context/context';
import { fileTypeIcons, redirectTo, redirectTypeMapper } from '../../../helpers';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as UserIcon } from '../../../assets/svg/transcription/userIcon.svg';
import { ReactComponent as NeedHelpIcon } from '../../../assets/svg/transcription/neddhelp.svg';
import { ReactComponent as ActionIcon } from '../../../assets/svg/transcription/action.svg';

const AiTranscriptionSuggestions = ({
	closeModal,
	showAmbientAssistance,
	userQuestions = [],
	aiQuestions = [],
	actions = [],
	files = [],
	activeTab = null,
	allSuggestions = [],
}) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);
	const [searchParams, setSearchParams] = useSearchParams();
	const sessionId = searchParams.get('sId');
	// const [info, setInfo] = useState({
	// 	sessionId: null,
	// });
	const bodyRef = useRef(null);
	// useEffect(() => {
	// 	if (aiTranscriptionSuggestions) {
	// 		const questions = aiTranscriptionSuggestions?.prompts?.filter(
	// 			(prompt) =>
	// 				prompt?.entity === 'user' ||
	// 				(prompt?.entity === 'agent' && prompt?.type === 'search'),
	// 		);
	// 		const actions = aiTranscriptionSuggestions?.prompts?.filter(
	// 			(prompt) => prompt?.entity === 'agent' && prompt?.type === 'action',
	// 		);
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			questions,
	// 			actions,
	// 			files: aiTranscriptionSuggestions?.similar_files || [],
	// 		}));
	// 	}
	// }, [aiTranscriptionSuggestions]);

	// useEffect(() => {
	// 	return () => {
	// 		updateStateValues({
	// 			aiTranscriptionSuggestions: null,
	// 		});
	// 	};
	// }, []);

	// useEffect(() => {
	// 	if (searchParams.get('sId')) {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			sessionId: searchParams.get('sId'),
	// 		}));
	// 	}
	// }, [searchParams]);

	useEffect(() => {
		if (!bodyRef.current) return;

		bodyRef.current.scrollTo({
			top: bodyRef.current.scrollHeight,
			behavior: 'smooth',
		});
	}, [
		allSuggestions?.length,
		userQuestions?.length,
		aiQuestions?.length,
		actions?.length,
		files?.length,
	]);

	// useEffect(() => {
	// 	if (!bodyRef.current) return;
	// 	if (userQuestions?.length > 0) {
	// 		bodyRef.current.scrollTo({
	// 			top: bodyRef.current.scrollHeight,
	// 			behavior: 'smooth',
	// 		});
	// 	}
	// }, [userQuestions?.length]);

	// useEffect(() => {
	// 	if (!bodyRef.current) return;
	// 	if (aiQuestions?.length > 0) {
	// 		bodyRef.current.scrollTo({
	// 			top: bodyRef.current.scrollHeight,
	// 			behavior: 'smooth',
	// 		});
	// 	}
	// }, [aiQuestions?.length]);

	// useEffect(() => {
	// 	if (!bodyRef.current) return;
	// 	if (actions?.length > 0) {
	// 		bodyRef.current.scrollTo({
	// 			top: bodyRef.current.scrollHeight,
	// 			behavior: 'smooth',
	// 		});
	// 	}
	// }, [actions?.length]);

	// useEffect(() => {
	// 	if (!bodyRef.current) return;

	// 	if (files?.length > 0) {
	// 		bodyRef.current.scrollTo({
	// 			top: bodyRef.current.scrollHeight,
	// 			behavior: 'smooth',
	// 		});
	// 	}
	// }, [files?.length]);

	const handleActionClick = useCallback(
		(prompt, isAskAi = false) => {
			if (prompt && sessionId) {
				const newParams = new URLSearchParams(searchParams);
				newParams.set('chat', 'true');
				setSearchParams(newParams);
				updateStateValues({
					activePromptForChat: {
						prompt,
						sessionId,
					},
					...(isAskAi && {
						isDirectSearchAgent: true,
					}),
				});
			}
		},
		[sessionId],
	);

	const handleFileClick = useCallback((file) => {
		redirectTo?.(file?.type, file?.[redirectTypeMapper?.[file?.type]]);
	}, []);

	const uniqueFiles = [];
	const seen = new Set();
	files?.forEach((file) => {
		const id = file.source || file.s3_key || file.name;
		if (!seen.has(id)) {
			seen.add(id);
			uniqueFiles.push(file);
		}
	});

	const renderAllSuggestions = (suggestion) => {
		if (suggestion.entity === 'user') {
			return (
				<div
					className={s.userQuestionContainer}
					// onClick={() => handleActionClick(suggestion?.prompt || '')}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<UserIcon />
						<div className={s.questionText}>{suggestion?.prompt || ''}</div>
					</div>

					{/* <button className={s.askUserButton}>Ask User</button> */}
				</div>
			);
		}
		if (suggestion.entity === 'agent' && suggestion.type === 'search') {
			return (
				<div
					className={s.aiQuestionContainer}
					onClick={() => handleActionClick(suggestion?.prompt || '', true)}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<NeedHelpIcon />
						<div className={s.questionText}>{suggestion?.prompt || ''}</div>
					</div>
					{/* <div className={s.needHelpButton}>Need help?</div> */}
				</div>
			);
		}
		if (suggestion.entity === 'agent' && suggestion.type === 'action') {
			return (
				<div
					className={s.actionsContainer}
					onClick={() => handleActionClick(suggestion?.prompt || '')}
				>
					{/* <div className={s.dot}></div> */}
					<ActionIcon />
					<div className={s.actionDetails}>
						<div className={s.actionName}>{suggestion?.prompt}</div>
						{/* <div className={s.promptText}>{suggestion?.prompt || ''}</div> */}
						{/* <button className={s.takeActionButton}>Run</button> */}
					</div>
				</div>
			);
		}
		if (suggestion.entity === 'file') {
			return (
				<div className={s.filesContainer} onClick={() => handleFileClick(suggestion)}>
					<div className={s.file}>{suggestion?.name}</div>
				</div>
			);
		}
		if (suggestion.entity === '') {
			return (
				<div
					className={s.aiQuestionContainer}
					onClick={() => handleActionClick(suggestion?.prompt || '', true)}
				>
					<div className={s.questionText}>{suggestion?.prompt || ''}</div>
				</div>
			);
		}
	};

	return (
		<div
			className={s.aiTranscriptionSuggestions}
			// style={{
			// 	width: showAmbientAssistance ? '600px' : '0px',
			// }}
		>
			{/* <div className={s.header}>
				<div className={s.leftContainer}>
					<div className={s.closeIconContainer} onClick={closeModal}>
						<CloseIcon />
					</div>
					<div className={s.text}>Ambient Assistance</div>
				</div>
			</div> */}

			<div
				className={s.body}
				ref={bodyRef}
				style={{
					gap: activeTab === 'all' ? '48px' : '24px',
				}}
			>
				{activeTab === 'all' && (
					<div className={s.allSuggestionsContainer}>
						{allSuggestions?.map((suggestion, index) => (
							<Fragment key={suggestion?.reference_id || suggestion?.id || index}>
								{renderAllSuggestions(suggestion)}
							</Fragment>
						))}

						{allSuggestions?.length === 0 && (
							<div className="meet-transcript-empty">No data.</div>
						)}
					</div>
				)}

				{activeTab === 'userQuestions' && (
					<div className={s.userQuestionsContainer}>
						{userQuestions?.map((question, index) => {
							return (
								<div
									className={s.userQuestion}
									key={question?.reference_id || question?.id || index}
								>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '12px',
										}}
									>
										<UserIcon />
										<div className={s.questionText}>
											{question?.prompt || ''}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{activeTab === 'aiQuestions' && (
					<div className={s.aiQuestionsContainer}>
						{aiQuestions?.map((question, index) => {
							return (
								<div
									className={s.aiQuestion}
									key={question?.reference_id || question?.id || index}
									onClick={() =>
										handleActionClick(
											question?.query || question?.prompt || '',
											true,
										)
									}
								>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '12px',
										}}
									>
										<NeedHelpIcon />
										<div className={s.questionText}>
											{question?.query || question?.prompt}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{activeTab === 'actions' && (
					<div className={s.actionsContainer}>
						{actions?.map((action, index) => (
							<div
								className={s.action}
								key={action?.reference_id || action?.id || index}
								onClick={() =>
									handleActionClick(action?.query || action?.prompt || '')
								}
							>
								{/* <div className={s.dot}></div> */}
								<ActionIcon />
								<div className={s.actionDetails}>
									<div className={s.actionName}>{action?.prompt || ''}</div>
									{/* <button className={s.takeActionButton}>Run</button> */}
								</div>
							</div>
						))}
					</div>
				)}

				{activeTab === 'files' && (
					<div className={s.filesContainer}>
						{uniqueFiles.map((file, index) => (
							<div
								className={s.file}
								key={
									file?.reference_id ||
									file?.id ||
									file?.s3_key ||
									file?.name ||
									index
								}
								onClick={() => handleFileClick(file)}
							>
								<div className={s.fileIcon}>
									{fileTypeIcons[
										file?.type === 's3_key'
											? file?.name?.match(/\.(\w+)$/)?.[1] // to check the file format
											: file?.type
									] || <VeLogoSvg />}
								</div>
								<div className={s.fileName}>{file?.name}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(AiTranscriptionSuggestions);
