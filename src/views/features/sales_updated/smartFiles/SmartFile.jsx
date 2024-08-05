import React, { memo, useCallback, useState } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import SmartFileHeader from '../../../components/smartFileComponets/SmartFileHeader';
import FormResponses from './FormResponses';
import File from './File';
import { useLocation } from 'react-router-dom';
const SmartFile = () => {
	const location = useLocation();
	const [info, setInfo] = useState({
		activeTab: 'form', //form,file
		incomingData: location?.state?.data,
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
				{info?.activeTab === 'form' ? (
					<FormResponses />
				) : (
					<File templateData={info?.incomingData} />
				)}
			</div>
		</div>
	);
};

export default memo(SmartFile);
