import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import SmartFileHeader from '../../../components/smartFileComponets/SmartFileHeader';
import FormResponses from './FormResponses';
import File from './File';
import { useLocation } from 'react-router-dom';
import Context from '../../../../context/context';
const SmartFile = () => {
	const location = useLocation();

	let {
		templates: { getSmartFileData, smartFileInfo },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeTab: 'form', //form,file
		incomingData: location?.state?.data,
	});

	//useEffect
	useEffect(() => {
		getSmartFileInfo();
	}, []);

	//function defination

	const getSmartFileInfo = useCallback(async () => {
		const payload = {
			getWorkflowWithModulesId: '66ac8b1aa4f00dcc0ae30eda',
		};
		getSmartFileData(payload);
	}, []);

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
