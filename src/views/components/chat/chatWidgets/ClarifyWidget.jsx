import { memo, useContext } from 'react';
import '../../../../assets/scss/chat/chatWidgets/clarifyWidget.scss';
import Context from '../../../../context/context';

const ClarifyWidget = ({ data }) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);
	const handleOptionClick = (option) => {
		updateStateValues({
			activePromptForChat: option,
		});
	};
	const handleAllOptionClick = () => {
		let prompt = 'All - ';
		(data?.options || []).forEach((option, index) => {
			prompt += option + (index !== data?.options?.length - 1 ? ', ' : '');
		});
		updateStateValues({
			activePromptForChat: prompt,
		});
	};
	return (
		<div className="clarify-widget-container">
			<div className="widget-content">
				<div className="question">{data?.question || ''}</div>
				{(data?.options || [])?.map((option, index) => (
					<div
						className="widget-option"
						key={index}
						onClick={() => handleOptionClick(option)}
					>
						{option || ''}
					</div>
				))}
			</div>
			<div className="text-container">OR</div>
			<div className="all-container" onClick={handleAllOptionClick}>
				Proceed with All Options
			</div>
		</div>
	);
};

export default memo(ClarifyWidget);
