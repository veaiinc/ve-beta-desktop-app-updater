import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/home_page/modals/aiQuestionsModal.scss';
import ReactModal from '../index';
import { ReactComponent as QuestionSvg } from '../../../../assets/svg/home_page/question.svg';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import OptionsDropdown from './OptionsDropdown';

const getPlatformRegex = {
	linkedin: /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/.*$/,
	instagram: /^https?:\/\/([a-z]{2,3}\.)?instagram\.com\/.*$/,
	facebook: /^https?:\/\/([a-z]{2,3}\.)?facebook\.com\/.*$/,
	twitter: /^https?:\/\/([a-z]{2,3}\.)?(twitter\.com|x\.com)\/.*$/,
};

const AIQuestionsModal = ({ open, onClose, data }) => {
	const [info, setInfo] = useState({
		isUpdated: false,
		submittingAnswers: false,
		questions: [],
		independentQuestions: [],
	});

	const {
		templates: { updateAiQuestions, updateStateValues, aiQuestions },
	} = useContext(Context);

	useEffect(() => {
		if (data?.questions?.length > 0) {
			const questions = data?.questions || [];
			let independentQuestions = [];
			if (data?.type === 'userPersona' && data?.independentQuestions?.length) {
				independentQuestions = data?.independentQuestions;
			}
			setInfo((prev) => ({ ...prev, questions, independentQuestions }));
		}
	}, [data]);

	useEffect(() => {
		if (!open) {
			setInfo((prev) => ({
				...prev,
				submittingAnswers: false,
				questions: [],
				isUpdated: false,
			}));
		}
	}, [open]);

	const validateURL = (type, url) => {
		const regex = getPlatformRegex[type];
		return regex?.test(url);
	};

	const handleSubmit = async () => {
		try {
			setInfo((prev) => ({ ...prev, submittingAnswers: true }));
			const questions = info?.questions;
			const independentQuestions = info?.independentQuestions;
			let error = null;
			const type = data?.type || '';

			independentQuestions?.forEach((item) => {
				const answer = item?.answer || '';
				if (type === 'userPersona' && (!answer || answer?.length === 0)) {
					error = 'You need to answer first question';
				}
			});

			questions?.forEach((item) => {
				const platform = item?.platform,
					answer = item?.answer;

				if (type === 'userPersona' && platform && answer) {
					const isValidAnswer = validateURL(platform, answer);
					if (!isValidAnswer) {
						error = `Please enter a valid URL for ${platform}`;
					}
				}
			});

			if (error) {
				throw new Error(error);
			}

			const payload = {
				questions,
				...(type === 'userPersona' &&
					independentQuestions?.length > 0 && { independentQuestions }),
			};
			const id = data?._id;

			const response = await updateAiQuestions(payload, id);
			if (response?.[0] === true) {
				const data = aiQuestions?.data?.map((eachItem) => {
					if (eachItem?._id === response?.[1]?._id) {
						return response?.[1];
					}
					return eachItem;
				});
				updateStateValues({ aiQuestions: { ...aiQuestions, data } });
				onClose?.();
			} else {
				throw new Error();
			}
		} catch (error) {
			message.error(error?.message || 'Something went wrong!');
		} finally {
			setInfo((prev) => ({
				...prev,
				submittingAnswers: false,
				isUpdated: false,
			}));
		}
	};

	const handleInputChange = useCallback((e, index) => {
		const value = e?.target?.value;
		setInfo((prev) => ({
			...prev,
			isUpdated: true,
			questions: prev?.questions?.map((item, i) => {
				if (i === index)
					return {
						...item,
						answer: value,
					};
				return item;
			}),
		}));
	}, []);

	const handleIndependentQuestionInputChange = useCallback((e, index) => {
		const value = e?.target?.value;
		setInfo((prev) => ({
			...prev,
			isUpdated: true,
			independentQuestions: prev?.independentQuestions?.map((item, i) => {
				if (i === index)
					return {
						...item,
						answer: value,
					};
				return item;
			}),
		}));
	}, []);

	const handleOptionClick = useCallback((questionIndex, value) => {
		setInfo((prev) => ({
			...prev,
			isUpdated: true,
			questions: prev?.questions?.map((item, i) => {
				if (i === questionIndex)
					return {
						...item,
						answer: value,
					};
				return item;
			}),
		}));
	}, []);

	return (
		<ReactModal
			isOpen={open}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{ overlay: { zIndex: 9999 } }}
		>
			{info?.questions?.length && (
				<div className="ai-questions-modal-container">
					<div className="modal-header">
						<div className="icon-container">
							<QuestionSvg />
						</div>
						<div className="modal-title">Help me understand you more </div>
					</div>

					<div className="modal-content">
						<div className="questions-container">
							{info?.independentQuestions?.map((question, index) => {
								return (
									<div className="question-container" key={index}>
										<div className="question-text">
											{`${question?.question || ''}` || ''}
										</div>
										<input
											type={question?.answerType || 'text'}
											className="answer-input"
											placeholder="Type your answer"
											value={question?.answer || ''}
											onChange={(e) =>
												handleIndependentQuestionInputChange(e, index)
											}
										/>
									</div>
								);
							})}
							{info?.questions?.map((question, index) => {
								const answer = question?.answer || '';
								const options = question?.options;
								return (
									<div className="question-container" key={index}>
										<div className="question-text">
											{`${question?.question || ''}` || ''}
										</div>

										{options?.length > 0 ? (
											<div className="answer-container-with-options">
												<input
													type={question?.answerType || 'text'}
													className="input-element"
													placeholder="Enter answer / Select from option"
													value={answer}
													onChange={(e) => handleInputChange(e, index)}
												/>
												<OptionsDropdown
													options={options}
													value={answer}
													questionIndex={index}
													onOptionClick={handleOptionClick}
												>
													<div className="icon-container">
														<ChevronRightThinSvg />
													</div>
												</OptionsDropdown>
											</div>
										) : (
											<input
												type={question?.answerType || 'text'}
												className="answer-input"
												placeholder="Type your answer"
												value={answer}
												onChange={(e) => handleInputChange(e, index)}
											/>
										)}
									</div>
								);
							})}
						</div>
						<div className="btns-container">
							<div className="btn ignore-btn" onClick={onClose}>
								Discard
							</div>
							<button
								className="btn submit-btn"
								onClick={handleSubmit}
								disabled={!info?.isUpdated || info?.submittingAnswers}
								style={{
									opacity: info?.isUpdated || info?.submittingAnswers ? 1 : 0.5,
									cursor:
										info?.isUpdated || info?.submittingAnswers
											? 'pointer'
											: 'not-allowed',
								}}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}
		</ReactModal>
	);
};

export default memo(AIQuestionsModal);
