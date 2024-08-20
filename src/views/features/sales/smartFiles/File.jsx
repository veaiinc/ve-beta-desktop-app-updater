import React, { memo, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import Events from '../../../components/smartFileComponets/Events';
import Services from '../../../components/smartFileComponets/Services';
import PaymentSchedule from '../../../components/smartFileComponets/PaymentSchedule';
import Variables from '../../../components/smartFileComponets/Variables';
import Context from '../../../../context/context';
import AcceptedStageSmartFileBlocks from '../../../components/smartFileComponets/AcceptedStageSmartFileBlocks';
import { ReactComponent as EditSvg } from '../.././../../assets/svg/worflow_builder/edit.svg';
import Spinner from '../../../components/loaders/Spinner';
const File = ({ templateData, workflowData, userSigned, edit }) => {
	let {
		templates: {
			smartFileInfo,
			updateProposal,
			updateContracts,
			updateInvoice,
			updateForm,
			updateThankyou,
			duplicateGlobalWorkflowTemplate,
		},
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
		timeout: null,
		smartFileStatus: '',
		templatesMapper: null,
		duplicateLoader: false,
		expiryInDays: null,
	});

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
				const {
					activeVersion,
					versions,
					_id,
					workflowId,
					expiryInDays,
					signatures = [],
				} = currentModule;
				let activeVersionData;
				for (let j = 0; j < versions?.length; j++) {
					if (versions?.[j]?._id === activeVersion) {
						activeVersionData = {
							...versions?.[j],
							activeVersion,
							_id,
							workflowId,
							// expiryInDays,
							signatures,
						};
						break;
					}
				}

				let variables = activeVersionData?.variables?.filter((ele) => {
					if (ele?.type !== 'workspace') {
						ele['moduleType'] = updatedModules?.[i];
						return ele;
					}
				});

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
				smartFileStatus: smartFileInfo?.status,
				...moduleData,
			}));
		}
	}, [smartFileInfo]);

	useEffect(() => {
		if (templateData) {
			let templatesMapper = {};
			const { templates } = templateData || {};
			for (let i = 0; i < templates?.length; i++) {
				templatesMapper[templates[i]?._id] = templates?.[i]?.parsedHtmlContent;
			}
			setInfo((prev) => ({ ...prev, templatesMapper }));
		}
	}, [templateData]);

	useEffect(() => {
		if (info?.proposal) {
			const { expiryInDays } = info.proposal || {};
			setInfo((prev) => ({ ...prev, expiryInDays }));
		}
	}, [info?.proposal]);

	//function defination

	//variableOnChangeFunc
	const variableOnChangeFunc = useCallback(
		async (updatedData) => {
			const moduleType = updatedData?.moduleType;
			let updatedVariableData = { ...info?.variablesData };
			let variableModuleArraytoBeUpdated = [...(updatedVariableData?.[moduleType] || [])];
			let index = -1;
			for (let i = 0; i < variableModuleArraytoBeUpdated?.length; i++) {
				if (variableModuleArraytoBeUpdated?.[i]?._id === updatedData?._id) {
					index = i;
					break;
				}
			}
			if (index !== -1) {
				variableModuleArraytoBeUpdated?.splice(index, 1, updatedData);
				updatedVariableData[moduleType] = [...variableModuleArraytoBeUpdated];
				setInfo((prev) => ({ ...prev, variablesData: updatedVariableData }));
			}

			let moduleIndex = -1;
			const moduleData = { ...(info?.[moduleType] || {}) };
			const moduleVariables = [...(moduleData?.variables || [])];
			for (let i = 0; i < moduleVariables?.length; i++) {
				if (moduleVariables?.[i]?._id === updatedData?._id) {
					moduleIndex = i;
					break;
				}
			}
			if (moduleIndex !== -1) {
				moduleVariables?.splice(moduleIndex, 1, updatedData);
				moduleData.variables = [...moduleVariables];
				setInfo((prev) => ({ ...prev, [moduleType]: moduleData }));
			}
			handleDebounceUpdate(moduleType, moduleData);
		},
		[info?.variablesData],
	);

	//servicesTableChnages
	const serviceTableOnChnageFunc = useCallback(
		async (updatedData) => {
			const moduleType = updatedData?.moduleType;
			let updatedServiceData = { ...info?.servicesTableData };
			let serviceModuleArraytoBeUpdated = [...(updatedServiceData?.[moduleType] || [])];
			let index = -1;
			for (let i = 0; i < serviceModuleArraytoBeUpdated?.length; i++) {
				if (serviceModuleArraytoBeUpdated?.[i]?._id === updatedData?._id) {
					index = i;
					break;
				}
			}

			if (index !== -1) {
				serviceModuleArraytoBeUpdated?.splice(index, 1, updatedData);
				updatedServiceData[moduleType] = [...serviceModuleArraytoBeUpdated];
				setInfo((prev) => ({ ...prev, servicesTableData: updatedServiceData }));
			}

			let moduleIndex = -1;
			const moduleData = { ...(info?.[moduleType] || {}) };
			const moduleTable = [...(moduleData?.tables || [])];
			for (let i = 0; i < moduleTable?.length; i++) {
				if (moduleTable?.[i]?._id === updatedData?._id) {
					moduleIndex = i;
					break;
				}
			}
			if (moduleIndex !== -1) {
				moduleTable?.splice(moduleIndex, 1, updatedData);
				moduleData.tables = [...moduleTable];
				setInfo((prev) => ({ ...prev, [moduleType]: moduleData }));
			}
			handleDebounceUpdate(moduleType, moduleData);
		},
		[info?.servicesTableData],
	);

	//events table onChange
	const eventsTableOnChangeFunc = useCallback(
		async (updatedData) => {
			const moduleType = updatedData?.moduleType;
			let updatedEventsData = { ...info?.eventsTableData };
			let eventsModuleArrayToBeUpdated = [...(updatedEventsData?.[moduleType] || [])];
			let index = -1;
			for (let i = 0; i < eventsModuleArrayToBeUpdated?.length; i++) {
				if (eventsModuleArrayToBeUpdated?.[i]?._id === updatedData?._id) {
					index = i;
					break;
				}
			}
			if (index !== -1) {
				eventsModuleArrayToBeUpdated?.splice(index, 1, updatedData);
				updatedEventsData[moduleType] = [...eventsModuleArrayToBeUpdated];
				setInfo((prev) => ({ ...prev, eventsTableData: updatedEventsData }));
			}

			let moduleIndex = -1;
			const moduleData = { ...(info?.[moduleType] || {}) };
			const moduleTable = [...(moduleData?.tables || [])];
			for (let i = 0; i < moduleTable?.length; i++) {
				if (moduleTable?.[i]?._id === updatedData?._id) {
					moduleIndex = i;
					break;
				}
			}
			if (moduleIndex !== -1) {
				moduleTable?.splice(moduleIndex, 1, updatedData);
				moduleData.tables = [...moduleTable];
				setInfo((prev) => ({ ...prev, [moduleType]: moduleData }));
			}

			handleDebounceUpdate(moduleType, moduleData);
		},
		[info?.eventsTableData],
	);

	//proposalUpdate
	const updateProposalFunc = useCallback(async (moduleData) => {
		const { activeVersion, _id, variables, tables, paymentSchedule, workflowId, expiryInDays } =
			moduleData || {};

		const payload = {
			proposalId: _id,
			workflowId,
			proposalInput: {
				versions: {
					expiryInDays,
					paymentSchedule,
					variables,
					tables,
				},
			},
			versionId: activeVersion,
		};

		if (
			payload?.proposalInput?.versions?.expiryInDays === null ||
			payload?.proposalInput?.versions?.expiryInDays === undefined
		) {
			delete payload?.proposalInput?.versions?.expiryInDays;
		}

		updateProposal(payload);
	}, []);

	//formUpdate
	const updateFormFunc = useCallback(async (moduleData) => {
		const { activeVersion, _id, variables, tables, paymentSchedule, workflowId } =
			moduleData || {};
		const payload = {
			formId: _id,
			workflowId,
			formInput: {
				versions: {
					paymentSchedule,
					tables,
					variables,
				},
			},
			versionId: activeVersion,
		};
		updateForm(payload);
	}, []);
	//invoiceUpdate
	const updateInvoiceFunc = useCallback(async (moduleData) => {
		const { activeVersion, _id, variables, tables, paymentSchedule, workflowId } =
			moduleData || {};
		const payload = {
			invoiceId: _id,
			workflowId,
			invoiceInput: {
				versions: {
					variables,
					tables,
					paymentSchedule,
				},
			},
			versionId: activeVersion,
		};
		updateInvoice(payload);
	}, []);
	//thankyouUpdate
	const updateThankYouFunc = useCallback(async (moduleData) => {
		const { activeVersion, _id, variables, tables, paymentSchedule, workflowId } =
			moduleData || {};
		const payload = {
			thankyouId: _id,
			workflowId,
			thankyouInput: {
				versions: {
					paymentSchedule,
					tables,
					variables,
				},
			},
			versionId: activeVersion,
		};
		updateThankyou(payload);
	}, []);
	//contractsUpdate
	const updateContractFunc = useCallback(async (moduleData) => {
		const { activeVersion, _id, variables, tables, paymentSchedule, workflowId } =
			moduleData || {};
		const payload = {
			contractId: _id,
			workflowId,
			contractInput: {
				versions: {
					tables,
					variables,
					paymentSchedule,
				},
			},
			versionId: activeVersion,
		};
		updateContracts(payload);
	}, []);

	const moduleUpdateFuncWrapper = useMemo(() => {
		return {
			form: updateFormFunc,
			contract: updateContractFunc,
			proposal: updateProposalFunc,
			invoice: updateInvoiceFunc,
			thankyou: updateThankYouFunc,
		};
	}, [
		updateFormFunc,
		updateContractFunc,
		updateProposalFunc,
		updateInvoiceFunc,
		updateThankYouFunc,
	]);

	const updateExpiryInDays = useCallback(
		async (updatedData) => {
			const newModuleData = { ...info?.proposal, expiryInDays: +updatedData };
			setInfo((prev) => ({ ...prev, proposal: newModuleData }));
			handleDebounceUpdate('proposal', newModuleData);
		},
		[info?.proposal],
	);
	const handleDebounceUpdate = useCallback(
		(module, moduleData) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				moduleUpdateFuncWrapper?.[module](moduleData);
			}, 1000);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[
			info?.timeout,
			updateProposalFunc,
			updateContractFunc,
			updateFormFunc,
			updateInvoiceFunc,
			updateThankYouFunc,
			moduleUpdateFuncWrapper,
			updateExpiryInDays,
		],
	);

	const duplicateTemplateFromSmartFile = useCallback(async () => {
		if (info?.duplicateLoader) {
			return;
		}
		setInfo((prev) => ({ ...prev, duplicateLoader: true }));
		const payload = {
			templateId: templateData?._id,
			title: templateData?.title,
		};

		const response = await duplicateGlobalWorkflowTemplate(payload);
		setInfo((prev) => ({ ...prev, duplicateLoader: false }));
		if (response?.[0]) {
			window.location.href = `https://builder.ve.co/${response?.[1]?._id}?clientName=${
				workflowData?.name || ''
			}&clientEmail=${workflowData?.email || ''}`;
			return;
		}
	}, [info?.duplicateLoader, workflowData]);

	const handleUpdateVaraiblesArray = useCallback(
		async (updatedDuplicateVariableArray) => {
			for (let i = 0; i < updatedDuplicateVariableArray?.length; i++) {
				const updatedData = updatedDuplicateVariableArray?.[i];

				const moduleType = updatedData?.moduleType;
				let updatedVariableData = { ...info?.variablesData };
				let variableModuleArraytoBeUpdated = [...(updatedVariableData?.[moduleType] || [])];
				let index = -1;
				for (let i = 0; i < variableModuleArraytoBeUpdated?.length; i++) {
					if (variableModuleArraytoBeUpdated?.[i]?._id === updatedData?._id) {
						index = i;
						break;
					}
				}
				if (index !== -1) {
					variableModuleArraytoBeUpdated?.splice(index, 1, updatedData);
					updatedVariableData[moduleType] = [...variableModuleArraytoBeUpdated];
					setInfo((prev) => ({ ...prev, variablesData: updatedVariableData }));
				}

				let moduleIndex = -1;
				const moduleData = { ...(info?.[moduleType] || {}) };
				const moduleVariables = [...(moduleData?.variables || [])];
				for (let i = 0; i < moduleVariables?.length; i++) {
					if (moduleVariables?.[i]?._id === updatedData?._id) {
						moduleIndex = i;
						break;
					}
				}
				if (moduleIndex !== -1) {
					moduleVariables?.splice(moduleIndex, 1, updatedData);
					moduleData.variables = [...moduleVariables];
					setInfo((prev) => ({ ...prev, [moduleType]: moduleData }));
				}
				moduleUpdateFuncWrapper?.[moduleType](moduleData);
			}
		},
		[info?.variablesData, moduleUpdateFuncWrapper],
	);

	return (
		<div className="fileParentContainer">
			<div className="previewContainer">
				<div className="previewHeader">
					<span className="previewHeaderText">
						Customise your design for {workflowData?.name}
					</span>
					{info?.duplicateLoader ? (
						<Spinner width={'20px'} height={'20px'} />
					) : (
						<div className="editPreviewBtn" onClick={duplicateTemplateFromSmartFile}>
							<EditSvg />
							<span className="editText">Edit</span>
						</div>
					)}
				</div>

				<div className="previewHolderWrapper">
					{templateData?.moduleTemplates
						?.filter((comp, i) => !comp?.isPublic)
						.map((ele, index) => (
							<div className="imageContainer" key={index}>
								<div className="coverImage">
									<div
										dangerouslySetInnerHTML={{
											__html: info?.templatesMapper?.[ele?._id],
										}}
										style={{ width: '100%', zoom: 2 }}
									/>
								</div>
							</div>
						))}
				</div>
			</div>
			<div className="editParentContainer">
				<AcceptedStageSmartFileBlocks
					smartFileStatus={info?.smartFileStatus}
					clientDetails={workflowData}
					propsalData={info?.servicesTableData?.['proposal']}
					contractData={info?.contract}
					userSigned={userSigned}
				/>
				<span className="editContainerHeader">
					Please enter the following custom data to send this proposal{' '}
				</span>

				<Variables
					variablesData={info?.variablesData}
					variableOnChangeFunc={variableOnChangeFunc}
					editable={edit}
					expiryInDays={info?.expiryInDays}
					updateExpiryInDays={updateExpiryInDays}
					handleUpdateVaraiblesArray={handleUpdateVaraiblesArray}
				/>
				<Events
					eventsData={info?.eventsTableData}
					eventsDataChange={eventsTableOnChangeFunc}
					editable={edit}
				/>
				<Services
					serviceData={info?.servicesTableData}
					serviceOnChangeFunc={serviceTableOnChnageFunc}
					editable={edit}
				/>
				{/* <PaymentSchedule /> */}
			</div>
		</div>
	);
};

export default memo(File);
