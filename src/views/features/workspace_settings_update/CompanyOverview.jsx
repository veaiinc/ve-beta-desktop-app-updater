import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/CompanySettings/overview.scss';
import jwt_decode from 'jwt-decode';
import InputForModules from '../../components/input/inputForModules';
import { BusinessTypesOptions } from './BusinessTypes';
import Context from '../../../context/context';
import validator from 'validator';
import { ReactComponent as GlobeSettings } from '../../../assets/svg/workspaceSettings/globeSettings.svg';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';

const CompanyOverview = () => {
	const {
		profileInfo: { getTenantSettings, tennantSettingsData },
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
	});
	const [initialState, setInitialState] = useState({ ...overviewState });

	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
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
		setOverviewState({
			email: tennantSettingsData?.email || '',
			phoneNumber: tennantSettingsData?.phoneNumber || '',
			address: tennantSettingsData?.address || '',
			website: tennantSettingsData?.website || '',
			businessName: tennantSettingsData?.businessName || '',
		});
		setInitialState({
			email: tennantSettingsData?.email || '',
			phoneNumber: tennantSettingsData?.phoneNumber || '',
			address: tennantSettingsData?.address || '',
			website: tennantSettingsData?.website || '',
			businessName: tennantSettingsData?.businessName || '',
		});
	}, [tennantSettingsData]);

	const validateField = (fieldName, value) => {
		switch (fieldName) {
			case 'email':
				if (!validator.isEmail(value) && initialState.email !== overviewState.email) {
					return { error: true, message: 'Invalid Email' };
				}
				break;
			case 'phoneNumber':
				if (
					!validator.isMobilePhone(value, 'any', { strictMode: true }) &&
					initialState.phoneNumber !== overviewState.phoneNumber
				) {
					return { error: true, message: 'Phone Number is invalid' };
				}
				break;
			case 'website':
				if (
					!validator.isURL(value, {
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
				if (validator.isEmpty(value)) {
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
		<div className="overviewContainer">
			<div className="workspaceHandle">
				<div>
					<h1>Workspace Handle</h1>
					<p>Upgrade Your Web Presence: Switch to Your Custom Domain</p>
				</div>
				<div className="workspaceInputContainer">
					<InputForModules
						label={'Company Handle'}
						type={'text'}
						placeholder={companyHandle}
						name={'companyHandle'}
						value={''}
						// onChange={handleChange}
						isError={false}
						errorMessage={''}
						disabled={true}
					/>
					<InputForModules
						label={'Company Type'}
						type={'dropdown'}
						options={BusinessTypesOptions}
						placeholder={'Choose your Company Type'}
						name={'CompanyType'}
						value={''}
						// onChange={handleChange}
						isError={false}
						errorMessage={''}
					/>
					<InputForModules
						label={'Company Email'}
						type={'email'}
						placeholder={overviewState.companyEmail}
						name={'companyEmail'}
						value={overviewState.email}
						// onChange={handleChange}
						isError={false}
						errorMessage={''}
						disabled={true}
					/>

					<button>Add your own Domain</button>
				</div>
			</div>

			<div className="business">
				<div className="businessHeadding">
					<div className="HeaddingContainer">
						<h1>Business Communications</h1>
						<h3>This will be your client facing address for all your Documents</h3>
					</div>
					<p
						className={`${'editButton'} ${isEditMode ? 'activeEdit' : ''}`}
						onClick={handleEdit}
					>
						{isEditMode ? 'Save Changes' : 'Edit'}
					</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className={`${'businessDetailsForm'} ${isEditMode ? 'activeInput' : ''}`}>
						<div className="businessImgName">
							{overviewState.businessLogo ? (
								<div className="businessImgContainerMain">
									<input
										type="file"
										id="businessPicture"
										name="businessPicture"
										style={{ display: 'none' }}
									/>
									<label htmlFor="businessPicture">
										{/* <img
                                    src={formData.profilePicture || defaultPic}
                                    alt="Profile"
                                    style={{ cursor: isEditMode ? 'pointer' : 'default' }}
                                /> */}
									</label>
								</div>
							) : (
								''
							)}
							<div className={'businessName'}>
								<InputForModules
									label={'Business Name'}
									type={'text'}
									placeholder={'Enter your Business Name'}
									name={'businessName'}
									onChange={handleChange}
									value={overviewState.businessName}
									isError={false}
									errorMessage={''}
									disabled={!isEditMode}
								/>
							</div>
						</div>
						<InputForModules
							label={'Company Email'}
							type={'email'}
							value={overviewState.email}
							onChange={handleChange}
							placeholder={'business@email.com'}
							name={'email'}
							isError={error?.erroremail?.error || ''}
							errorMessage={error?.erroremail?.message || ''}
							disabled={!isEditMode}
						/>
						<InputForModules
							label={'Phone Number'}
							type={'phoneNumber'}
							onChange={handleChange}
							value={overviewState.phoneNumber}
							placeholder={'Enter your Phone Number'}
							name={'phoneNumber'}
							isError={error?.errorphoneNumber?.error || false}
							errorMessage={error?.errorphoneNumber?.message || ''}
							disabled={!isEditMode}
						/>

						<InputForModules
							label={'Address'}
							type={'text'}
							onChange={handleChange}
							value={overviewState.address}
							placeholder={'Enter your Company Address'}
							name={'address'}
							isError={false}
							errorMessage={''}
							disabled={!isEditMode}
						/>
						<InputForModules
							label={'Website'}
							type={'text'}
							value={overviewState.website}
							onChange={handleChange}
							placeholder={'https://www.studio.com'}
							name={'website'}
							isError={error?.errorwebsite?.error || false}
							errorMessage={error?.errorwebsite?.message || ''}
							disabled={!isEditMode}
						/>
					</div>
				</form>
			</div>
			<div className="timeZone">
				<div className="timeZoneHeadding">
					<h1>Time Zone</h1>
					<p>
						Your email send times, account data, and analytics information will be
						displayed in the timezone you select below.
					</p>
				</div>
				{/* Options container for the time zone */}
				<div>
					<ReusableButtonSettings
						text={'India, Sri Lanka time'}
						icon={<GlobeSettings />}
						downArrow={true}
						// func={() => this.setState({ timeZonePickerPopup: true })}
					/>
				</div>
			</div>
			<div className="currency">
				<div className="currencyheadding">
					<h1>Currency</h1>
					<p>
						Note that once selected, the currency symbol will change, but the values
						won't be converted. For example, switching from ₹ to $ will change the
						symbol but not the actual value displayed.
					</p>
				</div>
				<div>
					<ReusableButtonSettings
						text={'INR'}
						icon={'₹'}
						downArrow={true}
						// func={() => this.setState({ currencyPickerPopup: true })}
					/>
				</div>
			</div>
			<div className="deleteWorkspace">
				<div>
					<h1>Delete Workspace</h1>
				</div>
				<div>
					<h1>Do you want to delete your workspace?</h1>
					<p>
						When you delete your workspace, all your work will be permanently lost and
						cannot be recovered. Additionally, all members associated with this
						workspace will lose access. You will be billed for the month, but you'll
						receive a refund for the remaining duration.
					</p>
				</div>
			</div>
		</div>
	);
};

export default CompanyOverview;
