import React, { memo, useContext, useState, useCallback, useRef } from 'react';
import { throttle } from 'lodash';
import { Checkbox } from 'antd';
import '../../../assets/scss/landingScreen/contactus/contactus.scss';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import SelectDropdown from './SelectDropdown';
import { message as toast } from '../../../views/components/globalComponents/CustomToast';
import Spinner from '../loaders/Spinner';

const employeeCount = [
	{ value: 'A. 1-10', label: '1-10' },
	{ value: 'B. 11-50', label: '11-50' },
	{ value: 'C. 51-200', label: '51-200' },
	{ value: 'D. 201-500+', label: '201-500+' },
];

const headquartersOptions = [
	{ value: 'A. United States', label: 'United States' },
	{ value: 'B. India', label: 'India' },
	{ value: 'C. Dubai', label: 'Dubai' },
	{ value: 'D. United Kingdom', label: 'United Kingdom' },
	{ value: 'E. Australia', label: 'Australia' },
	{ value: 'F. Canada', label: 'Canada' },
	{ value: 'G. Uganda', label: 'Uganda' },
	{ value: 'H. South Africa', label: 'South Africa' },
	{ value: 'I. Brazil', label: 'Brazil' },
	{ value: 'J. Japan', label: 'Japan' },
];

const throttleDelay = 1000;

const initialState = {
	formData: {
		email: '',
		firstName: '',
		lastName: '',
		companyName: '',
		jobTitle: '',
		platformUsers: '',
		headquarters: '',
		message: '',
		marketingConsent: false,
		employees: '',
		companyHeadquarters: '',
	},
	employeesDropdownVisible: false,
	companyHeadquartersDropdownVisible: false,
	errors: {},
	loading: false,
};

const ContactUs = ({ type }) => {
	const navigate = useNavigate();

	const [info, setInfo] = useState(initialState);

	const {
		templates: { sendContactFormData },
	} = useContext(Context);

	const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

	// Ref-wrapped throttled function to avoid stale closures
	const throttledSubmitRef = useRef(
		throttle((formData, sendFn) => {
			const newErrors = {};

			const {
				email,
				firstName,
				lastName,
				companyName,
				jobTitle,
				message,
				marketingConsent,
				employees,
				companyHeadquarters,
			} = formData;

			if (!email || !validateEmail(email)) newErrors.email = 'Enter a valid email address';
			if (!firstName) newErrors.firstName = 'First name is required';
			if (!lastName) newErrors.lastName = 'Last name is required';
			if (!companyName) newErrors.companyName = 'Company name is required';
			if (!jobTitle) newErrors.jobTitle = 'Job title is required';
			if (!employees) newErrors.employees = 'Select employee range';
			if (!companyHeadquarters) newErrors.companyHeadquarters = 'Select a headquarters';
			if (!message) newErrors.message = 'Message is required';
			if (!marketingConsent)
				newErrors.marketingConsent = 'You must agree to marketing consent';

			if (Object.keys(newErrors).length > 0) {
				setInfo((prev) => ({ ...prev, errors: newErrors }));
				return;
			}

			setInfo((prev) => ({ ...prev, errors: {}, loading: true }));

			sendFn(formData)
				.then((res) => {
					if (res?.[0]) {
						toast.success('Form submitted successfully!');
						setInfo(initialState);
					} else {
						throw new Error('An unexpected error occurred. Please try again!');
					}
				})
				.catch((error) => {
					console.error(error);
					toast.error(error?.message || 'Something went wrong!');
				})
				.finally(() => {
					setInfo(initialState);
				});
		}, throttleDelay),
	);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setInfo((prev) => ({
			...prev,
			formData: {
				...prev.formData,
				[name]: type === 'checkbox' ? checked : value,
			},
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		throttledSubmitRef.current(info.formData, sendContactFormData);
	};

	return (
		<div className="contact-form-wrapper">
			<div className="title-section">
				{/* <h1>Contact us for {type?.toLowerCase() || ''}</h1> */}
				<h1>Contact us for Support</h1>
				<p>
					We'd love to hear from you! Need a consultation or just want to say hello? We're
					here to help. Reach out to us via call, email, or social media, and our team
					will get back to you as soon as possible.
				</p>
			</div>

			<form className="contact-form" onSubmit={handleSubmit}>
				{/* Work Email */}
				<label>
					Work email
					<input
						type="email"
						name="email"
						placeholder="Ex-Alena@gmail.com"
						value={info.formData.email}
						onChange={handleChange}
						className={info.errors.email ? 'error' : ''}
					/>
					{info.errors.email && <span className="error-text">{info.errors.email}</span>}
				</label>

				{/* First and Last Name */}
				<div className="grid">
					<label>
						First name
						<input
							type="text"
							name="firstName"
							placeholder="Enter your First name"
							value={info.formData.firstName}
							onChange={handleChange}
							className={info.errors.firstName ? 'error' : ''}
						/>
						{info.errors.firstName && (
							<span className="error-text">{info.errors.firstName}</span>
						)}
					</label>
					<label>
						Last name
						<input
							type="text"
							name="lastName"
							placeholder="Enter your Last name"
							value={info.formData.lastName}
							onChange={handleChange}
							className={info.errors.lastName ? 'error' : ''}
						/>
						{info.errors.lastName && (
							<span className="error-text">{info.errors.lastName}</span>
						)}
					</label>
				</div>

				{/* Company Name and Job Title */}
				<div className="grid">
					<label>
						Company name
						<input
							type="text"
							name="companyName"
							placeholder="Ex - AbcGroups"
							value={info.formData.companyName}
							onChange={handleChange}
							className={info.errors.companyName ? 'error' : ''}
						/>
						{info.errors.companyName && (
							<span className="error-text">{info.errors.companyName}</span>
						)}
					</label>
					<label>
						Job title
						<input
							type="text"
							name="jobTitle"
							placeholder="Ex - Product designer"
							value={info.formData.jobTitle}
							onChange={handleChange}
							className={info.errors.jobTitle ? 'error' : ''}
						/>
						{info.errors.jobTitle && (
							<span className="error-text">{info.errors.jobTitle}</span>
						)}
					</label>
				</div>

				{/* Employees and Company Headquarters */}
				<div className="grid">
					<label>
						<span className="dropdownText">Employees</span>
						<SelectDropdown
							options={employeeCount}
							value={info.formData.employees}
							setOption={(option) =>
								setInfo((prev) => ({
									...prev,
									formData: {
										...prev.formData,
										employees: option.value,
									},
								}))
							}
							visible={info.employeesDropdownVisible}
							setVisible={(value) =>
								setInfo((prev) => ({
									...prev,
									employeesDropdownVisible: value,
								}))
							}
						/>
						{info.errors.employees && (
							<span className="error-text">{info.errors.employees}</span>
						)}
					</label>

					<label>
						<span className="dropdownText">Company headquarters</span>
						<SelectDropdown
							options={headquartersOptions}
							searchable
							value={info.formData.companyHeadquarters}
							setOption={(option) =>
								setInfo((prev) => ({
									...prev,
									formData: {
										...prev.formData,
										companyHeadquarters: option.value,
									},
								}))
							}
							visible={info.companyHeadquartersDropdownVisible}
							setVisible={(value) =>
								setInfo((prev) => ({
									...prev,
									companyHeadquartersDropdownVisible: value,
								}))
							}
						/>
						{info.errors.companyHeadquarters && (
							<span className="error-text">{info.errors.companyHeadquarters}</span>
						)}
					</label>
				</div>

				{/* Message */}
				<label>
					<span className="tellUsMoreLabel">
						Tell us more about how you want to use VE.AI
					</span>
					<textarea
						name="message"
						placeholder="Ex - We want to use VE.AI to make our video editing faster and easier. We're also interested in trying out AI tools to improve our content and save time."
						value={info.formData.message}
						onChange={handleChange}
						className={info.errors.message ? 'error' : ''}
					></textarea>
					{info.errors.message && (
						<span className="error-text">{info.errors.message}</span>
					)}
				</label>

				{/* Marketing Consent */}
				<div className="checkbox-group">
					<Checkbox
						className="custom-notification-checkbox"
						checked={info.formData.marketingConsent}
						onChange={(e) => {
							setInfo((prev) => ({
								...prev,
								formData: {
									...prev.formData,
									marketingConsent: e.target.checked,
								},
							}));
						}}
					/>
					<p>
						I agree to VE sending me marketing communications, as described in the{' '}
						<span
							className="privacy-policy-link"
							onClick={() => navigate('/privacy-policy')}
						>
							Privacy
						</span>{' '}
						and{' '}
						<span
							className="cookie-policy-link"
							onClick={() => navigate('/cookie-policy')}
						>
							Cookie policy
						</span>
					</p>
				</div>
				{info.errors.marketingConsent && (
					<span className="error-text">{info.errors.marketingConsent}</span>
				)}

				{/* Submit Button */}
				<button type="submit" disabled={info.loading}>
					{info.loading ? (
						<>
							Submitting... <Spinner />
						</>
					) : (
						'Submit'
					)}
				</button>
			</form>
		</div>
	);
};

export default memo(ContactUs);
