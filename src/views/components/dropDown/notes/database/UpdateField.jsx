import React, { useCallback, useContext, useMemo, useState, useEffect } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/updateField.module.scss';
import { ReactComponent as CrossSvg } from '../../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as PlusIcon } from '../../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as DustbinOutlined } from '../../../../../assets/svg/tasks/dustBin.svg';

import { Tooltip } from 'antd';
import GroupConfigOptions from './GroupConfigOptions';
import OptionsComponent from './OptionsComponent';
import { message } from '../../../globalComponents/CustomToast';
import Context from '../../../../../context/context';
import StatusComponent from './StatusComponent';
import DatabaseIcon from '../../../notes/DatabseComponents/DatabaseIcon';

const fieldTypes = [
	{
		label: 'Text',
		value: 'text',
	},
	{
		label: 'Number',
		value: 'number',
	},
	{
		label: 'Status',
		value: 'status',
		hasStatus: true,
	},
	{
		label: 'Select',
		value: 'select',
		hasOptions: true,
	},
	{
		label: 'Multi Select',
		value: 'multi_select',
		hasOptions: true,
	},
	{
		label: 'Date',
		value: 'date',
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
		label: 'Url',
		value: 'url',
	},
	{
		label: 'Person',
		value: 'person',
		hasLimit: true,
	},
	{
		label: 'Checkbox',
		value: 'checkbox',
	},
	{
		label: 'Created by',
		value: 'created_by',
	},
	{
		label: 'Created time',
		value: 'created_time',
	},
	{
		label: 'Last edited by',
		value: 'last_edited_by',
	},
	{
		label: 'Last edited time',
		value: 'last_edited_time',
	},
	{
		label: 'ID',
		value: 'serial_number',
		hasPrefix: true,
	},
];
const limitOptions = [
	{
		label: 'No Limit',
		value: -1,
	},
	{
		label: '1 Person',
		value: 1,
	},
];

const status = {
	todo: [{ label: 'Not Started', color: '2', _id: 'Not Started', isDefault: true }],
	inProgress: [
		{
			label: 'In Progress',
			color: '6',
			_id: 'In Progress',
		},
	],
	completed: [
		{
			label: 'Done',
			color: '5',
			_id: 'Done',
		},
	],
};

const initialState = {
	selectedFieldType: {
		label: 'Text',
		value: 'text',
	},
	fieldTypeTooltipOpen: false,
	limitTooltipOpen: false,
	fieldName: null,
	options: [],
	status,
	limit: { label: 'No Limit', value: -1 },
	prefix: '',
	loading: false,
};

const UpdateField = ({
	pageId,
	databaseId,
	handleBack,
	handleClose,
	hasSerialNumber = false,
	field,
}) => {
	const {
		notes: { updateDatabaseField, deleteDatabaseField },
	} = useContext(Context);
	const [info, setInfo] = useState({ ...initialState });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!field) return;
		const {
			name,
			config: { options, status, prefix },
			limit,
			type,
		} = field;
		let selectedFieldType = fieldTypes?.find((item) => item?.value === type);
		if (type === 'title') {
			selectedFieldType = {
				label: 'Title',
				value: 'title',
			};
		}
		handleInfoChange({
			fieldName: name,
			options,
			status,
			prefix,
			limit,
			selectedFieldType,
		});
	}, [field]);

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	// --- Update Field Name ---
	const handleFieldNameBlur = async () => {
		const newName = info?.fieldName?.trim();
		if (loading || !field || newName === field?.name?.trim()) return;
		if (!newName) {
			message?.error('Field name cannot be empty');
			handleInfoChange({ fieldName: field?.name });
			return;
		}
		setLoading(true);
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: { type: field?.type, name: newName },
		});
		setLoading(false);
	};

	// --- Update Options ---
	const updateOptionsOnServer = async (newOptions) => {
		if (!field) return;
		setLoading(true);
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { options: newOptions },
			},
		});
		setLoading(false);
	};

	const addOption = useCallback(
		(option) => {
			const exists = info?.options?.find((item) => item?.label === option?.label);
			if (exists) {
				message?.error('Option already exists');
				return;
			}
			const newOptions = [...(info?.options || []), { ...option, _id: option?.label }];
			handleInfoChange({ options: newOptions });
			updateOptionsOnServer(newOptions);
			return true;
		},
		[info?.options],
	);

	const updateOption = useCallback(
		(option) => {
			const exists = info?.options?.find((item) => item?.label === option?.label);
			if (exists && option?._id !== exists?._id) {
				message?.error('Option already exists');
				return;
			}
			const newOptions = info?.options?.map((item) => {
				if (item?._id === option?._id) {
					return { ...item, ...option };
				}
				return item;
			});
			handleInfoChange({ options: newOptions });
			updateOptionsOnServer(newOptions);
			return true;
		},
		[info?.options],
	);

	const deleteOption = useCallback(
		(optionId) => {
			const newOptions = info?.options?.filter(({ _id }) => _id !== optionId);
			handleInfoChange({ options: newOptions });
			updateOptionsOnServer(newOptions);
		},
		[info?.options],
	);

	// --- Update Status ---
	const updateStatusOnServer = async (newStatus) => {
		if (!field) return;
		setLoading(true);
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { status: newStatus },
			},
		});
		setLoading(false);
	};

	const addStatus = useCallback(
		(group, option) => {
			const allOptions = Object.values(info?.status)?.flat();
			const exists = allOptions?.find(({ label }) => label === option?.label);
			if (exists) {
				message?.error('Option already exists');
				return;
			}
			const status = {
				...(info?.status || {}),
				[group]: [...(info?.status?.[group] || []), { ...option, _id: option?.label }],
			};
			handleInfoChange({ status });
			updateStatusOnServer(status);
			return true;
		},
		[info?.status],
	);

	const updateStatus = useCallback(
		(group, option) => {
			const allOptions = Object.values(info?.status)?.flat();
			const exists = allOptions?.find((item) => item?.label === option?.label);
			if (exists && option?._id !== exists?._id) {
				message?.error('Option already exists');
				return;
			}
			const isDefault = option?.isDefault;
			let newStatus = { ...info?.status };
			if (isDefault) {
				for (const key in newStatus) {
					newStatus[key] = newStatus[key].map((item) => {
						if (item.isDefault && item._id !== option._id) {
							return { ...item, isDefault: false };
						}
						return item;
					});
				}
			}
			newStatus[group] = newStatus[group].map((item) => {
				if (item._id === option._id) {
					return { ...item, ...option };
				}
				return item;
			});
			handleInfoChange({ status: newStatus });
			updateStatusOnServer(newStatus);
		},
		[info?.status],
	);

	const deleteStatus = useCallback(
		(group, optionId) => {
			const filteredGroup = info?.status?.[group]?.filter((item) => item?._id !== optionId);
			const newStatus = { ...(info?.status || {}), [group]: filteredGroup };
			handleInfoChange({ status: newStatus });
			updateStatusOnServer(newStatus);
		},
		[info?.status],
	);

	// --- Update Prefix ---
	const handlePrefixBlur = async () => {
		if (!field) return;
		const newPrefix = info?.prefix?.trim() || null;
		if (newPrefix === (field?.config?.prefix || null)) return;
		setLoading(true);
		await updateDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
			input: { type: field?.type, config: { prefix: newPrefix } },
		});
		setLoading(false);
	};

	// --- Delete Field ---
	const handleDeleteField = async () => {
		if (!field) return;
		setLoading(true);
		await deleteDatabaseField({
			pageId,
			databaseId,
			fieldId: field?._id,
		});
		setLoading(false);
		handleBack();
	};

	const handleFieldTypeChange = useCallback((selectedFieldType) => {
		handleInfoChange({ selectedFieldType, fieldTypeTooltipOpen: false });
	}, []);

	const handleChangeLimit = useCallback((option) => {
		handleInfoChange({ limit: option, limitTooltipOpen: false });
	}, []);

	const filteredFieldTypes = useMemo(
		() => (hasSerialNumber ? fieldTypes.slice(0, -1) : fieldTypes),
		[hasSerialNumber],
	);

	return (
		<div className={s.addField}>
			<div className={s.header}>
				<ArrowLeftSvg className={s.cursorPointer} onClick={handleBack} />
				<span className={s.optionsDropdownHeaderTitle}>Update property</span>
				<CrossSvg className={s.cursorPointer} onClick={handleClose} />
			</div>
			<div className={s.inputWrapper}>
				<div className={s.icon}>
					<DatabaseIcon type={info?.selectedFieldType?.value} />
				</div>
				<input
					type="text"
					className={s.nameInput}
					placeholder="Enter field name"
					value={info?.fieldName}
					onChange={(e) => handleInfoChange({ fieldName: e.target.value })}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.currentTarget.blur();
						}
					}}
					onBlur={handleFieldNameBlur}
					disabled={loading}
					autoFocus
				/>
			</div>
			<div className={s.optionsWrapper}>
				<Tooltip
					title={
						<GroupConfigOptions
							options={filteredFieldTypes}
							selectedOption={info?.selectedFieldType?.value}
							onChange={handleFieldTypeChange}
						/>
					}
					open={false}
					placement="bottomLeft"
					overlayClassName="status-dropdown"
					color="transparent"
					trigger={['click']}
					zIndex={50100}
					onOpenChange={(open) => {
						handleInfoChange({ fieldTypeTooltipOpen: open });
					}}
				>
					<div className={`${s.option} ${s.disabled}`}>
						<div className={s.text}>Type</div>
						<div className={s.subText}>{info?.selectedFieldType?.label}</div>
					</div>
				</Tooltip>
			</div>
			{info?.selectedFieldType?.hasOptions && (
				<>
					<div className={s.divider} />
					<OptionsComponent
						options={info?.options}
						addOption={addOption}
						updateOption={updateOption}
						deleteOption={deleteOption}
					/>
				</>
			)}

			{info?.selectedFieldType?.hasLimit && (
				<>
					<div className={s.divider} />
					<Tooltip
						title={
							<GroupConfigOptions
								options={limitOptions}
								onChange={handleChangeLimit}
							/>
						}
						open={info?.limitTooltipOpen}
						placement="bottomLeft"
						overlayClassName="status-dropdown"
						color="transparent"
						trigger={['click']}
						zIndex={50100}
						onOpenChange={(open) => {
							handleInfoChange({ limitTooltipOpen: open });
						}}
					>
						<div className={s.option}>
							<div className={s.text}>Limit</div>
							<div className={s.subText}>{info?.limit?.label}</div>
						</div>
					</Tooltip>
				</>
			)}

			{info?.selectedFieldType?.hasPrefix && (
				<>
					<div className={s.divider} />
					<div className={s.option}>
						<div className={s.text}>Prefix</div>
						<input
							type="text"
							className={s.optionInput}
							value={info?.prefix}
							onChange={(e) => handleInfoChange({ prefix: e.target.value })}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.currentTarget.blur();
								}
							}}
							onBlur={handlePrefixBlur}
							disabled={loading}
						/>
					</div>
				</>
			)}

			{info?.selectedFieldType?.hasStatus && (
				<>
					<div className={s.divider} />
					<StatusComponent
						status={info?.status}
						addStatus={addStatus}
						updateStatus={updateStatus}
						deleteStatus={deleteStatus}
					/>
				</>
			)}
			<>
				<div className={s.divider} />
				<div
					className={s.option}
					onClick={handleDeleteField}
					style={{
						color: '#e74c3c',
						cursor: 'pointer',
						opacity: loading ? 0.5 : 1,
						pointerEvents: loading ? 'none' : 'auto',
					}}
				>
					<div className={s.text}>
						<DustbinOutlined className={s.icon} />
						Delete property
					</div>
				</div>
			</>
		</div>
	);
};

export default UpdateField;
