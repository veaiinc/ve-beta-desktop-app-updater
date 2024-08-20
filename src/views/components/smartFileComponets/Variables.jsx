import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';

const Variables = ({
	variablesData,
	variableOnChangeFunc,
	editable,
	expiryInDays,
	updateExpiryInDays,
}) => {
	const [info, setInfo] = useState({
		data: [],
		localExpiry: expiryInDays,
	});

	useEffect(() => {
		if (variablesData) {
			setInfo((prev) => ({ ...prev, data: [].concat(...Object.values(variablesData)) }));
		}
	}, [variablesData]);

	useEffect(() => {
		setInfo((prev) => ({ ...prev, localExpiry: expiryInDays }));
	}, [expiryInDays]);

	const onLocalVariableDataChange = useCallback(
		async (e, index) => {
			let updatedData = [...(info?.data || [])];
			let variableElementToBeUpdated = updatedData?.[index];
			variableElementToBeUpdated = { ...variableElementToBeUpdated, value: e.target.value };
			updatedData?.splice(index, 1, variableElementToBeUpdated);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			variableOnChangeFunc(variableElementToBeUpdated);
			return;
		},
		[info?.data],
	);

	const onChangeLocalExpiry = useCallback(
		async (e) => {
			const value = e.target.value.replace(/[^0-9]/g, '');
			if (+value === +info?.localExpiry) {
				return;
			}
			setInfo((prev) => ({ ...prev, localExpiry: +value }));
			updateExpiryInDays(+value);
			return;
		},
		[expiryInDays, info?.localExpiry],
	);

	return (
		<div className="variablesParentContainer">
			<div className="variableListHolder">
				{info?.data?.map((ele, index) => (
					<div className="inputWithLabelContainer" key={index}>
						<span className="labelName">{ele?.code}</span>
						<input
							className="custominputContainer"
							value={ele?.value || ''}
							onChange={(e) => onLocalVariableDataChange(e, index)}
							readOnly={!editable}
						/>
					</div>
				))}
			</div>

			<div className="proposalContainer">
				<div className="inputWithLabelContainer">
					<span className="labelName">Proposal Validity</span>
					<input
						className="custominputContainer"
						type="text"
						value={expiryInDays}
						onChange={onChangeLocalExpiry}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(Variables);
