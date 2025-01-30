import React, { memo } from 'react';
import '../../../assets/scss/ai_assistant/inputComponent.scss';

const InputComponent = ({ placeholder, ...props }) => {
	return (
		<div className="input-component">
			<input type="text" placeholder="" {...props} />
			<label>{placeholder}</label>
		</div>
	);
};

export default memo(InputComponent);
