import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Context from '../context/context';

const locationMapper = {
	docs: 'workflow',
	galleries: 'classicGallery',
	'lite-gallery': 'liteGallery',
	'ai-assistant': 'conversationalAgent',
	'my-templates': 'template',
	forms: 'form',
	contacts: 'contact',
	automation: 'automation',
};

const useAccessControls = () => {
	const [info, setInfo] = useState({
		accessControlsLoading: true,
	});

	const {
		profileInfo: {
			getTenantUserAccessControls,
			tenantUserAccessControls,
			accessControlOpenModal,
			updateAccessControlOpenModal,
		},
	} = useContext(Context);

	const location = useLocation();

	const fetchTenantUserAccessControls = async () => {
		await getTenantUserAccessControls();
		setInfo((prev) => ({
			...prev,
			accessControlsLoading: false,
		}));
	};

	useEffect(() => {
		if (!tenantUserAccessControls) {
			fetchTenantUserAccessControls();
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
		const matchedLocation = locationMapper?.[currentPath];

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

	const { accessControlsLoading } = info;
	return { accessControlOpenModal, accessControlsLoading };
};

export default useAccessControls;
