import { memo, useContext, useState, useEffect, useCallback } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/calendar/modal/updateCategoryModal.scss';
import Context from '../../../../context/context';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/calendar/close.svg';

const UpdateCategoryModal = ({ show, handleClose, isCategoryEditable, selectedCategory }) => {
	const {
		calendarInfo: {
			calendarCategoriesList,
			createCalendarCategory,
			updateCalendarCategory,
			getCalendarCategories,
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	const [info, setInfo] = useState({
		name: '',
		color: '',
		error: null,
		submiting: false,
		colorsArray: [
			'#8BC34A',
			'#E91E63',
			'#08B6DE',
			'#887fff',
			'#0158ff',
			'#00fad8',
			'#ff9fd3',
			'#ff2727',
			'#2196F3',
			'#964444',
		],
	});

	// Set initial values when editing
	useEffect(() => {
		if (isCategoryEditable && selectedCategory) {
			setInfo((prev) => ({
				...prev,
				name: selectedCategory?.name || '',
				color: selectedCategory?.color || '',
			}));
		} else {
			// Reset form when creating new category
			setInfo((prev) => ({
				...prev,
				name: '',
				color: '',
			}));
		}
	}, [isCategoryEditable, selectedCategory, show]);

	useEffect(() => {
		if (!show) {
			setInfo((prev) => ({
				...prev,
				name: '',
				color: '',
				error: null,
			}));
		}
	}, [show]);
	// const isFormValid = info?.name?.trim() && info?.color;
	const isFormValid = info?.name?.trim();
	const validateForm = useCallback(() => {
		if (!info?.name?.trim()) {
			setInfo((prev) => ({ ...prev, error: 'Category name is required' }));
			return false;
		}
		if (!info?.color) {
			setInfo((prev) => ({ ...prev, error: 'Please select a color' }));
			return false;
		}
		if (info?.name?.trim()?.length > 50) {
			setInfo((prev) => ({
				...prev,
				error: 'Category name must be less than 50 characters',
			}));
			return false;
		}
		return true;
	}, [info?.name, info?.color]);

	const handleCategorySubmit = useCallback(async () => {
		try {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictCalendar &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}

			if (!validateForm()) {
				return;
			}

			const categoryPayload = {
				calendarCategory: info?.name.trim(),
				categoryColor: info?.color,
			};

			// Check for duplicate category names
			const isDuplicate = calendarCategoriesList?.some(
				(category) =>
					category?.name?.toLowerCase() === info?.name?.trim()?.toLowerCase() &&
					(!isCategoryEditable || category?._id !== selectedCategory?._id),
			);

			if (isDuplicate) {
				setInfo((prev) => ({ ...prev, error: 'Category name already exists' }));
				return;
			}

			if (isCategoryEditable) {
				setInfo((prev) => ({ ...prev, submiting: true }));
				await updateCalendarCategory(selectedCategory._id, categoryPayload);
				setInfo((prev) => ({ ...prev, submiting: false }));
			} else {
				setInfo((prev) => ({ ...prev, submiting: true }));
				await createCalendarCategory(categoryPayload);
				setInfo((prev) => ({ ...prev, submiting: false }));
			}

			handleClose();
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				error:
					calendarCategoriesList?.error || 'Failed to save category. Please try again.',
			}));
		}
	}, [
		info?.name,
		info?.color,
		isCategoryEditable,
		selectedCategory,
		calendarCategoriesList,
		validateForm,
	]);

	return (
		<ReactModal
			isOpen={show}
			closeModal={info?.submiting ? null : handleClose}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '15px' } }}
		>
			<div className="update-category-modal-content">
				<div className="update-category-modal-header">
					<div className="update-category-modal-header-text">Category</div>
					{!info?.submiting && (
						<CloseSvg onClick={handleClose} style={{ cursor: 'pointer' }} />
					)}
				</div>
				<div className="modalBody">
					{info?.error && (
						<div style={{ textAlign: 'center', width: '100%', color: '#ff6230' }}>
							{info?.error}
						</div>
					)}

					{isCategoryEditable ? (
						<div className="warningContainer">
							<h2>Warning</h2>
							<p>
								If you change the name it will reflect everywhere where all are
								connected
							</p>
						</div>
					) : null}

					<div className="inputContainer">
						<div className="inputWrapper">
							<div className="categoryName">Category</div>
							<input
								id="categoryName"
								type="text"
								placeholder="Category Name"
								value={info?.name}
								autoComplete="off"
								onChange={(e) =>
									setInfo((prev) => ({
										...prev,
										name: e.target.value,
										error: null,
									}))
								}
								style={{
									display: 'flex',
									padding: '12px 14px',
									justifyContent: 'space-between',
									alignItems: 'center',
									alignSelf: 'stretch',
									backgroundColor: 'var(--popup)',
									borderRadius: '8px',
									border: '1px solid var(--stroke, #2C2D2E)',
									background: 'var(--popup, #202123)',
									color: 'var(--primary-font)',
									textOverflow: 'ellipsis',
									fontFamily: 'var(--primary-font-family)',
									fontSize: '14px',
									fontStyle: 'normal',
									fontWeight: '500',
									lineHeight: 'normal',
								}}
							/>
						</div>
					</div>

					<div className="colorPickerContainer">
						<div className="textWrapper">
							<h3>Pick a color</h3>
							<p>
								Color coding your Categories helps you to spot it a lot easier when
								you need it.
							</p>
						</div>
						<div className="colorPicker">
							{info?.colorsArray.map((colorCode) => (
								<label
									htmlFor={colorCode}
									className="colorCircle"
									style={{ backgroundColor: colorCode }}
									key={colorCode}
								>
									<input
										type="radio"
										name="color"
										value={colorCode}
										id={colorCode}
										checked={colorCode === info?.color}
										onChange={(e) =>
											setInfo((prev) => ({
												...prev,
												color: e.target.value,
												error: null,
											}))
										}
									/>
									<div className="innerCircle"></div>
								</label>
							))}
						</div>
					</div>
					<div className="actionsContainer">
						<button onClick={handleClose}>Discard</button>
						<button
							className="primaryButton"
							onClick={handleCategorySubmit}
							disabled={!isFormValid}
							style={{ cursor: !isFormValid ? 'not-allowed' : 'pointer' }}
						>
							{info?.submiting ? (
								<Spinner width={15} height={15} />
							) : isCategoryEditable ? (
								'Update'
							) : (
								'Create'
							)}
						</button>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UpdateCategoryModal);
