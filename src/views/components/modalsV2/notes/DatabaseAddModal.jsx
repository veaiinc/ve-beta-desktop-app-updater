import React, { useCallback, useContext, useState } from 'react';
import ReactModal from '../index';
import s from '../../../../assets/scss/notes/modals/databaseAddModal.module.scss';
import Context from '../../../../context/context';
import { rowTypes } from '../../notes/Database';

const DatabaseAddModal = ({ isOpen, onClose, viewId, pageId, databaseId, fields }) => {
	const {
		notes: { addDatabaseRow },
	} = useContext(Context);

	const [info, setInfo] = useState({
		values: {},
		loading: false,
	});

	const handleInfoChange = useCallback((data = {}) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const preparePayload = useCallback(
		(values) => {
			return Object.entries(values).reduce((acc, [key, value]) => {
				if (value !== null && value !== undefined && value !== '') {
					const field = fields.find((f) => f._id === key);
					acc[key] = field?.type === 'number' ? Number(value) : value;
				}
				return acc;
			}, {});
		},
		[fields],
	);

	const handleSubmit = useCallback(async () => {
		setInfo((prev) => ({ ...prev, loading: true }));
		await addDatabaseRow(
			{
				pageId,
				input: { databaseId, values: preparePayload(info?.values) },
			},
			viewId,
		);
		setInfo((prev) => ({ ...prev, loading: false }));
		handleInfoChange({ values: {}, loading: false });
		onClose();
	}, [info?.values]);

	const handleOptionSelect = useCallback(
		(fieldId, value) => {
			handleInfoChange({
				values: {
					...info?.values,
					[fieldId]: value,
				},
			});
		},
		[info?.values, handleInfoChange],
	);

	const renderFieldInput = useCallback(
		(field) => {
			// Handle basic input types first
			if (['text', 'title', 'number'].includes(field.type)) {
				return (
					<input
						type={field.type === 'number' ? 'number' : 'text'}
						name={field._id}
						value={info?.values?.[field._id] || ''}
						onChange={(e) =>
							handleInfoChange({
								values: {
									...info?.values,
									[field._id]: e.target.value,
								},
							})
						}
						disabled={field.isReadOnly}
						placeholder={`Enter ${field.name}`}
					/>
				);
			}

			// Handle other types using rowTypes components
			const Component = rowTypes[field.type];
			if (Component) {
				return (
					<Component
						value={info?.values?.[field._id] || ''}
						title={field?.name}
						onChange={(value) =>
							handleInfoChange({
								values: {
									...info?.values,
									[field._id]: value,
								},
							})
						}
						onOptionClick={(value) => handleOptionSelect(field._id, value)}
						options={field.config?.options}
						showTitle={true}
						showLabel={true}
						style={{ background: 'transparent', padding: 0 }}
						disabled={field.isReadOnly}
						labelField={'label'}
					/>
				);
			}

			// Fallback to text input for unknown types
			return (
				<input
					type="text"
					name={field._id}
					value={info?.values?.[field._id] || ''}
					onChange={(e) =>
						handleInfoChange({
							values: {
								...info?.values,
								[field._id]: e.target.value,
							},
						})
					}
					disabled={field.isReadOnly}
					placeholder={`Enter ${field.name}`}
				/>
			);
		},
		[info?.values, handleInfoChange, handleOptionSelect],
	);

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={info?.loading ? null : onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 50002,
				},
				overlay: {
					zIndex: 50000,
				},
			}}
		>
			<div className={s.databaseAddModalContainer}>
				<div className={s.databaseAddModalHeader}>
					<h3>Add Row</h3>
				</div>
				<div className={s.databaseAddModalBody}>
					{fields?.map(
						(field) =>
							!field?.isReadOnly && (
								<div className={s.databaseAddModalBodyRow} key={field?._id}>
									<div className={s.databaseAddModalBodyRowField}>
										<label htmlFor={field?._id}>{field?.name}</label>
										{renderFieldInput(field)}
									</div>
								</div>
							),
					)}
				</div>
				<div className={s.databaseAddModalFooter}>
					<button
						onClick={handleSubmit}
						className={s.databaseAddModalFooterButton}
						disabled={info?.loading}
					>
						{info?.loading ? 'Adding...' : 'Add Row'}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default DatabaseAddModal;
