import { memo, useId } from 'react';
import '../../../assets/scss/ai_assistant/inputComponent.scss';

const InputComponent = ({
	placeholder,
	placeholderStyles,
	autoFocus = false,
	inputType = 'text',
	...props
}) => {
	const generatedId = useId();
	return (
		<div className="input-component">
			<input
				type={inputType}
				placeholder=""
				{...props}
				id={generatedId}
				autoFocus={autoFocus}
				autoComplete="off"
				autofill="off"
			/>
			<label htmlFor={generatedId} style={placeholderStyles}>
				{placeholder}
			</label>
		</div>
	);
};

export default memo(InputComponent);
