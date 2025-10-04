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
import Spinner from '../loaders/Spinner';

const AiTranscriptionSuggestions = ({
	closeModal,
	showAmbientAssistance,
	userQuestions = [],
	aiQuestions = [],
	actions = [],
	files = [],
	activeTab = null,
	allSuggestions = [],
	revampedPrompt = [],
	isRevampedPromptLoading = false,
	isRevampedPrompt = false,
	sessionId,
	meetingId, // Add meetingId prop
}) => {
	const {
		templates: { updateStateValues, aiTranscriptionSuggestions },
		notes: { getRevampedPrompt },
	} = useContext(Context);
	const [searchParams, setSearchParams] = useSearchParams();
	
	// Local state for data and loading (following MeetSummary/MeetingAnalytics pattern)
	const [processedData, setProcessedData] = useState({
		userQuestions: [],
		aiQuestions: [],
		actions: [],
		files: [],
		allSuggestions: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [revampedPromptLoading, setRevampedPromptLoading] = useState(false);
	const [revampedPromptError, setRevampedPromptError] = useState(null);
	
	const bodyRef = useRef(null);

	// Fetch suggestions data (following MeetSummary/MeetingAnalytics pattern)
	const fetchSuggestionsData = async () => {
		if (!meetingId) {
			setError('No meeting ID provided');
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Check if we have props data (from parent component)
			const hasPropsData = userQuestions.length > 0 || aiQuestions.length > 0 || actions.length > 0 || files.length > 0 || allSuggestions.length > 0;
			
			if (hasPropsData) {
				// Use props data (already processed by parent)
				setProcessedData({
					userQuestions,
					aiQuestions,
					actions,
					files,
					allSuggestions,
				});
				setIsLoading(false);
			} else if (aiTranscriptionSuggestions && aiTranscriptionSuggestions?.suggestions?.length > 0) {
				// Process context data directly
				const allThreads = [];
				const askUser = [];
				const needHelp = [];
				const actionsList = [];
				const filesList = [];

				aiTranscriptionSuggestions.suggestions.forEach((suggestion) => {
					if (suggestion.entity === 'user') {
						askUser.push(suggestion);
					} else if (suggestion.entity === 'agent' && suggestion.type === 'search') {
						needHelp.push(suggestion);
					} else if (suggestion.entity === 'agent' && suggestion.type === 'action') {
						actionsList.push(suggestion);
					} else if (suggestion.entity === 'file') {
						filesList.push(suggestion);
					}
					allThreads.push(suggestion);
				});

				setProcessedData({
					userQuestions: askUser,
					aiQuestions: needHelp,
					actions: actionsList,
					files: filesList,
					allSuggestions: allThreads,
				});
				setIsLoading(false);
			} else {
				// No data available
				setProcessedData({
					userQuestions: [],
					aiQuestions: [],
					actions: [],
					files: [],
					allSuggestions: [],
				});
				setIsLoading(false);
			}
		} catch (err) {
			setError('Error fetching suggestions data');
			console.error('Error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch revamped prompt data (following MeetSummary/MeetingAnalytics pattern)
	const fetchRevampedPrompt = async () => {
		if (!meetingId || !isRevampedPrompt) {
			setRevampedPromptLoading(false);
			return;
		}

		setRevampedPromptLoading(true);
		setRevampedPromptError(null);

		try {
			console.log('Fetching revamped prompt for meetingId:', meetingId);
			await getRevampedPrompt({ meetingId });
		} catch (err) {
			setRevampedPromptError('Error fetching revamped prompt');
			console.error('Error fetching revamped prompt:', err);
		} finally {
			setRevampedPromptLoading(false);
		}
	};

	useEffect(() => {
		fetchSuggestionsData();
	}, [meetingId, userQuestions, aiQuestions, actions, files, allSuggestions, aiTranscriptionSuggestions]);

	useEffect(() => {
		if (isRevampedPrompt) {
			fetchRevampedPrompt();
		}
	}, [meetingId, isRevampedPrompt]);

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

	const renderRevampedPrompt = (prompt) => {
		if (prompt.entity === 'user') {
			return (
				<div
					className={s.userQuestionContainer}
					onClick={() => handleActionClick(prompt?.prompt || '')}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<UserIcon />
						<div className={s.questionText}>{prompt?.prompt || ''}</div>
					</div>

					{/* <button className={s.askUserButton}>Ask User</button> */}
				</div>
			);
		}
		if (prompt.entity === 'search_agent') {
			return (
				<div
					className={s.aiQuestionContainer}
					onClick={() => handleActionClick(prompt?.prompt || '', true)}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<NeedHelpIcon />
						<div className={s.questionText}>{prompt?.prompt || ''}</div>
					</div>
					{/* <div className={s.needHelpButton}>Need help?</div> */}
				</div>
			);
		}
		if (prompt.entity.endsWith('_agent')) {
			return (
				<div
					className={s.actionsContainer}
					onClick={() => handleActionClick(prompt?.prompt || '')}
				>
					{/* <div className={s.dot}></div> */}
					<ActionIcon />
					<div className={s.actionDetails}>
						<div className={s.actionName}>{prompt?.prompt}</div>
						{/* <div className={s.promptText}>{prompt?.prompt || ''}</div> */}
						{/* <button className={s.takeActionButton}>Run</button> */}
					</div>
				</div>
			);
		}
		if (prompt.entity === 'file') {
			return (
				<div className={s.filesContainer} onClick={() => handleFileClick(prompt)}>
					<div className={s.file}>{prompt?.name}</div>
				</div>
			);
		}
		if (prompt.entity === '') {
			return (
				<div
					className={s.aiQuestionContainer}
					onClick={() => handleActionClick(prompt?.prompt || '', true)}
				>
					<div className={s.questionText}>{prompt?.prompt || ''}</div>
				</div>
			);
		}
	};

	// Render loading state (following MeetSummary/MeetingAnalytics pattern)
	if (isLoading) {
		return (
			<div className={s.aiTranscriptionSuggestions}>
				<div className={s.body}>
					<div className="meet-transcript-empty">
						<Spinner size={24} />
						<p style={{ color: '#94989e', fontSize: '14px', marginTop: '8px' }}>
							Loading suggestions...
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Render error state (following MeetSummary/MeetingAnalytics pattern)
	if (error) {
		return (
			<div className={s.aiTranscriptionSuggestions}>
				<div className={s.body}>
					<div className="meet-transcript-empty">
						<p style={{ color: '#94989e', fontSize: '14px' }}>
							No suggestions available
						</p>
					</div>
				</div>
			</div>
		);
	}

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
						{isRevampedPrompt ? (
							<>
								{revampedPromptLoading || isRevampedPromptLoading ? (
									<div className="meet-transcript-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
										<Spinner size={24} />
										<p style={{ color: '#94989e', fontSize: '14px', marginTop: '8px' }}>
											Loading meeting suggestions...
										</p>
									</div>
								) : revampedPromptError ? (
									<div className="meet-transcript-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
										<p style={{ color: '#94989e', fontSize: '14px' }}>
											No meeting suggestions available
										</p>
									</div>
								) : revampedPrompt?.length === 0 ? (
									<div className="meet-transcript-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
										<p style={{ color: '#94989e', fontSize: '14px' }}>
											No meeting suggestions available
										</p>
									</div>
								) : (
									revampedPrompt?.map((prompt, index) => (
										<Fragment key={prompt?.reference_id || prompt?.id || index}>
											{renderRevampedPrompt(prompt)}
										</Fragment>
									))
								)}
							</>
						) : (
							<>
								{processedData.allSuggestions?.length === 0 ? (
									<div className="meet-transcript-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
										<p style={{ color: '#94989e', fontSize: '14px' }}>
											No suggestions available
										</p>
									</div>
								) : (
									processedData.allSuggestions?.map((suggestion, index) => (
										<Fragment
											key={
												suggestion?.reference_id || suggestion?.id || index
											}
										>
											{renderAllSuggestions(suggestion)}
										</Fragment>
									))
								)}
							</>
						)}
					</div>
				)}

				{activeTab === 'userQuestions' && (
					<div className={s.userQuestionsContainer}>
						{processedData.userQuestions?.length === 0 ? (
							<div className="meet-transcript-empty">
								<p style={{ color: '#94989e', fontSize: '14px' }}>
									No user questions available
								</p>
							</div>
						) : (
							processedData.userQuestions?.map((question, index) => {
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
							})
						)}
					</div>
				)}

				{activeTab === 'aiQuestions' && (
					<div className={s.aiQuestionsContainer}>
						{processedData.aiQuestions?.length === 0 ? (
							<div className="meet-transcript-empty">
								<p style={{ color: '#94989e', fontSize: '14px' }}>
									No AI questions available
								</p>
							</div>
						) : (
							processedData.aiQuestions?.map((question, index) => {
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
							})
						)}
					</div>
				)}

				{activeTab === 'actions' && (
					<div className={s.actionsContainer}>
						{processedData.actions?.length === 0 ? (
							<div className="meet-transcript-empty">
								<p style={{ color: '#94989e', fontSize: '14px' }}>
									No actions available
								</p>
							</div>
						) : (
							processedData.actions?.map((action, index) => (
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
							))
						)}
					</div>
				)}

				{activeTab === 'files' && (
					<div className={s.filesContainer}>
						{uniqueFiles.length === 0 ? (
							<div className="meet-transcript-empty">
								<p style={{ color: '#94989e', fontSize: '14px' }}>
									No files available
								</p>
							</div>
						) : (
							uniqueFiles.map((file, index) => (
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
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(AiTranscriptionSuggestions);
