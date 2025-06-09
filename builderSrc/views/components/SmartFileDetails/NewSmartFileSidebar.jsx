import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/new-smart-file-sidebar.scss';
import { ReactComponent as DoubleArrow } from '../../../assets/svg/smartFile/doubleArrow.svg';
import { ReactComponent as Ai } from '../../../assets/svg/smartFile/ai.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/themeSettings/arrow_right.svg';
import Context from '../../../context/context';
import { Collapse } from 'antd';
import { ReactComponent as Warning } from '../../../assets/svg/smartFile/warning.svg';
import { ReactComponent as DownArrow } from '../../../assets/svg/smartFile/downArrow.svg';
import { ReactComponent as UpperArrow } from '../../../assets/svg/smartFile/upperArrow.svg';
import File from './File';
import Variables from './Variables';
import ViewDocument from '../ViewDocument/viewDocument';
import { useNavigate, useLocation } from 'react-router-dom';
import DocumentShare from '../../feature/document/DocumentShare';
import FormDescription from '../../feature/document/FormDescription';
import { fetchOriginSelection } from '../../../helper';

let origin = fetchOriginSelection();

const SmartFileSidebar = ({
	workflowId,
	templateId,
	showSmartFileSidebar,
	serviceBlockChanges,
	eventsBlockChanges,
	variableBlockChanges,
	scrollAndHighlightElement,
	handleReplaceMultipleInput,
	clientDetails,
	previewReady,
	onGoBack,
	onGetSummery,
	showSignatureModal,
	onCloseSignatureModal,
	formResponseId,
	workflowInfo,
}) => {
	const navigate = useNavigate();

	const {
		templates: {
			getSmartFileData,
			smartFileInfo,
			getSmartFileVariablesData,
			smartFileVariablesData,
			getEventsPresets,
			chnageWorkflowStats,
			getFormResponse,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		filesData: {},
		modules: [],
		status: '',
		slug: '',
		defaultActiveArray: [],
		variablesData: [],
		clientDetails: clientDetails || {},
		isAiEnabled: false,
		documentTitle: '',
		shareModalIsOpen: false,
	});
	const location = useLocation();
	const isWorkflowPath = location.pathname.startsWith('/document');
	const [isActive, setIsActive] = useState(false);
	const [showSummary, setShowSummary] = useState(false);
	const [activeTab, setActiveTab] = useState('document');
	const [formResponses, setFormResponses] = useState([]);

	// --- Workflow Warnings Logic ---
	const workflowWarnings = useMemo(() => {
		if (!workflowInfo || !workflowInfo.summary) return [];
		const { sections = [], tables = [] } = workflowInfo.summary;
		const warnings = [];
		const sectionMap = new Map();
		const tableMap = new Map();

		// Helper to get display name
		const stripHtml = (html) =>
			typeof html === 'string' ? html.replace(/<[^>]*>/g, '').trim() : '';

		const getDisplayName = (item) => {
			const subTotalTitle =
				(item.style && item.style.subTotalTitle) ||
				(item.styles && item.styles.subTotalTitle);
			const subTotalTitleText = subTotalTitle ? stripHtml(subTotalTitle) : null;
			return (
				item.label ||
				item.title ||
				(item.style && item.style.title) ||
				(item.styles && item.styles.title) ||
				subTotalTitleText ||
				item._id
			);
		};

		sections.forEach((section) => {
			sectionMap.set(section._id, section);
		});
		tables.forEach((table) => {
			tableMap.set(table._id, table);
		});

		// Check for sections not in tables
		sections.forEach((section) => {
			const sectionName = getDisplayName(section);
			if (!tableMap.has(section._id)) {
				warnings.push(
					`Section '${sectionName}' (type: ${section.type}) is missing in tables. Please delete the workflow and redesign.`,
				);
			} else {
				// If exists in both, check type
				const table = tableMap.get(section._id);
				const tableName = getDisplayName(table);
				if (section.type !== table.type) {
					warnings.push(
						`Type mismatch for '${sectionName}': section type is '${section.type}', table type is '${table.type}'. Please review.`,
					);
				}
			}
		});

		// Check for tables not in sections
		tables.forEach((table) => {
			const tableName = getDisplayName(table);
			if (!sectionMap.has(table._id)) {
				warnings.push(
					`Table '${tableName}' (type: ${table.type}) is missing in sections. Please contact us.`,
				);
			}
		});

		return warnings;
	}, [workflowInfo]);

	useEffect(() => {
		if (showSmartFileSidebar) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [showSmartFileSidebar]);

	useEffect(() => {
		getSmartFileInfo();
		getEventsPresetsData();
	}, []);

	useEffect(() => {
		if (smartFileInfo) {
			handleSmartFileData();
		}
	}, [smartFileInfo]);

	useEffect(() => {
		if (smartFileVariablesData && previewReady) {
			const combinedVariables = [
				...(smartFileVariablesData?.module || []),
				...(smartFileVariablesData?.custom || []),
			];
			setInfo((prev) => ({
				...prev,
				variablesData: combinedVariables,
			}));

			if (combinedVariables.length > 0) {
				const initialValues = combinedVariables
					.filter((v) => v.value || v.defaultValue)
					.map((v) => ({
						_id: v._id,
						value: v.value || v.defaultValue,
					}));

				if (initialValues.length > 0) {
					handleReplaceMultipleInput(initialValues);
				}
			}
		}
	}, [smartFileVariablesData, previewReady, handleReplaceMultipleInput]);

	useEffect(() => {
		if (!formResponseId) return;
		const fetchFormResponses = async () => {
			const formId = formResponseId;
			const data = await getFormResponse({ formId });
			if (data && data.response) {
				setFormResponses(data.response);
			}
		};
		fetchFormResponses();
	}, [getFormResponse, formResponseId]);

	useEffect(() => {
		if (showSignatureModal) {
			const signatureComponent = document.querySelector('.signature-component');
			if (signatureComponent) {
				const notSignedElement = signatureComponent.querySelector(
					'span[style*="cursor: pointer"]',
				);
				if (notSignedElement) {
					notSignedElement.click();
				}
			}
			if (onCloseSignatureModal) {
				onCloseSignatureModal();
			}
		}
	}, [showSignatureModal, onCloseSignatureModal]);

	const scrollToElement = useCallback(
		(id) => {
			if (!id) {
				return;
			}
			if (typeof scrollAndHighlightElement === 'function') {
				scrollAndHighlightElement(id);
			} else {
				console.error(
					'scrollToElement: scrollAndHighlightElement is not a function',
					scrollAndHighlightElement,
				);
			}
		},
		[scrollAndHighlightElement],
	);

	const getSmartFileInfo = useCallback(async () => {
		if (workflowId) {
			getSmartFileData({
				getWorkflowWithModulesId: workflowId,
			});
			getSmartFileVariablesData({
				workflowId: workflowId,
			});
		}
	}, [workflowId]);

	const handleSmartFileData = useCallback(() => {
		if (smartFileInfo) {
			const {
				file = [],
				modules = [],
				clientDetails = {},
				slug,
				status,
				title = 'Untitled Document',
			} = smartFileInfo || {};

			let fileMapper = {};
			let defaultActiveArray = [];

			modules?.forEach((module, index) => {
				fileMapper[module._id] = null;
				defaultActiveArray.push(index + 1);
			});

			file?.forEach((fileItem) => {
				fileMapper[fileItem._id] = fileItem;
			});

			setInfo((prev) => ({
				...prev,
				filesData: fileMapper,
				modules,
				status,
				slug,
				defaultActiveArray,
				clientDetails: clientDetails || {},
				documentTitle: title,
			}));
		}
	}, [smartFileInfo]);

	const handleAiToggle = useCallback((enabled) => {
		setInfo((prev) => ({
			...prev,
			isAiEnabled: enabled,
		}));
	}, []);

	const onKeyChange = useCallback((key) => {
		setInfo((prev) => ({ ...prev, defaultActiveArray: key }));
	}, []);

	const fileOptions = useMemo(() => {
		let fileOptionsArray = [];

		for (let i = 0; i < info?.modules?.length; i++) {
			const moduleData = info?.filesData?.[info?.modules?.[i]?._id];

			const hasServiceData = moduleData?.versions?.[0]?.sections?.some(
				(section) => section.type === 'services',
			);
			const hasEventsData = moduleData?.versions?.[0]?.tables?.some(
				(table) => table.type === 'events',
			);
			const hasPaymentData = moduleData?.versions?.[0]?.sections?.some(
				(section) => section.type === 'invoice-with-payment',
			);
			const hasSignatureData = moduleData?.versions?.[0]?.tables?.some(
				(table) => table.type === 'contract-with-signature',
			);

			const hasData = hasServiceData || hasEventsData || hasPaymentData || hasSignatureData;

			if (hasData) {
				fileOptionsArray.push({
					key: i + 1,
					label: info?.modules?.[i]?.label,
					moduleData: moduleData,
					hasData: true,
				});
			}
		}

		return fileOptionsArray;
	}, [info]);

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

	const updateLocalStateData = useCallback(
		(payload) => {
			setInfo((prev) => ({ ...prev, ...payload }));
		},
		[info],
	);

	if (!showSmartFileSidebar) {
		return null;
	}

	const handleNavigateToDocumentView = () => {
		navigate(`/builder/document/view/${workflowId}?workflow=true`);
	};

	const handleShareModal = () => {
		setInfo((prev) => ({
			...prev,
			shareModalIsOpen: !prev.shareModalIsOpen,
		}));
	};

	const handleStatusChange = useCallback(async () => {
		if (info.status === 'enquiry' || info.status === 'draft') {
			await chnageWorkflowStats({
				fileSentStatusId: workflowId,
			});
			getSmartFileData({
				getWorkflowWithModulesId: workflowId,
			});
		}
	}, [workflowId, info.status, chnageWorkflowStats]);

	const handleButtonClick = () => {
		if (info.status === 'enquiry' || info.status === 'draft') {
			handleShareModal();
		} else {
			handleNavigateToDocumentView();
		}
	};

	return (
		<div
			className={`smartFileSideBarParentContainer${
				isWorkflowPath ? ' with-document-padding' : ''
			} ${isActive ? 'active' : ''}`}
		>
			<div className="createDocumentHeader" onClick={() => navigate(-1)}>
				<span className="back-arrow">←</span>
				<span className="createDocumentTitle">Back</span>
			</div>
			<div className="sidebarContent">
				<div className="smartFileSideBarHeader">
					<span>{info.documentTitle || 'Untitled Document'}</span>
				</div>
				{formResponseId ? (
					<>
						<div className="smartFileTabsBar">
							<button
								type="button"
								style={{
									background:
										activeTab === 'document' ? '#c2ff00' : 'transparent',
									color: activeTab === 'document' ? '#000' : '#f2f2f3',
									border: 'none',
									borderRadius: 8,
									padding: '6px 18px',
									fontWeight: 500,
									fontSize: 14,
									cursor: 'pointer',
									transition: 'background 0.2s',
								}}
								onClick={() => setActiveTab('document')}
							>
								Document
							</button>
							<button
								type="button"
								style={{
									background: activeTab === 'form' ? '#c2ff00' : 'transparent',
									color: activeTab === 'form' ? '#000' : '#f2f2f3',
									border: 'none',
									borderRadius: 8,
									padding: '6px 18px',
									fontWeight: 500,
									fontSize: 14,
									cursor: 'pointer',
									transition: 'background 0.2s',
								}}
								onClick={() => setActiveTab('form')}
							>
								Form Response
							</button>
						</div>
						{activeTab === 'document' && (
							<>
								<div className="smartFileFormSubHeader">
									<span>Update manage document</span>
								</div>
								<Variables
									data={info?.variablesData || []}
									clientDetails={info?.clientDetails || {}}
									variableBlockChanges={variableBlockChanges}
									updateLocalStateData={updateLocalStateData}
									scrollAndHighlightElement={scrollToElement}
									handleReplaceMultipleInput={handleReplaceMultipleInput}
									previewReady={previewReady}
									formResponses={formResponses}
								/>
								{workflowWarnings.length > 0 && (
									<div className="workflow-warnings-container-parent">
										<div className="workflow-warnings-container">
											<span>Workflow Warnings</span>
										</div>
										<ul
											className="workflow-warnings"
											style={{
												color: '#ffb300',
												margin: '8px 0',
												fontSize: 13,
											}}
										>
											{workflowWarnings.map((warning, idx) => (
												<li key={idx} style={{ marginBottom: 4 }}>
													{warning}
												</li>
											))}
										</ul>
									</div>
								)}
								<Collapse
									ghost
									activeKey={info?.defaultActiveArray || []}
									onChange={onKeyChange}
									style={{ marginTop: '2px' }}
								>
									{fileOptions.map((option) => (
										<Collapse.Panel
											showArrow={false}
											className="customAccordionHeader"
											style={{ marginBottom: '24px' }}
											header={<CustomAccordionHeader option={option} />}
											key={option.key}
										>
											<File
												fileData={option.moduleData}
												workflowId={workflowId}
												serviceBlockChanges={serviceBlockChanges}
												eventsBlockChanges={eventsBlockChanges}
												scrollAndHighlightElement={scrollToElement}
												formResponses={formResponses}
											/>
										</Collapse.Panel>
									))}
								</Collapse>
							</>
						)}
						{activeTab === 'form' && (
							<div
								style={{
									color: '#f2f2f3',
									padding: '32px 0',
									textAlign: 'center',
									fontSize: 16,
								}}
							>
								<FormDescription formResponseId={formResponseId} />
							</div>
						)}
					</>
				) : (
					<>
						<div className="smartFileFormSubHeader">
							<span>Update manage document</span>
						</div>
						<Variables
							data={info?.variablesData || []}
							clientDetails={info?.clientDetails || {}}
							variableBlockChanges={variableBlockChanges}
							updateLocalStateData={updateLocalStateData}
							scrollAndHighlightElement={scrollToElement}
							handleReplaceMultipleInput={handleReplaceMultipleInput}
							previewReady={previewReady}
							formResponses={formResponses}
						/>
						{workflowWarnings.length > 0 && (
							<div className="workflow-warnings-container-parent">
								<div className="workflow-warnings-container">
									<span>Workflow Warnings</span>
								</div>
								<ul
									className="workflow-warnings"
									style={{ color: '#ffb300', margin: '8px 0', fontSize: 13 }}
								>
									{workflowWarnings.map((warning, idx) => (
										<li key={idx} style={{ marginBottom: 4 }}>
											{warning}
										</li>
									))}
								</ul>
							</div>
						)}
						<Collapse
							ghost
							activeKey={info?.defaultActiveArray || []}
							onChange={onKeyChange}
							style={{ marginTop: '2px' }}
						>
							{fileOptions.map((option) => (
								<Collapse.Panel
									showArrow={false}
									className="customAccordionHeader"
									style={{ marginBottom: '24px' }}
									header={<CustomAccordionHeader option={option} />}
									key={option.key}
								>
									<File
										fileData={option.moduleData}
										workflowId={workflowId}
										serviceBlockChanges={serviceBlockChanges}
										eventsBlockChanges={eventsBlockChanges}
										scrollAndHighlightElement={scrollToElement}
										formResponses={formResponses}
									/>
								</Collapse.Panel>
							))}
						</Collapse>
					</>
				)}
			</div>
			<div className="smartFileSidebarFooter">
				<div className="getSummeryButton" onClick={handleButtonClick}>
					{info.status === 'enquiry' || info.status === 'draft'
						? 'Share & Publish'
						: 'Update'}
					<RightArrow />
				</div>
			</div>
			{(info.status === 'enquiry' || info.status === 'draft') && (
				<DocumentShare
					isOpen={info.shareModalIsOpen}
					onClose={handleShareModal}
					onCopy={handleStatusChange}
					status={info.status}
				/>
			)}
		</div>
	);
};

export default memo(SmartFileSidebar);

const CustomAccordionHeader = ({ option }) => {
	if (!option?.hasData) {
		return null;
	}

	return (
		<div className="customHeaderComponent">
			<div className="customHeaderUpperComponent">
				<div className="customHeaderTitleContainer">
					<span>{option.label}</span>
					<Warning />
				</div>
				<DownArrow />
			</div>
			<span>Page {option.key}</span>
		</div>
	);
};
