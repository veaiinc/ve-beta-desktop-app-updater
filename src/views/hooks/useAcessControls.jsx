import React, { useContext, useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';
import Context from '../../context/context';

const locationMapper = {
	docs: 'workflow',
	galleries: 'classicGallery',
	'lite-gallery': 'liteGallery',
	'ai-assistant': 'conversationalAgent',
	calendar: 'calendar',
	'my-templates': 'template',
	tasks: 'task',
	forms: 'form',
	contacts: 'contact',
	automation: 'automation',
};

const useAccessControls = () => {
	const {
		profileInfo: {
			getTenantUserAccessControls,
			tenantUserAccessControls,
			accessControlOpenModal,
			updateAccessControlOpenModal,
		},
	} = useContext(Context);

	const location = useLocation();

	useEffect(() => {
		if (!tenantUserAccessControls) {
			getTenantUserAccessControls();
		}
	}, [tenantUserAccessControls]);

	useEffect(() => {
		if (
			tenantUserAccessControls?.role === 'admin' ||
			!tenantUserAccessControls?.accessControls
		) {
			return updateAccessControlOpenModal({ accessControlOpenModal: false });
		}
		const currentPath = location?.pathname?.split('/')[1];
		const matchedLocation = locationMapper[currentPath];

		if (!matchedLocation) {
			return updateAccessControlOpenModal({ accessControlOpenModal: false });
		}
		const appAccess = tenantUserAccessControls?.accessControls?.find(
			(app) => app?.app === matchedLocation,
		);
		const shouldOpenModal = !appAccess || !appAccess?.isEnabled;
		updateAccessControlOpenModal({
			accessControlOpenModal: shouldOpenModal,
		});
	}, [location?.pathname, tenantUserAccessControls]);

	return { accessControlOpenModal };
};

export default useAccessControls;
