import React, { useCallback, useContext, useState } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/addField.module.scss';
import { ReactComponent as CrossSvg } from '../../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as PlusIcon } from '../../../../../assets/svg/tasks/plus.svg';

import { Tooltip } from 'antd';
import GroupConfigOptions from './GroupConfigOptions';
import OptionsComponent from './OptionsComponent';
import { message } from '../../../globalComponents/CustomToast';
import Context from '../../../../../context/context';

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

const initialState = {
	selectedFieldType: {
		label: 'Text',
		value: 'text',
	},
	fieldTypeTooltipOpen: false,
	fieldName: null,
	options: [],
	limit: -1,
	prefix: '',
	loading: false,
};

const AddField = ({ pageId, databaseId, handleBack, handleClose }) => {
	const {
		notes: { addDatabaseField },
	} = useContext(Context);
	const [info, setInfo] = useState({ ...initialState });

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleFieldTypeChange = useCallback((selectedFieldType) => {
		handleInfoChange({ selectedFieldType, fieldTypeTooltipOpen: false });
	}, []);

	const addOption = useCallback(
		(option) => {
			const exists = info?.options?.find((item) => item?.label === option?.label);
			if (exists) {
				message?.error('Option already exists');
				return;
			}
			handleInfoChange({
				options: [...(info?.options || []), { ...option, _id: option?.label }],
			});
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
			handleInfoChange({
				options: newOptions,
			});
			return true;
		},
		[info?.options],
	);

	const deleteOption = useCallback(
		(optionId) => {
			const newOptions = info?.options?.filter(({ _id }) => _id !== optionId);
			handleInfoChange({ options: newOptions });
		},
		[info?.options],
	);

	const handleAddField = async () => {
		const name = info?.fieldName?.trim();
		if (!name) {
			message?.error('Field name is required');
			return;
		}
		const { value: type, hasOptions, hasLimit, hasPrefix } = info?.selectedFieldType || {};
		const input = { name, type, config: {} };
		if (hasOptions) {
			if (info?.options?.length === 0) {
				message?.error('Add at least one option');
				return;
			}
			input.config.options = info?.options?.map(({ _id, ...option }) => option);
		}

		if (hasLimit) {
			input.selectionLimit = info?.limit;
		}

		if (hasPrefix) {
			input.config.prefix = info?.prefix;
		}
		const payload = {
			pageId: pageId,
			databaseId: databaseId,
			input,
		};

		const res = await addDatabaseField(payload);
		if (res[0]) {
			handleInfoChange({ ...initialState });
			handleBack();
		}
	};

	return (
		<div className={s.addField}>
			<div className={s.header}>
				<ArrowLeftSvg className={s.cursorPointer} onClick={handleBack} />
				<span className={s.optionsDropdownHeaderTitle}>Add property</span>
				<CrossSvg className={s.cursorPointer} onClick={handleClose} />
			</div>
			<div className={s.inputWrapper}>
				<div className={s.icon}></div>
				<input
					type="text"
					className={s.nameInput}
					placeholder="Enter field name"
					value={info?.fieldName}
					onChange={(e) => handleInfoChange({ fieldName: e.target.value })}
					autoFocus
				/>
			</div>
			<div className={s.optionsWrapper}>
				<Tooltip
					title={
						<GroupConfigOptions
							options={fieldTypes}
							selectedOption={info?.selectedFieldType?.value}
							onChange={handleFieldTypeChange}
						/>
					}
					open={info?.fieldTypeTooltipOpen}
					placement="bottomLeft"
					overlayClassName="status-dropdown"
					color="transparent"
					trigger={['click']}
					zIndex={50100}
					onOpenChange={(open) => {
						handleInfoChange({ fieldTypeTooltipOpen: open });
					}}
				>
					<div className={s.option}>
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
					<div className={s.divider} />
				</>
			)}

			<button className={s.addFieldButton} onClick={handleAddField}>
				Add property
			</button>
		</div>
	);
};

export default AddField;
