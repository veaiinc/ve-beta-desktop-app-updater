import { memo, useEffect, useState } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/optionsComponent.module.scss';
import { ReactComponent as PlusIcon } from '../../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as DustbinOutlined } from '../../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';
import { colors } from '../../../../../helpers/databaseHelpers';

const colorsArray = Object.values(colors || {});

const OptionsComponent = ({ options, addOption, updateOption, deleteOption }) => {
	const [info, setInfo] = useState({
		activeOption: null,
		newLabel: '',
		editingLabel: '',
		showAddInput: false,
	});

	useEffect(() => {
		if (options && options?.length === 0) {
			handleInfoChange({ showAddInput: true });
		}
	}, [options]);

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const addNewOption = () => {
		const color = Math.floor(Math.random() * 7) + 1;
		const label = info?.newLabel?.trim();
		if (!label) {
			return;
		}
		const res = addOption({ label, color: String(color) });
		if (res) {
			handleInfoChange({ newLabel: '' });
		}
	};

	const toggleActiveOption = (option) => {
		if (option?._id === info?.activeOption) {
			handleInfoChange({ activeOption: null, editingLabel: '' });
		} else {
			handleInfoChange({ activeOption: option?._id, editingLabel: option?.label });
		}
	};

	const handleUpdateOption = (update = {}) => {
		const currentOption = options?.find((opt) => opt._id === info?.activeOption);
		const option = { _id: info?.activeOption };
		if (update?.color) {
			if (currentOption && update?.color === currentOption.color) return;
			option.color = update?.color;
		}
		if (update?.label) {
			if (currentOption && update?.label === currentOption.label) return;
			option.label = update?.label;
		}
		updateOption(option);
	};

	const toggleAddInput = () => {
		handleInfoChange({ showAddInput: !info?.showAddInput });
	};

	return (
		<div className={s.optionsComponent}>
			<div className={s.titleArea}>
				<div className={s.title}>Options</div>
				<PlusIcon onClick={toggleAddInput} className={s.cursorPointer} />
			</div>
			{info?.showAddInput && (
				<input
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

			<div className={s.optionsContainer}>
				{options?.length !== 0 ? (
					options?.map((option, index) => {
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
												backgroundColor: colors?.[option?.color]?.color,
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
														e.preventDefault();
														e.target.blur();
													}
												}}
												onBlur={() =>
													handleUpdateOption({
														label: info?.editingLabel?.trim(),
													})
												}
												autoFocus
											/>
										) : (
											<div className={s.labelText}>{option?.label}</div>
										)}
									</div>
									<ChevronRightThinSvg
										className={`${s.toggleIcon} ${isActive ? s.active : ``}`}
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
													style={{ backgroundColor: color?.color }}
													key={index}
													onClick={() => {
														if (String(index + 1) !== option.color) {
															handleUpdateOption({
																color: String(index + 1),
															});
														}
													}}
												/>
											))}
										</div>
										<div className={s.actionsWrapper}>
											<button
												className={s.deleteButton}
												onClick={() => deleteOption(option?._id)}
											>
												<DustbinOutlined /> Delete
											</button>
										</div>
									</div>
								)}
							</div>
						);
					})
				) : (
					<span className={s.noOptions}>No options</span>
				)}
			</div>
		</div>
	);
};

export default memo(OptionsComponent);
