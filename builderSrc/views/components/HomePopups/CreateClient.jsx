import React from 'react';
import { ReactComponent as Search } from '../../../assets/svg/CreateClient/Search.svg';
import { ReactComponent as Add } from '../../../assets/svg/CreateClient/Plus.svg';
import { ReactComponent as Close } from '../../../assets/svg/Settings/CloseSetting.svg';
// import { ReactComponent as Tick } from '../../../assets/svg/CreateClient/Tick.svg';
import { ReactComponent as DropSet } from '../../../assets/svg/CreateClient/Drop.svg';
import PhoneInput from 'react-phone-number-input';
import './HomePagePopup.scss';
import { Spin } from 'antd';

class CreateClient extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			updateClient: props.updateClient,
			addClientDetails: props.addClientDetails,
			searchClientName: '',
			clientListArray: props?.clientListArray,
			clientData: { name: '', email: '', phone: '', source: '' },
			sourceList: ['Instagram', 'Facebook', 'Linkedin', 'Other'],
			sourceDropdown: false,
			errorNameMsg: false,
			errorEmailMsg: false,
			errorPhoneMsg: false,
		};
		this.SearchinputRef = React.createRef();
	}
	componentDidMount() {
		setTimeout(() => {
			if (this.SearchinputRef?.current) {
				this.SearchinputRef?.current.focus();
			}
		}, 100);
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.updateClient !== nextProps.updateClient && nextProps.updateClient) {
			this.setState({
				updateClient: nextProps.updateClient,
			});
		}
		if (
			this.state.addClientDetails !== nextProps.addClientDetails &&
			nextProps.addClientDetails
		) {
			this.setState({ addClientDetails: nextProps.addClientDetails });
		}

		if (this.state.clientListArray !== nextProps.clientListArray && nextProps.clientListArray) {
			this.setState({ clientListArray: nextProps.clientListArray });
		}
		// if(this.state.clientData !== nextProps.clientData && nextProps.clientData){
		//     this.setState({clientData: nextProps.clientData})
		// }
		if (this.state.sourceList !== nextProps.sourceList && nextProps.sourceList) {
			this.setState({ sourceList: nextProps.sourceList });
		}
		// if (this.state.errorNameMsg !== nextProps.errorNameMsg && nextProps.errorNameMsg) {
		// 	this.setState({ errorNameMsg: nextProps.errorNameMsg });
		// }
	};

	handleAddClient = (id) => {
		this.props.handleAddClient(id);
	};
	handleCreateClient = (e) => {
		const { name, value } = e.target;

		// For phone input, handle it separately
		if (name === 'phone') {
			this.setState(
				(prevState) => ({
					clientData: {
						...prevState.clientData,
						phone: value,
					},
				}),
				() => {
					// Phone validation
					if (!value) {
						this.setState({
							errorPhoneMsg: true,
							phoneErrorText: 'Phone number is required',
						});
					} else {
						// Basic phone validation - you can adjust the length check
						if (value.length < 8 || value.length > 15) {
							this.setState({
								errorPhoneMsg: true,
								phoneErrorText: 'Please enter a valid phone number',
							});
						} else {
							this.setState({
								errorPhoneMsg: false,
								phoneErrorText: '',
							});
						}
					}
				},
			);
			return;
		}

		// Handle other inputs
		this.setState(
			{
				clientData: {
					...this.state.clientData,
					[name]: value,
				},
			},
			() => {
				// Name validation
				if (name === 'name') {
					if (this.state.clientData.name === '') {
						this.setState({ errorNameMsg: true });
					} else if (this.state.clientData.name.length > 2) {
						this.setState({ errorNameMsg: false });
					} else {
						this.setState({ errorNameMsg: false });
					}
				}

				// Email validation
				if (name === 'email') {
					if (this.state.clientData.email === '') {
						this.setState({
							errorEmailMsg: true,
							emailErrorText: 'Email is required',
						});
					} else {
						const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

						if (!emailRegex.test(this.state.clientData.email)) {
							this.setState({
								errorEmailMsg: true,
								emailErrorText: 'Please enter a valid email address',
							});
						} else {
							this.setState({
								errorEmailMsg: false,
								emailErrorText: '',
							});
						}
					}
				}
			},
		);
	};

	// Separate handler for PhoneInput component

	handleCreateClient = (e) => {
		const { name, value } = e.target;

		// For phone input, handle it separately
		if (name === 'phone') {
			this.setState(
				(prevState) => ({
					clientData: {
						...prevState.clientData,
						phone: value,
					},
				}),
				() => {
					// Phone validation
					if (!value) {
						this.setState({
							errorPhoneMsg: true,
							phoneErrorText: 'Phone number is required',
						});
					} else {
						// Basic phone validation - you can adjust the length check
						if (value.length < 8 || value.length > 15) {
							this.setState({
								errorPhoneMsg: true,
								phoneErrorText: 'Please enter a valid phone number',
							});
						} else {
							this.setState({
								errorPhoneMsg: false,
								phoneErrorText: '',
							});
						}
					}
				},
			);
			return;
		}

		// Handle other inputs
		this.setState(
			{
				clientData: {
					...this.state.clientData,
					[name]: value,
				},
			},
			() => {
				// Name validation
				if (name === 'name') {
					if (this.state.clientData.name === '') {
						this.setState({ errorNameMsg: true });
					} else {
						this.setState({ errorNameMsg: false });
					}
				}

				// Email validation
				if (name === 'email') {
					if (this.state.clientData.email === '') {
						this.setState({
							errorEmailMsg: true,
							emailErrorText: 'Email is required',
						});
					} else {
						const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

						if (!emailRegex.test(this.state.clientData.email)) {
							this.setState({
								errorEmailMsg: true,
								emailErrorText: 'Please enter a valid email address',
							});
						} else {
							this.setState({
								errorEmailMsg: false,
								emailErrorText: '',
							});
						}
					}
				}
			},
		);
	};

	// Separate handler for PhoneInput component
	handlePhoneChange = (value) => {
		this.setState(
			(prevState) => ({
				clientData: {
					...prevState.clientData,
					phone: value || '',
				},
			}),
			() => {
				if (!value) {
					this.setState({
						errorPhoneMsg: true,
						phoneErrorText: 'Phone number is required',
					});
				} else {
					// Using the library's built-in validation
					if (value.length < 8 || value.length > 15) {
						this.setState({
							errorPhoneMsg: true,
							phoneErrorText: 'Please enter a valid phone number',
						});
					} else {
						this.setState({
							errorPhoneMsg: false,
							phoneErrorText: '',
						});
					}
				}
			},
		);
	};

	handlePhoneChange = (value) => {
		this.setState(
			(prevState) => ({
				clientData: {
					...prevState.clientData,
					phone: value || '',
				},
			}),
			() => {
				if (!value) {
					this.setState({
						errorPhoneMsg: true,
						phoneErrorText: 'Phone number is required',
					});
				} else {
					// Using the library's built-in validation
					if (value.length < 12 || value.length > 15) {
						this.setState({
							errorPhoneMsg: true,
							phoneErrorText: 'Please enter a valid phone number',
						});
					} else {
						this.setState({
							errorPhoneMsg: false,
							phoneErrorText: '',
						});
					}
				}
			},
		);
	};

	// handleCreateClient = (e) => {
	// 	const { name, value } = e.target;
	// 	this.setState(
	// 		{
	// 			clientData: {
	// 				...this.state.clientData,
	// 				[name]: value,
	// 			},
	// 		},
	// 		() => {
	// 			if (this.state.clientData.name === '') {
	// 				this.setState({ errorNameMsg: true });
	// 			} else {
	// 				this.setState({ errorNameMsg: false });
	// 			}
	//             if (this.state.clientData.email === '') {
	//                 this.setState({ errorEmailMsg: true});
	//             } else {
	//                 // Email validation regex
	//                 const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	//                 if (!emailRegex.test(this.state.clientData.email)) {
	//                     this.setState({
	//                         errorEmailMsg: true,
	//                         emailErrorText: 'Please enter a valid email address'
	//                     });
	//                 } else {
	//                     this.setState({
	//                         errorEmailMsg: false,
	//                         emailErrorText: ''
	//                     });
	//                 }
	//             }
	//             if(this.state.clientData.phone === ''){
	//                 this.setState({ errorPhoneMsg: true });
	//             }else{
	//                 this.setState({ errorPhoneMsg: false });
	//             }

	// 		},
	// 	);
	// };
	handleSource = (e) => {
		this.setState((prevState) => ({
			clientData: {
				...prevState.clientData,
				source: e,
			},
			sourceDropdown: false,
		}));
	};
	handleAddClientSubmit = () => {
		// if (!this.state.errorNameMsg && !this.state.errorEmailMsg && !this.state.errorPhoneMsg) {
		// 	this.props.handleAddClientSubmit(this.state.clientData);
		// }
		if (this.state.clientData?.name) {
			if (
				!this.state?.errorEmailMsg &&
				!this.state?.errorPhoneMsg &&
				!this.state?.errorNameMsg
			) {
				this.props.handleAddClientSubmit(this.state.clientData);
			}
		}
	};
	render() {
		return (
			<div>
				{this.state.updateClient && (
					<div className="updateClientPopup">
						{!this.state.addClientDetails ? (
							<div className="updateClientPopupWrapper">
								<div className="updateClientSubWrapper">
									<div className="updateClientPopupHeader">
										<div className="updateClientPopupTitle">Manage Client</div>
										<div className="updateClientPopupDescription">
											We found few instances of the 'Client' variables in the
											file. Link 'Client' to the fill those variables.
										</div>
									</div>

									<div className="updateClientPopupBody">
										<div className="searchContainer">
											<div className="search_input_container">
												<div className="search_input">
													<Search />

													<input
														ref={this.SearchinputRef}
														value={this.state.searchClientName}
														onChange={(e) =>
															this.setState({
																searchClientName: e.target.value,
															})
														}
														autofocus
														className="updateClient_input"
														type="text"
														placeholder="Search"
													/>
												</div>
											</div>

											<div
												onClick={() =>
													this.setState({ addClientDetails: true })
												}
												className="add_client_container"
											>
												<Add />
												<span className="add_client">New Client</span>
											</div>
										</div>
										<div className="clientName">
											{this.state.clientListArray?.length > 0 ? (
												(() => {
													const filteredClients = this.state
														.searchClientName
														? this.state.clientListArray.filter(
																(item) =>
																	item?.name
																		?.toLowerCase()
																		.includes(
																			this.state.searchClientName?.toLowerCase(),
																		),
														  )
														: this.state.clientListArray;
													return filteredClients.length > 0 ? (
														filteredClients.map((item, index) => (
															<div
																className="clientContainer"
																onClick={() =>
																	this.handleAddClient(item?._id)
																}
																key={index}
															>
																<div className="nameEmail">
																	<div className="clientNameItem">
																		{item?.name}
																	</div>
																	<div className="clientEmailItem">
																		{item?.email
																			? item?.email
																			: item?.phone
																			? item?.phone
																			: 'No Email or Phone'}
																	</div>
																</div>
																{/* <div className="tickIcon">
                        <Tick />
                    </div> */}
															</div>
														))
													) : (
														<div className="noResults">
															No matching clients found
														</div>
													);
												})()
											) : (
												<div className="noResults">
													No clients available
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="createClientPopup">
								<div className="createClientPopupHeader">
									<div className="newClientTitle">Create New Client</div>
									<div>
										<Close
											style={{
												cursor: 'pointer',
												height: '24px',
												width: '24px',
											}}
											onClick={() =>
												this.setState({ addClientDetails: false })
											}
										/>
									</div>
								</div>
								<div className="fieldWrapper">
									<div className="createNameLabel">Name *</div>
									<input
										className="createNameInput"
										value={this.state.clientData.name}
										onChange={(e) => this.handleCreateClient(e)}
										type="text"
										placeholder="Name"
										name="name"
										required
										autoFocus
									/>
									{this.state.errorNameMsg && (
										<div className="error_msg">Please enter a valid name</div>
									)}
								</div>
								<div className="fieldWrapper">
									<div className="createNameLabel">Email</div>
									<input
										className="createEmailInput"
										value={this.state.clientData.email}
										onChange={(e) => this.handleCreateClient(e)}
										type="text"
										placeholder="Email Address"
										name="email"
									/>
									{this.state.errorEmailMsg && (
										<div className="error_msg">Please enter a valid email</div>
									)}
								</div>

								<div className="fieldWrapper">
									<div className="createNameLabel">Phone</div>
									<PhoneInput
										international
										defaultCountry="IN"
										value={this.state.clientData.phone}
										onChange={this.handlePhoneChange}
										className={`createPhoneInput ${
											this.state.errorPhoneMsg ? 'error' : ''
										}`}
										placeholder="Phone Number"
										containerClass="phone-input-container"
										inputClass="phone-input-field"
										buttonClass="country-select-button"
									/>
									{this.state.errorPhoneMsg && (
										<span className="error_msg">
											{this.state.phoneErrorText}
										</span>
									)}
								</div>

								{/* <div className="fieldWrapper">
										<div className="createNameLabel">Phone *</div>
										<input className="createPhoneInput" value={this.state.clientData.phone} onChange={(e)=>this.handleCreateClient(e)} type="text" placeholder="+1" name='phone' />
									</div> */}
								<div className="fieldWrapper">
									<div className="createNameLabel">Source</div>
									<div className="source_container">
										<input
											className="createSourceInput"
											value={this.state.clientData.source}
											onChange={(e) => this.handleCreateClient(e)}
											type="text"
											placeholder="Instagram"
											name="source"
										/>
										<DropSet
											onClick={() =>
												this.setState({
													sourceDropdown: !this.state.sourceDropdown,
												})
											}
											style={{
												transform: this.state.sourceDropdown
													? 'rotate(180deg)'
													: 'rotate(0deg)',
												cursor: 'pointer',
											}}
											className="source_dropdown"
										/>
										{this.state.sourceDropdown && (
											<div className="source_dropdown_list">
												{this.state?.sourceList?.map((item, index) => (
													<div
														className="source_dropdown_item"
														onClick={() => this.handleSource(item)}
														key={index}
													>
														{item}
													</div>
												))}
											</div>
										)}
									</div>
								</div>
								<div className="add_button_container">
									{this.props.isSubmit ? (
										<span className="add_button">
											<Spin />
										</span>
									) : (
										<span
											onClick={() =>
												this.handleAddClientSubmit(this.state.clientData)
											}
											className="add_button"
										>
											Create Contact
										</span>
									)}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}
export default CreateClient;
