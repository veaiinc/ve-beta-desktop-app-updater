import { memo, useCallback, useContext, useEffect, useState, useRef } from 'react';
import s from './toolsTab.module.scss';
import Context from '../../../../../../../context/context';
import { getFaviconUrl } from '../../../../../../../helpers';

// components
import ActionsModal from '../../../../../modalsV2/ai_assistant/ActionsModal';
import EditAgentTool from '../../../../modals/editAgentTool/EditAgentTool';
import ToggleSwitch from '../../../../../../components/input/slider';
import AddToolV2Modal from '../../../../../modalsV2/ai_assistant/AddToolV2Modal';
import EditToolVariablesModal from './EditToolVariablesModal';
import Spinner from '../../../../../loaders/Spinner';
// svgs
import { ReactComponent as SearchSvg } from '../assets/search-icon.svg';
import { ReactComponent as DeleteSvg } from '../assets/delete-icon.svg';
import { ReactComponent as EditSvg } from '../assets/edit-icon.svg';
import { ReactComponent as PlusSvg } from '../assets/plus-icon.svg';
import { ReactComponent as RobotIcon } from '../../../../../../../assets/svg/ai_assistant/robot.svg';
import { ReactComponent as DocumentIcon } from '../../../../../../../assets/svg/ai_assistant/document.svg';
import { ReactComponent as SettingsIcon } from '../../../../../../../assets/svg/ai_assistant/settings.svg';
import { ReactComponent as StarIcon } from '../../../../../../../assets/svg/ai_assistant/star.svg';
import { ReactComponent as ChevronDownIcon } from '../../../../../../../assets/svg/ai_assistant/chevron-down.svg';
import { ReactComponent as EditIcon } from '../../../../../../../assets/svg/ai_assistant/edit.svg';
import moment from 'moment';
import { message } from '../../../../../globalComponents/CustomToast';
import AgentCredentials from '../../../agentCredentials/AgentCredentials';
import DeleteModal from '../../../../../modalsV2/DeleteModal/DeleteModal';

// Debounce hook
const useDebounce = (func, timeout = 500) => {
	const timeoutRef = useRef(null);

	return (...args) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			func(...args);
		}, timeout);
	};
};

const ToolsTab = ({ agentId }) => {
	const {
		aiSetup: { updateAiAction },
		knowledgeAgent: {
			getActionsForKnowledgeAgent,
			deleteActionOfKnowledgeAgent,
			actionsInfo,
			updateToolVariables,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		actionModalOpen: false,
		aiActionList: [],
		actionsLoading: true,
		selectedAction: null,
		editAgentToolOpen: false,
		addToolModalOpen: false,
		editToolModalOpen: false,
		editToolModalTool: null,
		search: '',
		searchLoading: false,
		selectedTool: null,
		toolVariables: [],
		openDropdowns: {}, // Track which dropdowns are open
		variableSelections: {}, // Track selected options for each variable
		deleteModal: { open: false, toolId: null }, // Track delete modal state
	});

	// Ref for the first input field
	const firstInputRef = useRef(null);

	// Debounced search function
	const debouncedSearch = useDebounce((searchValue) => {
		if (agentId) {
			setInfo((prev) => ({ ...prev, searchLoading: true }));
			getActionsForKnowledgeAgent(agentId, searchValue);
		}
	}, 500);

	// Handle search input change
	const handleSearchChange = useCallback(
		(e) => {
			const searchValue = e.target.value;
			setInfo((prev) => ({ ...prev, search: searchValue }));
			debouncedSearch(searchValue);
		},
		[debouncedSearch],
	);

	const getToolLogoUrl = useCallback((typeDependencies) => {
		try {
			return typeDependencies?.logoUrl || null;
		} catch (error) {
			console.error('Error getting tool logo:', error);
			return null;
		}
	}, []);

	// Helper function to get clean description
	const getCleanDescription = useCallback((description) => {
		if (!description) return '';
		return description;
	}, []);

	useEffect(() => {
		if (agentId) {
			getActionsForKnowledgeAgent(agentId, info?.search);
		}
	}, [agentId]);

	useEffect(() => {
		if (actionsInfo) {
			const actionList = actionsInfo?.data || [];
			setInfo((prev) => {
				const firstTool =
					prev.selectedTool || (actionList.length > 0 ? actionList[0] : null);
				const variables = firstTool?.typeDependencies?.variables || {};
				const defaultSelections = {};

				// Set default selection to 'ai' for all variables
				Object.keys(variables).forEach((variableName) => {
					defaultSelections[variableName] = 'ai';
				});

				return {
					...prev,
					aiActionList: actionList,
					actionsLoading: false,
					searchLoading: false,
					// Auto-select the first tool if no tool is currently selected
					selectedTool: firstTool,
					toolVariables: Object.keys(variables).map((key) => ({
						name: key,
						...variables[key],
						value: '',
					})),
					variableSelections: {
						...prev.variableSelections,
						...defaultSelections,
					},
				};
			});
		}
	}, [actionsInfo]);

	const handleActionAdded = useCallback((newAction) => {
		setInfo((prev) => ({
			...prev,
			aiActionList: [...(prev?.aiActionList || []), newAction],
			selectedAction: null,
		}));
	}, []);

	const handleActionUpdated = useCallback((updatedAction) => {
		setInfo((prev) => ({
			...prev,
			aiActionList: prev?.aiActionList?.map((action) =>
				action?._id === updatedAction?._id ? updatedAction : action,
			),
			selectedAction: null,
		}));
	}, []);

	const closeActionModal = useCallback(() => {
		setInfo((prevStates) => ({
			...prevStates,
			actionModalOpen: false,
			selectedAction: null,
		}));
	}, []);

	const handleActionClick = useCallback((action) => {
		setInfo((prevStates) => ({
			...prevStates,
			actionModalOpen: true,
			selectedAction: action,
		}));
	}, []);

	const handleDeleteAction = useCallback(
		async (actionId) => {
			const response = await deleteActionOfKnowledgeAgent(agentId, actionId);
			if (response) {
				message.success('Action deleted successfully');
				setInfo((prev) => ({
					...prev,
					aiActionList: prev?.aiActionList?.filter((action) => action?._id !== actionId),
					selectedTool: prev.selectedTool?._id === actionId ? null : prev.selectedTool,
				}));
			} else {
				message.error('Failed to delete action');
			}
		},
		[agentId, deleteActionOfKnowledgeAgent],
	);

	const handleOpenDeleteModal = (toolId) => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: true, toolId },
		}));
	};

	const handleConfirmDelete = async () => {
		if (!info?.deleteModal?.toolId) return;
		await handleDeleteAction(info?.deleteModal?.toolId);
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false, toolId: null },
		}));
	};

	const handleCancelDelete = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false, toolId: null },
		}));
	};

	const handleToggleChange = useCallback(
		async (actionId, currentStatus, actionType) => {
			try {
				const updatedActions = info?.aiActionList?.map((action) =>
					action?._id === actionId ? { ...action, status: !currentStatus } : action,
				);

				setInfo((prev) => ({
					...prev,
					aiActionList: updatedActions,
				}));

				const response = await updateAiAction(agentId, actionId, {
					status: !currentStatus,
					type: actionType,
				});

				if (response) {
					message.success('Action status updated successfully');
				} else {
					// Revert the state if API call fails
					setInfo((prev) => ({
						...prev,
						aiActionList: info?.aiActionList,
					}));
					message.error('Failed to update action status');
				}
			} catch (error) {
				// Revert the state if API call fails
				setInfo((prev) => ({
					...prev,
					aiActionList: info?.aiActionList,
				}));
				console.log(error);
				message.error('Failed to update action status', error);
			}
		},
		[info?.aiActionList, info?.assistantId],
	);

	const refreshToolList = useCallback(() => {
		if (agentId) {
			setInfo((prev) => ({ ...prev, searchLoading: true }));
			getActionsForKnowledgeAgent(agentId, info?.search);
		}
	}, [agentId, info?.search]);

	const handleToolSelect = useCallback((tool) => {
		const variables = tool?.typeDependencies?.variables || {};
		const defaultSelections = {};

		// Set default selection to 'ai' for all variables
		Object.keys(variables).forEach((variableName) => {
			defaultSelections[variableName] = 'ai';
		});

		setInfo((prev) => ({
			...prev,
			selectedTool: tool,
			toolVariables: Object.keys(variables).map((key) => ({
				name: key,
				...variables[key],
				value: '',
			})),
			variableSelections: {
				...prev.variableSelections,
				...defaultSelections,
			},
		}));
	}, []);

	const handleVariableChange = useCallback((idx, value) => {
		setInfo((prev) => ({
			...prev,
			toolVariables: prev.toolVariables.map((v, i) => (i === idx ? { ...v, value } : v)),
		}));
	}, []);

	const handleUpdateToolVariables = useCallback(async () => {
		if (!info.selectedTool) return;

		try {
			const updatedVariables = [];

			info.toolVariables.forEach((variable) => {
				const isManualMode = info.variableSelections[variable.name] === 'manual';
				const hasUserInput = variable.value && variable.value.trim() !== '';

				const variableData = {
					name: variable.name,
					description: variable.description,
					type: variable.type,
				};

				// Add other properties if they exist
				if (variable.default !== undefined) variableData.default = variable.default;
				if (variable.examples) variableData.examples = variable.examples;
				if (variable.required) variableData.required = variable.required;
				if (variable.properties) variableData.properties = variable.properties;
				if (variable.items) variableData.items = variable.items;
				if (variable.nullable !== undefined) variableData.nullable = variable.nullable;
				if (variable.file_uploadable !== undefined)
					variableData.file_uploadable = variable.file_uploadable;

				if (isManualMode && hasUserInput) {
					// Use user input value
					variableData.value = variable.value;
				} else {
					// Use original description as value
					variableData.value = variable.description;
				}

				updatedVariables.push(variableData);
			});

			const payload = {
				type: 'executeAPIRequest',
				variables: updatedVariables,
			};

			const response = await updateToolVariables(agentId, info.selectedTool._id, payload);
			if (response?.[0] === true) {
				message.success('Tool variables updated successfully');
			} else {
				message.error('Failed to update tool variables');
			}
		} catch (error) {
			message.error('Failed to update tool variables');
		}
	}, [
		info.selectedTool,
		info.toolVariables,
		info.variableSelections,
		agentId,
		updateToolVariables,
	]);

	// Toggle dropdown
	const toggleDropdown = useCallback((variableName) => {
		setInfo((prev) => ({
			...prev,
			openDropdowns: {
				...prev.openDropdowns,
				[variableName]: !prev.openDropdowns[variableName],
			},
		}));
	}, []);

	// Close all dropdowns
	const closeAllDropdowns = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			openDropdowns: {},
		}));
	}, []);

	// Handle dropdown option selection
	const handleOptionSelect = useCallback((variableName, option) => {
		setInfo((prev) => ({
			...prev,
			variableSelections: {
				...prev.variableSelections,
				[variableName]: option,
			},
			openDropdowns: {
				...prev.openDropdowns,
				[variableName]: false,
			},
		}));
	}, []);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest(`.${s.dropdownContainer}`)) {
				closeAllDropdowns();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [closeAllDropdowns]);

	return (
		<div className={s?.actionsTabContainer}>
			<AgentCredentials />
			{/* <div className={s?.actionsHeader}>
					<div className={s?.searchInputContainer}>
					<div className={s?.searchIcon}>
						{info?.searchLoading ? (
							<Spinner width="16px" height="16px" />
						) : (
							<SearchSvg />
						)}
					</div>
					<input
						type="text"
						placeholder="Browse tools"
						className={s?.searchInput}
						value={info?.search}
						onChange={handleSearchChange}
					/>
				</div>

				</div> */}
			{/* <span className={s.description}>
				Give your agent abilities like reading emails or syncing notes.
			</span> */}

			<div className={s.twoPanelLayout}>
				{/* Left Panel - Tool List */}
				<div className={s.leftPanel}>
					<div
						className={s?.addActionButton}
						onClick={() =>
							setInfo((prevStates) => ({
								...prevStates,
								addToolModalOpen: true,
							}))
						}
					>
						<PlusSvg />
						<span>Add tool</span>
					</div>
					{info?.aiActionList?.length > 0 ? (
						<div className={s.toolList}>
							{info?.aiActionList?.map((item) => (
								<div
									key={item?._id}
									className={`${s.toolItem} ${
										info.selectedTool?._id === item?._id ? s.selected : ''
									}`}
									onClick={() => handleToolSelect(item)}
								>
									<div className={s.toolIcon}>
										{getToolLogoUrl(item?.typeDependencies) && (
											<img
												src={getToolLogoUrl(item?.typeDependencies)}
												alt="Tool icon"
												className={s.toolFavicon}
											/>
										)}
									</div>
									<div className={s.toolInfo}>
										<p className={s.toolName}>{item?.typeDependencies?.name}</p>
										<span className={s.toolDescription}>
											{getCleanDescription(
												item?.typeDependencies?.description,
											)}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className={s?.emptyState}>
							<p className={s?.emptyStateTitle}>No tools found</p>
							<p className={s?.emptyStateDescription}>Add a tool to get started.</p>
						</div>
					)}
				</div>

				{/* Right Panel - Tool Configuration */}
				<div className={s.rightPanel}>
					{info.selectedTool ? (
						<div className={s.toolConfiguration}>
							{/* Tool Header */}
							<div className={s.toolHeader}>
								<div className={s.toolTitle}>
									<span>{info.selectedTool?.typeDependencies?.name}</span>
									{/* <ChevronDownIcon className={s.chevronIcon} /> */}
								</div>
								<div className={s.toolHeaderActions}>
									<button
										className={s.headerActionButton}
										onClick={() =>
											handleOpenDeleteModal(info.selectedTool?._id)
										}
									>
										<DeleteSvg />
										Delete
									</button>
									<button
										className={s.headerActionButton}
										onClick={() => {
											setTimeout(() => {
												if (firstInputRef.current) {
													firstInputRef.current.focus();
												}
											}, 100);
										}}
									>
										<EditIcon />
										Edit tool
									</button>
									{/* <button className={s.headerActionButton}>
										<AutoRunIcon />
										Auto run
									</button> */}
									<ToggleSwitch
										id={`toggle-${info.selectedTool?._id}`}
										value={info.selectedTool?.status}
										onChange={() =>
											handleToggleChange(
												info.selectedTool?._id,
												info.selectedTool?.status,
												info.selectedTool?.type,
											)
										}
									/>
								</div>
							</div>

							{/* Tool Description */}
							<div className={s.toolDescriptionSection}>
								<div className={s.sectionHeader}>
									<RobotIcon className={s.sectionIcon} />
									<span>How tool is described to agent</span>
								</div>
								<textarea
									className={s.descriptionTextarea}
									placeholder="Describe how this tool should be presented to the agent..."
									value={info.selectedTool?.typeDependencies?.description || ''}
									readOnly
								/>
							</div>

							{/* Tool Input Variables */}
							<div className={s.toolInputSection}>
								<div className={s.sectionHeader}>
									<DocumentIcon className={s.sectionIcon} />
									<span>Tool Input</span>
								</div>
								<div className={s.variablesContainer}>
									{Array.isArray(info.toolVariables) &&
										info.toolVariables.map((variable, idx) => (
											<div key={variable.name} className={s.variableCard}>
												<div className={s.variableHeader}>
													<span className={s.variableName}>
														{variable.title || variable.name}
													</span>
													<div className={s.dropdownContainer}>
														<button
															className={s.variableConfigButton}
															onClick={(e) => {
																e.stopPropagation();
																toggleDropdown(variable.name);
															}}
														>
															{info.variableSelections[
																variable.name
															] === 'manual' ? (
																<>
																	<SettingsIcon />
																	Set manually
																</>
															) : info.variableSelections[
																	variable.name
															  ] === 'ai' ? (
																<>
																	<StarIcon />
																	Let the AI decide
																</>
															) : (
																<>
																	<SettingsIcon />
																	Set manually
																</>
															)}
															<ChevronDownIcon
																className={`${s.chevronIcon} ${
																	info.openDropdowns[
																		variable.name
																	]
																		? s.rotated
																		: ''
																}`}
															/>
														</button>
														{info.openDropdowns[variable.name] && (
															<div className={s.dropdownMenu}>
																<div
																	className={`${s.dropdownItem} ${
																		info.variableSelections[
																			variable.name
																		] === 'manual'
																			? s.selected
																			: ''
																	}`}
																	onClick={() =>
																		handleOptionSelect(
																			variable.name,
																			'manual',
																		)
																	}
																>
																	<SettingsIcon />
																	Set manually
																</div>
																<div
																	className={`${s.dropdownItem} ${
																		info.variableSelections[
																			variable.name
																		] === 'ai'
																			? s.selected
																			: ''
																	}`}
																	onClick={() =>
																		handleOptionSelect(
																			variable.name,
																			'ai',
																		)
																	}
																>
																	<StarIcon />
																	Let the AI decide
																</div>
															</div>
														)}
													</div>
												</div>
												<p className={s.variableDescription}>
													{variable.description}
													{variable.examples &&
														variable.examples.length > 0 && (
															<span className={s.variableExamples}>
																{' '}
																Examples:{' '}
																{variable.examples.join(', ')}
															</span>
														)}
												</p>
												<input
													ref={idx === 0 ? firstInputRef : null}
													className={s.variableInput}
													value={variable.value || ''}
													onChange={(e) =>
														handleVariableChange(idx, e.target.value)
													}
													placeholder={`Enter ${
														variable.title || variable.name
													}...`}
												/>
											</div>
										))}
								</div>
							</div>

							{/* Update Button */}
							<div className={s.updateButtonContainer}>
								<button
									className={s.updateButton}
									onClick={handleUpdateToolVariables}
								>
									Update Variables
								</button>
							</div>
						</div>
					) : (
						<div className={s.noToolSelected}>
							<p>Select a tool from the left panel to configure it</p>
						</div>
					)}
				</div>
			</div>
			<ActionsModal
				isOpen={info?.actionModalOpen}
				onClose={closeActionModal}
				assistantId={agentId}
				aiActionList={info?.aiActionList}
				onActionAdded={handleActionAdded}
				onActionUpdated={handleActionUpdated}
				selectedAction={info?.selectedAction}
			/>
			<EditAgentTool
				isOpen={info?.editAgentToolOpen}
				onClose={() => setInfo((prev) => ({ ...prev, editAgentToolOpen: false }))}
			/>
			<AddToolV2Modal
				isOpen={info?.addToolModalOpen}
				onClose={() => setInfo((prev) => ({ ...prev, addToolModalOpen: false }))}
				onToolAdded={refreshToolList}
			/>
			<EditToolVariablesModal
				isOpen={info.editToolModalOpen}
				onClose={() =>
					setInfo((prev) => ({
						...prev,
						editToolModalOpen: false,
						editToolModalTool: null,
					}))
				}
				tool={info.editToolModalTool}
				onUpdate={(values) => console.log('EditToolVariablesModal updated values:', values)}
			/>

			{/* Delete Tool Modal */}
			<DeleteModal
				isOpen={info?.deleteModal?.open}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="Delete Tool?"
				itemType="tool"
				description="Are you sure you want to delete this tool?"
				warning="This tool will be permanently removed and cannot be recovered."
			/>
		</div>
	);
};

export default memo(ToolsTab);
