import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/home_page/modals/aiQuestionsModal.scss';
import ReactModal from '../index';
import { ReactComponent as QuestionSvg } from '../../../../assets/svg/home_page/question.svg';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';

const getPlatformRegex = {
	linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?$/,
	instagram: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
	facebook: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
	twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
};

const AIQuestionsModal = ({ open, onClose, data }) => {
	const [info, setInfo] = useState({
		isUpdated: false,
		submittingAnswers: false,
		questions: [],
	});

	const {
		templates: { updateAiQuestions, updateStateValues, aiQuestions },
	} = useContext(Context);

	useEffect(() => {
		if (data?.questions?.length > 0) {
			const questions = data?.questions?.map((question) => {
				const item = { actualQuestion: question };
				return item;
			});
			setInfo((prev) => ({ ...prev, questions }));
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
			let questions = info?.questions;
			let error = null;
			const type = data?.type;

			questions = questions?.map((item) => {
				const platform = item?.actualQuestion?.platform,
					answer = item?.actualQuestion?.answer;

				if (type === 'userPersona' && !platform) {
					if (!answer) {
						error = 'You need to answer first question';
					}
				} else if (type === 'userPersona' && platform && answer) {
					const isValidAnswer = validateURL(platform, answer);
					if (!isValidAnswer) {
						error = `Please enter a valid URL for ${platform}`;
					}
				}
				return item?.actualQuestion;
			});

			if (error) {
				throw new Error(error);
			}

			const payload = {
				questions,
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
						actualQuestion: { ...(item?.actualQuestion || {}), answer: value },
					};
				return item;
			}),
		}));
	}, []);

	const type = data?.type;

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
							{info?.questions?.map((item, index) => {
								const question = item?.actualQuestion || {};
								const answer = item?.actualQuestion?.answer || '';
								return (
									<div className="question-container" key={index}>
										<div className="question-text">
											{`${index + 1}. ${question?.question || ''}` || ''}
										</div>

										{type === 'userPersona' ? (
											<div className="user-persona-answer-container">
												<input
													type={question?.answerType || 'text'}
													className="answer-input"
													placeholder="Type your answer"
													value={answer}
													onChange={(e) => handleInputChange(e, index)}
												/>
											</div>
										) : (
											<input
												type="text"
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
