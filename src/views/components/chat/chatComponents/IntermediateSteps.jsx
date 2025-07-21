import React, { useState } from 'react';
import { ReactComponent as CheckIcon } from '../../../../assets/svg/tick.svg';
import { ReactComponent as ErrorIcon } from '../../../../assets/svg/gallery/toastError.svg';
import { ReactComponent as LoadingIcon } from '../../../../assets/svg/gallery/rotating-circle.svg';
import StepDetailsModal from './StepDetailsModal';
import './intermediateSteps.scss';

const IntermediateSteps = ({ steps = [], isStreaming = false }) => {
	const [selectedStep, setSelectedStep] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getStepStatus = (step, index) => {
		if (isStreaming && index === steps.length - 1) {
			return 'loading';
		}

		if (step.result) {
			if (step.result.success) {
				return 'success';
			}
			return 'error';
		}

		return 'pending';
	};

	const formatStepName = (name) => {
		if (!name) return 'Unknown Step';
		return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
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

	const handleStepClick = (step, index) => {
		setSelectedStep({ ...step, index });
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedStep(null);
	};

	if (!steps || steps.length === 0) {
		return null;
	}

	// Filter out steps that don't have a name or are empty
	const validSteps = steps.filter((step) => step && (step.name || step.input || step.result));

	if (validSteps.length === 0) {
		return null;
	}

	return (
		<>
			<div className="intermediate-steps-container">
				<div className="steps-compact">
					{validSteps.map((step, index) => {
						const status = getStepStatus(step, index);

						return (
							<div
								key={index}
								className={`step-compact-item ${status}`}
								onClick={() => handleStepClick(step, index)}
							>
								{getStatusIcon(status)}
								<span className="step-name">{formatStepName(step.name)}</span>
								<span className={`step-status ${status}`}>
									{getStatusText(status)}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			<StepDetailsModal
				isOpen={isModalOpen}
				closeModal={closeModal}
				step={selectedStep}
				stepIndex={selectedStep?.index}
			/>
		</>
	);
};

export default IntermediateSteps;
