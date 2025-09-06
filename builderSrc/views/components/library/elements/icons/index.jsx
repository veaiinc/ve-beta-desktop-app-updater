import React, { Component } from 'react';
import './icons.scss';
import Behance from '../../svgs/socialIcons/Behance';
import Facebook from '../../svgs/socialIcons/Facebook';
import Insta from '../../svgs/socialIcons/Insta';
import Linkedin from '../../svgs/socialIcons/Linkedin';
import Pinterest from '../../svgs/socialIcons/Pinterest';
import RoundedFacebook from '../../svgs/socialIcons/RoundedFacebook';
import Spotify from '../../svgs/socialIcons/Spotify';
import Steam from '../../svgs/socialIcons/Steam';
import Telegram from '../../svgs/socialIcons/Telegram';
import Tiktok from '../../svgs/socialIcons/Tiktok';
import Twitter from '../../svgs/socialIcons/Twitter';
import X from '../../svgs/socialIcons/X';
import Youtube from '../../svgs/socialIcons/Youtube';

import Website from '../../svgs/socialIcons/Website';
import Modal from '../../modals';
import { IconIndexBaseClass } from '../../../builder_client_common';

// Remove the Proposals import if in client mode
const BaseClass = IconIndexBaseClass;

class Icon extends BaseClass {
	constructor(props) {
		super();
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			preview: props.preview,
			iconName: props.iconName,
			fillColor: props.fillColor,
			iconBgColor: props.iconBgColor,
			iconType: props.iconType,
			iconSize: props.iconSize,
			socialMediaLinks: props?.socialMediaLinks,
			showIconModal: false,
			iconLink: props.link,
			isFluid: props.isFluid,
			setIconLink: props?.setLink,
			activeComponentLink: props?.activeComponentLink,
		};
		this.modalRef = React.createRef();
		this.iconRef = React.createRef();
	}
	componentDidMount = () => {
		window.addEventListener('mosedown', this.handleClick);
	};
	componentWillUnmount = () => {
		window.removeEventListener('mosedown', this.handleClick);
	};

	componentWillReceiveProps = (nextProps) => {
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.setIconLink !== nextProps.setIconLink) {
			this.setState(
				{
					setIconLink: nextProps.setIconLink,
				},
				() => {
					if (nextProps.setIconLink == true) {
						this.setState({
							showIconModal: true,
						});
					}
					if (this.state.isFluid) {
						if (this.state.activeComponentLink == false) {
							this.setState({
								showIconModal: false,
							});
						}
					}
				},
			);
		}
		if (this.state.activeComponentLink !== nextProps.activeComponentLink) {
			this.setState(
				{
					activeComponentLink: nextProps.activeComponentLink,
				},
				() => {},
			);
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.isFluid !== nextProps.isFluid) {
			this.setState({
				isFluid: nextProps.isFluid,
			});
		}
		if (this.state.iconName !== nextProps.iconName) {
			this.setState({
				iconName: nextProps.iconName,
			});
		}
		if (this.state.fillColor !== nextProps.fillColor) {
			this.setState({
				fillColor: nextProps.fillColor,
			});
		}
		if (this.state.iconBgColor !== nextProps.iconBgColor) {
			this.setState({
				iconBgColor: nextProps.iconBgColor,
			});
		}
		if (this.state.iconType !== nextProps.iconType) {
			this.setState({
				iconType: nextProps.iconType,
			});
		}
		if (this.state.iconSize !== nextProps.iconSize) {
			this.setState({
				iconSize: nextProps.iconSize,
			});
		}
		if (this.state.socialMediaLinks !== nextProps.socialMediaLinks) {
			this.setState({
				socialMediaLinks: nextProps.socialMediaLinks,
			});
		}
	};
	handleClick = (e) => {};
	renderIcon = (iconName, fillColor, iconSize) => {
		switch (iconName) {
			case 'Behance':
				return <Behance fillColor={fillColor} iconSize={iconSize} />;
			case 'Facebook':
				return <Facebook fillColor={fillColor} iconSize={iconSize} />;
			case 'Instagram':
				return <Insta fillColor={fillColor} iconSize={iconSize} />;
			case 'Linkedin':
				return <Linkedin fillColor={fillColor} iconSize={iconSize} />;

			case 'Pinterest':
				return <Pinterest fillColor={fillColor} iconSize={iconSize} />;
			case 'RoundedFacebook':
				return <RoundedFacebook fillColor={fillColor} iconSize={iconSize} />;
			case 'Spotify':
				return <Spotify fillColor={fillColor} iconSize={iconSize} />;
			case 'Steam':
				return <Steam fillColor={fillColor} iconSize={iconSize} />;
			case 'Telegram':
				return <Telegram fillColor={fillColor} iconSize={iconSize} />;
			case 'Tiktok':
				return <Tiktok fillColor={fillColor} iconSize={iconSize} />;
			case 'Twitter':
				return <Twitter fillColor={fillColor} iconSize={iconSize} />;
			case 'X':
				return <X fillColor={fillColor} iconSize={iconSize} />;
			case 'Youtube':
				return <Youtube fillColor={fillColor} iconSize={iconSize} />;
			case 'website':
				return <Website fillColor={fillColor} iconSize={iconSize} />;

			default:
				return null;
		}
	};
	handleOnClick = (e) => {
		if (this.props.client) {
			// for new tab
			if (this.state?.iconLink) {
				window.open(this.state?.iconLink, '_blank');
			}
			if (this.state?.iconName == 'website' && this.state?.tenantsData?.website) {
				window.open(this.state?.tenantsData?.website, '_blank');
			}
		} else {
			if (this.state.isFluid) {
				if (
					this.iconRef.current &&
					this.modalRef.current &&
					!this.modalRef.current.contains(e.target)
				) {
					this.setState(
						{
							showIconModal: !this.state.showIconModal,
							setIconLink: false,
							activeComponentLink: null,
						},
						() => {
							this.props?.setModal(false);
						},
					);
				}

				this.props.setTab('fi');
			} else {
				if (this.modalRef.current && this.modalRef.current.contains(e.target)) {
					this.setState({ showIconModal: !this.state.showIconModal });
				} else {
					this.setState({ showIconModal: !this.state.showIconModal });
				}
				this.setState(
					{
						showIconModal: true,
					},
					() => {
						this.props.setTab('fi');
					},
				);
			}
		}
		// this.state.preview == true
		// 	? [
		// 			// e.stopPropagation(),
		// 			window.open(this.state.href, this.state.openInNewTab ? '_blank' : '_self'),
		// 	  ]
		// 	: this.setState(
		// 			{
		// 				showIconModal: true,
		// 			},
		// 			() => {
		// 				//this.props.setTab('fi');
		// 			},
		// 	  );
	};

	// handleIcon = (e) => {

	// 	e.preventDefault();

	// 	this.setState(
	// 	  {
	// 		socialMediaLinks: {
	// 		  ...this.state.socialMediaLinks,
	// 		  [this.state.iconName]: this.state.iconLink,
	// 		},
	// 	  },
	// 	  () => {
	// 	  }
	// 	);

	//   };

	handleIcon = async (e) => {
		e.preventDefault();

		const { iconLink, iconName, socialMediaLinks } = this.state;

		const updatedSocialMediaLinks = {
			...socialMediaLinks,
			[iconName]: iconLink,
			...socialMediaLinks,
			[iconName]: iconLink,
		};

		this.setState(
			{
				socialMediaLinks: updatedSocialMediaLinks,
			},
			async () => {
				const Payload = {
					behanceProfile: updatedSocialMediaLinks.Behance || '',
					facebookProfile: updatedSocialMediaLinks.Facebook || '',
					instagramProfile: updatedSocialMediaLinks.Instagram || '',
					linkedInProfile: updatedSocialMediaLinks.Linkedin || '',
					pinterestProfile: updatedSocialMediaLinks.Pinterest || '',
					spotifyProfile: updatedSocialMediaLinks.Spotify || '',
					steamProfile: updatedSocialMediaLinks.Steam || '',
					telegramProfile: updatedSocialMediaLinks.Telegram || '',
					tiktokProfile: updatedSocialMediaLinks.Tiktok || '',
					// website: socialMediaLinks.website ||  '',
					youtubeProfile: updatedSocialMediaLinks.Youtube || '',
				};
				let filteredPayload = Object.fromEntries(
					Object.entries(Payload).filter(([_, value]) => value !== ''),
				);

				const response = await this.putTenantData(filteredPayload);
				if (response === true) {
					this.props.setIcon(iconLink);
					this.props.setModal(false);
				}
			},
		);
		this.closeModal();
	};

	closeModal = (e) => {
		this.setState(
			{
				showIconModal: !this.state.showIconModal,
			},
			() => {
				this.props.setModal(false);
			},
		);
	};

	handleBackdropClick = (e) => {
		if (this.modalRef.current && !this.modalRef.current.contains(e.target)) {
			this.closeModal();
		}
	};

	render() {
		return (
			<div
				className={`icon ${this.state.iconType} `}
				style={{
					backgroundColor:
						this.state.iconType === 'filled'
							? this.state.iconBgColor || 'transparent'
							: 'transparent',
					borderColor:
						this.state.iconType === 'bordered'
							? this.state.fillColor || 'transparent'
							: 'transparent',
					...(this.state.isFluid
						? {
								display: 'flex',
								gridArea: 'inherit',
								// flex: 1,
								height:
									this.state.iconSize === 'small' &&
									this.state.iconType === 'bordered'
										? '26px !important'
										: this.state.iconSize === 'medium' &&
										  this.state.iconType === 'bordered'
										? '32px !important'
										: this.state.iconSize === 'large' &&
										  this.state.iconType === 'bordered'
										? '42px !important'
										: '100%',
								width:
									this.state.iconSize === 'small' &&
									this.state.iconType === 'bordered'
										? '26px !important'
										: this.state.iconSize === 'medium' &&
										  this.state.iconType === 'bordered'
										? '32px !important'
										: this.state.iconSize === 'large' &&
										  this.state.iconType === 'bordered'
										? '42px !important'
										: '100%',
								aspectRatio: '1/1',
						  }
						: {}),
				}}
				onClick={(e) => this.handleOnClick(e)}
				ref={this.iconRef}
			>
				{this.renderIcon(this.state.iconName, this.state.fillColor, this.state.iconSize)}
				{/* <Modal
					handleClose={(e) => this.closeModal(e)}
					show={this.state.showIconModal}
					modalType={'center'}
				>
					<div className="icon-modal" ref={this.modalRef}>
						<div className="icon-header">
							<div className="icon-modal-title">Add your Social Media</div>
							<div className="close" onClick={(e) => this.closeModal(e)}>
								X
							</div>
						</div>
						<div className="icon-link-div">
							<div className="icon-link-name">{this.state.iconName} Link</div>
							<div className="icon-input">
								<input
									autoFocus
									//   onChange={this.handleIcon}
									onChange={(e) => {
										this.setState({
											iconLink: e.target.value,
											socialMediaLinks: {
												...this.state.socialMediaLinks,
												[this.state.iconName]: e.target.value,
											},
										});
									}}
									value={this.state.iconLink || `https://www.${this.state.iconName?.toLowerCase()}.com/`}
									type="text"
									// placeholder={`https://www.${this.state.iconName?.toLowerCase()}.com/`}
								/>
							</div>
						</div>
						<div onClick={(e) => this.handleIcon(e)} className="add-button">
							Add {this.state.iconName}
						</div>
					</div>
				</Modal> */}
				{this.state.iconName !== 'website' && (
					<Modal
						handleClose={(e) => this.closeModal(e)}
						show={this.state.showIconModal}
						modalType={'center'}
					>
						<div className="icon-modal-backdrop" onClick={this.handleBackdropClick}>
							<div
								className="icon-modal"
								ref={this.modalRef}
								onClick={(e) => e.stopPropagation()} // Stop the click from propagating to the backdrop
							>
								<div className="icon-header">
									<div className="icon-modal-title">Add your Social Media</div>
									<div className="close" onClick={(e) => this.closeModal(e)}>
										X
									</div>
								</div>
								<div className="icon-link-div">
									<div className="icon-link-name">{this.state.iconName} Link</div>
									<div className="icon-input">
										<input
											autoFocus
											onChange={(e) => {
												this.setState({
													iconLink: e.target.value,
													socialMediaLinks: {
														...this.state.socialMediaLinks,
														[this.state.iconName]: e.target.value,
													},
												});
											}}
											value={
												this.state?.iconLink ||
												`https://www.${this.state.iconName?.toLowerCase()}.com/`
											}
											type="text"
										/>
									</div>
								</div>
								<div onClick={(e) => this.handleIcon(e)} className="add-button">
									Add {this.state.iconName}
								</div>
							</div>
						</div>
					</Modal>
				)}
			</div>
		);
	}
}

export default Icon;
