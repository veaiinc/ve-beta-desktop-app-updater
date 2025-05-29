import React, { useCallback, useEffect, useState, memo } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/variableComponent.scss';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { Tooltip } from 'antd';

const labelMapper = {
	messageReceived: 'Message received',
	'create-formResponse': 'Form response',

	'create-task': 'Create task',
	'update-task': 'Update task',
	'delete-task': 'Delete task',
	'create-client': 'Create client',
	'update-client': 'Update client',
	'delete-client': 'Delete client',
	'create-createFile': 'Create document',
	'delete-createFile': 'Delete document',

	sendMessage: 'Send Message',
	sendReply: 'Send Reply',
	getLabelInfo: 'Get Label Info',
	createLabel: 'Create Label',
	createDraft: 'Create Draft',
	deleteDraft: 'Delete Draft',
	getDraft: 'Get Draft',
	createTask: 'Create Task',
	createFile: 'Create Document',
	joinChannel: 'Join Channel',
	leaveChannel: 'Leave Channel',
	renameChannel: 'Rename Channel',
	channelMembers: 'Channel Members',
	getChannelInfo: 'Get Channel Info',
	getManyChannels: 'Get Many Channels',
	createChannel: 'Create Channel',
	replyMessage: 'Reply to message',
	condition: 'If / Else',
	switch: 'Switch',
};

const appMapper = {
	slack: 'Slack',
	gmail: 'Gmail',
	inApp: 'In App',
};

const variableRegex = /\{\{.*?\}\}/g;

const removeHTMLTags = (text) => {
	const decodeHTML = (html) => {
		const txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	};
	return decodeHTML(
		text
			?.replace(/<\/?[^>]+(>|$)/g, '')
			?.replace(/ /g, ' ')
			?.trim() || '',
	);
};

const VariableComponent = ({
	value,
	onChange,
	variables,
	type = 'text',
	options = [],
	editMode,
}) => {
	const [info, setInfo] = useState({
		variableDropdownOpen: false,
		optionDropdownOpen: false,
		variables: null,
		selectedVariable: null,
		value: '',
		options: [],
		variablePath: [],
		selectedStep: null,
		error: '',
		loading: false,
		multipleVariables: [],
		inputText: [{ type: 'text', value: '' }],
	});

	const handleInfo = (updateInfo) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			...updateInfo,
		}));
	};

	useEffect(() => {
		if (type === 'dropdown' && options) {
			handleInfo({
				options: options,
				loading: false,
			});
		}
	}, [type, options]);

	useEffect(() => {
		if (variables) {
			if (value && type !== 'dropdown') {
				parseValue(value);
			} else {
				handleInfo({
					inputText: [{ type: 'text', value: '' }],
				});
			}

			setInfo((prev) => ({
				...prev,
				variables: variables?.variables,
				loading: false,
			}));
		}
	}, [variables, value, type]);

	const parseValue = useCallback(
		(value) => {
			if (!value || typeof value !== 'string') {
				handleInfo({
					error: 'Invalid value type',
					inputText: [{ type: 'text', value: '' }],
				});
				return;
			}

			const matches = value.match(variableRegex);
			if (matches) {
				const parsedVariables = matches
					.map((match) => {
						const newValueArray = match?.slice(2, -2)?.split('.');
						let selectedStep =
							variables?.variables?.find(
								(step) => step?.stepId === newValueArray[0],
							) || null;

						if (selectedStep) {
							newValueArray[0] = labelMapper[selectedStep?.stepName];

							if (newValueArray[2] === 'answer') {
								newValueArray[1] = selectedStep?.variables?.find(
									(variable) => variable?._id === newValueArray[1],
								)?.name;
							}

							return {
								value: newValueArray?.join('.'),
								raw: match,
								selectedStep: {
									stepId: selectedStep?.stepId,
									app: selectedStep?.stepApp,
									labelId: selectedStep?.stepName,
									isFormResponse: selectedStep?.isFormResponse,
								},
							};
						}
						return null;
					})
					.filter(Boolean);

				// Extract text between variables
				const textParts = value.split(variableRegex);
				const combinedParts = [];
				for (let i = 0; i < textParts.length; i++) {
					if (textParts[i]) {
						combinedParts.push({ type: 'text', value: textParts[i] });
					}
					if (parsedVariables[i]) {
						combinedParts.push({ type: 'variable', value: parsedVariables[i] });
					}
				}

				// Ensure we always have at least one text part
				if (combinedParts.length === 0) {
					combinedParts.push({ type: 'text', value: '' });
				}

				handleInfo({
					multipleVariables: parsedVariables,
					value: parsedVariables.map((v) => v.value).join(', '),
					error: '',
					inputText: combinedParts,
				});
			} else {
				handleInfo({
					multipleVariables: [],
					value: value,
					error: '',
					inputText: [{ type: 'text', value: value || '' }],
				});
			}
		},
		[variables?.variables],
	);

	const onOptionClick = useCallback(
		(option) => {
			if (option?.type === 'Object') {
				const newOptions = [...(info?.options || []), option?.values];
				const newVariablePath = [...(info?.variablePath || []), option?.name];

				handleInfo({
					options: newOptions,
					variablePath: newVariablePath,
				});
			} else {
				const value =
					info?.variablePath?.join('.') +
					`.${
						info?.selectedStep?.isFormResponse ? `${option?._id}.answer` : option?.name
					}`;
				const parsedValue = value?.split('.');

				parsedValue[0] = labelMapper[info?.selectedStep?.labelId];
				if (info?.selectedStep?.isFormResponse) {
					parsedValue[1] = `${option?.name}`;
				}

				const newVariable = `{{${value}}}`;
				const currentValue = info?.multipleVariables?.map((v) => v.raw).join('') || '';
				const newValue = currentValue + newVariable;

				handleInfo({
					variableDropdownOpen: false,
					value: parsedValue?.join('.'),
					error: '',
				});

				onChange(newValue);
			}
		},
		[info?.options, info?.variablePath, info?.selectedStep, info?.multipleVariables],
	);

	const handleDeleteVariable = useCallback(
		(index) => {
			const newInputText = [...(info.inputText || [])];
			newInputText.splice(index, 1);

			// Ensure we always have at least one text part
			if (newInputText.length === 0) {
				newInputText.push({ type: 'text', value: '' });
			}

			// Reconstruct the value without the deleted variable
			const newValue = newInputText
				.map((part) => (part.type === 'variable' ? part.value.raw : part.value))
				.join('');

			handleInfo({
				inputText: newInputText,
				error: '',
			});
			onChange(newValue);
		},
		[info.inputText, onChange],
	);

	const handleTextChange = useCallback(
		(e) => {
			const newValue = e.target.value;
			handleInfo({
				inputText: [{ type: 'text', value: newValue }],
				error: '',
			});
			onChange(newValue);
		},
		[onChange],
	);

	return (
		<div className="variableComponentContainer">
			<div className="inputContainer">
				{info?.loading ? (
					<p className="selectedVariable">Loading...</p>
				) : info?.error ? (
					<p className="selectedVariable errorMessage">&#9888; {info?.error}</p>
				) : type === 'dropdown' ? (
					<Tooltip
						placement="bottom"
						arrow={false}
						color="transparent"
						overlayStyle={{
							minWidth: 'fit-content',
						}}
						open={info?.optionDropdownOpen}
						onOpenChange={(open) => {
							if (!open) {
								handleInfo({ optionDropdownOpen: false });
							}
						}}
						title={
							<div className="variableTooltipContainer">
								<div className="variableTooltipHeader">
									<ChevronRightThinSvg style={{ rotate: '180deg' }} />
									<span className="variableTooltipHeaderTitle">
										Select an option
									</span>
								</div>
								{options?.length > 0 ? (
									<div className="variableTooltipBody">
										{options?.map((option, idx) => (
											<div
												className={`variableListItem ${
													value?.value === option?.value ? 'selected' : ''
												}`}
												key={idx}
												onClick={() => {
													onChange(option);
													handleInfo({ optionDropdownOpen: false });
												}}
											>
												<span className="variableListItemTitle">
													{option?.label}
												</span>
											</div>
										))}
									</div>
								) : (
									<span
										className="variableTooltipBody"
										style={{ color: '#808080' }}
									>
										No options found
									</span>
								)}
							</div>
						}
					>
						<div
							className="inputDropdownContainer"
							onClick={() =>
								handleInfo({ optionDropdownOpen: !info?.optionDropdownOpen })
							}
						>
							{value?.label || 'Select an option'}
						</div>
					</Tooltip>
				) : (
					<div className="variableInputContainer">
						{info?.inputText?.map((part, index) =>
							part.type === 'variable' ? (
								<div key={index} className="variableTag">
									<span>{removeHTMLTags(part.value.value)}</span>
									<CrossIcon
										width={14}
										height={14}
										style={{ cursor: 'pointer', marginLeft: '4px' }}
										onClick={() => handleDeleteVariable(index)}
									/>
								</div>
							) : (
								<input
									key={index}
									type={type}
									placeholder="Enter something or select a variable"
									value={removeHTMLTags(part.value)}
									onChange={handleTextChange}
									className="variableInput"
								/>
							),
						)}
					</div>
				)}
			</div>
			{type !== 'dropdown' && (
				<Tooltip
					open={info?.variableDropdownOpen}
					onOpenChange={(open) => {
						if (!open) {
							handleInfo({
								variableDropdownOpen: false,
							});
						}
					}}
					trigger="click"
					title={
						<div className="variableTooltipContainer">
							<div
								className="variableTooltipHeader"
								onClick={
									info?.options?.length > 0
										? () => {
												handleInfo({
													options: info?.options?.slice(0, -1),
													variablePath: info?.variablePath?.slice(0, -1),
												});
										  }
										: () => {}
								}
							>
								{info?.options?.length > 0 ? (
									<ChevronRightThinSvg style={{ rotate: '180deg' }} />
								) : null}
								<span className="variableTooltipHeaderTitle">
									{info?.variablePath?.length === 0
										? `Choose a step`
										: info?.variablePath?.length === 1
										? labelMapper[info?.selectedStep?.labelId] ||
										  removeHTMLTags(info?.selectedStep?.labelId) ||
										  'Step id'
										: removeHTMLTags(info?.variablePath?.at(-1))}
								</span>
							</div>

							<div className="variableTooltipBody">
								{info?.options?.length > 0 ? (
									<>
										{info?.options?.at(-1)?.length > 0 ? (
											info?.options?.at(-1)?.map((option, idx) => (
												<div
													className="variableListItem"
													key={idx}
													onClick={() => onOptionClick(option)}
												>
													<span className="variableListItemTitle">
														{removeHTMLTags(option?.name)}
													</span>
													{option?.type === 'Object' ? (
														<span className="variableListRightContainer">
															{option?.values?.length}
															<ChevronRightThinSvg />
														</span>
													) : null}
												</div>
											))
										) : (
											<span
												className="variableTooltipBody"
												style={{ color: '#808080' }}
											>
												No variables found for this step
											</span>
										)}
									</>
								) : (
									info?.variables?.map((step) => (
										<div
											key={step?.stepId}
											className="variableListItem"
											onClick={() => {
												onOptionClick({
													values: step?.variables,
													name: step?.stepId,
													type: 'Object',
												});
												handleInfo({
													selectedStep: {
														stepId: step?.stepId,
														app: step?.stepApp,
														labelId: step?.stepName,
														isFormResponse: step?.isFormResponse,
													},
												});
											}}
										>
											<span className="variableListItemTitle">
												{removeHTMLTags(
													(labelMapper[step?.stepName] ||
														step?.stepName) +
														` (${appMapper[step?.stepApp || 'inApp']})`,
												)}
											</span>
										</div>
									))
								)}
							</div>
						</div>
					}
					placement="bottom"
					arrow={false}
					color="transparent"
					overlayStyle={{
						minWidth: 'fit-content',
					}}
				>
					<button
						className="insertVariableButton"
						onClick={() => {
							handleInfo({
								variableDropdownOpen: !info?.variableDropdownOpen,
							});
						}}
					>
						Insert variable
					</button>
				</Tooltip>
			)}
		</div>
	);
};

export default memo(VariableComponent);
