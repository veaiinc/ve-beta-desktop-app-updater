/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import AddPresetModal from './AddPresetModal';
import Context from '../../../../context/context';
import { message, Tooltip } from 'antd';
import { ReactComponent as ThreeDots } from '../../../../assets/svg/workflow/threeDots.svg';
import Spinner from '../../loaders/Spinner';

const initialState = {
	createEditPresetModal: false,
	presetData: [],
	loading: true,
	selectedEventsPresetData: null,
	threeDotsPopUp: {},
	mode: 'create', //create ,edit
	updatePresetLoading: {},
};

const EventsPresetsPopOverComponent = ({ closePresetPopUp }) => {
	let {
		templates: { getEventsPresets, eventsPresetData, deleteEventsPreset, addEventsPresets },
	} = useContext(Context);
	const [info, setInfo] = useState({
		...initialState,
	});

	//useEffects
	useEffect(() => {
		getEventsPresetsData();
	}, []);

	useEffect(() => {
		if (eventsPresetData) {
			let presetData = [];
			for (let i = 0; i < eventsPresetData?.data?.length; i++) {
				let presetDataObj = { ...(eventsPresetData?.data?.[i] || {}) };
				let subtitleString = '';
				const presetDataInfo = eventsPresetData?.data?.[i]?.eventTableValues || [];

				for (let j = 0; j < presetDataInfo?.length; j++) {
					subtitleString +=
						'' +
						presetDataInfo?.[j]?.categories?.[0]?.quantity +
						' ' +
						presetDataInfo?.[j]?.categories?.[0]?.category;
				}
				presetDataObj.subtitleString = subtitleString;
				presetData?.push(presetDataObj);
			}

			setInfo((prev) => ({ ...prev, presetData, loading: false }));
		}
	}, [eventsPresetData]);

	//function definations
	const getEventsPresetsData = useCallback(async () => {
		const params = {
			page: 1,
			limit: 50,
			sortBy: 'createdAt',
			sortType: -1,
			subType: 'event_table',
		};
		getEventsPresets(params);
	}, []);

	const openCreateEditPresetModal = useCallback(() => {
		modifiedClosePopUp();
		setInfo((prev) => ({ ...prev, createEditPresetModal: true, mode: 'create' }));
	}, []);

	const closeCreateEditPresetModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, createEditPresetModal: false }));
	}, []);

	const closeThreeDotsPopup = useCallback((index) => {
		setInfo((prev) => ({
			...prev,
			threeDotsPopUp: {
				...prev.threeDotsPopUp,
				[index]: false,
			},
		}));
	}, []);

	const modifiedClosePopUp = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			...initialState,
			loading: false,
			presetData: prev?.presetData,
		}));
		closePresetPopUp();
	}, [info?.presetData]);

	const deletePreset = useCallback(
		async (_id, index) => {
			if (info?.updatePresetLoading?.[index]) {
				return;
			}
			setInfo((prev) => ({
				...prev,
				updatePresetLoading: { ...prev.updatePresetLoading, [index]: true },
				threeDotsPopUp: false,
			}));

			const response = await deleteEventsPreset(_id);
			if (response?.[0]) {
				const presetData = [...(info?.presetData || [])];
				presetData.splice(index, 1);
				setInfo((prev) => ({
					...prev,
					presetData,
					updatePresetLoading: { ...prev.updatePresetLoading, [index]: false },
				}));
				message.success('Preset deleted successfully');
				return;
			}
			setInfo((prev) => ({
				...prev,
				updatePresetLoading: { ...prev.updatePresetLoading, [index]: false },
			}));
		},
		[info?.updatePresetLoading, info?.presetData],
	);

	const duplicatePreset = useCallback(
		async (data, index) => {
			if (info?.updatePresetLoading?.[index]) {
				return;
			}

			setInfo((prev) => ({
				...prev,
				updatePresetLoading: { ...prev.updatePresetLoading, [index]: true },
				threeDotsPopUp: false,
			}));
			const { displayName = '', eventTableValues = [] } = data;
			const payload = {
				displayName,
				inputType: 'event_services',
				eventTableValues,
				subType: 'event_table',
			};
			const response = await addEventsPresets(payload);

			if (response?.[0]) {
				const presetData = [...(info?.presetData || [])];
				let obj = response?.[1] || {};
				let presetInfo = obj?.eventTableValues || [];
				let subtitleString = '';
				for (let j = 0; j < presetInfo?.length; j++) {
					subtitleString +=
						'' +
						presetInfo?.[j]?.categories?.[0]?.quantity +
						' ' +
						presetInfo?.[j]?.categories?.[0]?.category;
				}
				obj.subtitleString = subtitleString;

				presetData.unshift(obj);
				setInfo((prev) => ({
					...prev,
					presetData,
					updatePresetLoading: { ...prev.updatePresetLoading, [index]: false },
				}));
				message.success('Presets Updated successfully');
				return;
			}
			setInfo((prev) => ({
				...prev,
				updatePresetLoading: { ...prev.updatePresetLoading, [index]: false },
			}));
		},
		[info?.updatePresetLoading, info?.presetData],
	);

	const setSelectedEventsPreset = useCallback(
		(data, type, index) => {
			if (type === 'edit') {
				openCreateEditPresetModal();
				setInfo((prev) => ({
					...prev,
					selectedEventsPresetData: data,
					mode: 'edit',
					threeDotsPopUp: false,
				}));
				return;
			}
			if (type === 'delete') {
				const { _id } = data;
				deletePreset(_id, index);
			}
			if (type === 'duplicate') {
				duplicatePreset(data, index);
			}
		},
		[info?.selectedEventsPresetData, deletePreset],
	);

	return (
		<div className="eventsPresetsParentContainer">
			<div className="addNewPresetButton" onClick={openCreateEditPresetModal}>
				+ Add new preset
			</div>
			<div className="definedPresetContainer">
				{info?.presetData?.map((ele, index) => (
					<div className="presetCards" key={index}>
						<div className="presetCardContentContainer">
							<span className="presetTitle">{ele?.displayName}</span>
							<span className="presetSubTitle">
								{ele?.subtitleString || ''}
								{/* Wedding Basics 2 Candid photographer , 2 traditional photographer */}
							</span>
						</div>
						{info?.updatePresetLoading?.[index] ? (
							<Spinner width={'12px'} height={'12px'} />
						) : (
							<Tooltip
								placement="bottomRight"
								title={
									<ThreeDotsPopUp
										data={ele}
										setSelectedEventsPreset={setSelectedEventsPreset}
										index={index}
									/>
								}
								color={'#202020'}
								arrow={false}
								trigger="click"
								overlayClassName="toolTipContainer"
								open={info?.threeDotsPopUp?.[index]}
								onOpenChange={(open) => {
									if (!open) {
										closeThreeDotsPopup(index);
									}
								}}
							>
								<div
									className="threeDotsButton"
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											threeDotsPopUp: {
												...prev.threeDotsPopUp,
												[index]: true,
											},
										}))
									}
								>
									<ThreeDots />
								</div>
							</Tooltip>
						)}
					</div>
				))}
			</div>
			<AddPresetModal
				modalIsOpen={info?.createEditPresetModal}
				closeModal={closeCreateEditPresetModal}
				mode={info?.mode}
				selectedEventsPresetData={info?.selectedEventsPresetData}
			/>
		</div>
	);
};

const ThreeDotsPopUp = ({ setSelectedEventsPreset, data, index }) => {
	const optionOnClick = useCallback((type) => {
		if (type === 'edit') {
			setSelectedEventsPreset(data, 'edit');
		}
		if (type === 'delete') {
			setSelectedEventsPreset(data, 'delete', index);
		}
		if (type === 'duplicate') {
			setSelectedEventsPreset(data, 'duplicate', index);
		}
	}, []);

	return (
		<div className="threeDotsPopupContainer">
			<div className="threeDotOptionsContainer">
				<span className="optionsStyling">Make Default</span>
			</div>
			<div className="threeDotOptionsContainer" onClick={() => optionOnClick('edit')}>
				<span className="optionsStyling">Edit</span>
			</div>
			<div className="threeDotOptionsContainer" onClick={() => optionOnClick('duplicate')}>
				<span className="optionsStyling">Duplicate</span>
			</div>
			<div className="threeDotOptionsContainer" onClick={() => optionOnClick('delete')}>
				<span className="optionsStyling deleteStyling">Delete</span>
			</div>
		</div>
	);
};

export default memo(EventsPresetsPopOverComponent);
