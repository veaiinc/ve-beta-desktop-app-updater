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
						{(() => {
							const result = [];
							let currentFileGroup = [];

							allSuggestions
								?.filter((suggestion) => suggestion?.entity !== undefined)
								?.forEach((suggestion, index) => {
									if (
										suggestion?.entity === 'user' ||
										suggestion?.entity === 'other_user'
									) {
										// Flush any pending file group
										if (currentFileGroup.length > 0) {
											result.push(
												<div
													className={s.filesContainer}
													key={`files-${index}`}
												>
													{currentFileGroup}
												</div>,
											);
											currentFileGroup = [];
										}

										result.push(
											<div className={s.userQuestionContainer} key={index}>
												<div className={s.header}>Ask User</div>
												<div className={s.body}>
													<div className={s.questionText}>
														{suggestion?.query || ''}
													</div>
												</div>
											</div>,
										);
									} else if (
										suggestion?.entity === 'agent' ||
										suggestion?.entity?.includes('agent')
									) {
										// Flush any pending file group
										if (currentFileGroup.length > 0) {
											result.push(
												<div
													className={s.filesContainer}
													key={`files-${index}`}
												>
													{currentFileGroup}
												</div>,
											);
											currentFileGroup = [];
										}

										if (suggestion?.type === 'search') {
											result.push(
												<div className={s.aiQuestionContainer} key={index}>
													<div className={s.header}>Need help?</div>
													<div
														className={s.body}
														onClick={() =>
															handleActionClick(
																suggestion?.query || '',
																true,
															)
														}
													>
														<div className={s.questionText}>
															<div className={s.text}>
																{suggestion?.query || ''}
															</div>
														</div>
														{suggestion?.is_memory_used && (
															<div className={s.memoryUsedContainer}>
																<div className={s.memoryUsedText}>
																	<MemorySvg />
																	Memory Used
																</div>
																<div className={s.verticalLine} />
															</div>
														)}
													</div>
												</div>,
											);
										} else {
											result.push(
												<div className={s.actionsContainer} key={index}>
													<div
														className={s.actionContainer}
														onClick={() =>
															handleActionClick(
																suggestion?.query || '',
															)
														}
													>
														<div className={s.iconContainer}></div>
														{suggestion?.query || ''}
													</div>
													<div className={s.horizontalLine} />
												</div>,
											);
										}
									} else if (suggestion?.entity === 'file') {
										// This is a file - add to current file group
										currentFileGroup.push(
											<div
												className={s.file}
												key={index}
												onClick={() => handleFileClick(suggestion)}
											>
												<div className={s.fileIcon}>
													{fileTypeIcons[
														suggestion?.type === 's3_key'
															? suggestion?.name?.match(
																	/\.(\w+)$/,
															  )?.[1] // to check the file format
															: suggestion?.type
													] || <VeLogoSvg />}
												</div>
												<div className={s.fileName}>{suggestion?.name}</div>
											</div>,
										);
									}
								});

							// Flush any remaining file group
							if (currentFileGroup.length > 0) {
								result.push(
									<div className={s.filesContainer} key="files-final">
										{currentFileGroup}
									</div>,
								);
							}

							return result;
						})()}
						{allSuggestions?.length === 0 && (
							<div className="meet-transcript-empty">No data.</div>
						)}
					</div>
				)}

				{activeTab === 'userQuestions' && (
					<div className={s.userQuestionsContainer}>
						{userQuestions?.map((question, index) => {
							return (
								<div className={s.userQuestionContainer} key={index}>
									<div className={s.header}>Ask User</div>
									<div className={s.body}>
										<div className={s.questionText}>
											{question?.query || ''}
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
								<div className={s.aiQuestionContainer} key={index}>
									<div className={s.header}>Need help?</div>
									<div
										className={s.body}
										onClick={() =>
											handleActionClick(question?.query || '', true)
										}
									>
										<div className={s.questionText}>
											<div className={s.text}>{question?.query || ''}</div>
										</div>
										{question?.is_memory_used && (
											<div className={s.memoryUsedContainer}>
												<div className={s.memoryUsedText}>
													<MemorySvg />
													Memory Used
												</div>
												<div className={s.verticalLine} />
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}

				{activeTab === 'actions' && (
					<div className={s.actionsContainer}>
						{actions?.map((action, index) => (
							<>
								<div
									className={s.actionContainer}
									key={index}
									onClick={() => handleActionClick(action?.query || '')}
								>
									<div className={s.iconContainer}></div>
									{action?.query || ''}
								</div>
								<div className={s.horizontalLine} />
							</>
						))}
					</div>
				)}

				{activeTab === 'files' && (
					<div className={s.filesContainer}>
						{uniqueFiles.map((file, index) => (
							<div
								className={s.file}
								key={index}
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
