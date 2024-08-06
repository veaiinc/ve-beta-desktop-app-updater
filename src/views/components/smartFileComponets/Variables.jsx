import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';

const Variables = ({ variablesData, variableOnChangeFunc }) => {
	const [info, setInfo] = useState({
		data: [],
	});

	useEffect(() => {
		if (variablesData) {
			setInfo((prev) => ({ ...prev, data: [].concat(...Object.values(variablesData)) }));
		}
	}, [variablesData]);

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
						/>
					</div>
				))}
			</div>

			<div className="proposalContainer">
				<div className="inputWithLabelContainer">
					<span className="labelName">Proposal Validity</span>
					<input className="custominputContainer" />
				</div>
			</div>
		</div>
	);
};

export default memo(Variables);
