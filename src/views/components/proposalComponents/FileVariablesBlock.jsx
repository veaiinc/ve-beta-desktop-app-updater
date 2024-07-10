import React from 'react';
import '../../../assets/scss/modules/proposal/fileClientVariables.scss';
import VariablesBlock from './VariablesBlock';
const FileVariablesBlock = ({ variablesData, onVariableDatChnage }) => {
	return (
		<div className="filevaribalesContainer">
			<div className="clientHeader">
				<span className="header">File Variables (To be filled by you)</span>
				<span className="subHeader">
					These variables are added by the business before sending the file to the client
					to ensure all necessary information is included.
				</span>
			</div>
			<div className="clientVariablesHolder">
				{variablesData?.map((item, index) => (
					<VariablesBlock
						key={index}
						variableData={item || {}}
						selectedIndex={index}
						onChangeFunc={onVariableDatChnage}
					/>
				))}
			</div>
		</div>
	);
};

export default FileVariablesBlock;
