import React, { memo, useCallback, useState } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import SmartFileHeader from '../../../components/smartFileComponets/SmartFileHeader';
import FormResponses from './FormResponses';
const SmartFile = () => {
	const [info, setInfo] = useState({
		activeTab: 'form', //form,file
	});

	const chnageActiveTab = useCallback(
		(data) => {
			if (data === info?.activeTab) {
				return;
			}
			setInfo((prev) => ({ ...prev, activeTab: data }));
		},
		[info?.activeTab],
	);

	return (
		<div className="smartFileParentContainer">
			<SmartFileHeader activeTab={info?.activeTab} chnageActiveTab={chnageActiveTab} />
			<div className="mainContentContainer">
				<FormResponses />
			</div>
		</div>
	);
};

export default memo(SmartFile);
