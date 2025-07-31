import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../../assets/scss/globalComponents/customTextArea.scss';

const CustomTextArea = ({
	value = undefined,
	onChange = undefined,
	onBlur = undefined,
	onFocus = undefined,
	placeholder = 'Empty',
	name = '',
	className = '',
	style = {},
	readOnly = false,
	disabled = false,
	autoResize = false,
	replacePlaceholder = false,
	...rest
}) => {
	const textAreaRef = useRef(null);

	const adjustHeight = () => {
		if (autoResize && textAreaRef.current) {
			const textarea = textAreaRef.current;
			textarea.style.height = '0px';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	useEffect(() => {
		adjustHeight();
	}, [value, autoResize]);

	return (
		<textarea
			ref={textAreaRef}
			value={value}
			onChange={(e) => {
				onChange?.(e);
				adjustHeight();
			}}
			onBlur={onBlur}
			onFocus={onFocus}
			placeholder={replacePlaceholder ? placeholder : `Enter ${placeholder}`}
			name={name}
			className={`custom-textarea ${className}`}
			style={{
				resize: 'none',
				overflow: 'hidden',
				boxSizing: 'border-box',
				...style,
			}}
			readOnly={readOnly}
			disabled={disabled}
			rows={1}
			{...rest}
		/>
	);
};

CustomTextArea.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	placeholder: PropTypes.string,
	name: PropTypes.string,
	className: PropTypes.string,
	style: PropTypes.object,
	readOnly: PropTypes.bool,
	disabled: PropTypes.bool,
	autoResize: PropTypes.bool,
	replacePlaceholder: PropTypes.bool,
};

export default CustomTextArea;
