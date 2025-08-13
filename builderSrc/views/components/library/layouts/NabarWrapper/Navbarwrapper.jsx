import React, { Component } from 'react';
import NavbarComponent from './NavbarComponent';
import '../index.scss';
const padding = ['0px', '20px', '40px', '60px', '80px'];

class NavbarWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			preview: props.preview,
			previewType: props.previewType,
			client: props?.client,
			style: props.style,
			blocks: props.blocks,
			modules: props.modules,
			duplicateModules: props?.duplicateModules,
			showStyleModal: false,
			showEditDesignOptions: false,
			isEditElement: false,
			showHiddenModal: false,
			section: props?.section,
		};
		this.blockRef = React.createRef();
		this.navbarRef = React.createRef();
		this.navAbsoluteRef = React.createRef();
		this.boxRefs = [];
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.blocks !== nextProps.blocks) {
			this.setState({
				blocks: nextProps.blocks,
			});
		}
		if (this.state.style !== nextProps.style && nextProps.style) {
			this.setState({
				style: nextProps.style,
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

		if (this.state.modules !== nextProps.modules) {
			this.setState({
				modules: nextProps.modules,
			});
		}
		if (this.state.duplicateModules !== nextProps.duplicateModules) {
			this.setState({
				duplicateModules: nextProps.duplicateModules,
			});
		}
		if (this.state.section !== nextProps.section) {
			this.setState({
				section: nextProps.section,
			});
		}
	};
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	handleClickOutside = (event) => {
		if (this.blockRef.current && !this.blockRef.current.contains(event.target)) {
			this.setState({
				showBlockOptions: false,
			});
		}
		if (
			this.navbarRef?.current &&
			!this.navbarRef?.current?.contains(event?.target) &&
			!this.navAbsoluteRef?.current?.contains(event?.target)
		) {
			this.setState({
				//    showEditDesignOptions: true,
				isEditElement: false,
			});
		}
	};
	toggleSideBar = (e) => {
		this.setState(
			{
				showBlockActions: false,
			},
			() => {
				this.props.handleSideBar('', this.props._id);
				// this.props.setActiveTab('d');
			},
		);
	};

	editDesign = () => {
		this.setState({
			showStyleModal: true,
			isEditElement: true,
		});
	};
	render() {
		return (
			<div
				className="navbar-wrapper-container"
				style={{
					backgroundColor:
						this.state.showEditDesignOptions && !this.state.isEditElement
							? 'rgba(23, 24, 25, 0.20)'
							: '',
					width: '100%',
				}}
			>
				<div
					className={`navbar-wrapper`}
					style={{
						backgroundColor:
							this.state?.section?.style?.sectionBackgroundColor || '#ffffff',
						width: '100%',
					}}
					onMouseEnter={() => {
						if (this.state.preview !== true) {
							this.state.isEditElement
								? this.setState({ showBlockOptions: true })
								: this.setState({ showEditDesignOptions: true });
						}
					}}
					onMouseLeave={() => {
						// if (this.state.isActiveSection == false) {
						this.setState({ showBlockOptions: false });
						this.setState({ showEditDesignOptions: false });
						// }
					}}
					ref={this.blockRef}
				>
					<div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								width: '100%',
							}}
						>
							<div
								className="navbar-layout-wrapper"
								style={{
									width: '100%',
									zoom:
										this.state.previewType === 'ml' && this.state.preview
											? 0.4
											: 1,
								}}
								ref={this.navbarRef}
							>
								<NavbarComponent
									preview={this.state?.preview}
									previewType={this.state?.previewType}
									client={this.props?.client}
									tables={this.props?.tables}
									setTab={(e, id = null, bid = null) =>
										this.props?.setTab(e, id, bid)
									}
									handleSideBar={(e, _id) => {
										this.props.handleSideBar(e, _id);
									}}
									// blocks={this.state?.blocks}
									// style={this.state?.style}
									module={this.props.module}
									section={this.props.section}
									getModuleInfo={(id, type) => this.props.getModuleInfo(id, type)}
									modules={this.state.duplicateModules}
									renderModules={() => this.props.renderModules()}
									setActiveSection={(value) => {
										this.props?.handleNavbarUpdate(value);
									}}
									setShowEditDesignModal={(value) =>
										this.setState({ showEditDesignModal: value })
									}
									showEditDesignModal={this.state.showEditDesignModal}
									setShowStyleModal={(value) =>
										this.setState({
											showStyleModal: value,
											showImageModal: value,
											showHiddenModal: value,
										})
									}
									showStyleModal={this.state.showStyleModal}
									activeModuleId={this.props.activeModuleId}
									managePages={(e) => this.props.managePages(e)}
									isEditElement={this.state.isEditElement}
									showImageModal={this.state.showImageModal}
									showHiddenModal={this.state.showHiddenModal}
									handleNavbarUpdate={this.props.handleNavbarUpdate}
									finalTotalCost={this.props?.finalTotalCost}
									clientPortalModules={this.props?.clientPortalModules}
									renderClientModulesClickFunction={
										this.props?.renderClientModulesClickFunction
									}
									currencySymbol={this.props?.currencySymbol}
									returnCartValue={this.props?.returnCartValue}
									selectedLabelId={this.props?.selectedLabelId}
									handleDownload={this.props?.handleDownload}
									activeModule={this.props?.activeModule}
								/>
								{this.state.showEditDesignOptions && !this.state.isEditElement && (
									<div className="navbar-edit-design">
										<div
											className="edit-design"
											onClick={(e) => {
												e.stopPropagation();
												this.props.managePages(e);
											}}
										>
											Add page
										</div>
										<div
											className="edit-design"
											onClick={() => this.editDesign()}
										>
											Edit Design
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default NavbarWrapper;
