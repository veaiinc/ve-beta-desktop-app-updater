import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/modules/proposal/variablesBlock.scss';
import validator from 'validator';
const VariablesBlock = ({ variableData, onChangeFunc }) => {
	const [info, setInfo] = useState({
		variable: variableData,
		error: false,
		errorMessage: '',
	});

	const handleonChangeValue = useCallback(
		async (value) => {
			let updatedVariableData = { ...info?.variable, value };
			setInfo((prev) => ({
				...prev,
				variable: updatedVariableData,
				error: false,
				errorMessage: '',
			}));
			if (!value?.length) {
				setInfo((prev) => ({
					...prev,
					error: true,
					errorMessage: 'cannot be empty',
				}));
				return;
			}
			if (updatedVariableData?.code === 'phoneNumber' && !validator.isMobilePhone(value)) {
				setInfo((prev) => ({
					...prev,
					error: true,
					errorMessage: 'Invalid value ',
				}));
				return;
			}
			if (updatedVariableData?.code === 'email' && !validator.isEmail(value)) {
				setInfo((prev) => ({
					...prev,
					error: true,
					errorMessage: 'Invalid email ',
				}));
				return;
			}
			onChangeFunc(updatedVariableData);
		},
		[info?.variable, onChangeFunc],
	);

	return (
		<div className="inputHolder">
			<div
				className="errorState"
				style={{
					display: 'flex',
					flex: 1,
					alignSelf: 'stretch',
				}}
			>
				<span className="serviceTitle">{info?.variable?.code}</span>
				{info?.error ? <span className="errormessage">{info?.errorMessage}</span> : ''}
			</div>

			<input
				type="text"
				className="propsalinputContainer"
				placeholder="Type Here ..."
				value={info?.variable?.value}
				onChange={(event) => handleonChangeValue(event.target.value)}
			/>
		</div>
	);
};

export default memo(VariablesBlock);
