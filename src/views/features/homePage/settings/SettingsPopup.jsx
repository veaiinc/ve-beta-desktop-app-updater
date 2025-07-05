import { memo, useEffect, useState } from 'react';
import ReactModal from '../../../components/modalsV2';
import SettingsComponent from './settingsComponent/SettingsComponent';
import EditCategory from './editCategory/EditCategory';

const initalState = {
	currentComponent: 'settings',
}

const SettingsPopup = ({ isOpen, handleClose }) => {
	const [info, setInfo] = useState(initalState);

	useEffect(() => {
		setInfo(initalState)
	} ,[])

	function handleComponentChange(component) {
		setInfo((prev) => ({
			...prev,
			currentComponent: component,
		}));
	};

	const componentMapper = {
		settings: (
			<SettingsComponent
				handleClose={handleClose}
				handleComponentChange={handleComponentChange}
			/>
		),
		editCategory: (
			<EditCategory handleClose={handleClose} handleComponentChange={handleComponentChange} />
		),
	};

	return (
		<ReactModal isOpen={isOpen} modalType={'center'}>
			{componentMapper[info.currentComponent]}
		</ReactModal>
	);
};

export default memo(SettingsPopup);
