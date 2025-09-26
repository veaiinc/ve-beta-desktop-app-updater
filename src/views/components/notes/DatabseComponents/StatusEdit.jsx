import { useState, useContext } from 'react';
import { ReactComponent as Dustbin } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';
import Context from '../../../../context/context';
import { colors } from '../../../../helpers/databaseHelpers';
import s from '../../../../assets/scss/notes/databaseComponents/statusEdit.module.scss';

const StatusEdit = ({ field, pageId, databaseId }) => {
	const {
		notes: { updateDatabaseField },
	} = useContext(Context);

	const [info, setInfo] = useState({
		editingStatus: null,
		editedValue: '',
		showColorPicker: null,
		loading: false,
		activeNewStatusGroup: null,
		newStatusValue: '',
	});

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const getRandomColor = () => Math.floor(Math.random() * 7) + 1;

	const handleAddStatus = async (group) => {
		if (!info.newStatusValue?.trim()) return;
		const newStatuses = {
			...field?.config?.status,
			[group]: [
				...field?.config?.status[group],
				{
					label: info.newStatusValue.trim(),
					color: getRandomColor().toString(),
					isDefault: false,
				},
			],
		};

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { status: newStatuses },
			},
		});
		handleInfoChange({
			loading: false,
			newStatusValue: '',
			activeNewStatusGroup: null,
		});
	};

	const handleUpdateStatus = async (group, index, newLabel) => {
		if (!newLabel?.trim()) return;
		const newStatuses = {
			...field?.config?.status,
			[group]: field?.config?.status[group].map((s, i) =>
				i === index ? { ...s, label: newLabel.trim() } : s,
			),
		};

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { status: newStatuses },
			},
		});
		handleInfoChange({ loading: false, editingStatus: null, editedValue: '' });
	};

	const handleDeleteStatus = async (group, index) => {
		const status = field?.config?.status[group][index];
		if (status?.isDefault) return;
		const newStatuses = {
			...field?.config?.status,
			[group]: field?.config?.status[group].filter((_, i) => i !== index),
		};

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { status: newStatuses },
			},
		});
		handleInfoChange({ loading: false });
	};

	const handleColorSelect = async (group, index, colorNumber) => {
		const newStatuses = {
			...field?.config?.status,
			[group]: field?.config?.status[group].map((s, i) =>
				i === index ? { ...s, color: colorNumber.toString() } : s,
			),
		};

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { status: newStatuses },
			},
		});
		handleInfoChange({ loading: false, showColorPicker: null });
	};

	const handleSetDefault = async (group, index) => {
		const newStatuses = {
			todo: field?.config?.status.todo.map((s) => ({ ...s, isDefault: false })),
			inProgress: field?.config?.status.inProgress.map((s) => ({ ...s, isDefault: false })),
			completed: field?.config?.status.completed.map((s) => ({ ...s, isDefault: false })),
		};
		newStatuses[group][index].isDefault = true;

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { status: newStatuses },
			},
		});
		handleInfoChange({ loading: false });
	};

	const colorOptions = Object.entries(colors).map(([number, color]) => ({ number, ...color }));

	const StatusGroup = ({ group, title }) => {
		const isActive = info.activeNewStatusGroup === group;

		return (
			<div className={s.statusGroup}>
				<div className={s.statusGroupHeader}>
					<div className={s.statusGroupTitle}>{title}</div>
					{!isActive ? (
						<button
							onClick={() =>
								handleInfoChange({
									activeNewStatusGroup: group,
									newStatusValue: '',
								})
							}
							className={s.addStatusButton}
						>
							+ Add
						</button>
					) : (
						<div className={s.newStatusInput}>
							<input
								type="text"
								value={info.newStatusValue}
								onChange={(e) =>
									handleInfoChange({ newStatusValue: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleAddStatus(group);
									}
								}}
								placeholder={`New ${title.toLowerCase()} status`}
								autoFocus
							/>
							<button onClick={() => handleAddStatus(group)} disabled={info.loading}>
								Add
							</button>
						</div>
					)}
				</div>

				<div className={s.statusList}>
					{field?.config?.status[group]?.map((status, index) => (
						<div key={status._id} className={s.statusItem}>
							<div className={s.statusItemWrapper}>
								<div className={s.selectListItemTagWrapper}>
									<div className={s.selectOptionItem}>
										<div
											className={s.selectListItemColor}
											style={{ backgroundColor: colors[status.color]?.color }}
											onClick={() =>
												handleInfoChange({
													showColorPicker:
														info.showColorPicker === `${group}-${index}`
															? null
															: `${group}-${index}`,
												})
											}
										/>
										<input
											type="text"
											className={s.selectOptionInput}
											value={
												info.editingStatus === `${group}-${index}`
													? info.editedValue
													: status.label
											}
											readOnly={info.editingStatus !== `${group}-${index}`}
											onClick={() => {
												if (info.editingStatus !== `${group}-${index}`) {
													handleInfoChange({
														editingStatus: `${group}-${index}`,
														editedValue: status.label,
													});
												}
											}}
											onChange={(e) =>
												info.editingStatus === `${group}-${index}` &&
												handleInfoChange({ editedValue: e.target.value })
											}
											onBlur={() =>
												info.editingStatus === `${group}-${index}` &&
												handleUpdateStatus(group, index, info.editedValue)
											}
											onKeyDown={(e) => {
												if (
													e.key === 'Enter' &&
													info.editingStatus === `${group}-${index}`
												) {
													e.preventDefault();
													handleUpdateStatus(
														group,
														index,
														info.editedValue,
													);
												}
											}}
											autoFocus={info.editingStatus === `${group}-${index}`}
										/>
									</div>
								</div>
								<div className={s.statusActions}>
									{!status.isDefault && (
										<button
											className={s.setDefaultButton}
											onClick={() => handleSetDefault(group, index)}
											disabled={info.loading}
										>
											<Check /> Set as default
										</button>
									)}
									{status.isDefault && (
										<div className={s.defaultBadge}>Default</div>
									)}
									<button
										className={s.deleteStatus}
										onClick={() => handleDeleteStatus(group, index)}
										disabled={info.loading || status.isDefault}
									>
										<Dustbin />
									</button>
								</div>
							</div>
							{info.showColorPicker === `${group}-${index}` && (
								<div className={s.colorPicker}>
									<div className={s.colorsTitle}>Colors</div>
									<div className={s.colorsList}>
										{colorOptions.map((color) => (
											<div
												key={color.number}
												className={`${s.colorItem} ${
													status.color === color.number ? s.selected : ''
												}`}
												onClick={() =>
													handleColorSelect(group, index, color.number)
												}
												style={{ backgroundColor: color.color }}
											/>
										))}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className={s.statusEditContainer}>
			<StatusGroup group="todo" title="To-do" />
			<StatusGroup group="inProgress" title="In Progress" />
			<StatusGroup group="completed" title="Completed" />
		</div>
	);
};

export default StatusEdit;
