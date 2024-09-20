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

let origin =
	window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://builder.ve.ai';
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
			formResponseData,
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
		varibalesModified: false,
		iframeReady: false,
		variableInitialised: false,
	});

	useEffect(() => {
		window.addEventListener('message', handleMessage);
		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);
	//useEffects
	useEffect(() => {
		if (smartFileInfo) {
			const { modules } = smartFileInfo;

			let updatedModules = modules?.map((ele, index) => ele?.type) || [];

			let variablesData = {},
				paymentScheduleData = {},
				eventsTableData = {},
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
				} = currentModule || {};
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

				for (let k = 0; k < activeVersionData?.tables?.length; k++) {
					const currentTableData = activeVersionData?.tables?.[k];

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
				moduleData[updatedModules?.[i]] = activeVersionData;
			}
			setInfo((prev) => ({
				...prev,
				variablesData,
				paymentScheduleData,
				eventsTableData,
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
			let servicesTable = [];
			for (let i = 0; i < info?.proposal?.sections?.length; i++) {
				if (info?.proposal?.sections?.[i]?.type === 'services') {
					servicesTable?.push(info?.proposal?.sections?.[i]);
				}
			}
			setInfo((prev) => ({ ...prev, servicesTableData: servicesTable }));
		}
	}, [info?.proposal]);

	useEffect(() => {
		if (formResponseData && info?.variablesData && !info?.varibalesModified) {
			const { response } = formResponseData || {};
			let formVaribalesObj = {};
			for (let i = 0; i < response?.length; i++) {
				if (response?.[i]?.variableId) {
					formVaribalesObj[response?.[i]?.variableId] = response?.[i]?.answer;
				}
			}

			const updatedVariablesData = { ...info?.variablesData };
			const keyArray = Object.keys(updatedVariablesData);
			for (let i = 0; i < keyArray?.length; i++) {
				let currentKey = keyArray?.[i];
				let currentKeyArray = [...(updatedVariablesData?.[currentKey] || [])];

				for (let j = 0; j < currentKeyArray?.length; j++) {
					if (formVaribalesObj?.[currentKeyArray?.[j]?._id]) {
						currentKeyArray[j].value = formVaribalesObj?.[currentKeyArray?.[j]?._id];
					}
				}
			}
			setInfo((prev) => ({
				...prev,
				variablesData: updatedVariablesData,
				varibalesModified: true,
			}));
		}
	}, [info?.variablesData, formResponseData, info?.varibalesModified]);

	useEffect(() => {
		if (
			info?.varibalesModified &&
			info?.variablesData &&
			info?.iframeReady &&
			!info?.variableInitialised
		) {
			const variableArray = [].concat(...Object.values(info?.variablesData));
			const iframe = document.querySelector('iframe');
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.postMessage(
					{ type: 'REPLACE_TEXT_ARRAY', textArray: [...variableArray] },
					origin,
				);
				setInfo((prev) => ({ ...prev, variableInitialised: true }));
			}
		}
	}, [
		info?.variablesData,
		info?.varibalesModified,
		info?.iframeReady,
		info?.variableInitialised,
	]);

	//function defination
	//when the variable is clicked, autofocus the input

	const handleMessage = useCallback((event) => {
		if (event.origin !== origin) return;

		if (event.data.type === 'IFRAME_READY') {
			setInfo((prev) => ({ ...prev, iframeReady: true }));
		}

		if (event.data.type === 'CONSOLE_LOG') {
			console.log('Log from iframe:', event.data);
		} else if (event.data.type === 'SPAN_CLICKED') {
			scrollToElement(event?.data?.id);
		}
	}, []);

	const variableOnFocusFunc = (id) => {
		const iframe = document.querySelector('iframe');
		if (iframe && iframe.contentWindow) {
			iframe.contentWindow.postMessage(
				{
					type: 'SCROLL_TO_ELEMENT',
					id: id,
				},
				origin,
			);
		}
	};

	//variableOnChangeFunc
	const variableOnChangeFunc = useCallback(
		async (updatedData) => {
			const moduleType = updatedData?.moduleType;
			const iframe = document.querySelector('iframe');
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.postMessage(
					{ type: 'REPLACE_TEXT', text: updatedData.value, id: updatedData._id },
					origin,
				);
			}

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
		async (updateServiceBlockInfo, index) => {
			let updatedServiceData = [...(info?.servicesTableData || [])];
			updatedServiceData?.splice(index, 1, updateServiceBlockInfo);
			const serviceBlockId = updateServiceBlockInfo?._id;
			const proposalData = { ...info.proposal };
			const { sections } = proposalData;
			let replaceServiceIndex = -1;
			for (let i = 0; i < sections?.length; i++) {
				if (sections?.[i]?.type === 'services' && sections?.[i]?._id === serviceBlockId) {
					replaceServiceIndex = i;
					break;
				}
			}

			if (replaceServiceIndex !== -1) {
				sections?.splice(replaceServiceIndex, 1, updateServiceBlockInfo);
			}
			setInfo((prev) => ({
				...prev,
				proposal: proposalData,
				servicesTableData: updatedServiceData,
			}));
			handleDebounceUpdate('proposal', proposalData);
		},
		[info?.servicesTableData, info?.proposal],
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
		const {
			activeVersion,
			_id,
			variables,
			tables,
			paymentSchedule,
			workflowId,
			expiryInDays,
			sections,
		} = moduleData || {};

		const payload = {
			proposalId: _id,
			workflowId,
			proposalInput: {
				versions: {
					expiryInDays,
					paymentSchedule,
					variables,
					tables,
					sections,
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
			window.location.href = `https://builder.ve.ai/${response?.[1]?._id}?clientName=${
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

	//scroll functions
	const scrollToElement = useCallback(
		(id) => {
			let element = document.getElementById(id);
			if (!element) {
				element = document.querySelector(`[data-id="${id}"]`);
			}

			if (!element) {
				return;
			}

			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest',
			});

			if (edit) {
				// Focus the element after it scrolls
				element.focus({ preventScroll: true });
			}
		},
		[edit],
	);

	return (
		<div className="fileParentContainer">
			<div className="previewContainer">
				{edit ? (
					<div className="previewHeader">
						<span className="previewHeaderText">
							Customise your design for {workflowData?.name}
						</span>
						{info?.duplicateLoader ? (
							<Spinner width={'20px'} height={'20px'} />
						) : (
							<div
								className="editPreviewBtn"
								onClick={duplicateTemplateFromSmartFile}
							>
								<EditSvg />
								<span className="editText">Edit</span>
							</div>
						)}
					</div>
				) : (
					''
				)}

				<div
					className="previewHolderWrapper"
					style={{ borderRadius: !edit ? '26px' : '', height: '100%' }}
				>
					<iframe
						src={
							window.location.hostname === 'localhost'
								? `http://localhost:3000/preview/${templateData._id}`
								: `https://builder.ve.ai/preview/${templateData._id}`
						}
						title="Builder Preview"
						width="100%"
						height="100%"
					/>
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
					{edit
						? `Please enter the following custom data to send this proposal`
						: 'Smart File Details'}
				</span>

				<Variables
					variablesData={info?.variablesData}
					variableOnChangeFunc={variableOnChangeFunc}
					variableOnFocusFunc={variableOnFocusFunc}
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
