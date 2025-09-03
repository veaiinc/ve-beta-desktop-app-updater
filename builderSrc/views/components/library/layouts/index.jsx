import React, { Component } from 'react';
import Text from '../elements/text';
import ImageItem from '../elements/image';
import Shape from '../elements/shape';
import './index.scss';
import _ from 'lodash';
import { gsap } from 'gsap';
import Button from '../elements/button';
import Sticker from '../elements/sticker';
import Loader from '../elements/loader/index.jsx';
import CircleText from '../elements/circletext/CircleText.jsx';
import Icon from '../elements/icons/index.jsx';
import ListIcon from '../elements/listicon/index.jsx';
import Line from '../elements/line/index.jsx';
import LogoSticker from '../elements/logosticker/index.jsx';
import Video from '../elements/video/index.jsx';
import ReactPlayer from 'react-player';
import ScrollText from '../elements/scrolltext/index.jsx';
import IframeItem from '../elements/iframe/index.jsx';
import JNumber from '../elements/jnumber';
import JIcon from '../elements/jicon';
import Up from './actions/up.jsx';

//import Proposals from "../../../controllers/proposals";
const disabledModules = ['contract', 'invoice', 'thankyou'];
const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
const animationSpeedSec = [{ slow: 10 }, { medium: 5 }, { fast: 1 }];
import randomize from 'randomatic';
import { ReactComponent as AddBlock } from '../svgs/LeftBar/Addblock.svg';
import { ReactComponent as AddBlank } from '../svgs/LeftBar/AddBlank.svg';
import { ReactComponent as NewDelete } from '../svgs/LeftBar/NewDelete.svg';
import { ReactComponent as NewDown } from '../svgs/LeftBar/NewDown.svg';
import { ReactComponent as NewEdit } from '../svgs/LeftBar/NewEdit.svg';
import { ReactComponent as NewCopy } from '../svgs/LeftBar/NewCopy.svg';
import { ReactComponent as NewUp } from '../svgs/LeftBar/NewUp.svg';

class Layout extends Component {
	constructor(props) {
		super();
		this.state = {
			showBlockOptions: false,
			showBlockActions: false,
			activeFontColor: props.activeFontColor,
			actionType: props.actionType,
			actionValue: props.actionValue,
			crop: props.crop,
			zoom: props.zoom,
			style: props.style,
			blocks: props.blocks,
			activeSectionID: props.activeSectionID,
			sectionID: props._id,
			activeTextBlock: props.activeTextBlock,
			preview: props.preview,
			previewType: props.previewType,
			activeVariableID: props.activeVariableID,
			activeVariableName: props.activeVariableName,
			subBlockID: props.subBlockID,
			activeSubBlockId: props.activeSubBlockId,
			isActiveSection: props.isActiveSection,
			sectionType: props?.sectionType,
			randomString: randomize('A', 5),
			showHide: false,
			activeAnimation: props.activeAnimation,
			animationSpeed: props.animationSpeed,
			animationDirection: props.animationDirection,
			animationType: props.animationType,

			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,

			contractVariables: props.contractVariables,
			socialMediaLinks: props?.socialMediaLinks,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			iframeScroll: props?.iframeScroll,
			setIconLink: false,
		};
		this.blockRef = React.createRef();
		this.boxRefs = [];
	}
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
		this.animateSection();

		if (this.blockRef.current) {
			if (this.state.activeAnimation > 0) {
				this.observer?.observe(this.blockRef.current);
			}
		}
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
		}
		if (this.state.triggeredFont !== nextProps.triggeredFont) {
			this.setState({
				triggeredFont: nextProps.triggeredFont,
			});
		}

		if (this.state.activeFontColor !== nextProps.activeFontColor) {
			this.setState({
				activeFontColor: nextProps.activeFontColor,
			});
		}
		if (this.state.activeSubBlockId !== nextProps.activeSubBlockId) {
			this.setState({
				activeSubBlockId: nextProps.activeSubBlockId,
			});
		}
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.activeTextBlock !== nextProps.activeTextBlock) {
			this.setState({
				activeTextBlock: nextProps.activeTextBlock,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.activeSectionID !== nextProps.activeSectionID) {
			this.setState({
				activeSectionID: nextProps.activeSectionID,
			});
		}
		if (this.state.animationDirection !== nextProps.animationDirection) {
			this.setState(
				{
					animationDirection: nextProps.animationDirection,
				},
				() => this.reanimateSection(),
			);
		}
		if (this.state.animationSpeed !== nextProps.animationSpeed) {
			this.setState(
				{
					animationSpeed: nextProps.animationSpeed,
				},
				() => this.reanimateSection(),
			);
		}
		if (this.state.animationType !== nextProps.animationType) {
			this.setState(
				{
					animationType: nextProps.animationType,
				},
				() => this.reanimateSection(),
			);
		}
		if (this.state.activeAnimation !== nextProps.activeAnimation) {
			this.setState(
				{
					activeAnimation: nextProps.activeAnimation,
				},
				() => this.reanimateSection(),
			);
		}
		if (this.state.crop !== nextProps.crop) {
			this.setState({
				crop: nextProps.crop,
			});
		}
		if (this.state.zoom !== nextProps.zoom) {
			this.setState({
				zoom: nextProps.zoom,
			});
		}
		if (this.state.blocks !== nextProps.blocks) {
			this.setState({
				blocks: nextProps.blocks,
			});
		}
		if (this.state.style !== nextProps.style && nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
			if (_.has(nextProps.style, 'count')) {
				if (this.state.style.count !== nextProps.style.count) {
					setTimeout(
						function () {
							gsap.fromTo(
								'.listAnimation',
								{ opacity: 0 },
								{
									opacity: 1,
									duration: 0.1,
									stagger: 0.1,
									ease: 'power2.out',
								},
							);
						}.bind(this),
						100,
					);
				}
			}
		}
		if (this.state.sectionID !== nextProps._id) {
			this.setState({
				sectionID: nextProps._id,
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
		if (this.state.activeVariableID !== nextProps.activeVariableID) {
			this.setState({
				activeVariableID: nextProps.activeVariableID,
			});
		}
		if (this.state.activeVariableName !== nextProps.activeVariableName) {
			this.setState({
				activeVariableName: nextProps.activeVariableName,
			});
		}
		if (this.state.subBlockID !== nextProps.subBlockID) {
			this.setState({
				subBlockID: nextProps.subBlockID,
			});
		}
		if (this.state.isActiveSection !== nextProps.isActiveSection) {
			this.setState(
				{
					isActiveSection: nextProps.isActiveSection,
				},
				() => {
					this.setState({
						showBlockOptions: nextProps.isActiveSection,
					});
				},
			);
		}
		if (this.state.sectionType !== nextProps.sectionType) {
			this.setState({
				sectionType: nextProps.sectionType,
			});
		}
		// for bg types -Abdullah
		if (this.state.backgroundType !== nextProps.backgroundType) {
			this.setState({
				backgroundType: nextProps.backgroundType,
			});
		}
		if (this.state.backgroundImageURL !== nextProps.backgroundImageURL) {
			this.setState({
				backgroundImageURL: nextProps.backgroundImageURL,
			});
		}
		if (this.state.backgroundVideoURL !== nextProps.backgroundVideoURL) {
			this.setState({
				backgroundVideoURL: nextProps.backgroundVideoURL,
			});
		}

		// for contract page

		if (this.state.contractVariables !== nextProps.contractVariables) {
			this.setState({
				contractVariables: nextProps.contractVariables,
			});
		}
		if (this.state.iframeScroll !== nextProps.iframeScroll) {
			this.setState({
				iframeScroll: nextProps.iframeScroll,
			});
		}
	};

	handleClickOutside = (event) => {
		// this.props.setPreviewType('b');
		if (this.blockRef.current && !this.blockRef.current.contains(event.target)) {
			this.setState({
				showBlockActions: false,
			});
		}
		if (this.blockRef.current && this.blockRef.current.contains(event.target)) {
			if (this.state.isActiveSection) {
				Object.values(this.boxRefs).forEach((ref, index) => {
					if (ref && !ref.contains(event.target)) {
						this.props.handleSetBlockTab(event);
					}
				});
			}
		}
	};
	reanimateSection = () => {
		// if (this.blockRef.current) {
		// 	if (this.state.activeAnimation > 0) {
		// 		this.observer?.observe(this.blockRef.current);
		// 	}
		// }
		// Object.values(this.boxRefs).forEach((ref, index) => {
		// 	if (ref) {
		// 		ref.style.animationName = 'unset';
		// 		ref.style.animationDuration = 'unset';
		// 		ref.style.animationTimingFunction = 'unset';
		// 		ref.style.animationFillMode = 'unset';
		// 	}
		// });
		// if (this.blockRef) {
		// 	this.blockRef.current.style.animationName = 'unset';
		// 	this.blockRef.current.style.animationDuration = 'unset';
		// 	this.blockRef.current.style.animationTimingFunction = 'unset';
		// 	this.blockRef.current.style.animationFillMode = 'unset';
		// }
		// this.animateSection();
	};
	animateSection = () => {
		// if (this.state.activeAnimation > 0) {
		// 	// let animationNames =
		// 	// 	this.state.animationType === 'slideIn' ? this.state.animationDirection : 'fadeIn';
		// 	// let animationDurations = `${this.getAnimationTiming()}s`;
		// 	// let animationTimingFunctions = 'ease';
		// 	// let animationFillModes = 'forwards';
		// 	this.observer = new IntersectionObserver(
		// 		(entries) => {
		// 			entries.forEach((entry) => {
		// 				if (entry.isIntersecting) {
		// 					if (this.state.activeAnimation === 1) {
		// 						Object.values(this.boxRefs).forEach((ref, index) => {
		// 							if (ref) {
		// 								ref.style.animationName =
		// 									this.state.animationType === 'slideIn'
		// 										? this.state.animationDirection
		// 										: 'fadeIn';
		// 								ref.style.animationDuration = `${this.getAnimationTiming()}s`;
		// 								ref.style.animationTimingFunction = 'ease';
		// 								ref.style.animationFillMode = 'forwards';
		// 							}
		// 						});
		// 					} else {
		// 						if (this.blockRef) {
		// 							if (this.blockRef) {
		// 								this.blockRef.current.style.animationName =
		// 									this.state.animationType === 'slideIn'
		// 										? this.state.animationDirection
		// 										: 'fadeIn';
		// 								this.blockRef.current.style.animationDuration = `${this.getAnimationTiming()}s`;
		// 								this.blockRef.current.style.animationTimingFunction =
		// 									'ease';
		// 								this.blockRef.current.style.animationFillMode = 'forwards';
		// 							}
		// 						}
		// 					}
		// 				}
		// 				// else {
		// 				// 	entry.target.classList.remove('visibled');
		// 				// 	this.boxRefs.forEach((ref, index) => {
		// 				// 		if (ref) {
		// 				// 			ref.classList.remove('visibled');
		// 				// 		}
		// 				// 	});
		// 				// }
		// 			});
		// 		},
		// 		{ threshold: 0.1 },
		// 	);
		// }
	};
	switchComponent = (
		type,
		properties,
		blockID,
		header = null,
		contentAlign = null,
		fillVideoBlock = null,
		cardColor = null,
		iconColor = null,
		jCount = null,
	) => {
		let concat2 = '';
		let concat1 = '';
		let subID2 = header === 'header' ? blockID : properties?._id;

		let sectionID = this.state?.sectionID;

		concat2 = subID2?.concat(sectionID?.toString());

		switch (type) {
			case 'text':
				return (
					<Text
						clientDetails={this.props?.clientDetails}
						currencySymbol={this.props?.currencySymbol}
						isWorkflow={this.props.isWorkflow}
						setTriggerFont={(e) => this.props.setTriggerFont(e)}
						triggerFont={this.state.triggerFont}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						triggeredFont={this.state.triggeredFont}
						text={properties.content}
						style={properties.styles}
						//divStyles={properties.divStyles}
						className={properties.className}
						// activeFontColor={this.state.activeFontColor}
						refID={header === 'header' ? blockID : concat2}
						reference={header === 'header' ? blockID : properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e, activeTextBlock) =>
							this.props.handleBSelection(e, activeTextBlock)
						}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						setContent={(e) =>
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								header === 'header' ? null : blockID,
								properties._id,
							)
						}
						preview={this.state.preview}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						activeVariableID={this.state.activeVariableID}
						activeVariableName={this.state.activeVariableName}
						subBlockID={header === 'header' ? blockID : concat2}
						variables={this.props.variables}
						client={this.props.client}
						module={this.props.module}
						activeVariable={(e) => this.props.setContractActiveVariable(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						sectionType={this.state.sectionType}
						header={header}
						clearStyling={() => this.props.clearStyle()}
						label={properties?.label}
						contractVariables={properties?.contractVariables}
						tables={this.props.tables}
						sections={this.props.sections}
						sectionBg={this.state.style?.sectionBackgroundColor}
						clientGrandTotal={this.props?.clientGrandTotal || 0}
					/>
				);

			case 'image':
				return (
					<ImageItem
						style={{
							...properties?.styles,
							...(this.props?.customisedImageStylesForPresentation || {}),
						}}
						crop={this.state.crop}
						zoom={this.state.zoom}
						preview={this.state.preview}
						previewType={this.state.previewType}
						imageUrl={properties.imageURL}
						imageSettings={properties.image_settings}
						settingData={(e) => this.props.imgSettingData(e)}
						setActiveImage={(e) =>
							this.props.activeImage(
								this.state.sectionID,
								blockID,
								properties._id,
								properties.imageURL,
								e,
							)
						}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={properties._id ? properties._id : null}
						client={this.props.client}
						label={properties?.label}
						ImgOverlayColor={properties?.ImgOverlayColor}
						ImgOverlayOpacity={properties?.ImgOverlayOpacity}
						uploadImageBase64={(e) => this.props.uploadImageBase64(e)}
						generateAIImages={(e) => this.props.generateAIImages(e)}
						generateAIText={(e) => this.props.generateAIText(e)}
						isLogo={properties?.isLogo}
						sectionBg={this.state.style?.sectionBackgroundColor}
					/>
				);

			case 'button':
				return (
					<Button
						setTriggerFont={(e) => this.props.setTriggerFont(e)}
						style={properties.styles}
						content={properties.content}
						// handleSelection={(e) => this.props.handleBSelection(e)}
						preview={this.state.preview}
						reference={properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e, activeTextBlock) =>
							this.props.handleBSelection(e, activeTextBlock)
						}
						setContent={(e) =>
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								blockID,
								properties._id,
							)
						}
						setTab={(e) => this.props.handleSetTab('bt', properties._id, blockID)}
						setTextTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						setLink={(e) => this.props.setButtonLink(e)}
						setOpenNewTab={(e) => this.props.setNewTab(e)}
						href={properties.href ? properties.href : ''}
						openInNewTab={properties.openInNewTab ? properties.openInNewTab : false}
						shape={properties.shape ? properties.shape : ''}
						btStyles={properties.btStyles ? properties.btStyles : ''}
						setBtStyles={(e) => this.props.setButtonStyles(e)}
						setShape={(e) => this.props.btShape(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={concat2}
						activeFontColor={this.state.activeFontColor}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						subBlockID={concat2}
						sectionType={this.state.sectionType}
						label={properties?.label}
						clearStyling={() => this.props.clearStyle()}
						sectionBg={this.state.style?.sectionBackgroundColor}
						triggerFont={this.state.triggerFont}
						setTriggeredFont={(e) =>
							this.setState({
								triggeredFont: e,
							})
						}
						handleOpenAcceptProposalModal={this.props.handleOpenAcceptProposalModal}
						client={this.props.client}
						properties={properties}
						getModuleInfo={(id, type) => this.props.getModuleInfo(id, type)}
						scrollToSection={(id) => this.props.scrollToSection(id)}
						status={this.props.status}
					/>
				);
			case 'sticker':
				return (
					<Sticker
						content={properties.content}
						setContent={(e) =>
							this.props.setSubBlockContent(
								e,
								this.state.sectionID,
								blockID,
								properties._id,
							)
						}
						divStyles={properties.divStyles}
						textStyles={properties.textStyles}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						activeSubBlockId={this.state.activeSubBlockId}
						reference={properties.reference}
						// text={properties.content}
						sectionType={this.state.sectionType}
						subBlockID={concat2}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						refID={concat2}
						activeFontColor={this.state.activeFontColor}
						setTextTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						handleSelection={(e, activeTextBlock) =>
							this.props.handleBSelection(e, activeTextBlock)
						}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						isSticker={properties.isSticker}
						stickerFill={this.state.style?.stickerFill}
						stickerStroke={this.state.style?.stickerStroke}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						clearStyling={() => this.props.clearStyle()}
						stretch={properties?.stretch}
					/>
				);
			case 'shape':
				return (
					<Shape
						style={properties.styles}
						shape={properties.shape}
						crop={this.state.crop}
						zoom={this.state.zoom}
						preview={this.state.preview}
						previewType={this.state.previewType}
						imageUrl={properties.imageURL}
						imageSettings={properties.image_settings}
						setActiveImage={(e) =>
							this.props.activeImage(
								this.state.sectionID,
								blockID,
								properties._id,
								properties.imageURL,
								e,
							)
						}
						setActiveShape={(e) => this.props.handlesetActiveShape(properties.shape)}
						settingData={(e) => this.props.imgSettingData(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={properties._id ? properties._id : null}
						label={properties?.label}
						width={properties?.width}
						height={properties?.height}
						mShapeSize={properties?.mShapeSize}
						ImgOverlayColor={properties?.ImgOverlayColor}
						ImgOverlayOpacity={properties?.ImgOverlayOpacity}
						uploadImageBase64={(e) => this.props.uploadImageBase64(e)}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						sectionBg={this.state.style?.sectionBackgroundColor}
					/>
				);
			case 'circleText':
				return (
					<CircleText
						text={properties.text}
						radius={properties.radius}
						width={properties.width}
						style={properties.style}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						preview={this.state.preview}
						previewType={this.state.previewType}
						circleTextData={(e) => this.props.circleTextData(e)}
						label={properties?.label}
					/>
				);
			case 'icon':
				return (
					<Icon
						iconName={properties.iconName}
						fillColor={properties.fillColor}
						iconBgColor={properties.iconBgColor}
						iconType={properties.iconType}
						iconSize={properties.iconSize}
						divStyles={properties.divStyles}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						label={properties?.label}
						socialMediaLinks={this.state.socialMediaLinks}
						setIcon={(e) => this.props.handleSetIconLink(e, properties._id, blockID)}
						link={properties?.link}
						client={this.props.client}
						setIconLink={this.state.setIconLink}
						activeComponentLink={this.state.activeComponentLink == properties?._id}
						setModal={() =>
							this.setState({
								setIconLink: false,
								activeComponentLink: null,
							})
						}
					/>
				);
			case 'scrollText':
				return (
					<ScrollText
						text={properties.text}
						itemSpacing={properties.itemSpacing}
						scrollSymbol={properties.scrollSymbol}
						fontStyles={properties.fontStyles}
						width={properties.width}
						scrollStyles={properties.scrollStyles}
						className={properties.className}
						refID={properties._id ? properties._id : null}
						reference={properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e, activeTextBlock) =>
							this.props.handleBSelection(e, activeTextBlock)
						}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						preview={this.state.preview}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						activeVariableID={this.state.activeVariableID}
						activeVariableName={this.state.activeVariableName}
						subBlockID={this.state.subBlockID}
					/>
				);
			case 'listIcon':
				return (
					<ListIcon
						color={properties.color}
						shape={properties.shape}
						size={properties.size}
						listCount={properties.listCount}
						divStyles={properties.divStyles}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						label={properties?.label}
					/>
				);
			case 'line':
				return (
					<Line
						borderStyle={this.state.style.borderStyle}
						borderColor={this.state.style.borderColor}
						borderWidth={this.state.style.borderWidth}
						width={this.state.style.width}
						divStyles={properties.divStyles}
						contentAlign={contentAlign}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						label={properties?.label}
					/>
				);
			// logo Sticker -Abdullah
			case 'logoSticker':
				return (
					<LogoSticker
						fillColor={properties.fillColor}
						divStyles={properties.divStyles}
						className={properties.className}
						preview={this.state.preview}
						mclassName={properties.mclassNames}
						previewType={this.state.previewType}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						label={properties?.label}
					/>
				);
			// iframe work -Abdullah
			case 'iframe':
				return (
					<IframeItem
						style={properties?.styles}
						source={properties?.source}
						height={properties?.height}
						// handleSelection={(e) => this.props.handleBSelection(e)}
						preview={this.state.preview}
						previewType={this.state.previewType}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						activeSubBlockId={this.state.activeSubBlockId}
						// refID={concat2}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						// subBlockID={concat2}
						sectionType={this.state.sectionType}
						label={properties?.label}
						iframeScroll={this.state.iframeScroll}
					/>
				);
			// video block -Abdullah
			case 'video':
				return (
					<Video
						style={properties?.styles}
						videoURL={properties?.videoURL}
						loop={properties?.loop}
						autoplay={properties?.autoplay}
						preview={this.state.preview}
						reference={properties.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						setIsValidURL={(e) => {
							this.props.handleIsValidURL(e);
						}}
						setTab={(e) => this.props.handleSetTab(e, properties._id, blockID)}
						setLink={(e) => this.props.setButtonLink(e)}
						setOpenNewTab={(e) => this.props.setNewTab(e)}
						href={properties.href ? properties.href : ''}
						openInNewTab={properties.openInNewTab ? properties.openInNewTab : false}
						activeSubBlockId={this.state.activeSubBlockId}
						// refID={concat2}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state.activeTextBlock}
						// subBlockID={concat2}
						sectionType={this.state.sectionType}
						label={properties?.label}
						fillVideoBlock={fillVideoBlock}
					/>
				);

			// for journey
			case 'jNumber':
				return (
					<JNumber
						cardColor={cardColor}
						cardBorder={this.hexToRgba(cardColor, 0.2)}
						color={iconColor}
						className={properties?.className}
						value={jCount}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state?.activeTextBlock}
						preview={this.state.preview}
						previewType={this.state.previewType}
						setTab={(e) => this.props?.handleSetTab(e, properties._id, blockID)}
						subBlockID={this.state.subBlockID}
					/>
				);
			case 'jIcon':
				return (
					<JIcon
						cardColor={cardColor}
						icon={properties?.icon}
						color={iconColor || properties?.color}
						size={properties?.size}
						className={properties?.className}
						activeSectionID={this.state.activeSectionID}
						sectionID={this.state.sectionID}
						activeTextBlock={this.state?.activeTextBlock}
						preview={this.state.preview}
						previewType={this.state.previewType}
						setTab={(e) => this.props?.handleSetTab(e, properties._id, blockID)}
						subBlockID={this.state.subBlockID}
					/>
				);

			case 'loader':
				return <Loader />;

			default:
				return (
					<Text
						clientDetails={this.props?.clientDetails}
						currencySymbol={this.props?.currencySymbol}
						text={properties.content}
						style={properties.styles}
						divStyles={properties.divStyles}
						className={properties.className}
						activeFontColor={this.state.activeFontColor}
						reference={properties.reference ? properties.reference : null}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e) => this.props.handleBSelection(e)}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={properties._id ? properties._id : null}
						sectionType={this.state.sectionType}
						label={properties?.label}
						client={this.props?.client}
						module={this.props?.module}
						clientGrandTotal={this.props?.clientGrandTotal}
					/>
				);
		}
	};

	toggleSideBar = (e) => {
		this.setState(
			{
				showBlockActions: true,
			},
			() => {
				this.props.handleSideBar(e, this.props._id);
			},
		);
	};
	handleDeleteSection = (e) => {
		this.props.deleteSection(this.props._id);
	};
	handleBlock = (e) => {
		this.props.selectBlock('b');
	};
	returnSubBlock = (subBlockLabel) => {
		let display = 'flex';
		let labels = this.state.style.viewSubBlockOptions;
		if (_.size(labels) > 0) {
			let label = labels.find((obj) => obj.hasOwnProperty(subBlockLabel));
			if (label) {
				display = label[subBlockLabel] == true ? 'flex' : 'none';
			} else {
				display = 'flex';
			}
		} else {
			display = 'flex';
		}
		return display;
	};
	handleDuplicate = () => {
		this.props.duplicateBlock(this.props._id);
	};
	hanldeAddBlock = (e) => {
		e.stopPropagation();
		this.props.showAddBlock(e);
	};
	toggleShowHide = (e) => {
		this.setState({
			showHide: !this.state.showHide,
		});
	};
	getAnimationTiming = () => {
		const matchedAnimation = animationSpeedSec.find(
			(item) => Object.keys(item)[0] === this.state.animationSpeed, // Return the result of the comparison
		);

		const speed = matchedAnimation ? matchedAnimation[this.state.animationSpeed] : 0;

		return speed;
	};
	// fpr journey
	hexToRgba = (hex, alpha = 1) => {
		// Remove the '#' if present
		hex = hex.replace('#', '');

		// Parse the hex components
		const r = parseInt(hex.substring(0, 2), 16); // Red
		const g = parseInt(hex.substring(2, 4), 16); // Green
		const b = parseInt(hex.substring(4, 6), 16); // Blue

		// Return RGBA string
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	handleSetLink = (e) => {
		this.setState({
			setIconLink: true,
			activeComponentLink: e,
		});
	};
	render() {
		return (
			<div
				className={`block ${
					!this.state.preview &&
					this.state.showBlockOptions &&
					!disabledModules.includes(this.props.module)
						? 'borderedBlock '
						: ''
				} `}
				style={{
					flexDirection: 'column',
					backgroundColor:
						this.props.module === 'thankyou'
							? ''
							: this.state.style?.backgroundType !== 'video' &&
							  this.state.style?.backgroundType !== 'image' &&
							  this.state.style?.sectionBackgroundColor,
					backgroundImage:
						this.state.style?.backgroundType == 'image' &&
						`url(${this.state.style.backgroundImageURL})`,
					// backgroundSize: '100% 100%',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					// aspectRatio: 16/9,
					position: 'relative',
					border: this.state.preview ? 'none' : '',
				}}
				onClick={(e) => {
					if (this.state.preview !== true) {
						this.toggleSideBar(e);
					}
				}}
				onMouseEnter={() => {
					if (this.state.preview !== true) {
						this.setState({ showBlockOptions: true });
					}
				}}
				onMouseLeave={() => {
					if (this.state.isActiveSection == false) {
						this.setState({ showBlockOptions: false });
					}
				}}
				ref={this.blockRef}
			>
				{this.state.sectionType &&
				(this.state.sectionType === 'list' || this.state.sectionType === 'text') &&
				_.has(this.state.style, 'foldBlock') &&
				this.state.style.foldBlock == true ? (
					<div
						style={{
							display: 'flex',
							minHeight: '150px',
							width: '100%',
							position: 'relative',
							zIndex: 1,
						}}
						className="show-hide"
					>
						<button
							onClick={(e) => {
								this.toggleShowHide(e);
								this.props?.handleSetTab('fbs');
							}}
							style={{
								backgroundColor: this.state?.style?.foldButtonStyles?.background,
								border: !this.state?.style?.foldButtonStyles?.borderColor && 'none',
								borderColor: this.state?.style?.foldButtonStyles?.borderColor,
								borderWidth: `${this.state?.style?.foldButtonStyles?.borderWidth}px`,
							}}
							className={this.state?.style?.foldButtonStyles?.btStyle}
						>
							{this.state.showHide ? (
								<Down color={this.state?.style?.foldButtonStyles?.fontColor} />
							) : (
								<Up color={this.state?.style?.foldButtonStyles?.fontColor} />
							)}
							<span style={{ color: this.state?.style?.foldButtonStyles?.fontColor }}>
								{this.state?.style?.foldBlockText
									? this.state?.style?.foldBlockText
									: 'Show / Hide'}
							</span>
						</button>
					</div>
				) : (
					''
				)}

				{this.state.style?.backgroundType == 'video' ||
					(this.state.style?.backgroundType == 'image' && (
						<div
							className="bg-overlay"
							style={{
								backgroundColor: this.state.style?.bgOverlayColor,
								opacity: this.state.style?.bgOverlayOpacity / 100,
							}}
						></div>
					))}
				{this.state.style?.backgroundType == 'video' &&
					this.state.style?.backgroundVideoURL && (
						<div className="bg-video-player">
							<ReactPlayer
								url={this.state.style.backgroundVideoURL}
								width="100%"
								height="100%"
								loop={true}
								onError={(e) => {
									this.props.handleIsValidBgVideoURL(false);
								}}
								onReady={(e) => this.props.handleIsValidBgVideoURL(true)}
								playing={true}
								muted
								controls={false}
							/>
						</div>
					)}

				<div
					// className='hfhgbdfg'
					style={{
						display:
							this.state.sectionType === 'list' || this.state.sectionType === 'text'
								? this.state?.showHide && this.state?.style?.foldBlock
									? 'none'
									: 'flex'
								: 'flex',

						padding: this.state.style?.noPadding
							? ''
							: `${
									this.state?.style?.padding
										? padding[this.state?.style?.padding]
										: '0px'
							  } ${
									(this.state.previewType === 'm' ||
										this.state.previewType === 'ml') &&
									this.state.preview
										? this.state?.style?.noMPadding
											? '0px'
											: '14px'
										: this.state.style?.paddingHorizontal
										? paddingHorizontal[this.state.style.paddingHorizontal]
										: '0px'
							  }`,

						zIndex: 1,
						...(_.has(this.state.style, 'heading')
							? {
									flexDirection: 'column',
									display:
										this.state.sectionType === 'list' ||
										this.state.sectionType === 'text'
											? this.state.showHide
												? 'none'
												: 'flex'
											: 'flex',
							  }
							: {}),
					}}
				>
					{this.state.showBlockActions &&
					this.state.preview == false &&
					!disabledModules.includes(this.props.module) ? (
						<div className="block-action-bar">
							<span className="tooltip" onClick={(e) => this.handleBlock(e)}>
								<NewEdit />
								<label className="tooltip-text">Block&nbsp;Settings</label>
							</span>
							{!this.props?.activeModule?.showAsSlide && (
								<>
									<span
										className="tooltip"
										onClick={(e) => this.handleDuplicate(e)}
									>
										<NewCopy />
										<label className="tooltip-text">Duplicate</label>
									</span>

									<span
										className="tooltip"
										onClick={() => {
											this.props.moveItem(
												this.props.index,
												this.props.index + 1,
												this.state.activeSectionID,
												'down',
											);
										}}
										disabled={
											this.props.sortedIndex === this.props.itemsLength - 1
										}
										style={{
											cursor:
												this.props.sortedIndex ===
												this.props.itemsLength - 1
													? 'not-allowed'
													: 'pointer',
										}}
									>
										<NewDown />
										<label className="tooltip-text">Down</label>
									</span>

									<span
										className="tooltip"
										onClick={() => {
											this.props.moveItem(
												this.props.index,
												this.props.index - 1,
												this.state.activeSectionID,
												'up',
											);
										}}
										disabled={this.props.sortedIndex === 0}
										style={{
											cursor:
												this.props.sortedIndex === 0
													? 'not-allowed'
													: 'pointer',
										}}
									>
										<NewUp />
										<label className="tooltip-text">Up</label>
									</span>
								</>
							)}
							{this.props.module === 'form' ? (
								''
							) : (
								<span
									className="tooltip"
									onClick={(e) => this.handleDeleteSection(e)}
								>
									<NewDelete />
									<label className="tooltip-text">Delete</label>
								</span>
							)}
						</div>
					) : (
						''
					)}

					{this.state.preview == false &&
					this.state.showBlockOptions &&
					this.props.module !== 'form' &&
					!this.props?.activeModule?.showAsSlide &&
					!disabledModules.includes(this.props.module) ? (
						// <a className="add-block" onClick={(e) => this.hanldeAddBlock(e)}>
						// 	Add Block
						// </a>
						<div
							className="add-block-new-container"
							onClick={(e) => this.hanldeAddBlock(e)}
						>
							<div
								onClick={(e) => this.hanldeAddBlock(e)}
								className="addBlankContainer"
							>
								<AddBlock />
								{/* <label className="tooltip-text">Add Block</label> */}
							</div>
							<div className="addBlockDividerContainer">
								<div className="addBlockDivider"></div>
							</div>
							<div>
								{this.state.isElement !== true ? (
									<div
										className={`addBlank ${
											this.state.activeTab === 'fluid' ? 'active' : ''
										}`}
										// onClick={(e) => this.props.handleAddLayout(null, true)}
										// onClick={(e) => this.hanldeAddBlock(e)}
										// onMouseEnter={(e) => this.setActiveTab('fluid')}
									>
										<p style={{ color: 'white', fontSize: '14px' }}>Add</p>
									</div>
								) : (
									''
								)}
								{/* 
								<label className="tooltip-text">Add Blank</label> */}
							</div>
						</div>
					) : (
						''
					)}

					{_.has(this.state.style, 'heading') ? (
						<div className="row w-100p">
							<div
								className="column"
								style={{
									display: 'flex',

									...(_.has(this.state.style.heading, 'divStyles')
										? this.state.style.heading.divStyles
										: {}),
								}}
							>
								{this.switchComponent(
									this.state.style.heading.type,
									this.state.style.heading,
									'header' + this.state?.sectionID?.toString(),
									'header',
									null,
								)}
							</div>
						</div>
					) : null}
					<div
						// className={`layout ${
						// 	_.has(this.state, 'style') &&
						// 	_.has(this.state.style, 'blocksClassName') &&
						// 	!_.has(this.state.style, 'heading')
						// 		? _.has(this.state.style, 'mblocksClassName') &&
						// 		  this.state.previewType === 'm' &&
						// 		  this.state.preview
						// 			? _.has(
						// 					this.state.style,
						// 					'flipmblockClassName'
						// 			  ) && this.state.style?.flip == true
						// 				? this.state.style.blocksClassName +
						// 				  ' ' +
						// 				  this.state.style.mblocksClassName +
						// 				  ' ' +
						// 				  this.state.style.flipmblockClassName
						// 				: this.state.style.blocksClassName +
						// 				  ' ' +
						// 				  this.state.style.mblocksClassName
						// 			: _.has(
						// 					this.state.style,
						// 					'flipblocksClassName'
						// 			  ) && this.state.style.flip == true
						// 			? this.state.style.blocksClassName +
						// 			  ' ' +
						// 			  this.state.style.flipblocksClassName
						// 			: this.state.style.blocksClassName
						// 		: _.has(this.state.style, 'heading')
						// 		? _.has(this.state.style, 'mblocksClassName') &&
						// 		  this.state.previewType === 'm' &&
						// 		  this.state.preview
						// 			? `${this.state.style.mblocksClassName} d-flex`
						// 			: 'd-flex'
						// 		: 'd-flex-column'
						// } ${
						// 	_.has(this.state.style, 'heading')
						// 		? this.state.style.rowsClassName
						// 		: ''
						// }`}
						className={`layout ${
							_.has(this.state, 'style') &&
							_.has(this.state.style, 'blocksClassName') &&
							!_.has(this.state.style, 'heading')
								? _.has(this.state.style, 'mblocksClassName') &&
								  this.state.previewType === 'm' &&
								  this.state.preview
									? _.has(this.state.style, 'mImagePositionStyles') &&
									  this.state.style?.mimagePosition == true
										? this.state.style.blocksClassName +
										  ' ' +
										  this.state.style.mblocksClassName +
										  ' ' +
										  this.state.style.mImagePositionStyles
										: this.state.style.blocksClassName +
										  ' ' +
										  this.state.style.mblocksClassName
									: this.state.style.blocksClassName +
									  ' ' +
									  this.state?.style?.imagePositionStyles
								: _.has(this.state.style, 'heading')
								? _.has(this.state.style, 'mblocksClassName') &&
								  this.state.previewType === 'm' &&
								  this.state.preview
									? `${this.state.style.mblocksClassName} d-flex`
									: 'd-flex'
								: 'd-flex-column'
						} ${
							_.has(this.state.style, 'heading') ? this.state.style.rowsClassName : ''
						}
						
						${this.props.module === 'thankyou' && this.state.previewType === 'm' ? 'p-60p-imp' : ''}
						`}
						style={{
							display: 'flex',
							// height:"100vh !important",
							width: '100%',
							// height: this.props.module === 'proposal' ? '100vh' : 'auto',

							// list spacing code  -abdullah

							gap: `${
								_.has(this.state.style, 'listSpacing') &&
								_.has(this.state.style, 'gap')
									? `${this.state?.style?.gap}px`
									: '40px'
							}`,

							// video alignment -Abdullah
							justifyContent:
								_.has(this.state.style, 'alignVideoBlock') &&
								this.state.style.alignVideoBlock,

							padding:
								this.state.style?.innerPadding &&
								this.state.style?.imgLayoutPadding &&
								`${
									this.state.style?.padding
										? padding[this.state.style.padding]
										: '0px'
								} ${
									this.state.previewType === 'm' && this.state.preview
										? '14px'
										: '0px'
								}`,
							backgroundColor:
								_.has(this.state.style, 'cartBackgroundColor') &&
								this.state.style.cartBackgroundColor,
						}}
					>
						{_.map(this.state.blocks, (row, key) => {
							return (
								<div
									key={key}
									className={`row ${
										_.has(row, 'className')
											? _.has(row, 'mclassName') &&
											  this.state.previewType === 'm' &&
											  this.state.preview
												? row.className + ' ' + row.mclassName
												: row.className
											: ''
									} ${_.has(row, 'contentAlign') ? row.contentAlign : ''}
									${this.props.module === 'thankyou' && this.state.previewType === 'm' ? 'w-100p-imp' : ''}

									
									`}
									style={
										this.props.module === 'thankyou'
											? {
													backgroundColor:
														this.props.module === 'thankyou'
															? this.state.style
																	?.sectionBackgroundColor
															: '',
											  }
											: _.has(row, 'icons') && row?.icons
											? {
													backgroundColor:
														this.props.module === 'thankyou'
															? this.state.style
																	?.sectionBackgroundColor
															: '',
													gap: `${this.state?.style?.gap}px`,
													justifyContent: this.state?.style?.iconsAlign,
													background: `${
														_.has(row, 'backgroundlabel') &&
														_.has(
															this.state.style,
															'subBlocksBackground',
														) &&
														_.size(
															this.state.style.subBlocksBackground,
														) > 0
															? this.state.style.subBlocksBackground[
																	row.backgroundlabel
															  ]
															: ''
													}`,
											  }
											: {
													// previouse logic
													// background: `${
													// 	_.has(row, 'backgroundlabel') &&
													// 	_.has(
													// 		this.state.style,
													// 		'subBlocksBackground',
													// 	) &&
													// 	_.size(
													// 		this.state.style.subBlocksBackground,
													// 	) > 0
													// 		? this.state.style.subBlocksBackground[
													// 				row.backgroundlabel
													// 		  ]
													// 		: ''
													// }`,
													background: (() => {
														// Check for cardColor condition
														if (
															_.has(row, 'cardColor') &&
															this.state?.style?.hasJourney
														) {
															return this.hexToRgba(
																row?.cardColor,
																0.2,
															);
														}

														// Check for backgroundlabel condition
														if (
															_.has(row, 'backgroundlabel') &&
															_.has(
																this.state.style,
																'subBlocksBackground',
															) &&
															_.size(
																this.state.style
																	.subBlocksBackground,
															) > 0
														) {
															return this.state.style
																.subBlocksBackground[
																row.backgroundlabel
															];
														}
														// Default case
														return '';
													})(),

													// list spacing code -Abdullah
													gap: `${
														_.has(row, 'listSpacing') &&
														_.has(this.state.style, 'gap')
															? `${this.state?.style?.gap}px`
															: ''
													}`,
													display: `${
														_.filter(row.subBlocks, (component) => {
															return _.has(component, 'listCount');
														}).length > 2
															? ''
															: _.some(row.subBlocks, (component) => {
																	return (
																		_.has(
																			component,
																			'listCount',
																		) &&
																		this.state.style.count <
																			component.listCount
																	);
															  })
															? 'none'
															: ''
													}`,

													// video block fill container -Abdullah
													width:
														_.has(row, 'fillVideoBlock') &&
														row.fillVideoBlock &&
														'100% ',
													height:
														_.has(row, 'fillVideoBlock') &&
														row.fillVideoBlock
															? '100%'
															: '',
													padding:
														this.state.style?.innerPadding &&
														_.has(row, 'paddingY') &&
														`${
															this.state.style?.padding
																? padding[this.state.style.padding]
																: '0px'
														} ${
															this.state.previewType === 'm' &&
															this.state.preview
																? '14px'
																: '0px'
														}`,

													// previouse logic
													// 	// for journey
													// display: this.state?.style?.hasJourney
													// ? `${_.has(row, 'jCount') &&
													// 	this.state?.style?.jCountValue &&
													// 	row?.jCount >
													// 	this.state?.style?.jCountValue
													// 	? 'none'
													// 	: 'grid'
													// }`
													// : '',
													// display: `${_.filter(row.subBlocks, (component) => {
													// 	return _.has(component, 'listCount');
													//  }).length > 2 ? "" : (_.some(row.subBlocks, (component) => {
													// 	return _.has(component, 'listCount') && this.state.style.count < component.listCount;
													//  }) ? "none" : "")}`
													display: (() => {
														const hasJourneyCondition =
															this.state?.style?.hasJourney &&
															_.has(row, 'jCount') &&
															this.state?.style?.jCountValue &&
															row?.jCount >
																this.state?.style?.jCountValue;

														const listCountCondition =
															_.filter(row.subBlocks, (component) =>
																_.has(component, 'listCount'),
															).length <= 2 &&
															_.filter(row.subBlocks, (component) =>
																_.has(component, 'listCount'),
															).length <= 2 &&
															_.some(row.subBlocks, (component) => {
																return (
																	_.has(component, 'listCount') &&
																	this.state?.style?.count <
																		component.listCount
																);
															});

														if (
															hasJourneyCondition ||
															listCountCondition
														) {
															if (
																hasJourneyCondition ||
																listCountCondition
															) {
																return 'none';
															}

															if (this.state?.style?.hasJourney) {
																return 'grid';
															}

															return '';
														}
													})(),
											  }
									}
								>
									{_.map(row.subBlocks, (component, k) => {
										if (
											_.has(component, 'listCount') &&
											this.state.style.count < component.listCount
										) {
											return null;
										} else if (_.has(component, 'hasParentDiv')) {
											return (
												<div className={component.parentDivClass} key={k}>
													<div
														className={`column ${
															_.has(component, 'className')
																? component.className
																: ''
														} `}
														style={{
															display: 'flex',

															...(_.has(component, 'divStyles')
																? component.divStyles
																: {}),
														}}
														key={k}
														ref={(el) => (this.boxRefs[k] = el)}
													>
														{this.switchComponent(
															component.type,
															component,
															row._id,
															null,
															_.has(row, 'contentAlign')
																? row.contentAlign
																: null,
														)}
													</div>
												</div>
											);
										} else {
											return (
												<div
													className={`column  ${
														_.has(component, 'className')
															? _.has(component, 'mclassName') &&
															  this.state.previewType === 'm' &&
															  this.state.preview
																? component.className +
																  '' +
																  component.mclassName
																: component.className
															: ''
													} ${
														_.has(component, 'mclassName') &&
														this.state.previewType === 'm' &&
														this.state.preview
															? component.mclassName
															: ''
													} ${
														_.has(component, 'device')
															? component.device
															: ''
													} ${
														_.has(component, 'border')
															? component.border
															: ''
													}`}
													style={{
														// display: _.has(component, 'label')
														// 	? _.has(
														// 			this.state.style,
														// 			'viewSubBlockOptions',
														// 	  )
														// 		? this.returnSubBlock(
														// 				component.label,
														// 		  )
														// 		: 'flex'
														// 	: 'flex',

														// for journey block
														display: (() => {
															// Check jLine condition
															if (
																_.has(component, 'jLIne') &&
																this.state?.style?.jCountValue &&
																row.jCount ==
																	this.state?.style?.jCountValue
															) {
																return 'none';
															}

															// Check label condition
															if (_.has(component, 'label')) {
																if (
																	_.has(
																		this.state.style,
																		'viewSubBlockOptions',
																	)
																) {
																	return this.returnSubBlock(
																		component.label,
																	);
																}
																return 'flex';
															}

															return 'flex';
														})(),

														background: (() => {
															// Check for sameLineColor condition first
															if (
																_.has(component, 'sameLineColor') &&
																this.state?.style?.hasJourney &&
																row?.cardColor
															) {
																return this.hexToRgba(
																	row?.cardColor,
																	0.6,
																);
															}

															// Check for backgroundlabel condition
															if (
																_.has(
																	component,
																	'backgroundlabel',
																) &&
																_.has(
																	this.state.style,
																	'subBlocksBackgroundColor',
																) &&
																_.size(
																	this.state.style
																		.subBlocksBackgroundColor,
																) > 0
															) {
																return this.state.style
																	.subBlocksBackgroundColor[
																	component.backgroundlabel
																];
															}

															// Check for sameBgCircle condition
															if (
																_.has(component, 'sameBgCircle') &&
																_.has(
																	this.state.style,
																	'sectionBackgroundColor',
																)
															) {
																return this.state.style
																	.sectionBackgroundColor;
															}

															// check for table Column colour

															if (
																this.state?.style?.hasTable &&
																_.has(component, 'TableColumnColor')
															) {
																return component?.TableColumnColor;
															}
															// Default return
															return '';
														})(),

														borderColor: `${
															_.has(component, 'borderlabel') &&
															_.has(
																this.state.style,
																'subBlocksBorderColor',
															) &&
															_.size(
																this.state.style
																	.subBlocksBorderColor,
															) > 0
																? this.state.style
																		.subBlocksBorderColor[
																		component.borderlabel
																  ]
																: _.has(
																		component,
																		'sameBgBorder',
																  ) &&
																  _.has(
																		this.state.style,
																		'sectionBackgroundColor',
																  )
																? this.state.style
																		.sectionBackgroundColor
																: ''
														}`,

														width:
															(_.has(component, 'device') &&
																(component?.device == 'desktop' &&
																this.state?.previewType === 'm'
																	? '315px'
																	: '')) ||
															(component?.device == 'tab' &&
															this.state?.previewType === 'm'
																? '312px'
																: '') ||
															(component?.device == 'mobile' &&
															this.state?.previewType === 'm'
																? '311px'
																: ''),
														height:
															(_.has(component, 'device') &&
																(component?.device == 'desktop' &&
																this.state?.previewType === 'm'
																	? '236px'
																	: '')) ||
															(component?.device == 'tab' &&
															this.state?.previewType === 'm'
																? '417px'
																: '') ||
															(component?.device == 'mobile' &&
															this.state?.previewType === 'm'
																? '666px'
																: ''),

														...(_.has(component, 'divStyles')
															? component.divStyles
															: {}),
													}}
													key={k}
													ref={(el) =>
														(this.boxRefs[component?._id] = el)
													}
												>
													<>
														{this.switchComponent(
															component.type,
															component,
															row._id,
															null,
															_.has(row, 'contentAlign')
																? row.contentAlign
																: null,
															_.has(row, 'fillVideoBlock') &&
																row.fillVideoBlock,
															_.has(row, 'cardColor') &&
																row?.cardColor,
															_.has(row, 'iconColor') &&
																row?.iconColor,
															_.has(row, 'jCount') && row?.jCount,
														)}
													</>
												</div>
											);
										}
									})}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default Layout;
