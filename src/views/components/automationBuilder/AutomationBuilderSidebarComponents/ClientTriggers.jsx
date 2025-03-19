import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/clientTriggers.scss';
import { Tooltip } from 'antd';

const clientFields = [
	{
		label: 'Name',
		value: 'name',
	},
	{
		label: 'Email',
		value: 'email',
	},
	{
		label: 'Phone',
		value: 'phone',
	},
	{
		label: 'Source',
		value: 'source',
	},
];

const ClientTriggers = ({ onClose, onSave, addTriggerLoading, triggerData, activeStepsData }) => {
	const [info, setInfo] = useState({
		title: '',
		description: '',
		type: 'trigger',
		app: 'inApp',
		triggerType: 'database',
	});

	const updateStateInfo = useCallback((updatedInfo) => {
		setInfo((prev) => ({ ...prev, ...updatedInfo }));
	}, []);

	useEffect(() => {
		if (activeStepsData) {
			setInfo((prev) => ({
				...prev,
				title: activeStepsData?.title,
				description: activeStepsData?.description,
			}));
		}
	}, [activeStepsData]);

	const eventMapper = useMemo(() => {
		return {
			create: (
				<CreateClientTrigger
					onSave={onSave}
					info={info}
					addTriggerLoading={addTriggerLoading}
					activeStepsData={activeStepsData}
				/>
			),
			update: (
				<UpdateClientTrigger
					onSave={onSave}
					info={info}
					addTriggerLoading={addTriggerLoading}
					activeStepsData={activeStepsData}
				/>
			),
			delete: (
				<DeleteClientTrigger
					onSave={onSave}
					info={info}
					addTriggerLoading={addTriggerLoading}
					activeStepsData={activeStepsData}
				/>
			),
		};
	}, [onSave, info, addTriggerLoading, activeStepsData]);

	return (
		<div className="clientTriggerContainer">
			<HeaderComponent onBack={onClose} heading={`Client ${triggerData?.event}d`} />
			<ActionDetailsBlock
				type="trigger"
				actionLabel={`Client ${triggerData?.event}d`}
				heading={'Trigger'}
				description={info?.description}
				title={info?.title}
				updaterFn={(updatedData) => {
					updateStateInfo(updatedData);
				}}
				onChangeButtonClick={onClose}
			/>
			<div className="clientTriggerContent">{eventMapper?.[triggerData?.event]}</div>
		</div>
	);
};

export default memo(ClientTriggers);

const CreateClientTrigger = memo(({ onSave, info, addTriggerLoading }) => {
	return (
		<>
			<div className="clientTriggerInputContainer"> </div>
			<button
				className="clientTriggerContentButton"
				disabled={addTriggerLoading}
				onClick={() =>
					onSave({
						...info,
						inApp: { module: 'client', event: 'create' },
					})
				}
			>
				{addTriggerLoading ? 'Saving...' : 'Save Trigger'}
			</button>
		</>
	);
});

const UpdateClientTrigger = memo(({ onSave, info, addTriggerLoading, activeStepsData }) => {
	const [updateInfo, setUpdateInfo] = useState({
		selectedFields: [],
		isOpen: false,
	});

	useEffect(() => {
		if (activeStepsData) {
			setUpdateInfo((prev) => ({
				...prev,
				selectedFields: activeStepsData?.fields?.map((field) => {
					const fieldObj = clientFields?.find((f) => f?.value === field);
					return fieldObj;
				}),
			}));
		}
	}, [activeStepsData]);

	const handleFieldSelection = (field) => {
		if (updateInfo.selectedFields.some((f) => f?.value === field?.value)) {
			setUpdateInfo((prev) => ({
				...prev,
				selectedFields: prev.selectedFields.filter((f) => f?.value !== field?.value),
			}));
		} else {
			setUpdateInfo((prev) => ({
				...prev,
				selectedFields: [...prev.selectedFields, field],
			}));
		}
	};

	const handleOpenTooltip = (value) => {
		setUpdateInfo((prev) => ({
			...prev,
			isOpen: value,
		}));
	};

	const handleRemoveField = (fieldValue) => {
		setUpdateInfo((prev) => ({
			...prev,
			selectedFields: prev.selectedFields.filter((field) => field?.value !== fieldValue),
		}));
	};

	return (
		<>
			<div className="clientTriggerInputContainer">
				<h3 className="clientTriggerInputHeading">Inputs</h3>
				<div className="clientTriggerInputItem">
					<span className="clientTriggerInputLabel">Select fields</span>
					<Tooltip
						placement="bottomLeft"
						arrow={false}
						color="transparent"
						trigger="click"
						onOpenChange={(visible) => {
							if (!visible) {
								handleOpenTooltip(false);
							}
						}}
						title={
							<div className="clientTriggerInputTooltip">
								{clientFields?.map((field) => (
									<span
										key={field?.value}
										className={`clientTriggerInputTooltipItem ${
											updateInfo?.selectedFields?.some(
												(f) => f?.value === field?.value,
											)
												? 'clientTriggerInputTooltipItemSelected'
												: ''
										}`}
										onClick={() => handleFieldSelection(field)}
									>
										{field?.label}
									</span>
								))}
							</div>
						}
					>
						<div
							className="clientTriggerInputTooltipTrigger"
							onClick={() => handleOpenTooltip(true)}
						>
							{updateInfo?.selectedFields?.length > 0 ? (
								updateInfo?.selectedFields?.map((field) => (
									<div
										key={field?.value}
										className="clientTriggerInputTooltipTriggerItem"
									>
										{field?.label}
										<span
											className="removeField"
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveField(field?.value);
											}}
										>
											×
										</span>
									</div>
								))
							) : (
								<div className="clientTriggerInputTooltipTriggerPlaceholder">
									Select fields
								</div>
							)}
						</div>
					</Tooltip>
				</div>
			</div>
			<button
				className="clientTriggerContentButton"
				disabled={addTriggerLoading}
				onClick={() =>
					onSave({
						...info,
						inApp: {
							module: 'client',
							event: 'update',
							fields: updateInfo.selectedFields?.map((field) => field.value),
						},
					})
				}
			>
				{addTriggerLoading ? 'Saving...' : 'Save Trigger'}
			</button>
		</>
	);
});

const DeleteClientTrigger = memo(({ onSave, info, addTriggerLoading }) => {
	return (
		<>
			<div className="clientTriggerInputContainer"> </div>
			<button
				className="clientTriggerContentButton"
				disabled={addTriggerLoading}
				onClick={() =>
					onSave({
						...info,
						inApp: { module: 'client', event: 'delete' },
					})
				}
			>
				{addTriggerLoading ? 'Saving...' : 'Save Trigger'}
			</button>
		</>
	);
});
