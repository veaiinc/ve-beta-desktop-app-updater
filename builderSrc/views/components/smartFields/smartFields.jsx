import React from 'react';
import './smartFields.scss';
import _ from 'lodash';
import { ReactComponent as DropDown } from '../../../assets/svg/dropDown.svg';
import { ReactComponent as QuestionMark } from './smartFields/questionMark.svg';
import { ReactComponent as Search } from './smartFields/search.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import Modal from '../../components/library/modals/index';
import { ReactComponent as Delete } from '../../../assets/svg/delete.svg';
import { ReactComponent as Edit } from '../../../assets/svg/edit.svg';

import { ReactComponent as Text } from './smartFields/text.svg';
import { ReactComponent as LongText } from './smartFields/longText.svg';
import { ReactComponent as Number } from './smartFields/number.svg';
import { ReactComponent as PhoneNumber } from './smartFields/phoneNumber.svg';
import { ReactComponent as Email } from './smartFields/at.svg';
import { ReactComponent as Date } from './smartFields/date.svg';
import { ReactComponent as Link } from './smartFields/link.svg';
import { ReactComponent as Currency } from './smartFields/currency.svg';
import { ReactComponent as Lock } from './smartFields/lock.svg';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Proposals from '../../../controllers/proposals';
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

class SmartFields extends Proposals {
	constructor(props) {
		super(props);
		this.state = {
			fieldData: props?.fieldData || [],
			showTooltip: false,
			showDefaultValue: false,
			showAddSmartFieldModal: false,
			isOpen: false,
			selectedOption: '',
			searchTerm: '',
			value: '',
			name: '',
			isEdit: false,
			activeFieldData: {},
		};
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.state.fieldData !== nextProps.fieldData) {
			this.setState({
				fieldData: nextProps.fieldData,
			});
		}
	};
	componentDidMount() {}
	componentDidUpdate() {
		if (this.props.fieldData !== this.state.fieldData) {
			this.props.setFieldData(this.state.fieldData);
		}
	}

	handleToggleTooltip = () => {
		this.setState((prevState) => ({ showTooltip: !prevState.showTooltip }));
	};
	handleToggleDefaultValue = () => {
		this.setState((prevState) => ({ showDefaultValue: !prevState.showDefaultValue }));
	};

	handleCloseAddSmartFieldModal = () => {
		this.setState({
			showAddSmartFieldModal: !this.state.showAddSmartFieldModal,
			name: '',
			value: '',
			selectedOption: '',
			isEdit: false,
		});
	};
	handleSelect = (value) => {
		this.setState({ selectedOption: value, isOpen: false });
	};
	handleSearchChange = (event) => {
		this.setState({ searchTerm: event.target.value });
	};
	handleEditSmartFields = (field) => {
		const showModal = field.type !== 'module' && field.type !== 'workspace';
		this.setState({
			showAddSmartFieldModal: showModal,
			name: field.displayName,
			value: field.defaultValue,
			selectedOption: field.inputType,
			isEdit: true,
			activeFieldData: field,
		});
	};

	editSmartFields = () => {
		const { value, selectedOption, name, activeFieldData } = this.state;
		const referancejson = {
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
		if (!_.isEqual(referancejson, json)) {
			this.updateVariables(json, this.props.activeModuleId, activeFieldData?._id);
			this.setState({
				showAddSmartFieldModal: false,
			});
		} else {
			this.setState({
				showAddSmartFieldModal: false,
			});
		}
	};
	deleteSmartField = () => {
		this.deleteVariable(this.props.activeModuleId, this.state.activeFieldData?._id);
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
		};
		this.postVariables(json, this.props.activeModuleId);
		this.setState({
			showAddSmartFieldModal: false,
			name: '',
			value: '',
			selectedOption: '',
		});
	};

	render() {
		const { fieldData, searchTerm } = this.state;
		let data = [...fieldData.custom, ...fieldData.module, ...fieldData.workspace];
		const filteredFieldData = data.filter((field) =>
			field?.displayName?.toLowerCase?.()?.includes(searchTerm?.toLowerCase()),
		);

		return (
			<>
				<div className="smart-fields-container">
					<div className="smart-fields-navbar">
						<div className="smart-field-title">
							<div className="smart-field-back-button" onClick={this.props.close}>
								<DropDown style={{ transform: 'rotate(90deg)' }} />
							</div>
							<p>Smart Fields</p>
							<div
								className="smart-field-education-icon"
								onMouseEnter={this.handleToggleTooltip}
								onMouseLeave={this.handleToggleTooltip}
							>
								<QuestionMark />
								{this.state?.showTooltip && (
									<div className="tooltip">
										<p className="heading">Smart Fields</p>
										<p className="subTitle">
											Personalise your files with smart fields, which pull
											information from client or project details and display
											it as plain text within the file to clients.
										</p>
									</div>
								)}
							</div>
						</div>
						<div className="smart-field-search-container">
							<div className="smart-field-search-input-container">
								<Search />
								<input
									type="text"
									placeholder="search"
									value={searchTerm}
									onChange={this.handleSearchChange}
								/>
							</div>
							<div
								className="smart-field-add-button"
								onClick={() => {
									this.setState({ showAddSmartFieldModal: true });
								}}
							>
								<p>+ Add Smart Field</p>
							</div>
						</div>
					</div>
					<div className="smart-fields-table-container">
						<table className="smart-fields-table">
							<thead className="smart-fields-thead">
								<tr className="smart-fields-tr">
									<th>Name</th>
									<th>Input Type</th>
									<th>Field Type</th>
									<th className="smart-fields-default-value-column">
										Default&nbsp;Value&nbsp;&nbsp;
										<div
											onMouseEnter={this.handleToggleDefaultValue}
											onMouseLeave={this.handleToggleDefaultValue}
											className="default-education-container"
										>
											<QuestionMark />
											{this.state.showDefaultValue && (
												<div className="tooltip">
													<p className="heading">Default value</p>
													<p className="subTitle">
														Personalise your files with smart fields,
														which pull information from client or
														project details and display it as plain text
														within the file to clients.
													</p>
												</div>
											)}
										</div>
									</th>
								</tr>
							</thead>
							<tbody className="smart-fields-tbody">
								{filteredFieldData?.map((field, index) => (
									<tr
										key={index}
										className="smart-fields-tr"
										onClick={() => this.handleEditSmartFields(field)}
									>
										<td>{field.displayName}</td>
										<td className="input-type-column">
											<span className="input-type-image">
												{inputTypeImages[field?.inputType]}
											</span>

											{field.inputType}
										</td>
										<td>{field.type}</td>
										<td className="default-value-column">
											<p>
												<span>
													{['module', 'workspace'].includes(
														field.type,
													) && <Lock />}
												</span>
												{field.defaultValue}
											</p>
											{!['module', 'workspace'].includes(field.type) && (
												<p className="smart-file-options">
													<Edit style={{ cursor: 'pointer' }} />
													<Delete
														style={{ cursor: 'pointer' }}
														onClick={(e) => {
															e.stopPropagation();
															this.deleteSmartField(e);
														}}
													/>
												</p>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<Modal
					show={this.state.showAddSmartFieldModal}
					handleClose={(e) => {
						this.handleCloseAddSmartFieldModal(e);
					}}
					modalType={'center'}
				>
					<div className="create-smart-field-container">
						<div className="create-smart-field-header">
							{this.state.isEdit ? (
								<p>Edit Smart Field</p>
							) : (
								<p>Create Smart Field</p>
							)}

							<Close
								style={{ width: '30px', height: '30px', cursor: 'pointer' }}
								onClick={(e) => {
									this.handleCloseAddSmartFieldModal(e);
								}}
							/>
						</div>
						<div className="create-smart-field-body">
							<div>
								<p>Name</p>
								<input
									type="text"
									placeholder="Enter name"
									value={this.state.name}
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
										this.setState({ isOpen: !this.state.isOpen });
									}}
								>
									{this.state.selectedOption ? (
										<p>{this.state.selectedOption}</p>
									) : (
										<p style={{ color: '#999999' }}>Select an option</p>
									)}

									<DropDown />
								</div>

								{this.state?.isOpen && (
									<div className="dropdown-options-container">
										{options.map((option) => (
											<div
												key={option.value}
												className="dropdown-option"
												onClick={() => this.handleSelect(option.value)}
											>
												<div>{option.image}</div>
												<p className="options">{option.label}</p>
											</div>
										))}
									</div>
								)}
							</div>
							<div>
								<p>Value</p>

								<input
									type={this.state.selectedOption}
									placeholder="Enter name"
									value={this.state.value}
									onChange={(e) => {
										this.setState({ value: e.target.value });
									}}
								/>
							</div>
						</div>
						<div className="create-smart-field-footer">
							{this.state.isEdit && (
								<p
									onClick={(e) => {
										e.stopPropagation();
										this.editSmartFields();
									}}
								>
									Edit field
								</p>
							)}
							{!this.state.isEdit && (
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
			</>
		);
	}
}

export default SmartFields;
