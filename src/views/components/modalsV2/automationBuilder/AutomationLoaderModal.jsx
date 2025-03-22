import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';
import Spinner from '../../loaders/Spinner';
import '../../../../assets/scss/automation_builder/automationLoaderModal.scss';

const AutomationLoaderModal = ({ loading, message = 'Creating automation...' }) => {
	return (
		<ReactModal isOpen={loading} customStyles={{ overlay: { zIndex: 1001 } }}>
			<div className="automation-loader-modal">
				<div className="automation-loader-modal__content">
					<div className="automation-loader-modal__content__title">{message}</div>
					<Spinner color="#0c0c0d" />
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(AutomationLoaderModal);
