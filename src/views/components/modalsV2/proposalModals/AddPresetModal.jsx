/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import '../../../../assets/scss/sales/smartFile/addPresetModal.scss';
import Context from '../../../../context/context';

const initialState = {
	eventPresetName: '',
	services: [],
	createPresetLoading: false,
	eventPresetNameError: false,
	serviceError: false,
	variableId: null,
};

const AddPresetModal = ({
	modalIsOpen,
	closeModal,
	mode,
	selectedEventsPresetData,
	updateEventspresetData,
}) => {
	let {
		templates: { addEventsPresets, editEventsPresets },
	} = useContext(Context);
	const [info, setInfo] = useState({
		...initialState,
	});

	//useEffects
	useEffect(() => {
		if (mode === 'edit') {
			const { displayName, eventTableValues = [], _id } = selectedEventsPresetData || {};
			setInfo((prev) => ({
				...prev,
				eventPresetName: displayName,
				services: [...eventTableValues],
				variableId: _id,
			}));
		}
	}, [mode, selectedEventsPresetData]);

	//function defination

	const servicesOnChange = useCallback(
		(index, type, value) => {
			const serviceRoleData = [...(info?.services || [])];
			const serviceToBeChanged = serviceRoleData?.[index] || {};
			if (type === 'serviceName') {
				serviceToBeChanged.type = value;
			}

			if (type === 'quantity') {
				serviceToBeChanged.categories[0].quantity = value;
			}
			if (type === 'increment') {
				const currentQuantity = serviceToBeChanged.categories[0].quantity;
				serviceToBeChanged.categories[0].quantity =
					currentQuantity >= 0 ? currentQuantity + 1 : 0;
			}
			if (type === 'decrement') {
				const currentQuantity = serviceToBeChanged.categories[0].quantity;
				serviceToBeChanged.categories[0].quantity =
					currentQuantity > 0 ? currentQuantity - 1 : 0;
			}
			serviceRoleData?.splice(index, 1, serviceToBeChanged);
			setInfo((prev) => ({ ...prev, services: serviceRoleData, serviceError: false }));
		},
		[info?.services],
	);

	const addServices = useCallback(() => {
		const serviceRoleData = [...(info?.services || [])];
		serviceRoleData.push({ type: '', categories: [{ category: 'candid', quantity: 0 }] });
		setInfo((prev) => ({ ...prev, services: serviceRoleData, serviceError: false }));
	}, [info?.services]);

	const removeService = useCallback(
		(index) => {
			const serviceRoleData = [...(info?.services || [])];
			serviceRoleData?.splice(index, 1);
			setInfo((prev) => ({ ...prev, services: serviceRoleData, serviceError: false }));
		},
		[info?.services],
	);

	const createEditPreset = useCallback(async () => {
		if (info?.createPresetLoading) {
			return;
		}
		if (!info?.eventPresetName?.length) {
			return setInfo((prev) => ({ ...prev, eventPresetNameError: true }));
		}
		if (!info?.services?.length) {
			return setInfo((prev) => ({ ...prev, serviceError: true }));
		}
		setInfo((prev) => ({ ...prev, createPresetLoading: true }));
		const payload = {
			displayName: info?.eventPresetName?.trim(),
			inputType: 'event_services',
			eventTableValues: [...(info?.services || [])],
			subType: 'event_table',
		};
		let response;
		if (mode === 'edit') {
			response = await editEventsPresets(payload, info?.variableId);
		} else {
			response = await addEventsPresets(payload);
		}

		if (response?.[0]) {
			updateEventspresetData(mode, response?.[1]);
			modifiedCloseModal();
		}
		setInfo((prev) => ({ ...prev, createPresetLoading: false }));
	}, [
		info?.services,
		info?.eventPresetName,
		info?.createPresetLoading,
		mode,
		info?.variableId,
		updateEventspresetData,
	]);

	const modifiedCloseModal = useCallback(() => {
		setInfo(initialState);
		closeModal();
	}, []);

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={modifiedCloseModal}>
			<div className="addPresetModalParentContainer">
				<div className="presetHeaderContainer">
					<span className="createNewEventStyling">Create event preset</span>
					<span onClick={modifiedCloseModal} className="closePresetModalBtn">
						<Close />
					</span>
				</div>
				<div className="createPresetContainer">
					{/* //events Name */}
					<div className="addPresetEventNameContainer">
						<div className="inputLabelContainer">
							<span className="eventNameLabel">Event Name</span>
							{info?.eventPresetNameError ? (
								<span className="errorMessage">Event Preset Name Required!</span>
							) : (
								''
							)}
						</div>
						<input
							className="addpresetInput"
							placeholder="Title"
							value={info?.eventPresetName}
							onChange={(e) =>
								setInfo((prev) => ({
									...prev,
									eventPresetName: e?.target?.value,
									eventPresetNameError: false,
								}))
							}
						/>
					</div>

					{/* //service provided */}
					<div className="addPresetEventNameContainer">
						<div className="inputLabelContainer">
							<span className="eventNameLabel">Services Provided</span>
							{info?.serviceError ? (
								<span className="errorMessage">
									Atleast one service is required
								</span>
							) : (
								''
							)}
						</div>
					</div>
					<div className="presetCardHolder">
						{info?.services?.map((ele, index) => (
							<div className="presetServicesCard" key={index}>
								<input
									className="addpresetInput"
									placeholder="Title"
									value={ele?.type}
									onChange={(e) =>
										servicesOnChange(index, 'serviceName', e.target?.value)
									}
								/>
								<div className="presetservicesIncrementor">
									<span
										className="closePresetModalBtn incrementorButtons"
										onClick={() => servicesOnChange(index, 'decrement')}
									>
										-
									</span>
									<input
										className="incrementorDecrementorInput"
										value={ele?.categories?.[0]?.quantity}
										onChange={(e) =>
											servicesOnChange(
												index,
												'quantity',
												e.target?.value?.trim(),
											)
										}
									/>
									<span
										onClick={() => servicesOnChange(index, 'increment')}
										className="closePresetModalBtn incrementorButtons"
									>
										+
									</span>
								</div>
								<span className="closePresetModalBtn" onClick={removeService}>
									<Close />
								</span>
							</div>
						))}
					</div>

					<span className="addRoleBtn" onClick={addServices}>
						+ Add role
					</span>
					{mode === 'create' ? (
						<div className="createPresetBtn" onClick={createEditPreset}>
							{info?.createPresetLoading ? 'Creating Preset...' : 'Creating Preset'}
						</div>
					) : (
						<div className="createPresetBtn" onClick={createEditPreset}>
							{info?.createPresetLoading ? 'Saving Preset...' : 'Edit Preset'}
						</div>
					)}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AddPresetModal);
