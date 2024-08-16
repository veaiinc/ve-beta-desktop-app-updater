import '../../../assets/scss/signin.scss';
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import HeadersDropDownComp from '../../components/dropDown/HeadersDropDownComp';

const GetBusinessDetails = ({ errorStates, setLoading, setErrorState, isLoading }) => {
	const navigate = useNavigate();
	let {
		userLogin: { createWorkspace },
	} = useContext(Context);
	const [info, setInfo] = useState({
		businessName: '',
		businessType: null,
	});

	const handleBusinessNameChange = async (e) => {
		let businessName = e.target.value;

		setInfo((prev) => ({ ...prev, businessName: businessName }));
	};

	const handleCreateWorkspace = async () => {
		if (!info?.businessName?.length || info?.businessName?.length < 4) {
			return setErrorState((prevState) => ({
				...prevState,
				message: 'Business name must be at least 4 characters',
			}));
		}
		if (!info?.businessType) {
			return setErrorState((prevState) => ({
				...prevState,
				message: 'Business Type is mandatory',
			}));
		}

		if (isLoading) {
			return;
		}
		setLoading(true);

		let workspaceId = info?.businessName
			?.replace(/[^a-zA-Z0-9 ]/g, '')
			.replace(/\s+/g, '')
			.toLowerCase();

		const json = {
			workspaceId,
			businessName: info?.businessName,
			businessType: info?.businessType?.value,
		};
		const response = await createWorkspace(json);
		if (response?.[0]) {
			setLoading(false);
			navigate('/sales');
		} else {
			setLoading(false);
		}
	};

	const onBusinessTypeChange = (value) => {
		if (info?.businessType === value) {
			return;
		}
		setErrorState((prevState) => ({
			...prevState,
			message: '',
		}));
		setInfo((prev) => ({ ...prev, businessType: value }));
	};

	const options = [
		{
			label: 'Make up Artist',
			value: 'makeUpArtist',
		},
		{
			label: 'Consultant',
			value: 'consultant',
		},
		{
			label: 'Salon & Spa',
			value: 'salonAndSpa',
		},
		{
			label: 'Architecture',
			value: 'architecture',
		},
		{
			label: 'Photographer',
			value: 'photographer',
		},
		{
			label: 'Fashion Designer',
			value: 'fashionDesigner',
		},
		{
			label: 'Event Management',
			value: 'eventManagement',
		},
		{
			label: 'Interior Designer',
			value: 'interiorDesigner',
		},
		{
			label: 'Business Coach',
			value: 'businessCoach',
		},
		{
			label: 'Restaurateur',
			value: 'restaurateur',
		},
	];

	return (
		<div className="stepOne">
			<p className="heading">Let’s get Started</p>
			<p className="description businessDescription">
				Tailor our services to match your preferences
			</p>

			<div className="inputContainer">
				<input
					type="text"
					placeholder="What is your Business Name"
					name="businessName"
					value={info?.businessName}
					onChange={handleBusinessNameChange}
				/>
			</div>
			<div className="businessTypeDropDown">
				<label for="workspaceSelect">What’s your Business Type?</label>
				<HeadersDropDownComp
					showIcon={false}
					options={options}
					selectedValue={info?.businessType?.label || ''}
					containerStyle={{
						padding: '12px 24px',
						height: '48px',
						padding: '12px 24px',
						borderRadius: '20px',
						border: '1px solid #222',
						background: '#111',
						color: '#e4e5e6',
						width: 'auto',
					}}
					dropDownStyle={{
						right: 0,
						top: '60px',
					}}
					onChangeFunc={(ele) => onBusinessTypeChange(ele)}
				/>
			</div>

			<div className="continueContainer active" onClick={handleCreateWorkspace}>
				{isLoading ? <p>Loading...</p> : <p>Continue</p>}
			</div>
			<p className="errorMessage">{errorStates['message']}</p>
		</div>
	);
};

export default GetBusinessDetails;
