import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/modules/proposal/variablesBlock.scss';
import validator from 'validator';
const VariablesBlock = ({ variableData, selectedIndex, onChangeFunc }) => {
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
			if (updatedVariableData?.code === 'website' && !validator.is)
				onChangeFunc(updatedVariableData, selectedIndex);
		},
		[info?.variable, selectedIndex, onChangeFunc],
	);

	return (
		<div className="variablesBlockContainer">
			<span className="variablesBlockHeader">Add Variables</span>
			<div className="variableCardContainer">
				<div className="multipleInputContainer">
					<div className="inputHolder">
						<span className="serviceTitle">Variable Title</span>
						<input
							type="text"
							className="propsalinputContainer"
							placeholder="Type Here ..."
							value={info?.variable?.code}
						/>
					</div>
					<div className="inputHolder">
						<div
							className="errorState"
							style={{
								display: 'flex',
								flex: 1,
								alignSelf: 'stretch',
							}}
						>
							<span className="serviceTitle">Variable Value</span>
							{info?.error ? (
								<span className="errormessage">{info?.errorMessage}</span>
							) : (
								''
							)}
						</div>

						<input
							type="text"
							className="propsalinputContainer"
							placeholder="Type Here ..."
							value={info?.variable?.value}
							onChange={(event) => handleonChangeValue(event.target.value)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(VariablesBlock);
