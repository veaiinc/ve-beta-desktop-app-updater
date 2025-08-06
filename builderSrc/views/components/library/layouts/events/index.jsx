import React, { Component } from 'react';
import Text from '../../elements/text/index.jsx';
import _ from 'lodash';
import '../index.scss';
import Delete from '../actions/delete.jsx';
import moment from 'moment';
import ReactPlayer from 'react-player';
import { BlockSidebar, DeleteRole } from '../../../builder_client_common';
import AddBlankComp from '../../addBlock/add-blank-comp.jsx';
import 'react-datepicker/dist/react-datepicker.css';

const padding = ['0px', '36px', '56px', '76px', '96px'];
const services_selection = ['one', 'multiple', 'none'];
const services_style = ['rows', '3 columns', '2 columns'];
const animationSpeedSec = [{ slow: 10 }, { medium: 5 }, { fast: 1 }];
const roleTextStyling = {
	fontSize: '16px',
	fontStyle: 'normal',
	fontWeight: '400',
	lineHeight: 'normal',
};
const getClientStyling = (numEvents, screenWidth = 1024) => {
	
	if (numEvents === 1) {
		return {
			display: 'grid',
			gridTemplateColumns: '1fr', // Single column for one event
			maxWidth: '748px',
			margin: '0 auto',
			paddingTop: '12px',
		};
	}

	// Responsive grid based on screen width
	if (screenWidth <= 480) {
		// Mobile phones - single column
		return {
			display: 'grid',
			gridTemplateColumns: '1fr',
			gap: '16px',
			maxWidth: '100%',
			margin: '0 auto',
			paddingTop: '12px',
		};
	} else if (screenWidth <= 768) {
		// Tablets - smaller minimum width
		return {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
			gap: '20px',
			maxWidth: '748px',
			margin: '0 auto',
			paddingTop: '12px',
		};
	} else {
		// Desktop - original design with reduced minimum width
		return {
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
			gap: '20px',
			maxWidth: '748px',
			margin: '0 auto',
			paddingTop: '12px',
		};
	}
};
const getEventCardStyle = (index, totalEvents) => {
	// If it's the last event and alone in its row
	if (index === totalEvents - 1 && totalEvents % 2 === 1) {
		return {
			gridColumn: '1 / -1', // Span all columns
		};
	}
	return {};
};
const getEventsTextStyling = (screenWidth = 1024) => {
	
	if (screenWidth <= 480) {
		// Mobile phones
		return {
			display: 'flex',
			gap: '16px',
			flexWrap: 'wrap',
			flexDirection: 'row',
			maxWidth: '100%',
			justifyContent: 'flex-start',
			paddingTop: '12px',
		};
	} else {
		// Desktop and tablets
		return {
			display: 'flex',
			gap: '20px',
			flexWrap: 'wrap',
			flexDirection: 'row',
			maxWidth: '748px', // (2 * 354px) + 20px gap
			justifyContent: 'flex-start',
			paddingTop: '12px',
		};
	}
};

class Events extends Component {
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
			isActiveSection: props.isActiveSection,
			tablesValuesforClient: props.tablesValuesforClient,
			activeAnimation: props.activeAnimation,
			animationSpeed: props.animationSpeed,
			animationDirection: props.animationDirection,
			animationType: props.animationType,

			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,
			isWorkflow: props.isWorkflow,
			showBlockEditOptions: false,
			section: props.section,
			showEventPopup: false,
			activeType: 'event',
			textTab: '',
			screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
		};
		this.blockRef = React.createRef();
		this.boxRefs = [];
		this.elementSidebarRef = React.createRef();
	}
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
		window.addEventListener('resize', this.handleResize);
		this.animateSection();

		if (this.blockRef.current) {
			if (this.state.activeAnimation > 0) {
				this.observer?.observe(this.blockRef.current);
			}
		}
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		window.removeEventListener('resize', this.handleResize);
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.activeFontColor !== nextProps.activeFontColor) {
			this.setState({
				activeFontColor: nextProps.activeFontColor,
			});
		}
		if (this.state.isWorkflow !== nextProps.isWorkflow) {
			this.setState({
				isWorkflow: nextProps.isWorkflow,
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
		if (this.state.section !== nextProps.section) {
			this.setState({
				section: nextProps.section,
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
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.tables !== nextProps.tables) {
			this.setState({
				tables: nextProps.tables,
			});
		}
		if (this.state.tablesValuesforClient !== nextProps.tablesValuesforClient) {
			this.setState({
				tables: nextProps.tablesValuesforClient,
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

		// for bg types fro events -Abdullah
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
	};
	handleClickOutside = (event) => {
		if (
			this.elementSidebarRef.current &&
			this.elementSidebarRef.current.getSidebarNode && // check if method exists
			!this.elementSidebarRef.current.getSidebarNode().contains(event.target) &&
			!this.state.showImageModal
		) {
			this.setState({
				showEventPopup: false,
			});
		}
		if (this.blockRef.current && !this.blockRef.current.contains(event.target)) {
			this.setState({
				showBlockActions: false,
				showBlockEditOptions: false,
			});
		}
	};

	handleResize = () => {
		this.setState({
			screenWidth: window.innerWidth,
		});
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
	returnData = () => {
		if (this.props.client) {
			let tables = this.state?.tables || [];
			if (this.props?.smartFilePreview) {
				tables = this.state?.tablesValuesforClient || [];
			}
			let table = _.filter(tables, { _id: this.state.sectionID })[0]?.values;
			return table;
		} else {
			return this.state.blocks;
		}
	};
	getRowValue = (e, key) => {
		let tables = this.state?.tables || [];
		if (this.props?.smartFilePreview) {
			tables = this.state?.tablesValuesforClient || [];
		}
		let table = _.filter(tables, { _id: this.state.sectionID })?.[0]?.values;
		let element = table?.[key];

		return element?.[e];
	};
	returnRoles = (index) => {
		let tables = this.state?.tables || [];
		if (this?.props?.smartFilePreview) {
			tables = this.state?.tablesValuesforClient || [];
		}

		let table = _.filter(tables, { _id: this.state.sectionID })?.[0]?.values;
		let roles = table?.[index]?.roles || [];

		return _.map(roles, (role, k) => {
			const candidRole = role?.categories?.filter((a) => a?.category === 'candid');

			return candidRole?.[0]?.quantity ? (
				<div
					className="role"
					style={{
						color: this.state.style?.fontColor,
						textTransform: 'capitalize',
						...roleTextStyling,
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
					{candidRole?.[0]?.quantity} {role.type}
				</div>
			) : (
				''
			);
		});
	};
	handleBlock = (e) => {
		e?.stopPropagation();
		this.props.selectBlock('b');
		this.setState({
			showEventPopup: true,
		});
	};
	handleDuplicate = (e) => {
		e?.stopPropagation();
		this.toggleSideBar({ showSidebar: false });
		this.props.duplicateBlock(this.props._id);
	};
	hanldeAddBlock = (e) => {
		e.stopPropagation();
		this.props.showAddBlock(e);
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
					});
				},
				{ threshold: 0.1 },
			);
		}
	};
	getAnimationTiming = () => {
		const matchedAnimation = animationSpeedSec.find(
			(item) => Object.keys(item)[0] === this.state.animationSpeed, // Return the result of the comparison
		);

		const speed = matchedAnimation ? matchedAnimation[this.state.animationSpeed] : 0;

		return speed;
	};
	handleBlockEditOptions = (blockID) => {
		if (this.state.isWorkflow) {
			this.setState({ showBlockEditOptions: true, activeBlock: blockID });
		}
	};
	checkForNull = (e, type) => {
		let value;
		if (e !== null && e !== undefined && e !== '') {
			if (type === 'Name') {
				let temp = e
					.replace(/<input[^>]*>/gi, (match) => {
						return `{{INPUT_${match}}}`;
					})
					.replace(/<br\s*\/?>/gi, '{{BR}}');
				temp = temp.replace(/<[^>]+>/g, '');
				temp = temp.replace(/{{INPUT_(<input[^>]*>)}}/g, '$1').replace(/{{BR}}/g, '<br>');
				value = `<event>${temp}</event>`;
			} else {
				value = e;
			}
		} else {
			if (type === 'Name') {
				value = `<event>${type}</event>`;
			} else {
				value = `<p>${type}</p>`;
			}
		}
		return value;
	};
	removeTags(str) {
		if (str === null || str === '') return false;
		else str = str.toString();
		if (str === null || str === '') return false;
		else str = str.toString();

		// Regular expression to identify HTML tags in
		// the input string. Replacing the identified
		// HTML tag with a null string.
		return str.replace(/(<([^>]+)>)/gi, '');
		return str.replace(/(<([^>]+)>)/gi, '');
	}
	setRowValue = (e, type, blockId) => {
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

		let tablets = _.cloneDeep(this.state.tables);

		let tablesArr = [];
		_.map(tablets, (table, k) => {
			if (table._id === this.state.sectionID) {
				_.map(table.values, (value, k) => {
					if (value.blockId === blockId) {
						value[type] = this.removeTags(e.target.value);
					}
				});
			}
			tablesArr.push(table);
		});

		this.setState({ tables: tablesArr }, () => {
			this.props.setTable(tablesArr);
		});
	};
	setRoleValue = (e, type, blockId, index) => {
		let blocks = _.cloneDeep(this.state.blocks);

		let arr = [];
		_.map(blocks, (table, k) => {
			if (table._id === blockId) {
				table.subBlocks[0].roles[index][type] = e.target.value;
			}
			arr.push(table);
		});

		this.setState({ blocks: arr }, () => {
			let section = { ...this.state.section, blocks: arr };
			this.props.setActiveSection(section);
		});

		let tablets = _.cloneDeep(this.state.tables);

		let tablesArr = [];

		_.map(tablets, (table, k) => {
			if (table._id === this.state.sectionID) {
				table.values[0].roles[index][type] = this.removeTags(e.target.value);
			}
			tablesArr.push(table);
		});
		this.setState({ tables: tablesArr }, () => {
			this.props.setTable(tablesArr);
		});
	};
	addRole = (blockId) => {
		let blocks = _.cloneDeep(this.state.blocks);
		_.map(blocks, (table, k) => {
			if (table._id === blockId) {
				table.subBlocks[0]?.roles?.push({
					type: 'Enter Role Name',
					categories: [
						{ category: 'candid', quantity: 0 },
						{ category: 'traditional', quantity: 0 },
					],
				});
			}
		});

		this.setState({ blocks }, () => {
			let section = { ...this.state.section, blocks: blocks };
			this.props.setActiveSection(section);
		});

		let tablets = _.cloneDeep(this.state.tables);

		_.map(tablets, (table, k) => {
			if (table._id === this.state.sectionID) {
				table?.values?.[0]?.roles?.push({
					type: 'Enter Role Name',
					categories: [
						{ category: 'candid', quantity: 0 },
						{ category: 'traditional', quantity: 0 },
					],
				});
			}
		});

		this.setState({ tables: tablets }, () => {
			this.props.setTable(tablets);
		});
	};
	setRoleQuantity = (e, blockId, index) => {
		let blocks = _.cloneDeep(this.state.blocks);
		let arr = [];
		_.map(blocks, (table, k) => {
			if (table._id === blockId) {
				table.subBlocks[0].roles[index].categories[0].quantity = e.target.value;
			}
			arr.push(table);
		});

		this.setState({ blocks: arr }, () => {
			let section = { ...this.state.section, blocks: arr };
			this.props.setActiveSection(section);
		});
		let tablets = _.cloneDeep(this.state.tables);

		let tablesArr = [];

		_.map(tablets, (table, k) => {
			if (table._id === this.state.sectionID) {
				table.values[0].roles[index].categories[0].quantity = e.target.value;
			}
			tablesArr.push(table);
		});

		this.setState({ tables: tablesArr }, () => {
			this.props.setTable(tablesArr);
		});
	};
	deleteRole = (e, blockId, index) => {
		let blocks = _.cloneDeep(this.state.blocks);
		let arr = [];
		_.map(blocks, (table, k) => {
			if (table._id === blockId) {
				table.subBlocks[0].roles.splice(index, 1);
			}
			arr.push(table);
		});
		this.setState({ blocks: arr }, () => {
			let section = { ...this.state.section, blocks: arr };
			this.props.setActiveSection(section);
		});

		let tablets = _.cloneDeep(this.state.tables);
		let tablesArr = [];
		_.map(tablets, (table, k) => {
			if (table._id === this.state.sectionID) {
				table.values[0].roles.splice(index, 1);
			}
			tablesArr.push(table);
		});
		this.setState({ tables: tablesArr }, () => {
			this.props.setTable(tablesArr);
		});
	};
	handleDateChange = (date, blockId) => {
		this.setRowValue(
			{
				target: {
					value: moment(date).format('YYYY-MM-DD'),
				},
			},
			'date',
			blockId,
		);
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

	returnEventName = (key) => {
		const name = this.getRowValue('name', key);
		return name === 'Name' ? '' : name;
	};
	returnEventDescription = (key) => {
		const desc = this.getRowValue('description', key);
		return desc === 'Description' ? '' : desc;
	};
	returnEventLocation = (key) => {
		const location = this.getRowValue('location', key);
		return location === 'Location' ? '' : location;
	};
	render() {
		const events = this.returnData() || []; // Add default empty array
		const finalWrapperStyling = this.props?.client ? getClientStyling(events?.length || 0, this.state.screenWidth) : {};
		const finalEventsTextStyling = this.props?.client ? getEventsTextStyling(this.state.screenWidth) : {};
		return (
			<div
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

					...(_.has(this.state.style, 'heading') || this.state.isWorkflow
						? { flexDirection: 'column', display: 'flex' }
						: {}),
				}}
				ref={this.blockRef}
			>
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
								loop={this.state.style?.videoProps?.loop ?? false}
								onError={(e) => {
									this.props.handleIsValidBgVideoURL(false);
								}}
								onReady={(e) => this.props.handleIsValidBgVideoURL(true)}
								playing={true}
								muted={this.state.style?.videoProps?.muteVideo ?? false}
								controls={false}
							/>
						</div>
					)}

				<AddBlankComp
					handleBlock={this.handleBlock}
					handleDuplicate={this.handleDuplicate}
					hanldeAddBlock={this.hanldeAddBlock}
					handleAddLayout={this.props.handleAddLayout}
					showBlockOptions={this.state.showBlockOptions}
					activeModule={this.props.activeModule}
					index={this.props.index}
					itemsLength={this.props.itemsLength}
					moveItem={this.props.moveItem}
					showBlockActions={this.state.showBlockActions}
					preview={this.state.preview}
					isElement={this.state.isElement}
					activeTab={this.state.activeTab}
					handleDeleteSection={this.handleDeleteSection}
				/>

				<div
					className="layout"
					style={{
						display: 'flex',
						flexDirection: 'column',

						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1,
						...finalWrapperStyling,
					}}
				>
					{_.map(this.returnData(), (block, key) => {
						return (
							<div
								className={`et-row ${
									this.props.client ? 'clienEventsStyling' : ''
								}`}
								style={{
									backgroundColor: this.state.style?.cardBackgroundColor,
									maxWidth: this.props.client ? '100%' : '',
									minWidth:
										window?.location?.pathname?.includes('document') && this.state.screenWidth > 480 ? '400px' : 'auto',
									position: 'relative',
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
									...getEventCardStyle(key, events.length), // Add this line
								}}
								key={key}
								data-id={block?.subBlockId}
								ref={(el) => (this.boxRefs[block?._id] = el)}
								onClick={(e) => this.handleBlockEditOptions(block?._id)}
							>
								<div className="date-location">
									<span
										style={{
											color: this.state.style?.fontColor,
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
										{this.props.client ? (
											this.getRowValue('date', key) ? (
												moment(`${this.getRowValue('date', key)}`).format(
													'DD MMM YYYY',
												)
											) : (
												''
											)
										) : !this.state.isWorkflow ? (
											'Date'
										) : (
											<div
												style={{
													position: 'relative',
													width: 'fit-content',
												}}
											>
												<input
													type="date"
													value={block?.subBlocks[0]?.date || ''}
													onChange={(e) => {
														const newValue = e.target.value;
														this.handleDateChange(newValue, block._id);
													}}
													onClick={(e) => {
														e.target.showPicker();
													}}
													placeholder="Select Date"
													style={{
														width: '100%',
														padding: '0',
														backgroundColor: 'transparent',
														border: 'none',
														color: 'inherit',
														fontSize: 'inherit',
														fontFamily: 'inherit',
														cursor: 'pointer',
														colorScheme: 'dark',
														'::-webkit-calendar-picker-indicator': {
															display: 'none',
														},
														'::-webkit-inner-spin-button': {
															display: 'none',
														},
													}}
												/>
											</div>
										)}
									</span>
									<span
										style={{
											color: this.state.style?.fontColor,
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
										{this.props.client ? (
											this.getRowValue('date', key) &&
											this.getRowValue('location', key) ? (
												<>
													<span>&nbsp;</span>|<span>&nbsp;</span>
												</>
											) : (
												''
											)
										) : (
											''
										)}
									</span>

									<span
										style={{
											color: this.props?.themes
												? this.props?.themes?.colors?.text?.p?.color
												: this.state.style?.fontColor,
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
										{this.props.client ? (
											this.returnEventLocation(key)
										) : (
											<Text
												// text={',Location'}
												text={this.checkForNull(
													block?.subBlocks[0]?.location,
													'Location',
												)}
												setTriggerFont={(e) => this.props.setTriggerFont(e)}
												triggerFont={this.state.triggerFont}
												setContent={(e) =>
													this.setRowValue(
														{
															target: {
																value: e,
															},
														},
														'location',
														block._id,
													)
												}
												setTab={(e) => this.props.handleSetTab(e)}
												handleSelection={(e, activeTextBlock) =>
													this.props.handleBSelection(e, activeTextBlock)
												}
												refID={block.subBlocks[0]._id}
												actionType={this.state.actionType}
												actionValue={this.state.actionValue}
												activeSubBlockId={block.subBlocks[0]._id}
												changeTextSelection={(val) =>
													this.setState({ textSelection: val })
												}
												subBlockID={block.subBlocks[0]._id}
												reference={'servicesTitle' + this.state.index}
												isServiceItem={true}
												clearStyling={() => this.props.clearStyle()}
												activeVariableID={this.state.activeVariableID}
												activeVariableName={this.state.activeVariableName}
												variables={this.props.variables}
												module={'proposal'}
												preview={this.state.preview}
												client={this.state.client}
												// themes={this.props?.themes}
											/>
										)}
									</span>
								</div>
								<div
									className="event-name"
									style={{
										color: this.state.style?.fontColor,
										...finalEventsTextStyling,
										...this.applyFontThemeStyles({
											...this.props?.themes?.fonts?.event?.eventTitle,
											...this.props?.themes?.colors?.event?.eventTitle,
										}),
										...(this.state.previewType === 'm'
											? {
													...this.applyFontThemeStyles({
														...this.props?.themes?.mobileFonts?.event
															?.eventTitle,
													}),
											  }
											: {}),
									}}
								>
									{this.props.client ? (
										this.returnEventName(key)
									) : (
										<Text
											// text={'Name'}
											text={this.checkForNull(
												block?.subBlocks[0]?.name,
												'Name',
											)}
											setTriggerFont={(e) => this.props.setTriggerFont(e)}
											triggerFont={this.state.triggerFont}
											setContent={(e) =>
												this.setRowValue(
													{
														target: {
															value: e,
														},
													},
													'name',
													block._id,
												)
											}
											setTab={(e) => this.props.handleSetTab(e)}
											handleSelection={(e, activeTextBlock) =>
												this.props.handleBSelection(e, activeTextBlock)
											}
											refID={block.subBlocks[0]._id}
											actionType={this.state.actionType}
											actionValue={this.state.actionValue}
											activeSubBlockId={block.subBlocks[0]._id}
											changeTextSelection={(val) =>
												this.setState({ textSelection: val })
											}
											subBlockID={block.subBlocks[0]._id}
											reference={'servicesTitle' + this.state.index}
											isServiceItem={true}
											clearStyling={() => this.props.clearStyle()}
											activeVariableID={this.state.activeVariableID}
											activeVariableName={this.state.activeVariableName}
											variables={this.props.variables}
											module={'proposal'}
											preview={this.state.preview}
											client={this.state.client}
										/>
									)}
								</div>
								{this.props.client ? (
									this.returnRoles(key)
								) : (
									<div
										className="role"
										style={{
											color: this.state.style?.fontColor,
										}}
									>
										{block?.subBlocks[0]?.roles?.map((role, index) => {
											return (
												<div
													key={index}
													className="role-input-container"
													style={{
														...this.applyFontThemeStyles({
															...this.props?.themes?.fonts?.p,
															...this.props?.themes?.colors?.text?.p,
														}),
														...(this.state.previewType === 'm'
															? {
																	...this.applyFontThemeStyles({
																		...this.props?.themes
																			?.mobileFonts?.p,
																	}),
															  }
															: {}),
													}}
												>
													<input
														className="role-quantity-input"
														type="number"
														min={0}
														placeholder="Quantity"
														defaultValue={
															role?.categories?.[0]?.quantity
														}
														onChange={(e) =>
															this.setRoleQuantity(
																e,
																block._id,
																index,
															)
														}
														style={{
															fontSize: 'inherit',
															fontFamily: 'inherit',
															color: 'inherit',
															letterSpacing: 'inherit',
														}}
													/>
													<Text
														// text={'Name'}
														text={
															this.checkForNull(role?.type, 'type') ||
															'Enter Role Name'
														}
														setTriggerFont={(e) =>
															this.props.setTriggerFont(e)
														}
														triggerFont={this.state.triggerFont}
														setContent={(e) =>
															this.setRoleValue(
																{
																	target: {
																		value: e,
																	},
																},
																'type',
																block._id,
																index,
															)
														}
														setTab={(e) => this.props.handleSetTab(e)}
														handleSelection={(e, activeTextBlock) =>
															this.props.handleBSelection(
																e,
																activeTextBlock,
															)
														}
														refID={block.subBlocks[0]._id}
														actionType={this.state.actionType}
														actionValue={this.state.actionValue}
														activeSubBlockId={block.subBlocks[0]._id}
														changeTextSelection={(val) =>
															this.setState({ textSelection: val })
														}
														subBlockID={block.subBlocks[0]._id}
														reference={
															'servicesTitle' + this.state.index
														}
														isServiceItem={true}
														clearStyling={() => this.props.clearStyle()}
														activeVariableID={
															this.state.activeVariableID
														}
														activeVariableName={
															this.state.activeVariableName
														}
														variables={this.props.variables}
														module={'proposal'}
														preview={this.state.preview}
														client={this.state.client}
													/>
													{!this.props.client && (
														<div
															style={{ cursor: 'pointer' }}
															onClick={(e) =>
																this.deleteRole(e, block._id, index)
															}
														>
															<DeleteRole />
														</div>
													)}
												</div>
											);
										})}
										<p
											className="add-service-btn"
											style={{ color: this.state.style?.fontColor }}
											onClick={() => this.addRole(block._id)}
										>
											+ Add Crew
										</p>
									</div>
								)}

								<div
									className="desc"
									style={{
										color: this.state.style?.fontColor,
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
									{this.props.client ? (
										this.returnEventDescription(key)
									) : (
										<Text
											// text={'Description'}
											text={this.checkForNull(
												block?.subBlocks[0]?.description,
												'Description',
											)}
											setTriggerFont={(e) => this.props.setTriggerFont(e)}
											triggerFont={this.state.triggerFont}
											setContent={(e) =>
												this.setRowValue(
													{
														target: {
															value: e,
														},
													},
													'description',
													block._id,
												)
											}
											setTab={(e) => this.props.handleSetTab(e)}
											handleSelection={(e, activeTextBlock) =>
												this.props.handleBSelection(e, activeTextBlock)
											}
											refID={block.subBlocks[0]._id}
											actionType={this.state.actionType}
											actionValue={this.state.actionValue}
											activeSubBlockId={block.subBlocks[0]._id}
											changeTextSelection={(val) =>
												this.setState({ textSelection: val })
											}
											subBlockID={block.subBlocks[0]._id}
											reference={'servicesTitle' + this.state.index}
											isServiceItem={true}
											clearStyling={() => this.props.clearStyle()}
											activeVariableID={this.state.activeVariableID}
											activeVariableName={this.state.activeVariableName}
											variables={this.props.variables}
											module={'proposal'}
											preview={this.state.preview}
											client={this.state.client}
										/>
									)}
								</div>
								{this.state.showBlockEditOptions &&
								this.state.preview == false &&
								this.state.activeBlock == block?._id ? (
									<div className="block-action-bar" style={{ right: '-5px' }}>
										<span
											className="tooltip"
											onClick={(e) =>
												this.props.handleDeleteServiceBlock(
													block._id,
													this.state.sectionID,
												)
											}
										>
											<Delete />
											<label className="tooltip-text">Delete</label>
										</span>
									</div>
								) : (
									''
								)}
							</div>
						);
					})}
					{this.state.isWorkflow && (
						<div
							className="add-block-btn"
							onClick={(e) => this.props.addEventBlock(this.returnData())}
						>
							+Add Event
						</div>
					)}
				</div>
				{this.state.showEventPopup && (
					<BlockSidebar
						ref={this.elementSidebarRef}
						activePopupComponent={this.state.section}
						setActivePopupComponent={(e) =>
							this.setState({ section: e, style: e?.style })
						}
						activeType={'event'}
						elementEndPosition={{ x: 0, y: 0 }}
						setActiveSection={(e) => {
							this.setState({ section: e });
							this.props.setActiveSection(e);
						}}
						activeModuleId={this.props?.activeModuleId}
						setModalRef={(e) => {
							this.setState({ showImageModal: true });
						}}
					/>
				)}
			</div>
		);
	}
}

export default Events;
