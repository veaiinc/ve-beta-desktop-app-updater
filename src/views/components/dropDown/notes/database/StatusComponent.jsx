import { memo, useState } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/statusComponent.module.scss';
import { ReactComponent as PlusIcon } from '../../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as DustbinOutlined } from '../../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as Check } from '../../../../../assets/svg/tasks/checkmark.svg';
import { colors } from '../../../../../helpers/databaseHelpers';

const colorsArray = Object.values(colors || {});
const statusGroupNameMapper = {
	todo: 'Todo',
	inProgress: 'In Progress',
	completed: 'Completed',
};

const StatusComponent = ({ status, addStatus, updateStatus, deleteStatus }) => {
	const [info, setInfo] = useState({
		addInputCurrentGroup: null,
		newLabel: '',
		editingLabel: '',
		activeOption: null,
	});
	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleToggleAddInput = (group = null) => {
		handleInfoChange({
			addInputCurrentGroup: group === info?.addInputCurrentGroup ? null : group,
			newLabel: '',
		});
	};

	const toggleActiveOption = (option) => {
		if (option?._id === info?.activeOption) {
			handleInfoChange({ activeOption: null, editingLabel: '' });
		} else {
			handleInfoChange({ activeOption: option?._id, editingLabel: option?.label });
		}
	};

	const addNewOption = () => {
		const color = Math.floor(Math.random() * 7) + 1;
		const label = info?.newLabel?.trim();
		if (!label) {
			return;
		}
		const res = addStatus(info?.addInputCurrentGroup, { label, color: String(color) });
		if (res) {
			handleInfoChange({ newLabel: '' });
		}
	};

	const handleUpdateOption = (group, update = {}) => {
		const label = info?.editingLabel?.trim();
		const option = { _id: info?.activeOption };
		if (update?.color) {
			if (update?.color === info?.activeOption?.color) return;
			option.color = update?.color;
		}
		if (update?.label) {
			if (update?.label === info?.activeOption?.label) return;
			option.label = update.label;
		}

		if (update?.isDefault !== undefined) {
			if (update?.isDefault === info?.activeOption?.isDefault) return;
			option.isDefault = update?.isDefault;
		}
		updateStatus(group, option);
	};

	const statusArray = Object.entries(status);

	return (
		<div className={s.statusComponent}>
			{statusArray?.map((group, index) => (
				<>
					<div className={s.statusGroup}>
						<div className={s.groupHeader}>
							<span className={s.title}>{statusGroupNameMapper?.[group[0]]}</span>
							<PlusIcon
								className={s.cursorPointer}
								onClick={() => handleToggleAddInput(group[0])}
							/>
						</div>
						{info?.addInputCurrentGroup === group[0] && (
							<input
								type="text"
								className={s.addInput}
								placeholder="Enter label"
								value={info?.newLabel}
								onChange={(e) => handleInfoChange({ newLabel: e.target.value })}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										addNewOption();
									}
								}}
								autoFocus
							/>
						)}
						<div className={s.optionsWrapper}>
							{group[1]?.map((option, index) => {
								const isActive = info?.activeOption === option?._id;
								return (
									<div
										className={`${s.option} ${isActive ? s.active : ``}`}
										key={option?._id || index}
									>
										<div
											className={s.inputWrapper}
											onClick={() => toggleActiveOption(option)}
										>
											<SixDotsSvg />
											<div className={s.tagWrapper}>
												<div
													className={s.labelDot}
													style={{
														backgroundColor:
															colors?.[option?.color]?.color,
													}}
												></div>
												{isActive ? (
													<input
														type="text"
														className={s.labelInput}
														placeholder="Enter label"
														onClick={(e) => e.stopPropagation()}
														value={info?.editingLabel}
														onChange={(e) =>
															handleInfoChange({
																editingLabel: e.target.value,
															})
														}
														onKeyDown={(e) => {
															if (e.key === 'Enter') {
																e.onBlur();
															}
														}}
														onBlur={() =>
															handleUpdateOption(group[0], {
																label: info?.editingLabel?.trim(),
															})
														}
														autoFocus
													/>
												) : (
													<div className={s.labelText}>
														{option?.label}
													</div>
												)}
											</div>
											<ChevronRightThinSvg
												className={`${s.toggleIcon} ${
													isActive ? s.active : ``
												}`}
											/>
										</div>
										{isActive && (
											<div className={s.customizationSection}>
												<div className={s.colorsTitle}>Colours</div>
												<div className={s.colorsWrapper}>
													{colorsArray?.map((color, index) => (
														<div
															className={`${s.color} ${
																String(index + 1) === option.color
																	? s.active
																	: ``
															}`}
															style={{
																backgroundColor: color?.color,
															}}
															key={index}
															onClick={() => {
																if (
																	String(index + 1) !==
																	option.color
																) {
																	handleUpdateOption(group[0], {
																		color: String(index + 1),
																	});
																}
															}}
														/>
													))}
												</div>
												<div className={s.actionsWrapper}>
													<button
														className={s.setDefault}
														disabled={option?.isDefault}
														onClick={() =>
															handleUpdateOption(group[0], {
																isDefault: true,
															})
														}
													>
														<Check />
														Set as default
													</button>
													<button
														className={s.deleteButton}
														disabled={option?.isDefault}
														onClick={() =>
															deleteStatus(group[0], option?._id)
														}
													>
														<DustbinOutlined /> Delete
													</button>
												</div>
											</div>
										)}
									</div>
								);
							})}
							{group?.[1]?.length < 1 && (
								<span className={s.noOptions}>No options</span>
							)}
						</div>
					</div>
					{index !== 2 && <div className={s.divider} />}
				</>
			))}
		</div>
	);
};

export default memo(StatusComponent);
