import React, { Component } from 'react';
import '../../../assets/scss/header.scss';
import PageIcon from '../library/svgs/header/PagesComponent';
import { ReactComponent as Desktop } from '../../../assets/svg/smartFile/Desktop.svg';
import { ReactComponent as Mobile } from '../../../assets/svg/smartFile/Mobile.svg';
import { ReactComponent as Divider } from '../../../assets/svg/smartFile/Divider.svg';
import { ReactComponent as Settings } from '../../../assets/svg/Settings/Settings.svg';
import { withRouter } from '../../../services/withRouter';

import MetaImage from './MetaImage/MetaImage';
import Title from './title';
import { Tooltip } from 'antd';
import { Threedots, BackArrow } from '../builder_client_common';

class Header extends Component {
	constructor(props) {
		super();
		this.state = {
			title: props.title,
			preview: props.preview,
			previewType: props.previewType,
			isSaveLoading: props.isSaveLoading,
			isPublishLoading: props.isPublishLoading,
			modules: props.modules,
			module: props.module,
			activeModuleId: props.activeModuleId,
			mobileViewLocked: props.mobileViewLocked,
			showHeaderPopup: false,
			isWorkflow: props.isWorkflow,
			isShare: false,
			isEmbed: false,
			isThreeDotsDropdown: false,
			isFormTemplate: props.isFormTemplate,
		};
		this.threeDotsDropdownRef = React.createRef();
	}
	componentDidMount() {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const isEmbed = urlParams?.get('isEmbed');
		if (isEmbed) {
			this.setState({ isEmbed: true });
		}
		document.addEventListener('mousedown', this.handleClickOutside);
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.title !== nextProps.title) {
			this.setState({
				title: nextProps.title,
			});
		}
		if (this.state.isFormTemplate !== nextProps.isFormTemplate) {
			this.setState({
				isFormTemplate: nextProps.isFormTemplate,
			});
		}
		if (this.state.activeModuleId !== nextProps.activeModuleId) {
			this.setState({
				activeModuleId: nextProps.activeModuleId,
			});
		}
		if (this.state.mobileViewLocked !== nextProps.mobileViewLocked) {
			this.setState({
				mobileViewLocked: nextProps.mobileViewLocked,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.isSaveLoading !== nextProps.isSaveLoading) {
			this.setState({
				isSaveLoading: nextProps.isSaveLoading,
			});
		}
		if (this.state.isPublishLoading !== nextProps.isPublishLoading) {
			this.setState({
				isPublishLoading: nextProps.isPublishLoading,
			});
		}
		if (this.state.modules !== nextProps.modules) {
			this.setState({
				modules: nextProps.modules,
			});
		}
		if (this.state.module !== nextProps.module) {
			this.setState({
				module: nextProps.module,
			});
		}
		if (this.state.isWorkflow !== nextProps.isWorkflow) {
			this.setState({
				isWorkflow: nextProps.isWorkflow,
			});
		}
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	handleClickOutside = (event) => {
		if (
			this.threeDotsDropdownRef.current &&
			!this.threeDotsDropdownRef.current.contains(event.target)
		) {
			this.setState({ isThreeDotsDropdown: false });
		}
	};
	handlePreview = (type, e) => {
		if (e === 'd') {
			this.setState(
				{
					previewType: 'd',
					preview: false,
				},
				() => {
					this.props.setPreview('d', false);
				},
			);
		} else {
			this.setState(
				{
					preview: true,
					previewType: e,
				},
				() => {
					this.props.setPreview(e, type);
				},
			);
		}
	};
	handleShare = () => {
		this.setState({ isShare: true }, () => {
			this.props.handleShare(this.state.isShare);
		});
	};
	// togglePreview = (type, e) => {
	// 	this.setState({
	// 		preview: type,
	// 		previewType: this.state.previewType === 'ml' ? 'm' : 'ml',
	// 	})
	// }

	handleSettingEnabled = () => {
		this.setState(
			{
				settingEnabled: true,
			},
			() => {
				this.props.setSettingEnabled();
			},
		);
	};

	handlePublish = async (e) => {
		this.setState({ isLoader: true });
		await this.props.publish(e);
		// window.history.back();
	};

	render() {
		return (
			<div className="builder-header">
				<div className="h-left">
					<span
						style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
						className="tooltip"
						onClick={(e) => {
							if (this.state.preview) {
								this.handlePreview(false, 'd');
							} else {
								window.history.back();
							}
						}}
					>
						<>
							<Tooltip title="Back" placement="bottom">
								<BackArrow />
							</Tooltip>

							<span>
								{this.state.isWorkflow ? (
									<div className="document-name">Document</div>
								) : this.state.isFormTemplate ? (
									<div className="template-name">Form</div>
								) : (
									<div className="template-name">Template</div>
								)}
							</span>
						</>
					</span>{' '}
					<div className="meta-title-container">
						<MetaImage
							handleImageUploadGlobal={this.props.handleImageUploadGlobal}
							imageUrl={this.props.imageUrl}
						/>

						<>
							<Title
								title={this.state.title}
								updatePublishedTemplate={this.props.updatePublishedTemplate}
								isWorkflow={this.state.isWorkflow}
							/>
						</>
					</div>
				</div>
				{/* <div className="h-center">{this.renderModules()}</div> */}
				<div className="h-right">
					<div className="device-view">
						<Tooltip title="Desktop View" placement="bottom">
							<span
								onClick={(e) => this.handlePreview(false, 'd')}
								className={` tooltip ${
									this.state.previewType === 'd' ? 'active' : ''
								} `}
								style={{
									cursor: 'pointer',
									// display: this.state.previewType === 'd' ? 'none' : 'block',
								}}
							>
								<Desktop />
							</span>
						</Tooltip>
						<Tooltip title="Mobile View" placement="bottom">
							<span
								onClick={(e) => this.handlePreview(true, 'm')}
								className={`tooltip ${
									this.state.previewType === 'm' && this.state.preview
										? 'active'
										: ''
								}`}
								style={{
									cursor: 'pointer',
									// display: this.state.previewType === 'm' ? 'none' : 'block',
								}}
							>
								<Mobile />
							</span>
						</Tooltip>
						{/* <Tooltip title="Mobile Lock" placement="bottom">
						<span
							onClick={(e) => this.handlePreview(true, 'ml')}
							className={`tooltip ${
								this.state.previewType === 'ml' && this.state.preview
									? 'active'
									: ''
							}`}
							style={{
								cursor: 'pointer',
							}}
						>
							{this.state.mobileViewLocked ? <MobileLock /> : <MobileUnlock />}
							</span>
						</Tooltip> */}
					</div>
					{this.state.previewType === 'm' ? (
						''
					) : (
						<>
							<Divider />
							<div className="page-settings">
								<span className="h-right-icons">
									<Tooltip title="Manage Pages" placement="bottom">
										<span
											className="h-right-pages no-path-fill"
											onClick={(e) => {
												this.setState({ isLoader: true }, () => {
													this.props.managePages(e);
												});
											}}
											// style={{ textTransform: 'capitalize', background: 'none' }}
										>
											<PageIcon />
											<span className="page-count">
												{this.props.duplicateModules?.length}
											</span>
										</span>
									</Tooltip>
								</span>
								<span className="h-right-icons">
									<Tooltip title="Theme Settings">
										<span
											className="h-right-pages no-path-fill"
											onClick={this.props?.showThemeSettings}
										>
											<Settings />
										</span>
									</Tooltip>
								</span>
							</div>
							{!this.state.isEmbed && <Divider />}
							<>
								<span
									className="h-right-publish"
									onClick={(e) => {
										this.setState({ isLoader: true }, () => {
											this.props.publish(e);
										});
									}}
									style={{ textTransform: 'capitalize' }}
								>
									{this.state.isPublishLoading ? 'Saving...' : `Save`}
								</span>
								{!this.state.isWorkflow && (
									<span
										onClick={(e) => {
											e.stopPropagation();
											this.setState({
												isThreeDotsDropdown:
													!this.state.isThreeDotsDropdown,
											});
										}}
										className="three-dots-svg"
									>
										<Threedots />

										{this.state.isThreeDotsDropdown && (
											<div
												ref={this.threeDotsDropdownRef}
												className="three-dots-svg-dropdown"
											>
												{['Duplicate', 'Delete'].map((item) => {
													return (
														<span
															className="three-dots-svg-dropdown-item"
															onClick={(e) => {
																e.stopPropagation();
																if (item === 'Delete') {
																	this.props?.handleDeleteOpen(
																		true,
																	);
																} else {
																	this.props?.handleDuplicateTemplate();
																}
															}}
															style={{
																color:
																	item === 'Delete'
																		? '#C03744'
																		: '#E4E5E6',
															}}
														>
															{item}
														</span>
													);
												})}
											</div>
										)}
									</span>
								)}
							</>
						</>
					)}

					{/* <span
						onClick={(e) => this.handlePreview(true, 'd')}
					<span
						onClick={(e) => this.handlePreview(false, 'd')}
						className={` tooltip ${this.state.previewType === 'd' && this.state.preview ? 'active ' : ''
							}`}
					>
						<Desktop />
						<label className="tooltip-text">Desktop&nbsp;View</label>
					</span> */}
					{/* <span
						onClick={(e) => this.handlePreview(true, 'm')}
						className={`tooltip ${this.state.previewType === 'm' && this.state.preview ? 'active' : ''
							}`}
					>
						<Mobile />
						<label className="tooltip-text">Mobile&nbsp;View</label>
					</span> */}

					{/* <span
						onClick={(e) => this.handlePreview(true, 'ml')}
						className={`tooltip ${this.state.previewType === 'ml' && this.state.preview ? 'active' : ''
							}`}
					>
					
						{this.state.mobileViewLocked ? <Locked /> : <Unlocked />}
						<label className="tooltip-text">Mobile View Lock</label>
					</span> */}

					{/* {this.props.params?.type &&
					this.props.params.type === 'customize' ? (
						<a onClick={(e) => this.props.saveSections(e)}>
							{this.state.isSaveLoading
								? 'Saving...'
								: 'Use this Template'}
						</a>
					) : (
						<a
							onClick={(e) => this.props.saveSections(e)}
							style={{ textTransform: 'capitalize' }}
						>
							{this.state.isSaveLoading
								? 'Saving...'
								: `Save ${this.state.module}`}
						</a>
					)} */}
					{/* {this.state.preview ? ( */}
					{/* <a
							onClick={() => {
								this.handlePreview(false, 'd');
							}}
							style={{ textTransform: 'capitalize' }}
						>
							Exit Preview
						</a> */}
					{/* // ) : ( */}
					<>
						{this.props.isWorkflow &&
						this.state.previewType !== 'm' &&
						!this.state.isEmbed ? (
							<>
								{/* <span
									className="h-right-publish"
									// getting props error
									// onClick={(e) => {
									// 	this.props?.toggleSideBar();
									// }}
									style={{ textTransform: 'capitalize' }}
								>
									Edit Details
								</span> */}
								{/* <span
									className="h-right-publish"
									onClick={(e) => {
										this.handleShare();
									}}
									style={{ textTransform: 'capitalize' }}
								>
									Share
								</span> */}

								{/* <>
									<span
										className="h-right-publish"
										onClick={(e) => {
											this.setState({ isLoader: true }, () => {
												this.props.publish(e);
											});
										}}
										style={{ textTransform: 'capitalize' }}
									>
										{this.state.isPublishLoading ? 'Saving...' : `Save`}
									</span>
									{!this.state.isWorkflow &&
										<span
											onClick={(e) => {
												e.stopPropagation();
												this.setState({
													isThreeDotsDropdown: !this.state.isThreeDotsDropdown,
												});
											}}
											className="three-dots-svg"
										>
											<Threedots />

											{this.state.isThreeDotsDropdown && (
												<div
													ref={this.threeDotsDropdownRef}
													className="three-dots-svg-dropdown"
												>
													{['Duplicate', 'Delete'].map((item) => {
														return (
															<span
																className="three-dots-svg-dropdown-item"
																onClick={(e) => {
																	e.stopPropagation();
																	if (item === 'Delete') {
																		this.props?.handleDeleteOpen(true);
																	} else {
																		this.props?.handleDuplicateTemplate();
																	}
																}}
																style={{
																	color:
																		item === 'Delete'
																			? '#C03744'
																			: '#E4E5E6',
																}}
															>
																{item}
															</span>
														);
													})}
												</div>
											)}
										</span>
									}
								</> */}
							</>
						) : this.state.previewType === 'm' ? (
							''
						) : (
							<></>
						)}
					</>
				</div>
			</div>
		);
	}
}

export default withRouter(Header);
