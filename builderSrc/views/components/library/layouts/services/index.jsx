import React, { Component } from 'react';
import Text from '../../elements/text';
// import ImageItem from '../../elements/image';
import _ from 'lodash';
import '../index.scss';
// import Button from '../../elements/button';
// import { ReactComponent as Edit } from '../actions/edit.svg';
// import { ReactComponent as Copy } from '../actions/copy.svg';
import Down from '../actions/down.jsx';
import Up from '../actions/up.jsx';
import Delete from '../actions/delete.jsx';

import Edit from '../actions/edit.jsx';
import Copy from '../actions/copy.jsx';
import ServiceItem from './serviceItem.jsx';
import ReactPlayer from 'react-player';
const padding = ['0px', '36px', '56px', '76px', '96px'];
const services_selection = ['one', 'multiple', 'none'];
const services_style = ['rows', '3 columns', '2 columns'];

import { AddBlock } from '../../../builder_client_common.jsx';
const popupOptions = {
	buttons: ['bold', 'italic', 'underline', 'link', 'ul', 'ol'],
};
const animationSpeedSec = [{ slow: 10 }, { medium: 5 }, { fast: 1 }];
class Layout1 extends Component {
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
			tables: props.tables,
			client: props.client,
			activeSubBlockId: props.activeSubBlockId,
			activeBlockID: null,
			section: props.section,
			isActiveSection: props.isActiveSection,
			activeAnimation: props.activeAnimation,
			animationSpeed: props.animationSpeed,
			animationDirection: props.animationDirection,
			animationType: props.animationType,
			editableCheck: true,
			serviceSubtotalvalueUpdated: false,
			restrictServiceSelection: props?.restrictServiceSelection,

			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,

			activeVariableID: props.activeVariableID,
			activeVariableName: props.activeVariableName,
			variables: props.variables,
			triggerFont: props.triggerFont,
			socialMediaLinks: props.socialMediaLinks,
		};

		this.blockRef = React.createRef();
		this.boxRefs = [];
		this.titleEditorRef = React.createRef();
		this.descriptionEditorRef = React.createRef();
	}
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
		this.animateSection();
		if (this.props.previewType === 'm') {
			this.setState({
				style: { ...this.state.style, services_style: 1 },
			});
		}
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
		if (this.state.activeFontColor !== nextProps.activeFontColor) {
			this.setState({
				activeFontColor: nextProps.activeFontColor,
			});
		}
		if (this.state.socialMediaLinks !== nextProps.socialMediaLinks) {
			this.setState({
				socialMediaLinks: nextProps.socialMediaLinks,
			});
		}
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
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
		if (this.state.client !== nextProps.client) {
			this.setState({
				client: nextProps.client,
			});
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
			this.setState(
				{
					blocks: nextProps.blocks,
				},
				() => this.handleSubTotalValue(),
			);
		}
		if (this.state.section !== nextProps.section) {
			this.setState({
				section: nextProps.section,
			});
		}
		if (this.state.style !== nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
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
			this.setState(
				{
					previewType: nextProps.previewType,
				},
				() => {
					if (nextProps.previewType === 'm') {
						this.setState({
							style: { ...this.state.style, services_style: 1 },
						});
					}
				},
			);
		}
		if (this.state.tables !== nextProps.tables) {
			this.setState({
				tables: nextProps.tables,
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
		if (this.state.restrictServiceSelection !== nextProps.restrictServiceSelection) {
			this.setState({
				restrictServiceSelection: nextProps.restrictServiceSelection,
			});
		}

		// for bg types in service block -Abdullah
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
		if (this.state.variables !== nextProps.variables) {
			this.setState({
				variables: nextProps.variables,
			});
		}
	};
	reanimateSection = () => {
		if (this.blockRef.current) {
			if (this.state.activeAnimation > 0) {
				this.observer?.observe(this.blockRef.current);
			}
		}

		Object.values(this.boxRefs).forEach((ref, index) => {
			if (ref) {
				ref.style.animationName = 'unset';
				ref.style.animationDuration = 'unset';
				ref.style.animationTimingFunction = 'unset';
				ref.style.animationFillMode = 'unset';
			}
		});

		if (this.blockRef) {
			this.blockRef.current.style.animationName = 'unset';
			this.blockRef.current.style.animationDuration = 'unset';
			this.blockRef.current.style.animationTimingFunction = 'unset';
			this.blockRef.current.style.animationFillMode = 'unset';
		}

		this.animateSection();
	};
	animateSection = () => {
		if (this.state.activeAnimation > 0) {
			// let animationNames =
			// 	this.state.animationType === 'slideIn' ? this.state.animationDirection : 'fadeIn';
			// let animationDurations = `${this.getAnimationTiming()}s`;
			// let animationTimingFunctions = 'ease';
			// let animationFillModes = 'forwards';
			this.observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							if (this.state.activeAnimation === 1) {
								Object.values(this.boxRefs).forEach((ref, index) => {
									if (ref) {
										ref.style.animationName =
											this.state.animationType === 'slideIn'
												? this.state.animationDirection
												: 'fadeIn';
										ref.style.animationDuration = `${this.getAnimationTiming()}s`;
										ref.style.animationTimingFunction = 'ease';
										ref.style.animationFillMode = 'forwards';
									}
								});
							} else {
								if (this.blockRef) {
									if (this.blockRef) {
										this.blockRef.current.style.animationName =
											this.state.animationType === 'slideIn'
												? this.state.animationDirection
												: 'fadeIn';
										this.blockRef.current.style.animationDuration = `${this.getAnimationTiming()}s`;
										this.blockRef.current.style.animationTimingFunction =
											'ease';
										this.blockRef.current.style.animationFillMode = 'forwards';
									}
								}
							}
						}
						// else {
						// 	entry.target.classList.remove('visibled');
						// 	this.boxRefs.forEach((ref, index) => {
						// 		if (ref) {
						// 			ref.classList.remove('visibled');
						// 		}
						// 	});
						// }
					});
				},
				{ threshold: 0.1 },
			);
		}
	};

	handleClickOutside = (event) => {
		if (this.blockRef.current && !this.blockRef.current.contains(event.target)) {
			this.setState({
				showBlockActions: false,
			});
		}
	};

	toggleSideBar = (e) => {
		this.setState({
			showBlockActions: true,
		});
		this.props.handleSideBar(e, this.props._id);
	};
	handleDeleteSection = (e) => {
		e?.stopPropagation();
		this.toggleSideBar({ showSidebar: false });
		this.props.deleteSection(this.props._id);
	};
	getRowValue = (e, blockId, exclude = null) => {
		if (this.state.client && exclude == null) {
			let tables = [...this.state.tables];

			let table = _.filter(tables, { _id: this.state.sectionID })[0]?.values;
			let element = _.filter(table, { blockId })[0];
			if (table && element) {
				return element[e] === '' ? e === 'currency' ? <span>&#8377;</span> : e : element[e];
			} else {
				return '';
			}
		} else if (e === 'isSelectedd') {
			let tables = [...this.state.tables];
			let table = _.filter(tables, { _id: this.state.sectionID })[0]?.values;
			let tableStyle = _.filter(tables, { _id: this.state.sectionID })[0]?.styles;
			let element = _.filter(table, { blockId })[0];

			if (tableStyle?.services_selection === 0) {
				let anySelected = _.filter(table, { isSelected: true });

				return anySelected.length > 0 ? element[e] : false;
			}

			if (table && element) {
				let re =
					element[e] === '' ? e === 'currency' ? <span>&#8377;</span> : e : element[e];
				return re;
			} else {
				return '';
			}
		} else {
			let blocks = [...this.state.blocks];
			let block = _.filter(blocks, { _id: blockId })[0];
			let element = block?.subBlocks[0];
			if (block && element) {
				return element[e] === '' ? e === 'currency' ? <span>&#8377;</span> : e : element[e];
			} else {
				return '';
			}
		}
	};
	setRowValue = (e, type, blockId) => {
		if (this.state.client) {
			let tablets = _.cloneDeep(this.state.tables);

			let arr = [];
			_.map(tablets, (table, k) => {
				if (table._id === this.state.sectionID) {
					_.map(table.values, (value, k) => {
						if (value.blockId === blockId) {
							value[type] = e.target.value;
						}
					});
				}
				arr.push(table);
			});

			if (this.getRowValue('title', blockId, true) !== e.target.value) {
				this.setState({ tables: arr }, () => {
					this.props.setTable(arr);
				});
			} else {
				this.setState({
					tables: arr,
				});
			}
		} else {
			let blocks = _.cloneDeep(this.state.blocks);
			let arr = [];
			_.map(blocks, (table, k) => {
				if (table._id === blockId) {
					_.map(table.subBlocks, (value, k) => {
						if (k == 0) {
							value[type] = e.target.value;
						}
					});
				}
				arr.push(table);
			});
			this.setState(
				{
					blocks: arr,
				},
				() => {
					let section = { ...this.state.section, blocks: arr };

					this.props.setActiveSection(section);
				},
			);
		}
	};

	handleServiceSelect = (blockID, type, val) => {
		this.props.handleServiceSelect(blockID, type, val);
	};
	returnDisplayItem = (e) => {
		let display = 'flex';
		let labels = this.state.style.labels;
		let label = labels.find((obj) => obj.hasOwnProperty(e));

		display = label && label[e] == true ? 'flex' : 'none';

		return display;
	};
	returnDisplayItemSub = (e, blockID) => {
		let display = 'flex';
		let labels = _.filter(this.state.blocks, { _id: blockID })[0]?.labels;
		if (labels) {
			let label = labels.find((obj) => obj.hasOwnProperty(e));

			display = label && label[e] == true ? 'flex' : 'none';

			return display;
		} else {
			return 'flex';
		}
	};
	returnDisplayItemSubUnitPrice = (e, blockID) => {
		let display = true;
		let labels = _.filter(this.state.blocks, { _id: blockID })[0]?.labels;
		if (labels) {
			let label = labels.find((obj) => obj.hasOwnProperty(e));

			display = label && label[e] == true ? true : false;

			return display;
		} else {
			return true;
		}
	};
	handleBlock = (e) => {
		this.props.selectBlock('b');
	};

	markAsAtomic(obj) {
		Object.defineProperty(obj, 'isAtom', {
			enumerable: false,
			value: true,
			configurable: false,
		});

		return obj;
	}

	handleServiceSubTotal = (e, type) => {
		if (this.state.style[type] !== e) {
			let activeSection = {
				...this.props?.activeSection,
				style: {
					...this.props?.activeSection?.style,
					[type]: e.target.value,
				},
			};

			this.setState(
				{
					activeSection,
				},
				() => {
					this.props.client ? '' : this.props.setActiveSection(activeSection);
				},
			);
		}
	};

	handleDuplicate = (e) => {
		e?.stopPropagation();
		this.toggleSideBar({ showSidebar: false });
		this.props.duplicateBlock(this.props._id);
	};
	hanldeAddBlock = (e) => {
		// e.stopPropagation();
		this.props.showAddBlock(e);
	};
	getAnimationTiming = () => {
		const matchedAnimation = animationSpeedSec.find(
			(item) => Object.keys(item)[0] === this.state.animationSpeed, // Return the result of the comparison
		);

		const speed = matchedAnimation ? matchedAnimation[this.state.animationSpeed] : 0;

		return speed;
	};

	handleSubTotalValue = () => {
		if (!this.state?.serviceSubtotalvalueUpdated) {
			const blocks = [...this.state.blocks];

			let subTotalValue = 0;
			let editableCheck = true;
			for (let i = 0; i < blocks?.length; i++) {
				const { amount, quantity } = blocks?.[i]?.subBlocks?.[0] || {};
				let price = amount * quantity;
				if (price > 0 && editableCheck) {
					editableCheck = false;
				}
				subTotalValue += price;
			}

			if (!editableCheck) {
				const serviceSection = { ...(this?.props?.section || {}) };
				serviceSection.style = {
					...(serviceSection.style || {}),
					subTotalValue: subTotalValue,
				};
				if (this?.props?.handleUpdateSectionData) {
					this.props?.handleUpdateSectionData(serviceSection, true);
				}
			}

			this.setState({ editableCheck, serviceSubtotalvalueUpdated: true });
		}
	};

	handleServiceSubTotalForClient = () => {
		const sectionTables = [...(this.state?.tables || [])];
		const section = this.state.section;
		let currentSubTotal = 0;

		//currency
		const region = localStorage?.getItem('region') || 'ap-south-1';
		let currencySymbol = region === 'ap-south-1' ? '₹' : '$';

		//we need to also maintain the incoming styling from builder
		let subTotalWithStyling = section?.style?.subTotalValue + '';
		let subTotalValue =
			(subTotalWithStyling + '')
				?.replace(/&nbsp;/g, ' ')
				.replace(/<\/?[^>]+(>|$)/g, '')
				.replace(/"/g, '') || '0';

		const services_selection = section?.style?.services_selection;
		if (services_selection === 2) {
			currentSubTotal = subTotalValue;
		} else {
			//filtering out current service from sectionTable
			let currentSectionTableData;

			for (let i = 0; i < sectionTables?.length; i++) {
				if (
					sectionTables?.[i]?.type === 'services' &&
					sectionTables?.[i]?._id === section?._id
				) {
					currentSectionTableData = sectionTables?.[i];
					break;
				}
			}

			//iterate and find the selected services sum
			const { values } = currentSectionTableData || {};
			for (let i = 0; i < values?.length; i++) {
				if (values?.[i]?.isSelected && values?.[i]?.show) {
					let { amount, quantity } = values?.[i] || {};
					amount =
						+(amount + '')
							?.replace(/&nbsp;/g, ' ')
							.replace(/<\/?[^>]+(>|$)/g, '')
							.replace(/"/g, '') || 0;
					quantity =
						+(quantity + '')
							?.replace(/&nbsp;/g, ' ')
							.replace(/<\/?[^>]+(>|$)/g, '')
							.replace(/"/g, '') || 0;
					currentSubTotal += amount * quantity;
				}
			}
		}

		// Format the number with proper currency symbol and formatting
		return currencySymbol + (currentSubTotal || 0)?.toLocaleString('en-IN');
	};
	applyFontThemeStyles = (stylesObject) => {
		if (!stylesObject) return {};

		return Object.entries(stylesObject)
			.filter(([key]) => key !== 'activeFontID' && key !== 'lineHeight')
			.reduce((acc, [key, value]) => {
				// Convert camelCase to proper CSS property
				const cssKey = key
					.replace(/[A-Z]/g, (match) => `-${match?.toLowerCase()}`)
					.replace(/^-/, '');

				// Handle different value types
				let cssValue = value;
				if (typeof value === 'string') {
					if (key === 'fontFamily') {
						cssValue = value
							.split(',')
							.map((font) => {
								font = font.trim();
								return font.includes(' ') ? `"${font}"` : font;
							})
							.join(',');
					} else if (key === 'color' || cssKey.includes('color')) {
						cssValue = value.replace(/['"]/g, '').trim();
					} else {
						cssValue = value.replace(/['"]/g, '').trim();
					}
				}

				acc[cssKey] = cssValue;
				return acc;
			}, {});
	};

	render() {
		let subTotal;
		if (this.state.client) {
			subTotal = this.handleServiceSubTotalForClient();
		}

		return (
			<div
				id="serviceBlockId"
				className={`block ${this.state.showBlockOptions ? 'borderedBlock' : ''}`}
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
				style={{
					padding: `${
						this.state.style.padding ? padding[this.state.style.padding] : '0px'
					} ${this.state.previewType === 'm' && this.state.preview ? '14px' : '56px'}`,

					backgroundColor:
						this.state.style?.backgroundType !== 'video' &&
						this.state.style?.backgroundType !== 'image' &&
						this.state.style?.sectionBackgroundColor,
					backgroundImage:
						this.state.style?.backgroundType == 'image' &&
						`url(${this.state.style.backgroundImageURL})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					position: 'relative',

					...(_.has(this.state.style, 'heading')
						? { flexDirection: 'column', display: 'flex' }
						: {}),
				}}
				ref={this.blockRef}
				data-id={this.state.sectionID}
			>
				{/* overlay div */}
				{this.state.style?.backgroundType !== 'color' && (
					<div
						className="bg-overlay"
						style={{
							backgroundColor: this.state.style?.bgOverlayColor,
							opacity: this.state.style?.bgOverlayOpacity / 100,
						}}
					></div>
				)}

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

				{this.state.showBlockActions && this.state.preview == false ? (
					<div className="block-action-bar">
						{/* <span
							onClick={() => {
								if (
									!(
										this.props.index ===
										this.props.itemsLength
									)
								) {
									this.props.moveItem(
										this.props.index,
										this.props.index + 1
									);
								}
							}}
							disabled={
								this.props.index === this.props.itemsLength
							}
							style={{
								cursor:
									this.props.index === this.props.itemsLength
										? 'not-allowed'
										: 'pointer',
							}}
						>
							<Down />
						</span>
						<span
							onClick={() => {
								if (!(this.props.index === 1)) {
									this.props.moveItem(
										this.props.index,
										this.props.index - 1
									);
								}
							}}
							disabled={this.props.index === 1}
							style={{
								cursor:
									this.props.index === 1
										? 'not-allowed'
										: 'pointer',
							}}
						>
							<Up />
						</span>
						<span onClick={(e) => this.handleDeleteSection(e)}>
							<Delete />
						</span> */}
						<span className="tooltip" onClick={(e) => this.handleBlock(e)}>
							<Edit />
							<label className="tooltip-text">Block&nbsp;Settings</label>
						</span>{' '}
						{!this.props?.activeModule?.showAsSlide && (
							<>
								{' '}
								<span className="tooltip" onClick={(e) => this.handleDuplicate(e)}>
									<Copy />
									<label className="tooltip-text">Duplicate</label>
								</span>
								<span
									className="tooltip"
									onClick={() => {
										if (!(this.props.index === this.props.itemsLength)) {
											this.props.moveItem(
												this.props.index,
												this.props.index + 1,
											);
										}
									}}
									disabled={this.props.index === this.props.itemsLength}
									style={{
										cursor:
											this.props.index === this.props.itemsLength
												? 'not-allowed'
												: 'pointer',
									}}
								>
									<Down />
									<label className="tooltip-text">Down</label>
								</span>
								<span
									className="tooltip"
									onClick={() => {
										if (!(this.props.index === 1)) {
											this.props.moveItem(
												this.props.index,
												this.props.index - 1,
											);
										}
									}}
									disabled={this.props.index === 1}
									style={{
										cursor: this.props.index === 1 ? 'not-allowed' : 'pointer',
									}}
								>
									<Up />
									<label className="tooltip-text">Up</label>
								</span>
							</>
						)}
						<span className="tooltip" onClick={(e) => this.handleDeleteSection(e)}>
							<Delete />
							<label className="tooltip-text">Delete</label>
						</span>
					</div>
				) : (
					''
				)}
				{!this.props?.activeModule?.showAsSlide && this.state.showBlockOptions ? (
					<div className="add-block-new-container">
						<div
							onClick={(e) => {
								e.stopPropagation();
								this.hanldeAddBlock(e);
							}}
							className="addBlankContainer"
						>
							<AddBlock />
							<span className="tooltip-text">Add Layout</span>
						</div>
						<div className="addBlockDividerContainer">
							<div className="addBlockDivider"></div>
						</div>
						<div
							className="addBlankContainer"
							onClick={(e) => {
								e.stopPropagation();
								this.props.handleAddLayout(null, true);
							}}
							style={{
								cursor: 'pointer',
								transition: 'color 0.3s ease',
								fontSize: '10px',
								fontWeight: 'bold',
								textAlign: 'center',
								width: '71.8px',
							}}
						>
							{this.state.isElement !== true ? (
								<div className="addBlank">Add Card</div>
							) : (
								''
							)}
						</div>
					</div>
				) : (
					''
				)}
				<div
					className="layout"
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 40,
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1,
						height: 'fit-content',
					}}
				>
					{_.has(this.state.style, 'toast') && this.state.style.toast == false ? (
						''
					) : _.has(this.state.style, 'services_selection') &&
					  this.state.style.services_selection !== 2 ? (
						<div
							className="service-table-header"
							style={{
								width: '100%',
							}}
						>
							<a
								style={{
									...this.applyFontThemeStyles({
										...this.props?.themes?.fonts?.p,
										...this.props?.themes?.colors?.text?.p,
									}),
								}}
							>{`Select ${
								this.state.style.services_selection == 0
									? 'a service'
									: 'one or more services'
							} below`}</a>
							{_.has(this.state.style, 'selection_is_required') &&
							this.state.style.selection_is_required ? (
								<span
									style={{
										...this.applyFontThemeStyles({
											...this.props?.themes?.fonts?.p,
											...this.props?.themes?.colors?.text?.p,
										}),
									}}
								>
									*Required
								</span>
							) : (
								<span
									style={{
										...this.applyFontThemeStyles({
											...this.props?.themes?.fonts?.p,
											...this.props?.themes?.colors?.text?.p,
										}),
									}}
								>
									Optional
								</span>
							)}
						</div>
					) : (
						''
					)}
					{_.has(this.state.style, 'labels') &&
					this.returnDisplayItem('subTotal') !== 'none' ? (
						<div
							className="service-table-header"
							style={{
								width: '100%',
								borderLeft: 'none',
								height: 'auto',
								display: 'flex',
								alignItems: 'center',
								backgroundColor: _.has(this.state.style, 'titleBackgroundColor')
									? this.state.style.titleBackgroundColor
									: '#000',
							}}
						>
							<a
								style={{
									minWidth: '100px',
									...this.applyFontThemeStyles({
										...this.props?.themes?.fonts?.p,
										...this.props?.themes?.colors?.text?.p,
									}),
									...(this.state.previewType === 'm'
										? {
												...this.applyFontThemeStyles({
													...this.props?.themes?.mobileFonts?.p,
												}),
										  }
										: {}),
								}}
							>
								<Text
									isWorkflow={this.props.isWorkflow}
									setTriggerFont={(e) =>
										this.props?.client ? '' : this.props.setTriggerFont(e)
									}
									triggerFont={this.state.triggerFont}
									text={`${
										this.state.style?.subTotalTitle || '<p>Add Title here</p>'
									}`}
									setContent={(e) =>
										this.handleServiceSubTotal(
											{
												target: {
													value: e,
												},
											},
											'subTotalTitle',
										)
									}
									setTab={(e) => this.props.handleSetTab(e)}
									handleSelection={(e, activeTextBlock) =>
										this.props.handleBSelection(e, activeTextBlock)
									}
									actionType={this.state.actionType}
									actionValue={this.state.actionValue}
									preview={this.state.client}
									refID={this.state.sectionID + 'subTotalTitle'}
									reference={'subTotalTitle' + this.state.sectionID}
									subBlockID={this.state.sectionID + 'subTotalTitle'}
									clearStyling={() => this.props.clearStyle()}
									// theme={this.props?.themes}
								/>
							</a>
							<div
								className="subTotal"
								style={{
									display: 'flex',
									flexDirection: 'column',
									marginLeft: 'auto',
								}}
							>
								<div
									style={{
										fontSize: 14,
										...this.applyFontThemeStyles({
											...this.props?.themes?.fonts?.p,
											...this.props?.themes?.colors?.text?.p,
										}),
										...(this.state.previewType === 'm'
											? {
													...this.applyFontThemeStyles({
														...this.props?.themes?.mobileFonts?.p,
													}),
											  }
											: {}),
									}}
								>
									<Text
										isWorkflow={this.props.isWorkflow}
										setTriggerFont={(e) => this.props.setTriggerFont(e)}
										triggerFont={this.state.triggerFont}
										text={`${this.state.style?.subTotal || '<p>Sub Total</p>'}`}
										setContent={(e) =>
											this.handleServiceSubTotal(
												{
													target: {
														value: e,
													},
												},
												'subTotal',
											)
										}
										setTab={(e) => this.props.handleSetTab(e)}
										handleSelection={(e, activeTextBlock) =>
											this.props.handleBSelection(e, activeTextBlock)
										}
										actionType={this.state.actionType}
										actionValue={this.state.actionValue}
										preview={this.state.client}
										refID={this.state.sectionID + 'subTotal'}
										reference={'subTotal' + this.state.sectionID}
										subBlockID={this.state.sectionID + 'subTotal'}
										clearStyling={() => this.props.clearStyle()}
										// theme={this.props?.themes}
									/>
								</div>
								<div
									style={{
										fontSize: 14,
										marginTop: 4,
										textAlign: 'right',
										...this.applyFontThemeStyles({
											...this.props?.themes?.fonts?.p,
											...this.props?.themes?.colors?.text?.p,
										}),
										...(this.state.previewType === 'm'
											? {
													...this.applyFontThemeStyles({
														...this.props?.themes?.mobileFonts?.p,
													}),
											  }
											: {}),
									}}
								>
									{/* {this.state.style?.subTotalValue} */}
									{this.state.style?.services_selection == 2 &&
									this.state.style?.subTotalValue == 0 ? (
										<Text
											isWorkflow={this.props.isWorkflow}
											text={
												this?.state?.client
													? subTotal
													: `${
															this.state.style?.subTotalValue ||
															'<p>0</p>'
													  }`
											}
											setTriggerFont={(e) =>
												this.props?.client
													? ''
													: this.props.setTriggerFont(e)
											}
											triggerFont={this.state.triggerFont}
											setContent={(e) =>
												this.handleServiceSubTotal(
													{
														target: {
															value: e,
														},
													},
													'subTotalValue',
												)
											}
											setTab={(e) => this.props.handleSetTab(e)}
											handleSelection={(e, activeTextBlock) =>
												this.props.handleBSelection(e, activeTextBlock)
											}
											actionType={this.state.actionType}
											actionValue={this.state.actionValue}
											preview={this.state.client}
											refID={this.state.sectionID + 'subTotalValue'}
											reference={'subTotalValue' + this.state.sectionID}
											subBlockID={this.state.sectionID + 'subTotalValue'}
											theme={this.props?.themes}
										/>
									) : (
										<div>
											{this.state.client ? (
												<span
													style={{
														fontFamily: 'inherit',
														fontSize: 'inherit',
														color: 'inherit',
													}}
												>
													{subTotal}
												</span>
											) : (
												<span
													style={{
														fontFamily: 'inherit',
														fontSize: 'inherit',
														color: 'inherit',
													}}
												>
													{(this.state.style?.subTotalValue + '')
														?.replace(/&nbsp;/g, ' ')
														?.replace(/<\/?[^>]+(>|$)/g, '')
														?.replace(/"/g, '') || '0'}
												</span>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					) : (
						''
					)}

					<div
						className={`d-flex  ${
							_.has(this.state.style, 'services_style')
								? this.state.style.services_style !== 0
									? ''
									: 'flex-direction-column'
								: 'flex-direction-column'
						}`}
						style={{
							maxWidth: this.state.style?.services_style == 1 ? '100%' : 720,
							flexWrap: _.has(this.state.style, 'services_style')
								? this.state.style.services_style !== 0
									? this.state.style.services_style == 1
										? this.state.previewType === 'm'
											? 'wrap'
											: 'wrap'
										: 'wrap'
									: 'no-wrap'
								: 'no-wrap',
							width: '100%',
							gap:
								this.state.previewType === 'm'
									? this.state.style.spacing
										? `${this.state.style.spacing}px`
										: '24px'
									: _.has(this.state.style, 'services_style')
									? this.state.style.services_style !== 0
										? this.state.style.services_style == 1
											? this.state.style.spacing
												? `${this.state.style.spacing}px`
												: '5%'
											: this.state.style.spacing
											? `${this.state.style.spacing}px`
											: '14px'
										: this.state.style.spacing
										? `${this.state.style.spacing}px`
										: '16px'
									: this.state.style.spacing
									? `${this.state.style.spacing}px`
									: '16px',
						}}
					>
						{_.map(this.state.blocks, (block, key) => {
							return (this.state.client && block?.subBlocks?.[0]?.show) ||
								!this.state.client ? (
								<div
									key={key}
									ref={(el) => (this.boxRefs[block?._id] = el)}
									data-id={block?._id}
									style={{
										display: 'flex',
										width:
											this.state.previewType === 'm'
												? '100%'
												: _.has(this.state.style, 'services_style')
												? this.state.style.services_style !== 0
													? this.state.style.services_style == 1
														? '30%'
														: '49%'
													: '100%'
												: '100%',
										backgroundColor: block?.backgroundColor,
										position: 'relative',
										borderRadius: 6,
									}}
								>
									<ServiceItem
										themes={this.props.themes}
										socialMediaLinks={this.state.socialMediaLinks}
										isWorkflow={this.props.isWorkflow}
										index={key}
										block={block}
										setTriggerFont={(e) =>
											this.props?.client ? '' : this.props.setTriggerFont(e)
										}
										key={block._id}
										preview={this.state.preview}
										previewType={this.state.previewType}
										client={this.state.client}
										style={this.state.style}
										returnDisplayItemSub={(type, id) =>
											this.returnDisplayItemSub(type, id)
										}
										getRowValue={(type, id, f) => this.getRowValue(type, id, f)}
										serviceTableSubBlock={(e) =>
											this.props.serviceTableSubBlock(e)
										}
										setRowValue={(e, type, id) => this.setRowValue(e, type, id)}
										handleSetTab={(e) => this.props.handleSetTab(e)}
										handleBSelection={(e, block) =>
											this.props?.client
												? ''
												: this.props.handleBSelection(e, block)
										}
										handleServiceSelect={(block, type, val) =>
											this.handleServiceSelect(block, type, val)
										}
										handleDeleteServiceBlock={(blockID, sectionID) =>
											this.props.handleDeleteServiceBlock(blockID, sectionID)
										}
										activeImage={(a, b, c, d) =>
											this.props.activeImage(a, b, c, d)
										}
										imgSettingData={(e) => this.props.imgSettingData(e)}
										sectionID={this.state.sectionID}
										handleDuplicateServiceBlock={(e) =>
											this.props.duplicateServiceBlock(
												block,
												block._id,
												this.state.sectionID,
											)
										}
										actionType={this.state.actionType}
										actionValue={this.state.actionValue}
										restrictServiceSelection={
											this.state?.restrictServiceSelection
										}
										clearStyle={() => this.props.clearStyle()}
										activeVariableID={this.state.activeVariableID}
										activeVariableName={this.state.activeVariableName}
										variables={this.state.variables}
										triggerFont={this.state.triggerFont}
										customisedImageStylesForPresentation={
											this.props?.customisedImageStylesForPresentation
										}
										status={this.props?.status}
										showUnitPrice={this.returnDisplayItemSubUnitPrice(
											'unitPrice',
											block?._id,
										)}
										currencySymbol={this.props?.currencySymbol}
										builderCurrencySymbol={this.props?.builderCurrencySymbol}
										clientGrandTotal={this.props?.clientGrandTotal}
										activeModule={this.props.activeModule}
									/>
								</div>
							) : (
								''
							);
						})}
						{this.state.preview !== true ? (
							<div className="add-services-row">
								<span
									onClick={() =>
										this.props.addServiceBlock(this.state.style?.services_style)
									}
									style={{ padding: '24px 0px', width: 'fit-content' }}
								>
									+ Add Service
								</span>
							</div>
						) : (
							''
						)}
					</div>

					{/* {_.map(Layout.blocks, (row, key) => {
						return (
							<div
								className="row"
								style={{
									display: 'flex',
									flexDirection:
										_.size(row.subBlocks) > 1
											? 'row'
											: 'column',
									gap: 40,
								}}
							>
								{_.map(row.subBlocks, (component, k) => {
									let label = component.label;
									let display = true;
									let style = Json.style;
									let labels = style.labels;
									if (label) {
										if (
											labels.find((item) =>
												item.hasOwnProperty(label)
											)
										) {
											let item = style.labels.find(
												(item) =>
													item.hasOwnProperty(label)
											);
											display = item[label];
										}
									}
									return (
										<div
											className={`column ${
												_.has(component, 'className')
													? component.className
													: ''
											}`}
											style={{
												display:
													display == false
														? 'none'
														: 'flex',

												...(_.has(
													component,
													'divStyles'
												)
													? component.divStyles
													: {}),
											}}
										>
											{this.switchComponent(
												component.type,
												component
											)}
										</div>
									);
								})}
							</div>
						);
					})} */}
				</div>
			</div>
		);
	}
}

export default Layout1;
