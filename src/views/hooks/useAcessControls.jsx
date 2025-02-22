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
];
const useAccessControls = () => {
	let {
		profileInfo: {
			getTenantUserAccessControls,
			tenantUserAccessControls,
			accessControlOpenModal,
			updateAccessControlOpenModal,
		},
	} = useContext(Context);

	const Location = useLocation();
	useEffect(() => {
		if (!tenantUserAccessControls) {
			getTenantUserAccessControls();
		}
	}, [tenantUserAccessControls]);
	useEffect(() => {
		if (
			tenantUserAccessControls?.role !== 'admin' &&
			tenantUserAccessControls?.accessControls
		) {
			const currentPath = Location.pathname.split('/')[1];
			const matchedLocation = updatedLocation.find((loc) => loc.title === currentPath);

			if (matchedLocation) {
				const appAccess = tenantUserAccessControls.accessControls.find(
					(app) => app.app === matchedLocation.value,
				);

				if (appAccess && !appAccess.isEnabled) {
					updateAccessControlOpenModal({ accessControlOpenModal: true });
				} else {
					updateAccessControlOpenModal({ accessControlOpenModal: false });
				}
			} else {
				updateAccessControlOpenModal({ accessControlOpenModal: false });
			}
		} else {
			updateAccessControlOpenModal({ accessControlOpenModal: false });
		}
	}, [Location.pathname, tenantUserAccessControls]);
	return { accessControlOpenModal };
};

export default useAccessControls;
