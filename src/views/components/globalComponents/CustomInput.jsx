// import React from 'react';
import PropTypes from 'prop-types';
import '../../../assets/scss/globalComponents/customInput.scss';

const CustomInput = ({
	type = 'text',
	value = undefined,
	onChange = undefined,
	onBlur = undefined,
	onFocus = undefined,
	defaultValue = undefined,
	placeholder = 'Empty',
	name = '',
	className = '',
	style = {},
	readOnly = false,
	disabled = false,
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

export default CustomInput;
