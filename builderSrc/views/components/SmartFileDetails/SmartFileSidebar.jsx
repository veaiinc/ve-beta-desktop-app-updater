import { Drawer } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/smart-file-sidebar.scss';
import { ReactComponent as DoubleArrow } from '../../../assets/svg/smartFile/doubleArrow.svg';
import { ReactComponent as Ai } from '../../../assets/svg/smartFile/ai.svg';
import ToggleSlider from '../ui-components/slider';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import { Collapse } from 'antd';
import { ReactComponent as Warning } from '../../../assets/svg/smartFile/warning.svg';
import { ReactComponent as DownArrow } from '../../../assets/svg/smartFile/downArrow.svg';
import { ReactComponent as UpperArrow } from '../../../assets/svg/smartFile/upperArrow.svg';
import { useLocation } from 'react-router-dom';
import File from './File';
import Variables from './Variables';
const SmartFileSidebar = ({
	showSmartFileSidebar,
	closeSmartFileSidebar,
	serviceBlockChanges,
	eventsBlockChanges,
	variableBlockChanges,
	scrollAndHighlightElement,
	handleRemoveActiveBlockIdToScroll,
	activeBlockIdToScroll,
	fetchAgain = null,
	changeFetchAgain,
	handleReplaceMultipleInput,
	previewReady,
}) => {
	const {
		templates: {
			getSmartFileData,
			smartFileInfo,
			getSmartFileVariablesData,
			smartFileVariablesData,
			getEventsPresets,
		},
	} = useContext(Context);
	const location = useLocation();
	const isWorkflowPath = location.pathname.startsWith('/workflow');
	// console.log(isWorkflowPath, 'work');
	// for this route this template Id is ==- workflow Id as route says workflow =true
	const { templateID } = useParams();

	const [info, setInfo] = useState({
		filesData: {},
		modules: [],
		status: '',
		slug: '',
		defaultActiveArray: [],
		variablesData: [],
		clientDetails: {},
		localTemplateID: templateID,
	});

	useEffect(() => {
		if (templateID) {
			setInfo((prev) => ({ ...prev, localTemplateID: templateID }));
		}
	}, [templateID]);

	//useEffects
	useEffect(() => {
		getSmartFileInfo();
		getEventsPresetsData();
	}, []);

	useEffect(() => {
		if (fetchAgain) {
			getSmartFileInfo();
			changeFetchAgain(null);
		}
	}, [fetchAgain]);

	useEffect(() => {
		if (smartFileInfo) {
			handleSmartFileData();
		}
	}, [smartFileInfo]);

	useEffect(() => {
		if (smartFileVariablesData) {
			setInfo((prev) => ({
				...prev,
				variablesData:
					[
						...(smartFileVariablesData?.module || []),
						...(smartFileVariablesData?.custom || []),
					] || [],
			}));
		}
	}, [smartFileVariablesData]);

	useEffect(() => {
		if (activeBlockIdToScroll) {
			scrollToElement(activeBlockIdToScroll);
			handleRemoveActiveBlockIdToScroll();
		}
	}, [activeBlockIdToScroll]);

	//function defination

	//scroll functions
	const scrollToElement = useCallback((id) => {
		const requiredId = `sidebar-` + id;
		let element = document.getElementById(requiredId);
		if (!element) {
			element = document.querySelector(`[data-id="${requiredId}"]`);
		}

		if (!element) {
			return;
		}

		element.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'nearest',
		});

		element?.focus({ preventScroll: true });
	}, []);

	const getSmartFileInfo = useCallback(async () => {
		getSmartFileData({
			getWorkflowWithModulesId: info?.localTemplateID || templateID,
		});
		getSmartFileVariablesData({
			workflowId: info?.localTemplateID || templateID,
		});
	}, [templateID, fetchAgain, info]);

	const handleSmartFileData = useCallback(() => {
		if (smartFileInfo) {
			const {
				file = [],
				modules = [],
				clientDetails = {},
				slug,
				status,
			} = smartFileInfo || {};

			let fileMapper = {},
				defaultActiveArray = [];

			for (let i = 0; i < modules?.length; i++) {
				fileMapper[modules?.[i]?._id] = null;
				defaultActiveArray?.push(i + 1);
			}

			for (let i = 0; i < file?.length; i++) {
				fileMapper[file?.[i]?._id] = file?.[i];
			}

			setInfo({
				...info,
				filesData: fileMapper,
				modules,
				status,
				slug,
				defaultActiveArray,
				clientDetails: clientDetails || {},
			});
		}
	}, [smartFileInfo]);

	const onKeyChange = useCallback(
		(key) => {
			setInfo((prev) => ({ ...prev, defaultActiveArray: key }));
		},
		[info],
	);

	const fileOptions = useMemo(() => {
		let fileOptionsArray = [];

		for (let i = 0; i < info?.modules?.length; i++) {
			fileOptionsArray.push({
				key: i + 1,
				label: info?.modules?.[i]?.label,
				children: (
					<File
						fileData={info?.filesData?.[info?.modules?.[i]?._id]}
						workflowId={templateID}
						serviceBlockChanges={serviceBlockChanges}
						eventsBlockChanges={eventsBlockChanges}
					/>
				),
			});
		}

		return fileOptionsArray;
	}, [info, serviceBlockChanges, eventsBlockChanges]);

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
	const refreshVariablesData = useCallback(() => {
		getSmartFileVariablesData({
			workflowId: info?.localTemplateID || templateID,
		});
	}, [info.localTemplateID, templateID, getSmartFileVariablesData]);

	return (
		<Drawer
			onClose={closeSmartFileSidebar}
			open={showSmartFileSidebar}
			width={'40%'}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			rootClassName="testing"
			mask={false}
		>
			<div
				className={`smartFileSideBarParentContainer`}
				style={isWorkflowPath ? { width: '100%' } : null}
			>
				{/* //header */}
				<div className="smartFileSideBarHeader">
					{/* <DoubleArrow onClick={closeSmartFileSidebar} /> */}
					Smart file Details
				</div>
				<div className="smartFileFormSubHeader">
					<span>Please enter the following custom data to send this Document</span>
					<div className="aiSuggestionSections">
						<span className="aiSuggestionsContainer">
							<Ai />
							AI Suggestions
						</span>
						<ToggleSlider />
					</div>
				</div>
				{info?.variablesData?.filter(
					(ele) =>
						ele?.displayName !== 'Grand Total' &&
						ele?.displayName !== 'Grand Total Cost',
				)?.length > 0 && (
					<Variables
						data={
							info?.variablesData?.filter(
								(ele) =>
									ele?.displayName !== 'Grand Total' &&
									ele?.displayName !== 'Grand Total Cost',
							) || []
						}
						clientDetails={info?.clientDetails || {}}
						variableBlockChanges={variableBlockChanges}
						updateLocalStateData={updateLocalStateData}
						scrollAndHighlightElement={scrollAndHighlightElement}
						handleReplaceMultipleInput={handleReplaceMultipleInput}
						previewReady={previewReady}
						onVariableUpdate={refreshVariablesData}
					/>
				)}
				<Collapse
					ghost
					activeKey={info?.defaultActiveArray || []}
					onChange={onKeyChange}
					style={{ marginTop: '24px' }}
				>
					{fileOptions.map((option) => (
						<Collapse.Panel
							showArrow={false}
							className="customAccordionHeader"
							style={{ marginBottom: '24px' }}
							header={<CustomAccordionHeader option={option} />}
							key={option.key}
						>
							{option.children}
						</Collapse.Panel>
					))}
				</Collapse>
			</div>
		</Drawer>
	);
};

export default memo(SmartFileSidebar);

const CustomAccordionHeader = ({ option }) => {
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
