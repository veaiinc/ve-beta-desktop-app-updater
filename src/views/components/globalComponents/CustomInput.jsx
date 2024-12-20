// CustomInput.jsx
import React from 'react';
import PropTypes from 'prop-types';
// import './CustomInput.css'; // Optional: Import CSS for default styling

const CustomInput = ({
	type,
	value,
	onChange,
	onBlur,
	onFocus,
	defaultValue,
	placeholder,
	name,
	className, // Accept custom class names
	style, // Accept inline styles
	readOnly,
	disabled,
	...rest
}) => {
	// Determine if the input should be controlled or uncontrolled
	const isControlled = value !== undefined && onChange !== undefined;

	return (
		<input
			type={type}
			value={isControlled ? value : undefined}
			defaultValue={!isControlled ? defaultValue : undefined}
			onChange={isControlled ? onChange : undefined}
			onBlur={onBlur}
			onFocus={onFocus}
			placeholder={placeholder}
			name={name}
			{...rest}
			className={`custom-input ${className}`} // Combine default and custom classes
			style={style} // Apply inline styles
			readOnly={readOnly}
			disabled={disabled}
		/>
	);
};

CustomInput.propTypes = {
	type: PropTypes.string, // e.g., 'text', 'password', 'email'
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	placeholder: PropTypes.string,
	name: PropTypes.string,
	className: PropTypes.string, // Optional: Custom CSS classes
	style: PropTypes.object, // Optional: Inline styles
	readOnly: PropTypes.bool,
	disabled: PropTypes.bool,
};

CustomInput.defaultProps = {
	type: 'text',
	placeholder: 'Empty',
	name: '',
	className: '',
	style: {},
	readOnly: false,
	disabled: false,
	value: undefined,
	onChange: undefined,
	defaultValue: undefined,
	onBlur: undefined,
	onFocus: undefined,
};

export default CustomInput;
