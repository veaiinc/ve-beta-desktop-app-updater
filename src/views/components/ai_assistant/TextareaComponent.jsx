import React, { memo } from 'react';
import '../../../assets/scss/ai_assistant/textareaComponent.scss';

const TextareaComponent = ({ placeholder, ...props }) => {
	return (
		<div className="textarea-component">
			<textarea type="text" placeholder="" {...props} />
			<label>{placeholder}</label>
		</div>
	);
};

export default memo(TextareaComponent);
