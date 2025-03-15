import React, { useCallback, useEffect, useState, memo } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/variableComponent.scss';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { Dropdown, Tooltip } from 'antd';

const labelMapper = {
	messageReceived: 'Message received',
	deleteDraft: 'Delete draft',
	createTask: 'Create task',
	createFile: 'Create document',
	condition: 'Condition',
	'create-formResponse': 'Form response',
};

const appMapper = {
	slack: 'Slack',
	gmail: 'Gmail',
	inApp: 'In App',
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
	});

	const handleInfo = (updateInfo) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			...updateInfo,
		}));
	};

	useEffect(() => {
		if (variables) {
			setInfo((prev) => ({ ...prev, variables: variables?.variables }));
		}
	}, [variables]);

	useEffect(() => {
		if (value) {
			const variableRegex = /^\{\{.*\}\}$/;
			if (variableRegex?.test(value)) {
				handleInfo({ value: value?.slice(2, -2) });
			}
		}
	}, []);

	const decodeHtmlEntities = (htmlText) => {
		const textArea = document.createElement('textarea');
		textArea.innerHTML = htmlText?.replace(/<\/?[^>]+(>|$)/g, '').trim();
		return textArea?.value?.trim();
	};

	const parseFormVariables = useCallback((variables) => {
		return {
			actionType: 'formResponse',
			variables: Array.isArray(variables)
				? variables.map((variable) => ({
						name: decodeHtmlEntities(variable?.question),
						_id: variable?._id,
				  }))
				: [], // Ensure it's always an array
		};
	}, []);

	const onOptionClick = useCallback(
		(option) => {
			if (option?.type === 'Object') {
				const newOptions = [...(info?.options || []), option?.values];

				const newVariablePath = [...(info?.variablePath || []), option?.name];

				handleInfo({
					options: newOptions,
					variablePath: newVariablePath,
					// variableDropdownOpen: true,
				});
			} else {
				const value = info?.variablePath?.join('.') + '.' + option?.name;
				const parsedValue = value?.split('.');

				parsedValue[0] = labelMapper[info?.selectedStep?.labelId];
				handleInfo({
					variableDropdownOpen: false,
					value: parsedValue?.join('.'),
				});

				onChange(`{{${value}}}`);
			}
		},
		[info?.options, info?.variablePath],
	);

	return (
		<div className="variableComponentContainer">
			<div className="inputContainer">
				{info?.value ? (
					<p className="selectedVariable">
						{`{ ${info?.value}}`}

						<CrossIcon
							width={14}
							height={14}
							style={{ cursor: 'pointer' }}
							onClick={() => {
								handleInfo({ value: '' });
								onChange('');
							}}
						/>
					</p>
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
					<input
						type={type}
						placeholder="Enter something or select a variable"
						value={value}
						onChange={(e) => onChange(e.target.value)}
					/>
				)}
			</div>
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
									  info?.selectedStep?.labelId ||
									  'Step id'
									: info?.variablePath?.at(-1)}
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
													{option?.name}
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
												},
											});
										}}
									>
										<span className="variableListItemTitle">
											{(labelMapper[step?.stepName] || step?.stepName) +
												` (${appMapper[step?.stepApp || 'inApp']})`}
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
		</div>
	);
};

export default memo(VariableComponent);
