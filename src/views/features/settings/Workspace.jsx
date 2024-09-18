import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/AccountSettings/workspacesection.scss';
import jwt_decode from 'jwt-decode';
import InputForModules from '../../components/input/inputForModules';
import { BusinessTypesOptions } from './indexConstant';
import Context from '../../../context/context';
import validator from 'validator';
import { ReactComponent as GlobeSettings } from '../../../assets/svg/workspaceSettings/globeSettings.svg';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import { getBuisnessName } from '../profile_settings/getInitials';
import {
	DeleteWorkpsaceComponent,
	TimeZoneCurrencyComponent,
	WorkspaceHandleComponent,
} from '../../components/settings/SettingsWorkspace';

const SettingsWorkspace = () => {
	const {
		profileInfo: { getTenantSettings, tennantSettingsData, updateBusniessName },
		companyInfo: {
			updateTenantContactDetails,
			updateTenantAddress,
			updateTenantWebsite,
			updateTenantBusinessName,
		},
	} = useContext(Context);

	const [error, setErrors] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);

	const [overviewState, setOverviewState] = useState({
		phoneNumber: '',
		email: '',
		address: '',
		website: '',
		businessName: '',
		isAdmin: '',
		businessLogo: '',
		timeZone: '',
		currency: '',
	});
	const [initialState, setInitialState] = useState({ ...overviewState });

	useEffect(() => {
		// if (!tennantSettingsData) {
		// 	getTenantSettings();
		// }
		checkIsAdmin();
	}, []);

	const checkIsAdmin = () => {
		let usertoken = localStorage.getItem('usertoken');
		let decoded = jwt_decode(usertoken);
		let workspaceID = localStorage.getItem('workspaceId');
		let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`));

		setOverviewState((prev) => ({
			...prev,
			isAdmin: role === 'admin',
		}));
	};

	useEffect(() => {
		setOverviewState((prev) => ({
			...prev,
			email: tennantSettingsData?.email || '',
			phoneNumber: tennantSettingsData?.phoneNumber || '',
			address: tennantSettingsData?.address || '',
			website: tennantSettingsData?.website || '',
			businessName: tennantSettingsData?.businessName || '',
			timeZone: tennantSettingsData?.locationDetails?.timezone,
			currency: tennantSettingsData?.locationDetails?.currency,
			businessLogo: tennantSettingsData?.logo_s3_500w_key || '',
		}));
		setInitialState((prev) => ({
			...prev,
			email: tennantSettingsData?.email || '',
			phoneNumber: tennantSettingsData?.phoneNumber || '',
			address: tennantSettingsData?.address || '',
			website: tennantSettingsData?.website || '',
			businessName: tennantSettingsData?.businessName || '',
		}));
	}, [tennantSettingsData]);

	const validateField = (fieldName, value) => {
		let Value = value || '';
		switch (fieldName) {
			case 'email':
				if (!validator.isEmail(Value) && initialState.email !== overviewState.email) {
					return { error: true, message: 'Invalid Email' };
				}
				break;
			case 'phoneNumber':
				if (
					!validator.isMobilePhone(Value, 'any', { strictMode: true }) &&
					initialState.phoneNumber !== overviewState.phoneNumber
				) {
					return { error: true, message: 'Phone Number is invalid' };
				}
				break;
			case 'website':
				if (
					!validator.isURL(Value, {
						protocols: ['http', 'https'],
						require_protocol: true,
					}) &&
					initialState.website !== overviewState.website
				) {
					return {
						error: true,
						message: 'Invalid Website URL. example: https://www.website.com',
					};
				}
				break;
			default:
				if (validator.isEmpty(Value)) {
					// return { error: true, message: 'This field is required' };
					return '';
				}
				break;
		}
		return '';
	};
	const validate = () => {
		const newErrors = {};
		Object.keys(overviewState).forEach((key) => {
			const error = validateField(key, overviewState[key]);

			if (error) {
				newErrors['error' + key] = error;
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const updateDetails = () => {
		let contactJson = {};
		if (initialState.email !== overviewState.email) {
			contactJson.email = overviewState.email;
		}
		if (initialState.phoneNumber !== overviewState.phoneNumber) {
			contactJson.phoneNumber = overviewState.phoneNumber;
		}

		if (Object.keys(contactJson).length) {
			// pass the contantjson
			updateTenantContactDetails(contactJson);
		}
		if (initialState.address !== overviewState.address && overviewState.address.length) {
			let json = { address: overviewState.address };
			updateTenantAddress(json);
		}
		if (initialState.website !== overviewState.website && overviewState.website.length) {
			let json = { websiteUrl: overviewState.website };
			updateTenantWebsite(json);
		}
		if (
			initialState.businessName !== overviewState.businessName &&
			overviewState.businessName.length
		) {
			let json = { businessName: overviewState.businessName };
			updateBusniessName(overviewState.businessName);
			updateTenantBusinessName(json);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			updateDetails();

			setIsEditMode(false);
		}
	};

	const handleChange = (e) => {
		const { name, value = '' } = e.target;

		const error = validateField(name, value);
		setErrors({
			...error,
			['error' + name]: error,
		});
		setOverviewState((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	const handleEdit = () => {
		if (isEditMode) {
			handleSubmit(new Event('submit'));
		} else {
			setIsEditMode(true);
		}
		// setIsEditMode(!isEditMode);
	};
	const workspaceId = localStorage.getItem('workspaceId');
	const companyHandle = 'https://' + workspaceId + '.ve.ai';
	return (
		<div className="workspaceContainer">
			<div className="workspaceHandleComponent">
				<WorkspaceHandleComponent />
			</div>

			<div className="timezoneCurrencyComponent">
				<TimeZoneCurrencyComponent overviewState={overviewState} />
			</div>

			<div className="deleteWorkpsaceComponent">
				<DeleteWorkpsaceComponent />
			</div>
		</div>
	);
};

export default SettingsWorkspace;
