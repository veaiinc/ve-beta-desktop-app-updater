import React from 'react';
import '../../../assets/scss/CompanySettings/overview.scss';
import InputForModules from '../../components/input/inputForModules';

const CompanyOverview = () => {
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
						placeholder={'Enter your URL'}
						name={'companyHandle'}
						value={''}
						// onChange={handleChange}
						isError={false}
						errorMessage={''}
					/>
					<InputForModules
						label={'Company Type'}
						type={'text'}
						placeholder={'Enter your Company Type'}
						name={'CompanyType'}
						value={''}
						// onChange={handleChange}
						isError={false}
						errorMessage={''}
					/>
					<InputForModules
						label={'Company Email'}
						type={'email'}
						placeholder={'business@email.com'}
						name={'CompanyEmail'}
						value={''}
						// onChange={handleChange}
						isError={false}
						errorMessage={''}
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
					<p className="editButton">Edit</p>
				</div>
				<div className="businessDetailsForm">
					<div className="businessImgName">
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
						<div className={'businessName'}>
							<InputForModules
								label={'Business Name'}
								type={'text'}
								placeholder={'Enter your Business Name'}
								name={'businessName'}
								isError={false}
								errorMessage={''}
							/>
						</div>
					</div>
					<InputForModules
						label={'Company Email'}
						type={'email'}
						placeholder={'business@email.com'}
						name={'companyEmail'}
						isError={false}
						errorMessage={''}
					/>
					<InputForModules
						label={'Phone Number'}
						type={'phoneNumber'}
						placeholder={'Enter your Phone Number'}
						name={'phoneNumber'}
						isError={false}
						errorMessage={''}
					/>
					<InputForModules
						label={'Address'}
						type={'text'}
						placeholder={'Enter your Company Address'}
						name={'CompanyAddress'}
						isError={false}
						errorMessage={''}
					/>
					<InputForModules
						label={'Website'}
						type={'text'}
						placeholder={'https://www.studio.com'}
						name={'website'}
						isError={false}
						errorMessage={''}
					/>
				</div>
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
				<div></div>
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
				<div>{/* Keep drop down */}</div>
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
