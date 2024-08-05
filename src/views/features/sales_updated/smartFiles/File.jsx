import React, { memo, useContext, useEffect, useState, useCallback } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import Events from '../../../components/smartFileComponets/Events';
import Services from '../../../components/smartFileComponets/Services';
import PaymentSchedule from '../../../components/smartFileComponets/PaymentSchedule';
import Variables from '../../../components/smartFileComponets/Variables';
import Context from '../../../../context/context';

const File = ({ templateData }) => {
	let {
		templates: { getSmartFileData, smartFileInfo },
	} = useContext(Context);

	const [info, setInfo] = useState({
		proposal: null,
		invoice: null,
		thankyou: null,
		contract: null,
		form: null,
		variablesData: null,
		paymentScheduleData: null,
		eventsTableData: null,
		servicesTableData: null,
		loading: true,
	});

	console.log(info);
	//useEffects
	useEffect(() => {
		if (smartFileInfo) {
			const { modules } = smartFileInfo;
			let updatedModules = modules?.map((ele, index) => ele?.type) || [];
			let variablesData = {},
				paymentScheduleData = {},
				eventsTableData = {},
				servicesTableData = {},
				moduleData = {
					proposal: null,
					invoice: null,
					thankyou: null,
					contract: null,
					form: null,
				};
			for (let i = 0; i < updatedModules?.length; i++) {
				const currentModule = smartFileInfo?.[updatedModules?.[i]];
				const { activeVersion, versions } = currentModule;
				let activeVersionData;
				for (let j = 0; j < versions?.length; j++) {
					if (versions?.[j]?._id === activeVersion) {
						activeVersionData = versions?.[j];
						break;
					}
				}

				let variables = activeVersionData?.variables?.map((ele) => ({
					...ele,
					moduleType: updatedModules?.[i],
				}));

				let eventsTable = [];
				let servicesTable = [];

				for (let k = 0; k < activeVersionData?.tables?.length; k++) {
					const currentTableData = activeVersionData?.tables?.[k];
					if (currentTableData?.type === 'services') {
						servicesTable?.push({
							...currentTableData,
							moduleType: updatedModules?.[i],
						});
					}
					if (currentTableData?.type === 'events') {
						eventsTable?.push({
							...currentTableData,
							moduleType: updatedModules?.[i],
						});
					}
				}

				let paymentSchedule = activeVersionData?.paymentSchedule?.map((ele) => ({
					...ele,
					moduleType: updatedModules?.[i],
				}));
				variablesData[updatedModules?.[i]] = variables;
				paymentScheduleData[updatedModules?.[i]] = paymentSchedule;
				eventsTableData[updatedModules?.[i]] = eventsTable;
				servicesTableData[updatedModules?.[i]] = servicesTable;
				moduleData[updatedModules?.[i]] = activeVersionData;
			}
			setInfo((prev) => ({
				...prev,
				variablesData,
				paymentScheduleData,
				eventsTableData,
				servicesTableData,
				loading: true,
				...moduleData,
			}));
		}
	}, [smartFileInfo]);

	//function defination

	// const getSmartFileInfo = useCallback(async () => {
	// 	const payload = {
	// 		getWorkflowWithModulesId: '66ac8b1aa4f00dcc0ae30eda',
	// 	};
	// 	getSmartFileData(payload);
	// }, []);

	return (
		<div className="fileParentContainer">
			<div className="previewContainer">
				{templateData?.templates?.map((ele, index) => (
					<div className="imageContainer" key={index}>
						<div className="coverImage">
							<div
								dangerouslySetInnerHTML={{
									__html: ele?.parsedHtmlContent,
								}}
								style={{ width: '100%' }}
							/>
						</div>
					</div>
				))}
			</div>
			<div className="editParentContainer">
				<Variables />
				<Events />
				<Services />
				<PaymentSchedule />
			</div>
		</div>
	);
};

export default memo(File);
