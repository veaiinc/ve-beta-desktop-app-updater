import React, { useContext, useMemo, useEffect, useState, useCallback } from 'react';
import '../../../assets/scss/AccountSettings/publicinformation.scss';
import InputForModules from '../../components/input/inputForModules';
import Context from '../../../context/context';
import jwt_decode from 'jwt-decode';
import validator from 'validator';
import { BusinessTypesOptions } from './indexConstant';
import { Tooltip } from 'antd';
import ToolTipContainer from '../../components/popover/ToolTipContainer';
import { ReactComponent as QuestionMark } from '../../../assets/svg/workflow/questionMark.svg';

const PublicInformation = () => {
	const {
		profileInfo: { tennantSettingsData, updateBusniessName },
		companyInfo: {
			updateTenantContactDetails,
			updateTenantAddress,
			updateTenantWebsite,
			updateTenantBusinessName,
		},
	} = useContext(Context);

	const [error, setErrors] = useState({});
	const [isEditMode, setIsEditMode] = useState({ isValueChanged: false, timeout: null });

	const [overviewState, setOverviewState] = useState({
		phoneNumber: '',
		email: '',
		address: '',
		website: '',
		companyType: '',
		businessName: '',
		isAdmin: '',
		businessLogo: '',
		timeZone: '',
		currency: '',
	});
	const [initialState, setInitialState] = useState({ ...overviewState });
	const [arrow, setArrow] = useState('Show');

	useEffect(() => {
		// if (!tennantSettingsData) {
		// 	getTenantSettings();
		// }
		checkIsAdmin();
	}, []);

	const mergedArrow = useMemo(() => {
		if (arrow === 'Hide') {
			return false;
		}
		if (arrow === 'Show') {
			return true;
		}
		return {
			pointAtCenter: true,
		};
	}, [arrow]);

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

	useEffect(() => {
		handleDebounceSearch('phone');
	}, [overviewState]);

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
		if (!isEditMode?.isValueChanged) {
			setIsEditMode((prev) => ({ ...prev, isValueChanged: true }));
		}
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

	const handleDebounceSearch = useCallback(() => {
		clearInterval(isEditMode?.timeout);
		const timeout = setTimeout(() => {
			if (isEditMode?.isValueChanged) {
				handleSubmit(new Event('submit'));
			}
			setIsEditMode((prev) => ({ ...prev, timeout: null }));
		}, 800);
		setIsEditMode((prev) => ({ ...prev, timeout }));
	}, [isEditMode?.timeout, overviewState]);

	const workspaceId = localStorage.getItem('workspaceId');
	const companyHandle = 'https://' + workspaceId + '.ve.ai';
	return (
		<div className="publicInformationContainer">
			<div className="header">
				<h1>Public Information</h1>

				<span className="svgHolder">
					<Tooltip
						placement="bottomRight"
						title={
							<ToolTipContainer
								// title={'Link Expiry'}
								content="All your business and website details will appear publicly. It helps others identify and connect with your business profile."
							/>
						}
						arrow={mergedArrow}
						color={'#202020'}
						placement={'rightTop'}
					>
						<QuestionMark />
					</Tooltip>
				</span>
			</div>

			<div className="imageCircleDiv">
				<img
					src={'https://randomuser.me/api/portraits/men/75.jpg'}
					alt="logo"
					onError={(e) =>
						(e.target.src = 'https://randomuser.me/api/portraits/men/75.jpg')
					}
				/>

				<div className="editImage">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="15"
						viewBox="0 0 15 14"
						fill="none"
					>
						<path
							d="M3.85354 9.81771H4.41632L9.39683 4.87207L8.83405 4.31323L3.85354 9.25886V9.81771ZM3.19531 10.4713V8.98334L9.4943 2.71878C9.5624 2.64973 9.63569 2.60058 9.71417 2.57134C9.79265 2.54201 9.87489 2.52734 9.96088 2.52734C10.047 2.52734 10.1291 2.54104 10.2073 2.56845C10.2856 2.59585 10.3615 2.64437 10.4348 2.714L11.0025 3.27285C11.0727 3.34567 11.1223 3.42108 11.1515 3.4991C11.1807 3.57711 11.1953 3.65743 11.1953 3.74006C11.1953 3.82813 11.18 3.91218 11.1492 3.9922C11.1184 4.07223 11.0695 4.14539 11.0025 4.21167L4.69379 10.4713H3.19531ZM9.1105 4.59756L8.83405 4.31323L9.39683 4.87207L9.1105 4.59756Z"
							fill="#E8EAED"
						/>
					</svg>
				</div>
			</div>

			<div className="detailsBody">
				<div className="inputDiv">
					<InputForModules
						label={'Business Name'}
						type={'text'}
						placeholder={'Enter your Business Name'}
						name={'businessName'}
						onChange={handleChange}
						value={overviewState?.businessName}
						isError={false}
						errorMessage={''}
					/>
				</div>

				<div className="inputDiv">
					<InputForModules
						label={'Company Email'}
						type={'email'}
						placeholder={overviewState?.companyEmail || ''}
						name={'companyEmail'}
						value={overviewState?.email}
						onChange={handleChange}
						isError={false}
						errorMessage={''}
					/>
				</div>

				<div className="inputDiv">
					<InputForModules
						label={'Website'}
						type={'text'}
						value={overviewState?.website || ''}
						onChange={handleChange}
						placeholder={'https://www.studio.com'}
						name={'website'}
						isError={error?.errorwebsite?.error || false}
						errorMessage={error?.errorwebsite?.message || ''}
					/>
				</div>

				<div className="flex-gap">
					<div className="inputDiv">
						<InputForModules
							label="Company Type"
							type={'text'}
							options={BusinessTypesOptions}
							placeholder="Choose your Company Type"
							name={'CompanyType'}
							value={overviewState?.companyType || ''}
							onChange={handleChange}
							isError={false}
							errorMessage={''}
						/>
					</div>

					<div className="inputDiv">
						<InputForModules
							label={'Phone Number'}
							type={'phoneNumber'}
							onChange={handleChange}
							value={overviewState.phoneNumber || ''}
							placeholder={'Enter your Phone Number'}
							name={'phoneNumber'}
							isError={error?.errorphoneNumber?.error || false}
							errorMessage={error?.errorphoneNumber?.message || ''}
							defaultCountry={'IN'}
						/>
					</div>
				</div>

				<div className="inputDiv">
					<InputForModules
						label={'Address'}
						type={'text'}
						onChange={handleChange}
						value={overviewState.address || ''}
						placeholder={'Enter your Company Address'}
						name={'address'}
						isError={false}
						errorMessage={''}
					/>
				</div>
			</div>
		</div>
	);
};

export default PublicInformation;
