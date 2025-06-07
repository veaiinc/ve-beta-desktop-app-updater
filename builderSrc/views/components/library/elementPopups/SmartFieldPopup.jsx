import React, { Component } from 'react';
import './elementPopup.scss';
import _ from 'lodash';

// svgs
// import { ReactComponent as AddBlock } from '../svgs/LeftBar/Addblock.svg';
import { ReactComponent as Plus } from '../svgs/LeftBar/Addblock.svg';
import { Edit, DeleteIcon } from '../../builder_client_common';
// import { ReactComponent as SearchIcon } from '../svgs/smartFieldsvg/Search.svg';
export default class SmartFieldPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeComponent: props.activeComponent,
			variables: props.variables,
			searchQuery: '',
			filteredVariables: {
				clientInfo: [],
				smartFieldInfo: [],
				companyInfo: [],
				userInfo: [],
				custom: [],
			},
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
			});
		}
		if (nextProps.variables !== this.state.variables) {
			this.setState(
				{
					variables: nextProps.variables,
				},
				() => {
					this.setVariables();
				},
			);
		}
	}
	componentDidMount() {
		this.setVariables();
	}

	setVariables = () => {
		// cilent info
		let clientInfoVariables = this.state?.variables?.module?.filter(
			(varObj) =>
				varObj.code === 'client-name' ||
				varObj.code === 'client-email-id' ||
				varObj.code === 'client-phone-number',
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

		let smartFieldInfoVariables = this.state?.variables?.custom?.filter(
			(varObj) => varObj?.templateId === this.props?.paramsTemplateID,
		);

		// Update the state with both sets of information
		this.setState({
			userInfo: userInfoVariables,
			companyInfo: companyInfoVariables,
			clientInfo: clientInfoVariables,
			smartFieldInfo: smartFieldInfoVariables,
		});
	};

	handleAddVariable = (value) => {
		let newComponent = { ...this.state.activeComponent };
		let new_variable_ids;
		// let newVariable = false;
		if (newComponent.variable_ids) {
			new_variable_ids = newComponent.variable_ids;
		} else {
			new_variable_ids = [];
		}
		if (_.size(new_variable_ids) > 0) {
			if (!newComponent.variable_ids.includes(value?._id)) {
				new_variable_ids.push(value?._id);
			}
		} else {
			new_variable_ids.push(value?._id);
		}
		newComponent = { ...newComponent, variable_ids: new_variable_ids };

		this.setState({ activeComponent: newComponent }, () => {
			// console.log('checking ',newComponent?.variable_ids , new_variable_ids)
			this.props?.setActivePopupComponent(newComponent);
			this.props?.updateActiveVariables(value?._id, value?.displayName);
		});
	};

	// Add search handler
	handleSearch = (e) => {
		const searchQuery = e.target.value?.toLowerCase();
		this.setState({ searchQuery }, () => {
			this.filterVariables(searchQuery);
		});
	};

	// Filter variables based on search
	filterVariables = (searchQuery) => {
		const filtered = {
			clientInfo:
				this.state.clientInfo?.filter((variable) =>
					(variable.displayName || variable.defaultValue)
						?.toLowerCase()
						?.includes(searchQuery),
				) || [],
			smartFieldInfo:
				this.state.smartFieldInfo?.filter((variable) =>
					(variable.displayName || variable.defaultValue)
						?.toLowerCase()
						?.includes(searchQuery),
				) || [],
			companyInfo:
				this.state.companyInfo?.filter((variable) =>
					(variable.displayName || variable.defaultValue)
						?.toLowerCase()
						?.includes(searchQuery),
				) || [],
			userInfo:
				this.state.userInfo?.filter((variable) =>
					(variable.displayName || variable.defaultValue)
						?.toLowerCase()
						?.includes(searchQuery),
				) || [],
			custom:
				this.state.variables?.custom?.filter((variable) =>
					(variable.displayName || variable.defaultValue)
						?.toLowerCase()
						?.includes(searchQuery),
				) || [],
		};

		this.setState({ filteredVariables: filtered });
	};
	render() {
		const { searchQuery, filteredVariables } = this.state;
		const variablesToShow = searchQuery
			? filteredVariables
			: {
					clientInfo: this.state.clientInfo,
					smartFieldInfo: this.state.smartFieldInfo,
					companyInfo: this.state.companyInfo,
					userInfo: this.state.userInfo,
					custom: this.state.variables?.custom,
			  };
		return (
			<div className="elementPopupContainer">
				{/* <div className="elementPopupHeader">
					<p className={'active'}>Smart Field</p>
				</div> */}
				<div className="element_image_container_main element-shapes-container">
					<div className="element_image">
						<div className="element_pasteURL">
							<>
								<div className="j-icon-search-container">
									<div className="j-icon-search">
										<div className="j-icon-search-input">
											{/* <SearchIcon /> */}

											<input
												placeholder="@ search smart fields"
												type="text"
												value={this.state?.searchedIcon}
												onChange={this.handleSearch}
											/>
										</div>
									</div>
								</div>
							</>
							{variablesToShow?.clientInfo?.length > 0 ? (
								<>
									{/* <div className="line"></div> */}
									<p className="subheading" style={{ marginBottom: '5px' }}>
										Client info
									</p>
									{variablesToShow?.clientInfo?.map((variable) => {
										return (
											<>
												<p
													className="heading"
													onClick={() => {
														this.handleAddVariable(variable);
													}}
													style={{
														cursor: 'pointer',
													}}
												>
													{variable?.displayName ||
														variable?.defaultValue}
												</p>
											</>
										);
									})}
								</>
							) : (
								''
							)}
							{variablesToShow?.smartFieldInfo?.length > 0 ? (
								<>
									<div className="line"></div>
									<p className="subheading" style={{ marginBottom: '5px' }}>
										Smart file Info
									</p>
									{variablesToShow?.smartFieldInfo?.map((variable) => {
										return (
											<>
												<p
													className="heading"
													onClick={() => {
														this.handleAddVariable(variable);
													}}
													style={{
														cursor: 'pointer',
													}}
												>
													{variable?.displayName ||
														variable?.defaultValue}
												</p>
											</>
										);
									})}
								</>
							) : (
								''
							)}
							{variablesToShow?.companyInfo?.length > 0 ? (
								<>
									<div className="line"></div>
									<p className="subheading" style={{ marginBottom: '5px' }}>
										Company Info
									</p>
									{variablesToShow?.companyInfo?.map((variable) => {
										return (
											<>
												<p
													className="heading"
													onClick={() => {
														this.handleAddVariable(variable);
													}}
													style={{
														cursor: 'pointer',
													}}
												>
													{variable?.displayName ||
														variable?.defaultValue}
												</p>
											</>
										);
									})}
								</>
							) : (
								''
							)}
							{variablesToShow?.userInfo?.length > 0 ? (
								<>
									<div className="line"></div>
									<p className="subheading" style={{ marginBottom: '5px' }}>
										User Info
									</p>
									{variablesToShow?.userInfo?.map((variable) => {
										return (
											<>
												<p
													className="heading"
													onClick={() => {
														this.handleAddVariable(variable);
													}}
													style={{
														cursor: 'pointer',
													}}
												>
													{variable?.displayName ||
														variable?.defaultValue}
												</p>
											</>
										);
									})}
								</>
							) : (
								''
							)}
							{variablesToShow?.custom?.length > 0 ? (
								<>
									<div className="line"></div>
									<p className="subheading" style={{ marginBottom: '5px' }}>
										Custom Info
									</p>
									{variablesToShow?.custom?.map((variable) => {
										return (
											<>
												<div
													className="heading"
													onClick={() => {
														this.handleAddVariable(variable);
													}}
													style={{
														cursor: 'pointer',
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
													}}
												>
													<div className="variable-item">
														{variable?.displayName ||
															variable?.defaultValue}
													</div>
													<div
														style={{
															cursor: 'pointer',
															padding: '5px',
															display: 'flex',
															gap: '10px',
															alignItems: 'center',
															justifyContent: 'center',
														}}
														className="variable-item-icon"
													>
														<span
															onClick={(e) => {
																e.stopPropagation();
																e.preventDefault();
																this.props?.handleDeleteVariable(
																	variable?._id,
																);
															}}
														>
															{![
																'Grand Total',
																'Sub Total in words',
															].some((keyword) =>
																variable?.displayName?.includes(
																	keyword,
																),
															) && <DeleteIcon />}
														</span>
														<span
															onClick={(e) => {
																e.stopPropagation();
																e.preventDefault();
																this.props?.handleEditVariable(
																	variable,
																);
															}}
														>
															{![
																'Grand Total',
																'Sub Total in words',
															].some((keyword) =>
																variable?.displayName?.includes(
																	keyword,
																),
															) && (
																<Edit
																	style={{
																		height: '16px',
																		width: '16px',
																	}}
																/>
															)}
														</span>
													</div>
												</div>
											</>
										);
									})}
								</>
							) : (
								''
							)}
							<div className="line"></div>
							<div
								className="heading"
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									gap: '10px',
									cursor: 'pointer',
								}}
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
									this.props?.handleShowSmartModal('create');
								}}
							>
								<Plus /> Add custom field
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
