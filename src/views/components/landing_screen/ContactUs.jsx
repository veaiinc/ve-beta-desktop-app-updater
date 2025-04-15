import React, { useState } from 'react';
import '../../../assets/scss/landingScreen/contactus/contactus.scss';
import { sendContactFormData } from './helper';

const ContactUs = ({ type }) => {
	const [formData, setFormData] = useState({
		email: '',
		firstName: '',
		lastName: '',
		companyName: '',
		jobTitle: '',
		platformUsers: '',
		headquarters: '',
		message: '',
		marketingConsent: false,
		type,
	});

	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const validateEmail = (email) => {
		return /\S+@\S+\.\S+/.test(email);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = {};
		if (!validateEmail(formData.email)) {
			newErrors.email = 'Enter a valid Email address';
		}
		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			sendContactFormData(formData);
		}
	};

	return (
		<div className="contact-form-wrapper">
			<div className="title-section">
				<h1>Contact us</h1>
				<p>
					We’d love to hear from you! need a consultation, or just want to say hello,
					we’re here to help. Reach out to us via call, email, or social media, and our
					team will get back to you as soon as possible.
				</p>
			</div>
			<form className="contact-form" onSubmit={handleSubmit}>
				<label>
					Work email
					<input
						type="email"
						name="email"
						placeholder="Ex-Alena@gmail.com"
						value={formData.email}
						onChange={handleChange}
						className={errors.email ? 'error' : ''}
					/>
					{errors.email && <span className="error-text">{errors.email} *</span>}
				</label>

				<div className="grid">
					<label>
						First name
						<input
							type="text"
							name="firstName"
							placeholder="Selected State"
							value={formData.firstName}
							onChange={handleChange}
						/>
					</label>
					<label>
						Last name
						<input
							type="text"
							name="lastName"
							placeholder="Enter your Last name"
							value={formData.lastName}
							onChange={handleChange}
						/>
					</label>
				</div>

				<div className="grid">
					<label>
						Company name
						<input
							type="text"
							name="companyName"
							placeholder="Ex - AbcGroups"
							value={formData.companyName}
							onChange={handleChange}
						/>
					</label>
					<label>
						Job title
						<input
							type="text"
							name="jobTitle"
							placeholder="Ex - Product designer"
							value={formData.jobTitle}
							onChange={handleChange}
						/>
					</label>
				</div>

				<div className="grid">
					<label>
						Platform users
						<select
							name="platformUsers"
							value={formData.platformUsers}
							onChange={handleChange}
						>
							<option value="">Please select</option>
							<option value="1-10">1-10</option>
							<option value="11-50">11-50</option>
							<option value="51+">51+</option>
						</select>
					</label>

					<label>
						Company headquarters
						<select
							name="headquarters"
							value={formData.headquarters}
							onChange={handleChange}
						>
							<option value="">Please select</option>
							<option value="USA">USA</option>
							<option value="Europe">Europe</option>
							<option value="Asia">Asia</option>
						</select>
					</label>
				</div>

				<label>
					Tell us more about how you want to use VE.AI
					<textarea
						name="message"
						placeholder="Ex - We want to use VE.AI to make our video editing faster..."
						value={formData.message}
						onChange={handleChange}
					></textarea>
				</label>

				<div className="checkbox-group">
					<input
						type="checkbox"
						name="marketingConsent"
						checked={formData.marketingConsent}
						onChange={handleChange}
					/>
					<p>
						I agree to VE sending me marketing communications, as described in the{' '}
						<a href="#">
							<span>Privacy </span>
						</a>
						and{' '}
						<a href="#">
							<span>Cookie policy</span>
						</a>
					</p>
				</div>

				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default ContactUs;
