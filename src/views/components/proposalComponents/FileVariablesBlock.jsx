import React, { useState, useEffect, memo } from 'react';
import '../../../assets/scss/modules/proposal/fileClientVariables.scss';
import VariablesBlock from './VariablesBlock';
const FileVariablesBlock = ({ variablesData, onVariableDatChnage }) => {
	const [info, setInfo] = useState({
		localvariableData: null,
	});

	useEffect(() => {
		if (variablesData) {
			let updateData = variablesData?.filter(
				(ele) => ele?.clientAction !== 1 && ele?.clientAction !== 2,
			);
			setInfo((prev) => ({ ...prev, localvariableData: updateData }));
		}
	}, [variablesData]);

	return info?.localvariableData?.length ? (
		<div className="filevaribalesContainer">
			<div className="clientHeader">
				<span className="header">File Variables (To be filled by you)</span>
				<span className="subHeader">
					These variables are added by the business before sending the file to the client
					to ensure all necessary information is included.
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

export default memo(FileVariablesBlock);
