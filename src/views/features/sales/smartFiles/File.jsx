/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import Events from '../../../components/smartFileComponets/Events';
import Services from '../../../components/smartFileComponets/Services';
import PaymentSchedule from '../../../components/smartFileComponets/PaymentSchedule';
import Variables from '../../../components/smartFileComponets/Variables';
import Context from '../../../../context/context';
import AcceptedStageSmartFileBlocks from '../../../components/smartFileComponets/AcceptedStageSmartFileBlocks';
import { ReactComponent as EditSvg } from '../.././../../assets/svg/worflow_builder/edit.svg';
import { ReactComponent as Ai } from '../.././../../assets/svg/sales/smartFile/coloredAi.svg';
import Spinner from '../../../components/loaders/Spinner';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import ToggleSlider from '../../../components/input/slider';
import { Spin } from 'antd';
import _ from 'lodash';
import AccpetAiGeneratedValues from '../../../components/modalsV2/proposalModals/AccpetAiGeneratedValues';
let origin =
	window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://builder.ve.ai';
const File = ({
	templateData,
	workflowData,
	userSigned,
	edit,
	expiresAt,
	updateSendSmartFileExpiryData,
	workflowStatus,
	slug,
}) => {
	const { workflowId } = useParams();
	const timeoutRef = useRef(null);
	let {
		templates: {
			smartFileInfo,
			updateProposal,
			updateContracts,
			updateInvoice,
			updateForm,
			updateThankyou,
			formResponseData,
			updateSendSmartFileSettings,
			getEventsPresets,
			getAiPredictionForSmartFile,
			aiPredictedData,
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
		smartFileStatus: '',
		templatesMapper: null,
		duplicateLoader: false,
		expiryInDays: null,
		varibalesModified: false,
		iframeReady: false,
		variableInitialised: false,
		useAiPredictions: false,
		storedPreviousProposalData: null,
		gotGenerated: false,
		generatePredictionsLoading: false,
		fetchingAiPredictionsLoading: true,
		acceptAiGeneratedModal: false,
	});

	useEffect(() => {
		window.addEventListener('message', handleMessage);
		getEventsPresetsData();
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
					if (ele?.type !== 'workspace' && !ele?.blockId) {
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

	useEffect(() => {
		getAiPredictionForSmartFile(slug);
	}, [slug]);

	useEffect(() => {
		if (aiPredictedData) {
			setInfo((prev) => ({ ...prev, fetchingAiPredictionsLoading: false }));
		}
	}, [aiPredictedData]);

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
			const iframe = document.querySelector('iframe');
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.postMessage(
					{ type: 'SERVICE_TABLE_DATA', serviceBlock: updateServiceBlockInfo },
					origin,
				);
			}

			let updatedServiceData = [...(info?.servicesTableData || [])];
			updatedServiceData?.splice(index, 1, updateServiceBlockInfo);
			const serviceBlockId = updateServiceBlockInfo?._id;
			const proposalData = { ...info.proposal };
			const { sections, tables } = proposalData;
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

			//syncing tables also
			const { _id, blocks } = updateServiceBlockInfo || {};
			const blcoksMapper = {};
			for (let i = 0; i < blocks?.length; i++) {
				blcoksMapper[blocks?.[i]?._id] = blocks?.[i]?.subBlocks?.[0];
			}

			for (let i = 0; i < tables?.length; i++) {
				if (tables?.[i]?.type === 'services' && tables?.[i]?._id === _id) {
					let values = tables?.[i]?.values || [];

					for (let j = 0; j < values?.length; j++) {
						if (blcoksMapper?.[values?.[j]?.blockId]) {
							const {
								show,
								amount,
								description,
								price,
								quantity,
								title,
								currency,
								imageURL,
							} = blcoksMapper?.[values?.[j]?.blockId] || {};
							values[j] = {
								...(values[j] || {}),
								show,
								amount,
								description,
								price,
								quantity,
								title,
								currency,
								image: imageURL,
							};
						}
					}
					tables[i].values = values;
				}
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

			const iframe = document.querySelector('iframe');
			if (iframe && iframe.contentWindow) {
				iframe.contentWindow.postMessage(
					{ type: 'EVENTS_TABLE_DATA', eventsTable: updatedEventsData },
					origin,
				);
			}

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
		[
			info?.eventsTableData,
			info?.proposal,
			info?.contract,
			info?.invoice,
			info?.thankyou,
			info?.form,
		],
	);

	//proposalUpdate
	const updateProposalFunc = useCallback(async (moduleData) => {
		setInfo((prev) => ({ ...prev, proposal: _.cloneDeep(moduleData || {}) }));

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

	const handleDebounceUpdate = useCallback(
		(module, moduleData) => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				moduleUpdateFuncWrapper?.[module](moduleData);
			}, 1000);
		},
		[moduleUpdateFuncWrapper, timeoutRef],
	);

	const duplicateTemplateFromSmartFile = useCallback(async () => {
		window.location.href = `${origin}/${workflowId}?workflow=true`;
	}, [workflowData]);

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

	const updateSmartFileExpiry = useCallback(
		async (data) => {
			const payload = {
				updateWorkflowId: workflowId,
				updateWorkflowInput: {
					expiresAt: moment().add(data, 'days').unix(),
				},
			};

			const response = await updateSendSmartFileSettings(payload);
			if (response?.[0]) {
				updateSendSmartFileExpiryData(moment().add(data, 'days').unix());
			}
		},
		[workflowId],
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

	//get preset data for events
	const getEventsPresetsData = useCallback(async () => {
		const params = {
			page: 1,
			limit: 50,
			sortBy: 'createdAt',
			sortType: -1,
			subType: 'event_table',
		};
		getEventsPresets(params);
	}, []);

	// ai prediction
	const generatePridictions = useCallback(() => {
		if (aiPredictedData && info?.eventsTableData && info?.proposal && !info?.gotGenerated) {
			//storing current propsal data to disgard ai generated data

			setInfo((prev) => ({
				...prev,
				storedPreviousProposalData: _.cloneDeep(info?.proposal || {}),
			}));

			let updatedProposal = _.cloneDeep(info?.proposal || {});
			let updatedEventstabledata = { ...(info?.eventsTableData || {}) };

			//handling events
			const response = generatePredictionsForEvents(updatedProposal, aiPredictedData);
			if (response?.[0]) {
				const eventsTableData = response?.[2];
				updatedEventstabledata.proposal = [...(eventsTableData || [])];
				updatedProposal = _.cloneDeep(response?.[1]);
			}

			//handling services
			const updatedProposalObj = generatePredictionForService(
				updatedProposal,
				aiPredictedData,
			);
			updatedProposal = _.cloneDeep(updatedProposalObj);

			setInfo((prev) => ({
				...prev,
				eventsTableData: updatedEventstabledata,
				gotGenerated: true,
				generatePredictionsLoading: false,
				proposal: updatedProposal,
			}));
		}
	}, [aiPredictedData, info?.eventsTableData, info?.proposal, info?.gotGenerated]);

	const generatePredictionsForEvents = useCallback((updatedProposal, aiPredictedData) => {
		const eventsPredictions = aiPredictedData?.filter((ele) => ele?.type === 'events');
		if (!eventsPredictions?.length) {
			setInfo((prev) => ({
				...prev,
				storedPreviousProposalData: null,
			}));
			return [false];
		}
		const eventsTableData = [];
		let i = 0;
		for (let m = 0; m < updatedProposal?.tables?.length; m++) {
			if (updatedProposal?.tables?.[m]?.type === 'events') {
				const proposalEventsTable = updatedProposal?.tables?.[m];
				const { values = [] } = proposalEventsTable || {};
				for (let j = 0; j < values?.length; j++) {
					if (i > eventsPredictions?.length) {
						break;
					}
					const predictedRoles = eventsPredictions?.[i]?.['events']?.[j]?.['output'];
					const roles = [];
					for (let k = 0; k < predictedRoles?.length; k++) {
						roles?.push({
							type: predictedRoles?.[k]?.type,
							categories: [
								{
									category: 'candid',
									quantity: predictedRoles?.[k]?.quantity || 0,
								},
								{
									category: 'traditional',
									quantity: 0,
								},
							],
						});
					}
					values[j].roles = [...(roles || [])];
				}
				proposalEventsTable.values = [...values];
				eventsTableData.push({
					...(proposalEventsTable || {}),
					moduleType: 'proposal',
					ai_generated: true,
				});
				i++;
			}
		}
		return [true, updatedProposal, eventsTableData];
	}, []);

	const generatePredictionForService = useCallback((proposaldata, aiPredictedData) => {
		//prediction is one to one mapping from tables, so we need check its order from section
		const updatedProposal = _.cloneDeep(proposaldata);

		//handling service prediction
		const servicePrediction = aiPredictedData?.filter((ele) => ele?.type === 'services');
		if (!servicePrediction?.length) {
			return updatedProposal;
		}

		const serviceTableMapper = {};
		let order = 1;
		//adding values to mapper
		for (let m = 0; m < updatedProposal?.tables?.length; m++) {
			if (updatedProposal?.tables?.[m]?.type === 'services') {
				serviceTableMapper[updatedProposal?.tables?.[m]?._id] = { order, data: null };
				order++;
			}
		}
		//extracting current data from sections and adding it in mapper
		for (let i = 0; i < updatedProposal?.sections?.length; i++) {
			if (
				updatedProposal?.sections?.[i].type === 'services' &&
				serviceTableMapper?.[updatedProposal?.sections?.[i]?._id]
			) {
				serviceTableMapper[updatedProposal?.sections?.[i]?._id]['data'] =
					updatedProposal?.sections?.[i];
			}
		}
		//fetch the values
		let serviceDataMapped = Object.values(serviceTableMapper);
		serviceDataMapped = serviceDataMapped?.sort((a, b) => a?.order - b?.order);

		//iterating predictions and changing values

		for (let i = 0; i < serviceDataMapped?.length; i++) {
			const { blocks = [] } = serviceDataMapped?.[i]?.data || {};

			for (let j = 0; j < blocks.length; j++) {
				const { subBlocks } = blocks[j];
				if (servicePrediction?.[i]?.['services']?.[j]?.['output']) {
					const { quantity, isSelected } =
						servicePrediction?.[i]?.['services']?.[j]?.['output'] || {};
					subBlocks[0].quantity = quantity;
					subBlocks[0].show = isSelected;
					serviceDataMapped[i].data.ai_generated = true;
				}
				blocks[j].subBlocks = [...subBlocks];
			}
			serviceDataMapped[i].data.blocks = [...blocks];
			serviceTableMapper[serviceDataMapped[i]?.data?._id] = serviceDataMapped[i]?.data;
		}
		//updating values in sections
		for (let i = 0; i < updatedProposal?.sections?.length; i++) {
			if (
				updatedProposal?.sections?.[i].type === 'services' &&
				serviceTableMapper?.[updatedProposal?.sections?.[i]?._id]
			) {
				updatedProposal.sections[i] = {
					...serviceTableMapper?.[updatedProposal?.sections?.[i]?._id],
				};
			}
		}

		return updatedProposal;
	}, []);

	const onChangeAiPrediction = useCallback(
		(value) => {
			setInfo((prev) => ({ ...prev, useAiPredictions: value }));
			if (value && aiPredictedData) {
				generatePridictions();
				setInfo((prev) => ({ ...prev, generatePredictionsLoading: true }));
			}
		},
		[slug, aiPredictedData],
	);

	const onAiGenerationRejection = useCallback(() => {
		if (info?.storedPreviousProposalData) {
			syncEventTableData(info?.storedPreviousProposalData);
			setInfo((prev) => ({
				...prev,
				proposal: { ...(info?.storedPreviousProposalData || {}) },
				gotGenerated: false,
				generatePredictionsLoading: false,
				useAiPredictions: false,
			}));
		}
	}, [info?.storedPreviousProposalData, info?.eventsTableData]);

	const acceptAigeneratedValues = useCallback(async () => {
		const moduleData = _.cloneDeep(info?.proposal || {});
		//need to remove ai_generated keyword from the services sections
		for (let i = 0; i < moduleData?.sections?.length; i++) {
			if (moduleData?.sections?.[i]?.type === 'services') {
				delete moduleData?.sections?.[i]?.ai_generated;
			}
		}

		handleDebounceUpdate('proposal', moduleData);
		syncEventTableData(moduleData);
		setInfo((prev) => ({
			...prev,
			gotGenerated: false,
			useAiPredictions: false,
			generatePredictionsLoading: false,
		}));
	}, [info?.proposal]);

	const syncEventTableData = useCallback(
		(proposalData) => {
			let updatedEventstabledata = { ...(info?.eventsTableData || {}) };
			let eventsTable = [];
			const updatedProposal = { ...(proposalData || {}) };
			for (let i = 0; i < updatedProposal?.tables?.length; i++) {
				if (updatedProposal?.tables?.[i]?.type === 'events') {
					eventsTable.push({
						...(updatedProposal?.tables?.[i] || {}),
						moduleType: 'proposal',
					});
				}
			}
			updatedEventstabledata.proposal = [...(eventsTable || [])];
			setInfo((prev) => ({
				...prev,
				eventsTableData: updatedEventstabledata,
				storedPreviousProposalData: null,
			}));
		},
		[info?.eventsTableData],
	);

	const closeAccpetAiGenerateModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, acceptAiGeneratedModal: false }));
	}, [info?.acceptAiGeneratedModal]);

	const openAiGenerateModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, acceptAiGeneratedModal: true }));
	}, [info?.acceptAiGeneratedModal]);

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
								? `http://localhost:3000/preview/${workflowId}?workflow=true`
								: `https://builder.ve.ai/preview/${workflowId}?workflow=true`
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
					propsalData={info?.proposal}
					contractData={info?.contract}
					userSigned={userSigned}
					workflowStatus={workflowStatus}
				/>
				<div className="editContainerHeaderWrapper">
					<span className="editContainerHeader">
						{edit
							? `Please enter the following custom data to send this proposal`
							: 'Smart File Details'}
					</span>
					{edit ? (
						info?.fetchingAiPredictionsLoading ? (
							<div className="aiPredictionParentContainer">
								<Ai />
								<span className="aiSuggestionstext"> Fecthing AI Suggestions</span>
								<Spin />
							</div>
						) : (
							<>
								{!info?.gotGenerated ? (
									<div className="aiPredictionParentContainer">
										<Ai />
										<span className="aiSuggestionstext">AI Suggestions</span>
										{!info?.generatePredictionsLoading ? (
											<ToggleSlider
												value={info?.useAiPredictions}
												onChange={(val) => onChangeAiPrediction(val)}
											/>
										) : (
											<Spin />
										)}
									</div>
								) : (
									<div className="aiPredictionContainerForGeneratedData">
										<div className="aiPredictionParentContainer">
											<Ai />
											<span className="aiSuggestionstext">
												AI Suggestions
											</span>
										</div>
										<div className="acceptRejectButtonContainer">
											<div
												className="rejectAiGeneration"
												onClick={onAiGenerationRejection}
											>
												Reject
											</div>
											<div
												className="acceptAigeneration"
												onClick={acceptAigeneratedValues}
											>
												Accept
											</div>
										</div>
									</div>
								)}
							</>
						)
					) : (
						''
					)}
				</div>

				<Variables
					variablesData={info?.variablesData}
					variableOnChangeFunc={variableOnChangeFunc}
					variableOnFocusFunc={variableOnFocusFunc}
					editable={edit}
					expiryInDays={info?.expiryInDays}
					handleUpdateVaraiblesArray={handleUpdateVaraiblesArray}
					expiresAt={expiresAt}
					updateSmartFileExpiry={updateSmartFileExpiry}
					gotUnacceptedAiGeneratedValue={info?.gotGenerated}
					openAiGenerateModal={openAiGenerateModal}
				/>
				<Events
					eventsData={info?.eventsTableData}
					eventsDataChange={eventsTableOnChangeFunc}
					editable={edit}
					getEventsPresetsData={getEventsPresetsData}
					gotUnacceptedAiGeneratedValue={info?.gotGenerated}
					openAiGenerateModal={openAiGenerateModal}
				/>

				<Services
					serviceData={info?.servicesTableData}
					serviceOnChangeFunc={serviceTableOnChnageFunc}
					editable={edit}
					gotUnacceptedAiGeneratedValue={info?.gotGenerated}
					openAiGenerateModal={openAiGenerateModal}
				/>
				<AccpetAiGeneratedValues
					open={info?.acceptAiGeneratedModal}
					closeModal={closeAccpetAiGenerateModal}
					openAiGenerateModal={openAiGenerateModal}
					acceptAiChanges={acceptAigeneratedValues}
				/>

				{/* <PaymentSchedule /> */}
			</div>
		</div>
	);
};

export default memo(File);
