import React, { Component } from 'react';
import '../../../assets/scss/sidebar.scss';
import { gsap } from 'gsap';
import { ReactComponent as Aclose } from '../../../assets/svg/Aclose.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Center } from '../../../assets/svg/left.svg';
import { ReactComponent as Right } from '../../../assets/svg/center.svg';
import { ReactComponent as Left } from '../../../assets/svg/right.svg';
import { ReactComponent as Justify } from '../../../assets/svg/justify.svg';
import { ReactComponent as Upload } from '../../../assets/svg/upload.svg';
import { ReactComponent as Service1 } from '../../../assets/svg/service_table/1.svg';
import { ReactComponent as Service2 } from '../../../assets/svg/service_table/2.svg';
import { ReactComponent as Service3 } from '../../../assets/svg/service_table/3.svg';
import { ReactComponent as ServiceA } from '../../../assets/svg/service_table/a.svg';
import { ReactComponent as ServiceB } from '../../../assets/svg/service_table/b.svg';
import { ReactComponent as ServiceC } from '../../../assets/svg/service_table/c.svg';
import { ReactComponent as ImageLeft } from '../../../assets/svg/imageLeft.svg';
import { ReactComponent as ImageRight } from '../../../assets/svg/imageRight.svg';
import { ReactComponent as ImageBottom } from '../../../assets/svg/imageBottom.svg';
import { ReactComponent as ImageTop } from '../../../assets/svg/imageTop.svg';
import { ReactComponent as TextAlignBottom } from '../../../assets/svg/txtAlignBottom.svg';
import { ReactComponent as TextAlignTop } from '../../../assets/svg/txtAlignTop.svg';
import { ReactComponent as TextAlignCenter } from '../../../assets/svg/txtAlignCenter.svg';
import { ReactComponent as DropDown } from '../../../assets/svg/dropDown.svg';
import { ReactComponent as Border } from '../../../assets/svg/imageShape/border.svg';
import { ReactComponent as NoBorder } from '../../../assets/svg/imageShape/noborder.svg';
import { ReactComponent as HalfBorder } from '../../../assets/svg/imageShape/half-border.svg';
import { ReactComponent as DesktopIcon } from '../../../assets/svg/device_mockups/desktopIcon.svg';
import { ReactComponent as MobileIcon } from '../../../assets/svg/device_mockups/mobileIcon.svg';
import { ReactComponent as TabIcon } from '../../../assets/svg/device_mockups/tabIcon.svg';
import { ReactComponent as Instagram } from '../../../assets/svg/instagramIcons/normal-insta.svg';
import { ReactComponent as InstagramBorder } from '../../../assets/svg/instagramIcons/border-insta.svg';
import { ReactComponent as InstagramBackground } from '../../../assets/svg/instagramIcons/bg-insta.svg';
import { ReactComponent as PositionRight } from '../../../assets/svg/positionRight.svg';
import { ReactComponent as PositionCenter } from '../../../assets/svg/positionCenter.svg';
import { ReactComponent as PositionLeft } from '../../../assets/svg/positionLeft.svg';
import { ReactComponent as DirectionTop } from '../../../assets/svg/animations/top.svg';
import { ReactComponent as DirectionBottom } from '../../../assets/svg/animations/bottom.svg';
import { ReactComponent as DirectionLeft } from '../../../assets/svg/animations/left.svg';
import { ReactComponent as DirectionRight } from '../../../assets/svg/animations/right.svg';
import { ReactComponent as FadeIn } from '../../../assets/svg/animations/fadeIn.svg';
import { ReactComponent as SlideIn } from '../../../assets/svg/animations/slideIn.svg';

import { ReactComponent as Circles } from '../library/svgs/stickers/circle.svg';
import { ReactComponent as Square } from '../library/svgs/stickers/square.svg';
import { ReactComponent as Bloom } from '../library/svgs/stickers/bloom.svg';
import { ReactComponent as Flower5Sides } from '../library/svgs/stickers/flower-5.svg';
import { ReactComponent as Decagram } from '../library/svgs/stickers/decagram.svg';
import { ReactComponent as Polygon } from '../library/svgs/stickers/polygon.svg';
import { ReactComponent as Blossom } from '../library/svgs/stickers/blossom.svg';
import { ReactComponent as FlowerPlain } from '../library/svgs/stickers/Flower-plain.svg';
//variables
import { ReactComponent as SearchIcon } from '../library/svgs/smartFieldsvg/Search.svg';
import { ReactComponent as DropDownIcon } from '../library/svgs/smartFieldsvg/dropdown.svg';
import { ReactComponent as ActiveTick } from '../library/svgs/tick.svg';
import { ReactComponent as PlusCustom } from '../library/svgs/Pluscustom.svg';
import { ReactComponent as Edit } from '../../../assets/svg/edit.svg';
import { ReactComponent as Delete } from '../../../assets/svg/delete.svg';
import { ReactComponent as Hobspot } from '../library/svgs/variables/Hubspot.svg';
import { ReactComponent as Text } from '../smartFields/smartFields/text.svg';
import { ReactComponent as LongText } from '../smartFields/smartFields/longText.svg';
import { ReactComponent as Number } from '../smartFields/smartFields/number.svg';
import { ReactComponent as PhoneNumber } from '../smartFields/smartFields/phoneNumber.svg';
import { ReactComponent as Email } from '../smartFields/smartFields/at.svg';
import { ReactComponent as Date } from '../smartFields/smartFields/date.svg';
import { ReactComponent as Link } from '../smartFields/smartFields/link.svg';
import { ReactComponent as Currency } from '../smartFields/smartFields/currency.svg';

// icons for questions
import { ReactComponent as ShortAnswer } from '../../../assets/svg/questionTypes/shortAnswer.svg';
import { ReactComponent as LongAnswer } from '../../../assets/svg/questionTypes/longAnswer.svg';
import { ReactComponent as EmailType } from '../../../assets/svg/questionTypes/emailtype.svg';
import { ReactComponent as PhoneNumberType } from '../../../assets/svg/questionTypes/phoneNumber.svg';
import { ReactComponent as MultipleChoice } from '../../../assets/svg/questionTypes/multipleChoice.svg';
import { ReactComponent as DateType } from '../../../assets/svg/questionTypes/dateType.svg';
import { ReactComponent as EventsType } from '../../../assets/svg/questionTypes/eventsType.svg';
import { ReactComponent as SignatureType } from '../../../assets/svg/questionTypes/signaiture.svg';
import { ReactComponent as DropdownType } from '../../../assets/svg/questionTypes/dropdown.svg';
import { ReactComponent as FileUploadType } from '../../../assets/svg/questionTypes/fileUpload.svg';
import { ReactComponent as RatingType } from '../../../assets/svg/questionTypes/rating.svg';
import { ReactComponent as LinkType } from '../../../assets/svg/questionTypes/linkType.svg';
import { ReactComponent as NumberType } from '../../../assets/svg/questionTypes/NumberType.svg';
import { ReactComponent as TimeType } from '../../../assets/svg/questionTypes/timeType.svg';
import { ReactComponent as SingleChoice } from '../../../assets/svg/questionTypes/singleChoice.svg';

import { ReactComponent as GridGap } from '../library/svgs/gridGap.svg';
import { ReactComponent as GridNoGap } from '../library/svgs/gridNoGap.svg';
import { ReactComponent as RowGap } from '../library/svgs/rowHeight.svg';
import { ReactComponent as ColumnGap } from '../library/svgs/coloumGap.svg';
import { ReactComponent as Positive } from '../library/svgs/positive.svg';
import { ReactComponent as Negative } from '../library/svgs/negative.svg';
//fluidLShapes
import Shape2 from '../library/svgs/fluidShapes/shape2';
import Shape3 from '../library/svgs/fluidShapes/shape3';
import Shape4 from '../library/svgs/fluidShapes/shape4';
import Shape5 from '../library/svgs/fluidShapes/shape5';
import Shape6 from '../library/svgs/fluidShapes/shape6';
import Shape7 from '../library/svgs/fluidShapes/shape7';
import Shape8 from '../library/svgs/fluidShapes/shape8';
import Shape9 from '../library/svgs/fluidShapes/shape9';
import Shape10 from '../library/svgs/fluidShapes/shape10';
import Shape11 from '../library/svgs/fluidShapes/shape11';
import Shape12 from '../library/svgs/fluidShapes/shape12';
import Shape13 from '../library/svgs/fluidShapes/shape13';
import Shape14 from '../library/svgs/fluidShapes/shape14';
import Shape15 from '../library/svgs/fluidShapes/shape15';
import Shape16 from '../library/svgs/fluidShapes/shape16';
import Shape17 from '../library/svgs/fluidShapes/shape17';
import Shape18 from '../library/svgs/fluidShapes/shape18';
import Shape19 from '../library/svgs/fluidShapes/shape19';

import ColorPicker from '../properties/colorpicker';
import Modal from '../../components/library/modals/index';
// import Slider from 'rc-slider';
import Cropper from 'react-easy-crop';
import moment from 'moment';
import 'rc-slider/assets/index.css';
import _ from 'lodash';
import Images from '../../../controllers/images';
import { withRouter } from '../../../services/withRouter';
import ImageLibrary from '../imageLibrary';
import SmartFields from '../smartFields/smartFields';

// journey icons for sidebar
import { journeyIcons } from '../library/elements/jicon/journeyIcons';

// svgs for list layouts

import Circle from '../library/svgs/listIcons/Circle';
import FilledRight from '../library/svgs/listIcons/FilledRight';
import Heart from '../library/svgs/listIcons/Heart';
import Minus from '../library/svgs/listIcons/Minus';
import ListRight from '../library/svgs/listIcons/Right';
import RightArrow from '../library/svgs/listIcons/RightArrow';
import Ring from '../library/svgs/listIcons/Ring';
import RoundedRight from '../library/svgs/listIcons/RoundedRight';
import Star from '../library/svgs/listIcons/Star';
import SquareCircle from '../library/svgs/listIcons/SquareCircle';
import Delivery from '../library/svgs/listIcons/Delivery';
import Location from '../library/svgs/listIcons/Location';
import { ReactComponent as Numbers } from '../../../assets/svg/Numbers.svg';

// svgs for bg types

import { ReactComponent as VideoSVG } from '../library/svgs/videoSvg.svg';
import { ReactComponent as ImageSVG } from '../library/svgs/imageSvg.svg';
import { ReactComponent as UpDown } from '../library/svgs/upDown.svg';

import { ReactComponent as Navigate } from '../library/svgs/navigate.svg';
import { ReactComponent as Arrow } from '../library/svgs/arrow.svg';
import ManagePages from '../pages';
// import randomatic from 'randomatic';
// import { TRUE } from 'sass';
import { ReactComponent as PageIcon } from '../../../assets/svg/pages.svg';
import { ReactComponent as BackIcon } from '../library/svgs/Pages/Back.svg';
import { ReactComponent as GotoPage } from '../library/svgs/Pages/GotoPage.svg';

import { ReactComponent as Plus } from '../../../assets/svg/plus.svg';
import preview from '../library/svgs/preview';

import randomize from 'randomatic';
const borders = ['solid', 'dashed', 'dotted'];

class Sidebar extends Images {
	constructor(props) {
		super(props);
		this.iconRefs = []; // Array to hold refs for each icon
		this.iconsContainerRef = null;
		this.state = {
			fontColor: props.fontColor,
			uploadBatchID: randomize('Aa0', 10),
			activeTab: props.activeSubBlockType,
			activeFont: props.fontFamily,
			customUnits: [], // Array to store custom units
			showCustomUnitInput: '', // Toggle for custom unit input field
			customUnitValue: '',
			activeVariable: null,
			// fonts: [
			// 	'Arial',
			// 	'Courier New',
			// 	'Georgia',
			// 	'Lucida Sans Unicode',
			// 	'Tahoma',
			// 	'Times New Roman',
			// 	'Trebuchet MS',
			// 	'Helvetica',
			// 	'Impact',
			// 	'Verdana',
			// 	'Italianno',
			// 	'Milton One Bold',
			// ],
			shape: [
				{
					name: 'square',
					style: {
						borderRadius: '0px',
						width: '38px',
						height: '38px',
						border: '1px solid #D4D0CE',
					},
				},
				{
					name: 'circle',
					style: {
						borderRadius: '100%',
						width: '38px',
						height: '38px',
						border: '1px solid #D4D0CE',
					},
				},
				{
					name: 'vRectangle',
					style: {
						borderRadius: '0px',
						width: '30px',
						height: '38px',
						border: '1px solid #D4D0CE',
					},
				},
				{
					name: 'hRectangle',
					style: {
						borderRadius: '0px',
						width: '38px',
						height: '30px',
						border: '1px solid #D4D0CE',
					},
				},
				{
					name: 'rectangle',
					style: {
						borderRadius: '100px 100px 0px 0px',
						width: '30px',
						height: '38px',
						border: '1px solid #D4D0CE',
					},
				},
				{
					name: 'vcapsule',
					style: {
						borderRadius: '100px',
						width: '30px',
						height: '38px',
						border: '1px solid #D4D0CE',
					},
				},
				{
					name: 'capsule',
					style: {
						borderRadius: '100px',
						width: '40px',
						height: '28px',
						border: '1px solid #D4D0CE',
					},
				},
				{
					name: 'arcRight',
					style: {
						borderRadius: '0px 15px',
						width: '30px',
						height: '38px',
						border: '1px solid #D4D0CE',
					},
				},
				// {
				// 	name: 'arcLeft',
				// 	style: {
				// 		borderRadius: '15px 0px',
				// 		width: '30px',
				// 		height: '38px',
				// 		border: '1px solid #D4D0CE',
				// 	},
				// },
			],
			buttonShape: [
				{
					name: 'rt',
					styles: {
						height: '38px',
						width: '66px',
						background: '#C4C4C4',
					},
				},
				{
					name: 'rt-border',
					styles: {
						height: '38px',
						width: '66px',
						borderRadius: '4px',
						background: '#C4C4C4',
					},
				},
				{
					name: 'rt-semi-border',
					styles: {
						height: '38px',
						width: '66px',
						borderRadius: '12px',
						background: '#C4C4C4',
					},
				},
				{
					name: 'rt-rounded-border',
					styles: {
						height: '38px',
						width: '66px',
						borderRadius: '100px',
						background: '#C4C4C4',
					},
				},
				{
					name: 'bt-border',
					styles: {
						height: '38px',
						width: '66px',
						background: '#fff !important',
						border: '0.5px solid #9B9290',
					},
				},
				{
					name: 'border-lt',
					styles: {
						height: '38px',
						width: '66px',
						borderRadius: '4px',
						background: '#fff !important',
						border: '0.5px solid #9B9290',
					},
				},
				{
					name: 'border-semi',
					styles: {
						height: '38px',
						width: '66px',
						borderRadius: '12px',
						background: '#fff !important',
						border: '0.5px solid #9B9290',
					},
				},
				{
					name: 'border-rounded',
					styles: {
						height: '38px',
						width: '66px',
						background: '#fff !important',
						borderRadius: '100px',
						border: '0.5px solid #9B9290',
					},
				},
			],

			showFontsDropDown: false,
			showFontsVariantDropDown: false,
			showVariablesDropDown: false,
			showPopUpVariable: false,
			fontSize: 24,
			lineHeight: 0.1,
			letterSpacing: 0.1,

			activeSectionID: props.activeSectionID,
			padding: props.padding,
			bg: props.bg,
			activeBlockID: props.activeBlockID,
			activeSection: props.activeSection, // karthik added
			buttonStyle: props.buttonStyle,
			btShape: props.btShape,
			hasButton: props.hasButton,

			hasSticker: props.hasSticker,

			buttonLink: props.buttonLink,
			openNewTab: props.openNewTab,
			activeShape: props.activeShape,
			activeSubBlockID: props.activeSubBlockID,
			activeImageURL: props.activeImageURL,
			showImageProgressBar: false,
			progressCount: 0,
			imageWidth: {},
			crop: { x: 0, y: 0 },
			zoom: 1.1,
			aspect: 3 / 2,
			insertedId: null,
			signedUrl: null,
			interval: null,
			uploadedImageURL: null,
			isServiceBlock: props.isServiceBlock,
			selection_is_required: props.services_is_required,
			services_selection: props.services_selection,
			services_style: props.services_selection,
			variables: props.variables,
			hasImageBlock: props.hasImageBlock,
			hasShape: props.hasShape ? props.hasShape : false,
			justifyleft: props.justifyleft,
			justifycenter: props.justifycenter,
			justifyright: props.justifyright,
			justifyfull: props.justifyfull,
			activeContractVariable: props.activeContractVariable,
			activeVariableInfo: null,
			sectionVariables: props.sectionVariables,
			activeFormQuestion: props.activeFormQuestion,
			activeFormBlock: props.activeFormBlock,
			contentAlign: props?.contentAlign,
			blockBorder: props?.blockBorder,
			device: props?.device,
			templateList: props?.templateList,
			btShowOption: false,
			questions: [
				{ name: 'Short Text', value: 'shortText', icon: <ShortAnswer /> },
				{ name: 'Long Text', value: 'longText', icon: <LongAnswer /> },
				{ name: 'Email', value: 'email', icon: <EmailType /> },
				{ name: 'Phone Number', value: 'phoneNumber', icon: <PhoneNumberType /> },
				{ name: 'Multiple Choice', value: 'multipleChoice', icon: <MultipleChoice /> },
				{ name: 'Date', value: 'date', icon: <DateType /> },
				{ name: 'Events', value: 'events', icon: <EventsType /> },
				// { name: 'Signature', value: 'signature' ,icon: <SignatureType /> },
				{ name: 'Dropdown', value: 'dropdown', icon: <DropdownType /> },
				{ name: 'File Upload', value: 'fileUpload', icon: <FileUploadType /> },
				{ name: 'Rating', value: 'rating', icon: <RatingType /> },
				{ name: 'Link', value: 'link', icon: <LinkType /> },
				{ name: 'Number', value: 'number', icon: <NumberType /> },
				{ name: 'Time', value: 'time', icon: <TimeType /> },
				{ name: 'Single Choice', value: 'singleChoice', icon: <SingleChoice /> },
			],

			showServiceSubBlock: props.showServiceSubBlock,
			activeServiceSubBlock: props.activeServiceSubBlock,
			isAutoSaving: props.isAutoSaving,
			headerSection: props?.headerSection,
			isHeader: props?.isHeader,
			tenantLogo: props?.tenantLogo,
			currentIconColor: props?.currentIconColor,
			currentSizeIcons: props?.currentSizeIcons,
			currentIconType: props?.currentIconType,
			currentIconBgColor: props?.currentIconBgColor,
			formBgColor: props?.formBgColor,
			activeFormTab: 'solid',
			activeAnimation: props?.activeAnimation,
			imageShape: [
				{ name: 'no-border', element: <NoBorder /> },
				{ name: 'full-border', element: <HalfBorder /> },
				{ name: 'half-border', element: <Border /> },
			],
			deviceTypes: [
				{ name: 'mobile', element: <MobileIcon style={{ fill: 'white' }} /> },
				{ name: 'tab', element: <TabIcon style={{ fill: 'white' }} /> },
				{ name: 'desktop', element: <DesktopIcon style={{ fill: 'white' }} /> },
			],
			activeModuleId: props.activeModuleId,
			showImageModal: false,
			showVariableModal: false,
			theme: [
				{
					text: '#333333',
					button: '#333333',
					placeHolder: '#AAAAAA',
					backgroundColor: '#f6f6f6',
					buttonText: '#F6f6f6',
					fieldFill: '#ffffff',
					fieldBorder: '#333333',
					option: '#d9d9d9',
				},
				{
					backgroundColor: '#faf0ca',
					button: '#0d3b66',
					buttonText: '#F6f6f6',
					fieldBorder: '#0d3b66',
					fieldFill: '#ffffff',
					placeHolder: '#909090',
					text: '#0d3b66',
					option: '#d9d9d9',
				},
				{
					backgroundColor: '#FFF3B7',
					button: '#AB6F1A',
					buttonText: '#F6f6f6',
					fieldBorder: '#AB6F1A',
					fieldFill: '#ffffff',
					placeHolder: '#D69C57',
					text: '#AB6F1A',
					option: '#d9d9d9',
				},
				{
					backgroundColor: '#Fefae0',
					button: '#283618',
					buttonText: '#ffffff',
					fieldBorder: '#D8d8d8',
					fieldFill: '#ffffff',
					placeHolder: '#606c38',
					text: '#283618',
					option: '#d9d9d9',
				},
				{
					backgroundColor: '#ddfff7',
					button: '#138477',
					buttonText: '#Ffffff',
					fieldBorder: '#138477',
					fieldFill: '#ffffff',
					placeHolder: '#52B1A6',
					text: '#138477',
					option: '#d9d9d9',
				},
				{
					backgroundColor: '#BDE0FE',
					button: '#0077B6',
					buttonText: '#Ffffff',
					fieldBorder: '#0077B6',
					fieldFill: '',
					placeHolder: '#4AA7FF',
					text: '#0077B6',
					option: '#d9d9d9',
				},
				{
					backgroundColor: '#E0AFA0',
					button: '#47352B',
					buttonText: '#Ffffff',
					fieldBorder: '#47352B',
					fieldFill: '',
					placeHolder: '#59554E',
					text: '#47352B',
					option: '#d9d9d9',
				},
				{
					backgroundColor: '#CC3C44',
					button: '#F4E8CC',
					buttonText: '#CC3C44',
					fieldBorder: '#F4E8CC',
					fieldFill: 'transparent',
					placeHolder: '#ffffff',
					text: '#F4E8CC',
					option: '#d9d9d9',
				},
				{
					backgroundColor: '#DBE5B1',
					button: '#70574A',
					buttonText: '#DBE5B1',
					fieldBorder: '#70574A',
					fieldFill: '#E9F3E4',
					placeHolder: '#748743',
					text: '#70574A',
					option: '#d9d9d9',
				},
			],
			isTheme: props?.isTheme,
			activeTheme: props?.activeTheme,
			paddingHorizontal: props?.paddingHorizontal,
			fonts: props.fonts,
			selectedFont: props.selectedFont,
			hasCircleText: props?.hasCircleText,
			circleTextData: props?.circleTextData,
			showAnimationContainer: false,
			animationType: props?.animationType,
			animationDirection: props?.animationDirection,
			animationSpeed: props?.animationSpeed,
			stickers: [
				{ name: 'circle', element: <Circles /> },
				{ name: 'square', element: <Square /> },
				{ name: 'bloom', element: <Bloom /> },
				{ name: 'flower5Sides', element: <Flower5Sides /> },
				{ name: 'decagram', element: <Decagram /> },
				{ name: 'polygon', element: <Polygon /> },
				{ name: 'blossom', element: <Blossom /> },
				{ name: 'flower', element: <FlowerPlain /> },
			],
			fluidShapes: [
				{ name: 'circle', element: <Circles /> },
				{ name: 'shape2', element: <Shape2 /> },
				{ name: 'shape3', element: <Shape3 /> },
				{ name: 'shape4', element: <Shape4 /> },
				{ name: 'shape5', element: <Shape5 /> },
				{ name: 'shape6', element: <Shape6 /> },
				{ name: 'shape7', element: <Shape7 /> },
				{ name: 'shape8', element: <Shape8 /> },
				{ name: 'shape9', element: <Shape9 /> },
				{ name: 'shape10', element: <Shape10 /> },
				{ name: 'shape11', element: <Shape11 /> },
				{ name: 'shape12', element: <Shape12 /> },
				{ name: 'shape13', element: <Shape13 /> },
				{ name: 'shape14', element: <Shape14 /> },
				{ name: 'shape15', element: <Shape15 /> },
				{ name: 'shape16', element: <Shape16 /> },
				{ name: 'shape17', element: <Shape17 /> },
				{ name: 'shape18', element: <Shape18 /> },
				{ name: 'shape19', element: <Shape19 /> },
			],

			hasListIcon: props?.hasListIcon,
			listIconColor: props?.listIconColor,
			listIconSize: props?.listIconSize,
			listIconShape: props?.listIconShape,
			listIconShapes: [
				{ name: 'Numbers', element: <Numbers /> },
				{ name: 'Circle', element: <Circle /> },
				{ name: 'Right', element: <ListRight /> },
				{ name: 'Heart', element: <Heart /> },
				{ name: 'FilledRight', element: <FilledRight /> },
				{ name: 'Minus', element: <Minus /> },
				{ name: 'Ring', element: <Ring /> },
				{ name: 'RightArrow', element: <RightArrow /> },
				{ name: 'RoundedRight', element: <RoundedRight /> },
				{ name: 'Star', element: <Star /> },
				{ name: 'SquareCircle', element: <SquareCircle /> },
				{ name: 'Delivery', element: <Delivery /> },
				{ name: 'Location', element: <Location /> },
			],
			showLineTypeDropDown: false,
			searchFont: '',
			isLogo: props?.isLogo,
			logoStickerFill: props?.logoStickerFill,
			timeout: null,

			videoURL: props?.videoURL,
			loop: props?.loop,
			alignVideoBlock: props?.alignVideoBlock,
			fillVideoBlock: props?.fillVideoBlock,
			autoplay: props?.autoplay,

			backgroundType: props.backgroundType,
			backgroundImageURL: props.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,
			isValidBgVideoURL: props.isValidBgVideoURL,

			addBgImageURL: false,

			bgOverlayColor: 'black',
			bgOverlayOpacity: 0,
			showOverlayOptions: false,

			noPadding: props?.noPadding,

			ImgOverlayColor: props?.imgOverlayColor,
			ImgOverlayOpacity: props?.ImgOverlayOpacity,
			activeImageSubBlock: props?.activeImageSubBlock,

			showColorOptions: false,
			showBgColorOptions: false,
			showListOptions: false,
			showVideoOptions: false,
			showPaddingOptions: false,

			innerPadding: props?.innerPadding,

			base64: props.base64,
			uploadAIImage: props.uploadAIImage,

			scrollStyles: props.scrollStyles,
			fontStyles: props.fontStyles,
			scrollText: props.scrollText,
			hasScrollText: props.hasScrollText,
			showInputFontSize: false,
			itemSpacing: props.itemSpacing,
			scrollSymbol: props.scrollSymbol,
			symbolError: '',
			textError: '',
			source: props.source,
			iHeight: 30,
			hasIframe: props?.hasIframe,
			invalidEmbedURL: false,
			summaryBg: props?.summaryBg,
			summaryFont: props?.summaryFont,
			summaryFontSize: props?.summarySize,
			summaryFontColor: props?.summaryFontColor,
			eventsLabel: props?.eventsLabel,
			paymentsLabel: props?.paymentsLabel,

			showSchedule: props?.showSchedule,

			hasJourney: props?.hasJourney,
			cardColor: props?.cardColor,
			searchedIcon: '',

			activeJIcon: '',
			activeJIconSize: 0,

			largeIcon: props?.largeIcon,

			handleSaveSections: props?.handleSaveSections,
			brandColors: props?.brandColors,

			clientInfo: [],
			userInfo: [],
			companyInfo: [],
			variableTab: 'smart-info',
			selectedVariables: [],
			showAddSmartModal: false,
			isEdit: false,
			name: '',
			selectedOption: '',
			value: '',
			isOpen: false,
			editingField: null,
			activeFieldData: null,
			templateId: props.templateId,
			isWorkflow: props?.isWorkflow,
			showBrandFonts: false,
			iframeScroll: props?.iframeScroll,
			activeFontVariant: '',
			activeFontWeight: '',
			activeFontStyle: '',
			showVideoBlock: false,

			showInvoiceColorOptions: false,
			pageDropdown: false,
			sectionDropdown: false,
			sections: props?.sections,
			modules: props?.modules,
			template: props?.template,

			showSummaryColorOptions: false,
			debounceInterval: null,
			activeBackgroundWidth: 'full',
			activeModule: props?.activeModule,
			editActiveModule: false,
			socialMediaLinks: props?.socialMediaLinks,

			activeElementAnimeType: props?.activeElementAnimeType,
			showAnimationOptions: false,
			duplicateModules: props?.duplicateModules,
		};
		this.intervalId = null;
		this.dropdownref = React.createRef();
		this.dropdownfontref = React.createRef();
		this.dropdownvariableref = React.createRef();
		this.popupvaraibleref = React.createRef();
		this.qdropdownvariableref = React.createRef();
		this.dropdownlineeref = React.createRef();
		this.fileInputRef = React.createRef();
		this.sidebarRef = React.createRef();
		this.bgFileInputRef = React.createRef();
		this.colorUpdateTimeout = null;
		this.blockRef = React.createRef();
	}

	componentDidMount = () => {
		const savedCustomUnits = localStorage.getItem('customUnits');
		if (savedCustomUnits) {
			this.setState({ customUnits: JSON.parse(savedCustomUnits) });
		}
		document.addEventListener('mousedown', this.handleClickOutside);
		this.setVariables();

		// //user info
		// let userInfoVariables = this.state?.variables?.workspace.filter(
		// 	(varObj) => {

		// 		if(varObj.code === 'userEmail' || varObj.code === 'userPhonenumber' || varObj.code === 'userName'){
		// 			this.setState({
		// 				userInfo: userInfoVariables ,
		// 			},
		// 			()=>{console.log(this.state.userInfo,"checking user-info")}
		// 		);
		// 		}
		// 		else{
		// 			this.setState({
		// 				companyInfo: userInfoVariables,
		// 			},
		// 			()=>{console.log(this.state.companyInfo,"checking company-info")}
		// 			);

		// 		}
		// 	}
		// 	);

		// //company info
		// let companyInfoVariables = this.state?.variables.workspace.filter(
		// 	(varObj) => varObj.code === 'client-name' || varObj.code === 'client-email-id' || varObj.code === 'client-phone-number',
		// );
		// this.setState({
		// 	companyInfo: companyInfoVariables ,
		// },
		// ()=>{console.log(companyInfoVariables,"checking company-info")}
		// );
	};

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		clearInterval(this.intervalId);
		// Clean up timeout
		if (this.colorUpdateTimeout) {
			clearTimeout(this.colorUpdateTimeout);
		}
	}
	componentDidUpdate = (prevState) => {
		if (this.state.hasButton && prevState.btShape !== this.state.btShape) {
			let shapesToBeFalse = ['rt', 'rt-border', 'rt-semi-border', 'rt-rounded-border'];
			const isButtonMatched = shapesToBeFalse.includes(this.state.btShape);

			// Only update state if btShowOption would change
			if (isButtonMatched && this.state.btShowOption !== false) {
				this.setState({ btShowOption: false });
			} else if (!isButtonMatched && this.state.btShowOption !== true) {
				this.setState({ btShowOption: true });
			}
		}
		if (
			this.state?.activeSection?.style?.isFormLayout &&
			this.state?.activeTheme != this.state?.activeSection?.style?.theme
		) {
			this.setState({
				activeTheme: this.state?.activeSection?.style?.theme,
			});
		}
		if (prevState.activeSection?._id !== this.state.activeSection?._id) {
			gsap.fromTo(
				'.animated-item',
				{ opacity: 0 },
				{
					opacity: 1,
					duration: 0.3,
					stagger: 0.2,
					ease: 'power2.out',
				},
			);
		}
		let newIconName = null;

		const activeBlock = _.find(this.state?.activeSection?.blocks, {
			_id: this.state?.activeBlockID,
		});
		if (activeBlock) {
			// Check if subBlocks exists and is an array
			if (Array.isArray(activeBlock?.subBlocks)) {
				// Find the subBlock with type 'jIcon'
				const subBlock = _.find(activeBlock.subBlocks, { type: 'jIcon' });

				// If such a subBlock exists, get its icon
				const newIconName = subBlock?.icon || 'home';
				const newIconSize = subBlock?.size || 20;
				// Only update the state if `activeJIcon` needs to change
				if (this.state?.activeJIcon !== newIconName) {
					this.setState({ activeJIcon: newIconName });
				}
				if (this.state?.activeJIconSize !== newIconSize) {
					this.setState({ activeJIconSize: newIconSize });
				}
			}
		}

		// for journey icons
		if (prevState?.activeJIcon !== this.state?.activeJIcon) {
			const filteredIcons = journeyIcons?.filter((icon) => {
				const searchTerm = this.state?.searchedIcon?.toLowerCase() || '';

				// Check if the search term is in the icon name
				const nameMatch = icon?.name?.toLowerCase()?.includes(searchTerm);

				// Check if the search term is in any of the tags
				const tagMatch = icon?.tags?.some((tag) =>
					tag?.toLowerCase()?.includes(searchTerm),
				);

				// Return true if either name or tags match the search term
				return nameMatch || tagMatch;
			});
			const activeIndex = filteredIcons?.findIndex(
				(icon) => icon?.name === this.state?.activeJIcon,
			);
			if (activeIndex !== -1 && this.iconRefs[activeIndex]) {
				this.iconRefs[activeIndex].scrollIntoView({
					behavior: 'smooth', // Smooth scrolling
					block: 'nearest', // Scroll just enough to make the item visible
					inline: 'nearest', // Align horizontally (if needed)
				});
			}
		}
	};
	componentWillReceiveProps = (nextProps) => {
		if (this.state.fontColor !== nextProps.fontColor && nextProps.fontColor) {
			this.setState({
				fontColor: nextProps.fontColor,
			});
		}

		if (this.state.isLogo !== nextProps.isLogo) {
			this.setState({
				isLogo: nextProps.isLogo,
			});
		}
		if (this.state.template !== nextProps.template) {
			this.setState({
				template: nextProps.template,
			});
		}
		if (this.state.templateList !== nextProps.templateList) {
			this.setState({
				templateList: nextProps.templateList,
			});
		}
		if (this.state.duplicateModules !== nextProps.duplicateModules) {
			this.setState({
				duplicateModules: nextProps.duplicateModules,
			});
		}
		if (this.state.animationType !== nextProps.animationType && nextProps.animationType) {
			this.setState({
				animationType: nextProps.animationType,
			});
		}
		if (this.state.animationSpeed !== nextProps.animationSpeed && nextProps.animationSpeed) {
			this.setState({
				animationSpeed: nextProps.animationSpeed,
			});
		}
		if (
			this.state.animationDirection !== nextProps.animationDirection &&
			nextProps.animationDirection
		) {
			this.setState({
				animationDirection: nextProps.animationDirection,
			});
		}
		if (this.state.activeAnimation !== nextProps?.activeAnimation) {
			this.setState({
				activeAnimation: nextProps.activeAnimation,
			});
		}
		if (this.state.fonts !== nextProps.fonts) {
			this.setState({
				fonts: nextProps.fonts,
			});
		}
		if (this.state.selectedFont !== nextProps.selectedFont) {
			this.setState({ selectedFont: nextProps.selectedFont });
		}
		if (this.state.circleTextData !== nextProps.circleTextData && nextProps.circleTextData) {
			this.setState({
				circleTextData: nextProps.circleTextData,
			});
		}
		if (this.state.hasCircleText !== nextProps.hasCircleText) {
			this.setState({
				hasCircleText: nextProps.hasCircleText,
			});
		}
		if (this.state.paddingHorizontal !== nextProps?.paddingHorizontal) {
			this.setState({
				paddingHorizontal: nextProps.paddingHorizontal,
			});
		}

		if (this.state.activeTheme !== nextProps.activeTheme && nextProps.activeTheme) {
			this.setState({
				activeTheme: nextProps.activeTheme,
			});
		}
		if (
			this.state.currentIconColor !== nextProps.currentIconColor &&
			nextProps.currentIconColor
		) {
			this.setState({
				currentIconColor: nextProps.currentIconColor,
			});
		}
		if (
			this.state.currentSizeIcons !== nextProps.currentSizeIcons &&
			nextProps.currentSizeIcons
		) {
			this.setState({
				currentSizeIcons: nextProps.currentSizeIcons,
			});
		}
		if (this.state.currentIconType !== nextProps.currentIconType && nextProps.currentIconType) {
			this.setState({
				currentIconType: nextProps.currentIconType,
			});
		}
		if (
			this.state.currentIconBgColor !== nextProps.currentIconBgColor &&
			nextProps.currentIconBgColor
		) {
			this.setState({
				currentIconBgColor: nextProps.currentIconBgColor,
			});
		}

		if (this.state.contentAlign !== nextProps.contentAlign && nextProps.contentAlign) {
			this.setState({
				contentAlign: nextProps.contentAlign,
			});
		}

		if (this.state.device !== nextProps.device && nextProps.device) {
			this.setState({
				device: nextProps.device,
			});
		}
		if (this.state.blockBorder !== nextProps.blockBorder && nextProps.blockBorder) {
			this.setState({
				blockBorder: nextProps.blockBorder,
			});
		}
		if (this.state.formBgColor !== nextProps.formBgColor && nextProps.formBgColor) {
			this.setState({
				formBgColor: nextProps.formBgColor,
			});
		}
		if (this.state.tenantLogo !== nextProps.tenantLogo && nextProps.tenantLogo) {
			this.setState({
				tenantLogo: nextProps.tenantLogo,
			});
		}
		if (this.state.isHeader !== nextProps.isHeader && nextProps.isHeader) {
			this.setState({
				isHeader: nextProps.isHeader,
			});
		}
		if (this.state.headerSection !== nextProps.headerSection && nextProps.headerSection) {
			this.setState({
				headerSection: nextProps.headerSection,
			});
		}
		if (this.state.imgSettingData !== nextProps.imgSettingData && nextProps.imgSettingData) {
			this.setState({
				crop:
					nextProps.imgSettingData &&
					nextProps.imgSettingData.crop &&
					Object.keys(nextProps.imgSettingData.crop).length > 0
						? nextProps.imgSettingData?.crop
						: { x: 0, y: 0 },
				zoom:
					nextProps.imgSettingData && nextProps.imgSettingData.zoom !== undefined
						? nextProps.imgSettingData.zoom
						: 1.1,
				imageWidth:
					nextProps.imgSettingData && nextProps.imgSettingData.imageWidth !== undefined
						? nextProps.imgSettingData.imageWidth
						: {},
			});
		}
		if (this.state.hasShape !== nextProps.hasShape && nextProps.hasShape) {
			this.setState({
				hasShape: nextProps.hasShape,
			});
		}

		if (this.state.buttonStyle !== nextProps.buttonStyle && nextProps.buttonStyle) {
			this.setState({
				buttonStyle: nextProps.buttonStyle,
			});
		}
		if (this.state.btShape !== nextProps.btShape && nextProps.btShape) {
			this.setState({
				btShape: nextProps.btShape,
			});
		}
		if (this.state.activeElementAnimeType !== nextProps.activeElementAnimeType) {
			this.setState({
				activeElementAnimeType: nextProps.activeElementAnimeType,
			});
		}
		if (this.state.buttonLink !== nextProps.buttonLink && nextProps.buttonLink) {
			this.setState({
				buttonLink: nextProps.buttonLink,
			});
		}
		if (this.state.openNewTab !== nextProps.openNewTab && nextProps.openNewTab) {
			this.setState({
				openNewTab: nextProps.openNewTab,
			});
		}
		if (this.state.hasButton !== nextProps.hasButton && nextProps.hasButton) {
			this.setState({
				hasButton: nextProps.hasButton,
			});
		}

		if (this.state.activeShape !== nextProps.activeShape && nextProps.activeShape) {
			this.setState({
				activeShape: nextProps.activeShape,
			});
		}

		if (this.state.fontSize !== nextProps.fontSize && nextProps.fontSize) {
			this.setState({
				fontSize: nextProps.fontSize,
			});
		}
		if (this.state.activeSection !== nextProps.activeSection) {
			this.setState({
				activeSection: nextProps.activeSection,
			});
		}
		if (this.state.activeSectionID !== nextProps.activeSectionID && nextProps.activeSectionID) {
			this.setState({
				activeSectionID: nextProps.activeSectionID,
			});
		}
		if (this.state.activeFont !== nextProps.fontFamily && nextProps.fontFamily) {
			this.setState({
				activeFont: nextProps.fontFamily,
			});
		}
		if (this.state.padding !== nextProps.padding) {
			this.setState({
				padding: nextProps.padding,
			});
		}
		if (this.state.variables !== nextProps.variables) {
			this.setState(
				{
					variables: nextProps.variables,
				},
				() => {
					this.setVariables();
				},
			);
		}
		if (this.state.bg !== nextProps.bg) {
			this.setState({
				bg: nextProps.bg,
			});
		}
		if (this.state.activeTab !== nextProps.activeSubBlockType) {
			if (nextProps.activeSubBlockType === 'bframe') {
				this.setState({
					hasIframe: true,
					showVideoBlock: false,
					activeTab: 'b',
				});
			} else if (nextProps.activeSubBlockType === 'bvideo') {
				this.setState({
					showVideoBlock: true,
					hasIframe: false,
					activeTab: 'b',
				});
			} else {
				this.setState({
					activeTab: nextProps.activeSubBlockType,
					hasIframe: false,
					showVideoBlock: false,
				});
			}
		}
		if (this.state.activeBlockID !== nextProps.activeBlockID && nextProps.activeBlockID) {
			this.setState({
				activeBlockID: nextProps.activeBlockID,
				searchedIcon: '',
			});
		}
		if (
			this.state.activeSubBlockID !== nextProps.activeSubBlockID &&
			nextProps.activeSubBlockID
		) {
			this.setState({
				activeSubBlockID: nextProps.activeSubBlockID,
				uploadedImageURL: null,
			});
		}
		if (this.state.activeImageURL !== nextProps.activeImageURL) {
			this.setState({
				activeImageURL: nextProps.activeImageURL,
			});
		}
		if (this.state.isServiceBlock !== nextProps.isServiceBlock) {
			this.setState({
				isServiceBlock: nextProps.isServiceBlock,
			});
		}
		if (this.state.services_selection !== nextProps.services_selection) {
			this.setState({
				services_selection: nextProps.services_selection,
			});
		}
		if (this.state.services_style !== nextProps.services_style) {
			this.setState({
				services_style: nextProps.services_style,
			});
		}
		if (this.state.selection_is_required !== nextProps.selection_is_required) {
			this.setState({
				selection_is_required: nextProps.selection_is_required,
			});
		}
		if (this.state.hasImageBlock !== nextProps.hasImageBlock) {
			this.setState({
				hasImageBlock: nextProps.hasImageBlock,
			});
		}
		if (this.state.justifyleft !== nextProps.justifyleft) {
			this.setState({
				justifyleft: nextProps.justifyleft,
			});
		}
		if (this.state.justifycenter !== nextProps.justifycenter) {
			this.setState({
				justifycenter: nextProps.justifycenter,
			});
		}
		if (this.state.justifyright !== nextProps.justifyright) {
			this.setState({
				justifyright: nextProps.justifyright,
			});
		}
		if (this.state.justifyfull !== nextProps.justifyfull) {
			this.setState({
				justifyfull: nextProps.justifyfull,
			});
		}
		if (this.state.lineHeight !== nextProps.lineHeight) {
			this.setState({
				lineHeight: nextProps.lineHeight,
			});
		}
		if (this.state.letterSpacing !== nextProps.letterSpacing) {
			this.setState({
				letterSpacing: nextProps.letterSpacing,
			});
		}
		if (this.state.activeModuleId !== nextProps.activeModuleId) {
			this.setState({
				activeModuleId: nextProps.activeModuleId,
			});
		}
		if (this.state.hasSticker !== nextProps.hasSticker && nextProps.hasSticker) {
			this.setState({
				hasSticker: nextProps.hasSticker,
			});
		}
		if (this.state.hasListIcon !== nextProps.hasListIcon && nextProps.hasListIcon) {
			this.setState({
				hasListIcon: nextProps.hasListIcon,
			});
		}
		if (this.state.logoStickerFill !== nextProps.logoStickerFill && nextProps.logoStickerFill) {
			this.setState({
				logoStickerFill: nextProps.logoStickerFill,
			});
		}
		// video block -Abdullah
		if (this.state.videoURL !== nextProps.videoURL && nextProps.videoURL) {
			this.setState({
				videoURL: nextProps.videoURL,
			});
		}
		if (this.state.loop !== nextProps.loop && nextProps.loop) {
			this.setState({
				loop: nextProps.loop,
			});
		}
		if (this.state.alignVideoBlock !== nextProps.alignVideoBlock && nextProps.alignVideoBlock) {
			this.setState({
				alignVideoBlock: nextProps.alignVideoBlock,
			});
		}
		if (this.state.fillVideoBlock !== nextProps.fillVideoBlock && nextProps.fillVideoBlock) {
			this.setState({
				fillVideoBlock: nextProps.fillVideoBlock,
			});
		}
		if (this.state.autoplay !== nextProps.autoplay && nextProps.autoplay) {
			this.setState({
				autoplay: nextProps.autoplay,
			});
		}
		//varaibles

		if (this.state.fieldData !== nextProps.fieldData) {
			this.setState({
				fieldData: nextProps.fieldData,
			});
		}
		//jeevan summary block
		if (this.state.summaryFont !== nextProps.summaryFont && nextProps.summaryFont) {
			this.setState({
				summaryFont: nextProps.summaryFont,
			});
		}
		if (this.state.summaryFontSize !== nextProps.summaryFontSize && nextProps.summaryFontSize) {
			this.setState({
				summaryFontSize: nextProps.summaryFontSize,
			});
		}
		if (
			this.state.summaryFontColor !== nextProps.summaryFontColor &&
			nextProps.summaryFontColor
		) {
			this.setState({
				summaryFontColor: nextProps.summaryFontColor,
			});
		}
		if (this.state.summaryBg !== nextProps.summaryBg && nextProps.summaryBg) {
			this.setState({
				summaryBg: nextProps.summaryBg,
			});
		}
		if (this.state.eventsLabel !== nextProps.eventsLabel && nextProps.eventsLabel) {
			this.setState({
				eventsLabel: nextProps.eventsLabel,
			});
		}
		if (this.state.paymentsLabel !== nextProps.paymentsLabel && nextProps.paymentsLabel) {
			this.setState({
				paymentsLabel: nextProps.paymentsLabel,
			});
		}
		if (this.state.isWorkflow !== nextProps.isWorkflow && nextProps.isWorkflow) {
			this.setState({
				isWorkflow: nextProps.isWorkflow,
			});
		}

		// for bg types -Abdullah
		if (this.state.backgroundType !== nextProps.backgroundType && nextProps.backgroundType) {
			this.setState({
				backgroundType: nextProps.backgroundType,
			});
		}
		if (
			this.state.backgroundImageURL !== nextProps.backgroundImageURL &&
			nextProps.backgroundImageURL
		) {
			this.setState({
				backgroundImageURL: nextProps.backgroundImageURL,
			});
		}
		if (
			this.state.backgroundVideoURL !== nextProps.backgroundVideoURL &&
			nextProps.backgroundVideoURL
		) {
			this.setState({
				backgroundVideoURL: nextProps.backgroundVideoURL,
			});
		}
		if (
			this.state.isValidBgVideoURL !== nextProps.isValidBgVideoURL &&
			nextProps.isValidBgVideoURL
		) {
			this.setState({
				isValidBgVideoURL: nextProps.isValidBgVideoURL,
			});
		}

		if (this.state.sectionVariables !== nextProps.sectionVariables) {
			this.setState(
				{
					sectionVariables: nextProps.sectionVariables,
				},
				() => {
					let activeVariableInfo;
					activeVariableInfo = _.filter(this.state.variables, {
						_id: this.state.activeContractVariable,
					})[0]
						? _.filter(this.state.variables, {
								_id: this.state.activeContractVariable,
						  })[0]
						: { clientAction: 0, placeholderText: '' };

					let sectionVariable = _.filter(this.state.sectionVariables, {
						_id: nextProps.activeContractVariable,
					});
					if (_.size(sectionVariable) > 0) {
						activeVariableInfo.clientAction = _.has(sectionVariable[0], 'clientAction')
							? sectionVariable[0].clientAction
							: 0;
						activeVariableInfo.placeholderText = _.has(
							sectionVariable[0],
							'placeholderText',
						)
							? sectionVariable[0].placeholderText
							: activeVariableInfo.displayName;
					} else {
						activeVariableInfo.clientAction = 0;
						activeVariableInfo.placeholderText = activeVariableInfo.displayName;
					}
					this.setState({
						activeVariableInfo,
					});
				},
			);
		}

		if (
			nextProps.activeContractVariable &&
			this.state.activeContractVariable && // added condition to prevent error when activeContractVariable is undefined (temporary)
			this.state.activeContractVariable !== nextProps.activeContractVariable
		) {
			this.setState(
				{
					activeContractVariable: nextProps.activeContractVariable,
					activeTab: 'v',
				},
				() => {
					let activeVariableInfo;

					activeVariableInfo = _.filter(this.state.variables, {
						_id: this.state.activeContractVariable,
					})[0];

					let sectionVariable = _.filter(this.state.sectionVariables, {
						_id: nextProps.activeContractVariable,
					});
					if (_.size(sectionVariable) > 0) {
						activeVariableInfo.clientAction = _.has(sectionVariable[0], 'clientAction')
							? sectionVariable[0]?.clientAction || 0
							: 0;
						activeVariableInfo.placeholderText = _.has(
							sectionVariable[0],
							'placeholderText',
						)
							? sectionVariable[0].placeholderText
							: activeVariableInfo.displayName;
					} else {
						activeVariableInfo.clientAction = 0;
						activeVariableInfo.placeholderText = activeVariableInfo.displayName;
					}
					this.setState({
						activeVariableInfo,
					});
				},
			);
		}

		if (
			this.state.activeFormQuestion !== nextProps.activeFormQuestion &&
			nextProps.activeFormQuestion
		) {
			this.setState({
				activeFormQuestion: nextProps.activeFormQuestion,
			});
		}

		if (this.state.activeFormBlock !== nextProps.activeFormBlock) {
			this.setState({
				activeFormBlock: nextProps.activeFormBlock,
			});
		}
		if (this.state.showServiceSubBlock !== nextProps.showServiceSubBlock) {
			this.setState({
				showServiceSubBlock: nextProps.showServiceSubBlock,
			});
		}
		if (this.state.showServiceSubBlock !== nextProps.showServiceSubBlock) {
			this.setState({
				showServiceSubBlock: nextProps.showServiceSubBlock,
			});
		}
		if (this.state.activeServiceSubBlock !== nextProps.activeServiceSubBlock) {
			this.setState({
				activeServiceSubBlock: nextProps.activeServiceSubBlock,
			});
		}

		if (this.state.isAutoSaving !== nextProps.isAutoSaving) {
			this.setState({
				isAutoSaving: nextProps.isAutoSaving,
			});
		}
		if (this.state.noPadding !== nextProps.noPadding) {
			this.setState({
				noPadding: nextProps.noPadding,
			});
		}
		if (this.state.ImgOverlayOpacity !== nextProps.ImgOverlayOpacity) {
			this.setState({
				ImgOverlayOpacity: nextProps.ImgOverlayOpacity,
			});
		}
		if (this.state.ImgOverlayColor !== nextProps.ImgOverlayColor) {
			this.setState({
				ImgOverlayColor: nextProps.ImgOverlayColor,
			});
		}
		if (this.state.activeImageSubBlock !== nextProps.activeImageSubBlock) {
			this.setState({
				activeImageSubBlock: nextProps.activeImageSubBlock,
			});
		}
		if (this.state.innerPadding !== nextProps.innerPadding) {
			this.setState({
				innerPadding: nextProps.innerPadding,
			});
		}
		if (this.state.uploadAIImage !== nextProps.uploadAIImage) {
			this.setState(
				{
					uploadAIImage: nextProps.uploadAIImage,
				},
				() => {
					if (this.state.uploadAIImage) {
						this.handleRemoveImage();
						setTimeout(() => {
							this.handleFileChange(nextProps.base64, true);
						}, 500);
					}
				},
			);
		}
		if (this.state.base64 !== nextProps.base64) {
			this.setState({
				base64: nextProps.base64,
			});
		}
		if (this.state.scrollStyles !== nextProps.scrollStyles) {
			this.setState({
				scrollStyles: nextProps.scrollStyles,
			});
		}
		if (this.state.fontStyles !== nextProps.fontStyles) {
			this.setState({
				fontStyles: nextProps.fontStyles,
			});
		}
		if (this.state.scrollText !== nextProps.scrollText) {
			this.setState({
				scrollText: nextProps.scrollText,
			});
		}
		if (this.state.scrollSymbol !== nextProps.scrollSymbol) {
			this.setState({
				scrollSymbol: nextProps.scrollSymbol,
			});
		}
		if (this.state.itemSpacing !== nextProps.itemSpacing) {
			this.setState({
				itemSpacing: nextProps.itemSpacing,
			});
		}
		if (this.state.hasScrollText !== nextProps.hasScrollText && nextProps.hasScrollText) {
			this.setState({
				hasScrollText: nextProps.hasScrollText,
			});
		}
		if (this.state.hasIframe !== nextProps.hasIframe && nextProps.hasIframe) {
			this.setState({
				hasIframe: nextProps.hasIframe,
			});
		}
		if (this.state.source !== nextProps.source && nextProps.source) {
			this.setState({
				source: nextProps.source,
			});
		}
		if (this.state.showSchedule !== nextProps.showSchedule) {
			this.setState({
				showSchedule: nextProps.showSchedule,
			});
		}
		if (this.state.largeIcon !== nextProps.largeIcon) {
			this.setState({
				largeIcon: nextProps.largeIcon,
			});
		}
		if (this.state.hasJourney !== nextProps.hasJourney) {
			this.setState({
				hasJourney: nextProps.hasJourney,
			});
		}
		if (this.state.cardColor !== nextProps.cardColor) {
			this.setState({
				cardColor: nextProps.cardColor,
			});
		}
		// brand colors jeevan
		if (this.state.brandColors !== nextProps.brandColors) {
			this.setState({
				brandColors: nextProps.brandColors,
			});
		}
		if (this.state.iframeScroll !== nextProps.iframeScroll) {
			this.setState({
				iframeScroll: nextProps.iframeScroll,
			});
		}
		if (this.state.modules !== nextProps.modules) {
			this.setState({
				modules: nextProps.modules,
			});
		}
		if (this.state.sections !== nextProps.sections) {
			this.setState({
				sections: nextProps.sections,
			});
		}
		if (this.state.activeModule !== nextProps.activeModule) {
			this.setState({
				activeModule: nextProps.activeModule,
			});
		}

		if (this.state.socialMediaLinks !== nextProps.socialMediaLinks) {
			this.setState({
				socialMediaLinks: nextProps.socialMediaLinks,
			});
		}
	};
	setVariables = () => {
		let activeVariableInfo;
		activeVariableInfo = _.filter(this.state.variables, {
			_id: this.props.activeContractVariable,
		})[0];

		this.setState({
			activeVariableInfo,
		});

		//this.updateSelectedStyles();

		// cilent info
		let clientInfoVariables = this.state?.variables?.module?.filter(
			(varObj) =>
				varObj.code === 'client-name' ||
				varObj.code === 'client-email-id' ||
				varObj.code === 'client-phone-number',
		);
		this.setState(
			{
				clientInfo: clientInfoVariables,
			},
			() => {},
		);

		// Separate user and company info variables
		let userInfoVariables = this.state?.variables?.workspace?.filter(
			(varObj) =>
				varObj.code === 'userEmail' ||
				varObj.code === 'userPhonenumber' ||
				varObj.code === 'userName',
		);

		let companyInfoVariables = this.state?.variables?.workspace?.filter(
			(varObj) =>
				varObj.code !== 'userEmail' &&
				varObj.code !== 'userPhonenumber' &&
				varObj.code !== 'userName',
		);

		// Update the state with both sets of information
		this.setState({
			userInfo: userInfoVariables,
			companyInfo: companyInfoVariables,
		});
	};
	handleClickOutside = (event) => {
		if (event.target.closest('.font-dropdown-icon')) {
			return;
		}
		if (this.dropdownref.current && !this.dropdownref.current.contains(event.target)) {
			this.setState({
				showFontsDropDown: false,
			});
		}
		if (this.dropdownfontref.current && !this.dropdownfontref.current.contains(event.target)) {
			this.setState({
				showFontsVariantDropDown: false,
			});
		}
		if (
			this.dropdownlineeref.current &&
			!this.dropdownlineeref.current.contains(event.target)
		) {
			this.setState({
				showLineTypeDropDown: false,
			});
		}
		if (
			this.dropdownvariableref.current &&
			!this.dropdownvariableref.current.contains(event.target)
		) {
			this.setState({
				showVariablesDropDown: false,
			});
		}
		if (
			this.popupvaraibleref.current &&
			!this.popupvaraibleref.current.contains(event.target)
		) {
			this.setState({
				showPopUpVariable: false,
			});
		}

		if (
			this.qdropdownvariableref.current &&
			!this.qdropdownvariableref.current.contains(event.target)
		) {
			this.setState({
				showQuestionTypeDropDown: false,
			});
		}

		if (this.sidebarRef.current && !this.sidebarRef.current.contains(event.target)) {
			this.setState(
				{
					isServiceBlock: false,
				},
				() => {
					this.props.serviceBlockFalse();
				},
			);
		}
	};
	handelClose = (e) => {
		this.props.handleClose(e);
	};
	setActiveTab = (e) => {
		this.setState(
			{
				activeTab: e,
			},
			() => {
				this.props.setActiveTab(e);
			},
		);
	};

	//setting tab for variables jeevan
	handlevariableInfo = (e) => {
		this.setState({
			variableTab: e,
			showVariablesDropDown: true,
			showPopUpVariable: false,
		});
	};
	handleSmartModalClose = (e) => {
		const showModal = field?.type !== 'module' && field?.type !== 'workspace';
		this.setState({
			showAddSmartFieldModal: showModal,
			name: field?.displayName,
			value: field?.defaultValue,
			selectedOption: field?.inputType,
			isEdit: true,
			activeFieldData: field,
		});
	};
	// Toggle modal visibility
	toggleVariableModal = (field = null) => {
		this.setState({
			showVariableModal: !this.state.showVariableModal,
			editingField: field,
		});
	};
	handleCreateField = (fieldData) => {
		const { onFieldDataUpdate } = this.props;
		const newField = {
			id: Date.now().toString(),
			...fieldData,
		};

		const updatedFields = {
			...this.props.fieldData,
			custom: [...this.props.fieldData.custom, newField],
		};

		onFieldDataUpdate(updatedFields);
	};
	handleEditField = (fieldId, updatedData) => {
		const { fieldData, onFieldDataUpdate } = this.props;

		const updatedFields = {
			...fieldData,
			custom: fieldData.custom.map((field) =>
				field.id === fieldId ? { ...field, ...updatedData } : field,
			),
		};

		onFieldDataUpdate(updatedFields);
	};
	// Handle deleting a field
	handleDeleteField = (fieldId) => {
		const { fieldData, onFieldDataUpdate } = this.props;

		const updatedFields = {
			...fieldData,
			custom: fieldData.custom.filter((field) => field.id !== fieldId),
		};

		onFieldDataUpdate(updatedFields);
	};
	handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		this.setState({
			[name]: type === 'checkbox' ? checked : value,
		});
	};
	handleSubmit = (e) => {
		e.preventDefault();
		const { fieldName, fieldType, fieldValue, fieldDescription, isRequired, editingField } =
			this.state;
		const { fieldData, onFieldDataUpdate } = this.props;

		const newField = {
			id: editingField?.id || Date.now().toString(),
			label: fieldName,
			type: fieldType,
			value: fieldValue,
			description: fieldDescription,
			isRequired: isRequired,
		};

		let updatedFields;
		if (editingField) {
			// Update existing field
			updatedFields = {
				...fieldData,
				custom: fieldData.custom.map((field) =>
					field.id === editingField.id ? newField : field,
				),
			};
		} else {
			// Add new field
			updatedFields = {
				...fieldData,
				custom: [...fieldData.custom, newField],
			};
		}

		onFieldDataUpdate(updatedFields);
		this.toggleVariableModal(); // Close modal after submission
	};

	deleteSmartField = (varaiableID) => {
		this.deleteVariable(this.props.params.templateID, varaiableID);
	};

	handleEditSmartField = (field) => {
		// const showModal = field.type !== 'module' && field.type !== 'workspace';
		this.setState({
			showAddSmartModal: true,
			name: field.displayName,
			value: field.defaultValue,
			selectedOption: field.inputType,
			isEdit: true,
			activeFieldData: field,
		});
	};

	toggleVariableModal = (field = null) => {
		this.setState({
			showVariableModal: !this.state.showVariableModal,
			editingField: field,
			// Reset form state when opening/closing modal
			fieldName: field ? field.label : '',
			fieldType: field ? field.type : 'text',
			fieldValue: field ? field.value : '',
			fieldDescription: field ? field.description : '',
			isRequired: field ? field.isRequired : false,
		});
	};

	handleCloseAddSmartFieldModal = () => {
		this.setState({
			showAddSmartModal: false,
			isEdit: false,
			name: '',
			selectedOption: '',
			value: '',
			editingField: null,
			activeFieldData: null,
		});
	};
	handleOpenAddSmartFieldModal = (field = null) => {
		this.setState({
			showAddSmartFieldModal: true,
			isEdit: !!field,
			editingField: field,
			name: field ? field.label : '',
			selectedOption: field ? field.type : '',
			value: field ? field.value : '',
		});
	};

	handleSelect = (value) => {
		this.setState({ selectedOption: value, isOpen: false });
	};

	handleCreateSmartField = () => {
		const { value, selectedOption, name } = this.state;
		if (!name || !selectedOption || !value) {
			console.error('All fields are required');
			return;
		}
		const json = {
			defaultValue: value,
			displayName: name,
			inputType: selectedOption,
			isRequired: false,
			templateId: this.props.params.templateID,
		};
		const params = new URLSearchParams(window.location.search);
		const stemplateId = params.get('templateId');
		const isworkflowjson = {
			blockId: this.props.activeSectionID,
			defaultValue: value,
			displayName: name,
			inputType: selectedOption,
			isRequired: false,
			templateId: this.props.workflowTemplateID,
			workflowId: this.props.workflowID,
		};
		if (this.state.isWorkflow) {
			this.props.postIndividulVariables(isworkflowjson);
		} else {
			this.props.postVariables(json);
		}
		this.setState({
			showAddSmartModal: false,
			name: '',
			value: '',
			selectedOption: '',
		});
	};

	editSmartFields = () => {
		const { value, selectedOption, name, activeFieldData } = this.state;
		const referanceJson = {
			defaultValue: activeFieldData?.defaultValue,
			displayName: activeFieldData?.displayName,
			inputType: activeFieldData?.inputType,
			isRequired: false,
		};
		const json = {
			defaultValue: value,
			displayName: name,
			inputType: selectedOption,
			isRequired: false,
		};

		if (!name || !selectedOption || !value) {
			console.error('All fields are required');
			return;
		}

		if (!_.isEqual(referanceJson, json)) {
			this.updateVariables(json, this.props.params.templateID, activeFieldData?._id);
			this.setState({
				showAddSmartModal: false,
			});
		} else {
			this.setState({
				showAddSmartModal: false,
			});
		}
	};

	toggleFontsDropDown = (e) => {
		e.stopPropagation();

		this.setState({
			showFontsVariantDropDown: false,
			showFontsDropDown: !this.state.showFontsDropDown,
		});
	};
	toggleFontsVariantDropDown = (e) => {
		e.stopPropagation();
		this.setState({
			showFontsDropDown: false,
			showFontsVariantDropDown: !this.state.showFontsVariantDropDown,
		});
	};
	toggleVariablesDropDown = (e) => {
		e.stopPropagation();
		this.setState({
			showVariablesDropDown: true,
		});
	};
	togglePopupVariable = (e) => {
		e.stopPropagation();
		this.setState({
			showPopUpVariable: !this.state.showPopUpVariable,
		});
	};
	toggleQuestionTypeDropDown = (e) => {
		e.stopPropagation();
		this.setState({
			showQuestionTypeDropDown: !this.state.showQuestionTypeDropDown,
		});
	};
	toggleLineTypeDropDown = (e) => {
		e.stopPropagation();
		this.setState({
			showLineTypeDropDown: !this.state.showLineTypeDropDown,
		});
	};
	handleFontColor = (e) => {
		// Update local state immediately to show changes
		this.setState(
			{
				fontColor: e,
			},
			() => {
				this.props.changeFontColor('foreColor', e);
			},
		);
	};
	handleFontSize = (e, type = null) => {
		this.setState(
			{
				fontSize: e,
			},
			() => {
				if (type == true) {
					this.props.changeFontColor('fontSize', e.toString());
				}
			},
		);
	};
	handleSendFontSize = (e) => {
		let font = this.state.fontSize;
		this.props.changeFontColor('fontSize', font.toString());
	};
	handleFontSizeInput = (e) => {
		e.preventDefault();
		let hexRegex = /^[0-9]*$/i;
		let value = e.target.value;

		if (hexRegex.test(value) == true) {
			this.setState(
				{
					fontSize: value,
				},
				() => {
					this.props.changeFontColor('fontSize', e.toString());
				},
			);
		} else {
			this.setState({
				fontSize: '',
			});
		}
	};
	handleFontLineHeight = (e) => {
		this.setState(
			{
				lineHeight: e,
			},
			() => {
				this.props.changeFontColor('lineHeight', e);
			},
		);
	};
	handleFontLetterSpacing = (e) => {
		this.setState(
			{
				letterSpacing: e,
			},
			() => {
				this.props.changeFontColor('letterSpacing', e);
			},
		);
	};
	changeTextAlign = (e, align) => {
		this.setState(
			{
				[e]: true,
			},
			() => {
				this.props.changeFontColor(align, null);
			},
		);
		//e.stopPropagation();
	};

	handleFontFamily = (e = null, font) => {
		e.stopPropagation();
		this.setState(
			{
				activeFont: font,
				// showFontsDropDown: false,
			},
			() => {
				this.props.changeFontColor('fontName', font);
			},
		);
	};
	handleFontFamilyWeight = (e = null, fontVariant) => {
		this.setState(
			{
				activeFontVariant: fontVariant.variant,
				activeFontWeight: fontVariant.weight,
				activeFontStyle: fontVariant.style,
			},
			() => {
				this.props.changeFontColor('fontWeight', this.state.activeFontWeight);
				setTimeout(() => {
					this.props.changeFontColor('fontStyle', this.state.activeFontStyle);
				}, 1000);
			},
		);

		e.stopPropagation();

		// this.props.changeFontColor('fontWeight', activeFontVariant?.weight);
		// this.props.changeFontColor('fontStyle', activeFontVariant?.style);
	};
	handleVariable = (e, id, value) => {
		// this.setState({
		// 	activeFont: value,
		// });
		this.setState({
			activeVariable: value,
		});
		e.stopPropagation();

		this.props.addVariable(id, value);
	};

	onCropChange = (crop) => {
		localStorage.setItem(
			`${this.state.activeImageURL}::${this.state.activeSectionID}::crop`,
			JSON.stringify(crop),
		);

		let zoom;
		if (
			localStorage.getItem(
				`${this.state.activeImageURL}::${this.state.activeSectionID}::zoom`,
			)
		) {
			zoom = localStorage.getItem(
				`${this.state.activeImageURL}::${this.state.activeSectionID}::zoom`,
			);
		} else {
			zoom = this.state.zoom;
		}

		this.setState({ crop }, () => {
			this.props.setCrop(crop, zoom);
		});
	};

	onCropComplete = (croppedArea, croppedAreaPixels) => {};

	onZoomChange = (zoom) => {
		localStorage.setItem(
			`${this.state.activeImageURL}::${this.state.activeSectionID}::zoom`,
			zoom,
		);
		let crop;
		if (
			localStorage.getItem(
				`${this.state.activeImageURL}::${this.state.activeSectionID}::crop`,
			)
		) {
			crop = JSON.parse(
				localStorage.getItem(
					`${this.state.activeImageURL}::${this.state.activeSectionID}::crop`,
				),
			);
		} else {
			crop = this.state.crop;
		}

		this.setState({ zoom }, () => {
			this.props.setZoom(crop, zoom, true);
		});
	};
	// updateSelectedStyles = () => {
	// 	const startMarker = document.querySelector(
	// 		'[data-jodit-selection_marker="start"]'
	// 	);
	// 	if (startMarker) {
	// 		const computedStyle = window.getComputedStyle(
	// 			startMarker.parentElement
	// 		);
	// 		if (this.state.fontColor !== `#${rgbHex(computedStyle.color)}`) {
	// 			this.handleFontColor(`#${rgbHex(computedStyle.color)}`, true);
	// 		}
	// 		let fontFamily = computedStyle.fontFamily;

	// 		let splitFontFamily = fontFamily.split(',')[0].trim();
	// 		let family = splitFontFamily.replace(/"/g, '');

	// 		if (this.state.activeFont !== family) {
	// 			this.handleFontFamily(null, family, true);
	// 		}
	// 		let fontSize = computedStyle.fontSize;
	// 		let fontSizeInt = fontSize.replace('px', '');

	// 		if (this.state.fontSize !== parseInt(fontSizeInt)) {
	// 			this.handleFontSize(parseInt(fontSizeInt), true);
	// 		}
	// 		// Add more style properties as needed
	// 	}
	// };
	setPadding = (e) => {
		this.props.setBlockPadding(e);
	};
	setHorizontalPadding = (e) => {
		this.props.setHorizontalPadding(e);
	};

	handleDivClick = () => {
		this.fileInputRef.current.click();
	};
	handleDiv2Click = () => {
		this.bgFileInputRef.current.click();
	};

	handleFileChange = async (event, uploadAIImage = false) => {
		let file;
		if (uploadAIImage) {
			this.setState({
				activeImageURL: null,
			});
			try {
				// Handle both full data URL and raw base64 string
				const base64Data = event.includes('data:') ? event.split(';base64,').pop() : event;

				// Validate base64 string
				if (!base64Data || !/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
					throw new Error('Invalid base64 string');
				}

				const byteCharacters = atob(base64Data);
				const byteArrays = [];

				for (let offset = 0; offset < byteCharacters.length; offset += 512) {
					const slice = byteCharacters.slice(offset, offset + 512);
					const byteNumbers = new Array(slice.length);

					for (let i = 0; i < slice.length; i++) {
						byteNumbers[i] = slice.charCodeAt(i);
					}

					const byteArray = new Uint8Array(byteNumbers);
					byteArrays.push(byteArray);
				}

				const blob = new Blob(byteArrays, { type: 'image/jpeg' });
				file = new File([blob], 'ai-generated-image.jpg', { type: 'image/jpeg' });
			} catch (error) {
				console.error('Error processing base64 image:', error);
				return;
			}
		} else {
			file = event.target.files[0];
		}

		if (file) {
			this.setState({ showImageProgressBar: true }, () => {
				this.startCounting();
			});

			let json = {
				uploadBatchId: this.state.uploadBatchID,
				originalFileName: uploadAIImage ? 'ai-generated-image.jpg' : file.name,
				originalDateTime: uploadAIImage ? moment().unix() : file.lastModified,
			};

			let res = null;

			if (this.state.isWorkflow) {
				res = await this.uploadImageWorkflow(json, file, {
					module: this.props.module,
					activeWorkflowModuleId: this.props.activeWorkflowModuleId,
				});
			} else {
				res = await this.uploadImage(json, file);
			}

			this.setState({
				uploadedImageURL: res[1],
			});

			let interval = setInterval(() => this.getUploadStatus(res[0]), 3000);
			this.setState({
				interval: interval,
			});
		}
	};
	getUploadStatus = async (imageID) => {
		let res = await this.getImageUploadStatus(this.state.uploadBatchID);
		if (res.processedCount === 1 && res.uploadedCount === 1) {
			clearInterval(this.state.interval);
			//this.props.getImages();
			//this.props.saveImage(imageID, this.state.originalHeight, this.state.originalWidth);
			this.setState(
				{
					interval: null,
					progressCount: 0,
					showImageProgressBar: false,
					activeImageURL: this.state.uploadedImageURL,
					uploadBatchID: randomize('Aa0', 10),
				},
				() => {
					this.props.setImage(this.state.uploadedImageURL);
				},
			);
		}
	};
	startCounting = () => {
		const duration = 2000; // 2 seconds
		const targetCount = 99;
		const interval = 10; // milliseconds
		const increment = targetCount / (duration / interval);

		this.intervalId = setInterval(() => {
			this.setState((prevState) => {
				const newCount = prevState.progressCount + increment;
				if (newCount >= targetCount) {
					clearInterval(this.intervalId);
					return { progressCount: targetCount };
				}
				return { progressCount: newCount };
			});
		}, interval);
	};
	setCroppedArea = (e) => {};
	handleRemoveImage = (e) => {
		this.props.removeImage(e);
	};
	handleServiceSelection = (e, value) => {
		this.setState(
			{
				services_selection: value,
			},
			() => {
				this.props.setServiceTable('services_selection', value);
				if (value === 2) {
					this.props.setServiceTable('selection_is_required', false);
					this.setState({ selection_is_required: false });
				}
			},
		);
	};
	handleServiceStyle = (e, value) => {
		this.setState(
			{
				services_style: value,
			},
			() => {
				this.props.setServiceTable('services_style', value);
			},
		);
	};
	handleServiceBoolean = (e) => {
		this.setState(
			{
				selection_is_required: !this.state.selection_is_required,
			},
			() => {
				this.props.setServiceTable(
					'selection_is_required',
					this.state.selection_is_required,
				);
			},
		);
	};
	handleServiceToast = (e) => {
		this.setState(
			{
				activeSection: {
					...this.state.activeSection,
					style: { ...this.state.activeSection?.style, toast: e },
				},
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	handleSetVariableProperties = (e, type) => {
		this.setState(
			{
				activeVariableInfo: {
					...this.state.activeVariableInfo,
					[type]: e,
				},
			},
			() => {
				let activeContractVariable = this.state.activeContractVariable;
				let variables = [...this.state.sectionVariables];
				let vars = [];
				_.map(variables, (varb, k) => {
					if (varb._id === activeContractVariable) {
						vars.push(this.state.activeVariableInfo);
					} else {
						vars.push(varb);
					}
				});
				this.setState(
					{
						sectionVariables: vars,
						activeContractVariable,
					},
					() => {
						this.props.setSectionVariables(vars, this.state.activeContractVariable);
					},
				);
			},
		);
	};
	handleFormIsRequired = (e) => {
		let isRequired =
			this.state.activeFormBlock !== null
				? this.state.activeFormBlock.isRequired
					? this.state.activeFormBlock.isRequired
					: false
				: false;

		this.props.setActiveQuestionIsRequired(!isRequired);
	};
	handleFormIsMultiple = (e) => {
		let isMultiple =
			this.state.activeFormBlock !== null
				? this.state.activeFormBlock?.answerOptions?.isMultiple
					? this.state.activeFormBlock?.answerOptions?.isMultiple
					: false
				: false;

		this.props.setActiveQuestionIsMultiple(!isMultiple);
	};
	returnFormQuestionVariable = () => {
		// let variables = [...this?.state?.variables];
		let variables = Array.isArray(this?.state?.variables) ? [...this?.state?.variables] : [];
		let varb =
			this.state.activeFormBlock !== null
				? this.state.activeFormBlock.variableId
					? this.state.activeFormBlock.variableId
					: null
				: null;
		let activeVar;
		if (varb !== null) {
			activeVar = _.filter(variables, { _id: varb })[0]?.displayName;
		} else {
			activeVar = null;
		}
		return activeVar;
	};
	handleSubBlockOption = (key, val) => {
		let viewSubBlockOptions = [...this.state.activeSection?.style.viewSubBlockOptions];
		let optionsArr = [];
		_.map(viewSubBlockOptions, (opt, k) => {
			if (k == key) {
				opt = { [_.keys(opt)[0]]: val };
			}
			optionsArr.push(opt);
		});
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				viewSubBlockOptions: optionsArr,
			},
		};

		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection, null);

				activeSection?.style?.viewSubBlockOptions?.map((opt, index) => {
					if (index === key && Object.keys(opt)[0]?.toLowerCase() === 'website') {
						this.updateIconLinks();
					}
				});
			},
		);
	};

	updateIconLinks = () => {
		let newSections = [...this.state.sections];
		let arr = [];
		_.map(newSections, (section, k) => {
			_.map(section?.blocks, (block, i) => {
				_.map(block?.subBlocks, (subBlock, j) => {
					if (subBlock?.type === 'icon' && subBlock?.label?.toLowerCase() === 'website') {
						// subBlock.link = this.state.socialMediaLinks[subBlock.label] || '';

						subBlock.link = this.state?.socialMediaLinks?.Website;
					}
				});
				if (section) {
					arr.push(section);
				}
			});
		});

		this.setState({ sections: arr }, () => {
			this.props.setActiveSection(arr);
		});
	};

	handleSubBlockOptionForService = (key, val, label) => {
		let labels = [...this.state.activeSection?.style.labels];
		let optionsArr = [];
		_.map(labels, (opt, k) => {
			if (Object.keys(opt)?.[0] === label) {
				opt = { [_.keys(opt)[0]]: val };
			}
			optionsArr.push(opt);
		});

		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				labels: optionsArr,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};
	handleSubBlockItemOptionForService = (name, val, label) => {
		let labels = _.filter(this.state?.activeSection?.blocks, {
			_id: this.state?.activeServiceSubBlock,
		})[0]?.labels;
		let optionsArr = [];
		let arr = [];
		if (name == 'button') {
			_.map(this.state?.activeSection.blocks, (block, k) => {
				if (block._id === this.state.activeServiceSubBlock) {
					block.hideButton = val;
				}
				arr.push(block);
			});
		} else {
			_.map(labels, (opt, k) => {
				if (Object.keys(opt)?.[0] === label) {
					opt = { [_.keys(opt)[0]]: val };
				}
				optionsArr.push(opt);
			});

			_.map(this.state?.activeSection.blocks, (block, k) => {
				if (block._id === this.state.activeServiceSubBlock) {
					block.labels = optionsArr;
				}
				arr.push(block);
			});
		}
		let activeSection = {
			...this.state.activeSection,
			blocks: arr,
		};

		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};
	handleSubBlockItemOptionQuantityService = (e) => {
		let activeBlock = _.filter(this.state?.activeSection?.blocks, {
			_id: this.state?.activeServiceSubBlock,
		})[0];

		let value = activeBlock.canClientCustomiseQuantity
			? activeBlock.canClientCustomiseQuantity
			: false;
		let arr = [];
		_.map(this.state?.activeSection.blocks, (block, k) => {
			if (block._id === this.state.activeServiceSubBlock) {
				block.canClientCustomiseQuantity = !value;
			}
			arr.push(block);
		});
		let activeSection = {
			...this.state.activeSection,
			blocks: arr,
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};
	setSubBlockItemServiceBg = (e, type) => {
		let arr = [];
		_.map(this.state?.activeSection.blocks, (block, k) => {
			if (block._id === this.state.activeServiceSubBlock) {
				block[type] = e;
			}
			arr.push(block);
		});
		let activeSection = {
			...this.state.activeSection,
			blocks: arr,
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};
	handleServiceSubTotal = (e, type) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				[type]: e.target.value,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};
	handleBlockBackground = (key, val) => {
		let subBlocksBackground = {
			...this.state.activeSection?.style?.subBlocksBackground,
			[key]: val,
		};
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				subBlocksBackground: subBlocksBackground,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};

	// for background of subblocks -Abdullah
	handleSubBlockBackgroundColor = (key, val) => {
		let subBlocksBackgroundColor = {
			...this.state.activeSection?.style?.subBlocksBackgroundColor,
			[key]: val,
		};
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				subBlocksBackgroundColor: subBlocksBackgroundColor,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};

	// for borderColor of subblocks -Abdullah
	handleSubBlockBorderColor = (key, val) => {
		let subBlocksBorderColor = {
			...this.state.activeSection?.style?.subBlocksBorderColor,
			[key]: val,
		};
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				subBlocksBorderColor: subBlocksBorderColor,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};

	handleActiveShape = (shapeName) => {
		this.setState({
			activeShape: shapeName,
		});
		this.props.setActiveShape(shapeName, this.state.activeSectionID);
	};
	handleButton = (value) => {
		let newActiveSection = { ...this.props?.activeSection };
		newActiveSection?.blocks?.map((block) => {
			block.subBlocks.map((subBlock) => {
				if (this.state.activeSubBlockID === subBlock?._id) {
					return (subBlock.linkTo = 'url');
				}
			});
		});
		this.setState({ activeSection: newActiveSection }, () => {
			this.props.setButtonLink(value);
			setTimeout(() => {
				this.props.setActiveSection(newActiveSection);
			}, 1000);
		});
		this.setState({ buttonLink: '' });
	};
	handleOpenNewTab = () => {
		this.setState({
			openNewTab: { isOpen: !this.state?.openNewTab?.isOpen },
		});
		this.props.openNewTabfn(!this.state.openNewTab?.isOpen);
	};
	handleButtonShape = (btShape) => {
		this.setState(
			{
				btShape: btShape,
			},
			() => {
				this.props.setButtonShape(btShape);
			},
		);
	};
	handleButtonStyles = (e, value) => {
		if (value === 'background') {
			this.setState(
				{
					buttonStyle: {
						...this.state.buttonStyle,
						background: e,
					},
				},
				() => {
					this.props.setButtonStyles(this.state.buttonStyle);
				},
			);
		} else if (value === 'borderColor') {
			this.setState(
				{
					buttonStyle: {
						...this.state.buttonStyle,
						borderColor: e,
					},
				},
				() => {
					this.props.setButtonStyles(this.state.buttonStyle);
				},
			);
		} else if (value === 'borderWidth') {
			this.setState(
				{
					buttonStyle: {
						...this.state.buttonStyle,
						borderWidth: parseInt(e),
					},
				},
				() => {
					this.props.setButtonStyles(this.state.buttonStyle);
				},
			);
		}
	};
	setImagePosition = (e) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				imagePositionStyles: e,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	setContentPosition = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			if (_.has(block, 'contentAlign')) {
				return _.set(block, 'contentAlign', e);
			}
			return block;
		});

		this.setState(
			{
				activeSection,
				contentAlign: e,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
				this.props.setContent(e);
			},
		);
	};
	setImageShapes = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'border')) {
					return _.set({ ...subBlock }, 'border', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				blockBorder: e,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
				this.props.setImageShapes(e);
			},
		);
	};
	setDeviceType = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'device')) {
					return _.set({ ...subBlock }, 'device', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				blockBorder: e,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
				this.props.setDeviceTypes(e);
			},
		);
	};
	handleFooterSpacing = (e) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				gap: e,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	setFooterIconPosition = (e) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				iconsAlign: e,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	setIconSize = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'iconSize')) {
					return _.set({ ...subBlock }, 'iconSize', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				currentSizeIcons: e,
				activeSection,
			},
			() => {
				this.props.setFooterIconSize(this.state?.currentSizeIcons);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	handleIconColor = (e) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'fillColor')) {
					return _.set({ ...subBlock }, 'fillColor', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				currentIconColor: e,
				activeSection,
			},
			() => {
				this.props.setFooterIconColor(this.state?.currentIconColor);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	handleIconBgColor = (e) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'iconBgColor')) {
					return _.set({ ...subBlock }, 'iconBgColor', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				currentIconBgColor: e,
				activeSection,
			},
			() => {
				this.props.setFooterIconBgColor(this.state?.currentIconBgColor);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	setIconStyle = (e) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'iconType')) {
					return _.set({ ...subBlock }, 'iconType', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				currentIconType: e,
			},
			() => {
				this.props.setFooterIcontype(this.state?.currentIconType);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	setStickerShape = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.stickerShape = e;
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				// activeSubBlockID
				if (activeSection?.isFluidSection) {
					if (subBlock?._id === this.state.activeSubBlockID) {
						return _.set({ ...subBlock }, 'isSticker', e);
					} else {
						return subBlock;
					}
				} else if (_.has(subBlock, 'isSticker')) {
					return _.set({ ...subBlock }, 'isSticker', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				currentSticker: e,
				activeSection,
			},
			() => {
				//this.props.setCurrentSticker(this.state?.currentSticker);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	handleStickerFill = (e, type) => {
		let activeSection = { ...this.state.activeSection };
		if (activeSection?.isFluidSection) {
			activeSection.blocks = _.map(activeSection.blocks, (block) => {
				block.subBlocks = _.map(block.subBlocks, (subBlock) => {
					if (subBlock?._id === this.state.activeSubBlockID) {
						return { ...subBlock, [type]: e };
					} else {
						return subBlock;
					}
				});
				return block;
			});
			this.setState(
				{
					activeSection,
				},
				() => {
					this.props.setActiveSection(this.state.activeSection);
				},
			);
		} else {
			activeSection.style = { ...activeSection.style, [type]: e };

			this.setState(
				{
					activeSection,
				},
				() => {
					this.props.setActiveSection(this.state.activeSection);
				},
			);
		}
	};

	// list icons functions Abdullah,

	setListIconColor = (e) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.color = e;
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'color')) {
					if (activeSection.isFluidSection) {
						if (subBlock._id == this.state.activeSubBlockID) {
							return _.set({ ...subBlock }, 'color', e);
						} else {
							return subBlock;
						}
					} else {
						return _.set({ ...subBlock }, 'color', e);
					}
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				listIconColor: e,
			},
			() => {
				this.props.setlistIconColor(this.state?.listIconColor);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	setListIconSize = (e) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.size = e;
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'size')) {
					if (activeSection.isFluidSection) {
						if (subBlock._id == this.state.activeSubBlockID) {
							return _.set({ ...subBlock }, 'size', e);
						} else {
							return subBlock;
						}
					} else {
						return _.set({ ...subBlock }, 'size', e);
					}
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				listIconSize: e,
			},
			() => {
				this.props?.setlistIconSize(this.state?.listIconSize);
				this.props.setActiveSection(this.state?.activeSection);
			},
		);
	};

	setListIconShape = (e) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.shape = e;
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'shape') && subBlock.type === 'listIcon') {
					if (activeSection.isFluidSection) {
						if (subBlock._id == this.state.activeSubBlockID) {
							return _.set({ ...subBlock }, 'shape', e);
						} else {
							return subBlock;
						}
					} else {
						return _.set({ ...subBlock }, 'shape', e);
					}
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				listIconShape: e,
			},
			() => {
				this.props.setlistIconShape(this.state?.listIconShape);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	// list spacing code -Abdullah
	handleListSpacing = (e) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				gap: e,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				//this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	setMobileImagePosition = (e) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				mimagePosition: e,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};
	handleListCount = (e) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				count: e,
			},
		};
		this.setState(
			{
				activeSection,
			},
			() => {
				// setTimeout(() => {
				// 	this.props.setActiveSection(activeSection);
				// }, 500);
			},
		);
	};
	returnDisplayItem = (e) => {
		let display = 'flex';
		let labels = this.state?.activeSection?.style?.labels;
		let label = labels.find((obj) => obj.hasOwnProperty(e));

		display = label && label[e] == true ? 'flex' : 'none';

		return display;
	};
	handleImageWidth = (e) => {
		this.setState(
			{
				imageWidth: {
					width: `${e}px`,
					height: `${e}px`,
				},
			},
			() => {
				this.props.setImageWidth(this.state.crop, this.state.zoom, this.state.imageWidth);
			},
		);
	};
	handleEventCardBg = (e, type) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				[type]: e,
			},
		};

		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};
	// getServiceItemValue = (type) => {
	// 	let value = '';
	// 	value = _.filter(this.state?.activeSection?.blocks, {
	// 		_id: this.state?.activeServiceSubBlock,
	// 	})[0]?.subBlocks[0][type];
	// 	return value;
	// };
	setServiceItemValue = (val, type) => {
		let blocks = _.cloneDeep(this.state?.activeSection.blocks);
		let arr = [];
		let vals;
		const re = /^[0-9\b]+$/;
		let recalculatedSubtotalValue = 0;
		if (type !== 'unit') {
			if (val === '' || re.test(val)) {
				vals = val;
			} else {
				vals = _.filter(this.state?.activeSection?.blocks, {
					_id: this.state?.activeServiceSubBlock,
				})[0]?.subBlocks[0][type];
			}
		} else {
			vals = val;
		}
		_.map(blocks, (table, key) => {
			if (table._id == this.state.activeServiceSubBlock) {
				_.map(table.subBlocks, (value, k) => {
					if (k == 0) {
						value[type] = vals;
					}
				});
			}
			const { amount, quantity } = table?.subBlocks?.[0];
			recalculatedSubtotalValue += (+amount || 0) * (+quantity || 0);
			arr.push(table);
		});
		let section = { ...this.state.activeSection, blocks: arr };
		section = {
			...section,
			style: { ...section.style, subTotalValue: recalculatedSubtotalValue },
		};

		this.setState(
			{
				activeSection: section,
			},
			() => {
				clearTimeout(this.state.timeout);
				const timeout = setTimeout(() => {
					this.props.setActiveSection(section, true);
					this.props.setActiveTable(
						val,
						type,
						this.state.activeServiceSubBlock,
						section._id,
					);
				}, 500);
				this.setState({ timeout });
			},
		);
	};

	handleHeader = (e, value) => {
		if (e === 'header') {
			this.setState(
				{
					isHeader: !this.state.isHeader,
				},
				() => {
					this.props.setHeader(e, this.state.isHeader);
				},
			);
		} else {
			this.setState(
				{
					formBgColor: value,
				},
				() => {
					this.props.setHeader(e, value);
				},
			);
		}
	};
	toggleShowImageModal = (e) => {
		e.preventDefault();
		this.setState({
			showImageModal: !this.state.showImageModal,
		});
	};

	toggleShowVariableModal = (e) => {
		this.setState({
			showVariableModal: !this.state.showVariableModal,
			showVariablesDropDown: !this.state.showVariablesDropDown,
		});
	};
	handleTheme = () => {
		this.setState(
			{
				isTheme: !this.state.isTheme,
			},
			() => {
				this.props.setTheme(this.state.isTheme, 'isTheme');
			},
		);
	};
	setActiveTheme = (theme) => {
		let newActiveSection = { ...this.state.activeSection };
		if (this.state?.activeSection?.style?.isFormLayout) {
			newActiveSection.style.theme = theme;
			this.setState(
				{
					activeSection: newActiveSection,
					activeTheme: theme,
				},
				() => {
					this.props.setActiveSection(newActiveSection);
				},
			);
		} else {
			this.setState(
				{
					activeTheme: theme,
				},
				() => {
					this.props.setTheme(this.state.activeTheme, 'theme');
				},
			);
		}
	};
	handleCustomTheme = (key, e) => {
		let newActiveSection = { ...this.state.activeSection };
		if (this.state?.activeSection?.style?.isFormLayout) {
			newActiveSection.style.theme[key] = e;
			this.setState(
				{
					activeSection: newActiveSection,
					activeTheme: {
						...this.state.activeTheme,
						[key]: e,
					},
				},
				() => {
					this.props.setActiveSection(newActiveSection);
				},
			);
		} else {
			this.setState(
				{
					activeTheme: {
						...this.state.activeTheme,
						[key]: e,
					},
				},
				() => {
					this.props.setTheme(this.state.activeTheme, 'theme');
				},
			);
		}
	};
	handleCircleTextChanges = (e, value) => {
		let newText;
		if (value === 'text') {
			newText = e.target.value;
		}

		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (subBlock.type === 'circleText') {
					if (value === 'text') {
						return { ...subBlock, text: newText };
					} else if (value === 'color') {
						return {
							...subBlock,
							style: {
								...subBlock.style,
								color: e,
							},
						};
					} else if (value === 'radius') {
						return { ...subBlock, radius: e };
					} else if (value === 'width') {
						return { ...subBlock, width: e };
					}
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				circleTextData: {
					...this.state.circleTextData,
					text: value === 'text' ? newText : this.state?.circleTextData.text,
					radius: value === 'radius' ? e : this.state?.circleTextData.radius,
					width: value === 'width' ? e : this.state?.circleTextData.width,
					style: {
						...this.state.circleTextData.style,
						color: value === 'color' ? e : this.state.circleTextData.style.color,
					},
				},
				activeSection: activeSection,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
				this.props.setCircleTextData(this.state.circleTextData);
			},
		);
	};
	setAnimationOption = (e, index) => {
		this.props.setActiveAnimation(index);
	};
	handleAnimation = (e) => {
		this.props.setAnimationType(e);
	};
	handleAnimationDirection = (e) => {
		this.props.setAnimationDirection(e);
	};
	handleAnimationSpeed = (e) => {
		this.props.handleAnimationSpeed(e);
	};
	handleFoldBlock = (e) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				foldBlock: !this.state?.activeSection?.style?.foldBlock,
			},
		};

		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(activeSection);
			},
		);
	};
	handleFoldBlockText = (e) => {
		let newActiveSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				foldBlockText: e,
			},
		};

		this.setState({
			activeSection: newActiveSection,
			tempFoldableText: e,
		});
	};
	handleSectionStyle = (e, type) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				[type]: e,
			},
		};

		this.setState(
			{
				activeSection,
			},
			() => {
				if (type !== 'borderWidth' || type !== 'width' || type !== 'spacing')
					this.props.setActiveSection(activeSection, null);
			},
		);
	};

	// logo sticker -Abdullah

	setLogoStickerFill = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'fillColor')) {
					return _.set({ ...subBlock }, 'fillColor', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				logoStickerFill: e,
			},
			() => {
				this.props.setlogoStickerFill(this.state?.logoStickerFill);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	// video block url function
	setVideoURL = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (this.state.activeSubBlockID === subBlock._id) {
					return _.set({ ...subBlock }, 'videoURL', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				videoURL: e,
			},
			() => {
				this.props.setVideoURL(this.state?.videoURL);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	setVideoLoop = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'loop') && this.state.activeSubBlockID === subBlock._id) {
					return _.set({ ...subBlock }, 'loop', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				loop: e,
			},
			() => {
				this.props.setLoop(this.state?.loop);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	setAutoplay = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'autoplay') && this.state.activeSubBlockID === subBlock._id) {
					return _.set({ ...subBlock }, 'autoplay', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				autoplay: e,
			},
			() => {
				this.props.setAutoPlay(this.state?.autoplay);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	setAlignVideoBlock = (e) => {
		let activeSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				alignVideoBlock: e,
			},
		};

		this.setState(
			{
				activeSection,
				alignVideoBlock: e,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
				this.props.setAlignVideoBlock(e);
			},
		);
	};

	setFillVideoBlock = (e) => {
		let activeSection = { ...this.state.activeSection };
		if (_.has(activeSection, 'isFluidSection') && activeSection.isFluidSection) {
			activeSection.blocks = _.map(activeSection.blocks, (block, key) => {
				if (key == 0) {
					block.subBlocks.forEach((subBlock) => {
						if (subBlock._id === this.state.activeSubBlockID) {
							return _.set(subBlock, 'fillVideoBlock', e);
						}
					});
				}
				return block;
			});
		} else {
			activeSection.blocks = _.map(activeSection.blocks, (block) => {
				if (_.has(block, 'fillVideoBlock')) {
					return _.set(block, 'fillVideoBlock', e);
				}
				return block;
			});
		}

		this.setState(
			{
				activeSection,
				fillVideoBlock: e,
			},
			() => {
				this.props.setFillVideoBlock(this.state?.fillVideoBlock);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	// bg types -Abdullah
	handleBackgroundType = (e) => {
		let activeSection = { ...this.state.activeSection };
		if (!activeSection.style) {
			activeSection.style = {};
		}
		activeSection.style.backgroundType = e;

		this.setState(
			{
				activeSection,
				backgroundType: e,
			},
			() => {
				this.props.setBgType(this.state?.backgroundType);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	handleCartBgColor = (e) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.style.cartBackgroundColor = e;
		this.setState({ activeSection }, () => {
			this.props.setActiveSection(this.state.activeSection);
		});
	};
	checkImageExists = (url) => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => reject(false);
			img.src = url;
		});
	};
	handleBgFileChange = async (event) => {
		const file = event.target.files[0];

		if (file) {
			this.setState({ showImageProgressBar: true }, () => {
				this.startCounting();
			});
			let json;
			json = {
				uploadBatchId: this.state.uploadBatchID,
				originalFileName: file.name,
				originalDateTime: file.lastModified,
			};
			let res = null;

			if (this.state.isWorkflow) {
				res = await this.uploadImageWorkflow(json, file, {
					module: this.props.module,
					activeWorkflowModuleId: this.props.activeWorkflowModuleId,
				});
			} else {
				res = await this.uploadImage(json, file);
			}

			const imageURL = await res[1];

			if (!imageURL) {
				console.error('Image URL is invalid:', res);
				return;
			} else {
			}
			let updatedActiveSection = await {
				...this.state.activeSection,
				style: {
					...this.state.activeSection.style,
					backgroundImageURL: await imageURL,
				},
			};

			setTimeout(() => {
				this.checkImageExists(imageURL)
					.then(() => {
						this.setState(
							{
								backgroundImageURL: imageURL,
								activeSection: updatedActiveSection,
							},
							() => {
								this.props?.setBgImageURL(this.state.backgroundImageURL);
								this.props.setActiveSection(this.state.activeSection);
							},
						);
					})
					.catch(() => {
						console.error('Image URL is invalid or not accessible:', imageURL);
					});
			}, 2500);
			let interval = setInterval(() => this.getUploadStatus(res[0]), 1000);
			this.setState({
				interval: interval,
			});
		}
	};

	setBgVideoURL = (e) => {
		let activeSection = { ...this.state.activeSection };

		activeSection.style.backgroundVideoURL = e;
		activeSection.style.backgroundType = 'video';
		activeSection.style.backgroundType = 'video';
		this.setState(
			{
				activeSection,
				backgroundVideoURL: e,
				backgroundType: 'video',
				backgroundType: 'video',
			},
			() => {
				this.props.setBgVideoURL(this.state?.backgroundVideoURL);
				this.props?.setBgType(this.state.backgroundType);
				setTimeout(() => {
					if (this.props.isValidBgVideoURL) {
						this.props.setActiveSection(this.state.activeSection);
					}
				}, 2000);
			},
		);
	};

	handleRemoveBgImage = () => {
		let activeSection = { ...this.state.activeSection };
		activeSection.style.backgroundImageURL = '';

		this.setState(
			{
				activeSection,
				backgroundImageURL: '',
			},
			() => {
				this.props.setBgImageURL(this.state?.backgroundImageURL);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	handleAddBgImageUrl = async (e) => {
		let updatedActiveSection = await {
			...this.state.activeSection,
			style: {
				...this.state.activeSection.style,
				backgroundImageURL: await e,
			},
		};

		this.setState(
			{
				backgroundImageURL: e,
				activeSection: updatedActiveSection,
				addBgImageURL: false,
			},
			() => {
				this.props?.setBgImageURL(this.state.backgroundImageURL);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	//background overlay effect -Abdullah
	handleBgOverlay = (value, type) => {
		let activeSection = { ...this.state.activeSection };

		if (type === 'color') {
			activeSection.style.bgOverlayColor = value;
		} else {
			activeSection.style.bgOverlayOpacity = value;
		}
		this.setState(
			{
				activeSection,
				bgOverlayColor: this.state.activeSection.style?.bgOverlayColor,
				bgOverlayOpacity: this.state.activeSection.style?.bgOverlayOpacity,
			},
			() => {
				//	this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	handleImgOverlay = (type, value) => {
		if (type === 'color') {
			this.setState(
				{
					ImgOverlayColor: value,
				},
				() => {
					// this.props.setActiveSection(this.state.activeSection);
					this.props.setImgOverlay(type, this.state?.ImgOverlayColor);
				},
			);
		} else {
			this.setState(
				{
					ImgOverlayOpacity: value,
				},
				() => {
					// this.props.setActiveSection(this.state.activeSection);
					this.props.setImgOverlay(type, this.state?.ImgOverlayOpacity);
				},
			);
		}
	};

	handleScrollText = (e) => {
		const currentSize = this.state?.fontStyles?.fontSize;

		if (currentSize <= 36 && e.length > 50) {
			this.setState({ textError: 'Maximum 50 characters allowed' });
			setTimeout(() => {
				this.setState({ textError: '' });
			}, 5000);
			return;
		} else if (currentSize > 36 && currentSize <= 45 && e.length > 40) {
			this.setState({
				textError: 'Maximum 40 characters allowed , decrease the font size for more',
			});
			setTimeout(() => {
				this.setState({ textError: '' });
			}, 5000);
			return;
		} else if (currentSize > 45 && currentSize <= 60 && e.length > 30) {
			this.setState({
				textError: 'Maximum 30 characters allowed , decrease the font size for more',
			});
			setTimeout(() => {
				this.setState({ textError: '' });
			}, 5000);
			return;
		} else {
			this.setState({ textError: '' });
		}

		// if (e.length > 15) {
		// 	this.setState({ textError: 'Maximum 15 characters allowed' });
		// 	setTimeout(() => {
		// 		this.setState({ textError: '' });
		// 	}, 5000);
		// 	return;
		// } else {
		// 	this.setState({ textError: '' });
		// }
		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'text')) {
					return _.set({ ...subBlock }, 'text', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				scrollText: e,
			},
			() => {
				this.props.setScrollText(this.state?.scrollText);

				setTimeout(() => {
					this.props.setActiveSection(this.state.activeSection);
				}, 2000);
			},
		);
	};
	// handleItemSpacing = (e) => {
	// 	let activeSection = { ...this.state.activeSection };

	// 	activeSection.blocks = _.map(activeSection.blocks, (block) => {
	// 		block.subBlocks = _.map(block.subBlocks, (subBlock) => {
	// 			if (_.has(subBlock, 'itemSpacing')) {
	// 				return _.set({ ...subBlock }, 'itemSpacing', e);
	// 			}
	// 			return subBlock;
	// 		});
	// 		return block;
	// 	});

	// 	this.setState(
	// 		{
	// 			activeSection,
	// 			itemSpacing: e,
	// 		},
	// 		() => {
	// 			this.props.setItemSpacing(this.state?.itemSpacing);

	// 			setTimeout(() => {
	// 				this.props.setActiveSection(this.state.activeSection);
	// 			}, 2000);
	// 		},
	// 	);
	// };

	handleScrollSymbol = (e) => {
		const specialCharPattern = /^[^a-zA-Z0-9]*$/;

		if (!specialCharPattern.test(e) || e.length > 3) {
			this.setState({ symbolError: 'Only special characters are allowed. Max 3' });
			setTimeout(() => {
				this.setState({ symbolError: '' });
			}, 5000);
			return;
		} else {
			this.setState({ symbolError: '' });
		}

		let activeSection = { ...this.state.activeSection };

		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'scrollSymbol')) {
					return _.set({ ...subBlock }, 'scrollSymbol', e);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection,
				scrollSymbol: e,
			},
			() => {
				this.props.setScrollSymbol(this.state?.scrollSymbol);

				setTimeout(() => {
					this.props.setActiveSection(this.state.activeSection);
				}, 2000);
			},
		);
	};

	handleScrollStyles = (type, value) => {
		let activeSection = { ...this.state.activeSection };

		let newScrollStyles;
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'scrollStyles')) {
					newScrollStyles = { ...subBlock.scrollStyles, [type]: value };

					return _.set({ ...subBlock }, 'scrollStyles', newScrollStyles);
				}
				return subBlock;
			});

			return block;
		});

		this.setState(
			{
				activeSection: activeSection,
				scrollStyles: newScrollStyles,
			},
			() => {
				this.props.setScrollStyles(this.state?.scrollStyles);
				this.props.setActiveSection(activeSection, null);
			},
		);
	};
	handleFontStyles = (type, value) => {
		let activeSection = { ...this.state.activeSection };

		let newFontStyles;
		activeSection.blocks = _.map(activeSection.blocks, (block) => {
			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
				if (_.has(subBlock, 'fontStyles')) {
					newFontStyles = { ...subBlock.fontStyles, [type]: value };

					return _.set({ ...subBlock }, 'fontStyles', newFontStyles);
				}
				return subBlock;
			});
			return block;
		});

		this.setState(
			{
				activeSection: activeSection,
				fontStyles: newFontStyles,
			},
			() => {
				this.props.setFontStyles(this.state?.fontStyles);
				this.props.setActiveSection(activeSection, null);
			},
		);
	};

	handleIframeValues = (type, e) => {
		let activeSection = { ...this.state.activeSection };

		if (type === 'url') {
			// previouse logic
			// const extractSrc = (e) => {
			// 	try {
			// 		// Match the src attribute using regex
			// 		const srcMatch = e.match(/src="([^"]+)"/);

			// 		// Return the src value if found, otherwise return the original string
			// 		// (assuming it might be a direct URL)
			// return srcMatch ? srcMatch[1] : e;
			// 	} catch (error) {
			// 		console.error('Error extracting src:', error);
			// 		return null;
			// 	}
			// };
			// const src = extractSrc(e);

			const processUrl = (input) => {
				try {
					// If input is empty or not a string, return null
					if (!input || typeof input !== 'string') {
						return null;
					}

					// First try to extract src if it's an iframe
					let url = input;
					if (input.includes('<iframe')) {
						const srcMatch = input.match(/src="([^"]+)"/);

						url = srcMatch ? srcMatch[1] : input;
					}

					// Try to process specific platforms only if URL matches their patterns
					if (url.includes('docs.google.com') && url.includes('/spreadsheets/')) {
						return url.replace(/\/edit/, '/preview');
					}

					if (url.includes('onedrive.live.com') || url.includes('office.com')) {
						if (url.includes('?')) {
							return url.replace('?', '/embed?');
						}
						return url + '/embed';
					}

					if (url.includes('.sharepoint.com')) {
						return url.replace('/edit', '/view');
					}

					if (url.includes('sheet.zoho.')) {
						return url.replace('/edit', '/view').replace('?', '/embed?');
					}

					if (url.includes('airtable.com') && !url.includes('/embed')) {
						const baseUrl = url.split('?')[0];
						return `${baseUrl}/embed${
							url.includes('?') ? '?' + url.split('?')[1] : ''
						}`;
					}

					if (url.includes('smartsheet.com')) {
						return url.replace('/edit', '/view');
					}

					// If no specific platform matches, return the original URL
					return url;
				} catch (error) {
					console.error('Error processing URL:', error);
					// Instead of returning null, return the original input
					return input;
				}
			};

			const src = processUrl(e);

			activeSection.blocks = _.map(activeSection.blocks, (block) => {
				block.subBlocks = _.map(block.subBlocks, (subBlock) => {
					if (_.has(subBlock, 'source')) {
						return _.set({ ...subBlock }, 'source', src);
					}

					return subBlock;
				});

				return block;
			});

			this.setState(
				{
					activeSection,
					source: src,
				},
				() => {
					this.props.setSource(this.state?.source);
					setTimeout(() => {
						this.props.setActiveSection(this.state.activeSection);
					}, 1000);
				},
			);
		} else if (type === 'scroll') {
			// this.setState({ iframeScroll: !this.state.iframeScroll }); // Toggle current state
			let activeSection = { ...this.state.activeSection };
			activeSection.blocks = activeSection.blocks.map((block) => {
				block.subBlocks = block.subBlocks.map((subBlock) => {
					if (_.has(subBlock, 'iframeScroll')) {
						return _.set({ ...subBlock }, 'iframeScroll', e);
					} else {
						if (_.has(subBlock, 'source')) {
							const newSubBlock = { ...subBlock, iframeScroll: e };
							return newSubBlock;
						}
					}

					return subBlock;
				});
				return block;
			});

			this.setState(
				{
					activeSection,
					iframeScroll: e, // Update with toggled state
				},
				() => {
					if (this.props.setActiveSection) {
						this.props.setActiveSection(activeSection);
					}
					this.props.setiframeScroll(e);
				},
			);
		} else {
			activeSection.blocks = _.map(activeSection.blocks, (block) => {
				block.subBlocks = _.map(block.subBlocks, (subBlock) => {
					if (_.has(subBlock, 'height')) {
						return _.set({ ...subBlock }, 'height', e);
					}
					return subBlock;
				});
				return block;
			});

			this.setState(
				{
					activeSection,
					iHeight: e,
				},
				() => {
					this.props.setActiveSection(this.state.activeSection);
				},
			);
		}
	};

	// for journey blocks -abdullah

	handleJourneyCount = (e) => {
		let newActiveSection = {
			...this.state.activeSection,
			style: {
				...this.state.activeSection?.style,
				jCountValue: e,
			},
		};
		this.setState(
			{
				activeSection: newActiveSection,
			},
			() => {
				// 	setTimeout(() => {
				this.props.setActiveSection(newActiveSection);
				// 	}, 500);
			},
		);
	};

	handleFoldBtnStyles = (type, value) => {
		let activeSection = { ...this.state.activeSection };

		if (type === 'style') {
			activeSection.style.foldButtonStyles = {
				...activeSection.style.foldButtonStyles,
				btStyle: value,
			};
		} else if (type === 'background') {
			activeSection.style.foldButtonStyles = {
				...activeSection.style.foldButtonStyles,
				background: value,
			};
		} else if (type === 'borderColor') {
			activeSection.style.foldButtonStyles = {
				...activeSection.style.foldButtonStyles,
				borderColor: value,
			};
		} else if (type === 'borderWidth') {
			activeSection.style.foldButtonStyles = {
				...activeSection.style.foldButtonStyles,
				// [type]: parseInt(value),
				borderWidth: value,
			};
		} else {
			activeSection.style.foldButtonStyles = {
				...activeSection.style.foldButtonStyles,

				fontColor: value,
			};
		}

		this.setState(
			{
				activeSection,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	SetPaymentColors = (e, type) => {
		let activeSection = { ...this.state.activeSection };
		if (type == 'font') {
			activeSection.style = {
				...activeSection.style,
				paymentFontColor: e,
			};
		} else {
			activeSection.style = {
				...activeSection.style,
				paymentCardColor: e,
			};
		}
		this.setState(
			{
				activeSection: activeSection,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	SetPaymentColors = (e, type) => {
		let activeSection = { ...this.state.activeSection };
		if (type == 'font') {
			activeSection.style = {
				...activeSection.style,
				paymentFontColor: e,
			};
		} else {
			activeSection.style = {
				...activeSection.style,
				paymentCardColor: e,
			};
		}
		this.setState(
			{
				activeSection: activeSection,
			},
			() => {
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};

	// handleScroll = (e) => {
	// 	let activeSection = { ...this.state.activeSection };
	// 	if (type === 'scroll') {
	// 		activeSection.blocks = _.map(activeSection.blocks, (block) => {
	// 			block.subBlocks = _.map(block.subBlocks, (subBlock) => {
	// 				if (_.has(subBlock, 'iframeScroll')) {
	// 					return _.set({ ...subBlock }, 'iframeScroll', e);
	// 				}
	// 				return subBlock;
	// 			});
	// 			return block;
	// 		});
	// 		this.setState(
	// 			{
	// 				activeSection,
	// 				iframeScroll: e,
	// 			},
	// 			() => {
	// 				this.props.setActiveSection(this.state.setActiveSection);
	// 			},
	// 		);
	// 	}
	// };

	handleInvoiceStyle = (value, type) => {
		let activeSection = { ...this.state?.activeSection };
		if (type === 'card1') {
			activeSection.style.Card1Color = value;
		} else if (type === 'card2') {
			activeSection.style.Card2Color = value;
		} else if (type === 'title') {
			activeSection.style.titleColor = value;
		} else if (type === 'value') {
			activeSection.style.valueColor = value;
		}
		this.setState({ activeSection }, () => {
			this.props?.setActiveSection(this.state?.activeSection);
		});
	};
	handleBackgroundType = (e) => {
		let activeSection = { ...this.state.activeSection };
		if (!activeSection.style) {
			activeSection.style = {};
		}
		activeSection.style.backgroundType = e;

		this.setState(
			{
				activeSection,
				backgroundType: e,
			},
			() => {
				this.props.setBgType(this.state?.backgroundType);
				this.props.setActiveSection(this.state.activeSection);
			},
		);
	};
	handlePageId = (type, id) => {
		let newActiveSection = { ...this.state.activeSection };
		newActiveSection?.blocks?.map((block) => {
			block.subBlocks.map((subBlock) => {
				if (this.state.activeSubBlockID === subBlock?._id) {
					if (type === 'page') {
						return (subBlock.linkTo = type), (subBlock.pageId = id);
					} else if (type === 'section') {
						return (subBlock.linkTo = type), (subBlock.sectionId = id);
					}
				}
			});
		});
		this.setState(
			{ activeSection: newActiveSection, pageDropdown: false, sectionDropdown: false },
			() => {
				this.props.setActiveSection(newActiveSection);
			},
		);
	};
	// handlePageSectionId = (id) => {
	// 	let newActiveSection = {...this.state.activeSection}
	// 	newActiveSection?.blocks?.map((block)=>{
	// 		block.subBlocks.map((subBlock)=>{
	// 			if(subBlock?._id === id){
	// 				return subBlock.sectionId = id
	// 			}
	// 		})
	// 	})
	// 	this.setState({activeSection:newActiveSection},()=>{
	// 		this.props.setActiveSection(newActiveSection);
	// 	})
	// }
	handleIconName = (e) => {
		let activeSection = { ...this.state.activeSection };
		_.map(activeSection.blocks[0].subBlocks, (subBlock) => {
			if (subBlock._id == this.state.activeSubBlockID) {
				subBlock.iconName = e;
			}
		});
		this.setState({ activeSection }, () => {
			this.props?.setActiveSection(this.state?.activeSection);
		});
	};
	handleRowResizing = (value) => {
		let activeSection = { ...this.state.activeSection };
		let lastGridValue = 0;
		if (activeSection?.blocks?.[0]?.subBlocks?.length > 0) {
			activeSection.blocks.forEach((block) => {
				block.subBlocks.forEach((subBlock) => {
					if (subBlock.divStyles?.gridArea) {
						const gridRowValue = parseInt(subBlock.divStyles.gridArea.split('/')[2]);
						lastGridValue = Math.max(lastGridValue, gridRowValue);
					}
				});
			});
		}

		if (
			lastGridValue - 1 <=
			this.state?.activeSection?.blocks?.[0]?.divStyles?.gridRows + value
		) {
			activeSection.blocks[0].divStyles.gridRows =
				this.state?.activeSection?.blocks?.[0]?.divStyles?.gridRows + value;
		}
		if (
			lastGridValue - 1 <=
			this.state?.activeSection?.blocks?.[0]?.divStyles?.gridRows + value
		) {
			this.setState({ activeSection }, () => {
				this.props.setActiveSection(this.state.activeSection);
			});
			this.props.fluidShowGrid('s');
		}
	};
	handleGridGap = (value) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.blocks[0].divStyles = {
			...activeSection.blocks[0].divStyles,
			rowGap: value,
			columnGap: value,
		};
		this.setState({ activeSection }, () => {
			this.props.setActiveSection(this.state.activeSection);
			this.props.fluidShowGrid('s');
		});
	};
	handleGridGapCustom = (value, type) => {
		let activeSection = { ...this.state.activeSection };
		activeSection.blocks[0].divStyles = {
			...activeSection.blocks[0].divStyles,
			[type]: value,
		};
		this.props.fluidShowGrid('s');
		this.setState({ activeSection }, () => {
			this.props.setActiveSection(this.state.activeSection);
		});
	};
	handleStickerStretch = (type, value) => {
		let activeSection = { ...this.state.activeSection };
		if (activeSection?.isFluidSection) {
			activeSection.blocks = _.map(activeSection.blocks, (block) => {
				block.subBlocks = _.map(block.subBlocks, (subBlock) => {
					if (subBlock?._id === this.state.activeSubBlockID) {
						return { ...subBlock, [type]: value };
					} else {
						return subBlock;
					}
				});
				return block;
			});
			this.setState(
				{
					activeSection,
				},
				() => {
					this.props.setActiveSection(this.state.activeSection);
				},
			);
		} else {
			activeSection.style = { ...activeSection.style, [type]: value };

			this.setState(
				{
					activeSection,
				},
				() => {
					this.props.setActiveSection(this.state.activeSection);
				},
			);
		}
	};

	handleDebounceFunction = (func, timeOut = 1000) => {
		if (this.state.debounceTimer) {
			clearTimeout(this.state.debounceTimer);
		}
		const timeOutFunction = setTimeout(() => {
			func();
		}, timeOut);
		this.setState({ debounceTimer: timeOutFunction });
	};
	handleBackgroundWidth = (value) => {
		const moduleId = this.state.activeModuleId;
		let modules = [...this.state.modules];
		let currentModule;
		let arr = _.map(modules, (Module, k) => {
			if (moduleId === Module._id) {
				Module.showType = value;
				if (value === 'full') {
					Module.showAsFull = true;
					Module.showAsSlide = false;
					Module.showAsA4 = false;
				} else if (value === 'slide') {
					Module.showAsSlide = true;
					Module.showAsFull = false;
					Module.showAsA4 = false;
				} else if (value === 'a4') {
					Module.showAsSlide = false;
					Module.showAsFull = false;
					Module.showAsA4 = true;
					this.setState({ preview: true, activeTab: 'p' });
				}
				currentModule = Module;
			}
			return Module;
		});
		this.setState({ modules: arr, activeBackgroundWidth: value }, () => {
			this.props.putModules(arr);
			this.props?.setActiveModule(currentModule);
			this.props?.setCloseSidebar(false);
		});
	};
	handleA4BgColor = (e) => {
		const moduleId = this.state.activeModuleId;
		let modules = [...this.state.modules];
		let currentModule;
		let arr = _.map(modules, (Module, k) => {
			if (moduleId === Module._id) {
				Module.a4BgColor = e;
				currentModule = Module;
			}
			return Module;
		});
		this.setState({ modules: arr }, () => {
			this.props.putModules(arr);
			this.props?.setActiveModule(currentModule);
		});
	};
	handlePageType = (e) => {
		this.setState({
			editActiveModule: e,
		});
	};

	handleElementAnimationsType = (value) => {
		this.setState(
			{
				activeElementAnimeType: value == 'none' ? '' : value,
				showAnimationOptions: false,
			},
			() => {
				this.props?.handleElementAnimationsType(value, this.state?.activeSectionID);
			},
		);
	};
	handleRemoveElementAnimations = (e) => {
		e.stopPropagation();
		this.setState(
			{
				activeElementAnimeType: '',
			},
			() => {
				this.props?.handleRemoveElementAnimations(this.state?.activeSectionID);
			},
		);
	};
	render() {
		let activeSubBlock = this.state.activeSection?.blocks
			?.find((block) => block._id === this.state.activeBlockID)
			?.subBlocks?.find((subBlock) => subBlock._id === this.state.activeSubBlockID);

		let fonts = [...this.state.fonts];
		// Filter icons based on search term
		const filteredIcons = journeyIcons?.filter((icon) => {
			const searchTerm = this.state?.searchedIcon?.toLowerCase() || '';

			// Check if the search term is in the icon name
			const nameMatch = icon?.name?.toLowerCase()?.includes(searchTerm);

			// Check if the search term is in any of the tags
			const tagMatch = icon?.tags?.some((tag) => tag?.toLowerCase()?.includes(searchTerm));

			// Return true if either name or tags match the search term
			return nameMatch || tagMatch;
		});

		const getUpdatedSvg = (svg, color) => {
			const hasFill = /fill="[^"]*"/.test(svg);
			const hasStroke = /stroke="[^"]*"/.test(svg);

			// Replace `fill` only if it's present and not "none"
			if (hasFill) {
				svg = svg.replace(/fill="[^"]*"/g, (match) =>
					match.includes('none') ? match : `fill="${color}"`,
				);
			}

			// Replace `stroke` only if it's present and not "none"
			if (hasStroke) {
				svg = svg.replace(/stroke="[^"]*"/g, (match) =>
					match.includes('none') ? match : `stroke="${color}"`,
				);
			}

			return svg;
		};
		const {
			showVariableModal,
			editingField,
			fieldName,
			fieldType,
			fieldValue,
			fieldDescription,
			isRequired,

			isEdit, // Make sure to include this
			name,
			selectedOption,
			value,
			isOpen,
		} = this.state;
		const options = [
			{
				value: 'text',
				label: 'Text',
				image: <Text />,
			},
			{
				value: 'longText',
				label: 'Long Text',
				image: <LongText />,
			},
			{
				value: 'number',
				label: 'Number',
				image: <Number />,
			},
			{
				value: 'phoneNumber',
				label: 'Phone Number',
				image: <PhoneNumber />,
			},
			{
				value: 'email',
				label: 'Email',
				image: <Email />,
			},
			{
				value: 'date',
				label: 'Date',
				image: <Date />,
			},
			{
				value: 'link',
				label: 'Link',
				image: <Link />,
			},
			{
				value: 'currency',
				label: 'Currency',
				image: <Currency />,
			},
		];
		const inputTypeImages = {
			text: <Text />,
			longText: <LongText />,
			number: <Number />,
			phoneNumber: <PhoneNumber />,
			email: <Email />,
			date: <Date />,
			link: <Link />,
			currency: <Currency />,
		};
		return (
			<div className="sidebar" ref={this.sidebarRef}>
				<div className="sheader">
					{!this.state?.editActiveModule && (
						<a onClick={(e) => this.handelClose(e)} className="close-icon">
							<Aclose />
						</a>
					)}
					<>
						{this.state?.editActiveModule ? (
							<div className="sheader-pages">
								<BackIcon
									style={{ cursor: 'pointer' }}
									onClick={() => this.setState({ editActiveModule: false })}
								/>{' '}
								Pages
							</div>
						) : (
							<>
								{this.state.activeTab === 'd' ? (
									<div
										className="tabs"
										style={{
											justifyContent: 'center',
										}}
									>
										<a
											className={this.state.activeTab === 'd' ? 'active' : ''}
											onClick={(e) => this.setActiveTab('d')}
										>
											Design
										</a>
										<a
											className={this.state.activeTab === 'b' ? 'active' : ''}
											onClick={(e) => this.setActiveTab('b')}
										>
											Background
										</a>
									</div>
								) : (
									<div
										className="tabs"
										style={{
											justifyContent:
												this.state.isServiceBlock &&
												this.props.module !== 'summary'
													? ''
													: 'center',
										}}
									>
										<>
											{this.state.activeTab !== 'p' && (
												<a
													className={
														this.state.activeTab === 'b' ? 'active' : ''
													}
													onClick={(e) => this.setActiveTab('b')}
												>
													Block
												</a>
											)}
											{/* {this.props.module === 'proposal' ? (
					<a
						className={this.state.activeTab === 'at' ? 'active' : ''}
						onClick={(e) => this.setActiveTab('at')}
					>
						Animation
					</a>
				) : (
					''
				)} */}

											{this.state.hasImageBlock &&
											this.props.module !== 'summary' &&
											(this.state.activeTab === 'i' ||
												this.state.isServiceBlock) ? (
												<a
													className={
														this.state.activeTab === 'i' ? 'active' : ''
													}
													onClick={(e) => this.setActiveTab('i')}
												>
													Image
												</a>
											) : (
												''
											)}

											{this.state.activeTab === 'f' ? (
												<a
													className={
														this.state.activeTab === 'f' ? 'active' : ''
													}
													onClick={(e) => this.setActiveTab('f')}
												>
													Font
												</a>
											) : (
												''
											)}
											{this.state.activeTab === 'p' ? (
												<a
													className={
														this.state.activeTab === 'p' ? 'active' : ''
													}
													onClick={(e) => this.setActiveTab('p')}
												>
													Pages
												</a>
											) : (
												''
											)}

											{this.props.module === 'contract' &&
											this.state.activeVariableInfo ? (
												<a
													className={
														this.state.activeTab === 'v' ? 'active' : ''
													}
													onClick={(e) => this.setActiveTab('v')}
												>
													Variable
												</a>
											) : (
												''
											)}
											{this.props.module === 'form' ||
											this.state.activeSection?.type === 'form-q&a' ? (
												<a
													className={
														this.state.activeTab === 'q' ? 'active' : ''
													}
													onClick={(e) => this.setActiveTab('q')}
												>
													Question
												</a>
											) : (
												''
											)}

											{this.state.activeTab === 'bt' ? (
												<a
													className={
														this.state.activeTab === 'bt'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('bt')}
												>
													Button
												</a>
											) : (
												''
											)}

											{this.props.hasSticker &&
											this.state.activeTab === 'sticker' ? (
												<a
													className={
														this.state.activeTab === 'sticker'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('sticker')}
												>
													Sticker
												</a>
											) : (
												''
											)}

											{this.props.hasIcon && this.state.activeTab === 'fl' ? (
												<a
													className={
														this.state.activeTab === 'fl'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('fl')}
												>
													Link
												</a>
											) : (
												''
											)}
											{this.props.hasIcon && this.state.activeTab === 'fi' ? (
												<a
													className={
														this.state.activeTab === 'fi'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('fi')}
												>
													Icon
												</a>
											) : (
												''
											)}
											{this.props.hasListIcon &&
											this.props.module !== 'summary' &&
											this.state.activeTab !== 'p' ? (
												<a
													className={
														this.state.activeTab === 'li'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('li')}
												>
													Icon
												</a>
											) : (
												''
											)}
											{this.state.isServiceBlock &&
											this.props.module !== 'summary' ? (
												<a
													className={
														this.state.activeTab === 's' ? 'active' : ''
													}
													onClick={(e) => this.setActiveTab('s')}
												>
													Service Item
												</a>
											) : (
												''
											)}
											{this.state.hasCircleText ? (
												<a
													className={
														this.state.activeTab === 'Ct'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('Ct')}
												>
													Element
												</a>
											) : (
												''
											)}
											{this.props.hasLogoSticker &&
											this.state.activeTab === 'ls' ? (
												<a
													className={
														this.state.activeTab === 'ls'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('ls')}
												>
													Sticker
												</a>
											) : (
												''
											)}
											{this.props.hasScrollText ? (
												<a
													className={
														this.state.activeTab === 'st'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('st')}
												>
													Text Properties
												</a>
											) : (
												''
											)}
											{this.state.activeTab === 'ji' ? (
												<a
													className={
														this.state.activeTab === 'ji'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('ji')}
												>
													Item
												</a>
											) : (
												''
											)}
											{this.state.activeTab === 'fbs' ? (
												<a
													className={
														this.state.activeTab === 'fbs'
															? 'active'
															: ''
													}
													onClick={(e) => this.setActiveTab('fbs')}
												>
													Button
												</a>
											) : (
												''
											)}
										</>
									</div>
								)}
							</>
						)}
					</>
				</div>

				{this.state.activeTab === 'v' ? (
					<>
						<div className="block_styles variable_styles">
							<div className="bs-item bs-item-row">
								<b>Variable Info</b>
							</div>
							<div className="variable-client-settings">
								<p>{this.state.activeVariableInfo?.displayName}</p>
							</div>
						</div>
						<div className="block_styles variable_styles">
							<div className="bs-item bs-item-row">
								<b>Client Permissions</b>
							</div>
							<div className="variable-client-settings">
								<span
									className={
										this.state.activeVariableInfo?.clientAction == 0
											? 'active'
											: ''
									}
									onClick={(e) =>
										this.handleSetVariableProperties(0, 'clientAction')
									}
								>
									Can Edit
								</span>
								<span
									className={
										this.state.activeVariableInfo?.clientAction == 1
											? 'active'
											: ''
									}
									onClick={(e) =>
										this.handleSetVariableProperties(1, 'clientAction')
									}
								>
									Must Fill
								</span>
								<span
									className={
										this.state.activeVariableInfo?.clientAction == 2
											? 'active'
											: ''
									}
									onClick={(e) =>
										this.handleSetVariableProperties(2, 'clientAction')
									}
								>
									Can't Edit
								</span>
							</div>
						</div>
						<div className="block_styles variable_styles">
							<div className="bs-item bs-item-row">
								<b>Placeholder Text</b>
							</div>
							<div className="variable-client-settings">
								<input
									onChange={(e) =>
										this.handleSetVariableProperties(
											e.target.value,
											'placeholderText',
										)
									}
									value={this.state.activeVariableInfo?.placeholderText}
								/>
							</div>
						</div>
						<div className="block_styles variable_styles">
							<div className="bs-item bs-item-row">
								<b>Filled Content</b>
							</div>
							<div className="variable-client-settings">
								<input
									onChange={(e) =>
										this.handleSetVariableProperties(
											e.target.value,
											'defaultValue',
										)
									}
									value={this.state.activeVariableInfo?.defaultValue}
								/>
							</div>
						</div>
					</>
				) : (
					''
				)}
				{this.state.activeTab === 's' &&
				this.state.isServiceBlock &&
				this.state?.activeSection?.type !== 'form-v1' &&
				this.state?.activeSection?.type !== 'scheduler' ? (
					<div className="block_styles">
						{this.state?.services_selection !== 2 ? (
							<div className="bs-item bs-item-row animated-item">
								<b>Client can customise quantity</b>
								<label className="switch">
									<input
										type="checkbox"
										onChange={(e) =>
											this.handleSubBlockItemOptionQuantityService(e)
										}
										checked={
											_.filter(this.state?.activeSection?.blocks, {
												_id: this.state?.activeServiceSubBlock,
											})[0]?.canClientCustomiseQuantity
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
						) : (
							''
						)}
						<div className="bs-item bs-item-service-item">
							<div className="item-service-price">
								<div className="isp-header">
									<div className="quantity w-25"> Qty</div>
									<div className="itemdropdown w-50">unit</div>
									<div className="price w-25">unit price</div>
								</div>
								<div className="isp-inputs">
									<input
										className="w-25"
										value={
											_.filter(this.state?.activeSection?.blocks, {
												_id: this.state?.activeServiceSubBlock,
											})[0]?.subBlocks[0]['quantity']
										}
										onChange={(e) =>
											this.setServiceItemValue(e.target.value, 'quantity')
										}
									/>
									{this.state.showCustomUnitInput ? (
										<div className="w-50">
											<input
												type="text"
												autoFocus
												placeholder="Enter custom unit"
												value={this.state.customUnitValue || ''}
												style={{
													width: '142.8px',
													height: '37px',
												}}
												onChange={(e) =>
													this.setState({
														customUnitValue: e.target.value,
													})
												}
												onKeyDown={(e) => {
													if (
														e.key === 'Enter' &&
														this.state.customUnitValue
													) {
														const newUnit = this.state.customUnitValue;
														// Add new unit to customUnits array
														const customUnits = [
															...(this.state.customUnits || []),
															newUnit,
														];

														// Save to localStorage
														localStorage.setItem(
															'customUnits',
															JSON.stringify(customUnits),
														);

														// Update state and set the new unit as active
														this.setState(
															{
																customUnits,
																showCustomUnitInput: false,
																customUnitValue: '',
															},
															() => {
																this.setServiceItemValue(
																	newUnit,
																	'unit',
																);
															},
														);
													} else if (e.key === 'Escape') {
														this.setState({
															showCustomUnitInput: false,
															customUnitValue: '',
														});
													}
												}}
												onBlur={() => {
													this.setState({
														showCustomUnitInput: false,
														customUnitValue: '',
													});
												}}
											/>
										</div>
									) : (
										<select
											className="w-50"
											value={
												_.filter(this.state?.activeSection?.blocks, {
													_id: this.state?.activeServiceSubBlock,
												})[0]?.subBlocks[0]['unit'] ?? ''
											}
											onChange={(e) => {
												if (e.target.value === 'custom') {
													this.setState({
														showCustomUnitInput: true,
													});
													// console.log('hello');
												} else {
													this.setServiceItemValue(
														e.target.value,
														'unit',
													);
												}
											}}
										>
											<option value="none">None</option>
											<option value="item">Item</option>
											<option value="hour">Hour</option>
											<option value="day">Day</option>
											<option value="week">Week</option>
											<option value="month">Month</option>
											{this.state?.customUnits?.map((unit) => (
												<option key={unit} value={unit}>
													{unit}
												</option>
											))}
											<option value="custom">+ Add Custom Unit</option>
										</select>
									)}

									<input
										className="w-25"
										value={
											_.filter(this.state?.activeSection?.blocks, {
												_id: this.state?.activeServiceSubBlock,
											})[0]?.subBlocks[0]['amount']
										}
										onChange={(e) =>
											this.setServiceItemValue(e.target.value, 'amount')
										}
										// autoFocus={true}
									/>
								</div>
							</div>
						</div>

						<div className="bs-item bs-item-row animated-item">
							<b>Service Price</b>
							<label style={{ fontSize: 14, color: '#E8E8E8' }}>
								&#8377;{' '}
								{_.filter(this.state?.activeSection?.blocks, {
									_id: this.state?.activeServiceSubBlock,
								})[0]?.subBlocks[0]['quantity'] *
									_.filter(this.state?.activeSection?.blocks, {
										_id: this.state?.activeServiceSubBlock,
									})[0]?.subBlocks[0]['amount']}
							</label>
						</div>

						{this.state.showServiceSubBlock &&
						_.filter(this.state?.activeSection?.blocks, {
							_id: this.state?.activeServiceSubBlock,
						})[0]?.labels ? (
							<div className="bs-item ">
								<hr></hr>
								{_.filter(this.state?.activeSection?.blocks, {
									_id: this.state?.activeServiceSubBlock,
								})[0]
									?.labels?.filter((e) => e.subTotal === undefined)
									?.map((label, key) => (
										<div
											className="bs-item bs-item-row animated-item"
											key={key}
										>
											<b>{_.keys(label)[0]}</b>
											<label className="switch">
												<input
													type="checkbox"
													onChange={(e) =>
														this.handleSubBlockItemOptionForService(
															key,
															!_.values(label)[0],
															Object.keys(label)?.[0],
														)
													}
													checked={_.values(label)[0]}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
									))}
								{this.state?.activeSection?.style?.services_selection != 2 && (
									<div className="bs-item bs-item-row animated-item">
										<b>hide button</b>
										<label className="switch">
											<input
												type="checkbox"
												onChange={(e) =>
													this.handleSubBlockItemOptionForService(
														'button',
														e.target.checked,
														null,
													)
												}
												checked={
													_.filter(this.state?.activeSection?.blocks, {
														_id: this.state?.activeServiceSubBlock,
													})[0]?.hideButton ?? false
												}
											/>
											<span className="slider-round round"></span>
										</label>
									</div>
								)}
							</div>
						) : (
							''
						)}

						<hr></hr>
						<div className="bs-item ">
							<div className="animated-item">
								<ColorPicker
									title={'Item Background Color'}
									color={
										_.filter(this.state?.activeSection?.blocks, {
											_id: this.state?.activeServiceSubBlock,
										})[0]?.backgroundColor
									}
									handleColor={(e) =>
										this.setSubBlockItemServiceBg(e, 'backgroundColor')
									}
									brandColors={this.state?.brandColors}
								/>
							</div>
						</div>
						<hr></hr>
						<div className="bs-item ">
							<div className="animated-item">
								<ColorPicker
									title={'Button Background Color'}
									color={
										_.filter(this.state?.activeSection?.blocks, {
											_id: this.state?.activeServiceSubBlock,
										})[0]?.buttonBackgroundColor
									}
									handleColor={(e) =>
										this.setSubBlockItemServiceBg(e, 'buttonBackgroundColor')
									}
									brandColors={this.state?.brandColors}
								/>
							</div>
						</div>
						<hr></hr>
						<div className="bs-item ">
							<div className="animated-item">
								<ColorPicker
									title={'Button Font Color'}
									color={
										_.filter(this.state?.activeSection?.blocks, {
											_id: this.state?.activeServiceSubBlock,
										})[0]?.buttonFontColor
									}
									handleColor={(e) =>
										this.setSubBlockItemServiceBg(e, 'buttonFontColor')
									}
									brandColors={this.state?.brandColors}
								/>
							</div>
						</div>
						<hr></hr>
						<div className="bs-item ">
							<div className="animated-item">
								<ColorPicker
									title={'Pricing Font Color'}
									color={
										_.filter(this.state?.activeSection?.blocks, {
											_id: this.state?.activeServiceSubBlock,
										})[0]?.pricingFontColor
									}
									handleColor={(e) =>
										this.setSubBlockItemServiceBg(e, 'pricingFontColor')
									}
									brandColors={this.state?.brandColors}
								/>
							</div>
						</div>
					</div>
				) : (
					''
				)}

				{this.state.activeTab === 'b' ? (
					this.props.module === 'summary' ? (
						<div className="block_styles">
							<div className="bs-item bs-item-row animated-item">
								<b style={{ textTransform: 'capitalize' }}>Events</b>

								<label className="switch">
									<input
										type="checkbox"
										onChange={() => {
											const newEventsLabel = !this.state.eventsLabel;
											this.setState({ eventsLabel: newEventsLabel }, () =>
												this.props.setSummaryLabel(
													newEventsLabel,
													'eventsLabel',
												),
											);
										}}
										checked={this.state?.eventsLabel}
									/>

									<span className="slider-round round"></span>
								</label>
							</div>
							<div className="bs-item bs-item-row animated-item">
								<b style={{ textTransform: 'capitalize' }}>Service</b>
								<label className="switch">
									<input
										type="checkbox"
										// onChange={(e) => this.handleTheme()}
										checked={true}
									/>
									<span
										style={{ opacity: 0.5 }}
										className="slider-round round"
									></span>
								</label>
							</div>
							<div className="bs-item bs-item-row animated-item">
								<b style={{ textTransform: 'capitalize' }}>Payment Schedule</b>
								<label className="switch">
									<input
										type="checkbox"
										onChange={(e) => {
											const newPaymentsLabel = !this.state.paymentsLabel;
											this.setState(
												{ paymentsLabel: newPaymentsLabel },
												() => {
													this.props.setSummaryLabel(
														newPaymentsLabel,
														'paymentsLabel',
													);
													// this.handleSummaryLabel();
												},
											);
										}}
										checked={this.state?.paymentsLabel}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>

							{/* font family */}
							<div className="bs-item animated-item">
								<b>Font</b>
								<div style={{ display: 'flex', gap: 10 }}>
									<div className="padding-items font-items">
										<label
											style={{ width: '315px' }}
											className="sideBarDropDownArrow"
										>
											<p
												style={{
													width: 100,
													overflow: 'hidden',
													fontFamily: this.state.summaryFont,
												}}
											>
												{this.state.summaryFont}
											</p>
											<DropDown
												className="font-dropdown-icon"
												onClick={(e) => this.toggleFontsDropDown(e)}
												style={{
													width: '12px',
													height: '12px',
													transform:
														this.state.showFontsDropDown === false
															? 'rotate(0deg)'
															: 'rotate(180deg)',
												}}
											/>
										</label>
										{this.state.showFontsDropDown ? (
											<div
												style={{ top: '300px', left: '24px' }}
												className="fonts-dropdown fonts-summary"
												ref={this.dropdownref}
											>
												<legend
													style={{ position: 'sticky', top: 0 }}
													className="font-search"
												>
													<input
														value={this.state.searchFont}
														onChange={(e) =>
															this.setState({
																searchFont: e.target.value,
															})
														}
														placeholder={'Search Font'}
													/>
												</legend>
												{_.map(
													_.orderBy(
														fonts.filter(
															(font) =>
																this.state.searchFont === '' ||
																(this.state.searchFont.length >=
																	1 &&
																	font.fontName
																		?.toLowerCase()
																		.includes(
																			this.state.searchFont?.toLowerCase(),
																		)),
														),
														[(fontF) => fontF.fontName?.toLowerCase()],
														['asc'],
													),
													(font, k) => {
														return (
															<p
																key={k} // Always include a unique key in lists
																onClick={(e) =>
																	this.props.setSummaryStyles(
																		font.value,
																		'summaryFont',
																	)
																}
																style={{
																	fontFamily: font.value,
																	backgroundColor:
																		this.state.summaryFont ===
																		font?.value
																			? '#171717'
																			: '',
																}}
															>
																{font.fontName}
															</p>
														);
													},
												)}
											</div>
										) : (
											''
										)}
									</div>
									{/* <div className='padding-items font-items'>
									<label className="sideBarDropDownArrow"
										onClick={(e) => {
											e.stopPropagation(); // Stop event from bubbling up
											this.toggleFontsVariantDropDown(e);
										}}
									>
										<div>{this.state.activeFontVariant ? this.state.activeFontVariant : 'Weights'}</div>

										<DropDown
											style={{
												height: '12px',
												width: '12px',
												rotate:
													this.state.showFontsVariantDropDown=== false
														? '0deg'
														: '180deg',
											}}
											className="font-dropdown-icon"
										/>
									

									</label>

									{this.state.showFontsVariantDropDown ? (
										<div
											className="fonts-dropdown font-variant-dropdown"
											ref={this.dropdownfontref}
											
										>
							
											{_.map(this.state.fonts,(font,key)=>{
		

if(font.value == this.state.activeFont){
	return(
	_.map(font.variants,(variant,k)=>{
		return(
			<p
			key={k}
			onClick={(e) => this.handleFontFamilyWeight(e,variant)}
		>
			{variant.variant}
		</p>
		)
	}))
}
else{
	<p
			
		>
		no weights
		</p>
}
})}
										




										</div>
									) : (
										''
									)}
									</div> */}
								</div>
							</div>

							{/* font color */}

							<div className="bs-item animated-item">
								<ColorPicker
									title={'Font Color'}
									color={this.state.summaryFontColor}
									handleColor={(e) =>
										this.setState({ summaryFontColor: e }, () => {
											this.props.setSummaryStyles(e, 'summaryFontColor');
										})
									}
									brandColors={this.state?.brandColors}
								/>
							</div>
							{/* font size */}
							<div className="bs-item" style={{ position: 'relative' }}>
								<b>Size</b>
								<div className="bg-item">
									<div
										style={{
											display: 'flex',
											maxWidth: 230,
											marginLeft: 6,
										}}
									>
										<input
											type="range"
											min={8}
											max={50}
											step={1}
											defaultValue={this.state.fontSize}
											value={this.state.summaryFontSize}
											onChange={(e) =>
												this.props.setSummaryStyles(
													e.target.value,
													'summaryFontSize',
												)
											}
										/>
									</div>
									<p>
										<input
											defaultValue={this.state.fontSize}
											value={this.state.summaryFontSize}
											onChange={(e) =>
												this.props.setSummaryStyles(
													e.target.value,
													'summaryFontSize',
												)
											}
											style={{
												width: 50,
												background: 'transparent',
												border: '1px solid #9b9290',
												color: '#9b9290',
											}}
										/>
									</p>
								</div>
							</div>
							{/* background color */}

							<div className="bs-item animated-item">
								<ColorPicker
									title={'Block Background Color'}
									color={this.state?.summaryBg}
									handleColor={(e) =>
										this.setState({ summaryBg: e }, () => {
											this.props.setSummaryStyles(e, 'summaryBg');
										})
									}
									brandColors={this.state?.brandColors}
								/>
							</div>
						</div>
					) : (
						<div className="block_styles">
							{this.state?.activeSection?.style?.hasTable ||
							this.state?.activeSection?.style?.invoiceLayout ||
							this.state?.activeSection?.type === 'form-v1' ||
							this.state?.activeSection?.type === 'scheduler' ? (
								' '
							) : (
								<div
									className="bs-item bs-item-row animated-item animationContainer"
									style={{ cursor: 'pointer' }}
									onClick={() =>
										this.setState({
											showAnimationContainer:
												!this.state.showAnimationContainer,
										})
									}
								>
									<b className="">Animation option</b>
									<div
										className={
											this.state.showAnimationContainer
												? 'arrowContainer'
												: ''
										}
									>
										<DropDown />
									</div>
								</div>
							)}

							{this.state.showAnimationContainer ? (
								<div className="animation-options">
									{[
										{ id: 'none', label: 'No animation' },
										{ id: 'bySection', label: 'Animation by section' },
										{ id: 'together', label: 'Animate together' },
									].map((option, index) => (
										<div key={option.id} className="animation-option">
											<input
												className="animation-option-input"
												type="radio"
												name="animationOption"
												style={{ cursor: 'pointer' }}
												checked={this.state.activeAnimation === index}
												onChange={() =>
													this.setAnimationOption(option.id, index)
												}
											/>
											<label
												className="radio-container"
												style={{
													color:
														this.state.activeAnimation === index
															? '#6055ec'
															: '#fff',
													fontFamily: 'Inter',
													fontSize: '14px',
												}}
											>
												{option.label}
											</label>
										</div>
									))}
									<hr className="animated-item"></hr>
									<div className="bs-item">
										<b>Styles</b>
										<div className="animation-styles">
											<div
												className={
													this.state.animationType === 'fadeIn'
														? 'active'
														: ''
												}
												onClick={() => this.handleAnimation('fadeIn')}
											>
												<FadeIn />
											</div>
											<div
												className={
													this.state.animationType === 'slideIn'
														? 'active'
														: ''
												}
												onClick={() => this.handleAnimation('slideIn')}
											>
												<SlideIn />
											</div>
										</div>
									</div>
									<hr className="animated-item"></hr>
									{this.state.animationType === 'slideIn' ? (
										<>
											<div className="bs-item">
												<b>Direction</b>
												<div className="directionContainer">
													{[
														{
															name: 'left',
															icon: <DirectionLeft />,
														},
														{
															name: 'right',
															icon: <DirectionRight />,
														},
														{ name: 'top', icon: <DirectionTop /> },
														{
															name: 'bottom',
															icon: <DirectionBottom />,
														},
													].map((icon, index) => (
														<p
															key={index}
															onClick={() =>
																this.handleAnimationDirection(
																	icon.name,
																)
															}
															className={
																this.state.animationDirection ===
																icon.name
																	? 'active'
																	: ''
															}
														>
															{icon.icon}
														</p>
													))}
												</div>
											</div>
											<hr className="animated-item"></hr>
										</>
									) : (
										''
									)}
									<div className="bs-item">
										<b>Speed</b>
										<div className="speedContainer">
											<p
												onClick={() => this.handleAnimationSpeed('slow')}
												className={
													this.state.animationSpeed === 'slow'
														? 'active'
														: ''
												}
											>
												Slow
											</p>
											<p
												onClick={() => this.handleAnimationSpeed('medium')}
												className={
													this.state.animationSpeed === 'medium'
														? 'active'
														: ''
												}
											>
												Medium
											</p>
											<p
												onClick={() => this.handleAnimationSpeed('fast')}
												className={
													this.state.animationSpeed === 'fast'
														? 'active'
														: ''
												}
											>
												Fast
											</p>
										</div>
									</div>
								</div>
							) : (
								''
							)}
							{this.state?.activeSection?.style?.hasTable ||
							this.state?.activeSection?.style?.invoiceLayout ||
							this.state?.activeSection?.type === 'form-v1' ||
							this.state?.activeSection?.type === 'scheduler' ? (
								''
							) : (
								<hr className="animated-item"></hr>
							)}
							{_.has(this.state?.activeSection?.style, 'borderStyle') ? (
								<>
									<div className="bs-item bs-item-row">
										<b>Line Style</b>
										<div className="padding-items font-items">
											<label onClick={(e) => this.toggleLineTypeDropDown(e)}>
												<a
													style={{
														borderStyle: _.has(
															this.state?.activeSection?.style,
															'borderStyle',
														)
															? borders[
																	this.state?.activeSection?.style
																		?.borderStyle
															  ]
															: 'solid',

														borderWidth: '1px',
														width: '100%',
														borderColor: '#000',
														display: 'flex',
													}}
												></a>
											</label>
											{this.state.showLineTypeDropDown ? (
												<div
													className="fonts-dropdown"
													ref={this.dropdownlineeref}
													style={{
														display: 'flex',
														flexDirection: 'column',
														top: '110px',
														left: 'auto',
														right: '24px',
														background: '#fff',
														color: '#000',
													}}
												>
													<legend
														style={{
															display: 'flex',
															padding: '16px',
															width: '100%',
															cursor: 'pointer',
														}}
														onClick={() =>
															this.handleSectionStyle(
																0,
																'borderStyle',
															)
														}
													>
														<a
															style={{
																borderStyle: 'solid',
																borderWidth: '1px',
																width: '100%',
																borderColor: '#000',
																display: 'flex',
															}}
														></a>
													</legend>
													<legend
														style={{
															display: 'flex',
															padding: '16px',
															width: '100%',
															cursor: 'pointer',
														}}
														onClick={() =>
															this.handleSectionStyle(
																1,
																'borderStyle',
															)
														}
													>
														<a
															style={{
																borderStyle: 'dashed',
																borderWidth: '1px',
																width: '100%',
																borderColor: '#000',
																display: 'flex',
															}}
														></a>
													</legend>
													<legend
														style={{
															display: 'flex',
															padding: '16px',
															width: '100%',
															cursor: 'pointer',
														}}
														onClick={() =>
															this.handleSectionStyle(
																2,
																'borderStyle',
															)
														}
													>
														<a
															style={{
																borderStyle: 'dotted',
																borderWidth: '1px',
																width: '100%',
																borderColor: '#000',
																display: 'flex',
															}}
														></a>
													</legend>
												</div>
											) : (
												''
											)}
										</div>
									</div>
									<div className="animated-item">
										<ColorPicker
											title={'Line Color'}
											color={this.state?.activeSection?.style?.borderColor}
											handleColor={(e) =>
												this.handleSectionStyle(e, 'borderColor')
											}
											brandColors={this.state?.brandColors}
										/>
									</div>
									<div
										className="controls"
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 10,
											position: 'relative',
											transform: 'none',
											width: '100%',
											top: 0,
											left: 0,
											marginTop: '10px',
										}}
									>
										<label
											style={{
												display: 'flex',
												width: '100%',
												fontSize: 13,
												color: '#fff',
											}}
										>
											Line Thickness
										</label>
										<input
											type={'range'}
											value={
												parseInt(
													this.state?.activeSection?.style?.borderWidth,
												) || 1
											}
											min={1}
											max={30}
											step={1}
											onChange={(e) =>
												this.handleSectionStyle(
													parseInt(e.target.value),
													'borderWidth',
												)
											}
											onMouseUp={() =>
												this.props.setActiveSection(
													this.state.activeSection,
													null,
												)
											}
											classes={{ container: 'slider' }}
										/>
									</div>
									<div
										className="controls"
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 10,
											position: 'relative',
											transform: 'none',
											width: '100%',
											top: 0,
											left: 0,
											marginTop: '10px',
										}}
									>
										<label
											style={{
												display: 'flex',
												width: '100%',
												fontSize: 13,
												color: '#fff',
											}}
										>
											Line Width
										</label>
										<input
											type={'range'}
											value={
												parseInt(this.state?.activeSection?.style?.width) ||
												1
											}
											min={1}
											max={100}
											step={1}
											onChange={(e) =>
												this.handleSectionStyle(e.target.value, 'width')
											}
											onMouseUp={this.props.setActiveSection(
												this.state.activeSection,
												null,
											)}
											classes={{ container: 'slider' }}
										/>
									</div>
									<hr></hr>
								</>
							) : (
								''
							)}
							{this.state?.activeSection?.type === 'events' ? (
								<>
									<div className="animated-item">
										<ColorPicker
											title={'Event Card Background Color'}
											color={
												this.state?.activeSection?.style
													?.cardBackgroundColor
											}
											handleColor={(e) =>
												this.handleEventCardBg(e, 'cardBackgroundColor')
											}
											brandColors={this.state?.brandColors}
										/>
									</div>
									<div className="animated-item">
										<ColorPicker
											title={'Event Card Font Color'}
											color={this.state?.activeSection?.style?.fontColor}
											handleColor={(e) =>
												this.handleEventCardBg(e, 'fontColor')
											}
											brandColors={this.state?.brandColors}
										/>
									</div>
								</>
							) : (
								''
							)}
							{this.state.isServiceBlock &&
							this.state?.activeSection?.type !== 'form-v1' &&
							this.state?.activeSection?.type !== 'scheduler' ? (
								<>
									<div className="bs-item bs-item-row ">
										<b>Service Selection</b>
									</div>
									<div className="bs-item bs-item-row bs-service-item-row">
										<span
											onClick={(e) => this.handleServiceSelection(e, 0)}
											className={
												this.state?.services_selection == 0 ? 'active' : ''
											}
										>
											<Service1 />
										</span>
										<span
											onClick={(e) => this.handleServiceSelection(e, 1)}
											className={
												this.state?.services_selection == 1 ? 'active' : ''
											}
										>
											<Service2 />
										</span>
										<span
											onClick={(e) => this.handleServiceSelection(e, 2)}
											className={
												this.state?.services_selection == 2 ? 'active' : ''
											}
										>
											<Service3 />
										</span>
									</div>
									{this.state?.services_selection !== 2 ? (
										<div className="bs-item bs-item-row">
											<b>Selection is required</b>
											<label class="switch">
												<input
													type="checkbox"
													checked={this.state.selection_is_required}
													onChange={(e) => this.handleServiceBoolean(e)}
												/>
												<span class="slider-round round"></span>
											</label>
										</div>
									) : (
										''
									)}
									<div className="bs-item ">
										<hr></hr>

										<div className="bs-item bs-item-row animated-item">
											<b>Toast</b>
											<label className="switch">
												<input
													type="checkbox"
													onChange={(e) =>
														this.handleServiceToast(
															!this.state.activeSection?.style?.toast,
														)
													}
													checked={this.state.activeSection?.style?.toast}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
									</div>
									<div className="bs-item ">
										<hr></hr>

										{this.state?.activeSection?.style?.labels?.map(
											(label, key) => {
												return (
													<div
														className="bs-item bs-item-row animated-item"
														key={key}
													>
														<b>{_.keys(label)[0]}</b>
														<label className="switch">
															<input
																type="checkbox"
																onChange={(e) =>
																	this.handleSubBlockOptionForService(
																		key,
																		!_.values(label)[0],
																		Object.keys(label)?.[0],
																	)
																}
																checked={_.values(label)[0]}
															/>
															<span className="slider-round round"></span>
														</label>
													</div>
												);
											},
										)}
									</div>

									{/** 
			{_.has(
				this.state?.activeSection?.style,
				'labels'
			) &&
			this.returnDisplayItem('subTotal') !==
				'none' ? (
				<>
					<div className='bs-item bs-item-row animated-item'>
						<b>SubTotal Title</b>
						<input
							value={
								this.state?.activeSection
									?.style?.subTotalTitle
							}
							onChange={(e) =>
								this.handleServiceSubTotal(
									e,
									'subTotalTitle'
								)
							}
						/>
					</div>

										<div className='bs-item bs-item-row animated-item'>
											<b>SubTotal Price</b>
											<input
												value={
													this.state?.activeSection
														?.style?.subTotalValue
												}
												onChange={(e) =>
													this.handleServiceSubTotal(
														e,
														'subTotalValue'
													)
												}
											/>
										</div>
										<hr></hr>
									</>
								) : (
									''
								)}
								*/}
									<>
										<div className="bs-item bs-item-row">
											<b>Rows & Columns</b>
										</div>
										<div className="bs-item bs-item-row bs-service-item-row">
											<span
												onClick={(e) => this.handleServiceStyle(e, 0)}
												className={
													this.state.services_style == 0 ? 'active' : ''
												}
											>
												<ServiceA />
											</span>
											<span
												onClick={(e) => this.handleServiceStyle(e, 1)}
												className={
													this.state.services_style == 1 ? 'active' : ''
												}
											>
												<ServiceC />
											</span>
											<span
												onClick={(e) => this.handleServiceStyle(e, 2)}
												className={
													this.state.services_style == 2 ? 'active' : ''
												}
											>
												<ServiceB />
											</span>
										</div>
									</>
									<>
										<div
											className="controls"
											style={{
												display: 'flex',
												flexDirection: 'column',
												gap: 10,
												position: 'relative',
												transform: 'none',
												width: '100%',
												top: 0,
												left: 0,
												marginTop: '0px',
											}}
										>
											<label
												style={{
													display: 'flex',
													width: '100%',
													fontSize: 13,
													color: 'rgba(228, 229, 230, 0.80)',
												}}
											>
												Rows & Columns Spacing
											</label>
											<input
												type={'range'}
												value={
													parseInt(
														this.state?.activeSection?.style?.spacing,
													) || 1
												}
												min={1}
												max={this.state.services_style == 2 ? 14 : 35}
												step={1}
												onChange={(e) =>
													this.handleSectionStyle(
														parseInt(e.target.value),
														'spacing',
													)
												}
												onMouseUp={() =>
													this.props.setActiveSection(
														this.state.activeSection,
														null,
													)
												}
												classes={{ container: 'slider' }}
											/>
										</div>
										<div>
											<ColorPicker
												title={'Header Background Color'}
												color={
													this.state?.activeSection?.style
														?.titleBackgroundColor
												}
												handleColor={(e) =>
													this.props.titleBackgroundColor(e)
												}
												brandColors={this.state?.brandColors}
											/>
										</div>
									</>
								</>
							) : (
								''
							)}
							{/* <div className="bs-item bs-item-row">
						<b>Title</b>
						<label class="switch">
							<input type="checkbox" />
							<span class="slider-round round"></span>
						</label>
					</div>
					
					<hr></hr> */}
							{/* <div className="bs-item bs-item-row">
							<b>Flip</b>
							<a className="flip-toggle">
								<span className="active">L</span>
								<span>R</span>
							</a>
						</div>

	<div className="bs-item bs-item-row">
		<b>Device Mokup</b>
		<label class="switch">
			<input type="checkbox" />
			<span class="slider-round round"></span>
		</label>
	</div>
	<div className="bs-item bs-item-row">
		<b>Crop Device</b>
		<label class="switch">
			<input type="checkbox" />
			<span class="slider-round round"></span>
		</label>
	</div>
	<hr></hr> */}

							{/* {this.state.activeSection?.style?.viewSubBlockOptions
		? _.map(
				this.state.activeSection?.style
					?.viewSubBlockOptions,
				(label, key) => {
					return (
						<div className='bs-item bs-item-row animated-item'>
							<b>{_.keys(label)[0]}</b>
							<label class="switch">
								<input
									type="checkbox"
									onChange={(e) =>
										this.handleSubBlockOption(
											key,
											!_.values(
												label
											)[0]
										)
									}
									checked={
										_.values(label)[0]
									}
								/>

								<span class="slider-round round"></span>
							</label>
						</div>
					);
				}
		  )
		: ''} */}
							{this.state?.activeSection?.type === 'list' ||
							this.state?.activeSection?.type === 'text' ? (
								<>
									<div
										className="bt_styles2"
										style={{ padding: '12px 0px !important' }}
									>
										<div
											className="bs-item bs-item-row animated-item"
											style={{ paddingBottom: '0' }}
										>
											<b style={{ textTransform: 'capitalize' }}>
												Foldable Block
											</b>
											<label className="switch">
												<input
													type="checkbox"
													onChange={(e) => this.handleFoldBlock(e)}
													checked={
														this.state?.activeSection?.style?.foldBlock
													}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
										{this.state?.activeSection?.style?.foldBlock ? (
											<div
												className="bs-item bs-item-row animated-item"
												style={{ paddingBottom: '0' }}
											>
												<div
													className="input-link"
													style={{ marginBottom: '0px' }}
												>
													<input
														placeholder="Foldable Block Text"
														type="text"
														value={
															this.state.activeSection.style
																.foldBlockText
														}
														onChange={(e) =>
															this.handleFoldBlockText(e.target.value)
														}
													/>
													<button
														type="submit"
														onClick={() => {
															let newActiveSection = {
																...this.state?.activeSection,
																style: {
																	...this.state?.activeSection
																		?.style,
																	foldBlockText:
																		this.state
																			?.tempFoldableText,
																},
															};
															this.setState(
																{
																	activeSection: newActiveSection,
																},
																() => {
																	this.props?.setActiveSection(
																		newActiveSection,
																	);
																},
															);
															// this.props.setActiveSection(
															// 	this.state.activeSection,
															// )
														}}
													>
														Change
													</button>
												</div>
											</div>
										) : (
											''
										)}
										<hr className="animated-item"></hr>
									</div>
								</>
							) : (
								''
							)}
							{this.state.activeSection?.style?.viewSubBlockOptions &&
								_.map(
									this.state.activeSection.style.viewSubBlockOptions,
									(label, key) => {
										return (
											<div
												className="bs-item bs-item-row animated-item"
												key={key}
											>
												<b style={{ textTransform: 'capitalize' }}>
													{' '}
													{_.keys(label)[0]}
												</b>
												<label className="switch">
													<input
														type="checkbox"
														onChange={(e) =>
															this.handleSubBlockOption(
																key,
																!_.values(label)[0],
															)
														}
														checked={_.values(label)[0]}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>
										);
									},
								)}
							{this.props.module === 'invoice' && (
								<>
									<div className="bs-item bs-item-row animated-item">
										<b style={{ textTransform: 'capitalize' }}>
											{' '}
											Payment Schedule
										</b>
										<label className="switch">
											<input
												type="checkbox"
												onChange={(e) => {
													const isChecked = e.target.checked;
													this.setState(
														{
															showSchedule: isChecked,
														},
														() => {
															this.props.setShowSchedule(isChecked);
														},
													);
												}}
												checked={this.state?.showSchedule}
											/>
											<span className="slider-round round"></span>
										</label>
									</div>
									<hr className="animated-item"></hr>
								</>
							)}
							{this.state.activeSection?.style?.viewSubBlockOptions && (
								<hr className="animated-item"></hr>
							)}
							{this.state.activeSection?.style?.imageShapes && (
								<div className="bs-item animated-item">
									<b>Image shapes</b>
									<span style={{ display: 'flex', gap: '10px' }}>
										{_.map(this.state.imageShape, (shape, key) => (
											<span
												key={key}
												className={
													this.state?.blockBorder === shape?.name
														? 'active'
														: ''
												}
												onClick={(e) => this.setImageShapes(shape?.name)}
												style={{
													display: ' flex',
													width: '64px',
													height: '40px',
													justifyContent: 'center',
													alignItems: 'center',
													border:
														this.state?.blockBorder === shape?.name
															? '1px solid #0976E8'
															: '1px solid white',
													borderRadius: '6px',
												}}
											>
												{shape.element}
											</span>
										))}
									</span>
								</div>
							)}
							{this.state.activeSection?.style?.deviceTypes && (
								<div className="bs-item animated-item">
									<b>Device Types</b>
									<span
										style={{ display: 'flex', gap: '10px' }}
										className="device-container"
									>
										{_.map(this.state.deviceTypes, (device, key) => (
											<span
												key={key}
												className={
													this.state?.device === device?.name
														? 'active device-active'
														: ''
												}
												onClick={(e) => this.setDeviceType(device?.name)}
												style={{
													display: ' flex',
													width: '64px',
													height: '40px',
													justifyContent: 'center',
													alignItems: 'center',
													border:
														this.state?.device === device?.name
															? '1px solid #6254F5'
															: '1px solid #e4e5e6',
													borderRadius: '6px',
													boxShadow:
														this.state?.device === device?.name &&
														`0px 0px 100px 0px rgba(94, 82, 233, 0.25) inset`,
													cursor: 'pointer',
												}}
											>
												{device.element}
											</span>
										))}
									</span>
								</div>
							)}

							{this.props.module === 'form' ||
							this.state?.activeSection?.style?.isFormLayout ? (
								<>
									{!this.state?.activeSection?.style?.isFormLayout && (
										<>
											<div className="bs-item bs-item-row animated-item">
												<b>Theme</b>
												<label className="switch">
													<input
														type="checkbox"
														onChange={(e) => this.handleTheme()}
														checked={this.state.isTheme}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>
											<div className="bs-item bs-item-row animated-item">
												<b>Header</b>
												<label className="switch">
													<input
														type="checkbox"
														onChange={(e) =>
															this.handleHeader('header')
														}
														checked={this.state.isHeader}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>
										</>
									)}
									{(this.state.isTheme ||
										this.state?.activeSection?.style?.isFormLayout) && (
										<div className="bs-item animated-item ">
											<b>Theme</b>
											<div className="bs-item bs-item-row animated-item">
												<b
													onClick={() =>
														this.setState({
															activeFormTab: 'solid',
														})
													}
													style={{
														borderBottom:
															this.state.activeFormTab === 'solid'
																? '1px solid white'
																: '',
														padding: '5px',
														cursor: 'pointer',
													}}
												>
													Solid
												</b>
												{/* <b
						onClick={() =>
							this.setState({
								activeFormTab: 'animated',
							})
						}
					>
						Animated
					</b>
					*/}
												<b
													onClick={() =>
														this.setState({
															activeFormTab: 'custom',
														})
													}
													style={{
														borderBottom:
															this.state.activeFormTab === 'custom'
																? '1px solid white'
																: '',
														padding: '5px',
														cursor: 'pointer',
													}}
												>
													Custom
												</b>
											</div>
											{this.state.activeFormTab === 'solid' && (
												<div
													style={{
														display: 'flex',
														flexWrap: 'wrap',
														width: '100%',
														gap: '15px',
													}}
												>
													{_.map(this.state.theme, (theme, index) => (
														<div
															key={index}
															style={{
																display: 'flex',
																width: '28%',
																height: '25px',
																borderRadius: '50px',
																overflow: 'hidden',
																margin: '3px',
																cursor: 'pointer',
																border: _.isEqual(
																	this.state.activeTheme,
																	theme,
																)
																	? ' 2px solid #3F8AE2'
																	: '',
															}}
															onClick={(e) =>
																this.setActiveTheme(theme)
															}
														>
															<span
																style={{
																	background: theme.text,
																	width: '33.33%',
																	height: '100%',
																}}
															></span>
															<span
																style={{
																	background: theme.placeHolder,
																	width: '33.33%',
																	height: '100%',
																}}
															></span>
															<span
																style={{
																	background:
																		theme.backgroundColor,
																	width: '33.33%',
																	height: '100%',
																}}
															></span>
														</div>
													))}
												</div>
											)}
											{this.state.activeFormTab === 'custom' && (
												<div>
													{_.map(this.state.activeTheme, (value, key) => (
														<div
															key={key}
															className="custome-theme animated-item"
														>
															<ColorPicker
																title={key}
																color={value}
																handleColor={(e) =>
																	this.handleCustomTheme(key, e)
																}
																brandColors={
																	this.state?.brandColors
																}
															/>
														</div>
													))}
												</div>
											)}
										</div>
									)}
									{!this.state.isTheme &&
										!_.has(
											this.state?.activeSection?.style,
											'isFormLayout',
										) && (
											<div className="animated-item">
												<ColorPicker
													title={'BackgroundColor'}
													color={this.state.formBgColor}
													handleColor={(e) =>
														this.handleHeader('bgColor', e)
													}
													brandColors={this.state?.brandColors}
												/>
											</div>
										)}
								</>
							) : (
								''
							)}

							{(this.state.activeSection?.style?.subBlocksBackground ||
								this.state.activeSection?.style?.subBlocksBackgroundColor ||
								this.state.activeSection?.style?.subBlocksBorderColor) && (
								<>
									<div
										className="overlay-options animated-item"
										onClick={() =>
											this.setState({
												showColorOptions: !this.state.showColorOptions,
											})
										}
									>
										<b>Color Options</b>
										<UpDown
											style={{
												rotate: !this.state.showColorOptions && '180deg',
											}}
										/>
									</div>
									{this.state.activeSection?.style?.subBlocksBackground &&
										this.state.showColorOptions &&
										Object.keys(
											this.state.activeSection.style.subBlocksBackground,
										).map((key) => {
											const color =
												this.state.activeSection.style.subBlocksBackground[
													key
												];

											return (
												<div key={key} className="animated-item">
													<ColorPicker
														title={key}
														color={color}
														handleColor={(e) =>
															this.handleBlockBackground(key, e)
														}
														brandColors={this.state?.brandColors}
													/>
												</div>
											);
										})}

									{/* for background of subblocks -Abdullah */}
									{this.state.activeSection?.style?.subBlocksBackgroundColor &&
										this.state.showColorOptions &&
										Object.keys(
											this.state.activeSection.style.subBlocksBackgroundColor,
										).map((key) => {
											const color =
												this.state.activeSection.style
													.subBlocksBackgroundColor[key];

											return (
												<div key={key} className="animated-item">
													<ColorPicker
														title={key}
														color={color}
														handleColor={(e) =>
															this.handleSubBlockBackgroundColor(
																key,
																e,
															)
														}
														brandColors={this.state?.brandColors}
													/>
												</div>
											);
										})}

									{/* for borderColor of subblocks -Abdullah */}
									{this.state.activeSection?.style?.subBlocksBorderColor &&
										this.state.showColorOptions &&
										Object.keys(
											this.state.activeSection.style.subBlocksBorderColor,
										).map((key) => {
											const color =
												this.state.activeSection.style.subBlocksBorderColor[
													key
												];

											return (
												<div key={key} className="animated-item">
													<ColorPicker
														title={key}
														color={color}
														handleColor={(e) =>
															this.handleSubBlockBorderColor(key, e)
														}
														brandColors={this.state?.brandColors}
													/>
												</div>
											);
										})}
									<hr className="animated-item"></hr>
								</>
							)}
							{/* {this.state.activeSection.style?.subBlocksBackground} */}

							{/* {this.props.hasButton ? (
		<div>
			<div className='input-link'>
				<input
					placeholder='Link'
					type='text'
					value={this.state.buttonLink}
					onChange={(e) =>
						this.setState({
							buttonLink: e.target.value,
						})
					}
				/>
				<button
					type='submit'
					onClick={() =>
						this.handleButton(
							this.state.buttonLink
						)
					}
				>
					Link
				</button>
			</div>
			<div className='bs-item bs-item-row'>
				<b>Open in New Tab</b>
				<label class='switch'>
					<input
						type='checkbox'
						onChange={(e) =>
							this.handleOpenNewTab(e)
						}
						checked={
							this.state.openNewTab?.isOpen
						}
					/>

					<span class='slider-round round'></span>
				</label>
			</div>
		</div>
	) : (
		''
	)} */}

							{this.state.hasIframe && this.state.activeSection?.type === 'embed' && (
								<>
									<div className="bs-item bs-item-row animated-item">
										<b>Scroll</b>
										<label className="switch">
											<input
												type="checkbox"
												onChange={(e) =>
													this.handleIframeValues(
														'scroll',
														e.target.checked,
													)
												}
												checked={this.state.iframeScroll}
											/>
											<span className="slider-round round"></span>
										</label>
									</div>
									<hr className="animated-item"></hr>
								</>
							)}
							{_.has(this.state?.activeSection?.style, 'invoicePayment') ? (
								<>
									<div className="animated-item">
										<ColorPicker
											title={'Card Background Color'}
											color={
												this.state.activeSection?.style?.paymentCardColor ||
												'white'
											}
											handleColor={(e) =>
												this.SetPaymentColors(e, 'Background')
											}
											brandColors={this.state?.brandColors}
										/>
									</div>
									<div className="animated-item">
										<ColorPicker
											title={'Font Color'}
											color={
												this.state.activeSection?.style?.paymentFontColor ||
												'black'
											}
											handleColor={(e) => this.SetPaymentColors(e, 'font')}
											brandColors={this.state?.brandColors}
										/>
									</div>
									<hr className="animated-item"></hr>
								</>
							) : (
								''
							)}
							{/* <div className='animated-item bg-types'>
								<div className='bg-width-container'>
							<b className='bg-width-title'>Background Width</b>
								<div className='bg-width'>
								<span onClick={() => this.handleBackgroundWidth('full')} className={`bg-width-item ${this.state.activeModule?.showType === 'full' ? 'active' : ''}`}>Full </span>
								<span onClick={() => this.handleBackgroundWidth('slide')} className={`bg-width-item ${this.state.activeModule?.showType === 'slide' ? 'active' : ''}`}>Slide</span>
								<span onClick={() => this.handleBackgroundWidth('a4')} className={`bg-width-item ${this.state.activeModule?.showType === 'a4' ? 'active' : ''}`}>A4</span>
								
								
								</div>
								</div>
								<hr style={{margin: '12px 0px'}} className='animated-item'></hr>
							</div>
							{this.state?.activeModule?.showType === 'a4' && (
								<>
								<div className="animated-item">
									<ColorPicker
										title={'A4 Background Color'}
										color={this.state?.activeModule?.a4BgColor}
										handleColor={(e) => this.handleA4BgColor(e)}
										brandColors={this.state?.brandColors}
									/>
								</div>
								<hr className="animated-item"></hr>
								</>
							)} */}

							<div className="animated-item bg-types">
								<div
									className="overlay-options animated-item"
									onClick={() =>
										this.setState({
											showBgColorOptions: !this.state.showBgColorOptions,
										})
									}
								>
									<b>Background</b>
									<UpDown
										style={{
											rotate: !this.state.showBgColorOptions && '180deg',
										}}
									/>
								</div>

								{this.state.showBgColorOptions && (
									<>
										<div className="types">
											<span
												className={`${
													this.state?.activeSection?.style
														?.backgroundType !== 'image' &&
													this.state?.activeSection?.style
														?.backgroundType !== 'video'
														? 'active'
														: ''
												}`}
												style={{ backgroundColor: 'black' }}
												onClick={() => this.handleBackgroundType('color')}
											></span>
											<span
												className={` ${
													this.state?.activeSection?.style
														?.backgroundType == 'image' && 'active'
												} `}
												onClick={() => this.handleBackgroundType('image')}
											>
												<ImageSVG />
											</span>
											<span
												className={` ${
													this.state?.activeSection?.style
														?.backgroundType == 'video' && 'active'
												} `}
												onClick={() => this.handleBackgroundType('video')}
											>
												<VideoSVG />
											</span>
										</div>

										{this.state?.activeSection?.style?.backgroundType !==
											'image' &&
											this.state.activeSection?.style?.backgroundType !==
												'video' && (
												<div className="animated-item">
													<ColorPicker
														title={'Block Background Color'}
														color={this.state.bg}
														handleColor={(e) =>
															this.props.setBlockBg(e)
														}
														brandColors={this.state?.brandColors}
													/>
												</div>
											)}

										{this.state?.activeSection?.style?.backgroundType ==
											'image' &&
											(this.state?.activeSection?.style
												?.backgroundImageURL ? (
												<div
													className="bg-block_styles animated-item "
													style={{ position: 'relative' }}
												>
													{this.state?.activeSection?.style
														?.backgroundImageURL && (
														<div className="bg-crop-container">
															<Cropper
																key={
																	this.state.activeSection.style
																		.backgroundImageURL
																}
																image={
																	this.state.activeSection.style
																		.backgroundImageURL
																}
																crop={{ x: 0, y: 0 }}
																zoom={1}
																aspect={this.state.aspect}
																onCropChange={(e) => ''}
																onCropComplete={(e) => ''}
																onZoomChange={(e) => ''}
																onCropAreaChange={(e) => ''}
																restrictPosition={true}
															/>
															<span
																onClick={() =>
																	this.handleRemoveBgImage()
																}
															>
																<label>x</label>
															</span>
														</div>
													)}
												</div>
											) : (
												<>
													<div className="bg-block_styles animated-item">
														<div
															className="bg-empty_image_input"
															style={{ display: 'none' }}
														>
															<input
																type="file"
																ref={this.bgFileInputRef}
																onChange={(e) =>
																	this.handleBgFileChange(e)
																}
																accept=".png, .jpg, .jpeg"
															/>
														</div>

														<div
															className="bg-empty_image_block"
															style={{ padding: '10px' }}
															onClick={(e) => this.handleDiv2Click(e)}
														>
															{this.state.showImageProgressBar ? (
																<div className="image_progress_bar">
																	<div className="count">
																		{parseInt(
																			this.state
																				.progressCount,
																		)}
																		%
																	</div>
																	<div className="progress">
																		<span
																			className="progress-b"
																			style={{
																				width: `${parseInt(
																					this.state
																						.progressCount,
																				)}%`,
																			}}
																		></span>
																		<span></span>
																	</div>
																</div>
															) : (
																<>
																	<div className="icon">
																		<Upload />
																	</div>
																	<div className="title">
																		Upload Image
																	</div>
																	<div className="desc">
																		Recommended 2000 x 2000 px
																	</div>
																</>
															)}
														</div>
														<div
															style={{
																height: '100px',
																display: 'flex',
																justifyContent: 'center',
																position: 'relative',

																flexDirection: 'column',
															}}
														>
															<div className="or">
																<div className="ortext">Or</div>
																<div className="line"></div>
															</div>
															<div className="upload-options">
																<span
																	onClick={() =>
																		this.setState({
																			showImageModal: true,
																			addBgImageURL: true,
																		})
																	}
																>
																	Add a Photo from Library
																</span>
															</div>
														</div>
													</div>
												</>
											))}

										{this.state?.activeSection?.style?.backgroundType ==
											'video' && (
											<div className=" bs-item animated-item">
												<b>Video URL</b>
												<div
													className="bg-item"
													style={{
														flexDirection: 'column',
														gap: '12px',
														alignItems: 'flex-start',
													}}
												>
													<p
														style={{
															color: '#e4e5e6cc',
															fontSize: '10px',
															fontWeight: 'lighter',
															width: '100%',
														}}
													>
														Paste the URL link of your YouTube or Vimeo
														hosted video.
													</p>

													<div className="v-input-link">
														<input
															placeholder="Link"
															type="text"
															value={
																this.state?.activeSection?.style
																	?.backgroundVideoURL
															}
															onChange={(e) =>
																this.setBgVideoURL(e.target.value)
															}
														/>
													</div>
													{!this.props.isValidBgVideoURL && (
														<span
															style={{
																color: '#D1243F',
																fontSize: '13px',
																width: '100%',
															}}
														>
															{' '}
															invalid video URL{' '}
														</span>
													)}
												</div>
											</div>
										)}
										{(this.state?.activeSection?.style?.backgroundType ==
											'image' ||
											this.state.activeSection?.style?.backgroundType ==
												'video') && (
											<>
												<hr className="animated-item"></hr>
												<div
													className="bs-item animated-item"
													style={{ gap: '24px' }}
												>
													<div
														className="overlay-options animated-item"
														onClick={() =>
															this.setState({
																showOverlayOptions:
																	!this.state.showOverlayOptions,
															})
														}
													>
														<b>Overlay Effect</b>
														<UpDown
															style={{
																rotate:
																	!this.state
																		.showOverlayOptions &&
																	'180deg',
															}}
														/>
													</div>
													{this.state.showOverlayOptions && (
														<>
															<div className="animated-item">
																<ColorPicker
																	title={' Color'}
																	color={
																		this.state?.activeSection
																			?.style?.bgOverlayColor
																	}
																	handleColor={(e) =>
																		this.handleBgOverlay(
																			e,
																			'color',
																		)
																	}
																	brandColors={
																		this.state?.brandColors
																	}
																/>
															</div>
															<div className="bs-item animated-item">
																<b>Opacity</b>
																<div className="bg-item">
																	<div
																		style={{
																			display: 'flex',
																			maxWidth: 230,
																			marginLeft: 6,
																		}}
																	>
																		<input
																			type="range"
																			min={0}
																			max={100}
																			step={5}
																			defaultValue={30}
																			value={
																				this.state
																					?.activeSection
																					?.style
																					?.bgOverlayOpacity
																			}
																			onChange={(e) =>
																				this.handleBgOverlay(
																					e.target.value,
																					'opacity',
																				)
																			}
																			onMouseUp={() =>
																				this.props.setActiveSection(
																					this.state
																						.activeSection,
																					null,
																				)
																			}
																			classes={{
																				container: 'slider',
																			}}
																		/>
																	</div>
																	<p>
																		{
																			this.state
																				?.activeSection
																				?.style
																				?.bgOverlayOpacity
																		}
																	</p>
																</div>
															</div>
														</>
													)}
												</div>
											</>
										)}
									</>
								)}
							</div>
							{/* summary layout in star */}
							{this.state?.activeSection?.style?.summaryLayout && (
								<div className="bg-types animated-item">
									<hr className="animated-item"></hr>
									<div
										className="overlay-options animated-item"
										onClick={() =>
											this.setState({
												showSummaryColorOptions:
													!this.state.showSummaryColorOptions,
											})
										}
									>
										<b>Summary Styles</b>
										<UpDown
											style={{
												rotate:
													!this.state.showSummaryColorOptions && '180deg',
											}}
										/>
									</div>
								</div>
							)}

							{this.state?.activeSection?.style?.summaryLayout &&
								this.state?.showSummaryColorOptions && (
									<>
										{/* font family */}
										<div className="bs-item animated-item">
											<b>Font</b>
											<div style={{ display: 'flex', gap: 10 }}>
												<div className="padding-items font-items">
													<label
														style={{ width: '315px' }}
														className="sideBarDropDownArrow"
													>
														<p
															style={{
																width: 100,
																overflow: 'hidden',
																fontFamily:
																	this.state?.activeSection?.style
																		?.summaryPrimaryFont,
															}}
														>
															{this.state?.activeSection?.style
																?.summaryLayout
																? this.state?.activeSection?.style
																		?.summaryPrimaryFont
																: this.state?.summaryFont}
														</p>
														<DropDown
															className="font-dropdown-icon"
															onClick={(e) =>
																this.toggleFontsDropDown(e)
															}
															style={{
																width: '12px',
																height: '12px',
																transform:
																	this.state.showFontsDropDown ===
																	false
																		? 'rotate(0deg)'
																		: 'rotate(180deg)',
															}}
														/>
													</label>
													{this.state.showFontsDropDown ? (
														<div
															style={{
																top: this.state?.activeSection
																	?.style?.summaryLayout
																	? '400px'
																	: '300px',
																left: '25px',
															}}
															className="fonts-dropdown fonts-summary"
															ref={this.dropdownref}
														>
															<legend
																style={{
																	position: 'sticky',
																	top: 0,
																}}
																className="font-search"
															>
																<input
																	value={this.state.searchFont}
																	onChange={(e) =>
																		this.setState({
																			searchFont:
																				e.target.value,
																		})
																	}
																	placeholder={'Search Font'}
																/>
															</legend>
															{_.map(
																_.orderBy(
																	fonts.filter(
																		(font) =>
																			this.state
																				.searchFont ===
																				'' ||
																			(this.state.searchFont
																				.length >= 1 &&
																				font.fontName
																					?.toLowerCase()
																					.includes(
																						this.state.searchFont?.toLowerCase(),
																					)),
																	),
																	[
																		(fontF) =>
																			fontF.fontName?.toLowerCase(),
																	],
																	['asc'],
																),
																(font, k) => {
																	return (
																		<p
																			key={k} // Always include a unique key in lists
																			onClick={(e) =>
																				this.props.setSummaryStyles(
																					font.value,
																					'summaryFont',
																					'v1',
																				)
																			}
																			style={{
																				fontFamily:
																					font.value,
																				backgroundColor:
																					this.state
																						.summaryFont ===
																					font?.value
																						? '#171717'
																						: '',
																			}}
																		>
																			{font.fontName}
																		</p>
																	);
																},
															)}
														</div>
													) : (
														''
													)}
												</div>
											</div>
										</div>

										{/* font color */}

										<div className="bs-item animated-item">
											<ColorPicker
												title={'Font Color'}
												color={
													this.state?.activeSection?.style?.summaryLayout
														? this.state?.activeSection?.style
																?.summaryPrimaryFontColor
														: this.state?.summaryFontColor
												}
												handleColor={(e) =>
													this.setState({ summaryFontColor: e }, () => {
														this.props.setSummaryStyles(
															e,
															'summaryFontColor',
															'v1',
														);
													})
												}
												brandColors={this.state?.brandColors}
											/>
										</div>
										{/* font size */}
										<div className="bs-item" style={{ position: 'relative' }}>
											<b>Size</b>
											<div className="bg-item">
												<div
													style={{
														display: 'flex',
														maxWidth: 230,
														marginLeft: 6,
													}}
												>
													<input
														type="range"
														min={8}
														max={50}
														step={1}
														defaultValue={this.state.fontSize}
														value={
															this.state?.activeSection?.style
																?.summaryLayout
																? this.state?.activeSection?.style
																		?.summaryPrimaryFontSize
																: this.state?.summaryFontSize
														}
														onChange={(e) =>
															this.props.setSummaryStyles(
																e.target.value,
																'summaryFontSize',
																'v1',
															)
														}
													/>
												</div>
												<p>
													<input
														defaultValue={this.state.fontSize}
														value={
															this.state?.activeSection?.style
																?.summaryLayout
																? this.state?.activeSection?.style
																		?.summaryPrimaryFontSize
																: this.state?.summaryFontSize
														}
														onChange={(e) =>
															this.props.setSummaryStyles(
																e.target.value,
																'summaryFontSize',
																'v1',
															)
														}
														style={{
															width: 50,
															background: 'transparent',
															border: '1px solid #9b9290',
															color: '#9b9290',
														}}
													/>
												</p>
											</div>
										</div>
										{/* background color */}

										<div className="bs-item animated-item">
											<ColorPicker
												title={'Block Background Color'}
												color={this.state?.summaryBg}
												handleColor={(e) =>
													this.setState({ summaryBg: e }, () => {
														this.props.setSummaryStyles(
															e,
															'summaryBg',
															'v1',
														);
													})
												}
												brandColors={this.state?.brandColors}
											/>
										</div>
									</>
								)}
							{this.state?.activeSection?.style?.invoiceLayout && (
								<div className="bg-types animated-item">
									<hr className="animated-item"></hr>
									<div
										className="overlay-options animated-item"
										onClick={() =>
											this.setState({
												showInvoiceColorOptions:
													!this.state.showInvoiceColorOptions,
											})
										}
									>
										<b>Invoice Colors</b>
										<UpDown
											style={{
												rotate:
													!this.state.showInvoiceColorOptions && '180deg',
											}}
										/>
									</div>
								</div>
							)}
							{this.state?.activeSection?.style?.invoiceLayout &&
								this.state?.showInvoiceColorOptions && (
									<>
										{/* <hr className="animated-item"></hr> */}
										<div className="animated-item">
											<ColorPicker
												title={' box 1 Background Color'}
												color={this.state?.activeSection?.style?.Card1Color}
												handleColor={(e) =>
													this.handleInvoiceStyle(e, 'card1')
												}
												brandColors={this.state?.brandColors}
											/>
										</div>
										{/* <hr className="animated-item"></hr> */}
										<div className="animated-item">
											<ColorPicker
												title={' box 2 Background Color'}
												color={this.state?.activeSection?.style?.Card2Color}
												handleColor={(e) =>
													this.handleInvoiceStyle(e, 'card2')
												}
												brandColors={this.state?.brandColors}
											/>
										</div>
										{/* <hr className="animated-item"></hr> */}
										<div className="animated-item">
											<ColorPicker
												title={'Primary Text Color'}
												color={this.state?.activeSection?.style?.titleColor}
												handleColor={(e) =>
													this.handleInvoiceStyle(e, 'title')
												}
												brandColors={this.state?.brandColors}
											/>
										</div>
										{/* <hr className="animated-item"></hr> */}
										<div className="animated-item">
											<ColorPicker
												title={' Secondary Text Color'}
												color={this.state?.activeSection?.style?.valueColor}
												handleColor={(e) =>
													this.handleInvoiceStyle(e, 'value')
												}
												brandColors={this.state?.brandColors}
											/>
										</div>
									</>
								)}

							{this.state?.activeSection?.style?.hasTable ? (
								<>
									<hr className="animated-item"></hr>
									<div
										className="bs-item bs-item-row animated-item"
										style={{ justifyContent: 'flex-start' }}
									>
										<div
											className="bt-item animated-item"
											style={{ gap: '6px', padding: '4px', width: '130px' }}
										>
											<b>Rows</b>
											<div className="table-cd-div">
												<b
													className="clickable-span"
													onClick={(e) =>
														this.state?.activeSection?.blocks?.length >=
														2
															? (e.stopPropagation(),
															  this.props?.handleDeleteInTable(
																	'row',
																	1,
																	'last',
															  ))
															: null
													}
												>
													-
												</b>
												<b>
													{this.state?.activeSection?.blocks?.length || 0}
												</b>
												<b
													className="clickable-span"
													onClick={(e) => {
														e.stopPropagation();
														this.props?.handleAddInTable(
															'row',
															-1,
															'last',
															this.state?.activeSection?.blocks[0]
																?.subBlocks?.length || 0,
														);
													}}
												>
													+
												</b>
											</div>
										</div>
										<div
											className="bt-item animated-item"
											style={{ gap: '6px', padding: '4px', width: '130px' }}
										>
											<b>Columns</b>
											<div className="table-cd-div">
												<b
													className="clickable-span"
													onClick={(e) => {
														e.stopPropagation();
														if (
															this.state?.activeSection?.blocks[0]
																?.subBlocks?.length >= 2
														) {
															this.props?.handleDeleteInTable(
																'column',
																0,
																'last',
															);
														}
													}}
												>
													-
												</b>
												<b>
													{this.state?.activeSection?.blocks[0]?.subBlocks
														?.length || 0}
												</b>
												<b
													className="clickable-span"
													onClick={(e) => {
														e.stopPropagation();
														this.props?.handleAddInTable(
															'column',
															0,
															'last',
														);
													}}
												>
													+
												</b>
											</div>
										</div>
									</div>
								</>
							) : (
								''
							)}

							{this.state.activeSection?.style?.hasContract && (
								<div className="animated-item bg-container">
									<hr className="animated-item"></hr>

									<ColorPicker
										title={'Cart Background Color'}
										color={this.state.activeSection?.style?.cartBackgroundColor}
										handleColor={(e) => this.handleCartBgColor(e)}
										brandColors={this.state?.brandColors}
									/>
								</div>
							)}

							{/* for journey blocks count -abdullah */}
							{_.has(this.state?.activeSection?.style, 'jCountValue') && (
								<>
									<hr className="animated-item"></hr>
									<div className="bs-item animated-item">
										<b>Count</b>
										<div className="bg-item">
											<div
												style={{
													display: 'flex',
													maxWidth: 230,
													marginLeft: 6,
												}}
											>
												<input
													type="range"
													min={1}
													max={12}
													step={1}
													defaultValue={4}
													value={
														this.state?.activeSection?.style
															?.jCountValue
													}
													onChange={(e) =>
														this.handleJourneyCount(e.target.value)
													}
													onMouseUp={() =>
														this.props.setActiveSection(
															this.state.activeSection,
														)
													}
												/>
											</div>
											<p>{this.state?.activeSection?.style?.jCountValue}</p>
										</div>
									</div>
								</>
							)}

							{(_.has(this.state?.activeSection?.style, 'count') ||
								(_.has(this.state.activeSection?.style, 'gap') &&
									!_.has(this.state.activeSection?.style, 'iconsAlign'))) && (
								<>
									<div
										className="overlay-options animated-item"
										onClick={() =>
											this.setState({
												showListOptions: !this.state.showListOptions,
											})
										}
									>
										<b>List Options</b>
										<UpDown
											style={{
												rotate: !this.state.showListOptions && '180deg',
											}}
										/>
									</div>
								</>
							)}
							{_.has(this.state?.activeSection?.style, 'count') &&
								this.state.showListOptions && (
									<div className="bs-item animated-item">
										<b>List items</b>
										<div className="bg-item">
											<div
												style={{
													display: 'flex',
													maxWidth: 230,
													marginLeft: 6,
												}}
											>
												<input
													type="range"
													min={1}
													max={12}
													step={1}
													defaultValue={4}
													value={this.state?.activeSection?.style?.count}
													onChange={(e) =>
														this.handleListCount(e.target.value)
													}
													onMouseUp={() =>
														this.props.setActiveSection(
															this.state.activeSection,
														)
													}
												/>
											</div>
											<p>{this.state?.activeSection?.style?.count}</p>
										</div>
									</div>
								)}

							{_.has(this.state.activeSection?.style, 'gap') &&
								!_.has(this.state.activeSection?.style, 'iconsAlign') &&
								this.state.showListOptions && (
									<>
										<div className="spacing bs-item animated-item">
											<b>list Spacing</b>
											<div className="bg-item">
												<div
													style={{
														display: 'flex',
														maxWidth: 230,
														marginLeft: 6,
													}}
												>
													<input
														type="range"
														min={8}
														max={40}
														step={8}
														value={this.state.activeSection?.style?.gap}
														onChange={(e) =>
															this.handleListSpacing(e.target.value)
														}
														onMouseUp={() =>
															this.props.setActiveSection(
																this.state.activeSection,
																null,
															)
														}
													/>
												</div>
												<p>{this.state.activeSection?.style?.gap}</p>
											</div>
										</div>
									</>
								)}

							{/* video block -Abdullah */}
							{_.has(this.state.activeSection?.style, 'isVideoBlock') ||
							this.state.showVideoBlock ? (
								<>
									<div className=" bs-item animated-item">
										<b>Video URL</b>
										<div
											className="bg-item"
											style={{
												flexDirection: 'column',
												gap: '12px',
												alignItems: 'flex-start',
											}}
										>
											<p
												style={{
													color: '#939393',
													fontSize: '10px',
													fontWeight: 'lighter',
													width: '100%',
												}}
											>
												Paste the URL link of your YouTube or Vimeo hosted
												video.
											</p>

											<div className="v-input-link">
												<input
													placeholder="Link"
													type="text"
													value={this.state.videoURL}
													onChange={(e) =>
														this.setVideoURL(e.target.value)
													}
												/>
											</div>

											{!this.props.isValidURL && (
												<span
													style={{
														color: 'red',
														fontSize: '10px',
														width: '100%',
													}}
												>
													{' '}
													invalid video URL{' '}
												</span>
											)}
										</div>
									</div>
									<div
										className="overlay-options animated-item"
										onClick={() =>
											this.setState({
												showVideoOptions: !this.state.showVideoOptions,
											})
										}
									>
										<b>Video Options</b>
										<UpDown
											style={{
												rotate: !this.state.showVideoOptions && '180deg',
											}}
										/>
									</div>
									{this.state.showVideoOptions && (
										<>
											<div className=" bs-item bs-item-row animated-item">
												<b>Auto Play </b>
												<label className="switch">
													<input
														type="checkbox"
														onChange={(e) =>
															this.setAutoplay(e.target.checked)
														}
														checked={this.state.autoplay}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>
											<div className=" bs-item bs-item-row animated-item">
												<b>Loop </b>
												<label className="switch">
													<input
														type="checkbox"
														onChange={(e) =>
															this.setVideoLoop(e.target.checked)
														}
														checked={this.state.loop}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>
											<hr className="animated-item"></hr>
											<div className=" bs-item bs-item-row animated-item">
												<b>Fill Container </b>
												<label className="switch">
													<input
														type="checkbox"
														onChange={(e) =>
															this.setFillVideoBlock(e.target.checked)
														}
														checked={this.state.fillVideoBlock}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>

											{this.state?.activeSection?.style?.alignVideoBlock &&
												!this.state?.fillVideoBlock && (
													<div className="bs-item bs-item-row animated-item">
														<b> Alignment</b>
														<div className="padding-items justify-items position-icons ">
															<span
																className={
																	this.state?.alignVideoBlock ===
																	'flex-start'
																		? 'active'
																		: ''
																}
																onClick={(e) =>
																	this.setAlignVideoBlock(
																		'flex-start',
																	)
																}
															>
																<PositionRight />
															</span>
															<span
																className={
																	this.state?.alignVideoBlock ===
																	'center'
																		? 'active'
																		: ''
																}
																onClick={(e) =>
																	this.setAlignVideoBlock(
																		'center',
																	)
																}
															>
																<PositionCenter />
															</span>
															<span
																className={
																	this.state?.alignVideoBlock ===
																	'flex-end'
																		? 'active'
																		: ''
																}
																onClick={(e) =>
																	this.setAlignVideoBlock(
																		'flex-end',
																	)
																}
															>
																<PositionLeft />
															</span>
														</div>
													</div>
												)}
										</>
									)}
								</>
							) : (
								''
							)}

							{!this.state.noPadding && (
								<>
									<hr className="animated-item"></hr>
									<div
										className="overlay-options animated-item"
										onClick={() =>
											this.setState({
												showPaddingOptions: !this.state.showPaddingOptions,
											})
										}
									>
										<b>Padding</b>
										<UpDown
											style={{
												rotate: !this.state.showPaddingOptions && '180deg',
											}}
										/>
									</div>
									{this.state.showPaddingOptions && (
										<>
											<div className="bs-item animated-item">
												<b>Block Height</b>
												<div className="padding-items">
													<span
														className={
															this.state.padding == 0 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(0)}
													>
														0
													</span>
													<span
														className={
															this.state.padding == 1 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(1)}
													>
														XS
													</span>

													<span
														className={
															this.state.padding == 2 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(2)}
													>
														S
													</span>
													<span
														className={
															this.state.padding == 3 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(3)}
													>
														M
													</span>
													<span
														className={
															this.state.padding == 4 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(4)}
													>
														L
													</span>
												</div>
											</div>
											<div className="bs-item animated-item">
												<b>Block Width</b>
												<div className="padding-items">
													<span
														className={
															this.state.paddingHorizontal == 0
																? 'active'
																: ''
														}
														onClick={(e) =>
															this.setHorizontalPadding(0)
														}
													>
														0
													</span>
													<span
														className={
															this.state.paddingHorizontal == 1
																? 'active'
																: ''
														}
														onClick={(e) =>
															this.setHorizontalPadding(1)
														}
													>
														XS
													</span>

													<span
														className={
															this.state.paddingHorizontal == 2
																? 'active'
																: ''
														}
														onClick={(e) =>
															this.setHorizontalPadding(2)
														}
													>
														S
													</span>
													<span
														className={
															this.state.paddingHorizontal == 3
																? 'active'
																: ''
														}
														onClick={(e) =>
															this.setHorizontalPadding(3)
														}
													>
														M
													</span>
													<span
														className={
															this.state.paddingHorizontal == 4
																? 'active'
																: ''
														}
														onClick={(e) =>
															this.setHorizontalPadding(4)
														}
													>
														L
													</span>
												</div>
											</div>
										</>
									)}
								</>
							)}

							{this.state.innerPadding && (
								<>
									<hr className="animated-item"></hr>
									<div
										className="overlay-options animated-item"
										onClick={() =>
											this.setState({
												showPaddingOptions: !this.state.showPaddingOptions,
											})
										}
									>
										<b>Padding</b>
										<UpDown
											style={{
												rotate: !this.state.showPaddingOptions && '180deg',
											}}
										/>
									</div>
									{this.state.showPaddingOptions && (
										<>
											<div className="bs-item animated-item">
												<b>Blocks Padding</b>
												<div className="padding-items">
													<span
														className={
															this.state.padding == 0 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(0)}
													>
														0
													</span>
													<span
														className={
															this.state.padding == 1 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(1)}
													>
														XS
													</span>

													<span
														className={
															this.state.padding == 2 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(2)}
													>
														S
													</span>
													<span
														className={
															this.state.padding == 3 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(3)}
													>
														M
													</span>
													<span
														className={
															this.state.padding == 4 ? 'active' : ''
														}
														onClick={(e) => this.setPadding(4)}
													>
														L
													</span>
												</div>
											</div>
										</>
									)}
								</>
							)}

							{this.state.hasIframe && (
								<>
									<hr className="animated-item"></hr>
									<div className=" bs-item animated-item">
										<b>Embed URL</b>
										<div
											className="bg-item"
											style={{
												flexDirection: 'column',
												gap: '12px',
												alignItems: 'flex-start',
											}}
										>
											<p
												style={{
													color: '#939393',
													fontSize: '10px',
													fontWeight: 'lighter',
													width: '100%',
												}}
											>
												Paste the Source link to Embed here.
											</p>

											<div className="v-input-link">
												<input
													placeholder="Link"
													type="text"
													value={this.state?.source}
													onChange={(e) =>
														this.handleIframeValues(
															'url',
															e.target.value,
														)
													}
												/>
											</div>

											<span className="tip-span">
												<span className="tip">TIP</span>
												Ensure this Embed link has the correct permissions
												for your viewers
											</span>
											{/* {this.state?.invalidEmbedURL && (
												<span
													style={{
														color: '#D1243F',
														fontSize: '10px',
														width: '100%',
													}}
												>
													{' '}
													invalid URL{' '}
												</span>
											)} */}
										</div>
									</div>
									<hr className="animated-item"></hr>

									<div
										className="st-styles animated-item"
										style={{ height: 'fit-content' }}
									>
										<div
											className="st-item animated-item"
											style={{ padding: 0 }}
										>
											<b>Height</b>
											<div className="st-range-div">
												<div
													style={{
														display: 'flex',
														maxWidth: 230,
													}}
												>
													<input
														type={'range'}
														value={this.state?.iHeight}
														min={10}
														max={100}
														step={5}
														onChange={(e) =>
															this.handleIframeValues(
																'height',
																e.target.value,
															)
														}
													/>
												</div>
												<p>{this.state?.iHeight}</p>
											</div>
										</div>
									</div>
								</>
							)}
							{this.state.activeSection?.type === 'line' &&
								this.state?.activeSection?.style?.contentAlign && (
									<div className="bs-item animated-item">
										<b>Content Alignment</b>
										<div className="padding-items justify-items">
											<span
												className={
													this.state?.contentAlign ===
													'justify-content-flex-start'
														? 'active'
														: ''
												}
												onClick={(e) =>
													this.setContentPosition(
														'justify-content-flex-start',
													)
												}
											>
												<Left />
											</span>
											<span
												className={
													this.state?.contentAlign ===
													'justify-content-center'
														? 'active'
														: ''
												}
												onClick={(e) =>
													this.setContentPosition(
														'justify-content-center',
													)
												}
											>
												<Center />
											</span>
											<span
												className={
													this.state?.contentAlign ===
													'justify-content-flex-end'
														? 'active'
														: ''
												}
												onClick={(e) =>
													this.setContentPosition(
														'justify-content-flex-end',
													)
												}
											>
												<Right />
											</span>
										</div>
									</div>
								)}
							{this.state.activeSection?.style?.imagePositionOptions && (
								<div className="bs-item ">
									<hr className="animated-item"></hr>
									<b className="animated-item">Layout</b>
									<div className="bs-item bs-item-row animated-item">
										<b>ImagePosition</b>

										<div className="image-items ">
											{this.state.activeSection?.style?.imagePositionOptions
												?.hflip && (
												<>
													<span
														className={`tooltip
														${
															this.state.activeSection?.style
																?.imagePositionStyles ===
															'flex-direction-row-reverse-imp'
																? 'active'
																: ''
														}`}
														onClick={(e) =>
															this.setImagePosition(
																'flex-direction-row-reverse-imp',
															)
														}
													>
														<ImageLeft />
														<label className="tooltip-text">Left</label>
													</span>
													<span
														className={`tooltip
														${
															this.state.activeSection?.style
																?.imagePositionStyles ===
															'flex-direction-row-imp'
																? 'active'
																: ''
														}`}
														onClick={(e) =>
															this.setImagePosition(
																'flex-direction-row-imp',
															)
														}
													>
														<ImageRight />
														<label className="tooltip-text">
															Right
														</label>
													</span>
												</>
											)}
											{this.state.activeSection?.style?.imagePositionOptions
												?.vflip && (
												<>
													<span
														className={`tooltip
														${
															this.state.activeSection?.style
																?.imagePositionStyles ===
															'flex-direction-column-imp'
																? 'active'
																: ''
														}`}
														onClick={(e) =>
															this.setImagePosition(
																'flex-direction-column-imp',
															)
														}
													>
														<ImageBottom />
														<label className="tooltip-text">
															Bottom
														</label>
													</span>
													<span
														className={`tooltip
														${
															this.state.activeSection?.style
																?.imagePositionStyles ===
															'flex-direction-column-reverse-imp'
																? 'active'
																: ''
														}`}
														onClick={(e) =>
															this.setImagePosition(
																'flex-direction-column-reverse-imp',
															)
														}
													>
														<ImageTop />
														<label className="tooltip-text">Top</label>
													</span>
												</>
											)}
										</div>
									</div>
									{this.state?.activeSection?.style?.contentAlign && (
										<div className="bs-item bs-item-row animated-item">
											<b>Content Alignment</b>
											<div className="image-items">
												<span
													className={`tooltip 
													${this.state?.contentAlign === 'justify-content-flex-end' ? 'active' : ''}`}
													onClick={(e) =>
														this.setContentPosition(
															'justify-content-flex-end',
														)
													}
												>
													<TextAlignBottom />
													<label className="tooltip-text">Bottom</label>
												</span>
												<span
													className={`tooltip
													${this.state?.contentAlign === 'justify-content-center' ? 'active' : ''}`}
													onClick={(e) =>
														this.setContentPosition(
															'justify-content-center',
														)
													}
												>
													<TextAlignCenter />
													<label className="tooltip-text">Center</label>
												</span>
												<span
													className={`tooltip
													${this.state?.contentAlign === 'justify-content-flex-start' ? 'active' : ''}`}
													onClick={(e) =>
														this.setContentPosition(
															'justify-content-flex-start',
														)
													}
												>
													<TextAlignTop />
													<label className="tooltip-text">Top</label>
												</span>
											</div>
										</div>
									)}
									<div className="bs-item bs-item-row animated-item">
										<b>Invert image & content in mobile</b>
										<label class="switch">
											<input
												type="checkbox"
												onChange={(e) =>
													this.setMobileImagePosition(
														!this.state.activeSection?.style
															?.mimagePosition,
													)
												}
												checked={
													this.state.activeSection?.style?.mimagePosition
												}
											/>

											<span class="slider-round round"></span>
										</label>
									</div>
								</div>
							)}
							{_.has(this.state.activeSection, 'isFluidSection') && (
								<div className="bs-item animated-item">
									<hr className="animated-item"></hr>
									<div className="bs-item bs-item-row animated-item">
										<b className="animated-item">Rows</b>
										<div className="row-increment">
											<div
												className="row-resizeButtons"
												onClick={() => this.handleRowResizing(-1)}
											>
												<Negative />
											</div>
											<div
												className="row-number"
												style={{
													cursor: 'not-allowed',
													userSelect: 'none',
													WebkitUserSelect: 'none',
													msUserSelect: 'none',
													MozUserSelect: 'none',
												}}
											>
												{
													this.state?.activeSection?.blocks?.[0]
														?.divStyles?.gridRows
												}
											</div>
											<div
												className="row-resizeButtons"
												onClick={() => this.handleRowResizing(1)}
											>
												<Positive />
											</div>
										</div>
									</div>
									<div className="bs-item animated-item">
										<b className="animated-item">Grid Spacing</b>
										<div className="grid-spacing-settings">
											<p
												className={`grid-settings-item ${
													this.state.activeSection?.blocks?.[0]?.divStyles
														?.rowGap === 10 &&
													this.state.activeSection?.blocks?.[0]?.divStyles
														?.columnGap === 10
														? 'active'
														: ''
												}`}
											>
												<GridGap onClick={() => this.handleGridGap(10)} />
											</p>
											<p
												className={`grid-settings-item ${
													this.state.activeSection?.blocks?.[0]?.divStyles
														?.rowGap === 0 &&
													this.state.activeSection?.blocks?.[0]?.divStyles
														?.columnGap === 0
														? 'active'
														: ''
												}`}
											>
												<GridNoGap onClick={() => this.handleGridGap(0)} />
											</p>

											<p
												className={`grid-Custom ${
													(this.state.activeSection?.blocks?.[0]
														?.divStyles?.rowGap !== 0 &&
														this.state.activeSection?.blocks?.[0]
															?.divStyles?.rowGap !== 10) ||
													(this.state.activeSection?.blocks?.[0]
														?.divStyles?.columnGap !== 0 &&
														this.state.activeSection?.blocks?.[0]
															?.divStyles?.columnGap !== 10)
														? 'active'
														: ''
												}`}
											>
												Custom
											</p>
										</div>
										<div className="bs-item bs-item-row animated-item justify-content-start-imp">
											<div className="row-gap-icon">
												<RowGap />
											</div>
											<div
												style={{
													display: 'flex',
													maxWidth: 230,
													marginLeft: 6,
												}}
											>
												<input
													type="range"
													min={0}
													max={50}
													step={1}
													//defaultValue={this.state.fontSize}
													value={
														this.state.activeSection?.blocks?.[0]
															?.divStyles?.rowGap
													}
													onChange={(e) =>
														this.handleGridGapCustom(
															e.target.value,
															'rowGap',
														)
													}
												/>
											</div>
										</div>
										<div className="bs-item bs-item-row animated-item justify-content-start-imp">
											<div className="row-gap-icon">
												<ColumnGap />
											</div>
											<div
												style={{
													display: 'flex',
													maxWidth: 230,
													marginLeft: 6,
												}}
											>
												<input
													type="range"
													min={0}
													max={50}
													step={1}
													//defaultValue={this.state.fontSize}
													value={
														this.state.activeSection?.blocks?.[0]
															?.divStyles?.columnGap
													}
													onChange={(e) =>
														this.handleGridGapCustom(
															e.target.value,
															'columnGap',
														)
													}
												/>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)
				) : (
					''
				)}

				{this.state.activeTab === 'i' ? (
					<>
						<div
							className="overlay-options animated-item"
							style={{ padding: '12px 24px' }}
							onClick={() =>
								this.setState({
									showAnimationOptions: !this.state.showAnimationOptions,
								})
							}
						>
							<b>Animations </b>
							<Plus />
						</div>

						<div className="show-anime-options">
							{this.state?.activeElementAnimeType && (
								<div
									className="active-anime-option"
									onClick={(e) => {
										e.stopPropagation();
										this.handleElementAnimationsType(
											this.state?.activeElementAnimeType,
										);
									}}
								>
									<span>{this.state?.activeElementAnimeType || ''}</span>
									<Plus
										style={{ rotate: '45deg' }}
										onClick={(e) => {
											this.handleRemoveElementAnimations(e);
										}}
									/>
								</div>
							)}
							{this.state?.showAnimationOptions && (
								<div className="anime-options-box">
									<div
										className="anime-options-box-item"
										onClick={() => this.handleElementAnimationsType('hover')}
									>
										<span>Hover</span>
										{this.state?.activeElementAnimeType == 'hover' && (
											<ActiveTick />
										)}
									</div>
									<div
										className="anime-options-box-item"
										onClick={() => this.handleElementAnimationsType('press')}
									>
										<span>Press</span>
										{this.state?.activeElementAnimeType == 'press' && (
											<ActiveTick />
										)}
									</div>
									<div
										className="anime-options-box-item"
										onClick={() => this.handleElementAnimationsType('loop')}
									>
										<span>Loop</span>
										{this.state?.activeElementAnimeType == 'loop' && (
											<ActiveTick />
										)}
									</div>
								</div>
							)}
						</div>

						<div className="block_shapes">
							{this.state.shape &&
								this.state?.activeModule?.module !== 'form' &&
								_.map(this.state.shape, (shape) => (
									<div key={shape.name}>
										<div
											className={
												shape.name === this.state.activeShape
													? 'activeShape'
													: ''
											}
											style={shape.style}
											onClick={() => this.handleActiveShape(shape.name)}
										></div>
									</div>
								))}
						</div>

						{this.state.activeImageURL && this.state.activeImageURL !== null ? (
							<div
								className="block_styles"
								style={{
									position: 'relative',
									height:
										this.props.hasShape &&
										this.state.shape &&
										!this.state.isLogo
											? `calc(100vh - 61px - 230px)`
											: 'calc(100vh - 64px - 100px)',
								}}
							>
								<div className="crop-container">
									<Cropper
										image={this.state.activeImageURL}
										crop={this.state.crop}
										zoom={this.state.zoom}
										aspect={this.state.aspect}
										onCropChange={(e) => this.onCropChange(e)}
										//onCropComplete={(e) => this.onCropChange(e)}
										// onZoomChange={(e) => this.onZoomChange(e)}
										onZoomChange={(e) => ''}
										onCropAreaChange={(e) => this.setCroppedArea(e)}
										restrictPosition={true}
									/>
									<span onClick={(e) => this.handleRemoveImage(e)}>
										<label>x</label>
									</span>
								</div>
								<div
									className="controls"
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: 10,
										marginTop: 30,
									}}
								>
									<div>
										<label
											style={{
												display: 'flex',
												width: '100%',
												fontSize: 13,
												color: '#f8f8f8',
											}}
										>
											Zoom
										</label>
										<div className="image-zoom-div">
											<input
												type={'range'}
												value={this.state.zoom}
												min={1}
												max={5}
												step={0.1}
												aria-labelledby="Zoom"
												onChange={(e) => this.onZoomChange(e.target.value)}
												classes={{ container: 'slider' }}
											/>
											<span className="zoom-value">
												{parseFloat(this.state.zoom || 1)?.toFixed(1)}
											</span>
										</div>
									</div>

									{this.state.isLogo && (
										<div
											className="controls"
											style={{
												display: 'flex',
												flexDirection: 'column',
												gap: 10,
												marginTop: 30,
												top: '200px',
											}}
										>
											<label
												style={{
													display: 'flex',
													width: '100%',
													fontSize: 13,
													color: '#e4e5e6',
												}}
											>
												Width
											</label>
											<input
												type={'range'}
												value={parseInt(this.state?.imageWidth?.width) || 0}
												min={60}
												max={500}
												step={1}
												aria-labelledby="Zoom"
												onChange={(e) =>
													this.handleImageWidth(e.target.value)
												}
												classes={{ container: 'slider' }}
											/>
										</div>
									)}
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										position: 'relative',
										top: '400px',
										flexDirection: 'column',
									}}
								>
									<div className="or">
										<div className="ortext">Or</div>
										<div className="line"></div>
									</div>
									<div className="upload-options">
										<span
											onClick={() =>
												this.setState({
													showImageModal: true,
												})
											}
										>
											Select a Photo from Library
										</span>
									</div>
								</div>
								<>
									{!this.state.activeSection?.style?.header && (
										<div>
											<hr
												className="animated-item"
												style={{
													marginTop: this.state?.isLogo
														? '500px'
														: '400px',
												}}
											></hr>
											<div
												className="bs-item animated-item "
												style={{ gap: '24px' }}
											>
												<div
													className="overlay-options animated-item"
													onClick={() =>
														this.setState({
															showOverlayOptions:
																!this.state.showOverlayOptions,
														})
													}
												>
													<b>Overlay Effect</b>
													<UpDown
														style={{
															rotate:
																!this.state.showOverlayOptions &&
																'180deg',
														}}
													/>
												</div>
												{this.state.showOverlayOptions && (
													<>
														<div className="animated-item">
															<ColorPicker
																title={' Color'}
																color={
																	this.state?.activeImageSubBlock
																		?.ImgOverlayColor
																}
																handleColor={(e) =>
																	this.handleImgOverlay(
																		'color',
																		e,
																	)
																}
																brandColors={
																	this.state?.brandColors
																}
															/>
														</div>
														<div className="bs-item animated-item">
															<b>Opacity</b>
															<div className="bg-item">
																<div
																	style={{
																		display: 'flex',
																		maxWidth: 230,
																		marginLeft: 6,
																	}}
																>
																	<input
																		type="range"
																		min={0}
																		max={100}
																		step={5}
																		defaultValue={40}
																		value={
																			this.state
																				?.activeImageSubBlock
																				?.ImgOverlayOpacity
																		}
																		onChange={(e) =>
																			this.handleImgOverlay(
																				'opacity',
																				e.target.value,
																			)
																		}
																	/>
																</div>
																<p>
																	{
																		this.state?.activeSection
																			?.style
																			?.bgOverlayOpacity
																	}
																</p>
															</div>
														</div>
													</>
												)}
											</div>
										</div>
									)}
								</>
							</div>
						) : (
							<>
								<div
									className="block_styles"
									style={{
										height:
											this.props.hasShape && this.state.shape
												? `calc(100vh - 61px - 230px)`
												: 'calc(100vh - 64px - 100px)',
									}}
								>
									<div className="empty_image_input" style={{ display: 'none' }}>
										<input
											type="file"
											ref={this.fileInputRef}
											onChange={(e) => this.handleFileChange(e)}
											accept=".png, .jpg, .jpeg"
										/>
									</div>

									<div
										className="empty_image_block"
										onClick={(e) => this.handleDivClick(e)}
									>
										{this.state.showImageProgressBar ? (
											<div className="image_progress_bar">
												<div className="count">
													{parseInt(this.state.progressCount)}%
												</div>
												<div className="progress">
													<span
														className="progress-b"
														style={{
															width: `${parseInt(
																this.state.progressCount,
															)}%`,
														}}
													></span>
													<span></span>
												</div>
											</div>
										) : (
											<>
												<div className="icon">
													<Upload />
												</div>
												<div className="title">Upload Image</div>
												<div className="desc">
													Recommended 2000 x 2000 px
												</div>
											</>
										)}
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											position: 'relative',
											top: '250px',
											flexDirection: 'column',
										}}
									>
										<div className="or">
											<div className="ortext">Or</div>
											<div className="line"></div>
										</div>
										<div className="upload-options">
											<span
												onClick={() =>
													this.setState({
														showImageModal: true,
													})
												}
											>
												Add a Photo from Library
											</span>
										</div>
									</div>
									{this.state.isLogo && (
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
												position: 'relative',
												top: '250px',
											}}
										>
											<div
												onClick={() =>
													this.setState(
														{
															activeImageURL: this.state?.tenantLogo,
														},
														() => {
															this.props.setImage(
																this.state.activeImageURL,
															);
														},
													)
												}
												className="set-logo-div"
											>
												Set Your Logo
											</div>
										</div>
									)}
								</div>
							</>
						)}
					</>
				) : (
					''
				)}
				{this.props.module === 'form' || this.state.activeSection?.type === 'form-q&a' ? (
					this.state.activeTab === 'q' ? (
						<div
							className="block_styles"
							//onClick={(e) => e.preventDefault()}
						>
							<div className="bs-item bs-item-row">
								<b>Question Type</b>
								<div className="padding-items font-items">
									<label
										onClick={(e) => this.toggleQuestionTypeDropDown(e)}
										style={{
											width: '200px',
											display: 'flex',
											alignItems: 'center',
										}}
									>
										{this.state.activeFormBlock !== null
											? _.filter(this.state.questions, {
													value: this.state.activeFormBlock.type,
											  })[0]?.name
											: ''}
									</label>
									{this.state?.showQuestionTypeDropDown ? (
										<div
											className="fonts-dropdown left-top-questions"
											ref={this.qdropdownvariableref}
											style={{
												width: '220px',
											}}
										>
											{_.map(this.state.questions, (question, k) => {
												return (
													<div className="question-row" key={k}>
														<div className="question-icon">
															{question?.icon}
														</div>
														<p
															onClick={(e) => {
																[
																	this.props.setActiveQuestionType(
																		question.value,
																	),
																	this.toggleQuestionTypeDropDown(
																		e,
																	),
																];
															}}
														>
															{question.name}
														</p>
														{this.state?.activeFormBlock?.type ===
															question?.value && (
															<ActiveTick style={{ zoom: 1.5 }} />
														)}
													</div>
												);
											})}
										</div>
									) : (
										''
									)}
								</div>
							</div>

							<div className="bs-item bs-item-row">
								<b>Question is required</b>
								<label className="switch">
									<input
										type="checkbox"
										checked={
											this.state.activeFormBlock !== null
												? this.state.activeFormBlock.isRequired
													? this.state.activeFormBlock.isRequired
													: false
												: false
										}
										onChange={(e) => this.handleFormIsRequired(e)}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							{this.state?.activeFormBlock?.type === 'multipleChoice' &&
							this.state?.activeFormBlock?.answerOptions ? (
								<div className="bs-item bs-item-row">
									<b>Select Multiple Options</b>
									<label className="switch">
										<input
											type="checkbox"
											checked={
												this.state.activeFormBlock !== null
													? this.state?.activeFormBlock?.answerOptions
															?.isMultiple
														? this.state?.activeFormBlock?.answerOptions
																?.isMultiple
														: false
													: false
											}
											onChange={(e) => this.handleFormIsMultiple(e)}
										/>
										<span className="slider-round round"></span>
									</label>
								</div>
							) : (
								''
							)}
							<hr></hr>
							<div className="bs-item bs-item-row">
								<b>Link to a field</b>
							</div>
							<div className="bs-item bs-form-linkto">
								<div className="lt">Link to</div>
								<div className="ltp">
									Client response will be saved and shown in the corresponding
									fields in the contact details
								</div>
								<div className="padding-items font-items">
									{/* <label onClick={(e) => this.toggleVariablesDropDown(e)}>
										{this.returnFormQuestionVariable()}
										<div className="smart-field-input">
											<div className="s-icon">
												<SearchIcon />
											</div>
											<div className="search-container">
												<input
													value={this.state.searchSmartField}
													className="search-input"
													onChange={(e) => {
														this.setState({
															searchSmartField: e.target.value,
														});
													}}
													placeholder="Search variables"
												/>
											</div>
										</div>
									</label> */}
									<label onClick={(e) => this.toggleVariablesDropDown(e)}>
										{this.state.activeFormBlock?.variableId ? (
											<div className="linked-variable-container">
												<span className="linked-variable-name">
													{/* Find and display the linked variable name */}
													{[
														...(this.state?.variables?.custom || []),
														...(this.state.clientInfo || []),
														...(this.state.companyInfo || []),
													].find(
														(v) =>
															v._id ===
															this.state.activeFormBlock.variableId,
													)?.displayName || 'Variable'}
												</span>
											</div>
										) : (
											<div className="no-variable">Select a variable</div>
										)}
									</label>

									{/* 									
									{this.state.showVariablesDropDown ? (
										<div
											className="fonts-dropdown"
											ref={this.dropdownvariableref}
											style={{
												maxHeight: 500,
												overflowY: 'scroll',
											}}
										>
											{_.map(this.state.variables, (variable, k) => {
												return (
													<p
														onClick={(e) => [
															this.props.setActiveQuestionVariable(
																variable._id,
															),
															this.toggleVariablesDropDown(e),
														]}
													>
														{variable.displayName}
													</p>
												);
											})}
										</div>
									) : (
										''
									)} */}
									{this.state.showVariablesDropDown && (
										<div
											className="variable-dropdown form-variable-dropdown "
											ref={this.dropdownvariableref}
										>
											<div className="smart-field-input">
												<div className="s-icon">
													<SearchIcon />
												</div>
												<div className="search-container">
													<input
														value={this.state.searchSmartField}
														className="search-input"
														onChange={(e) => {
															this.setState({
																searchSmartField: e.target.value,
															});
														}}
														placeholder="Search variables"
													/>
												</div>
											</div>
											{/* Smart Field Group */}
											<div className="group-section">
												<div className="group-title">Smart Field Info</div>
												{this.state?.variables?.custom &&
												this.state?.variables?.custom?.length > 0 ? (
													this.state?.variables?.custom
														?.filter(
															(v) =>
																v.templateId ===
																this.state.activeModuleId,
														)
														?.filter(
															(item) =>
																!this.state.searchSmartField ||
																item.displayName
																	?.toLowerCase()
																	.includes(
																		this.state.searchSmartField?.toLowerCase(),
																	),
														)
														.map((variable, index) => (
															<div
																key={index}
																className="variable-item"
																onClick={(e) => {
																	this.props.setActiveQuestionVariable(
																		variable._id,
																	),
																		this.setState({
																			showVariablesDropDown: false,
																		});
																}}
															>
																{variable.displayName}
															</div>
														))
												) : (
													<div className="variable-item">
														No Smart Fields Found
													</div>
												)}
											</div>

											{/* Custom Info Group */}
											<div className="group-section">
												<div className="group-title">Custom Info</div>
												{this.state?.variables?.custom &&
												this.state?.variables?.custom?.length > 0 ? (
													this.state?.variables?.custom
														?.filter(
															(item) =>
																!this.state.searchSmartField ||
																item.displayName
																	?.toLowerCase()
																	.includes(
																		this.state.searchSmartField?.toLowerCase(),
																	),
														)
														.map((variable, index) => (
															<div
																key={index}
																className="variable-item"
																onClick={(e) => {
																	this.props.setActiveQuestionVariable(
																		variable._id,
																	),
																		this.setState({
																			showVariablesDropDown: false,
																		});
																}}
															>
																{variable.displayName}
															</div>
														))
												) : (
													<div className="variable-item">
														No Custom Fields Found
													</div>
												)}
											</div>

											{/* Client Info Group */}
											<div className="group-section">
												<div className="group-title">Client Info</div>
												{this.state.clientInfo &&
												this.state.clientInfo?.length > 0 ? (
													this.state.clientInfo
														?.filter(
															(item) =>
																!this.state.searchSmartField ||
																item.displayName
																	?.toLowerCase()
																	.includes(
																		this.state.searchSmartField?.toLowerCase(),
																	),
														)
														.map((variable, index) => (
															<div
																key={index}
																className="variable-item"
																onClick={(e) => {
																	this.props.setActiveQuestionVariable(
																		variable._id,
																	),
																		this.setState({
																			showVariablesDropDown: false,
																		});
																}}
															>
																{variable.displayName}
															</div>
														))
												) : (
													<div className="variable-item">
														No Client Fields Found
													</div>
												)}
											</div>

											{/* Company Info Group */}
											<div className="group-section">
												<div className="group-title">Company Info</div>
												{this.state.companyInfo &&
												this.state.companyInfo?.length > 0 ? (
													this.state.companyInfo
														?.filter(
															(item) =>
																!this.state.searchSmartField ||
																item.displayName
																	?.toLowerCase()
																	.includes(
																		this.state.searchSmartField?.toLowerCase(),
																	),
														)
														.map((variable, index) => (
															<div
																key={index}
																className="variable-item"
																onClick={(e) => {
																	this.props.setActiveQuestionVariable(
																		variable._id,
																	),
																		this.setState({
																			showVariablesDropDown: false,
																		});
																}}
															>
																{variable.displayName}
															</div>
														))
												) : (
													<div className="variable-item">
														No Company Fields Found
													</div>
												)}
											</div>

											{/* Add Custom Button */}
											{!this.state.isWorkflow && (
												<div
													className="add-custom-button"
													onClick={() =>
														this.setState({ showAddSmartModal: true })
													}
												>
													<PlusCustom /> Add your Custom field
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					) : (
						''
					)
				) : (
					''
				)}
				{this.props.module === 'form' && !this.state.isHeader ? (
					''
				) : this.state.activeTab === 'f' ? (
					<div
						className="block_styles"
						id={'fontsID'}
						onClick={(e) => e.preventDefault()}
					>
						{/* <div className="bs-item bs-item-row">
						<b>Title</b>
						<label class="switch">
							<input type="checkbox" />
							<span class="slider-round round"></span>
						</label>
					</div>
					<div className="bs-item bs-item-row">
						<b>Paragraph</b>
						<label class="switch">
							<input type="checkbox" />
							<span class="slider-round round"></span>
						</label>
					</div>
					<hr></hr> */}

						<div
							className="overlay-options animated-item"
							style={{ padding: '0px' }}
							onClick={() =>
								this.setState({
									showAnimationOptions: !this.state.showAnimationOptions,
								})
							}
						>
							<b>Animations </b>
							<Plus />
						</div>

						{(this.state?.showAnimationOptions ||
							this.state?.activeElementAnimeType) && (
							<div className="show-anime-options" style={{ padding: '0px' }}>
								{this.state?.activeElementAnimeType && (
									<div
										className="active-anime-option"
										onClick={(e) => {
											e.stopPropagation();
											this.handleElementAnimationsType(
												this.state?.activeElementAnimeType,
											);
										}}
									>
										<span>{this.state?.activeElementAnimeType}</span>
										<Plus
											style={{ rotate: '45deg' }}
											onClick={(e) => {
												this.handleRemoveElementAnimations(e);
											}}
										/>
									</div>
								)}
								{this.state?.showAnimationOptions && (
									<div className="anime-options-box">
										<div
											className="anime-options-box-item"
											onClick={() =>
												this.handleElementAnimationsType('hover')
											}
										>
											<span>Hover</span>
											{this.state?.activeElementAnimeType == 'hover' && (
												<ActiveTick />
											)}
										</div>
										<div
											className="anime-options-box-item"
											onClick={() =>
												this.handleElementAnimationsType('press')
											}
										>
											<span>Press</span>
											{this.state?.activeElementAnimeType == 'press' && (
												<ActiveTick />
											)}
										</div>
										<div
											className="anime-options-box-item"
											onClick={() => this.handleElementAnimationsType('loop')}
										>
											<span>Loop</span>
											{this.state?.activeElementAnimeType == 'loop' && (
												<ActiveTick />
											)}
										</div>
									</div>
								)}
							</div>
						)}
						<div className="bs-item">
							<b>Insert Smart Field</b>
							<div className="smart-main-input">
								<div
									onClick={(e) => this.toggleVariablesDropDown(e)}
									className="smart-field-input"
								>
									<div className="s-icon">
										<SearchIcon />
									</div>
									<div className="search-container">
										{this.state.selectedVariables?.length > 0 ? (
											<div className="selected-variables">
												{this.state.selectedVariables.map(
													(variable, index) => (
														<span key={index} className="variable-tag">
															{variable}
														</span>
													),
												)}
											</div>
										) : (
											<input
												value={this.state.searchSmartField}
												className="search-input"
												onChange={(e) => {
													this.setState({
														searchSmartField: e.target.value,
													});
												}}
												placeholder="Search variables"
											/>
										)}
									</div>
								</div>
								<div
									onClick={(e) => this.togglePopupVariable(e)}
									className="ve-input"
								>
									<span className="smart-field">
										{this.state.variableTab === 'smart-info' ? (
											<span>Smart-Info</span>
										) : (
											<></>
										)}
										{this.state.variableTab === 'client-info' ? (
											<span>Client-Info</span>
										) : (
											<></>
										)}
										{this.state.variableTab === 'company-info' ? (
											<span>Company-Info</span>
										) : (
											<></>
										)}
										{this.state.variableTab === 'user-info' ? (
											<span>User-Info</span>
										) : (
											<></>
										)}
										{this.state.variableTab === 'custom-info' ? (
											<span>Custom-Info</span>
										) : (
											<></>
										)}
									</span>
									<span>
										<DropDownIcon />
									</span>
								</div>
							</div>

							{this.state?.showPopUpVariable ? (
								<div
									className="variablePop"
									ref={this.popupvaraibleref}
									style={{ overflowY: 'scroll' }}
								>
									<div
										onClick={(e) => {
											this.handlevariableInfo('smart-info');
										}}
										className="varaiable-info"
									>
										<div>Smart File Info</div>
										{this.state.variableTab === 'smart-info' ? (
											<div>
												<ActiveTick />
											</div>
										) : (
											<></>
										)}
									</div>
									<div
										onClick={(e) => {
											this.handlevariableInfo('client-info');
										}}
										className="varaiable-info"
									>
										<div>Client Info</div>
										{this.state.variableTab === 'client-info' ? (
											<div>
												<ActiveTick />
											</div>
										) : (
											<></>
										)}
									</div>
									<div
										onClick={(e) => {
											this.handlevariableInfo('company-info');
										}}
										className="varaiable-info"
									>
										<div>Company Info</div>
										{this.state.variableTab === 'company-info' ? (
											<div>
												<ActiveTick />
											</div>
										) : (
											<></>
										)}
									</div>
									<div
										onClick={(e) => {
											this.handlevariableInfo('user-info');
										}}
										className="varaiable-info"
									>
										<div>User Info</div>
										{this.state.variableTab === 'user-info' ? (
											<div>
												<ActiveTick />
											</div>
										) : (
											<></>
										)}
									</div>
									<div
										onClick={(e) => {
											this.handlevariableInfo('custom-info');
										}}
										className="varaiable-info"
									>
										<div>Custom Info</div>
										{this.state.variableTab === 'custom-info' ? (
											<div>
												<ActiveTick />
											</div>
										) : (
											<></>
										)}
									</div>
									{/* <hr style={{ margin: '0px' }} />
									<div>
										<div className="icon-hubspot">
											<Hobspot /> <span>Hobspot</span>
										</div>
									</div>
									<div>
										<div>Deals</div>
										<div>
											<div className="not-connect">Connect</div>
										</div>
									</div>
									<div>
										<div>Leads</div>
										<div>
											<div className="not-connect">Connect</div>
										</div>
									</div>
									<div>
										<div>Contact</div>
										<div>
											<div className="connected">Connected</div>
										</div>
									</div>
									<hr style={{ margin: '0px' }} />
									<div>
										<div className="icon-hubspot">
											<HubDeal /> <span>Hubspot Deals</span>
										</div>
									</div>{' '}
									<hr style={{ margin: '0px' }} />
									<div>
										<div className="icon-hubspot">
											<Zoho /> <span>Zoho Leads</span>
										</div>
									</div> */}
								</div>
							) : (
								<></>
							)}

							{this.state.showVariablesDropDown ? (
								<div
									className="variable-dropdown"
									ref={this.dropdownvariableref}
									style={{
										overflowY: 'scroll',
									}}
								>
									<div
										style={{
											overflowY: 'scroll',
										}}
									>
										{/* Smart Field */}
										{this.state.variableTab === 'smart-info' ? (
											<div className="custom-main-div">
												<div className="variable-display">
													Smart Field Info
												</div>

												{_.map(
													this.state.searchSmartField &&
														this.state.searchSmartField.length > 0
														? this.state?.variables?.custom?.filter(
																(variable) =>
																	variable.templateId ===
																		this.props.params
																			.templateID &&
																	variable.displayName
																		?.toLowerCase()
																		.includes(
																			this.state.searchSmartField
																				?.toLowerCase()
																				?.substring(0, 2),
																		),
														  )
														: this.state?.variables?.custom?.filter(
																(variable) =>
																	variable.templateId ===
																	this.state.activeModuleId,
														  ),
													(variable, k) => (
														<div
															key={k}
															className="varaible-info-name"
															onClick={(e) => {
																this.handleVariable(
																	e,
																	variable._id,
																	variable.displayName,
																);

																// Update selected variables without mutating state directly
																this.setState((prevState) => ({
																	selectedVariables: [
																		...(prevState?.selectedVariables ||
																			[]),
																		variable?.displayName,
																	],
																}));
															}}
														>
															<div className="variable-name">
																{variable?.displayName}
															</div>

															<div className="variable-tick">
																{this.state?.selectedVariables?.includes(
																	variable?.displayName,
																) && <ActiveTick />}
															</div>
														</div>
													),
												)}
											</div>
										) : null}

										{/* custom*/}
										{this.state.variableTab === 'custom-info' ? (
											<div className="custom-main-div">
												<div className="variable-display">Custom Info</div>
												{_.map(
													this.state?.searchSmartField &&
														this.state.searchSmartField.length > 0
														? this.state?.variables?.custom?.filter(
																(item) =>
																	item.displayName
																		?.toLowerCase()
																		.includes(
																			this.state.searchSmartField
																				?.toLowerCase()
																				.substring(0, 2),
																		),
														  )
														: this.state?.variables?.custom,

													(variable, k) => {
														{
														}
														return (
															<div
																className="varaible-info-name"
																onClick={(e) => {
																	this.handleVariable(
																		e,
																		variable._id,
																		variable.displayName,
																	);
																	this.setState({
																		selectedVariables: [
																			...(this.state
																				?.selectedVariables ||
																				[]),
																			variable?.displayName,
																		],
																	});
																}}
															>
																<div>{variable?.displayName}</div>

																<div className="variable-tick">
																	{this.state?.selectedVariables?.includes(
																		variable?.displayName || '',
																	) ? (
																		<ActiveTick />
																	) : null}

																	{variable?.displayName !=
																		false &&
																		![
																			'module',
																			'workspace',
																			'Grand Total',
																			'Total',
																		].some((keyword) =>
																			variable?.displayName?.includes(
																				keyword,
																			),
																		) && (
																			<div className="smart-file-options">
																				<Edit
																					style={{
																						cursor: 'pointer',
																					}}
																					onClick={(
																						e,
																					) => {
																						e.stopPropagation();
																						this.handleEditSmartField(
																							variable,
																						);
																					}}
																				/>
																				{!variable?.isRequired &&
																					variable?.workflowId !==
																						this.props
																							.workflow_id && (
																						<Delete
																							style={{
																								cursor: 'pointer',
																							}}
																							onClick={(
																								e,
																							) => {
																								e.stopPropagation();
																								this.deleteSmartField(
																									variable?._id,
																								);
																							}}
																						/>
																					)}
																			</div>
																		)}
																</div>
															</div>
														);
													},
												)}
											</div>
										) : (
											<></>
										)}
										{/*  client info */}

										{this.state.variableTab === 'client-info' ? (
											<div className="smart-field-main-div">
												<div className="variable-display">Client Info</div>
												{_.map(
													this.state?.searchSmartField &&
														this.state.searchSmartField.length > 0
														? this.state.clientInfo.filter((item) =>
																item.displayName
																	?.toLowerCase()
																	.includes(
																		this.state.searchSmartField
																			?.toLowerCase()
																			.substring(0, 2),
																	),
														  )
														: this.state.clientInfo,
													(variable, k) => {
														return (
															<div
																className="varaible-info-name"
																onClick={(e) => {
																	this.handleVariable(
																		e,
																		variable._id,
																		variable.displayName,
																	);
																	this.setState({
																		selectedVariables: [
																			...(this.state
																				?.selectedVariables ||
																				[]),
																			variable?.displayName,
																		],
																	});
																}}
															>
																<div>{variable?.displayName}</div>
																{this.state?.selectedVariables?.includes(
																	variable?.displayName,
																) && (
																	<div>
																		<ActiveTick />
																	</div>
																)}
															</div>
															// <p
															// 	onClick={(e) =>
															// 		this.handleVariable(
															// 			e,
															// 			variable._id,
															// 			variable.displayName,
															// 		)
															// 	}
															// >
															// 	{variable.displayName}
															// </p>
														);
													},
												)}
											</div>
										) : (
											<></>
										)}

										{/* company info */}

										{this.state.variableTab === 'company-info' ? (
											<div className="smart-field-main-div">
												<div className="variable-display">Company Info</div>
												{_.map(
													this.state?.searchSmartField &&
														this.state.searchSmartField.length > 0
														? this.state.companyInfo.filter((item) =>
																item.displayName
																	?.toLowerCase()
																	.includes(
																		this.state.searchSmartField
																			?.toLowerCase()
																			.substring(0, 2),
																	),
														  )
														: this.state.companyInfo,
													(variable, k) => {
														return (
															<div
																className="varaible-info-name"
																onClick={(e) => {
																	this.handleVariable(
																		e,
																		variable._id,
																		variable.displayName,
																	);
																	this.setState({
																		selectedVariables: [
																			...(this.state
																				?.selectedVariables ||
																				[]),
																			variable?.displayName,
																		],
																	});
																}}
															>
																<div>{variable?.displayName}</div>
																{this.state?.selectedVariables?.includes(
																	variable?.displayName,
																) && (
																	<div>
																		<ActiveTick />
																	</div>
																)}
															</div>
															// <p
															// 	onClick={(e) =>
															// 		this.handleVariable(
															// 			e,
															// 			variable._id,
															// 			variable.displayName,
															// 		)
															// 	}
															// >
															// 	{variable.displayName}
															// </p>
														);
													},
												)}
											</div>
										) : (
											<></>
										)}

										{/* user-info */}

										{this.state.variableTab === 'user-info' ? (
											<div className="smart-field-main-div">
												<div className="variable-display">User Info</div>
												{_.map(
													this.state?.searchSmartField &&
														this.state.searchSmartField.length > 0
														? this.state.userInfo.filter((item) =>
																item.displayName
																	?.toLowerCase()
																	.includes(
																		this.state.searchSmartField
																			?.toLowerCase()
																			.substring(0, 2),
																	),
														  )
														: this.state.userInfo,
													(variable, k) => {
														return (
															<div
																className="varaible-info-name"
																onClick={(e) => {
																	this.handleVariable(
																		e,
																		variable._id,
																		variable.displayName,
																	);
																	this.setState({
																		selectedVariables: [
																			...(this.state
																				?.selectedVariables ||
																				[]),
																			variable?.displayName,
																		],
																	});
																}}
															>
																<div>{variable?.displayName}</div>
																{this.state?.selectedVariables?.includes(
																	variable?.displayName,
																) && (
																	<div>
																		<ActiveTick />
																	</div>
																)}
															</div>
															// <p
															// 	onClick={(e) =>
															// 		this.handleVariable(
															// 			e,
															// 			variable._id,
															// 			variable.displayName,
															// 		)
															// 	}
															// >
															// 	{variable.displayName}
															// </p>
														);
													},
												)}
											</div>
										) : (
											<></>
										)}
									</div>

									<div style={{ width: '100%' }}>
										<hr className="variable-divider"></hr>
										<div
											className="add-custom"
											onClick={() => {
												this.setState({
													showAddSmartModal:
														!this.state.showAddSmartModal,
												});
											}}
										>
											<PlusCustom /> Add your Custom field
										</div>
									</div>

									{/* <div
										className="manage-variable"
										onClick={(e) => this.toggleShowVariableModal(e)}
										// style={{
										// 	display: 'flex',
										// 	flexDirection: 'row',
										// 	justifyContent: 'space-between',
										// 	alignItems: 'center',
										// 	position: 'absolute',
										// 	bottom: '0px',
										// 	padding: '5px 22px',
										// 	background: '#242424',
										// 	zIndex: 10,
										// 	width: '100%',
										// 	cursor: 'pointer',
										// }}
									>
										<span className="smart-fields-name">
											Manage Smart Fields
										</span>
										<span>
											<Navigate />
										</span>
									</div> */}
								</div>
							) : (
								<></>
							)}

							{/* <div className="padding-items font-items ">
								<label
									className="sideBarDropDownArrow"
									onClick={(e) => this.toggleVariablesDropDown(e)}
								>
									<p
										style={{
											width: 100,
											overflow: 'hidden',
										}}
									>
										{this.state.activeVariable}
									</p>
									<DropDown />
								</label>

								{this.state.showVariablesDropDown ? (
									<div
										className="fonts-dropdown"
										ref={this.dropdownvariableref}
										style={{
											maxHeight: 500,
											overflowY: 'scroll',
										}}
									>
										<div
											style={{
												maxHeight: 450,
												overflowY: 'scroll',
												paddingBottom: '40px',
											}}
										>
											{_.map(this.state.variables, (variable, k) => {
												return (
													<p
														onClick={(e) =>
															this.handleVariable(
																e,
																variable._id,
																variable.displayName,
															)
														}
													>
														{variable.displayName}
													</p>
												);
											})}
										</div>
										<div
											onClick={(e) => this.toggleShowVariableModal(e)}
											style={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center',
												position: 'absolute',
												bottom: '0px',
												padding: '5px 22px',
												background: '#242424',
												zIndex: 10,
												width: '100%',
												cursor: 'pointer',
											}}
										>
											<b>Manage Smart Fields</b>
											<span>
												<Navigate />
											</span>
										</div>
									</div>
								) : (
									''
								)}
							</div> */}
						</div>
						<hr></hr>

						<div className="bs-item">
							<b>Font</b>
							<div style={{ display: 'flex', gap: 10 }}>
								<div className="padding-items font-items">
									<label
										className="sideBarDropDownArrow"
										onClick={(e) => {
											e.stopPropagation(); // Stop event from bubbling up
											this.toggleFontsDropDown(e);
										}}
									>
										<div>
											{this.state.activeFont
												? this.state.activeFont
												: 'Font Family'}
										</div>

										<DropDown
											style={{
												height: '12px',
												width: '12px',
												rotate:
													this.state.showFontsDropDown === false
														? '0deg'
														: '180deg',
											}}
											className="font-dropdown-icon"
										/>
									</label>
									{this.state.showFontsDropDown ? (
										<>
											<div
												style={{
													top: 100,
													left: 0,
												}}
												className="fonts-dropdown"
												ref={this.dropdownref}
											>
												<div
													style={{
														width: '100%',
														position: 'sticky',
														top: '0px',
														background: '#171717',
														zIndex: 10,
													}}
													className="font-search-container"
												>
													<SearchIcon />
													<input
														className="font-search"
														value={this.state.searchFont}
														onChange={(e) =>
															this.setState({
																searchFont: e.target.value,
															})
														}
														placeholder={'Search Font'}
													/>
												</div>
												{/* <div className='font-group'>
												<div className='group-title'>
													Brand
												</div>
												<div className='brand-fonts'>
													{ this.state.showBrandFonts ? 
														(<div>brand fonts</div>)
													
												:(<div className='add-brand-font'>
													
												+ New font
												</div>)}
													
												</div>
											</div> */}

												{/* {_.map(
												_.orderBy(
													fonts.filter(
														(font) =>
															this.state.searchFont === '' ||
															(this.state.searchFont.length >= 1 &&
																font.fontName
																	?.toLowerCase()
																	.includes(
																		this.state.searchFont?.toLowerCase(),
																	)),
													),
													[(fontF) => fontF.fontName?.toLowerCase()],
													['asc'],
												),
												(font, k) => {
													return (
														<p
															key={k} // Always include a unique key in lists
															onClick={(e) =>
																this.handleFontFamily(e, font.value)
															}
															style={{ fontFamily: font.value }}
														>
															{font.fontName}
														</p>
													);
												},
											)} */}

												{(() => {
													const searchFiltered = fonts.filter(
														(font) =>
															this.state.searchFont === '' ||
															font.fontName
																?.toLowerCase()
																.includes(
																	this.state.searchFont?.toLowerCase(),
																),
													);

													// Group fonts by their 'group' property
													let groupedFonts = _.groupBy(
														searchFiltered,
														'group',
													);

													return Object.entries(groupedFonts).map(
														([groupName, groupFonts]) => (
															<div
																key={groupName}
																className="font-group"
															>
																<div className="group-title">
																	{groupName}
																</div>
																<div className="group-fonts">
																	{_.orderBy(
																		_.uniqBy(
																			groupFonts,
																			(font) =>
																				font.fontName?.toLowerCase(),
																		),
																		[
																			(font) =>
																				font.fontName?.toLowerCase(),
																		],
																		['asc'],
																	).map((font, k) => (
																		<div
																			className="font-item"
																			style={{
																				display: 'flex',
																				alignItems:
																					'center',
																				justifyContent:
																					'space-between',
																			}}
																		>
																			<p
																				key={k}
																				onClick={(e) =>
																					this.handleFontFamily(
																						e,
																						font.value,
																					)
																				}
																				style={{
																					fontFamily:
																						font?.value,
																				}}
																				// className={`font-item ${this.state.selectedFont === font.value ? 'active' : ''}`}
																			>
																				{font.fontName}
																			</p>
																			{this.state
																				.activeFont ==
																				font?.value && (
																				<ActiveTick />
																			)}
																		</div>
																	))}
																</div>
															</div>
														),
													);
												})()}
											</div>
										</>
									) : (
										''
									)}
								</div>
								<div className="padding-items font-items">
									<label
										className="sideBarDropDownArrow"
										onClick={(e) => {
											e.stopPropagation(); // Stop event from bubbling up
											this.toggleFontsVariantDropDown(e);
										}}
									>
										<div>
											{this.state.activeFontVariant
												? this.state.activeFontVariant
												: 'Weights'}
										</div>

										<DropDown
											style={{
												height: '12px',
												width: '12px',
												rotate:
													this.state.showFontsVariantDropDown === false
														? '0deg'
														: '180deg',
											}}
											className="font-dropdown-icon"
										/>
									</label>

									{this.state.showFontsVariantDropDown ? (
										<div
											className="fonts-dropdown font-variant-dropdown"
											ref={this.dropdownfontref}
											style={{
												top: 100,
												left: 0,
											}}
										>
											{this.state?.fonts?.map((font, key) => {
												if (
													this.state?.activeFont
														?.toLowerCase()
														?.includes(font?.value?.toLowerCase()) ||
													this.state?.activeFont
														?.toLowerCase()
														?.includes(font?.fontName?.toLowerCase())
												) {
													return (
														<>
															{font.variants.length >= 1 ? (
																_.map(
																	font.variants,
																	(variant, k) => {
																		return (
																			<p
																				className="font-variant-item"
																				key={k}
																				onClick={(e) =>
																					this.handleFontFamilyWeight(
																						e,
																						variant,
																					)
																				}
																			>
																				{variant?.variant ||
																					'Regular'}
																			</p>
																		);
																	},
																)
															) : (
																<p>No weights</p>
															)}
														</>
													);
												}
												// Corrected else case
												return null; // Return null for non-matching fonts
											})}
											{/* {this.state?.fonts?.map((font, key) => {
  const activeFont = this.state?.activeFont?.toLowerCase();
  const fontValue = font?.value?.toLowerCase();
  const fontName = font?.fontName?.toLowerCase();

  // Split activeFont into words
  const activeFontWords = activeFont?.split(' ');

  // Check if all words in activeFont exist in fontValue or fontName
  const isActiveFont =
    activeFontWords.every((word) => fontValue?.includes(word)) ||
    activeFontWords.every((word) => fontName?.includes(word));

  if (isActiveFont) {
    return (
      <div key={key}>
        {font.variants.length > 0 ? (
          font.variants.map((variant, k) => (
            <p
              className="font-variant-item"
              key={k}
              onClick={(e) => this.handleFontFamilyWeight(e, variant)}
            >
              {variant?.variant || 'Regular'}
            </p>
          ))
        ) : (
          <p>No weights</p>
        )}
      </div>
    );
  }

  // Return null for non-matching fonts
  return null;
})} */}

											{/* Show "No Weights" once after the map if no matching font was found */}
											{!this.state.fonts?.some(
												(font) =>
													font?.value?.toLowerCase() ===
														this.state.activeFont?.toLowerCase() ||
													font?.fontName?.toLowerCase() ===
														this.state.activeFont?.toLowerCase(),
											) && (
												<div>
													<p className="font-variant-item">No Weights</p>
												</div>
											)}
											{/* {_.map(
    _.filter(this.state.fonts, {
        fontName: this.state.activeFont,
    })[0]?.variants,
    (font, k) => {
        return (
            <p
                key={k}
                className={this.state.activeWeight === font.variant ? 'active' : ''}
                onClick={() => this.handleFontFamilyWeight(font)}
            >
                {font.variant}
            </p>
        );
    }
)} */}
										</div>
									) : (
										''
									)}
								</div>
							</div>
						</div>
						<div className="bs-item" style={{ position: 'relative' }}>
							<b>Size</b>
							<div className="bg-item">
								<div
									style={{
										display: 'flex',
										maxWidth: 230,
										marginLeft: 6,
									}}
								>
									<input
										type="range"
										min={8}
										max={200}
										step={1}
										//defaultValue={this.state.fontSize}
										value={this.state.fontSize}
										onChange={(e) => this.handleFontSize(e.target.value, true)}
									/>
								</div>
								<p>
									<input
										//defaultValue={this.state.fontSize}
										value={this.state.fontSize}
										onChange={(e) => this.handleFontSize(e.target.value)}
										onBlur={(e) => this.handleSendFontSize(e)}
										style={{
											width: 50,
											background: 'transparent',
											border: '1px solid #9b9290',
											color: '#9b9290',
										}}
									/>
								</p>
								{/* <input
									value={this.state.fontSize}
									onChange={(e) => this.handleFontSizeInput(e)}
									style={{
										userSelect: 'none',
									}}
								/> */}
							</div>
						</div>

						<ColorPicker
							title={'Color'}
							color={this.state.fontColor}
							handleColor={(e) => this.handleFontColor(e)}
							type={'font'}
							brandColors={this.state?.brandColors}
							addBrandColors={(e) => this.props?.addBrandColors(e)}
						/>
						<div className="bs-item">
							<b>Align</b>
							<div className="padding-items justify-items">
								<span
									onClick={(e) => this.changeTextAlign(e, 'justifyleft')}
									className={`tooltip ${this.state.justifyleft ? 'active' : ''}`}
								>
									<Left />
								</span>
								<span
									onClick={(e) => this.changeTextAlign(e, 'justifycenter')}
									className={`tooltip ${
										this.state.justifycenter ? 'active' : ''
									}`}
								>
									<Center />
								</span>

								<span
									onClick={(e) => this.changeTextAlign(e, 'justifyright')}
									className={`tooltip ${this.state.justifyright ? 'active' : ''}`}
								>
									<Right />
								</span>
								<span
									onClick={(e) => this.changeTextAlign(e, 'justifyfull')}
									className={`tooltip ${this.state.justifyfull ? 'active' : ''}`}
								>
									<Justify />
								</span>
							</div>
						</div>

						{/* <div className="bs-item">
							<b>Case</b>
							<div className="padding-items">
								<span
									onClick={(e) =>
										this.props.changeFontColor(
											'changeCase',
											'uppercase'
										)
									}
								>
									AA
								</span>
								<span
									onClick={(e) =>
										this.props.changeFontColor(
											'capitalize',
											'important'
										)
									}
									style={{ textTransform: 'capitalize' }}
								>
									Aa
								</span>

								<span
									onClick={(e) =>
										this.props.changeFontColor(
											'lowercase',
											'important'
										)
									}
									style={{ textTransform: 'lowercase' }}
								>
									aa
								</span>
								<span>-</span>
							</div>
						</div> */}

						<div className="bs-item">
							<b>Spacing</b>
						</div>

						<div className="bs-item" style={{ position: 'relative' }}>
							<b>Line Height</b>
							<div className="bg-item">
								<div
									style={{
										display: 'flex',
										maxWidth: 230,
										marginLeft: 6,
									}}
								>
									<input
										type="range"
										min={1}
										max={5}
										step={0.1}
										defaultValue={this.state.lineHeight}
										value={this.state.lineHeight}
										onChange={(e) => this.handleFontLineHeight(e.target.value)}
									/>
								</div>
								<p>{this.state.lineHeight}</p>
							</div>
						</div>

						<div className="bs-item" style={{ position: 'relative' }}>
							<b>Letter Spacing</b>
							<div className="bg-item">
								<div
									style={{
										display: 'flex',
										maxWidth: 230,
										marginLeft: 6,
									}}
								>
									<input
										type="range"
										min={0.1}
										max={10}
										step={0.1}
										defaultValue={this.state.letterSpacing}
										value={this.state.letterSpacing}
										onChange={(e) =>
											this.handleFontLetterSpacing(e.target.value)
										}
									/>
								</div>
								<p>{this.state.letterSpacing}</p>
							</div>
						</div>
					</div>
				) : (
					''
				)}

				{this.state.activeTab === 'bt' ? (
					<div>
						<div style={{ overflowY: 'scroll', height: '80vh' }} className="bt_styles">
							<div
								className="overlay-options animated-item"
								style={{ padding: '0px 24px' }}
								onClick={() =>
									this.setState({
										showAnimationOptions: !this.state.showAnimationOptions,
									})
								}
							>
								<b>Animations </b>
								<Plus />
							</div>

							{(this.state?.showAnimationOptions ||
								this.state?.activeElementAnimeType) && (
								<div className="show-anime-options" style={{ padding: '0px 24px' }}>
									{this.state?.activeElementAnimeType && (
										<div
											className="active-anime-option"
											onClick={(e) => {
												e.stopPropagation();
												this.handleElementAnimationsType(
													this.state?.activeElementAnimeType,
												);
											}}
										>
											<span>{this.state?.activeElementAnimeType}</span>
											<Plus
												style={{ rotate: '45deg' }}
												onClick={(e) => {
													this.handleRemoveElementAnimations(e);
												}}
											/>
										</div>
									)}
									{this.state?.showAnimationOptions && (
										<div className="anime-options-box">
											<div
												className="anime-options-box-item"
												onClick={() =>
													this.handleElementAnimationsType('hover')
												}
											>
												<span>Hover</span>
												{this.state?.activeElementAnimeType == 'hover' && (
													<ActiveTick />
												)}
											</div>
											<div
												className="anime-options-box-item"
												onClick={() =>
													this.handleElementAnimationsType('press')
												}
											>
												<span>Press</span>
												{this.state?.activeElementAnimeType == 'press' && (
													<ActiveTick />
												)}
											</div>
											<div
												className="anime-options-box-item"
												onClick={() =>
													this.handleElementAnimationsType('loop')
												}
											>
												<span>Loop</span>
												{this.state?.activeElementAnimeType == 'loop' && (
													<ActiveTick />
												)}
											</div>
										</div>
									)}
								</div>
							)}

							{/* {this.state.activeSection?.blocks[0]?.subBlocks?.find(subBlock => subBlock.linkto) ? */}
							<div className="link-container">
								<div className="input-link">
									<input
										placeholder="Link"
										type="text"
										value={this.state.buttonLink}
										onChange={(e) =>
											this.setState({
												buttonLink: e.target.value,
											})
										}
									/>
									<button
										type="submit"
										onClick={() => this.handleButton(this.state.buttonLink)}
									>
										Link
									</button>
								</div>
								<div className="link-pages">
									<div
										className="link-page-title"
										style={{ cursor: 'pointer', padding: '10px' }}
										onClick={() =>
											this.setState({
												pageDropdown: !this.state.pageDropdown,
											})
										}
									>
										Link to pages
									</div>

									{this.state.pageDropdown && (
										<div className="link-module-pages-container">
											{this.state.modules?.map((module) => (
												<div
													className="link-module-pages"
													style={{
														cursor: 'pointer',
														padding: '10px',
														textTransform: 'capitalize',
													}}
													onClick={() =>
														this.handlePageId('page', module?._id)
													}
												>
													{module?.label}
												</div>
											))}
										</div>
									)}
								</div>

								<div className="link-sections">
									<div
										className="link-section-title"
										style={{ cursor: 'pointer', padding: '10px' }}
										onClick={() =>
											this.setState({
												sectionDropdown: !this.state.sectionDropdown,
											})
										}
									>
										Link to sections
									</div>
									{this.state.sectionDropdown && (
										<div className="link-section-pages-container">
											{this.state.sections?.map((section, index) => (
												<div
													className="link-section-pages"
													style={{ cursor: 'pointer' }}
													onClick={() =>
														this.handlePageId('section', section?._id)
													}
												>
													{`Section - ${index + 1}`}
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							<div className="Opn-new-tab">
								<b>Open in New Tab</b>
								<label class="switch">
									<input
										type="checkbox"
										onChange={(e) => this.handleOpenNewTab(e)}
										checked={this.state.openNewTab?.isOpen}
									/>

									<span class="slider-round round"></span>
								</label>
							</div>
							<div className="bt-shapes">
								<b>Styles</b>
								<div className="bt-shape-container">
									{this.state.buttonShape &&
										_.map(this.state.buttonShape, (shape) => (
											<div
												key={shape.name}
												style={shape.styles}
												className={
													shape.name === this.state.btShape
														? 'activeButton'
														: ''
												}
												onClick={() => this.handleButtonShape(shape.name)}
											></div>
										))}
								</div>
							</div>

							<ColorPicker
								title={'Fill'}
								color={this.state?.buttonStyle?.background}
								handleColor={(e) => this.handleButtonStyles(e, 'background')}
								brandColors={this.state?.brandColors}
							/>

							<ColorPicker
								title={'Border Color'}
								color={this.state?.buttonStyle?.borderColor}
								handleColor={(e) => this.handleButtonStyles(e, 'borderColor')}
								brandColors={this.state?.brandColors}
							/>

							<div className="bs-item" style={{ position: 'relative' }}>
								<b>Border Width</b>
								<div className="bg-item">
									<div
										style={{
											display: 'flex',
											maxWidth: 230,
											marginLeft: 6,
										}}
									>
										<input
											type="range"
											min={1}
											max={100}
											step={1}
											//defaultValue={this.state.fontSize}
											value={this.state?.buttonStyle?.borderWidth}
											onChange={(e) =>
												this.handleButtonStyles(
													e.target.value,
													'borderWidth',
												)
											}
										/>
									</div>
									<p>{this.state?.buttonStyle?.borderWidth}</p>
								</div>
							</div>
						</div>
					</div>
				) : (
					''
				)}
				{this.state.activeTab === 'fi' && (
					<div className="bt_styles ">
						<div className="footer-icons animated-item">
							<b>Styles</b>
							<div className="icons animated-item">
								<span
									className={
										this.state.currentIconType === 'normal' ? 'active' : 'no-bg'
									}
									onClick={(e) => this.setIconStyle('normal')}
								>
									<Instagram />
								</span>
								<span
									className={
										this.state?.currentIconType === 'bordered'
											? 'active'
											: 'br-radius'
									}
									onClick={(e) => this.setIconStyle('bordered')}
								>
									<InstagramBorder />
								</span>
								<span
									className={
										this.state?.currentIconType === 'filled'
											? 'activebg'
											: 'bg-color'
									}
									onClick={(e) => this.setIconStyle('filled')}
								>
									<InstagramBackground />
								</span>
							</div>
						</div>
						<div className="animated-item ani-flex-col">
							<div className="divider animated-item"></div>

							<ColorPicker
								className="animated-item"
								title={'Icon Color'}
								color={this.state?.currentIconColor}
								handleColor={(e) => this.handleIconColor(e)}
								brandColors={this.state?.brandColors}
							/>
						</div>
						{this.state?.currentIconType === 'filled' && (
							<div className="animated-item ani-flex-col">
								<div className="divider animated-item"></div>
								<ColorPicker
									title={'Icon Background Color'}
									color={this.state?.currentIconBgColor}
									handleColor={(e) => this.handleIconBgColor(e)}
									brandColors={this.state?.brandColors}
								/>
							</div>
						)}
						<div className="divider animated-item"></div>

						<div className="size animated-item">
							<b>Size</b>
							<div className="size-icons">
								<span
									className={
										this.state.currentSizeIcons === 'small' ? 'active' : ''
									}
									onClick={(e) => this.setIconSize('small')}
								>
									S
								</span>
								<span
									className={
										this.state.currentSizeIcons === 'medium' ? 'active' : ''
									}
									onClick={(e) => this.setIconSize('medium')}
								>
									M
								</span>
								<span
									className={
										this.state.currentSizeIcons === 'large' ? 'active' : ''
									}
									onClick={(e) => this.setIconSize('large')}
								>
									L
								</span>
							</div>
						</div>

						<div className="divider animated-item"></div>
						{_.has(this.state.activeSection, 'isFluidSection') && (
							<>
								<div className="position animated-item">
									<b>Icon</b>
								</div>
								<select
									style={{
										width: '100%',
										backgroundColor: '#fff',
										borderRadius: '5px',
										padding: '10px',
									}}
									value={
										_.filter(this.state.activeSection?.blocks[0].subBlocks, {
											_id: this.state.activeSubBlockID,
										})[0]?.iconName
									}
									onChange={(e) => this.handleIconName(e.target.value)}
								>
									<option value="Behance">Behance</option>
									<option value="Facebook">Facebook</option>
									<option value="Instagram">Instagram</option>
									<option value="Linkedin">Linkedin</option>
									<option value="Pinterest">Pinterest</option>
									<option value="RoundedFacebook">Rounded Facebook</option>
									<option value="Spotify">Spotify</option>
									<option value="Steam">Steam</option>
									<option value="Telegram">Telegram</option>
									<option value="Tiktok">Tiktok</option>
									<option value="Twitter">Twitter</option>
									<option value="X">X</option>
									<option value="Youtube">Youtube</option>
									<option value="website">Website</option>
								</select>
							</>
						)}
						{_.has(this.state.activeSection?.style, 'iconsAlign') && (
							<div className="position animated-item">
								<b>Position</b>
								<div className="position-icons">
									<span
										className={
											this.state.activeSection?.style?.iconsAlign ===
											'flex-start'
												? 'activePosition'
												: ''
										}
										onClick={(e) => this.setFooterIconPosition('flex-start')}
									>
										<PositionRight />
									</span>
									<span
										className={
											this.state.activeSection?.style?.iconsAlign === 'center'
												? 'activePosition'
												: ''
										}
										onClick={(e) => this.setFooterIconPosition('center')}
									>
										<PositionCenter />
									</span>
									<span
										className={
											this.state.activeSection?.style?.iconsAlign ===
											'flex-end'
												? 'activePosition'
												: ''
										}
										onClick={(e) => this.setFooterIconPosition('flex-end')}
									>
										<PositionLeft />
									</span>
								</div>
							</div>
						)}
						{/* {  && } */}
						<div className="divider animated-item"></div>
						{_.has(this.state.activeSection?.style, 'gap') &&
							_.has(this.state.activeSection?.style, 'iconsAlign') && (
								<div className="spacing animated-item">
									<b>Spacing</b>
									<div className="bg-item">
										<div
											style={{
												display: 'flex',
												maxWidth: 230,
												marginLeft: 6,
											}}
										>
											<input
												type="range"
												min={1}
												max={50}
												step={1}
												value={this.state.activeSection?.style?.gap}
												onChange={(e) =>
													this.handleFooterSpacing(e.target.value)
												}
											/>
										</div>
										<p>{this.state.activeSection?.style?.gap}</p>
									</div>
								</div>
							)}
					</div>
				)}

				{/* stciker */}
				{this.state.activeTab === 'sticker' ? (
					<div className="bt_styles">
						<div
							className="overlay-options animated-item"
							style={{ padding: '0px' }}
							onClick={() =>
								this.setState({
									showAnimationOptions: !this.state.showAnimationOptions,
								})
							}
						>
							<b>Animations </b>
							<Plus />
						</div>

						{(this.state?.showAnimationOptions ||
							this.state?.activeElementAnimeType) && (
							<div className="show-anime-options" style={{ padding: '0px' }}>
								{this.state?.activeElementAnimeType && (
									<div
										className="active-anime-option"
										onClick={(e) => {
											e.stopPropagation();
											this.handleElementAnimationsType(
												this.state?.activeElementAnimeType,
											);
										}}
									>
										<span>{this.state?.activeElementAnimeType}</span>
										<Plus
											style={{ rotate: '45deg' }}
											onClick={(e) => {
												this.handleRemoveElementAnimations(e);
											}}
										/>
									</div>
								)}
								{this.state?.showAnimationOptions && (
									<div className="anime-options-box">
										<div
											className="anime-options-box-item"
											onClick={() =>
												this.handleElementAnimationsType('hover')
											}
										>
											<span>Hover</span>
											{this.state?.activeElementAnimeType == 'hover' && (
												<ActiveTick />
											)}
										</div>
										<div
											className="anime-options-box-item"
											onClick={() =>
												this.handleElementAnimationsType('press')
											}
										>
											<span>Press</span>
											{this.state?.activeElementAnimeType == 'press' && (
												<ActiveTick />
											)}
										</div>
										<div
											className="anime-options-box-item"
											onClick={() => this.handleElementAnimationsType('loop')}
										>
											<span>Loop</span>
											{this.state?.activeElementAnimeType == 'loop' && (
												<ActiveTick />
											)}
										</div>
									</div>
								)}
							</div>
						)}

						<div className="sticker">
							<b>Styles</b>
							<div className="sticker-icons">
								{!_.has(this.state.activeSection, 'isFluidSection')
									? this.state.stickers?.map((sticker) => {
											const isActive =
												this.state.activeSection?.stickerShape ===
												sticker.name;
											return (
												<span
													key={sticker.name}
													className={isActive ? 'activeSticker' : ''}
													onClick={() =>
														this.setStickerShape(sticker.name)
													}
												>
													{sticker.element}
												</span>
											);
									  })
									: this.state.fluidShapes?.map((sticker) => {
											const isActive =
												this.state.activeSection?.stickerShape ===
												sticker.name;
											return (
												<span
													key={sticker.name}
													className={isActive ? 'activeSticker' : ''}
													onClick={() =>
														this.setStickerShape(sticker.name)
													}
												>
													{sticker.element}
												</span>
											);
									  })}
							</div>
						</div>
						<div className="divider"></div>
						<div
							className=" bs-item bs-item-row animated-item"
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<b style={{ textTransform: 'capitalize' }}>Stretch</b>
							<label className="switch">
								<input
									type="checkbox"
									onChange={(e) =>
										this.handleStickerStretch('stretch', e.target.checked)
									}
									checked={activeSubBlock?.stretch}
								/>
								<span className="slider-round round"></span>
							</label>
						</div>

						{_.has(this.state.activeSection, 'isFluidSection') ? (
							<>
								<div className="divider"></div>

								<div className="bg-item">
									<b>Opacity</b>
									<div
										className="inputSlider"
										style={{
											display: 'flex',
											maxWidth: 230,
											marginLeft: 6,
											width: '100%',
										}}
									>
										<input
											type="range"
											min={0}
											max={1}
											step={0.1}
											defaultValue={this.state?.circleTextData?.radius}
											value={this.state?.circleTextData?.radius}
											onChange={(e) =>
												this.handleStickerFill(e.target.value, 'opacity')
											}
										/>
										{/* <p>{this.state?.circleTextData?.radius}</p> */}
									</div>
								</div>
							</>
						) : (
							''
						)}
						<div className="divider"></div>

						<ColorPicker
							title={'Fill Color'}
							color={this.state?.activeSection?.style?.stickerFill}
							handleColor={(e) => this.handleStickerFill(e, 'stickerFill')}
							brandColors={this.state?.brandColors}
							openToTop={true}
						/>

						<div className="divider"></div>

						<ColorPicker
							title={'Border Color'}
							color={this.state?.activeSection?.style?.stickerStroke}
							handleColor={(e) => this.handleStickerFill(e, 'stickerStroke')}
							brandColors={this.state?.brandColors}
							openToTop={true}
						/>
					</div>
				) : (
					''
				)}

				{this.state.activeTab === 'Ct' ? (
					<div className="bt_styles">
						<div
							className="overlay-options animated-item"
							style={{ padding: '0px' }}
							onClick={() =>
								this.setState({
									showAnimationOptions: !this.state.showAnimationOptions,
								})
							}
						>
							<b>Animations </b>
							<Plus />
						</div>

						{(this.state?.showAnimationOptions ||
							this.state?.activeElementAnimeType) && (
							<div className="show-anime-options" style={{ padding: '0px' }}>
								{this.state?.activeElementAnimeType && (
									<div
										className="active-anime-option"
										onClick={(e) => {
											e.stopPropagation();
											this.handleElementAnimationsType(
												this.state?.activeElementAnimeType,
											);
										}}
									>
										<span>{this.state?.activeElementAnimeType}</span>
										<Plus
											style={{ rotate: '45deg' }}
											onClick={(e) => {
												this.handleRemoveElementAnimations(e);
											}}
										/>
									</div>
								)}
								{this.state?.showAnimationOptions && (
									<div className="anime-options-box">
										<div
											className="anime-options-box-item"
											onClick={() =>
												this.handleElementAnimationsType('hover')
											}
										>
											<span>Hover</span>
											{this.state?.activeElementAnimeType == 'hover' && (
												<ActiveTick />
											)}
										</div>
										<div
											className="anime-options-box-item"
											onClick={() =>
												this.handleElementAnimationsType('press')
											}
										>
											<span>Press</span>
											{this.state?.activeElementAnimeType == 'press' && (
												<ActiveTick />
											)}
										</div>
										<div
											className="anime-options-box-item"
											onClick={() => this.handleElementAnimationsType('loop')}
										>
											<span>Loop</span>
											{this.state?.activeElementAnimeType == 'loop' && (
												<ActiveTick />
											)}
										</div>
									</div>
								)}
							</div>
						)}
						<b>Element</b>
						<p style={{ color: '#939393', fontSize: '12px' }}>Maximum 30 letters.</p>
						<div className="input-link">
							<input
								placeHolder="Enter your text"
								value={this.state?.circleTextData?.text}
								onChange={(e) => this.handleCircleTextChanges(e, 'text')}
								maxLength={30}
							/>
						</div>
						<ColorPicker
							title={'Color'}
							color={this.state.circleTextData?.style?.color}
							handleColor={(e) => this.handleCircleTextChanges(e, 'color')}
							brandColors={this.state?.brandColors}
						/>
						<div className="bg-item">
							<b>Radius</b>
							<div
								className="inputSlider"
								style={{
									display: 'flex',
									maxWidth: 230,
									marginLeft: 6,
									width: '100%',
								}}
							>
								<input
									type="range"
									min={0}
									max={100}
									step={1}
									defaultValue={this.state?.circleTextData?.radius}
									value={this.state?.circleTextData?.radius}
									onChange={(e) =>
										this.handleCircleTextChanges(e.target.value, 'radius')
									}
								/>
								{/* <p>{this.state?.circleTextData?.radius}</p> */}
							</div>
						</div>
						{/* <div className="bg-item">
							<b>Width</b>
							<div
								className="inputSlider"
								style={{
									display: 'flex',
									maxWidth: 230,
									marginLeft: 6,
									width: '100%',
								}}
							>
								<input
									type="range"
									min={0}
									max={500}
									step={1}
									defaultValue={this.state?.circleTextData?.width}
									value={this.state?.circleTextData?.width}
									onChange={(e) =>
										this.handleCircleTextChanges(e.target.value, 'width')
									}
								/>
								
							</div>
						</div> */}
					</div>
				) : (
					''
				)}
				{this.props.module === 'proposal' && this.state.activeTab === 'at' ? (
					<>
						{/* <div className="block_styles">
						<div
							className="bs-item bs-item-row animated-item animationContainer"
							style={{ cursor: 'pointer' }}
							onClick={() =>
								this.setState({
									showAnimationContainer: !this.state.showAnimationContainer,
								})
							}
						>
							<b className="">Animation option</b>
							<div
								className={
									this.state.showAnimationContainer ? 'arrowContainer' : ''
								}
							>
								<DropDown />
							</div>
						</div>
						{this.state.showAnimationContainer ? (
							<div className="animation-options">
								{[
									{ id: 'none', label: 'No animation' },
									{ id: 'bySection', label: 'Animation by section' },
									{ id: 'together', label: 'Animate together' },
								].map((option, index) => (
									<div key={option.id} className="animation-option">
										<input
											className="animation-option-input"
											type="radio"
											name="animationOption"
											style={{ cursor: 'pointer' }}
											checked={this.state.activeAnimation === index}
											onChange={() =>
												this.setAnimationOption(option.id, index)
											}
										/>
										<label
											className="radio-container"
											style={{
												color:
													this.state.activeAnimation === index
														? '#6055ec'
														: '#fff',
												fontFamily: 'Inter',
												fontSize: '14px',
											}}
										>
											{option.label}
										</label>
									</div>
								))}
								<hr className="animated-item"></hr>
								<div className="bs-item">
									<b>Styles</b>
									<div className="animation-styles">
										<div
											className={
												this.state.animationType === 'fadeIn'
													? 'active'
													: ''
											}
											onClick={() => this.handleAnimation('fadeIn')}
										>
											<FadeIn />
										</div>
										<div
											className={
												this.state.animationType === 'slideIn'
													? 'active'
													: ''
											}
											onClick={() => this.handleAnimation('slideIn')}
										>
											<SlideIn />
										</div>
									</div>
								</div>
								<hr className="animated-item"></hr>
								{this.state.animationType === 'slideIn' ? (
									<>
										<div className="bs-item">
											<b>Direction</b>
											<div className="directionContainer">
												{[
													{
														name: 'left',
														icon: <DirectionLeft />,
													},
													{
														name: 'right',
														icon: <DirectionRight />,
													},
													{ name: 'top', icon: <DirectionTop /> },
													{
														name: 'bottom',
														icon: <DirectionBottom />,
													},
												].map((icon, index) => (
													<p
														key={index}
														onClick={() =>
															this.handleAnimationDirection(icon.name)
														}
														className={
															this.state.animationDirection ===
															icon.name
																? 'active'
																: ''
														}
													>
														{icon.icon}
													</p>
												))}
											</div>
										</div>
										<hr className="animated-item"></hr>
									</>
								) : (
									''
								)}
								<div className="bs-item">
									<b>Speed</b>
									<div className="speedContainer">
										<p
											onClick={() => this.handleAnimationSpeed('slow')}
											className={
												this.state.animationSpeed === 'slow' ? 'active' : ''
											}
										>
											Slow
										</p>
										<p
											onClick={() => this.handleAnimationSpeed('medium')}
											className={
												this.state.animationSpeed === 'medium'
													? 'active'
													: ''
											}
										>
											Medium
										</p>
										<p
											onClick={() => this.handleAnimationSpeed('fast')}
											className={
												this.state.animationSpeed === 'fast' ? 'active' : ''
											}
										>
											Fast
										</p>
									</div>
								</div>
							</div>
						) : (
							''
						)}
						<hr className="animated-item"></hr>
					</div> */}
					</>
				) : (
					''
				)}

				{/* list icons Abdullah */}
				{this.state.activeTab === 'li' && (
					<div className="bt_styles">
						<div className="list-icons">
							<b>Shape</b>
							<div className="icons">
								{this.state.listIconShapes &&
									this.state.listIconShapes.map((icon) => (
										<span
											className={
												this.state.activeSection?.shape === icon.name
													? 'active'
													: ''
											}
											onClick={(e) => this.setListIconShape(icon.name)}
										>
											{icon.element}
										</span>
									))}
							</div>
						</div>
						<div className="divider"></div>

						<div className="size">
							<b>Size</b>
							<div className="size-icons">
								<span
									className={
										this.state?.activeSection?.size === 'small' ? 'active' : ''
									}
									onClick={(e) => this.setListIconSize('small')}
								>
									S
								</span>
								<span
									className={
										this.state?.activeSection?.size === 'medium' ? 'active' : ''
									}
									onClick={(e) => this.setListIconSize('medium')}
								>
									M
								</span>
								<span
									className={
										this.state?.activeSection?.size === 'large' ? 'active' : ''
									}
									onClick={(e) => this.setListIconSize('large')}
								>
									L
								</span>
								{this.state?.largeIcon && (
									<>
										<span
											className={
												this.state?.activeSection?.size === 'xlarge'
													? 'active'
													: ''
											}
											onClick={(e) => this.setListIconSize('xlarge')}
										>
											XL
										</span>
										<span
											className={
												this.state?.activeSection?.size === 'xxlarge'
													? 'active'
													: ''
											}
											onClick={(e) => this.setListIconSize('xxlarge')}
										>
											XXL
										</span>
									</>
								)}
							</div>
						</div>

						<div className="divider"></div>

						<ColorPicker
							title={'Color'}
							color={this.state?.activeSection?.color}
							handleColor={(e) => this.setListIconColor(e)}
							brandColors={this.state?.brandColors}
						/>
					</div>
				)}

				{/* logo sticker Abdullah */}
				{this.state.activeTab === 'ls' ? (
					<div className="bt_styles">
						<div
							className="overlay-options animated-item"
							style={{ padding: '0px' }}
							onClick={() =>
								this.setState({
									showAnimationOptions: !this.state.showAnimationOptions,
								})
							}
						>
							<b>Animations </b>
							<Plus />
						</div>

						{(this.state?.showAnimationOptions ||
							this.state?.activeElementAnimeType) && (
							<div className="show-anime-options" style={{ padding: '0px' }}>
								{this.state?.activeElementAnimeType && (
									<div
										className="active-anime-option"
										onClick={(e) => {
											e.stopPropagation();
											this.handleElementAnimationsType(
												this.state?.activeElementAnimeType,
											);
										}}
									>
										<span>{this.state?.activeElementAnimeType}</span>
										<Plus
											style={{ rotate: '45deg' }}
											onClick={(e) => {
												this.handleRemoveElementAnimations(e);
											}}
										/>
									</div>
								)}
								{this.state?.showAnimationOptions && (
									<div className="anime-options-box">
										<div
											className="anime-options-box-item"
											onClick={() =>
												this.handleElementAnimationsType('hover')
											}
										>
											<span>Hover</span>
											{this.state?.activeElementAnimeType == 'hover' && (
												<ActiveTick />
											)}
										</div>
										<div
											className="anime-options-box-item"
											onClick={() =>
												this.handleElementAnimationsType('press')
											}
										>
											<span>Press</span>
											{this.state?.activeElementAnimeType == 'press' && (
												<ActiveTick />
											)}
										</div>
										<div
											className="anime-options-box-item"
											onClick={() => this.handleElementAnimationsType('loop')}
										>
											<span>Loop</span>
											{this.state?.activeElementAnimeType == 'loop' && (
												<ActiveTick />
											)}
										</div>
									</div>
								)}
							</div>
						)}
						<ColorPicker
							title={'Fill Color'}
							color={this.state?.logoStickerFill}
							handleColor={(e) => this.setLogoStickerFill(e)}
							brandColors={this.state?.brandColors}
						/>
					</div>
				) : (
					''
				)}

				{/* scrool text -abdullah */}
				{this.state.activeTab === 'st' && (
					<div style={{ overflowY: 'scroll' }} className="st-styles">
						<div className=" st-item animated-item">
							<b>Text edit</b>
							<div className="st-input-container">
								<div className="st-input">
									<input
										placeholder="Do With Ve"
										type="text"
										value={this.state?.scrollText}
										onChange={(e) => this.handleScrollText(e.target.value)}
									/>
								</div>
								{this.state.textError && <p>{this.state.textError}</p>}
							</div>
							<div className="st-input-container">
								<div className="st-input">
									<input
										placeholder="~"
										type="text"
										value={this.state?.scrollSymbol}
										onChange={(e) => this.handleScrollSymbol(e.target.value)}
									/>
								</div>
								{this.state.symbolError && <p>{this.state.symbolError}</p>}
							</div>
						</div>

						<hr className="animated-item"></hr>
						{/* we will do font related things later */}
						<div className="st-item">
							<ColorPicker
								title={'Font Color'}
								color={this.state.fontStyles.color}
								handleColor={(e) => this.handleFontStyles('color', e)}
								brandColors={this.state?.brandColors}
							/>
						</div>

						<hr className="animated-item"></hr>
						<div className="st-item-row animated-item">
							<b> Text Style</b>

							<select
								className="select-style"
								name="text-style"
								value={this.state?.fontStyles?.fontWeight}
								onChange={(e) => {
									this.handleFontStyles('fontWeight', e.target.value);
								}}
							>
								<option value="normal">Serif</option>
								<option value="bold">Sans serif</option>
							</select>
						</div>
						<hr className="animated-item"></hr>

						<div className="st-item animated-item">
							<b> Text Size</b>
							<div className="st-span-div">
								<span
									className={
										this.state?.fontStyles?.fontSize === 24 ? 'active' : ''
									}
									onClick={() => {
										this.handleFontStyles('fontSize', 24);
										this.setState({
											showInputFontSize: false,
										});
									}}
								>
									S
								</span>
								<span
									className={
										this.state?.fontStyles?.fontSize === 36 ? 'active' : ''
									}
									onClick={() => {
										this.handleFontStyles('fontSize', 36);
										this.setState({
											showInputFontSize: false,
										});
									}}
								>
									M
								</span>
								<span
									className={
										this.state?.fontStyles?.fontSize === 48 ? 'active' : ''
									}
									onClick={() => {
										this.handleFontStyles('fontSize', 48);
										this.setState({
											showInputFontSize: false,
										});
									}}
								>
									L
								</span>
								<span
									className={
										this.state?.fontStyles?.fontSize !== 24 &&
										this.state?.fontStyles?.fontSize !== 36 &&
										this.state?.fontStyles?.fontSize !== 48
											? 'active'
											: ''
									}
									onClick={() => {
										this.setState({
											showInputFontSize: true,
										});
									}}
								>
									...
								</span>
							</div>
							{this.state.showInputFontSize && (
								<>
									<hr className="animated-item"></hr>
									<div
										className="st-item animated-item"
										style={{ padding: '0px' }}
									>
										<b>Text Size</b>
										<div className="st-range-div">
											<div
												style={{
													display: 'flex',
													maxWidth: 230,
													marginLeft: 6,
												}}
											>
												<input
													type="range"
													min={10}
													max={60}
													step={5}
													value={this.state?.fontStyles?.fontSize}
													onChange={(e) =>
														this.handleFontStyles(
															'fontSize',
															e.target.value,
														)
													}
												/>
											</div>
											<p>{this.state?.fontStyles?.fontSize}</p>
										</div>
									</div>
								</>
							)}
						</div>
						<hr className="animated-item"></hr>

						<div className="st-item animated-item">
							<b>Wave Intensity</b>
							<div className="st-range-div">
								<div
									style={{
										display: 'flex',
										maxWidth: 230,
										marginLeft: 6,
									}}
								>
									<input
										type="range"
										min={0}
										max={80}
										step={20}
										value={this.state?.scrollStyles?.intensity}
										onChange={(e) =>
											this.handleScrollStyles('intensity', e.target.value)
										}
									/>
								</div>
								<p>{this.state?.scrollStyles?.intensity}</p>
							</div>
						</div>
						<hr className="animated-item"></hr>

						<div className="st-item animated-item">
							<b>Direction</b>
							<div className="st-span-div">
								<span
									className={
										this.state?.scrollStyles?.direction === 'left'
											? 'active'
											: ''
									}
									onClick={() => this.handleScrollStyles('direction', 'left')}
								>
									<Arrow style={{ rotate: '180deg' }} />
								</span>
								<span
									className={
										this.state?.scrollStyles?.direction === 'right'
											? 'active'
											: ''
									}
									onClick={() => this.handleScrollStyles('direction', 'right')}
								>
									<Arrow />
								</span>
							</div>
						</div>
						<hr className="animated-item"></hr>
						<div className="st-item animated-item">
							<b>Speed</b>
							<div className="st-span-div st-gap-20px">
								<span
									className={`curved-span ${
										this.state?.scrollStyles?.speed === 'slow' ? 'active' : ''
									}`}
									onClick={(e) => this.handleScrollStyles('speed', 'slow')}
								>
									Slow
								</span>
								<span
									className={`curved-span ${
										this.state?.scrollStyles?.speed === 'medium' ? 'active' : ''
									}`}
									onClick={(e) => this.handleScrollStyles('speed', 'medium')}
								>
									Med
								</span>
								<span
									className={`curved-span ${
										this.state?.scrollStyles?.speed === 'fast' ? 'active' : ''
									}`}
									onClick={(e) => this.handleScrollStyles('speed', 'fast')}
								>
									Fast
								</span>
							</div>
						</div>
						<hr className="animated-item"></hr>

						<div className=" st-item-row animated-item">
							<b>Pause on Hover </b>
							<label className="switch">
								<input
									type="checkbox"
									onChange={(e) =>
										this.handleScrollStyles('pauseOnHover', e.target.checked)
									}
									checked={this.state?.scrollStyles?.pauseOnHover}
								/>
								<span className="slider-round round"></span>
							</label>
						</div>

						<div className=" st-item-row animated-item">
							<b>Fade Edges</b>
							<label className="switch">
								<input
									type="checkbox"
									onChange={(e) =>
										this.handleScrollStyles('fade', e.target.checked)
									}
									checked={this.state?.scrollStyles?.fade}
								/>
								<span className="slider-round round"></span>
							</label>
						</div>
						{/* <hr className="animated-item"></hr>
						<div className="st-item animated-item">
									<b>Item Spacing</b>
									<div className="st-range-div">
										<div
											style={{
												display: 'flex',
												maxWidth: 230,
												marginLeft: 6,
											}}
										>
											<input
												type="range"
												min={20}
												max={100}
												step={10}
												value={this.state?.itemSpacing}
												onChange={(e) =>
													this.handleItemSpacing(
														
														e.target.value,
													)
												}
											/>
										</div>
										<p>{this.state?.itemSpacing}</p>
									</div>
								</div> */}
						<hr className="animated-item"></hr>
						<div className=" st-item-row animated-item">
							<b>Blur</b>
							<label className="switch">
								<input
									type="checkbox"
									onChange={(e) => {
										this.handleScrollStyles('blur', e.target.checked);
									}}
									checked={this.state?.scrollStyles?.blur}
								/>
								<span className="slider-round round"></span>
							</label>
						</div>
						{this.state?.scrollStyles?.blur && (
							<>
								<div className="st-item animated-item">
									<div className="st-span-div st-gap-20px">
										<span
											className={`curved-span ${
												this.state?.scrollStyles?.blurType === 'text'
													? 'active'
													: ''
											}`}
											onClick={(e) =>
												this.handleScrollStyles('blurType', 'text')
											}
											style={{ width: 'fit-content' }}
										>
											Element
										</span>
										<span
											className={`curved-span ${
												this.state?.scrollStyles?.blurType === 'background'
													? 'active'
													: ''
											}`}
											onClick={(e) =>
												this.handleScrollStyles('blurType', 'background')
											}
											style={{ width: 'fit-content' }}
										>
											Backdrop
										</span>
									</div>
								</div>
								<div className="st-item animated-item">
									<b>Blur Amount</b>
									<div className="st-range-div">
										<div
											style={{
												display: 'flex',
												maxWidth: 230,
												marginLeft: 6,
											}}
										>
											<input
												type="range"
												min={5}
												max={50}
												step={5}
												value={this.state?.scrollStyles?.blurAmount}
												onChange={(e) =>
													this.handleScrollStyles(
														'blurAmount',
														e.target.value,
													)
												}
											/>
										</div>
										<p>{this.state?.scrollStyles?.blurAmount}</p>
									</div>
								</div>
							</>
						)}
						<hr className="animated-item"></hr>
					</div>
				)}
				{/*journey block -abdullah */}
				{this.state.activeTab === 'ji' && (
					<div style={{ overflowY: 'scroll' }} className="st-styles animated-item">
						<div className="st-item animated-item">
							<b> Icons </b>

							<div className="st-input-container">
								<div className="st-input st-hp-48">
									<SearchIcon />

									<input
										placeholder="search here"
										type="text"
										value={this.state?.searchedIcon}
										onChange={(e) => {
											this.setState({
												searchedIcon: e.target?.value,
											});
										}}
									/>
								</div>
							</div>
						</div>

						<div
							className="icon-lists animated-item"
							ref={(el) => (this.iconsContainerRef = el)}
						>
							{filteredIcons.length > 0 &&
								filteredIcons.map((icon, index) => (
									<div
										key={index}
										ref={(el) => (this.iconRefs[index] = el)}
										title={icon?.tooltip}
										className={
											this.state?.activeJIcon === icon?.name && 'active-jicon'
										}
										dangerouslySetInnerHTML={{
											__html: getUpdatedSvg(icon?.svg, '#9B9290'),
										}}
										onClick={() => {
											this.props?.setJIconProps(
												'icon',
												icon?.name,
												this.state?.activeBlockID,
											);
										}}
									></div>
								))}
						</div>
						<hr className="animated-item"></hr>

						<div className="st-item  animated-item">
							<ColorPicker
								title={'Icon Color'}
								color={
									_.find(this.state?.activeSection?.blocks, {
										_id: this.state?.activeBlockID,
									})?.iconColor || '#000'
								}
								handleColor={(e) =>
									this.props?.setCardColor(
										'iconColor',
										e,
										this.state?.activeBlockID,
									)
								}
								brandColors={this.state?.brandColors}
							/>
						</div>

						<div className="st-item animated-item" style={{ marginTop: '10px' }}>
							<b>Icon Size</b>
							<div className="st-range-div">
								<div
									style={{
										display: 'flex',
										maxWidth: 230,
									}}
								>
									<input
										type="range"
										min={20}
										max={48}
										step={2}
										value={this.state?.activeJIconSize}
										onChange={(e) => {
											this.setState({
												activeJIconSize: e.target.value,
											});
											this.props?.setJIconProps(
												'size',
												e.target?.value,
												this.state?.activeBlockID,
											);
										}}
									/>
								</div>
								<p style={{ textTransform: 'lowercase' }}>
									{this.state?.activeJIconSize}px
								</p>
							</div>
						</div>

						<hr className="animated-item"></hr>
						<div className="st-item animated-item" style={{ paddingBottom: '30px' }}>
							<ColorPicker
								title={'Card Color'}
								color={
									_.find(this.state?.activeSection?.blocks, {
										_id: this.state?.activeBlockID,
									})?.cardColor || this.state?.cardColor
								}
								handleColor={(e) =>
									this.props?.setCardColor(
										'cardColor',
										e,
										this.state?.activeBlockID,
									)
								}
								brandColors={this.state?.brandColors}
							/>
						</div>
					</div>
				)}

				{/* for foldable block abdullah */}
				{this.state.activeTab === 'fbs' ? (
					<div className="bt_styles">
						<div className="bt-shapes">
							<b>Styles</b>
							<div className="bt-shape-container">
								{this.state.buttonShape &&
									_.map(this.state.buttonShape, (shape) => (
										<div
											key={shape.name}
											style={shape.styles}
											className={
												shape.name ===
												this.state?.activeSection?.style?.foldButtonStyles
													?.btStyle
													? 'activeButton'
													: ''
											}
											onClick={() =>
												this.handleFoldBtnStyles('style', shape.name)
											}
										></div>
									))}
							</div>
						</div>

						<ColorPicker
							title={'Font Color'}
							color={this.state?.activeSection?.style?.foldButtonStyles?.fontColor}
							handleColor={(e) => this.handleFoldBtnStyles('fontColor', e)}
							brandColors={this.state?.brandColors}
						/>
						<ColorPicker
							title={'Fill Color'}
							color={this.state?.activeSection?.style?.foldButtonStyles?.background}
							handleColor={(e) => this.handleFoldBtnStyles('background', e)}
							brandColors={this.state?.brandColors}
						/>

						<ColorPicker
							title={'Border Color'}
							color={this.state?.activeSection?.style?.foldButtonStyles?.borderColor}
							handleColor={(e) => this.handleFoldBtnStyles('borderColor', e)}
							brandColors={this.state?.brandColors}
						/>

						<div className="bs-item" style={{ position: 'relative' }}>
							<b>Border Thickness</b>
							<div className="bg-item">
								<div
									style={{
										display: 'flex',
										maxWidth: 230,
										marginLeft: 6,
									}}
								>
									<input
										type="range"
										min={0}
										max={50}
										step={2}
										value={
											this.state?.activeSection?.style?.foldButtonStyles
												?.borderWidth
										}
										onChange={(e) =>
											this.handleFoldBtnStyles('borderWidth', e.target.value)
										}
									/>
								</div>
								<p
									style={{
										color: '#939393',
										fontFamily: 'Inter',
										fontSize: '12px',
									}}
								>
									{
										this.state?.activeSection?.style?.foldButtonStyles
											?.borderWidth
									}
								</p>
							</div>
						</div>
					</div>
				) : (
					''
				)}

				{/* <div style={{ display: 'flex', height: '100px', width: '100%' }}></div> */}
				<div className="sfooter">
					<a>{this.state.isAutoSaving ? 'Saving...' : 'Saved'}</a>
				</div>
				<Modal
					show={this.state.showImageModal}
					handleClose={(e) => {
						this.toggleShowImageModal(e);
					}}
					modalType={'center'}
				>
					<ImageLibrary
						close={(e) => this.toggleShowImageModal(e)}
						setLibraryImage={(e) =>
							this.state.addBgImageURL
								? this.handleAddBgImageUrl(e)
								: this.props.setImage(e, this.state.activeImageURL ? true : null)
						}
					/>
				</Modal>
				<Modal
					show={this.state.showVariableModal}
					handleClose={(e) => {
						this.toggleShowVariableModal(e);
					}}
					modalType={'center'}
				>
					<SmartFields
						close={(e) => this.toggleShowVariableModal(e)}
						fieldData={this.state?.variables}
						activeModuleId={this.state?.activeModuleId}
						setFieldData={(e) => this.setState({ variables: e })}
					/>
				</Modal>

				{this.state.showAddSmartModal ? (
					<div ref={this.blockRef}>
						<Modal
							show={this.state.showAddSmartModal}
							handleClose={(e) => {
								this.handleSmartModalClose(e);
							}}
							modalType={'center'}
						>
							<div className="create-smart-field-container">
								<div className="create-smart-field-header">
									{isEdit ? <p>Edit Smart Field</p> : <p>Create Smart Field</p>}
									<Close
										style={{ width: '30px', height: '30px', cursor: 'pointer' }}
										onClick={this.handleCloseAddSmartFieldModal}
									/>
								</div>
								<div className="create-smart-field-body">
									<div>
										<p>Name</p>
										<input
											type="text"
											placeholder="Enter name"
											value={name}
											onChange={(e) => {
												this.setState({ name: e.target.value });
											}}
										/>
									</div>
									<div className="dropdown-container">
										<p>Type</p>
										<div
											className="dropdown"
											onClick={() => {
												this.setState({ isOpen: !isOpen });
											}}
										>
											{selectedOption ? (
												<p>{selectedOption}</p>
											) : (
												<p style={{ color: '#999999' }}>Select an option</p>
											)}
											<DropDown />
										</div>

										{isOpen && (
											<div className="dropdown-options-container">
												{options.map((option) => (
													<div
														key={option.value}
														className="dropdown-option"
														onClick={() =>
															this.handleSelect(option.value)
														}
													>
														<div>{option.image}</div>
														<p className="options">{option.label}</p>
													</div>
												))}
											</div>
										)}
									</div>
									<div>
										<p>Default Value</p>
										<input
											type={selectedOption}
											placeholder="Enter value"
											value={value}
											onChange={(e) => {
												this.setState({ value: e.target.value });
											}}
										/>
									</div>
								</div>
								<div className="create-smart-field-footer">
									{isEdit ? (
										<p
											onClick={(e) => {
												e.stopPropagation();
												this.editSmartFields();
											}}
										>
											Edit field
										</p>
									) : (
										<p
											onClick={(e) => {
												e.stopPropagation();
												this.handleCreateSmartField();
											}}
										>
											Create field
										</p>
									)}
								</div>
							</div>
						</Modal>
					</div>
				) : (
					''
				)}
				{this.state.activeTab === 'p' ? (
					<div>
						{this.state?.editActiveModule ? (
							<div className="edit-active-module">
								<div className="page-active-module-header">
									<PageIcon />
									<span>{this.state?.activeModule?.label}</span>
								</div>
								<div className="page-active-module-body">Page layout</div>
								<div className="page-active-module-description">
									Adjust the page layout to refine structure and design.
								</div>
								<div className="animated-item bg-types">
									<div className="bg-width-container">
										<b className="bg-width-title">Background Width</b>
										<div className="bg-width">
											<span
												onClick={() => this.handleBackgroundWidth('full')}
												className={`bg-width-item ${
													this.state.activeModule?.showType === 'full' ||
													!this.state.activeModule?.showType
														? 'active'
														: ''
												}`}
											>
												Full
											</span>
											<span
												onClick={() => this.handleBackgroundWidth('slide')}
												className={`bg-width-item ${
													this.state.activeModule?.showType === 'slide'
														? 'active'
														: ''
												}`}
											>
												Slide
											</span>
											<span
												onClick={() => this.handleBackgroundWidth('a4')}
												className={`bg-width-item ${
													this.state.activeModule?.showType === 'a4'
														? 'active'
														: ''
												}`}
											>
												A4
											</span>
										</div>
									</div>
									<div className="divider"></div>
								</div>
								{this.state?.activeModule?.showType === 'a4' && (
									<>
										<div
											style={{
												width: '100%',
												position: 'relative',
												boxSizing: 'border-box',
											}}
											className="bg-pages block_styles"
										>
											<div
												className="bg-pages-item bs-item"
												style={{ width: '100%' }}
											>
												<ColorPicker
													title={'A4 fefBackground Color'}
													color={this.state?.activeModule?.a4BgColor}
													handleColor={(e) => this.handleA4BgColor(e)}
													brandColors={this.state?.brandColors}
												/>
											</div>
										</div>
										<hr></hr>
									</>
								)}
							</div>
						) : (
							<ManagePages
								modules={this.state.duplicateModules}
								onDragEnd={(e) => this.props.onDragEnd(e)}
								putModules={(e) => this.props.putModules(e)}
								copyModule={(e, order) => this.props.copyModule(e, order)}
								deleteModule={(e) => this.props.deleteModule(e)}
								addPage={(e) => this.props.addPage(e)}
								getTemplateList={(e, page) => this.props.getTemplateList(e, page)}
								templateList={this.state.templateList}
								isWorkflow={this.state.isWorkflow}
								template={this.state.template}
								getModuleInfo={(id, type) => this.props.getModuleInfo(id, type)}
								activeModuleId={this.state.activeModuleId}
								handlePageType={(e) => this.handlePageType(e)}
								handleAddBlankPage={() => this.props.handleAddBlankPage()}
								section={this.props?.navBar}
								handleShowNavbar={this.props?.handleShowNavbarA}
							/>
						)}
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

export default withRouter(Sidebar);
