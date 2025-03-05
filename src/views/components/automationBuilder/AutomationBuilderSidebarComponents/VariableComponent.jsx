import React, { useCallback, useEffect, useState, memo } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/variableComponent.scss';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import { Dropdown, Tooltip } from 'antd';

const VariableComponent = ({ value, onChange, variables, type = 'text', options = [] }) => {
	const [info, setInfo] = useState({
		variableDropdownOpen: false,
		optionDropdownOpen: false,
		variables: null,
		selectedVariable: null,
	});

	const handleInfo = (updateInfo) => {
		setInfo({
			...info,
			...updateInfo,
		});
	};

	useEffect(() => {
		if (variables) {
			if (variables?.actionType === 'formResponse') {
				setInfo((prev) => ({
					...prev,
					variables: parseFormVariables(variables?.variables),
				}));
			} else {
				setInfo((prev) => ({ ...prev, variables: variables }));
			}
		}
	}, [variables]);

	useEffect(() => {
		if (value && variables) {
			const variableRegex = /^\{\{.*\}\}$/;
			if (variableRegex.test(value)) {
				if (variables?.actionType === 'formResponse') {
					const selectedVariable = variables?.variables?.find(
						(variable) => variable?._id === value.slice(2, -2)?.replace('.answer', ''),
					);

					setInfo((prev) => ({
						...prev,
						selectedVariable: {
							...selectedVariable,
							name: decodeHtmlEntities(selectedVariable?.question),
						},
					}));
				} else {
					setInfo((prev) => ({
						...prev,
						selectedVariable: variables?.variables?.find(
							(variable) => variable?.name === value.slice(2, -2),
						),
					}));
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	return (
		<div className="variableComponentContainer">
			<div className="inputContainer">
				{info?.selectedVariable ? (
					<p className="selectedVariable">
						{`{ ${info?.variables?.actionType} > ${info?.selectedVariable?.name}${
							info?.variables?.actionType === 'formResponse' ? `.answer` : ''
						} }`}
						<CrossIcon
							width={14}
							height={14}
							style={{ cursor: 'pointer' }}
							onClick={() => {
								handleInfo({ selectedVariable: null });
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
									{/* <ChevronRightThinSvg style={{ rotate: '180deg' }} /> */}
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
						<div className="variableTooltipHeader">
							{/* <ChevronRightThinSvg style={{ rotate: '180deg' }} /> */}
							<span className="variableTooltipHeaderTitle">
								{info?.variables?.actionType}
							</span>
						</div>
						{info?.variables?.variables?.length > 0 ? (
							<div className="variableTooltipBody">
								{info?.variables?.variables?.map((variable, idx) => (
									<div
										className="variableListItem"
										key={idx}
										onClick={() => {
											handleInfo({ selectedVariable: variable, open: false });
											onChange(
												`{{${
													info?.variables?.actionType === 'formResponse'
														? `${variable?._id}.answer`
														: variable?.name
												}}}`,
											);
										}}
									>
										<span className="variableListItemTitle">
											{variable?.name}
										</span>
									</div>
								))}
							</div>
						) : (
							<span className="variableTooltipBody" style={{ color: '#808080' }}>
								No variables found for this action type
							</span>
						)}
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
