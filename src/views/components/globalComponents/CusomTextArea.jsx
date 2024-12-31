import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../../assets/scss/globalComponents/customTextArea.scss';

const CustomTextArea = ({
	value,
	onChange,
	onBlur,
	onFocus,
	placeholder,
	name,
	className,
	style,
	readOnly,
	disabled,
	autoResize,

	...rest
}) => {
	const textAreaRef = useRef(null);

	const adjustHeight = () => {
		if (autoResize && textAreaRef.current) {
			const textarea = textAreaRef.current;
			// Reset height to minimal value to properly calculate new height
			textarea.style.height = '0px';
			// Set the height to scrollHeight to fit content exactly
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	// Adjust height on mount and when value changes
	useEffect(() => {
		adjustHeight();
	}, [value, autoResize]);

	return (
		<textarea
			ref={textAreaRef}
			value={value}
			onChange={(e) => {
				onChange?.(e);
				// Adjust height after each change
				adjustHeight();
			}}
			onBlur={onBlur}
			onFocus={onFocus}
			placeholder={placeholder}
			name={name}
			className={`custom-textarea ${className}`}
			style={{
				resize: 'none',
				overflow: 'hidden',
				// minHeight: '15px',
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
};

CustomTextArea.defaultProps = {
	placeholder: 'Empty',
	name: '',
	className: '',
	style: {},
	readOnly: false,
	disabled: false,
	value: undefined,
	onChange: undefined,
	onBlur: undefined,
	onFocus: undefined,
	autoResize: false,
};

export default CustomTextArea;
