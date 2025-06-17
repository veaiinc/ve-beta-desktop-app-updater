import React, { Component } from 'react';
import { ReactComponent as EditSet } from '../../../assets/svg/edit.svg';
import { ReactComponent as Copy } from '../../../assets/svg/Settings/Copy.svg';
import { ReactComponent as Live } from '../../../assets/svg/Settings/Live.svg';
import { ReactComponent as DropSet } from '../../../assets/svg/Settings/Drop.svg';
import { ReactComponent as CustomClose } from '../../../assets/svg/Settings/CloseSetting.svg';
import { ReactComponent as Profile } from '../../../assets/svg/Settings/Profile.svg';
import { ReactComponent as Security } from '../../../assets/svg/Settings/Security.svg';
import { ReactComponent as Info } from '../../../assets/svg/Settings/Info.svg';
import { ReactComponent as LinkExpiry } from '../../../assets/svg/Settings/LinkExpiry.svg';
import { ReactComponent as Plus } from '../library/svgs/Plus.svg';

import moment from 'moment';
import './HomePagePopup.scss';
class SharePopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			customDomain: props?.customDomain,
			endUrl: props?.endUrl,
			slugErrorMsg: props?.slugErrorMsg,
			status: props?.status,
			expiresAt: props?.expiresAt,
			customExpiry: props?.customExpiry,
			customExpiryDate: props?.customExpiryDate,
			clientDetails: props?.clientDetails,
			isAlChatEnabled: props?.aiAssistant,
			addClientDetails: false,
			updateClient: false,
			CustomActive: '',
		};
		this.inputRef = React.createRef();
	}
	componentDidMount() {}
	componentWillUnmount() {}
	componentDidUpdate() {}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.customDomain !== nextProps.customDomain && nextProps.customDomain) {
			this.setState({
				customDomain: nextProps.customDomain,
			});
		}
		if (this.state.endUrl !== nextProps.endUrl && nextProps.endUrl) {
			this.setState({
				endUrl: nextProps.endUrl,
			});
		}
		if (this.state.slugErrorMsg !== nextProps.slugErrorMsg) {
			this.setState({
				slugErrorMsg: nextProps.slugErrorMsg,
			});
		}
		if (this.state.status !== nextProps.status && nextProps.status) {
			this.setState({
				status: nextProps.status,
			});
		}

		if (this.state.expiresAt !== nextProps.expiresAt && nextProps.expiresAt) {
			this.setState({
				expiresAt: nextProps.expiresAt,
			});
		}

		if (this.state.customExpiry !== nextProps.customExpiry && nextProps.customExpiry) {
			this.setState({
				customExpiry: nextProps.customExpiry,
			});
		}
		if (
			this.state.customExpiryDate !== nextProps.customExpiryDate &&
			nextProps.customExpiryDate
		) {
			this.setState({
				customExpiryDate: nextProps.customExpiryDate,
			});
		}
		if (this.state.clientDetails !== nextProps.clientDetails && nextProps.clientDetails) {
			this.setState({
				clientDetails: nextProps.clientDetails,
			});
		}
		if (this.state.isAlChatEnabled !== nextProps.aiAssistant && nextProps.aiAssistant) {
			this.setState({
				isAlChatEnabled: nextProps.aiAssistant,
			});
		}
	};
	handleSlugChange(e) {
		if (e.target.value.length > 0) {
			const isValidInput = /^[a-zA-Z0-9-]*$/.test(e.target.value);

			if (isValidInput) {
				this.setState(
					{
						endUrl: e.target.value,
						slugErrorMsg: '',
					},
					() => {
						this.props.handleSlugChange(e);
					},
				);
			} else {
				this.setState({
					slugErrorMsg: 'Only letters, numbers, and hyphens are allowed',
				});
			}
		}
	}
	handleCopyFunction(dynamicDomain) {
		this.props.handleCopy(dynamicDomain);
	}
	handleCustomDays(e, type) {
		if (type !== 'custom') {
			this.setState({
				CustomActive: e.toString(),
			});
		}

		this.props.handleCustomDays(e, type);
		if (type === 'custom') {
			this.setState({
				customExpiryDate: e.target.value,
			});
		}
	}
	handleUserIdentity(type) {
		this.props.handleUserIdentity(type);
	}

	handleUserIdentityOtp(type) {
		if (type === 'otp' && !this.props.isEnable) {
			this.props.handleUserIdentity(type);
		}
		if (type === 'no' && this.props.isEnable) {
			this.props.handleUserIdentity(type);
		}
	}
	handleAiAssistant(e) {
		this.props.handleAiAssistant(e);
	}
	handleAddClientInShare() {
		this.setState(
			{
				updateClient: true,
			},
			() => {
				this.props.handleAddClientInShare(this.state.clientDetails);
			},
		);
	}
	handleEditSlug() {
		if (this.inputRef.current) {
			this.inputRef.current.focus();
		}
	}
	handleAddClientInShareDetails(e) {
		this.props.handleAddClientInShare(e);
	}
	render() {
		let formattedDate = '';
		if (this.state.expiresAt) {
			formattedDate = moment.unix(this.state.expiresAt).format('DD MMM YYYY');
		}
		let dynamicDomain = this.state.customDomain
			? `https://${this.state.customDomain}/portal/${this.state.endUrl}`
			: localStorage.getItem('workspaceId')
			? `https://${localStorage.getItem('workspaceId')}.ve.ai/portal/${this.state.endUrl}`
			: '';
		return (
			<div className="share_component_popup">
				<div className="settings_wrapper">
					<div className="settings_heading">
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<div className="tumbnail_input">
								{`https://${
									this.state.customDomain
										? this.state.customDomain
										: localStorage.getItem('workspaceId')
										? `${localStorage.getItem('workspaceId')}.ve.ai`
										: ''
								}/portal/`}
								<input
									ref={this.inputRef}
									className="tumbnail_input_slug"
									type="text"
									value={this.state.endUrl}
									onChange={(e) => this.handleSlugChange(e)}
									size={this.state.endUrl?.length + 1}
								/>{' '}
							</div>
							<div className="share_button_wrapper">
								<div style={{ cursor: 'pointer' }}>
									<EditSet
										onClick={() => this.handleEditSlug()}
										style={{ width: '16px', height: '16px', color: '#F2F2F3' }}
									/>
								</div>
								<Copy
									onClick={() => this.handleCopyFunction(dynamicDomain)}
									style={{
										cursor: 'pointer',
										width: '16px',
										height: '16px',
										color: '#F2F2F3',
									}}
								/>
								<div className="share_live_button">
									<Live
										style={{ width: '16px', height: '16px', color: '#F2F2F3' }}
									/>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '4px',
										}}
									>
										<span>Live</span>
										<DropSet
											onClick={() =>
												this.setState({
													status: !this.state.status,
												})
											}
											style={{
												cursor: 'pointer',
												transform: this.state.status
													? 'rotate(180deg)'
													: 'rotate(0deg)',
												width: '16px',
												height: '16px',
												color: '#F2F2F3',
											}}
										/>
									</div>
								</div>
								{/* {this.state.status && (
									<div className="share_live_status">
										<span>Live</span>
									</div>
								)} */}
							</div>
						</div>
						{this.state.slugErrorMsg && (
							<div
								style={{
									color: 'red',
									fontSize: '12px',
									fontFamily: 'Inter',
								}}
							>
								Slug already exists
							</div>
						)}
						<div className="hrTag"></div>
						<div className="client_details">
							<div className="client_details_heading">
								<div className="client_details_heading_text">Manage Clients </div>
								{!this.state.clientDetails?.name && (
									<div
										onClick={() => this.handleAddClientInShareDetails()}
										className="client_details_heading_add"
									>
										<Plus />
										Add client
									</div>
								)}
							</div>
							<div className="client_details_name">
								<div className="client_details_name_image">
									{this.state.clientDetails?.image ? (
										<img src={this.state.clientDetails?.image} />
									) : (
										<div className="client_details_name_image_default">
											{this.state.clientDetails?.name?.charAt(0)}
										</div>
									)}
								</div>
								<div className="client_details_name_text_wrapper">
									{this.state.clientDetails?.name ? (
										<>
											<div className="client_details_name_text">
												{this.state.clientDetails?.name
													? this.state.clientDetails?.name
													: 'no name'}
											</div>
											<div className="client_details_name_email">
												{this.state.clientDetails?.email
													? this.state.clientDetails?.email
													: 'no email'}
											</div>
										</>
									) : (
										<div className="client_details_name_text">No Clients</div>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="link-expiry-wrapper">
						<div className="link-expiry-main">
							<div className="link-expiry-content">
								<div className="expireSvg">
									<LinkExpiry />
								</div>
								<div className="link-expiry-content-text">
									<span className="link_expiry_text">Link Expiry</span>
									<span className="link_never_expire">
										{formattedDate
											? `Link will expire on ${formattedDate}`
											: 'Link Never Expires'}
									</span>
								</div>
							</div>
							{this.state.customExpiry ? (
								<div className="link-expiry-time">
									<div className="custom-expiry-close">
										<CustomClose
											style={{ cursor: 'pointer' }}
											onClick={() => this.setState({ customExpiry: false })}
										/>
									</div>
									<input
										className="share_live_status_input"
										type="text"
										value={this.state.customExpiryDate}
										size={this.state.customExpiryDate?.length}
										onChange={(e) => this.handleCustomDays(e, 'custom')}
									/>
									<span style={{ fontSize: '12px', border: 'none' }}>Days</span>
								</div>
							) : (
								<div className="link-expiry-time">
									{!this.state.expiresAt && (
										<span
											style={{
												color: '#F2F2F3',
												border: '1px solid #F2F2F3',
												padding: '2px 4px',
												borderRadius: '6px',
												height: '26px',

												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												cursor: 'pointer',
											}}
										>
											No Expiry
										</span>
									)}
									<span
										className={
											this.state.CustomActive === '7' ? 'custom_active' : ''
										}
										onClick={() => this.handleCustomDays(7)}
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '26px',
											height: '26px',
											borderRadius: '6px',
											cursor: 'pointer',
										}}
									>
										7d
									</span>
									<span
										className={
											this.state.CustomActive === '15' ? 'custom_active' : ''
										}
										onClick={() => this.handleCustomDays(15)}
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '26px',
											height: '26px',
											borderRadius: '6px',
											cursor: 'pointer',
										}}
									>
										15d
									</span>
									<span
										className={
											this.state.CustomActive === '30' ? 'custom_active' : ''
										}
										onClick={() => this.handleCustomDays(30)}
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '26px',
											height: '26px',
											borderRadius: '6px',
											cursor: 'pointer',
										}}
									>
										30d
									</span>
									<div
										className="link_expiry_custom"
										onClick={() => this.setState({ customExpiry: true })}
									>
										Custom
									</div>
									<div className="info_svg">
										<Info
											style={{
												width: '16px',
												height: '16px',
												color: '#F2F2F3',
											}}
										/>

										<div className="info_text_popup">
											<Info
												style={{
													width: '16px',
													height: '16px',
													color: '#F2F2F3',
												}}
											/>
											<div className="info_text">
												Pages will expire after 'X' days when this feature
												is enabled. Expired pages will move to a declined
												state and will no longer be publicly accessible.
											</div>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="hrTag"></div>
						<div className="access_code_wrapper">
							<div className="access_via">
								<Profile
									style={{ width: '16px', height: '16px', color: '#F2F2F3' }}
								/>
								<span>Access Via</span>
							</div>
							<div className="profile_checkbox">
								<span
									onClick={() => this.handleUserIdentity('name')}
									style={{
										cursor: 'pointer',
										color: this.props.settingName ? '#F2F2F3' : '#787E87',
										border: this.props.settingName
											? '1px solid #F2F2F3'
											: '1px solid #787E87',
									}}
								>
									Name
								</span>

								<span
									onClick={() => this.handleUserIdentity('email')}
									style={{
										cursor: 'pointer',
										color: this.props.settingEmail ? '#F2F2F3' : '#787E87',
										border: this.props.settingEmail
											? '1px solid #F2F2F3'
											: '1px solid #787E87',
									}}
								>
									Email
								</span>

								<span
									onClick={() => this.handleUserIdentity('phone')}
									style={{
										cursor: 'pointer',
										color: this.props.settingPhone ? '#F2F2F3' : '#787E87',
										border: this.props.settingPhone
											? '1px solid #F2F2F3'
											: '1px solid #787E87',
									}}
								>
									Phone
								</span>
							</div>
						</div>
						<div className="access_code_wrapper">
							<div className="access_via">
								<Security
									style={{ width: '16px', height: '16px', color: '#F2F2F3' }}
								/>
								<span>Security</span>
							</div>
							<div className="profile_checkbox">
								<span
									onClick={() => this.handleUserIdentityOtp('no')}
									style={{
										cursor: 'pointer',
										color: !this.props.isEnable ? '#F2F2F3' : '#787E87',
										border: !this.props.isEnable
											? '1px solid #F2F2F3'
											: '1px solid #787E87',
									}}
								>
									No Verification
								</span>

								<span
									onClick={() => this.handleUserIdentityOtp('otp')}
									style={{
										cursor: 'pointer',
										color: this.props.isEnable ? '#F2F2F3' : '#787E87',
										border: this.props.isEnable
											? '1px solid #F2F2F3'
											: '1px solid #787E87',
									}}
								>
									Verification OTP
								</span>
							</div>
						</div>
					</div>

					{/* <div className="ai_wrapper">
									<div className="ai_wrapper_heading">
										<div className="ai_wrapper_heading_left">
											<div>
												<Info className="ai_wrapper_heading_left_info" />
												<div className="ai_wrapper_heading_left_info_text">
													<Info />
													 <span>
														AI Can make mistakes while turning on AI
														Sales Assistant, VE AI is not responsible
														for any malfunction that AI might make.
													</span> 
												</div>
											</div>
											<div className="ai_assistant_text">AI Assistant</div>
											<DropSet />
											<div className="ai_assistant_text_popup">
												<div className="ai_assistant_text_popup_heading">
													Choose AI assistance
												</div>
												<div className="ai_assistant_text_popup_item">
													<span>Assistant 1</span>
													<TickIcon />
												</div>
												<div className="ai_assistant_text_popup_item">
													<span>Assistant 2</span>
													<TickIcon />
												</div>
												<div className="ai_assistant_text_popup_item">
													<span>Assistant 3</span>
													<TickIcon />
												</div>
											</div>
										</div>
										<label className="switch">
											<input
												type="checkbox"
												onChange={(e) => {
													this.handleAiAssistant(e);
												}}
												checked={this.state.isAlChatEnabled}
											/>
											<span className="slider-round round"></span>
										</label>
									</div>
									<Divider />
									<div className="ai_wrapper_email">
										<Message />
										<div className="ai_wrapper_email_text">Share via Email</div>
									</div>
								</div>  */}
				</div>
			</div>
		);
	}
}

export default SharePopup;
