import { memo, useContext } from 'react';
import s from './AiTranscriptionSuggestions.module.scss';
import { ReactComponent as CloseIcon } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import Context from '../../../context/context';

const AiTranscriptionSuggestions = ({ closeModal }) => {
	const {
		aiSetup: { aiTranscriptionSuggestions },
	} = useContext(Context);
	return (
		<div className={s.aiTranscriptionSuggestions}>
			<div className={s.header}>
				<div className={s.leftContainer}>
					<div className={s.closeIconContainer} onClick={closeModal}>
						<CloseIcon />
					</div>
					<div className={s.text}>Ambient Assistance</div>
				</div>
			</div>

			<div className={s.body}>
				{aiTranscriptionSuggestions?.suggested_questions?.length > 0 && (
					<div className={s.suggestedQuestionsContainer}>
						{aiTranscriptionSuggestions?.suggested_questions?.map((question, index) => (
							<div className={s.suggestedQuestion} key={index}>
								{question}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(AiTranscriptionSuggestions);
