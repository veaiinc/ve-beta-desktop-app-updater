import React, { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import Modal from '../../components/modals';
import ProjectController from '../../../controllers/projects';
import _ from 'lodash';
import jwt_decode from 'jwt-decode';
import Skeleton from 'react-loading-skeleton';
import Dropzone from 'react-dropzone';
import { ReactComponent as TickIcon } from '../../../assets/svg/workspaceSettings/tickIcon.svg';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/svg/workspaceSettings/trash3.svg';
import UploadWatermarkForm from '../../components/modals/workspace/watermark.jsx';
import EditWatermark from '../../components/modals/workspace/editWatermark.jsx';

class GallerySettingsPopup extends ProjectController {
	constructor() {
		super();
		this.state = {
			accessControls: [],
			isTenantDetailsLoading: true,
			originalAccessControls: [],
			workspaceList: {},
			isWorkSpaceListLoading: true,
			tenantUserIsOwner: false,
			tenantUserIsSuperHuemn: false,
			tenantUserRole: null,
			notificationPopup: false,
			accessibleStates: [
				{ 'Gallery Watermark': 'Update your watermark for your gallery pictures' },
				{ 'Client Settings': 'Decide how your clients access your galleries' },
				{ 'Gallery Form': 'Collect data from visitors who access your galleries' },
				{ 'Gallery Theme': 'Customise how Gallery looks on your Device' },
			],
			toggleState: false,
			notificationState: {
				'Gallery Form': [
					'Enable for Clients',
					'Enable for Guests',
					'Enable for Face Scans',
				],
				'Client Settings': [
					'Allow Client to download Original images',
					'Enable Client to give Reviews',
					'Enable Client to Suggest Edits on Photos',
					'Allow Client to Subscribe & take ownership of gallery',
				],
			},
			clicked: '',
			canClientDownloadOriginals: true,
			canClientDownloadOptimized: true,
			canClientReview: true,
			canClientSuggestEdits: true,
			themeoptions: [
				{ value: 'dark', label: 'Dark' },
				{ value: 'light', label: 'Light' },
			],

			isLoading: true,

			isButtonLoading: false,
			theme: 'dark',
			watermarkList: [],
			colorChosen: '#B39CD7',
			isLayoutSettingsLoading: true,
			layoutSettings: {},
			isUpdateColorLoading: false,
			galleryVisitorsForm: {},
			isAdmin: false,
			theme: 'dark',
			canClientDownloadOriginals: true,
			canClientReview: true,
			canClientSuggestEdits: true,
			themeoptions: [
				{ value: 'dark', label: 'Dark' },
				{ value: 'light', label: 'Light' },
			],

			imageSrc:
				'https://images.ctfassets.net/2onq0fbdrig0/6FnJwHJwEwhltj42dkgbDZ/5728c1f29cb3564b5009317d4d642ac3/akhilasanketh18.jpeg?w=800&h=534&q=50',

			tpos: 'auto',
			rpos: 10,
			bpos: 10,
			lpos: 'auto',

			isreviewsChanged: true,
			isLoading: true,

			showModal: false,
			render: null,
			fullmodal: false,

			isButtonLoading: false,
			watermarkActive: {},

			isWaterMarkLoading: true,
			theme: 'dark',
			uploadErrorMessage: '',
			showUploadLogoModal: false,
			showWatermarkOption: null,
			showEditWatermarkModal: false,
			selectedWatermark: null,
			isAdmin: false,
			showDeleteConfirmationModal: false,
		};
	}
	componentDidMount = async () => {
		if (localStorage.getItem('usertoken')) {
			let usertoken = localStorage.getItem('usertoken');
			var decoded = await jwt_decode(usertoken);
			let woekspaceId = localStorage.getItem('workspaceId');

			if (localStorage.getItem(`userRole::${woekspaceId}::${decoded.user_id}`)) {
				let role = atob(
					localStorage.getItem(`userRole::${woekspaceId}::${decoded.user_id}`),
				);
				this.setState({
					isAdmin: role === 'admin' ? true : false,
				});
			}

			this.getTenantPreferences(null, 'customization');
			this.getWatermarkList();
		}
	};

	updateVisitorsFormAccess = async (user) => {
		let accessibleTo;
		if (_.includes(this.state.galleryVisitorsForm.accessibleTo, user)) {
			accessibleTo = _.pull(this.state.galleryVisitorsForm.accessibleTo, user);
		} else {
			accessibleTo = [...this.state.galleryVisitorsForm.accessibleTo, user];
		}

		let json = {
			visitorFormPreferences: {
				accessibleTo,
				isEnabled: _.size(accessibleTo) > 0 ? true : false,
			},
		};

		await this.updateTenantSettings(json);
	};

	toggleChange = async (e) => {
		this.setState({
			[e]: !this.state[e],
		});
		let json = {
			[e]: !this.state[`${e}`],
		};

		await this.updateTenantSettings(json);
	};

	getTenantPreference = async (json) => {
		await this.updateTenantSettings(json);
	};

	componentDidUpdate = () => {
		if (
			this.state.watermarkUrl === null &&
			this.state.isWaterMarkLoading === false &&
			this.state.isLoading === false &&
			_.size(this.state.watermarkList) > 0
		) {
			this.setState({
				watermarkUrl: _.find(this.state.watermarkList, {
					profileId: this.state.watermarkProfileId,
				})['resizedWatermakrUrl'],
			});
		}
	};

	showUploadLogoModal = (e) => {
		this.getWatermarkList();
		this.setState({
			showUploadLogoModal: !this.state.showUploadLogoModal,
		});
	};

	posactive = async (e, t, r, b, l) => {
		this.setState({
			watermarkPosition: e,
			tpos: t,
			rpos: r,
			bpos: b,
			lpos: l,
		});
		let json = {
			watermarkPosition: e,
		};
		await this.updateTenantSettings(json);
	};

	updateWaterMark = async (t) => {
		let json = {
			watermarkProfileId: t,
		};

		await this.updateTenantSettings(json);
	};

	checkUploadWatermark = async (files) => {
		// const reader = new FileReader();
		// reader.onload = (e) => {
		// 	this.setState({
		// 		imageSrc: reader.result,
		// 		showUploadLogoModal: true,
		// 		files: files[0],
		// 	});
		// };
		// reader.readAsDataURL(files[0]);

		this.setState({
			isLoading: true,
		});
		this.uploadWaterMark(files[0]);
	};

	handleDeleteWatermark = (watermark) => {
		this.deleteWatermark(null, watermark.profileId);
	};

	render() {
		if (this.props.type === 'Gallery Watermark') {
			return (
				<Modal
					handleClose={this.props.handleClose}
					show={this.props.show}
					modalType={this.props.modalType}
				>
					<>
						<>
							<div
								className="tab-content-container customization-tab-container gallery-settings-tab-container"
								style={{ marginLeft: 'unset' }}
							>
								{_.size(this.state.watermarkList) == 0 &&
								this.state.isLoading === true ? (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 12,
											marginTop: 90,
										}}
									>
										<Skeleton width={240} height={160} />

										<Skeleton width={200} height={16} />
									</div>
								) : (
									<div
										className={`form-wrapper gallery-container watermarks-wrapper ${
											_.size(this.state.watermarkList) === 0
												? 'display-none'
												: ''
										}`}
										style={{
											// overflow: 'unset',
											backgroundColor: '#2d2d2d',
											height:
												_.size(this.state.watermarkList) === 0
													? 'fit-content'
													: '',
											maxHeight: '800px',
											maxWidth: '1020px',
											height: 'auto',
											width: '100%',
											overflowY: 'hidden',
											borderRadius: '40px',
											backgroundColor: '#111111',
										}}
									>
										<div
											class="gallery-settings-header"
											style={{
												backgroundColor: '#111111',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											<div class="title">Gallery Watermark</div>
											<span
												style={{ cursor: 'pointer' }}
												onClick={this.props.handleClose}
											>
												<CrossIcon />
											</span>
										</div>
										<div className="rightslide-modal-wrapper">
											<div
												className="rightslide-modal-body"
												style={{
													marginTop: '-50px',
													height: '500px',
													paddingBottom: '0px',
													overflowY: 'scroll',
												}}
											>
												<div className="create-project-container">
													<div
														className={`${
															_.size(this.state.watermarkList) === 0
																? 'display-none'
																: ''
														}`}
													>
														<div
															className="p-form-group p-form-group-watermarks w-100p f-left"
															style={{ marginLeft: '0px' }}
														>
															<div className="form-input  w-100p watermarks-container">
																{_.map(
																	this.state.watermarkList,
																	(watermark, index) => {
																		return (
																			<div className="water-mark f-left">
																				{this.state
																					.watermarkProfileId ===
																				watermark.profileId ? (
																					<div className="default-watermark-selected">
																						Default
																					</div>
																				) : (
																					<div
																						className="default-watermark-selected default-watermark-non-selected"
																						onClick={() =>
																							this
																								.state
																								.isAdmin &&
																							this.updateWaterMark(
																								watermark.profileId,
																							)
																						}
																						style={{
																							justifyContent:
																								'space-evenly',
																							cursor: 'pointer',
																						}}
																					>
																						<TickIcon />{' '}
																						Make Default
																					</div>
																				)}
																				<a className="f-left watermark-image-container">
																					<img
																						src={
																							watermark.resizedWatermakrUrl
																						}
																					/>
																				</a>
																				<div
																					className={
																						'watermark-options-container'
																					}
																				>
																					Watermark Name
																					<div
																						style={{
																							display:
																								'flex',
																						}}
																					>
																						{/* <div
																					onClick={() =>
																						this.state
																							.isAdmin &&
																						this.setState(
																							{
																								showEditWatermarkModal:
																									!this
																										.state
																										.showEditWatermarkModal,
																								selectedWatermark:
																									watermark,
																							},
																						)
																					}
																					style={
																						!this.state
																							.isAdmin
																							? {
																									marginRight:
																										'16px',
																									cursor: 'not-allowed',
																							  }
																							: {
																									marginRight:
																										'16px',
																							  }
																					}
																				>
																					<span className="options-icon">
																						<Edit />
																					</span>
																				</div> */}
																						<div
																							onClick={() => {
																								this
																									.state
																									.isAdmin &&
																									this.setState(
																										{
																											showDeleteConfirmationModal: true,
																											selectedWatermark:
																												watermark,
																										},
																									);
																							}}
																							className="options-icon watermark-delete"
																							style={
																								!this
																									.state
																									.isAdmin
																									? {
																											cursor: 'not-allowed',
																									  }
																									: {}
																							}
																						>
																							<DeleteIcon />
																						</div>
																					</div>
																				</div>
																			</div>
																		);
																	},
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="add-btn">
											{this.state.isAdmin && (
												<div
													className={
														'water-mark add-watermark-container f-left'
													}
													style={{
														display: 'flex',
														justifyContent: 'center',
														padding: '32px 24px',
														width: '100%',
													}}
												>
													<Dropzone
														onDrop={this.checkUploadWatermark}
														accept={'image/png'}
														multiple={false}
													>
														{({ getRootProps, getInputProps }) => (
															<div
																{...getRootProps({})}
																style={{ width: '100%' }}
															>
																<input {...getInputProps()} />
																<div
																	style={{
																		border: '1px solid #242424A3',
																		color: '#e4e5e6',
																		backgroundColor: '#181818',
																		cursor: 'pointer',
																		borderRadius: '100px',
																		padding: '16px 24px',
																		height: '48px',
																		// marginTop: '1rem',
																		// display: 'inline-block',
																		fontSize: '13px',
																		fontFamily: 'Inter Medium',
																		textAlign: 'center',
																	}}
																>
																	<div>
																		<span>Add Watermark</span>
																	</div>
																</div>
															</div>
														)}
													</Dropzone>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</>

						<Modal
							handleClose={() =>
								this.setState({
									showEditWatermarkModal: !this.state.showEditWatermarkModal,
								})
							}
							show={this.state.showEditWatermarkModal}
							modalType={'center'}
						>
							<EditWatermark
								{...this.props}
								{...this.state}
								watermark={this.state.selectedWatermark}
								watermarkProfileId={this.state.watermarkProfileId}
								getpreference={(json) => this.getTenantPreference(json)}
								close={() =>
									this.setState({
										showEditWatermarkModal: !this.state.showEditWatermarkModal,
									})
								}
							/>
						</Modal>

						<Modal
							handleClose={() => this.showUploadLogoModal()}
							show={this.state.showUploadLogoModal}
							modalType={'center'}
						>
							<UploadWatermarkForm
								{...this.props}
								imageSrc={this.state.imageSrc}
								files={this.state.files}
								imageHeight={this.state.imageHeight}
								imageWidth={this.state.imageWidth}
								close={() => this.showUploadLogoModal()}
							/>
						</Modal>
						<Modal
							handleClose={() =>
								this.setState({ showDeleteConfirmationModal: false })
							}
							show={this.state.showDeleteConfirmationModal}
							modalType={'center'}
						>
							<div className="center-confirm-delete-new">
								<div className="delete-modal-header">DELETE WATERMARK</div>
								<div className="middle-delete-container">
									<div className="middle-text">Are you sure?</div>
									<div className="middle-desc">
										If you delete this Watermark, you cannot undo this
									</div>
								</div>
								<div className="bottom-delete-btns">
									<span
										className="cancel-btn"
										onClick={(e) =>
											this.setState({ showDeleteConfirmationModal: false })
										}
									>
										No, cancel
									</span>
									<span
										className="delete-btn"
										onClick={(e) => {
											this.handleDeleteWatermark(
												this.state.selectedWatermark,
											);
											this.setState({ showDeleteConfirmationModal: false });
										}}
									>
										Yes, delete
									</span>
								</div>
							</div>
						</Modal>
					</>
				</Modal>
			);
		} else {
			return (
				<Modal
					handleClose={this.props.handleClose}
					show={this.props.show}
					modalType={this.props.modalType}
				>
					<div
						style={{
							backgroundColor: '#111111',
							width: '544px',
							height: 'auto',
							borderRadius: '40px',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								padding: '32px 24px 0 24px',
								gap: '5px',
								marginBottom: '40px',
							}}
						>
							<span
								style={{
									fontFamily: 'Inter Medium',
									fontSize: '16px',
									color: '#e4e5e6',
									lineHeight: '24px',
								}}
							>
								{this.props.type}
							</span>
							<span style={{ cursor: 'pointer' }} onClick={this.props.handleClose}>
								<CrossIcon />
							</span>
						</div>

						{this.state.notificationState[this.props.type].map((text, index) => (
							<div
								style={{
									padding:
										index !== 0 ? '16px 24px 16px 24px' : '0 24px 16px 24px',
									width: '100%',
								}}
								key={index}
							>
								<div
									style={{
										display: 'flex',
										gap: '2rem',
									}}
								>
									<div
										onClick={() =>
											this.state.isAdmin &&
											(text == 'Allow Client to download Original images'
												? this.toggleChange('canClientDownloadOriginals')
												: text == 'Enable Client to give Reviews'
												? this.toggleChange('canClientReview')
												: text == 'Enable Client to Suggest Edits on Photos'
												? this.toggleChange('canClientSuggestEdits')
												: text ==
												  'Allow Client to Subscribe & take ownership of gallery'
												? this.toggleChange('allowClientsToSubscribe')
												: text == 'Enable for Clients'
												? this.updateVisitorsFormAccess('master')
												: text == 'Enable for Guests'
												? this.updateVisitorsFormAccess('guest')
												: text == 'Enable for Face Scans' &&
												  this.updateVisitorsFormAccess('face'))
										}
										style={
											this.state.isAdmin === false
												? { cursor: 'not-allowed', marginBottom: 0 }
												: { marginBottom: 0 }
										}
										className={
											text == 'Allow Client to download Original images' &&
											this.state.canClientDownloadOriginals
												? 'f-toggle-button-container active'
												: text == 'Enable Client to give Reviews' &&
												  this.state.canClientReview
												? 'f-toggle-button-container active'
												: text ==
														'Enable Client to Suggest Edits on Photos' &&
												  this.state.canClientSuggestEdits
												? 'f-toggle-button-container active'
												: text ==
														'Allow Client to Subscribe & take ownership of gallery' &&
												  this.state.allowClientsToSubscribe
												? 'f-toggle-button-container active'
												: text == 'Enable for Clients' &&
												  _.includes(
														this.state.galleryVisitorsForm.accessibleTo,
														'master',
												  )
												? 'f-toggle-button-container active'
												: text == 'Enable for Guests' &&
												  _.includes(
														this.state.galleryVisitorsForm.accessibleTo,
														'guest',
												  )
												? 'f-toggle-button-container active'
												: text == 'Enable for Face Scans' &&
												  _.includes(
														this.state.galleryVisitorsForm.accessibleTo,
														'face',
												  )
												? 'f-toggle-button-container active'
												: 'f-toggle-button-container'
										}
									>
										<div
											className="toggle-button"
											// onClick={() => setToggleState(!toggleState)}
										></div>
									</div>
									<div
										style={{
											fontSize: '14px',
											color: '#e4e5e6',
											fontFamily: 'Inter',
										}}
									>
										{text}
									</div>
								</div>
							</div>
						))}
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								padding: '32px 24px',
								width: '100%',
							}}
						>
							<div style={{ width: '100%' }}>
								<div
									style={{
										border: '1px solid #242424A3',
										color: '#e4e5e6',
										backgroundColor: '#181818',
										cursor: 'pointer',
										borderRadius: '100px',
										padding: '16px 24px',
										height: '48px',
										// marginTop: '1rem',
										// display: 'inline-block',
										fontSize: '13px',
										fontFamily: 'Inter Medium',
										textAlign: 'center',
									}}
									onClick={this.props.handleClose}
								>
									<div>
										<span>Save Changes</span>
									</div>
								</div>
							</div>
						</div>
						{/* <div
							style={{
								padding: '12px 24px 12px 24px',
								display: 'flex',
								gap: '12px',
								justifyContent: 'flex-end',
								alignItems: 'center',
							}}
						>
							<div
								style={{ color: '#b0b0b0', padding: '9px 12px', cursor: 'pointer' }}
								onClick={this.props.handleClose}
							>
								Discard
							</div>
							<button
								style={{
									backgroundColor: '#3f8be2',
									padding: '9px 12px',
									border: 'none',
									borderRadius: '8px',
									color: '#fff',
									cursor: 'pointer',
								}}
							>
								Confirm
							</button>
						</div> */}
					</div>
				</Modal>
			);
		}
	}
}

export default GallerySettingsPopup;
