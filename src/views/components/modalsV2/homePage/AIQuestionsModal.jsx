import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/home_page/modals/aiQuestionsModal.scss';
import ReactModal from '../index';
import { ReactComponent as QuestionSvg } from '../../../../assets/svg/home_page/question.svg';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';

const AIQuestionsModal = ({ open, onClose, data }) => {
	const [info, setInfo] = useState({
		isUpdated: false,
		submittingAnswers: false,
	});
	const inputRefs = useRef([]);

	const {
		templates: { updateAiQuestions, updateStateValues, aiQuestions },
	} = useContext(Context);

	useEffect(() => {
		if (!open) {
			inputRefs.current = [];
			setInfo((prev) => ({ ...prev, isUpdated: false, submittingAnswers: false }));
		}
	}, [open]);

	const handleSubmit = async () => {
		try {
			setInfo((prev) => ({ ...prev, submittingAnswers: true }));
			const payload = {
				questions: data?.questions?.map((question, index) => {
					return {
						...question,
						answer: inputRefs.current[index]?.value,
					};
				}),
			};
			const id = data?._id;
			const response = await updateAiQuestions(payload, id);
			if (response?.[0] === true) {
				const updatedData = aiQuestions?.data?.map((question) => {
					if (question?._id === response?.[1]?._id) {
						return response?.[1];
					}
					return question;
				});
				updateStateValues({ aiQuestions: { ...aiQuestions, data: updatedData } });
				onClose?.();
			} else {
				throw new Error('error');
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

	const handleInputChange = useCallback(() => {
		if (info?.isUpdated) return;
		setInfo((prev) => ({ ...prev, isUpdated: true }));
	}, [info?.isUpdated]);

	return (
		<ReactModal
			isOpen={open}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{ overlay: { zIndex: 9999 } }}
		>
			<div className="ai-questions-modal-container">
				<div className="modal-header">
					<div className="icon-container">
						<QuestionSvg />
					</div>
					<div className="modal-title">Help me understand you more </div>
				</div>

				<div className="modal-content">
					<div className="questions-container">
						{data?.questions?.map((question, index) => (
							<div className="question-container" key={index}>
								<div className="question-text">
									{`${index + 1}. ${question?.question}` || ''}
								</div>
								<input
									type="text"
									className="answer-input"
									placeholder="Type your answer"
									defaultValue={question?.existingUrl || question?.answer || ''}
									ref={(el) => (inputRefs.current[index] = el)}
									onChange={handleInputChange}
								/>
							</div>
						))}
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
		</ReactModal>
	);
};

export default memo(AIQuestionsModal);
