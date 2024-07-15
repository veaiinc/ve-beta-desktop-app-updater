import React, { memo, useState, useEffect } from 'react';
import '../../../assets/scss/modules/proposal/fileClientVariables.scss';
import VariablesBlock from './VariablesBlock';

const ClientVariablesBlock = ({ variablesData, onVariableDatChnage }) => {
	const [info, setInfo] = useState({
		localvariableData: null,
	});

	useEffect(() => {
		if (variablesData) {
			let updateData = variablesData?.filter(
				(ele) => ele?.clientAction === 1 || ele?.clientAction === 2,
			);
			setInfo((prev) => ({ ...prev, localvariableData: updateData }));
		}
	}, [variablesData]);
	return info?.localvariableData?.length ? (
		<div className="filevaribalesContainer">
			<div className="clientHeader">
				<span className="header">Client Variables (To be filled by client)</span>
				<span className="subHeader">
					These variables are to be filled out by the client in their response and, in
					some cases, can be added by the business as well.
				</span>
			</div>

			<div className="clientVariablesHolder">
				{info?.localvariableData?.map((item, index) => (
					<VariablesBlock
						key={index}
						variableData={item || {}}
						onChangeFunc={onVariableDatChnage}
					/>
				))}
			</div>
		</div>
	) : (
		''
	);
};

export default memo(ClientVariablesBlock);
