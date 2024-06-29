import React from 'react';
import PropTypes from 'prop-types';
import '../../../assets/scss/inputComponent.scss';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as Calendar } from '../../../assets/svg/calendar-icon.svg';

const InputForModules = ({
	label,
	type,
	placeholder,
	name,
	value,
	onChange,
	isError,
	errorMessage,
	prefixText,
	suffixText,
	defaultCountry,
}) => {
	const handleInputNumber = (e) => {
		if (/^[0-9]*$/.test(e.target.value)) {
			onChange({ target: { name: e.target.name, value: e.target.value } });
		}
	};

	return (
		<div className="inputContainer">
			<div className="inputHeading">
				{label && <p className="label">{label}</p>}
				{isError && <p className="errorMessage">{errorMessage}</p>}
			</div>
			{type == 'textArea' ? (
				<textArea
					type={type}
					placeholder={placeholder}
					name={name}
					onChange={onChange}
					//value={value}
				/>
			) : type == 'phoneNumber' ? (
				<div className={`inputBox ${isError ? 'inputBoxError' : ''}`}>
					<PhoneInput
						defaultCountry={defaultCountry}
						placeholder={placeholder}
						value={value}
						onChange={(e) => onChange({ target: { name: name, value: e } })}
					/>
				</div>
			) : type == 'datePicker' ? (
				<div className={`inputBox ${isError ? 'inputBoxError' : ''}`}>
					{prefixText && (
						<p className="symbol">
							<Calendar />
						</p>
					)}
					<DatePicker
						selected={value}
						onChange={(e) => onChange({ target: { name: name, value: e } })}
					/>
					{prefixText && <p className="symbol">{suffixText}</p>}
				</div>
			) : type == 'numbers-with-increment-large' ? (
				<div className={`inputBox ${isError ? 'inputBoxError' : ''}`}>
					<input
						type="text"
						placeholder={placeholder}
						name={name}
						pattern="[0-9]*"
						onChange={handleInputNumber}
						//value={value}
					/>
					<p
						className="symbol increments"
						onChange={(e) => onChange({ target: { name: name, value: value - 1 } })}
					>
						-
					</p>
					<p
						className="symbol increments"
						onChange={(e) => onChange({ target: { name: name, value: value + 1 } })}
					>
						+
					</p>
				</div>
			) : type == 'numbers-with-increment-small' ? (
				<div className={`inputBox ${isError ? 'inputBoxError' : ''}`}>
					<p className="symbol increments">-</p>
					<input
						type={type}
						placeholder={placeholder}
						name={name}
						onChange={onChange}
						//value={value}
					/>
					<p className="symbol increments">+</p>
				</div>
			) : (
				<div className={`inputBox ${isError ? 'inputBoxError' : ''}`}>
					{prefixText && <p className="symbol">{prefixText}</p>}

					<input
						type={type}
						placeholder={placeholder}
						name={name}
						onChange={type === 'number' ? handleInputNumber : onChange}
						//value={value}
					/>
					{prefixText && <p className="symbol">{suffixText}</p>}
				</div>
			)}
		</div>
	);
};

InputForModules.propTypes = {
	label: PropTypes.string,
	type: PropTypes.oneOf(['text', 'email', 'textArea', 'phoneNumber']).isRequired,
	placeholder: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	isError: PropTypes.oneOf([true, false]).isRequired,
	errorMessage: PropTypes.string,
	prefixText: PropTypes.string,
	suffixText: PropTypes.string,
	defaultCountry: PropTypes.string,
};

InputForModules.defaultProps = {
	label: '',
	type: 'text',
	name: '',
	value: '',
	placeholder: 'Enter your value here',
	onChange: () => {},
	isError: false,
	errorMessage: 'Required Field',
	prefixText: '',
	suffixText: '',
	defaultCountry: 'US',
};

export default InputForModules;
