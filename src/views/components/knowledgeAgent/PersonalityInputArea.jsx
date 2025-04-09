import React, { memo } from 'react';
import '../../../assets/scss/knowledgeAgent/personalityInputArea.scss';
const PersonalityInputArea = ({
	heading = '',
	subHeading = '',
	prefix = '',
	value = '',
	onChange = () => {},
}) => {
	return (
		<div className="personalityInputArea">
			<div className="personalityInputArea-header">
				<span className="personalityInputArea-title">{heading}</span>
				{subHeading && <span className="personalityInputArea-subTitle">{subHeading}</span>}
			</div>
			<div className="personalityInputArea-inputContainer">
				{prefix && <span className="personalityInputArea-prefix">{prefix}</span>}
				<input
					type="text"
					className="personalityInputArea-input"
					value={value}
					onChange={onChange}
				/>
			</div>
		</div>
	);
};

export default memo(PersonalityInputArea);
