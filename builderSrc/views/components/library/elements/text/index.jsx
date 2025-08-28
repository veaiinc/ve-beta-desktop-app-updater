import React, { PureComponent } from 'react';
const JoditEditor = React.lazy(() => import('jodit-react'));
import _ from 'lodash';
import rgbHex from 'rgb-hex';
// import Right from '../../layouts/actions/down';
import { TextIndexBaseClass } from '../../../builder_client_common';
// import { ColorPicker } from '../../../builder_client_common';
import BoldIcon from './joditsvg/bold.svg';
import ItalicIcon from './joditsvg/italic.svg';
import UnderlineIcon from './joditsvg/underline.svg';
import StrikethroughIcon from './joditsvg/strikethrough.svg';
import BlockquoteIcon from './joditsvg/blockquote.svg';
import AITextIcon from './joditsvg/ai.svg';
import OrderListIcon from './joditsvg/orderlist.svg';
import UnorderListIcon from './joditsvg/unorderlist.svg';
import LinkIcon from './joditsvg/link.svg';
import AnimatedIcon from './joditsvg/anime.svg';
import FontsPropsIcon from './joditsvg/fonts.svg';
import { ToWords } from 'to-words';
import { Helmet } from 'react-helmet';
import Ai_InputComponent from './Ai_InputComponent';
import ObjectID from 'bson-objectid';

const clientVariblesMapper = {
	'client-name': 'name',
	'client-phone-number': 'phoneNumber',
	'client-email-id': 'email',
};

const popupOptions = {
	buttons: [
		{
			name: 'bold',
			template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${BoldIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
			exec: (editor) => {
				editor.execCommand('bold');
			},
		},
		'italic',
		'underline',
		'link',
		'ul',
		'ol',
		'customButton',
		'autoScale',
	],
};
const mobilePopupOptions = {
	buttons: [
		'bold',
		'italic',
		'underline',
		'link',
		'ul',
		'ol',
		'fontSize',
		'customButton',
		'autoScale',
	],
};

// Remove the Proposals import if in client mode
const BaseClass = TextIndexBaseClass;

class App extends BaseClass {
	constructor(props) {
		super(props);

		// Get session ID from URL parameters
		const searchParams = new URLSearchParams(window.location.search);
		const sessionId = searchParams.get('sessionId') || null;
		const agentType = searchParams.get('agentType') || 'multi_agent';

		this.state = {
			showElementOptions: false,
			isFluid: props?.isFluid,
			showEditTextLabel:
				props?.showEditTextLabel !== undefined ? props?.showEditTextLabel : true,
			actionType: props.actionType,
			actionValue: props.actionValue,
			activeSectionID: props.activeSectionID,
			sectionID: props.sectionID,
			reference: props.reference,
			focusedEditor: null,
			preview: props.preview,
			activeVariableID: props.activeVariableID,
			activeVariableName: props.activeVariableName,
			subBlockID: props.subBlockID,
			refID: props.refID,
			activeSubBlockId: props.activeSubBlockId,
			isClicked: false,
			isServiceItem: props.isServiceItem,
			sectionType: props.sectionType,
			showPopup: false,
			showColorPicker: false,
			colorPickerPosition: { top: 0, left: 0 },
			popupPosition: { top: 0, left: 0 },
			isClosing: false,
			selectedText: '',
			generatedText: null,
			aiTextInput: '',
			suggestedAITextInput: null,
			aiPromptLoading: false,
			textGenerated: false,
			sectionBg: props?.sectionBg,
			triggerFont: props?.triggerFont,
			triggeredFont: props?.triggeredFont,
			isWorkflow: false,
			previewType: props?.previewType,
			isFluidButton: props?.isFluidButton,
			elementFontColor: props?.elementFontColor,
			joditHeight: 0,
			activeSelectedText: false,
			fluidSublockID: props?.fluidSublockID,
			textData: props?.text,
			sections: props?.sections,
			sessionId,
			agentType,
			latestStreamMessage: null,
			lastQuery: '',
			websocketConnected: false,
			websocketError: null,
			aiSelectedText: '',
			isTextEdit: false,
			textEditValue: '',
		};
		this[`ref_${this.state.reference}`] = React.createRef();
		this.textRef = React.createRef();
		this.popupRef = React.createRef();
		this.colorPickerRef = React.createRef();
		this.heightRef = React.createRef();
		this.loadingMessageRef = React.createRef(null);
		this.socketRef = React.createRef(null);
	}

	config = {
		readonly: _.has(this.props, 'readOnly')
			? this.props.readOnly
			: this.props.previewType === 'm', // Make readonly when preview type is 'm'
		askBeforePasteHTML: false,

		// askBeforePasteFromWord: false, // Disable popup for pasting from Word
		beautifyHTML: false,
		defaultActionOnPaste: 'insert_only_text', // Keep original formatting
		events: {
			afterInit: (instance) => {
				this[`ref_${this.props.reference}`] = instance;
				instance.events.on('keydown', this.handleKeyDown);

				// Add event listener to disable pointer events when in mobile preview
				if (this.props.previewType === 'm') {
					instance.editor.style.pointerEvents = 'none';
					instance.editor.style.cursor = 'default';
				}
			},

			mousedown: (event) => {
				// Prevent mouse interactions in mobile preview
				if (this.props.previewType === 'm') {
					event.preventDefault();
					return false;
				}
			},
			keydown: (event) => {
				// Prevent keyboard interactions in mobile preview
				if (this.props.previewType === 'm') {
					event.preventDefault();
					return false;
				}
			},
		},
		toolbar: false,
		inlinePopup: popupOptions,
		inline: true,
		placeholder:
			this?.props?.text == '<p></p>' ? 'Enter content here, or type @ for smart fields' : '',
		toolbarInlineForSelection: true,
		showPlaceholder: true,
		useSplitMode: true,
		disablePlugins: 'about,stat,powered-by-jodit,xpath',
		controls: {
			fontSize: {
				list: this.markAsAtomic([
					6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44,
					46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84,
					86, 88, 90, 92, 94, 96, 98, 100,
				]),
				exec: (editor, event, control, originalValue) => {
					// This function is triggered when a font is selected
					const selectedFont = control.control.args[0]; // Get the selected font
					// Show an alert with the font name
					// editor.execCommand('fontSize', false, selectedFont);

					const minSizeRem = selectedFont / 16;
					const valueRem = (selectedFont / 16) * 2;
					const viewportWidth = window.innerWidth - 50;
					const valueVw = (selectedFont * 100) / viewportWidth;
					// let updatedValue = `clamp(${minSizeRem}rem, ${valueVw}rem ,${valueRem}rem)`;
					let updatedValue = `${minSizeRem}rem`;
					editor.execCommand('fontSize', false, updatedValue);
				},
				//{ "12": "12" }
				//this.markAsAtomic([12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100]),
			},
			font: {
				list: {
					'avenir, Sans serif': 'avenir',
					'tt-commons-pro-expanded, Sans serif': 'tt-commons-pro-expanded',
					'misty, Script': 'misty',
					'freight-big-pro, Serif': 'freight-big-pro',
					'Courier, Monospace': 'Courier',
					'acumin-pro, Sans serif': 'acumin-pro',
					'aktiv-grotesk, Sans serif': 'aktiv-grotesk',
					'benton-sans, Sans serif': 'benton-sans',
					'brandon-grotesque, Sans serif': 'brandon-grotesque',
					'brothers, Sans serif': 'brothers',
					'din-condensed, Sans serif': 'din-condensed',
					'futura-pt, Sans serif': 'futura-pt',
					'gill-sans-nova, Sans serif': 'gill-sans-nova',
					'halyard-text, Sans serif': 'halyard-text',
					'helvetica-neue-lt-std, Sans serif': 'helvetica-neue-lt-std',
					'itc-avant-garde-gothic-pro, Sans serif': 'itc-avant-garde-gothic-pro',
					'ivymode, Sans serif': 'ivymode',
					'linotype-sabon, Serif': 'linotype-sabon',
					'neue-haas-grotesk-text, Sans serif': 'neue-haas-grotesk-text',
					'neue-haas-unica, Sans serif': 'neue-haas-unica',
					'neuzeit-grotesk, Sans serif': 'neuzeit-grotesk',
					'Italianno, cursive': 'Italianno',
				},
			},
			customButton: {
				name: 'customButton',

				template: () => `<div style="
				width: 80px;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			">
			<p style="font-size: 13px;font-family: Inter; font-weight: 500;color: #1F2326;">Ai tools  </p>
				<img src="${AITextIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
				exec: (editor) => this.customButtonAction(editor),
				className: 'my-custom-button-class',
			},
			customFont: {
				list: {
					h1: 'Heading-1',
					h2: 'Heading-2',
					h3: 'Heading-3',
					h4: 'Heading-4',
					h5: 'Heading-5',
					h6: 'Heading-6',
					p: 'Paragraph',
					span: 'Superscript',
				},
				template: (editor, control, button) => {
					let data = {
						h1: 'Heading-1',
						h2: 'Heading-2',
						h3: 'Heading-3',
						h4: 'Heading-4',
						h5: 'Heading-5',
						h6: 'Heading-6',
						p: 'Paragraph',
						span: 'Superscript',
					};
					const activeTag = this.getTagNameFromSelection(editor);
					const lowercaseTag = activeTag.toLowerCase();
					return data[lowercaseTag] || 'Select Font';
				},

				exec: (editor, event, control, originalValue) => {
					const selectedTag = control.control.args[0];
					if (!selectedTag) return;

					// Get selected HTML
					const selectedHTML = editor.selection.area.innerHTML;

					// Clean the content

					const cleanContent = selectedHTML
						.replace(/<\/?(?!br|input)[a-z][^>]*>/gi, '') // Remove all tags except <br/>
						.trim();

					let styles = '';
					if (_.has(this.props, 'themes') && _.has(this.props?.themes, 'fonts')) {
						let data = this.props?.themes?.fonts[selectedTag] || {};
						let fontColor = this.props?.themes?.colors?.text[selectedTag] || {};
						if (data) {
							// Add font size

							if (_.has(data, 'fontSize')) {
								let fontSize = data?.fontSize?.replace(/[^0-9.]/g, '') || 0;
								fontSize = parseFloat(fontSize);
								// Convert px to rem directly without clamp
								const updatedValue = `${fontSize / 16}rem`;
								styles += `font-size: ${updatedValue};`;
							}

							// Add other styles
							// if (_.has(data, 'fontWeight')) {
							// 	styles += `font-weight: ${data.fontWeight};`;
							// }
							// if (_.has(data, 'fontFamily')) {
							// 	styles += `font-family: ${data.fontFamily};`;
							// }
							// if (_.has(data, 'letterSpacing')) {
							// 	styles += `letter-spacing: ${data.letterSpacing};`;
							// }
							// if (_.has(data, 'lineHeight')) {
							// 	styles += `line-height: ${data.lineHeight};`;
							// }
							// if (_.has(fontColor, 'color')) {
							// 	styles += `color: ${fontColor.color};`;
							// }
						}
					}

					const finalHTML = `
						<${selectedTag} style="${styles}">
							${cleanContent}
						</${selectedTag}>
						`
						.replace(/[\n\t\s]+/g, ' ')
						.replace(/>\s+</g, '><')
						.trim();
					editor.selection.area.innerHTML = '';
					editor.selection.insertHTML(finalHTML);
				},
				active: (editor, control) => {
					const selection = editor.selection.getNode();
					if (!selection) return false;

					const tagName = selection.tagName.toLowerCase();

					return Object.keys(customFont.list).includes(tagName) ? tagName : false;
				},
			},
			color: {
				template: (editor) => {
					const selection = editor.selection;
					let currentColor = '#000000';
					if (selection && selection.range) {
						const node = selection.current();
						if (node) {
							const computedStyle = window.getComputedStyle(
								node.parentElement || node,
							);

							currentColor = computedStyle.color;
							if (currentColor.startsWith('rgb')) {
								currentColor = '#' + rgbHex(currentColor);
							}
						}
					}
					return `<div class="jodit-color-swatch" style="
						width: 20px;
						height: 20px;
						border-radius: 50%;
						background-color: ${currentColor || '#000000'};
						position: relative;
						cursor: pointer;
					"></div>`;
				},
				exec: function (editor) {
					this.handleColorChange(editor, 'c');
					return false;
				}.bind(this),
				tooltip: 'Select Color',
			},
		},
		popup: {
			selection: this.markAsAtomic([
				'color',
				'|',
				'customFont',
				'|',
				{
					name: 'fontsProps',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${FontsPropsIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
					exec: function (editor) {
						this.handleColorChange(editor, 'f');
						return false;
					}.bind(this),
				},
				'|',
				{
					name: 'animated',
					template: () => `<div style="	
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${AnimatedIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
					exec: function (editor) {
						this.handleColorChange(editor, 'a');
						return false;
					}.bind(this),
				},
				'|',
				// 'customFont',
				'|',
				{
					name: 'bold',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${BoldIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
					exec: (editor) => {
						editor.execCommand('bold');
					},
				},
				{
					name: 'italic',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${ItalicIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
					exec: (editor) => {
						editor.execCommand('italic');
					},
				},
				{
					name: 'underline',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${UnderlineIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
					exec: (editor) => {
						editor.execCommand('underline');
					},
				},
				{
					name: 'strikethrough',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${StrikethroughIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
				},
				{
					name: 'formatBlock',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${BlockquoteIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
					exec: (editor) => {
						editor.execCommand('formatBlock', false, 'blockquote');
					},
				},
				'|',
				{
					name: 'ul',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${UnorderListIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
				},
				{
					name: 'ol',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${OrderListIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
				},
				'lineHeight', //here is line height
				{
					name: 'link',
					template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${LinkIcon}" style="width: 24px; height: 24px;"/>
			</div>`,
				},
				'customButton',
			]),
		},

		lineHeight: {
			list: this.markAsAtomic([1, 2, 3, 3.5]),
		},
		enter: 'p',
	};

	componentDidMount() {
		document.addEventListener('mouseup', this.handleSelectionChange);
		document.addEventListener('click', this.handleInputClick);
		document.addEventListener('mousedown', this.handleClickOutside);

		// Initialize WebSocket connection if session ID exists
		if (this.state.sessionId && this.state.agentType) {
			// console.log(
			// 	'Initializing WebSocket with sessionId:',
			// 	this.state.sessionId,
			// 	'and agentType:',
			// 	this.state.agentType,
			// );
			// this.initializeWebSocket(this.state.sessionId, this.state.agentType);
		} else {
			console.warn('No sessionId or agentType found in URL parameters');
		}

		//! for text smart field
		const editorRef = this[`ref_${this.state.reference}`];
		if (editorRef && editorRef?.events) {
			editorRef?.events?.on('keydown', this.handleKeyDown);
		}
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleSelectionChange);
		document.removeEventListener('click', this.handleInputClick);
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleKeyDown = (event) => {
		if (event.key === '@') {
			event.preventDefault();
			setTimeout(() => {
				this.props?.openSmartFieldPopup(true);
			}, 500); // Prevent the default behavior
			this.props?.openSmartFieldPopup(); // Call your function to show the popup
		}
	};
	componentDidUpdate(prevProps) {
		// console.log(prevProps, this.props);
	}

	componentWillReceiveProps = (nextProps) => {
		let justifyArr = ['justifycenter', 'justifyleft', 'justifyright', 'justifyfull'];
		if (
			((this.state.actionType !== nextProps.actionType ||
				this.state.actionValue !== nextProps.actionValue) &&
				nextProps.triggerFont == true &&
				nextProps.actionType !== null &&
				!justifyArr.includes(nextProps.actionType) &&
				nextProps.actionValue !== null) ||
			(justifyArr.includes(nextProps.actionType) && nextProps.actionValue == null)
		) {
			this.setState(
				{
					actionType: nextProps.actionType,
					actionValue: nextProps.actionValue,
				},
				() => {
					if (this.state.subBlockID == nextProps.subBlockID) {
						if (
							this.state.reference === this.state.focusedEditor &&
							this.state.subBlockID == this.state.refID
						) {
							if (localStorage.getItem('activeTextItem') == nextProps.subBlockID) {
								this.applyStyling(nextProps.actionType, nextProps.actionValue);
							}
						}
					}
				},
			);
		}
		// else if (this.state.actionType == nextProps.actionType && this.state.actionValue == nextProps.actionValue) {

		// 	if (nextProps.triggeredFont === localStorage.getItem('selectedText') && nextProps.actionValue !== null) {

		// 		if (this.state.subBlockID == nextProps.subBlockID) {
		// 			if (
		// 				this.state.reference === this.state.focusedEditor &&
		// 				this.state.subBlockID == this.state.refID
		// 			) {
		// 				if (localStorage.getItem('activeTextItem') == nextProps.subBlockID) {
		// 					this.applyStyling(nextProps.actionType, nextProps.actionValue, true);
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		//commented

		// if (
		// 	(this.state.actionType !== nextProps.actionType ||
		// 		this.state.actionValue !== nextProps.actionValue) &&
		// 	this.props.isServiceItem == true &&
		// 	this.state.subBlockID == this.state.refID
		// ) {
		// 	this.setState(
		// 		{
		// 			actionType: nextProps.actionType,
		// 			actionValue: nextProps.actionValue,
		// 		},
		// 		() => {
		// 			this.applyStyling(
		// 				nextProps.actionType,
		// 				nextProps.actionValue
		// 			);
		// 		}
		// 	);
		// }

		//commented ends
		if (
			(this.state.activeVariableID !== nextProps.activeVariableID ||
				this.state.activeVariableName !== nextProps.activeVariableName) &&
			nextProps.activeVariableID !== null &&
			nextProps.activeVariableName !== null
		) {
			this.setState(
				{
					activeVariableID: nextProps.activeVariableID,
					activeVariableName: nextProps.activeVariableName,
				},
				() => {
					if (this.state.reference === this.state.focusedEditor) {
						this.applyVariable(
							nextProps.activeVariableID,
							nextProps.activeVariableName,
						);
					}
				},
			);
		}
		if (this.state.fluidSublockID !== nextProps.fluidSublockID) {
			this.setState({
				fluidSublockID: nextProps.fluidSublockID || null,
			});
		}

		if (this.state.isFluid !== nextProps.isFluid) {
			this.setState({
				isFluid: nextProps.isFluid,
			});
		}
		if (this.state.elementFontColor !== nextProps.elementFontColor) {
			this.setState(
				{
					elementFontColor: nextProps.elementFontColor,
				},
				() => {
					if (nextProps.elementFontColor !== null && this.state?.elementFontColor) {
						this.applyColorToSelection(nextProps.elementFontColor);
					}
				},
			);
		}
		if (this.state.activeSelectedText !== nextProps.activeSelectedText) {
			this.setState(
				{
					activeSelectedText: nextProps.activeSelectedText,
				},
				() => {
					if (nextProps.activeSelectedText) {
						this.handleColorChange();
					}
				},
			);
		}
		if (this.state.isFluidButton !== nextProps.isFluidButton) {
			this.setState({
				isFluidButton: nextProps.isFluidButton,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState(
				{
					previewType: nextProps.previewType,
				},
				() => {
					// Update readonly state when preview type changes
					const ref = this[`ref_${this.state.reference}`];
					if (ref && typeof ref.setReadOnly === 'function') {
						ref.setReadOnly(this.state.previewType === 'm');
					}
				},
			);
		}
		if (this.state.activeVariableName !== nextProps.activeVariableName) {
			this.setState({
				activeVariableName: nextProps.activeVariableName,
			});
		}
		if (this.state.activeSectionID !== nextProps.activeSectionID) {
			this.setState({
				activeSectionID: nextProps.activeSectionID,
			});
		}

		if (this.state.activeTextBlock !== nextProps.activeTextBlock) {
			this.setState({
				activeTextBlock: nextProps.activeTextBlock,
			});
		}
		if (this.state.reference !== nextProps.reference) {
			this.setState({
				reference: nextProps.reference,
			});
		}
		if (this.state.sectionID !== nextProps.sectionID) {
			this.setState({
				sectionID: nextProps.sectionID,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState(
				{
					preview: nextProps.preview,
				},
				() => {
					if (this.state.previewType === 'm' && this.state.isFluid) {
						// let conf = { ...this.config };
						this.config.inlinePopup = mobilePopupOptions;
						this.config.popup = {
							selection: this.markAsAtomic([
								'color',
								'|',

								{
									list: {
										h1: 'Heading-1',
										h2: 'Heading-2',
										h3: 'Heading-3',
										h4: 'Heading-4',
										h5: 'Heading-5',
										h6: 'Heading-6',
										p: 'Paragraph',
										span: 'Superscript',
									},
									template: (editor, control, button) => {
										let data = {
											h1: 'Heading-1',
											h2: 'Heading-2',
											h3: 'Heading-3',
											h4: 'Heading-4',
											h5: 'Heading-5',
											h6: 'Heading-6',
											p: 'Paragraph',
											span: 'Superscript',
										};
										const activeTag = this.getTagNameFromSelection(editor);
										const lowercaseTag = activeTag.toLowerCase();
										return data[lowercaseTag] || 'Select Font';
									},

									exec: (editor, event, control, originalValue) => {
										const selectedTag = control.control.args[0];
										if (!selectedTag) return;

										// Get selected HTML
										const selectedHTML = editor.selection.area.innerHTML;

										// Clean the content

										const cleanContent = selectedHTML
											.replace(/<\/?(?!br|input)[a-z][^>]*>/gi, '') // Remove all tags except <br/>
											.trim();

										let styles = '';
										if (
											_.has(this.props, 'themes') &&
											_.has(this.props?.themes, 'fonts')
										) {
											let data = this.props?.themes?.fonts[selectedTag] || {};
											let fontColor =
												this.props?.themes?.colors?.text[selectedTag] || {};
											if (data) {
												// Add font size

												if (_.has(data, 'fontSize')) {
													let fontSize =
														data?.fontSize?.replace(/[^0-9.]/g, '') ||
														0;
													fontSize = parseFloat(fontSize);
													let updatedValue = '';
													// Convert px to rem directly without clamp
													updatedValue = `${fontSize / 16}rem`;
													styles += `font-size: ${updatedValue};`;
												}

												// Add other styles
												// if (_.has(data, 'fontWeight')) {
												// 	styles += `font-weight: ${data.fontWeight};`;
												// }
												// if (_.has(data, 'fontFamily')) {
												// 	styles += `font-family: ${data.fontFamily};`;
												// }
												// if (_.has(data, 'letterSpacing')) {
												// 	styles += `letter-spacing: ${data.letterSpacing};`;
												// }
												// if (_.has(data, 'lineHeight')) {
												// 	styles += `line-height: ${data.lineHeight};`;
												// }
												// if (_.has(fontColor, 'color')) {
												// 	styles += `color: ${fontColor.color};`;
												// }
											}
										}

										const finalHTML = `
											<${selectedTag} style="${styles}">
												${cleanContent}
											</${selectedTag}>
											`
											.replace(/[\n\t\s]+/g, ' ')
											.replace(/>\s+</g, '><')
											.trim();
										editor.selection.area.innerHTML = '';
										editor.selection.insertHTML(finalHTML);
									},
									active: (editor, control) => {
										const selection = editor.selection.getNode();
										if (!selection) return false;

										const tagName = selection.tagName.toLowerCase();

										return Object.keys(customFont.list).includes(tagName)
											? tagName
											: false;
									},
								},
								'|',
								{
									name: 'fontsProps',
									template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${FontsPropsIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
									exec: function (editor) {
										this.handleColorChange(editor, 'f');
										return false;
									}.bind(this),
								},
								'|',
								{
									name: 'animated',
									template: () => `<div style="	
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${AnimatedIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
									exec: function (editor) {
										this.handleColorChange(editor, 'a');
										return false;
									}.bind(this),
								},
								'|',
								'fontSize',
								'|',
								{
									name: 'bold',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${BoldIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
									exec: (editor) => {
										editor.execCommand('bold');
									},
								},
								{
									name: 'italic',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${ItalicIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
									exec: (editor) => {
										editor.execCommand('italic');
									},
								},
								{
									name: 'underline',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${UnderlineIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
									exec: (editor) => {
										editor.execCommand('underline');
									},
								},
								{
									name: 'strikethrough',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${StrikethroughIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
								},
								{
									name: 'formatBlock',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${BlockquoteIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
									exec: (editor) => {
										editor.execCommand('formatBlock', false, 'blockquote');
									},
								},
								'|',
								{
									name: 'ul',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${UnorderListIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
								},
								{
									name: 'ol',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${OrderListIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
								},
								'lineHeight', //here is line height
								{
									name: 'link',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${LinkIcon}" style="width: 24px; height: 24px;"/>
							</div>`,
								},
								'customButton',
							]),
						};
						// this.setState({
						// 	config: conf,
						// });
					} else {
						// let conf = { ...this.config };
						this.config.inlinePopup = popupOptions;
						this.config.popup = {
							selection: this.markAsAtomic([
								'color',
								'|',
								{
									list: {
										h1: 'Heading-1',
										h2: 'Heading-2',
										h3: 'Heading-3',
										h4: 'Heading-4',
										h5: 'Heading-5',
										h6: 'Heading-6',
										p: 'Paragraph',
										span: 'Superscript',
									},
									template: (editor, control, button) => {
										let data = {
											h1: 'Heading-1',
											h2: 'Heading-2',
											h3: 'Heading-3',
											h4: 'Heading-4',
											h5: 'Heading-5',
											h6: 'Heading-6',
											p: 'Paragraph',
											span: 'Superscript',
										};
										const activeTag = this.getTagNameFromSelection(editor);
										const lowercaseTag = activeTag.toLowerCase();
										return data[lowercaseTag] || 'Select Font';
									},

									exec: (editor, event, control, originalValue) => {
										const selectedTag = control.control.args[0];
										if (!selectedTag) return;

										// Get selected HTML
										const selectedHTML = editor.selection.area.innerHTML;

										// Clean the content

										const cleanContent = selectedHTML
											.replace(/<\/?(?!br|input)[a-z][^>]*>/gi, '') // Remove all tags except <br/>
											.trim();

										let styles = '';
										if (
											_.has(this.props, 'themes') &&
											_.has(this.props?.themes, 'fonts')
										) {
											let data = this.props?.themes?.fonts[selectedTag] || {};
											let fontColor =
												this.props?.themes?.colors?.text[selectedTag] || {};
											if (data) {
												// Add font size

												if (_.has(data, 'fontSize')) {
													let fontSize =
														data?.fontSize?.replace(/[^0-9.]/g, '') ||
														0;
													fontSize = parseFloat(fontSize);
													// Convert px to rem directly without clamp
													const updatedValue = `${fontSize / 16}rem`;
													styles += `font-size: ${updatedValue};`;
												}

												// Add other styles
												// if (_.has(data, 'fontWeight')) {
												// 	styles += `font-weight: ${data.fontWeight};`;
												// }
												// if (_.has(data, 'fontFamily')) {
												// 	styles += `font-family: ${data.fontFamily};`;
												// }
												// if (_.has(data, 'letterSpacing')) {
												// 	styles += `letter-spacing: ${data.letterSpacing};`;
												// }
												// if (_.has(data, 'lineHeight')) {
												// 	styles += `line-height: ${data.lineHeight};`;
												// }
												// if (_.has(fontColor, 'color')) {
												// 	styles += `color: ${fontColor.color};`;
												// }
											}
										}

										const finalHTML = `
											<${selectedTag} style="${styles}">
												${cleanContent}
											</${selectedTag}>
											`
											.replace(/[\n\t\s]+/g, ' ')
											.replace(/>\s+</g, '><')
											.trim();
										editor.selection.area.innerHTML = '';
										editor.selection.insertHTML(finalHTML);
									},
									active: (editor, control) => {
										const selection = editor.selection.getNode();
										if (!selection) return false;

										const tagName = selection.tagName.toLowerCase();

										return Object.keys(customFont.list).includes(tagName)
											? tagName
											: false;
									},
								},
								{
									name: 'fontsProps',
									template: () => `<div style="
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${FontsPropsIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
									exec: function (editor) {
										this.handleColorChange(editor, 'f');
										return false;
									}.bind(this),
								},
								'|',
								{
									name: 'animated',
									template: () => `<div style="	
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			">
				<img src="${AnimatedIcon}" style="width: 16px; height: 16px;"/>
			</div>`,
									exec: function (editor) {
										this.handleColorChange(editor, 'a');
										return false;
									}.bind(this),
								},
								'|',
								{
									name: 'bold',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${BoldIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
									exec: (editor) => {
										editor.execCommand('bold');
									},
								},
								{
									name: 'italic',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${ItalicIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
									exec: (editor) => {
										editor.execCommand('italic');
									},
								},
								{
									name: 'underline',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${UnderlineIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
									exec: (editor) => {
										editor.execCommand('underline');
									},
								},
								{
									name: 'strikethrough',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${StrikethroughIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
								},
								{
									name: 'formatBlock',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${BlockquoteIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
									exec: (editor) => {
										editor.execCommand('formatBlock', false, 'blockquote');
									},
								},
								'|',
								{
									name: 'ul',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${UnorderListIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
								},
								{
									name: 'ol',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${OrderListIcon}" style="width: 16px; height: 16px;"/>
							</div>`,
								},
								'lineHeight', //here is line height
								{
									name: 'link',
									template: () => `<div style="
								width: 20px;
								height: 20px;
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<img src="${LinkIcon}" style="width: 24px; height: 24px;"/>
							</div>`,
								},
								'customButton',
							]),
						};
						// this.setState({
						// 	config: conf,
						// });
					}
				},
			);
		}
		if (this.state.subBlockID !== nextProps.subBlockID) {
			this.setState({
				subBlockID: nextProps.subBlockID,
			});
		}
		if (this.state.refID !== nextProps.refID) {
			this.setState({
				refID: nextProps.refID,
			});
		}
		if (this.state.activeSubBlockId !== nextProps.activeSubBlockId) {
			this.setState({
				activeSubBlockId: nextProps.activeSubBlockId,
			});
		}
		if (this.state.sectionType !== nextProps.sectionType) {
			this.setState({
				sectionType: nextProps.sectionType,
			});
		}
		if (this.state.readOnly !== nextProps.readOnly) {
			let conf = { ...this.state.config };

			this.setState({
				config: conf,
			});
		}
		if (this.state.sectionBg !== nextProps.sectionBg) {
			this.setState({
				sectionBg: nextProps.sectionBg,
			});
		}
		if (this.state.activeSelectedText !== nextProps.activeSelectedText) {
			this.setState(
				{
					activeSelectedText: nextProps.activeSelectedText,
				},
				() => {
					if (nextProps.activeSelectedText) {
						this.handleColorChange();
					}
				},
			);
		}
	};

	// for hover and selected effects
	getOppositeHexColor = (hex) => {
		// Normalize the hex color (e.g., remove `#` if present)
		const normalizedHex = hex?.startsWith('#') ? hex.slice(1) : hex;

		// Convert the hex to a decimal value, invert the color, and pad it back to hex
		const invertedHex = (0xffffff ^ parseInt(normalizedHex, 16)).toString(16).padStart(6, '0');

		// Return the opposite color in hex format with `#`
		return `#${invertedHex}`;
	};
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
	handleInputClick = (event) => {
		if (this.textRef.current && this.textRef.current.contains(event.target)) {
			this.setState(
				{
					focusedEditor: this.state.reference,
					isClicked: true,
				},
				() => {
					localStorage.setItem('activeTextItem', this.state.subBlockID);

					this.props.setTab('f');
				},
			);
			if (this.props.changeTextSelection) {
				this.props.changeTextSelection(true);
			}
		} else if (this.textRef.current && !this.textRef.current.contains(event.target)) {
			this.setState({ isClicked: false });
		}
		const { target } = event;
		if (
			target.tagName === 'INPUT' &&
			!target.classList.contains('input-color-text') &&
			this.props.module === 'contract'
		) {
			this.props.activeVariable(target.dataset.id);
		}
	};
	// applyStyling = (command, value = null) => {

	// 	if (this[`ref_${this.state.reference}`]) {
	// 		// Accessing the Jodit instance via ref
	// 		const jodit = this[`ref_${this.state.reference}`];

	// 		jodit.selection.focus();

	// 		jodit.execCommand(command, false, value);
	// 	}
	// };
	// applyFontStyles = (jodit, value) => {
	// 	const selectedText = jodit.selection.sel;

	// 	if (selectedText.rangeCount > 0) {
	// 		const range = selectedText.getRangeAt(0);
	// 		const selectedNode = range.commonAncestorContainer;

	// 		if(selectedNode.nodeType === 3){
	// 			selectedNode.style.fontStyle = value;
	// 		}else{
	// 			const span = document.createElement('span');
	// 			span.style.fontStyle = value;
	// 			range?.surroundContents(span);
	// 		}

	// 	}
	// };

	applyFontStyles = (jodit, value) => {
		const selectedText = jodit.selection.sel;

		// console.log('selectedText', selectedText);

		if (selectedText.rangeCount > 0) {
			const range = selectedText.getRangeAt(0);
			const selectedNode = range.commonAncestorContainer;
			// console.log('selectedNode', selectedNode);

			try {
				// Get the selected content
				const content = range.extractContents();

				// Create new span
				const span = document.createElement('span');
				span.style.fontStyle = value;

				// Put content inside span
				span.appendChild(content);

				// Insert the span
				range.insertNode(span);

				// Update editor
				jodit.setEditorValue(jodit.getEditorValue());
			} catch (error) {
				console.error('Error applying font style:', error);
			}
		}
	};

	applyFontWeight = (jodit, value) => {
		const selectedText = jodit.selection.sel;

		if (selectedText.rangeCount > 0) {
			const range = selectedText.getRangeAt(0);
			const selectedNode = range.commonAncestorContainer;

			try {
				// Get the selected content
				const content = range.extractContents();

				// Apply font weight directly to selected node
				selectedNode.style.fontWeight = value;
				// Put content back
				range.insertNode(content);

				// Update editor value
				jodit.setEditorValue(jodit.getEditorValue());
				// // Get the selected content
				// const content = range.toString();
				// // Create new span with the content
				// const newSpan = document.createElement('span');
				// newSpan.style.fontWeight = value;
				// newSpan.textContent = content;

				// // Replace the selected content with the new span
				// range.deleteContents();
				// range.insertNode(newSpan);

				// // Update editor
				// jodit.setEditorValue(jodit.getEditorValue());
			} catch (error) {
				console.error('Error:', error);
			}
		}
	};

	applyStyling = (command, value = null, isTriggerFont = null) => {
		const editorRef = this[`ref_${this.state.reference}`];

		if (editorRef) {
			const jodit = editorRef;
			jodit.selection.focus();

			// Check if selection is in this editor before applying styles
			if (this.state.focusedEditor === this.state.reference) {
				if (command === 'letterSpacing') {
					this.setLetterSpacing(jodit, `${value}px`);
				} else if (command === 'lineHeight') {
					this.setLineHeight(jodit, value);
				} else if (command === 'fontStyle') {
					this.applyFontStyles(jodit, value);
				} else if (command === 'fontWeight') {
					this.applyFontWeight(jodit, value);
				} else if (command === 'fontSize' && this.state.isFluid) {
					// Use the debounce function for font size changes
					if (this.props?.debounceFuncForElementProps) {
						this.props.debounceFuncForElementProps(() => {
							const minSizeRem = (value * 0.5) / 16;
							const valueRem = (value / 16) * 2;
							const valueVw = (value / window.innerWidth) * 100;

							let updatedValue = `${value / 16}rem`;

							jodit.execCommand(command, false, updatedValue);
						});
					} else {
						// Fallback if debounce function is not available
						const minSizeRem = (value * 0.5) / 16;
						const valueRem = (value / 16) * 2;
						const valueVw = (value / window.innerWidth) * 100;

						let updatedValue = `${value / 16}rem`;

						jodit.execCommand(command, false, updatedValue);
					}
				} else {
					jodit.execCommand(command, false, value);
					// if (isTriggerFont) {

					// 	this.props.setTriggerFont({ actionType: null, actionValue: null });
					// }
				}
				if (
					command === 'justifyleft' ||
					command === 'justifycenter' ||
					command === 'justifyright' ||
					command === 'justifyfull'
				) {
					this.props.clearStyling();
				}
				//this.props.setTriggerFont(null);
				//this.props.setTriggerFont(false);
				if (
					command === 'fontSize' ||
					command === 'lineHeight' ||
					command === 'letterSpacing'
				) {
					this.handleContentChange(jodit.getEditorValue());
				}
			}
		} else {
			console.warn('Editor reference not found.');
		}
	};

	setLetterSpacing = (jodit, value) => {
		const selectedText = jodit.selection.sel;

		if (selectedText.rangeCount > 0) {
			const range = selectedText.getRangeAt(0);
			const selectedNode = range.commonAncestorContainer;

			try {
				const content = range.extractContents();

				// Apply font weight directly to selected node
				selectedNode.style.letterSpacing = value;

				// Put content back
				range.insertNode(content);

				// Update editor value
				jodit.setEditorValue(jodit.getEditorValue());
			} catch (error) {
				console.error(error, 'error');
			}

			// if (selectedNode.nodeType === 1) {
			// 	selectedNode.style.letterSpacing = value;
			// } else {
			// 	const span = document.createElement('span');
			// 	span.style.letterSpacing = value;
			// 	range.surroundContents(span);
			// }
		}
	};
	setLineHeight = (jodit, value) => {
		const selectedText = jodit.selection.sel;

		if (selectedText.rangeCount > 0) {
			const range = selectedText.getRangeAt(0);
			const selectedNode = range.commonAncestorContainer;

			try {
				const content = range.extractContents();

				// Apply font weight directly to selected node
				selectedNode.style.lineHeight = value;

				// Put content back
				range.insertNode(content);

				// Update editor value
				jodit.setEditorValue(jodit.getEditorValue());
			} catch (error) {
				console.error('Error setting line height:', error);
			}
		}
	};

	applyVariable = (variableID, variableValue) => {
		if (
			this[`ref_${this.state.reference}`] &&
			this.state.reference === this.state.focusedEditor &&
			this.state.subBlockID == this.state.refID
		) {
			if (localStorage.getItem('activeTextItem') == this.state.subBlockID) {
				const jodit = this[`ref_${this.state.reference}`];
				jodit.selection.insertHTML(
					`<input class=${
						this.props.module === 'contract' ? 'variable' : 'variable'
					} value="${variableValue}" placeholder="${variableValue}" data-id="${variableID}" id="${variableValue.replace(
						/ /g,
						'',
					)}" name="${variableValue}" size="${variableValue.length}" readonly />`,
				);
			}
		}
	};

	markAsAtomic(obj) {
		Object.defineProperty(obj, 'isAtom', {
			enumerable: false,
			value: true,
			configurable: false,
		});

		return obj;
	}
	handleContentChange = (e) => {
		let contentToSave = e;
		let updatedValue = this.applyClamp(
			this.state.previewType === 'm'
				? this.props.themes?.mobileFonts?.p?.fontSize
				: this.props.themes?.fonts?.p?.fontSize,
		);
		this.setState({
			isTextEdit: false,
			textEditValue: '',
		});

		if (e.includes('style=')) {
			if (!e.includes('font-size')) {
				if (updatedValue) {
					contentToSave = e.replace(
						/style='([^']*)'/,
						(match, existingStyles) =>
							`style='font-size:${updatedValue};${existingStyles}'`,
					);
				}
			}
		} else if (e.match(/<[^>]*>/)) {
			contentToSave = e.replace(/<([^\s>]+)/, `<$1 style='font-size:${updatedValue};'`);
		}

		if (_.has(this.props, 'isServiceItem')) {
			if (this.props?.text !== contentToSave) {
				this.props.setContent(
					contentToSave,
					this.state.isFluid && this.state.previewType === 'm',
				);
			}
		} else {
			if (this.props.text && this.props.text !== contentToSave) {
				if (this.state.sectionType && this.state.sectionType === 'loader') {
				} else {
					this.props.setContent(
						contentToSave,
						this.state.isFluid && this.state.previewType === 'm',
					);
				}
			}
		}
	};
	handleServiceSubTotalForClient = (sectionId) => {
		const sectionTables = [...(this.props?.tables || [])];
		const sections = [...(this.props?.sections || [])];

		const selectedSection = sections?.filter((e) => e?._id === sectionId)?.[0];
		const currentSectionTableData = sectionTables?.filter(
			(e) => e?._id === sectionId && e?.type === 'services',
		)?.[0];

		if (selectedSection && currentSectionTableData) {
			let currentSubTotal = 0;
			//currency
			const region = localStorage?.getItem('region') || 'us-east-1';
			let currencySymbol;
			if (region === 'ap-south-1') {
				currencySymbol = '₹';
			} else {
				currencySymbol = '$';
			}
			// ! updated to use user's currency symbol
			currencySymbol = this.props?.currencySymbol || currencySymbol;
			let subTotalWithStyling = selectedSection?.style?.subTotalValue + '';

			let subTotalValue =
				(subTotalWithStyling + '')
					?.replace(/ /g, ' ')
					.replace(/<\/?[^>]+(>|$)/g, '')
					.replace(/"/g, '') || '0';
			const services_selection = selectedSection?.style?.services_selection;
			if (services_selection === 2) {
				currentSubTotal = subTotalValue;
			} else {
				// 	//iterate and find the selected services sum
				const { values } = currentSectionTableData || {};
				for (let i = 0; i < values?.length; i++) {
					if (values?.[i]?.isSelected && values?.[i]?.show) {
						let { amount, quantity } = values?.[i] || {};
						amount =
							+(amount + '')
								?.replace(/ /g, ' ')
								.replace(/<\/?[^>]+(>|$)/g, '')
								.replace(/"/g, '') || 0;
						quantity =
							+(quantity + '')
								?.replace(/ /g, ' ')
								.replace(/<\/?[^>]+(>|$)/g, '')
								.replace(/"/g, '') || 0;
						currentSubTotal += amount * quantity;
					}
				}
			}
			currentSubTotal =
				currentSubTotal == 0
					? '0'
					: currencySymbol +
					  (currentSubTotal || 0)?.toLocaleString('en-IN', {
							currency: 'INR',
					  });

			return currentSubTotal;
		}

		return null;
	};
	getParsedContent = (content) => {
		const inputRegex = /<input[^>]*class="variable"[^>]*>/g;

		if (this.props.module !== 'contract') {
			const newText = content?.replace(inputRegex, (match) => {
				const styleMatch = match.match(/style="([^"]*)"/);
				let style = styleMatch ? styleMatch[1] : '';
				// style = style ? `${style}; border-bottom:none;` : 'border-bottom:none;';
				style = style
					? `${style}; border-bottom:none; border:none; background:none;`
					: 'border-bottom:none; border:none; background:none;';
				const dataIdMatch = match.match(/data-id="([^"]*)"/);
				let variable = _.filter(this.props.variables, { _id: dataIdMatch[1] });
				const dataId = dataIdMatch ? `data-id="${dataIdMatch[1]}"` : '';
				const variableData = variable?.[0] || {};

				let variableValue =
					variable?.[0]?.value ||
					(typeof variable?.[0]?.defaultValue === 'string'
						? variable?.[0]?.defaultValue?.trim()
						: variable?.[0]?.defaultValue) ||
					'';

				if (variable?.[0]?.blockId) {
					//handling values for subTotal variable
					const updatedValue = this.handleServiceSubTotalForClient(
						variable?.[0]?.blockId,
					);
					variableValue = updatedValue || variableValue;
				}

				//check if it is client varibales
				if (
					variableData &&
					clientVariblesMapper?.[variableData?.code] &&
					this.props?.module === '*'
				) {
					variableValue =
						this.props?.clientDetails?.[clientVariblesMapper?.[variableData?.code]] ||
						'';
				}

				if (
					variableData &&
					this.props?.client &&
					(variableData?.code === 'grand-total' ||
						variableData?.displayName === 'Grand Total')
				) {
					variableValue = this.props?.currencySymbol + this?.props?.clientGrandTotal;
				}

				if (
					variableData &&
					this.props?.module === '*' &&
					this.props?.client &&
					(variableData?.code === 'grand-total-in-words' ||
						variableData?.displayName === 'Grand Total In Words')
				) {
					const toWords = new ToWords({
						localeCode: 'en-IN',
						converterOptions: {
							currency: true,
							ignoreDecimal: false,
							ignoreZeroCurrency: false,
							doNotAddOnly: false,
						},
					});

					// if (this.props?.clientGrandTotal) {
					variableValue =
						this.props?.clientGrandTotal == 0
							? 'Zero'
							: toWords.convert(this.props?.clientGrandTotal);
					// }
				}

				return `<span class="variable" style="${style}${
					this.props.client ? '' : '; padding: 1px 10px'
				}" ${dataId}>${variableValue}</span>`;
			});

			return newText;
		} else {
			let newContent = '';
			let splitContent = content?.split(`<input`);
			_.map(splitContent, (text) => {
				if (text.includes('data-id=')) {
					text = '<input' + text;
					let dataID = text.split('data-id="')[1].split('"')[0];
					let splitText = text.split('readonly="">');
					let inputText = splitText[0] + 'readonly="">';
					let variable = _.filter(this.props.variables, { _id: dataID });
					let variableValue = '';
					if (variable?.length) {
						variableValue =
							variable?.[0]?.value || variable?.[0]?.defaultValue?.trim() || '';
					}
					// if (this.props.module !== 'contract') {
					// 	// let replaceText = text.replace(
					// 	// 	/value="[^"]*"/g,
					// 	// 	`value="${variableValue}" style='border-bottom:none'`,
					// 	// );
					// 	// replaceText = replaceText.replace(
					// 	// 	/size="[^"]*"/g,
					// 	// 	`size="${variableValue?.length}" style='border-bottom:none'`,
					// 	// );

					// 	let replaceText = `<span class='variable' style='border-bottom:none'>${variableValue}</span>`;

					// 	newContent = newContent + text.replace(inputText, replaceText);

					// 	return newContent;
					// }
					let replaceText =
						this.props.module === 'contract'
							? `<input class="variable ${variable[0]?._id}"
					
				 value="${variableValue}${
									_.has(variable[0], 'clientAction') &&
									variable[0].clientAction == 2
										? '  *'
										: ''
							  }" placeholder="${
									_.has(variable[0], 'placeholderText')
										? variable[0].placeholderText
										: variableValue
							  }" data-id="${variable[0]._id}" id="${variable[0]._id}"  ${
									_.has(variable[0], 'clientAction') &&
									variable[0].clientAction == 2
										? `readonly`
										: ''
							  }/>`
							: `<span class='variable_client'>${variableValue}</span>`;
					newContent = newContent + text.replace(inputText, replaceText);
				} else {
					newContent += text;
				}
			});
			return newContent;
		}
	};

	extractStyles = (element) => {
		// Check if the current element has style attributes
		const fontFamily = element?.style?.fontFamily || null;
		const fontSize = element.style.fontSize || null;
		const color = element.style.color || null;
		const textAlign = element.style.textAlign || null;
		const fontWeight = element.style.fontWeight || null;

		if (color) {
			return { fontFamily, fontSize, color, textAlign, fontWeight };
		}
		// If no color found in the parent, check its children for color
		for (let i = 0; i < element.children.length; i++) {
			const childStyles = this.extractStyles(element.children[i]);
			if (childStyles && childStyles.color) {
				// Return the color found in children, along with other styles if available

				return { fontFamily, fontSize, color: childStyles.color, textAlign, fontWeight };
			}
		}

		// If no styles are found in the element or its children

		return null;
	};

	extractStylesFromHtmlString = (htmlString) => {
		// Create a new DOMParser instance
		const parser = new DOMParser();

		// Parse the HTML string into a DOM document
		const doc = parser.parseFromString(htmlString, 'text/html');

		// Find the parent (e.g., <p> tag)
		const parent = doc.querySelector('p') || doc.body; // Fallback to body if no <p> is found

		// Extract styles recursively from the parent or its children
		const styles = this.extractStyles(parent);

		// Log the extracted styles
		return styles;
	};

	getStyles = () => {
		if (this[`ref_${this.state.reference}`]) {
			// Get the HTML content of the editor including styles
			const styledContent = this[`ref_${this.state.reference}`]?.getEditorValue();
			let styles = this.extractStylesFromHtmlString(styledContent);

			let color = styles?.color ? `#${rgbHex(styles.color)}` : '#000'; // Assuming rgbHex converts rgb to hex
			let splitFontFamily = styles?.fontFamily?.split(',')[0]?.trim();
			let family = splitFontFamily?.replace(/"/g, '');
			let fontSizeInt = styles?.fontSize?.replace('px', '');
			let fontWeight = styles?.fontWeight?.replace('px', '');

			if (this.props?.isFluid || this.props?.isLogicalForm) {
				const viewportWidth = window.innerWidth - 50;
				const secondValue = fontSizeInt?.match(/clamp\([^,]+, ([^,]+),/)[1];
				if (secondValue) {
					fontSizeInt = Math.round((parseFloat(secondValue) * viewportWidth) / 100);
				}
			}
			this.props.handleSelection(
				[family, fontSizeInt, color, styles?.textAlign, fontWeight],
				this.state.focusedEditor,
			);
		}
	};

	handleUnselectColor = () => {
		const systemSelection = window.getSelection();
		if (systemSelection && systemSelection.rangeCount > 0) {
			this.savedRange = systemSelection.getRangeAt(0).cloneRange();
		}
	};

	customButtonAction = (editor) => {
		const selection = editor.selection;
		if (selection && selection.range) {
			const range = selection.range;
			const rect = range.getBoundingClientRect();
			const editorRect = this.textRef.current.getBoundingClientRect();

			// Get the selected text
			const selectedText = range.toString();

			// Calculate position relative to the editor
			let top = rect.bottom - editorRect.top + window.scrollY;
			let left = rect.left - editorRect.left + window.scrollX;

			// Get popup dimensions
			const popupWidth = 300;
			const popupHeight = 200;

			// Ensure the popup doesn't go off the right edge
			if (left + popupWidth > editorRect.width) {
				left = editorRect.width - popupWidth;
			}

			// Ensure the popup doesn't go off the bottom edge
			if (top + popupHeight > editorRect.height) {
				top = rect.top - editorRect.top - popupHeight + window.scrollY;
			}

			// Generate new session ID if one doesn't exist
			let sessionId = this.state.sessionId;
			if (!sessionId) {
				sessionId = new ObjectID()?.toString();
			}

			this.setState({
				showPopup: true,
				popupPosition: {
					top: top,
					left: left,
				},
				aiSelectedText: selectedText,
				sessionId: sessionId,
			});
		}
	};

	closePopup = () => {
		this.setState({ isClosing: true });
		setTimeout(() => {
			this.setState({
				showPopup: false,
				isClosing: false,
				popupPosition: { top: 0, left: 0 },
			});
		}, 300); // This should match the CSS transition duration
	};
	closeColorPicker = () => {
		this.setState({
			showColorPicker: false,
		});

		this.savedRange = null;
	};
	handleSuggestedText = (type) => {
		this.setState(
			{
				suggestedAITextInput: type,
			},
			() => {
				this.handleGenerateText();
			},
		);
	};
	handleGenerateText = async () => {
		if (!this.state.websocketConnected) {
			this.setState({
				aiPromptLoading: false,
				textGenerated: false,
				generatedText: 'WebSocket connection not established. Please try again.',
			});
			return;
		}

		this.setState({ aiPromptLoading: true });

		if (this.state.selectedText !== '') {
			const message = {
				type: 'text_generation',
				text: this.state.selectedText,
				command: this.state.suggestedAITextInput || null,
				custom_prompt: this.state.aiTextInput || null,
			};

			try {
				await this.sendMessage(message);
				this.setState({ lastQuery: this.state.selectedText });
			} catch (error) {
				console.error('Error sending message:', error);
				this.setState({
					aiPromptLoading: false,
					textGenerated: false,
					generatedText: 'Error generating text. Please try again.',
				});
			}
		} else {
			const message = {
				type: 'text_generation',
				prompt: this.state.aiTextInput || 'generate some text',
			};

			try {
				await this.sendMessage(message);
				this.setState({ lastQuery: this.state.aiTextInput });
			} catch (error) {
				console.error('Error sending message:', error);
				this.setState({
					aiPromptLoading: false,
					textGenerated: false,
					generatedText: 'Error generating text. Please try again.',
				});
			}
		}
	};

	handleInsertText = (generatedText) => {
		const editor = this[`ref_${this.state.reference}`];
		if (editor && generatedText) {
			const { family, color, size } = this.state;
			const styledText = `<p style="font-family: ${family}; color: blue; font-size: ${size}px;">${generatedText}</p>`;

			if (this.state.selectedText) {
				editor.selection.remove();
			}
			editor.selection.insertHTML(this.state.selectedText + ' ' + styledText, false);
			this.handleContentChange(editor.getEditorValue());
			this.closePopup();
			this.setState({
				selectedText: '',
				generatedText: null,
				aiTextInput: '',
				suggestedAITextInput: null,
				aiPromptLoading: false,
				textGenerated: false,
				family: null,
				size: null,
				color: null,
			});
		}
	};

	handleReplaceText = (generatedText) => {
		const editor = this[`ref_${this.state.reference}`];

		if (editor && generatedText) {
			const { family, color, size } = this.state;
			const selection = editor.selection;
			if (selection && selection.range) {
				// Get the HTML content of the selection
				const selectedHTML = selection.area.innerHTML;

				// Remove selection markers and get clean HTML
				const cleanHTML = selectedHTML.replace(
					/<span[^>]*data-jodit-selection_marker[^>]*>.*?<\/span>/g,
					'',
				);
				const tagMatch = cleanHTML.match(
					/<(\w+)[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/,
				);
				let tagName = tagMatch?.[1] || '';
				let styles = tagMatch?.[2] || '';
				// console.log('Clean HTML:karthik====>', cleanHTML);
				// console.log('Tag Name:karthik====>', tagName);
				// console.log('Styles:karthik====>', styles);

				const styledText = `<${tagName} style="${styles}">${generatedText}</${tagName}>`;
				editor.selection.insertHTML(styledText, false);
			}

			if (this.state.selectedText) {
				editor.selection.remove();
			}

			this.handleContentChange(editor.getEditorValue());
			this.closePopup();
			this.setState({
				selectedText: '',
				generatedText: null,
				aiTextInput: '',
				suggestedAITextInput: null,
				aiPromptLoading: false,
				textGenerated: false,
				family: null,
				size: null,
				color: null,
			});
		}
	};

	handleClickOutside = (event) => {
		if (this.popupRef.current && !this.popupRef.current.contains(event.target)) {
			this.closePopup();
		}
		if (this.colorPickerRef.current && !this.colorPickerRef.current.contains(event.target)) {
			this.closeColorPicker();
		}
	};
	checkForContentChange = (content) => {
		this.handleTextChangeData();
		const children = this.textRef.current.children;

		if (children[0].offsetHeight > this.textRef.current.offsetHeight) {
			// this.props.increaseColumnGrid();
		} else if (
			children[0].offsetHeight + this.state.fontSize
				? this.state.fontSize
				: 16 < this.textRef.current.offsetHeight
		) {
			// this.props.decreaseColumnGrid();
		}
	};
	applyColorToSelection = (color) => {
		const jodit = this[`ref_${this.state.reference}`];

		if (this.savedRange) {
			try {
				// Restore the selection
				const selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(this.savedRange);

				// Apply color using execCommand
				jodit.execCommand('foreColor', false, color);

				// Update editor and trigger change
				jodit.setEditorValue(jodit.getEditorValue());
				this.handleContentChange(jodit.getEditorValue());
				// Close color picker
				this.props.closeTextPopup();
			} catch (error) {
				console.error('Error applying color:', error);
			}
		}
	};

	handleColorChange = (editor, tab) => {
		const jodit = this[`ref_${this.state?.reference}`];

		const selection = editor?.selection;
		if (editor) {
			if (selection && selection?.range) {
				// Save the selection
				this.savedRange = selection?.range?.cloneRange();

				// this.setState({
				// 	showColorPicker: true,
				// 	colorPickerPosition: {
				// 		left: editorRect.left,
				// 	},
				// });

				if (this.state?.isFluid || this.props?.isLogicalForm) {
					this.props?.openColorPicker(true, tab);
				}
			}
		} else {
			this.handleUnselectColor();
		}
	};

	handleChange = (content) => {
		// Call both the local handler and parent handler if provided
		if (this.props.onChange) {
			this.props.onChange(content);
		}
		// Any other local change handling
	};

	handlePaste = () => {
		// Call both the local handler and parent handler if provided
		if (this.props.onPaste) {
			this.props.onPaste();
		}
		// Any other local paste handling
	};
	handleTextChangeData = () => {
		if (this.state.isFluid) {
			const editor = this[`ref_${this.state.reference}`];

			if (this.state.fluidSublockID === this.props.fluidSublockID && editor) {
				const editorContainer = editor.container;
				let height =
					this.state.previewType === 'm'
						? editorContainer.clientHeight
						: this.heightRef.current?.clientHeight;
				if (_.has(this.props, 'triggerTextChange') && !this.props.adjustGridAreasTriggerd) {
					this.props?.triggerTextChange(
						height,
						this.heightRef.current?.clientWidth,
						this.state.fluidSublockID,
					);
				}
			}
		}
	};

	getTagNameFromSelection() {
		const selection = window.getSelection();
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const parentElement = range.commonAncestorContainer;

			if (parentElement.nodeType === Node.TEXT_NODE) {
				return parentElement?.parentElement?.tagName?.toLowerCase();
			} else if (parentElement.nodeType === Node.ELEMENT_NODE) {
				return parentElement?.tagName?.toLowerCase();
			}
		}
		return null;
	}
	applyClamp = (value) => {
		if (!value) return '';
		let data = parseInt(value, 10);
		let updatedValue = data;
		// Convert px to rem directly without clamp
		updatedValue = `${data / 16}rem`;
		return updatedValue;
	};
	applyFontThemeStyles = (stylesObject) => {
		if (!stylesObject) return '';

		return Object.entries(stylesObject)
			.filter(([key]) => key !== 'activeFontID' && key !== 'fontSize')
			.map(([key, value]) => {
				// Convert camelCase to kebab-case
				const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();

				// Remove quotes except for font families with spaces
				let cssValue = value;
				if (typeof value === 'string') {
					cssValue = value.replace(/['"]/g, '');
					if (key === 'fontFamily' && cssValue.includes(' ')) {
						const fonts = cssValue.split(',').map((font) => {
							font = font.trim();
							return font.includes(' ') ? `"${font}"` : font;
						});
						cssValue = fonts.join(', ');
					}
					if (key === 'color' || cssKey.includes('color')) {
						cssValue = cssValue.replace(/['"]/g, '');
					}
				}

				return `${cssKey}: ${cssValue}`;
			})
			.join('; ');
	};

	render() {
		const themes = this.props.themes || {};
		let themeStyles = '';
		if (Object.keys(themes).length > 0) {
			themeStyles = `
						h1 {
							${this.applyFontThemeStyles({
								...themes?.fonts?.h1,
								...themes?.colors?.text?.h1,
							})};
						}
						h2 {
							${this.applyFontThemeStyles({
								...themes?.fonts?.h2,
								...themes?.colors?.text?.h2,
							})};
							
						}
						h3 {
							${this.applyFontThemeStyles({
								...themes?.fonts?.h3,
								...themes?.colors?.text?.h3,
							})};
							margin: 0px;
							
						}
						h4 {
							${this.applyFontThemeStyles({
								...themes?.fonts?.h4,
								...themes?.colors?.text?.h4,
							})};
						}
						h5 {
							${this.applyFontThemeStyles({
								...themes?.fonts?.h5,
								...themes?.colors?.text?.h5,
							})};
						}
						h6 {
							${this.applyFontThemeStyles({
								...themes?.fonts?.h6,
								...themes?.colors?.text?.h6,
							})};
						}
						p, p > span, ul, ol, li, li > span {

							${this.applyFontThemeStyles({
								...themes?.fonts?.p,
								...themes?.colors?.text?.p,
							})}
						}
						event, service {
							${this.applyFontThemeStyles({
								...themes?.fonts?.event?.eventTitle,
								...themes?.colors?.event?.eventTitle,
							})}
						}
						`;
		}
		if (this.props.client && this.props.isFluid) {
			return (
				<div
					className={`text_component component
				${_.has(this.props, 'className') ? this.props.className : ''}`}
					onMouseEnter={() => {
						if (this.state.preview !== true) {
							this.setState({
								showElementOptions: true,
								//focusedEditor: this.state.reference,
							});
						}
					}}
					onMouseLeave={() =>
						this.setState({
							showElementOptions: false,
							//focusedEditor: null,
						})
					}
					style={{
						height: '100%',

						...(_.has(this.props, 'divStyles') ? this.props.divStyles : {}),

						// overflow: 'hidden',...
						...(this.state.isFluidButton
							? {
									display: 'flex !important',
									alignItems: 'center',
									justifyContent: 'center',
							  }
							: {}),
						border:
							!this.state.preview &&
							this.state.isClicked &&
							this.state.subBlockID === this.state.refID
								? // ? '1px solid #3474e0'
								  `1px solid ${this.getOppositeHexColor(this.state?.sectionBg)}`
								: '',
						transformStyle: 'all 0.3s ease-in-out',
						// backgroundColor: this.state.showElementOptions && 'rgba(255,255,255,0.15)',
						backgroundColor:
							!this.state.isClicked &&
							this.state.showElementOptions &&
							this.hexToRgba(this.getOppositeHexColor(this.state?.sectionBg), 0.1),
						// borderRadius: this.state.showElementOptions && '20px',
						...(this.state.isFluid
							? {
									display: this.state?.isFluidButton ? 'flex' : 'block',
									gridArea: 'inherit',

									border: 'none',
							  }
							: {}),
					}}
					ref={this.textRef}
				>
					<Helmet>
						<style>{themeStyles}</style>
					</Helmet>
					{/* Custom toolbar */}

					<div
						dangerouslySetInnerHTML={{
							__html: this.props.client
								? this.getParsedContent(this.props.text)
								: this.props.text,
						}}
						style={{
							...(this.state.isFluid
								? {
										display: this.props?.verticalAlign ? 'flex' : 'block',
										flexDirection: this.props?.verticalAlign && 'column',
										justifyContent: this.props?.verticalAlign
											? this.props?.verticalAlign
											: '',
										height: this.props?.verticalAlign ? '100%' : 'auto',
										gridArea: 'inherit',
										flex: 1,
								  }
								: ''),
						}}
					/>
				</div>
			);
		}

		return (
			<>
				<div
					className={`text_component component  
					${_.has(this.props, 'className') ? this.props.className : ''}`}
					onMouseEnter={() => {
						if (this.state.preview !== true) {
							this.setState({
								showElementOptions: true,
								//focusedEditor: this.state.reference,
							});
						}
					}}
					onMouseLeave={() =>
						this.setState({
							showElementOptions: false,
							//focusedEditor: null,
						})
					}
					style={{
						height: '100%',

						...(_.has(this.props, 'divStyles') ? this.props.divStyles : {}),

						// overflow: 'hidden',...
						...(this.state.isFluidButton
							? {
									display: 'flex !important',
									alignItems: 'center',
									justifyContent: 'center',
							  }
							: {}),
						border:
							!this.state.preview &&
							this.state.isClicked &&
							this.state.subBlockID === this.state.refID
								? // ? '1px solid #3474e0'
								  `1px solid ${this.getOppositeHexColor(this.state?.sectionBg)}`
								: '',
						transformStyle: 'all 0.3s ease-in-out',
						// backgroundColor: this.state.showElementOptions && 'rgba(255,255,255,0.15)',
						backgroundColor:
							!this.state.isClicked &&
							this.state.showElementOptions &&
							this.hexToRgba(this.getOppositeHexColor(this.state?.sectionBg), 0.1),
						// borderRadius: this.state.showElementOptions && '20px',
						...(this.state.isFluid
							? {
									display: this.props?.verticalAlign ? 'flex' : 'contents',
									flexDirection: this.props?.verticalAlign && 'column',
									justifyContent: this.props?.verticalAlign
										? this.props?.verticalAlign
										: '',
									height: this.props?.verticalAlign ? '100%' : 'auto',
									gridArea: 'inherit',
									border: 'none',
							  }
							: ''),
					}}
					ref={this.textRef}
					// onClick={() => (this.state.preview !== true ? this.getStyles() : '')}
					onClick={(e) => {
						this.handleInputClick(e);
						this.state.preview !== true ? this.getStyles() : '';
					}}
					id="text_component_ID"
				>
					<Helmet>
						<style>{`
							${themeStyles}
							#text_component_ID a:-webkit-any-link {
								color: inherit;
								text-decoration: none;
							}
							#text_component_ID a {
								color: inherit ;
								text-decoration: none;
							}
							#text_component_ID p {
								margin-bottom: 2px !important;
								// overflow:hidden;
							}
						`}</style>
					</Helmet>
					{/* Custom toolbar */}

					{/* Jodit Editor */}
					{this.state.preview ? (
						this.state.isFluid && this.state.previewType === 'm' ? (
							<JoditEditor
								ref={this[`ref_${this.state.reference}`]}
								id={`editor_${this.state.reference}`}
								className={`editor_${this.state.subBlockID}`}
								value={`${this?.props?.text == '<p></p>' ? '' : this?.props?.text}`}
								config={this.config}
								// preferred to use only this option to update the content for performance reasons
								onBlur={(newContent) => {
									this.handleContentChange(newContent);
								}}
								onChange={(newContent) => {
									this.state.isFluid
										? this.checkForContentChange(newContent)
										: '';
								}}
							/>
						) : (
							<div
								dangerouslySetInnerHTML={{
									__html: this.props.client
										? this.getParsedContent(this.props.text)
										: this.props.text,
								}}
								style={{
									...(this.state.isFluid
										? {
												display: this.props.client ? 'block' : 'flex',
												gridArea: 'inherit',
												// flex: 1,
										  }
										: {}),
								}}
							/>
						)
					) : (
						<div ref={this.heightRef}>
							<JoditEditor
								ref={this[`ref_${this.state.reference}`]}
								id={`editor_${this.state.reference}`}
								className={`editor_${this.state.subBlockID}`}
								value={`${this?.props?.text == '<p></p>' ? '' : this?.props?.text}`}
								config={this.config}
								// preferred to use only this option to update the content for performance reasons
								onBlur={(newContent) => {
									this.handleContentChange(newContent);
								}}
								onChange={(newContent) => {
									this.state.isFluid
										? this.checkForContentChange(newContent)
										: '';
								}}
								onPaste={this.handlePaste}
							/>
						</div>
					)}
					{/* {(this.state.showEditTextLabel && this.state.showElementOptions) ||
					(this.state.isClicked && this.state.activeSubBlockId === this.state.refID) ? (
						<a
							className="element-edit-label"
							style={{
								fontSize: '7px',
								backgroundColor: this.getOppositeHexColor(this.state?.sectionBg),
								color: this.state?.sectionBg,
							}}
						>
							Edit Text
						</a>
					) : (
						''
					)} */}

					{/* {this.state.showElementOptions && _.has(this.props, 'label') && this.props.label ? (
						<legend
							className="element-edit-label"
							style={{
								position: 'absolute',
								right: 0,
								top: -23,
								left: 'auto',
								fontSize: '7px',
								// color: '#fff',
								width: 'fit-content',
								backgroundColor: this.getOppositeHexColor(this.state?.sectionBg),
								color: this.state?.sectionBg,
							}}
						>
							{' '}
							{this.props.label}
						</legend>
					) : (
						''
					)} */}

					{this.state.showPopup && (
						<div
							ref={this.popupRef}
							className={`custom-popup ${this.state.isClosing ? 'closing' : ''}`}
							style={{
								position: 'absolute',
								top: `${this.state.popupPosition.top}px`,
								left: `${this.state.popupPosition.left}px`,
								zIndex: 1000,
								padding: '10px',
								transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
							}}
						>
							<Ai_InputComponent
								sessionId={this.state.sessionId}
								agentType={this.state.agentType}
								handleReplaceText={this.handleReplaceText}
								handleInsertText={this.handleInsertText}
								handleGenerateText={this.handleGenerateText}
								editor={this[`ref_${this.state.reference}`]} // Pass the editor reference
								aiSelectedText={this.state.aiSelectedText}
							/>
						</div>
					)}
				</div>
			</>
		);
	}
}

export default App;
