import React, { useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import '../../../assets/scss/onboarding/stepKnowEachOther.scss';
import ProgressBar from '../../components/onboarding/ProgressBar';

const StepKnowEachOther = ({ data = {}, onNext, onBack }) => {
	const [form, setForm] = useState({
		role: data.role || '',
		company: data.company || '',
		workspaceName: data.workspaceName || '',
		additionalGoals: data.additionalGoals || '',
		linkedin: data.linkedin || '',
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const continueDisabled = !form.role || !form.company || !form.workspaceName;

	return (
		<div className="knowEachOtherStepContainer">
			<div className="stepHeader">
				<div className="stepProgressContainer">
					<ProgressBar currentStep={3} totalSteps={4} />
					<div className="stepProgress">Step 1 of 2</div>
				</div>
				<div className="stepHeaderContent">
				<h1 className="stepTitle">Let's get to know each other</h1>
				<p className="stepDesc">
						The more I understand your role and goals, the better I can prioritize,
						remember, and act on your behalf like a partner who never drops the thread.
					</p>
				</div>
			</div>
			<div className="stepForm">
				<div className="inlineSentenceInputs">
					<span className="inlineLabel">I'm</span>
					<input
						className="inlineInput"
						name="role"
						value={form.role}
						onChange={handleChange}
						placeholder="solo creator"
						autoComplete="off"
					/>
					<span className="inlineLabel">At</span>
					<input
						className="inlineInput"
						name="company"
						value={form.company}
						onChange={handleChange}
						placeholder="a media brand"
						autoComplete="off"
					/>
					<span className="inlineLabel">Called</span>
					<input
						className="inlineInput"
						name="workspaceName"
						value={form.workspaceName}
						onChange={handleChange}
						placeholder="HiveMind"
						autoComplete="off"
					/>
				</div>
				<div className="formRow">
					<label className="formLabel">What's should we focus on together?</label>
					<textarea
						className="formInput"
						name="additionalGoals"
						value={form.additionalGoals}
						onChange={handleChange}
						placeholder="Tell me your goals so I can remember and help you get there"
					/>
				</div>
				<div className="formRow">
					<label className="formLabel">
						LinkedIn? <span className="optional">(optional)</span>
					</label>
					<input
						className="formInput"
						name="linkedin"
						value={form.linkedin}
						onChange={handleChange}
						placeholder="linkedin.com/in/yourname"
					/>
				</div>
			</div>
			<div className="btnsContainer">
				<button className="backBtn" onClick={onBack}>
					Back
				</button>
				<button
					className="continueBtn"
					onClick={() => onNext(form)}
					disabled={continueDisabled}
					style={{
						opacity: continueDisabled ? 0.4 : 1,
						cursor: continueDisabled ? 'not-allowed' : 'pointer',
					}}
				>
					Alright, What's The Mission?
				</button>
			</div>
		</div>
	);
};

export default StepKnowEachOther;
