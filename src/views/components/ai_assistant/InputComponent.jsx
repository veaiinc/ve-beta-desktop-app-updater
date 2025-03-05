import React, { memo, useId } from 'react';
import '../../../assets/scss/ai_assistant/inputComponent.scss';

const InputComponent = ({ placeholder, ...props }) => {
	const generatedId = useId();
	return (
		<div className="input-component">
			<input type="text" placeholder="" {...props} id={generatedId} />
			<label htmlFor={generatedId}>{placeholder}</label>
		</div>
	);
};

export default memo(InputComponent);
