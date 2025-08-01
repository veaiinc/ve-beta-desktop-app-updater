import React from 'react';
import ReactModal from '../../modalsV2/index';
import { ReactComponent as CheckIcon } from '../../../../assets/svg/tick.svg';
import { ReactComponent as ErrorIcon } from '../../../../assets/svg/gallery/toastError.svg';
import { ReactComponent as LoadingIcon } from '../../../../assets/svg/gallery/rotating-circle.svg';
import './stepDetailsModal.scss';

const StepDetailsModal = ({ isOpen, closeModal, step, stepIndex }) => {
	if (!step) return null;
	const getStepStatus = (step) => {
		if (step.result) {
			if (step.result.successful) {
				return 'success';
			} else if (step.result.error) {
				return 'error';
			} else {
				return 'pending';
			}
		}
		return 'pending';
	};

	const formatStepName = (name) => {
		if (!name) return 'Unknown Step';
		return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
	};

	const formatResult = (result) => {
		if (!result) return '';
		if (typeof result === 'string') {
			if (result.toLowerCase().includes('error')) {
				return result.replace(/error in tool: /i, '').trim();
			}
			return result;
		}
		return JSON.stringify(result, null, 2);
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'success':
				return <CheckIcon className="status-icon success" />;
			case 'error':
				return <ErrorIcon className="status-icon error" />;
			case 'loading':
				return <LoadingIcon className="status-icon loading" />;
			default:
				return <div className="status-icon pending" />;
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case 'success':
				return 'Completed';
			case 'error':
				return 'Failed';
			case 'loading':
				return 'Processing...';
			default:
				return 'Pending';
		}
	};

	const status = getStepStatus(step);

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="stepDetailsModalContainer">
				<div className="header">
					<div className="title-section">
						{getStatusIcon(status)}
						<span className="step-title">{formatStepName(step.name)}</span>
						<span className={`step-status ${status}`}>{getStatusText(status)}</span>
					</div>
					<button className="closeButton" onClick={closeModal}>
						×
					</button>
				</div>

				<div className="contentSection">
					{step.input && (
						<div className="input-section">
							<h3>Input from agent</h3>
							<div className="input-content">
								{typeof step.input === 'object' ? (
									<div className="input-fields">
										{/* Handle all input fields dynamically */}
										{Object.entries(step.input).map(([key, value]) => (
											<div key={key} className="input-field">
												<label>
													{key.charAt(0).toUpperCase() + key.slice(1)}
												</label>
												<p className="field-description">
													Input parameter: {key}
												</p>
												<div className="field-value">
													{typeof value === 'object' ? (
														<pre>{JSON.stringify(value, null, 2)}</pre>
													) : (
														value.toString()
													)}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="input-field">
										<label>Input</label>
										<p className="field-description">
											Input data for this step
										</p>
										<div className="field-value">{step.input}</div>
									</div>
								)}
							</div>
						</div>
					)}

					{step.result && (
						<div className="result-section">
							<h3>Tool output</h3>
							<div className="result-content">
								{typeof step.result === 'object' ? (
									<div className="result-fields">
										{Object.entries(step.result).map(([key, value]) => (
											<div key={key} className="result-field">
												<label>{key}</label>
												<p className="field-description">
													{key.toLowerCase()}
												</p>
												<div className="field-value">
													{typeof value === 'object' ? (
														<pre>{JSON.stringify(value, null, 2)}</pre>
													) : (
														value.toString()
													)}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="result-field">
										<label>Result</label>
										<p className="field-description">Output from this step</p>
										<div className={`field-value ${status}`}>
											{formatResult(step.result)}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</ReactModal>
	);
};

export default StepDetailsModal;
