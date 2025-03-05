import React, { memo, useId } from 'react';
import '../../../assets/scss/ai_assistant/textareaComponent.scss';

const TextareaComponent = ({ placeholder, ...props }) => {
	const generatedId = useId();
	return (
		<div className="textarea-component">
			<textarea type="text" placeholder="" {...props} id={generatedId} />
			<label htmlFor={generatedId}>{placeholder}</label>
		</div>
	);
};

export default memo(TextareaComponent);
