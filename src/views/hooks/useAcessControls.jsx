import React, { useContext, useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';
import Context from '../../context/context';

const updatedLocation = [
	{ id: 1, title: 'docs', value: 'workflow' },
	{ id: 2, title: 'galleries', value: 'classicGallery' },
	{ id: 3, title: 'lite-gallery', value: 'liteGallery' },
	{ id: 4, title: 'ai-assistant', value: 'conversationalAgent' },
	{ id: 5, title: 'calendar', value: 'calendar' },
	{ id: 6, title: 'my-templates', value: 'template' },
	{ id: 7, title: 'tasks', value: 'task' },
	{ id: 8, title: 'forms', value: 'form' },
	{ id: 9, title: 'contact', value: 'contact' },
];
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

		// Extract current path and match it with updatedLocation
		const currentPath = location?.pathname?.split('/')[1];
		const matchedLocation = updatedLocation?.find((loc) => loc?.title === currentPath);

		if (!matchedLocation) {
			return updateAccessControlOpenModal({ accessControlOpenModal: false });
		}

		// Find app access control for the matched location
		const appAccess = tenantUserAccessControls?.accessControls?.find(
			(app) => app?.app === matchedLocation?.value,
		);

		// Set modal state based on app access
		updateAccessControlOpenModal({
			accessControlOpenModal: appAccess ? !appAccess?.isEnabled : false,
		});
	}, [location?.pathname, tenantUserAccessControls]);

	return { accessControlOpenModal };
};

export default useAccessControls;
