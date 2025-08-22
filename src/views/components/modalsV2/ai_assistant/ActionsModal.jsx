import { memo, useState, useContext, useEffect } from 'react';
import '../../../../assets/scss/ai_assistant/modal/actionsModal.scss';
import ReactModal from '../index';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/tasks/dustBin.svg';
import ActionButton from '../../ai_assistant/ActionButton';
import InputComponent from '../../ai_assistant/InputComponent';
import TextareaComponent from '../../ai_assistant/TextareaComponent';
import { ReactComponent as DownSvg } from '../../../../assets/svg/activity/down.svg';
import { Tooltip } from 'antd';
import { ReactComponent as TrashSvg } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { message } from '../../globalComponents/CustomToast';
import { isURL } from '../../../../helpers';
import Context from '../../../../context/context';

const methodsOptions = ['GET', 'POST', 'PUT', 'DELETE'];
const apiUsesOptions = ['JSON'];
const variableTypes = ['string', 'integer', 'float', 'boolean'];

const tooltipStyles = {
	body: { minWidth: 'fit-content', padding: '0' },
};

const ActionsModal = ({
	isOpen,
	onClose,
	showDelete,
	onDeleteClick,
	isDeletebtnLoading,
	assistantId,
	aiActionList,
	onActionAdded,
	onActionUpdated,
	selectedAction,
}) => {
	const {
		aiSetup: { addAiAction, updateAiAction },
	} = useContext(Context);

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		status: true,
	});

	const [info, setInfo] = useState({
		activeTab: 'endpoint',
		method: 'GET',
		apiUses: 'JSON',
		url: '',
		isMethodDropdownOpen: false,
		isApiUsesDropdownOpen: false,
		variables: [],
		openVariableTypeId: null,
		headers: [
			// {
			// 	id: Date.now(),
			// 	parameter: '',
			// 	value: '',
			// },
		],
		bodyContent: null,
		showVariableSuggestions: false,
		cursorPosition: 0,
		showUrlVariableSuggestions: false,
		urlCursorPosition: 0,
		addingAction: false,
	});

	// Add useEffect to populate form when selectedAction changes
	useEffect(() => {
		if (selectedAction) {
			// Populate form data
			setFormData({
				title: selectedAction?.typeDependencies?.name || '',
				description: selectedAction?.typeDependencies?.description || '',
				status: selectedAction?.status,
			});

			// Populate info state
			setInfo((prev) => ({
				...prev,
				method: selectedAction?.method || 'GET',
				apiUses: selectedAction?.contentType?.toUpperCase() || 'JSON',
				url: selectedAction?.typeDependencies?.url || '',
				variables:
					selectedAction?.api?.variables?.map((v) => ({
						id: Date.now() + Math.random(),
						name: v?.name,
						type: v?.type,
						description: v?.description || '',
					})) || [],
				headers:
					selectedAction?.api?.headers?.length > 0
						? selectedAction?.api?.headers?.map((h) => ({
								id: Date.now() + Math.random(),
								parameter: h?.name,
								value: h?.value,
						  }))
						: [],
				bodyContent: selectedAction?.api?.body
					? typeof selectedAction?.api?.body === 'string'
						? selectedAction?.api?.body
						: JSON.stringify(selectedAction?.api?.body, null, 2)
					: '',
			}));
		} else {
			// Reset form for create mode
			setFormData({
				title: '',
				description: '',
				status: true,
			});
			setInfo((prev) => ({
				...prev,
				method: 'GET',
				apiUses: 'JSON',
				url: '',
				variables: [],
				headers: [],
				// headers: [{ id: Date.now(), parameter: '', value: '' }],
				bodyContent: '',
			}));
		}
	}, [selectedAction]);

	const validateForm = () => {
		const validationErrors = [];

		if (!formData?.title?.trim()) {
			validationErrors.push('Title');
		}

		if (!formData?.description?.trim()) {
			validationErrors.push('Description');
		}

		if (!info?.url?.trim() || !isURL(info?.url?.trim())) {
			validationErrors.push('Valid URL');
		}

		// Validate variables have required fields and proper types
		const invalidVariables = info?.variables?.some((v) => {
			if (!v?.name || !v?.type || !v?.description) return true;
			// Convert type to lowercase for comparison
			const type = v?.type?.toLowerCase();
			return !['string', 'integer', 'float', 'boolean']?.includes(type);
		});

		if (invalidVariables) {
			validationErrors.push('Valid Variables (name, type and description)');
		}

		// Validate headers have required fields
		const invalidHeaders = info?.headers?.some((h) => !h?.parameter || !h?.value);
		if (invalidHeaders) {
			validationErrors.push('Valid Headers (parameter and value)');
		}

		// Validate body content is valid JSON if present

		if (info?.bodyContent?.trim()) {
			try {
				// 1) Replace placeholders that appear after a colon
				let validationContent = info?.bodyContent?.replace(
					/:\s*({{\s*[\w\s.-]+\s*}})/g,
					': "dummy_value"',
				);

				// 2) Replace placeholders that appear inside strings
				validationContent = validationContent?.replace(
					/"[^"]*{{[\w\s.-]+}}[^"]*"/g,
					'"dummy_string"',
				);

				JSON.parse(validationContent);
			} catch (e) {
				validationErrors.push('Valid JSON Body');
			}
		}

		// If there are any validation errors, show them all at once
		if (validationErrors.length > 0) {
			message.error(`${validationErrors.join(', ')} are required`);
			return false;
		}

		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;
		if (!assistantId) {
			message.error('Assistant ID is required');
			return;
		}

		try {
			setInfo((prev) => ({ ...prev, addingAction: true }));
			// Parse body content
			let parsedBody = {};
			try {
				parsedBody = info?.bodyContent ? info?.bodyContent : null;
			} catch (e) {
				// If parsing fails, use the content as is (it might be a string)
				parsedBody = info?.bodyContent || null;
			}

			// Prepare variables with proper type conversion
			const preparedVariables = info?.variables?.map((variable) => {
				const type = variable?.type?.toLowerCase();
				return {
					name: variable?.name,
					type: type === 'text' ? 'string' : type,
					description: variable?.description || `Variable for ${variable?.name}`,
				};
			});

			// Filter out empty headers
			const validHeaders = info?.headers?.filter(
				(header) => header?.parameter?.trim() && header?.value?.trim(),
			);

			const payload = {
				name: formData?.title?.trim(),
				type: selectedAction?.type,
				description: formData?.description?.trim(),
				status: formData?.status,
				url: info?.url?.trim(),
				method: info?.method?.toUpperCase(),
				contentType: info?.apiUses?.toLowerCase(),
				body: parsedBody || null,
				headers: validHeaders?.map((header) => ({
					name: header?.parameter?.trim(),
					value: header?.value?.trim(),
				})),
				variables: preparedVariables,
			};

			let response;
			if (selectedAction) {
				// Update existing action
				response = await updateAiAction(assistantId, selectedAction._id, payload);
				if (response) {
					onActionUpdated(response);
					message.success('Action updated successfully');
				}
			} else {
				// Create new action
				if (aiActionList?.length < 5) {
					response = await addAiAction(assistantId, payload);
				} else {
					onClose();
					message.error('You have reached the maximum limit of 5 actions');
				}
				if (response) {
					onActionAdded(response);
					message.success('Action created successfully');
				}
			}

			if (response) {
				onClose();
				// Reset all form and info states to their initial values
				setFormData({
					title: '',
					description: '',
					status: true,
				});
				setInfo({
					activeTab: 'endpoint',
					method: 'GET',
					apiUses: 'JSON',
					url: '',
					isMethodDropdownOpen: false,
					isApiUsesDropdownOpen: false,
					variables: [],
					openVariableTypeId: null,
					headers: [],
					bodyContent: '',
					showVariableSuggestions: false,
					cursorPosition: 0,
					showUrlVariableSuggestions: false,
					urlCursorPosition: 0,
					addingAction: false,
				});
			}
		} catch (error) {
			console.error('Error saving action:', error);
			message.error(
				error?.response?.data?.message || error?.message || 'Failed to save action',
			);
		} finally {
			setInfo((prev) => ({ ...prev, addingAction: false }));
		}
	};

	const onTitleChange = (e) => {
		setFormData((prev) => ({
			...prev,
			title: e.target.value,
		}));
	};

	const onInstructionChange = (e) => {
		setFormData((prev) => ({
			...prev,
			description: e.target.value,
		}));
	};

	const handleTabChange = (tab) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeTab: tab }));
	};

	const updateInfo = (updateValue) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...updateValue }));
	};

	const handleUrlChange = (e) => {
		const content = e.target.value;
		const position = e.target.selectionStart;

		if (content[position - 1] === '@') {
			updateInfo({
				url: content,
				showUrlVariableSuggestions: true,
				urlCursorPosition: position,
			});
		} else {
			updateInfo({
				url: content,
				showUrlVariableSuggestions: false,
			});
		}
	};

	const handleMethodChange = (method) => {
		updateInfo({ method, isMethodDropdownOpen: false });
	};

	const handleApiUsesChange = (apiUses) => {
		updateInfo({ apiUses, isApiUsesDropdownOpen: false });
	};

	const handleMethodDropdownVisibility = (visible) => {
		updateInfo({ isMethodDropdownOpen: visible });
	};

	const handleApiUsesDropdownVisibility = (visible) => {
		updateInfo({ isApiUsesDropdownOpen: visible });
	};

	const handleVariableTypeDropdownVisibility = (id, visible) => {
		updateInfo({ openVariableTypeId: visible ? id : null });
	};

	const handleVariableTypeChange = (id, type) => {
		const updatedVariables = info?.variables?.map((variable) =>
			variable?.id === id ? { ...variable, type } : variable,
		);
		updateInfo({ variables: updatedVariables, openVariableTypeId: null });
	};

	const handleAddVariable = () => {
		const newVariable = {
			id: Date.now(),
			name: '',
			type: 'string',
			description: '',
		};
		updateInfo({ variables: [...info?.variables, newVariable] });
	};

	const handleVariableFieldChange = (id, field, value) => {
		const updatedVariables = info?.variables?.map((variable) =>
			variable?.id === id ? { ...variable, [field]: value } : variable,
		);
		updateInfo({ variables: updatedVariables });
	};

	const handleVariableDelete = (id) => {
		const updatedVariables = info?.variables?.filter((variable) => variable?.id !== id);
		updateInfo({ variables: updatedVariables });
	};

	const handleAddHeader = () => {
		const newHeader = {
			id: Date.now(),
			parameter: '',
			value: '',
		};
		updateInfo({ headers: [...info?.headers, newHeader] });
	};

	const handleHeaderChange = (id, field, value) => {
		const updatedHeaders = info?.headers?.map((header) =>
			header?.id === id ? { ...header, [field]: value } : header,
		);
		updateInfo({ headers: updatedHeaders });
	};

	const handleHeaderDelete = (id) => {
		const updatedHeaders = info?.headers?.filter((header) => header?.id !== id);
		updateInfo({ headers: updatedHeaders });
	};

	const handleBodyContentChange = (e) => {
		const content = e.target.value;
		const position = e.target.selectionStart;

		if (content[position - 1] === '@') {
			updateInfo({
				bodyContent: content,
				showVariableSuggestions: true,
				cursorPosition: position,
			});
		} else {
			updateInfo({
				bodyContent: content,
				showVariableSuggestions: false,
			});
		}
	};

	const insertVariable = (variable) => {
		const content = info.bodyContent;
		const beforeCursor = content.slice(0, info.cursorPosition);
		const afterCursor = content.slice(info.cursorPosition);

		// Remove the @ symbol and add the variable name
		const newContent = beforeCursor.slice(0, -1) + `{{${variable.name}}}` + afterCursor;

		updateInfo({
			bodyContent: newContent,
			showVariableSuggestions: false,
		});
	};

	const insertUrlVariable = (variable) => {
		const content = info.url;
		const beforeCursor = content.slice(0, info.urlCursorPosition);
		const afterCursor = content.slice(info.urlCursorPosition);

		// Remove the @ symbol and add the variable name
		const newContent = beforeCursor.slice(0, -1) + `{{${variable.name}}}` + afterCursor;

		updateInfo({
			url: newContent,
			showUrlVariableSuggestions: false,
		});
	};

	const tabs = {
		endpoint: {
			label: 'Endpoint',
			component: (
				<EndpointTab
					url={info?.url}
					method={info?.method}
					apiUses={info?.apiUses}
					isMethodDropdownOpen={info?.isMethodDropdownOpen}
					isApiUsesDropdownOpen={info?.isApiUsesDropdownOpen}
					onUrlChange={handleUrlChange}
					onMethodChange={handleMethodChange}
					onApiUsesChange={handleApiUsesChange}
					onMethodDropdownVisibility={handleMethodDropdownVisibility}
					onApiUsesDropdownVisibility={handleApiUsesDropdownVisibility}
					showUrlVariableSuggestions={info?.showUrlVariableSuggestions}
					variables={info?.variables}
					onVariableSelect={insertUrlVariable}
				/>
			),
		},
		headers: {
			label: 'Headers',
			component: (
				<HeadersTab
					headers={info?.headers}
					onAddHeader={handleAddHeader}
					onHeaderChange={handleHeaderChange}
					onHeaderDelete={handleHeaderDelete}
				/>
			),
		},
		body: {
			label: 'Body',
			component: (
				<BodyTab
					bodyContent={info.bodyContent}
					onBodyContentChange={handleBodyContentChange}
					showVariableSuggestions={info.showVariableSuggestions}
					variables={info.variables}
					onVariableSelect={insertVariable}
				/>
			),
		},
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="actions-modal">
				<div className="actions-modal-header">
					<h2>{selectedAction ? 'Edit Action' : 'Add Action'}</h2>
					<CloseSvg onClick={onClose} />
				</div>
				<div className="actions-modal-inputs">
					<InputComponent
						placeholder="Title"
						value={formData?.title}
						onChange={onTitleChange}
					/>

					<TextareaComponent
						placeholder="Add Instructions"
						value={formData?.description}
						onChange={onInstructionChange}
					/>
				</div>
				<div className="addVariablesContainer">
					<div className="header">
						<h2>Extract details from the conversation.</h2>
						<p>
							List any info your AI Agent needs to find in the conversation for this
							Action's API call.
						</p>
					</div>

					<div className="variablesContent">
						{info?.variables?.map((variable) => (
							<>
								<div key={variable?.id} className="variableRow">
									<input
										type="text"
										className="variableInput"
										placeholder="Input"
										value={variable?.name}
										onChange={(e) =>
											handleVariableFieldChange(
												variable?.id,
												'name',
												e.target.value,
											)
										}
									/>
									<div className="variableType">
										<Tooltip
											open={info?.openVariableTypeId === variable?.id}
											onOpenChange={(visible) =>
												handleVariableTypeDropdownVisibility(
													variable?.id,
													visible,
												)
											}
											placement="bottomLeft"
											title={
												<div className="actions-dropdown">
													{variableTypes?.map((type) => (
														<div
															key={type}
															className="actions-dropdown-item"
															onClick={() =>
																handleVariableTypeChange(
																	variable?.id,
																	type,
																)
															}
														>
															{type}
														</div>
													))}
												</div>
											}
											arrow={false}
											trigger={'click'}
											color={'transparent'}
											styles={tooltipStyles}
										>
											<div className="method-dropdown">
												{variable?.type}
												<DownSvg
													className={`${
														info?.openVariableTypeId === variable?.id
															? 'open'
															: ''
													}`}
												/>
											</div>
										</Tooltip>
									</div>
									<div
										className="deleteVariable"
										onClick={() => handleVariableDelete(variable?.id)}
									>
										<TrashSvg className="trash" />
									</div>
								</div>
								<div className="variableRow">
									<input
										type="text"
										className="variableInput"
										placeholder="Description"
										value={variable?.description}
										onChange={(e) =>
											handleVariableFieldChange(
												variable?.id,
												'description',
												e.target.value,
											)
										}
									/>
								</div>
							</>
						))}

						{info?.variables?.length === 0 && (
							<div className="emptyState">
								<p>No inputs added</p>
								<p>Add inputs to extract from chat</p>
							</div>
						)}

						<div className="addVariableButton" onClick={handleAddVariable}>
							<PlusSvg />
							Add
						</div>
					</div>
				</div>

				<div className="actions-modal-description">
					<h2>Connect to API</h2>
					<p>Build the API call for Action, including inputs from chats, variable.</p>
				</div>

				<div className="actionsTabContainer">
					<div className="actionTabs">
						{Object.keys(tabs)?.map((tab) => (
							<div
								key={tab}
								className={`actionTab ${info?.activeTab === tab ? 'active' : ''}`}
								onClick={() => handleTabChange(tab)}
							>
								{tabs?.[tab]?.label}
							</div>
						))}
					</div>
				</div>

				{tabs?.[info?.activeTab]?.component}

				<div className="actions-modal-footer">
					<div>
						{showDelete && (
							<div
								onClick={onDeleteClick}
								className="actions-modal-footer-delete-button"
								disabled={isDeletebtnLoading}
							>
								<DeleteSvg />
							</div>
						)}
					</div>
					<ActionButton onClick={handleSubmit} disabled={info.addingAction}>
						{info?.addingAction
							? selectedAction
								? 'Updating...'
								: 'Creating...'
							: selectedAction
							? 'Update action'
							: 'Add and make active'}
					</ActionButton>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ActionsModal);

const EndpointTab = ({
	url,
	method,
	apiUses,
	isMethodDropdownOpen,
	isApiUsesDropdownOpen,
	onUrlChange,
	onMethodChange,
	onApiUsesChange,
	onMethodDropdownVisibility,
	onApiUsesDropdownVisibility,
	showUrlVariableSuggestions,
	variables,
	onVariableSelect,
}) => {
	return (
		<div className="endpointTabContainer">
			<div className="addUrlContainer">
				<input
					type="text"
					className="url"
					placeholder="Add URL"
					value={url}
					onChange={onUrlChange}
				/>
				{showUrlVariableSuggestions && variables?.length > 0 && (
					<div className="variableSuggestions">
						{variables?.map((variable) => (
							<div
								key={variable?.id}
								className="variableSuggestion"
								onClick={() => onVariableSelect(variable)}
							>
								{variable?.name}
							</div>
						))}
					</div>
				)}
				<div className="urlMethodCotainer">
					<div className="method">
						<div className="method-label">Method</div>
						<Tooltip
							open={isMethodDropdownOpen}
							onOpenChange={onMethodDropdownVisibility}
							placement="bottom"
							title={
								<div className="actions-dropdown">
									{methodsOptions?.map((option) => (
										<div
											key={option}
											className="actions-dropdown-item"
											onClick={() => onMethodChange(option)}
										>
											{option}
										</div>
									))}
								</div>
							}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							styles={tooltipStyles}
						>
							<div className="method-dropdown">
								{method}
								<DownSvg className={`${isMethodDropdownOpen ? 'open' : ''}`} />
							</div>
						</Tooltip>
					</div>
					<div className="method">
						<div className="method-label">API body Type</div>
						<Tooltip
							open={isApiUsesDropdownOpen}
							onOpenChange={onApiUsesDropdownVisibility}
							placement="bottom"
							title={
								<div className="actions-dropdown">
									{apiUsesOptions?.map((option) => (
										<div
											key={option}
											className="actions-dropdown-item"
											onClick={() => onApiUsesChange(option)}
										>
											{option}
										</div>
									))}
								</div>
							}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							styles={tooltipStyles}
						>
							<div className="method-dropdown">
								{apiUses}
								<DownSvg className={`${isApiUsesDropdownOpen ? 'open' : ''}`} />
							</div>
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	);
};

const HeadersTab = ({ headers, onAddHeader, onHeaderChange, onHeaderDelete }) => {
	return (
		<div className="headersTabContainer">
			<div className="headerLabels">
				<div>Parameter</div>
				<div>Value</div>
				<div />
			</div>
			<div className="headersContent">
				{headers?.map((header) => (
					<div key={header?.id} className="headerRow">
						<div className="headerInputs">
							<input
								type="text"
								placeholder="Authorization"
								className="headerInput"
								value={header?.parameter}
								onChange={(e) =>
									onHeaderChange(header?.id, 'parameter', e.target.value)
								}
							/>
							<input
								type="text"
								placeholder="Token"
								className="headerInput"
								value={header?.value}
								onChange={(e) =>
									onHeaderChange(header?.id, 'value', e.target.value)
								}
							/>
						</div>
						<div className="deleteHeader" onClick={() => onHeaderDelete(header?.id)}>
							<TrashSvg className="trash" />
						</div>
					</div>
				))}
				{headers?.length === 0 && (
					<div className="emptyState">
						<p>No headers added</p>
						<p>Add headers to the API call</p>
					</div>
				)}
			</div>
			<div className="addHeaderButton" onClick={onAddHeader}>
				+ Add
			</div>
		</div>
	);
};

const BodyTab = ({
	bodyContent,
	onBodyContentChange,
	showVariableSuggestions,
	variables,
	onVariableSelect,
}) => {
	return (
		<div className="bodyTabContainer">
			<div>Content</div>
			<textarea
				className="bodyInput"
				value={bodyContent}
				onChange={onBodyContentChange}
				placeholder="Enter request body content..."
			></textarea>
			<div className="bodyInputHelperText">Type @ to insert an input or variable</div>

			{showVariableSuggestions && variables?.length > 0 && (
				<div className="variableSuggestions">
					{variables?.map((variable) => (
						<div
							key={variable?.id}
							className="variableSuggestion"
							onClick={() => onVariableSelect(variable)}
						>
							{variable?.name}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
