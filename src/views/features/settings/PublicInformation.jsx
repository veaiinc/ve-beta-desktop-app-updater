import React, { useContext, useMemo, useEffect, useState, useCallback, memo } from 'react';
import '../../../assets/scss/settings/publicinformation.scss';
import InputForModules from '../../components/input/inputForModules';
import Context from '../../../context/context';
import jwt_decode from 'jwt-decode';
import validator from 'validator';
import { businessTypesOptions } from './indexConstant';
import { Tooltip } from 'antd';
import ToolTipContainer from '../../components/popover/ToolTipContainer';
import { ReactComponent as QuestionMark } from '../../../assets/svg/workflow/questionMark.svg';
import { ReactComponent as EditSvg } from '../../../assets/svg/Settings/pencilwhite.svg';
import { ReactComponent as CloudFileUploadSvg } from '../../../assets/svg/Settings/CloudUpload.svg';
import Dropzone from 'react-dropzone';

const PublicInformation = () => {
	// Context
	const {
		profileInfo: { tennantSettingsData, updateCompanyDetailsState, changelogo },
		companyInfo: {
			updateTenantContactDetails,
			updateTenantAddress,
			updateTenantWebsite,
			updateTenantBusinessName,
			uploadTenantLogo,
		},
	} = useContext(Context);

	// useStates
	const [error, setErrors] = useState({});
	const [logoUrl, setLogoUrl] = useState('');
	const [arrow, setArrow] = useState('Show');
	const [isEditMode, setIsEditMode] = useState({ isValueChanged: false, timeout: null });
	const [overviewState, setOverviewState] = useState({
		phoneNumber: '',
		email: '',
		address: '',
		website: '',
		businessType: '',
		businessName: '',
		isAdmin: '',
		businessLogo: '',
	});
	const [initialState, setInitialState] = useState({ ...overviewState });

	// useEffects
	useEffect(() => {
		setOverviewState((prev) => ({
			...prev,
			email: tennantSettingsData?.email || '',
			phoneNumber: tennantSettingsData?.phoneNumber || '',
			address: tennantSettingsData?.address || '',
			website: tennantSettingsData?.website || '',
			businessName: tennantSettingsData?.businessName || '',
			businessLogo: tennantSettingsData?.logo_s3_500w_key || '',
			businessType: tennantSettingsData?.businessType || '',
		}));
		setInitialState((prev) => ({
			...prev,
			email: tennantSettingsData?.email || '',
			phoneNumber: tennantSettingsData?.phoneNumber || '',
			address: tennantSettingsData?.address || '',
			website: tennantSettingsData?.website || '',
			businessName: tennantSettingsData?.businessName || '',
			businessType: tennantSettingsData?.businessType || '',
		}));
		setLogoUrl(tennantSettingsData?.logo_s3_500w_key || '');
	}, [tennantSettingsData]);

	useEffect(() => {
		handleDebounceSearch('phone');
	}, [overviewState]);

	// functions

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
		let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded?.user_id}`));

		setOverviewState((prev) => ({
			...prev,
			isAdmin: role === 'admin',
		}));
	};

	const validateField = (fieldName, value) => {
		let Value = value || '';
		switch (fieldName) {
			case 'email':
				if (!validator.isEmail(Value) && initialState?.email !== overviewState?.email) {
					return { error: true, message: 'Invalid Email' };
				}
				break;
			case 'phoneNumber':
				if (
					!validator.isMobilePhone(Value, 'any', { strictMode: true }) &&
					initialState?.phoneNumber !== overviewState?.phoneNumber
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
					initialState?.website !== overviewState?.website
				) {
					return {
						error: true,
						message: 'Invalid URL: for eg https://www.website.com',
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
		if (initialState?.email !== overviewState?.email) {
			contactJson.email = overviewState.email;
		}

		if (initialState?.phoneNumber !== overviewState?.phoneNumber) {
			contactJson.phoneNumber = overviewState.phoneNumber;
		}

		if (Object.keys(contactJson).length) {
			updateCompanyDetailsState(contactJson);
			updateTenantContactDetails(contactJson);
		}

		if (initialState.address !== overviewState.address && overviewState?.address?.length) {
			let json = { address: overviewState.address };
			updateCompanyDetailsState(json);
			updateTenantAddress(json);
		}

		if (initialState.website !== overviewState.website && overviewState?.website?.length) {
			let json = { websiteUrl: overviewState.website };
			updateCompanyDetailsState({ website: overviewState.website });
			updateTenantWebsite(json);
		}

		if (
			initialState?.businessName !== overviewState?.businessName &&
			overviewState.businessName.length
		) {
			let json = { businessName: overviewState.businessName };
			updateCompanyDetailsState(json);
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

	const checkUploadLogo = (acceptedFiles) => {
		const file = acceptedFiles[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			setLogoUrl(reader.result);
			changelogo(reader?.result);
		};

		reader.readAsDataURL(file);
		uploadTenantLogo(file);
	};

	return (
		<div className="settingsBoxContainer publicInformationComponent">
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

			{logoUrl ? (
				<Dropzone
					onDrop={checkUploadLogo}
					accept={'image/png'}
					multiple={false}
					// disabled={!isAdmin}
				>
					{({ getRootProps, getInputProps }) => (
						<div className="upload-brand-embeded-btn" {...getRootProps()}>
							<input {...getInputProps()} />

							<div className="imageCircleDiv">
								<img src={logoUrl} alt="logo" />
								<div className="editImage">
									<EditSvg />
								</div>
							</div>
						</div>
					)}
				</Dropzone>
			) : (
				<Dropzone
					onDrop={checkUploadLogo}
					accept={'image/png'}
					multiple={false}
					// disabled={!isAdmin}
				>
					{({ getRootProps, getInputProps }) => (
						<div
							className="upload-brand-embeded-btn"
							{...getRootProps()}
							// style={{ cursor: !isAdmin ? 'not-allowed' : '' }}
						>
							<input {...getInputProps()} />
							<div className="upload-brand-placeholder">
								<input
									type="file"
									style={{
										opacity: 0,
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%',
										cursor: 'pointer',
									}}
								/>
								<div className="icon_name_div">
									{' '}
									<CloudFileUploadSvg />
									<p>Upload image</p>
								</div>
							</div>
						</div>
					)}
				</Dropzone>
			)}

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
						key={'businessname'}
					/>
				</div>

				<div className="inputDiv">
					<InputForModules
						label={'Company Email'}
						type={'email'}
						placeholder={overviewState?.email || ''}
						name={'email'}
						value={overviewState?.email}
						onChange={handleChange}
						isError={error?.erroremail?.error || false}
						errorMessage={error?.erroremail?.message || ''}
						key={'businessemail'}
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
						key={'businesswebsite'}
					/>
				</div>

				<div className="flex-gap">
					<div className="inputDiv">
						<InputForModules
							label="Company Type"
							type={'dropdown'}
							options={businessTypesOptions}
							placeholder="Choose your Company Type"
							name={'businessName'}
							value={overviewState?.businessType || ''}
							onChange={handleChange}
							isError={false}
							disabled={true}
							errorMessage={''}
							key={'businessType'}
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
							key={'businessphone'}
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
						key={'businessaddress'}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(PublicInformation);
