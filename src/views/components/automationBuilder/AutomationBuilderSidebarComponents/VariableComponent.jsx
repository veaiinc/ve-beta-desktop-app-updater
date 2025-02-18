import React, { useEffect, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/variableComponent.scss';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/workspaceSettings/cross.svg';
import { Tooltip } from 'antd';

const VariableComponent = ({ value, onChange, variables }) => {
	const [info, setInfo] = useState({
		open: false,
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
			setInfo((prev) => ({ ...prev, variables: variables }));
		}
	}, [variables]);

	useEffect(() => {
		if (value && variables) {
			const variableRegex = /^\{\{.*\}\}$/;
			setInfo((prev) => ({
				...prev,
				selectedVariable: variableRegex.test(value)
					? variables?.variables?.find(
							(variable) => variable?.name === value.slice(2, -2),
					  )
					: null,
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return (
		<div className="variableComponentContainer">
			<div className="inputContainer">
				{info?.selectedVariable ? (
					<p className="selectedVariable">
						{`{ ${info?.variables?.actionType} > ${info?.selectedVariable?.name} }`}
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
				) : (
					<input
						type="text"
						placeholder="Variable Name"
						value={value}
						onChange={(e) => onChange(e.target.value)}
					/>
				)}
			</div>
			<Tooltip
				open={info?.open}
				onOpenChange={(open) => {
					if (!open) {
						handleInfo({
							open: false,
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
						<div className="variableTooltipBody">
							{info?.variables?.variables?.map((variable, idx) => (
								<div
									className="variableListItem"
									key={idx}
									onClick={() => {
										handleInfo({ selectedVariable: variable });
										onChange(`{{${variable?.name}}}`);
									}}
								>
									<span className="variableListItemTitle">{variable?.name}</span>
								</div>
							))}
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
							open: !info?.open,
						});
					}}
				>
					Insert variable
				</button>
			</Tooltip>
		</div>
	);
};

export default VariableComponent;
