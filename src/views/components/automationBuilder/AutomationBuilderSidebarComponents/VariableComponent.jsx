import React, { useCallback, useEffect, useState } from 'react';
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
			variables: variables?.map((variable) => ({
				name: decodeHtmlEntities(variable?.question),
				_id: variable?._id,
			})),
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
