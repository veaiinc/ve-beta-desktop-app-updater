import { useState, memo, useMemo, useContext } from 'react';
import './guideMePopup.scss';
import ReactModal from '../../components/modalsV2';
import GuideMePreference from './guideMePreference';
import GuideMeAgenda from './guideMeAgenda';
import GuideMeKnowledge from './guideMeKnowledge';
import Context from '../../../context/context';
import { message } from '../../components/globalComponents/CustomToast';

const selectableOptions = [
	{ id: 1, title: 'Preference', value: 'preference' },
	// { id: 2, title: 'Agenda', value: 'agenda' },
	// { id: 3, title: 'Knowledge base', value: 'knowledgeBase' },
];

const GuideMePopup = ({ isOpen, onClose }) => {
	const {
		notes: { updateMeetingPreferences },
	} = useContext(Context);
	const [info, setInfo] = useState({
		mode: 'Sales Mode',
		selectedOption: 'preference',
	});
	const [preferencesData, setPreferencesData] = useState(null);

	const handleUpdatePreferences = async () => {
		if (!preferencesData) return;

		try {
			const { thresholdValue, enabledFeatures, allPreferences, meetingType } =
				preferencesData;

			// Update the current meeting type preferences in allPreferences
			const updatedAllPreferences = {
				...allPreferences,
				[meetingType]: {
					threshold: thresholdValue,
					askUser: enabledFeatures.smartQuestions,
					needHelp: enabledFeatures.instantAnswers,
					actions: enabledFeatures.actionSuggestions,
					similarFiles: enabledFeatures.contextFilePulls,
				},
			};

			const payload = {
				preferenceType: 'meetingPreference',
				data: updatedAllPreferences,
			};

			const response = await updateMeetingPreferences(payload);
			if (response) {
				message.success('Meeting preferences updated successfully');
				onClose();
			}
		} catch (error) {
			console.error('Error updating meeting preferences:', error);
		}
	};

	const handlePreferencesUpdate = (data) => {
		setPreferencesData(data);
	};

	const Component = useMemo(() => {
		switch (info.selectedOption) {
			case 'preference':
				return (
					<GuideMePreference
						mode={info.mode}
						onUpdatePreferences={handlePreferencesUpdate}
					/>
				);
			// case 'agenda':
			// 	return <GuideMeAgenda />;
			// case 'knowledgeBase':
			// 	return <GuideMeKnowledge />;
			default:
				return null;
		}
	}, [info.selectedOption, info.mode]);

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType="center"
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="guideMePopupMainContainer">
				<div className="guideMePopupMainContainerHeader">
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Sales Mode' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Sales Mode' }))}
					>
						Sales Mode
					</button>
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Support' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Support' }))}
					>
						Support
					</button>
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Interviewer' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Interviewer' }))}
					>
						Interviewer
					</button>
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Ideas' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Ideas' }))}
					>
						Ideas
					</button>
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Meeting' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Meeting' }))}
					>
						Meeting
					</button>
				</div>
				<div className="guideMePopupMainContainerBody">
					<div className="guideMeOptionsContainer">
						{selectableOptions.map((item) => (
							<div
								key={item.id}
								className={`guideMeOptionsContainerButton${
									info.selectedOption === item.value ? ' active' : ''
								}`}
								onClick={() =>
									setInfo((prev) => ({ ...prev, selectedOption: item.value }))
								}
							>
								{item.title}
							</div>
						))}
					</div>
					<div className="guideMePopupMainContainerBodyComponent">{Component}</div>
				</div>
				<div className="guideMePopupMainContainerFooter">
					<button className="guideMePopupButton" onClick={handleUpdatePreferences}>
						Update Preferences
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(GuideMePopup);
