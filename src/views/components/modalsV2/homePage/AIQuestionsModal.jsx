import { memo, useContext, useEffect, useRef } from 'react';
import '../../../../assets/scss/home_page/modals/aiQuestionsModal.scss';
import ReactModal from '../index';
import { ReactComponent as QuestionSvg } from '../../../../assets/svg/home_page/question.svg';
import Context from '../../../../context/context';

const AIQuestionsModal = ({ open, onClose, data }) => {
	const inputRefs = useRef([]);
	const isUpdatedRef = useRef(false);

	const {
		templates: { updateAiQuestions },
	} = useContext(Context);

	useEffect(() => {
		if (!open) {
			inputRefs.current = [];
			isUpdatedRef.current = false;
		}
	}, [open]);

	const handleSubmit = async () => {
		if (!isUpdatedRef.current) {
			return;
		}

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
		// console.log('response', response);
	};

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
								<div className="question-text">{question?.question || ''}</div>
								<input
									type="text"
									className="answer-input"
									placeholder="Type your answer"
									defaultValue={question?.existingUrl || ''}
									ref={(el) => (inputRefs.current[index] = el)}
									onChange={() => {
										isUpdatedRef.current = true;
									}}
								/>
							</div>
						))}
					</div>
					<div className="btns-container">
						<div className="btn ignore-btn" onClick={onClose}>
							Discard
						</div>
						<div className="btn submit-btn" onClick={handleSubmit}>
							Submit
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AIQuestionsModal);
