import { memo, useState } from 'react';
import ReactModal from '../../../modalsV2';
import s from './modal1.module.scss';
import { Tooltip } from 'antd';
import moment from 'moment-timezone';
import { ReactComponent as ArrowLeft } from '../../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as Checkbox } from './assets/Check.svg';

const initialSteps = [
	{
		id: 1,
		label: 'Step',
		status: 'active',
	},
	{
		id: 2,
		label: 'Step',
		status: 'inactive',
	},
];

const tooltipStyles = {
	body: {
		width: '100%',
		padding: 0,
		overflow: 'hidden',
		border: '1px solid var(--stroke)',
		borderRadius: 8,
		paddingTop: 0,
	},
};

// Get all timezones with their offsets (copied from SchedulerRightDrawer)
const getTimezonesWithOffsets = () => {
	const validRegions = [
		'Africa',
		'America',
		'Antarctica',
		'Asia',
		'Atlantic',
		'Australia',
		'Europe',
		'Indian',
		'Pacific',
	];
	return moment.tz
		.names()
		.filter((name) => validRegions.some((region) => name.startsWith(region)))
		.map((name) => {
			const offset = moment.tz(name).format('Z');
			const formattedName = `${name} (UTC${offset})`;
			return {
				value: name,
				label: formattedName,
			};
		})
		.sort((a, b) => {
			const offsetA = moment.tz(a.value).utcOffset();
			const offsetB = moment.tz(b.value).utcOffset();
			return offsetB - offsetA;
		});
};

const Step1Content = ({ onContinue }) => {
	return (
		<div className={s.stepContent}>
			<div className={s.step1HeaderWrapper}>
				<h3 className={s.step1Header}>ankit@ve.ai</h3>
				<div className={s.radioButtonGroup}>
					<div className={s.radioButtonItem}>
						<input
							className={s.radioButtonInput}
							type="radio"
							name="radio"
							id="radio"
						/>
						<label className={s.radioButtonLabel} htmlFor="radio">
							<span className={s.radioButtonLabelTitle}>All emails in inbox</span>
							<span className={s.radioButtonLabelDescription}>
								Any email received will trigger the agent.
							</span>
						</label>
					</div>
					<div className={s.radioButtonItem}>
						<input
							className={s.radioButtonInput}
							type="radio"
							name="radio"
							id="radio"
						/>
						<label className={s.radioButtonLabel} htmlFor="radio">
							<span className={s.radioButtonLabelTitle}>Outreach replies only</span>
							<span className={s.radioButtonLabelDescription}>
								Only replies to emails sent from the agent will trigger the agent.
							</span>
						</label>
					</div>
				</div>
				<div className={s.step1Separator}></div>
				<div className={s.additionalFilters}>
					<label className={s.additionalFilterLabel}>Additional filters</label>
					<span className={s.additionalFilterDescription}>Filter emails by search</span>
				</div>
				<div className={s.filterInfo}>
					<span className={s.filterInfoTitle}>
						Filter emails that will trigger the agent like you can in the search bar in
						Gmail. See here for options.
					</span>
				</div>
				<div className={s.filterInput}>
					<input type="text" placeholder="Enter Text..." className={s.filterInputItem} />
				</div>
				<div className={s.step1Separator}></div>
				<div className={s.continueButton} onClick={onContinue}>
					Continue
				</div>
			</div>
		</div>
	);
};

const Step2Content = ({ onBack }) => {
	const [tzOpen, setTzOpen] = useState(false);
	const [selectedTz, setSelectedTz] = useState(moment.tz.guess());
	return (
		<div className={s.stepContent}>
			<div className={s.step2HeaderWrapper}>
				<h3 className={s.step2Header}>ankit@ve.ai</h3>
				<div className={s.workHours}>
					<span className={s.workHoursTitle}>Queue Work Hours</span>
					<div className={s.workHoursDescription}>
						Customize how and when your agent should process messages from this trigger.
						By configuring the following settings, you can ensure that triggers are
						processed in a manner that aligns with your work habits.
					</div>
					<div className={s.workHoursCheckbox}>
						<input
							type="checkbox"
							id="workHoursCheckbox"
							className={s.workHoursCheckboxInput}
						/>
						<Checkbox />
						<label className={s.workHoursCheckboxLabel} htmlFor="workHoursCheckbox">
							Enable
						</label>
					</div>
					<div className={s.timeZone}>
						<span className={s.timeZoneTitle}>Time Zone</span>
						<Tooltip
							open={tzOpen}
							onOpenChange={setTzOpen}
							placement="bottom"
							title={
								<div className="timeZoneDropdown createSession-sessionType-dropdown timezone-dropdown">
									{getTimezonesWithOffsets().map((option) => (
										<div
											key={option.value}
											className={s.timeZoneDropdownItem}
											onClick={() => {
												setSelectedTz(option.value);
												setTzOpen(false);
											}}
										>
											{option.label}
										</div>
									))}
								</div>
							}
							trigger={['click']}
							color={'transparent'}
							styles={tooltipStyles}
						>
							<div className={s.timeZoneSelect} onClick={() => setTzOpen(true)}>
								{moment.tz(selectedTz).format('z')} ({selectedTz})
							</div>
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	);
};

const Modal1 = ({ isOpen, onClose }) => {
	const [info, setInfo] = useState({
		activeTab: initialSteps,
	});

	const handleNextStep = () => {
		setInfo((prev) => {
			const updatedSteps = prev.activeTab.map((step, index) => ({
				...step,
				status: index === 1 ? 'active' : 'inactive',
			}));
			return {
				...prev,
				activeTab: updatedSteps,
			};
		});
	};

	const handlePreviousStep = () => {
		setInfo((prev) => {
			const updatedSteps = prev.activeTab.map((step, index) => ({
				...step,
				status: index === 0 ? 'active' : 'inactive',
			}));
			return {
				...prev,
				activeTab: updatedSteps,
			};
		});
	};

	const renderStepContent = () => {
		if (info.activeTab[0].status === 'active') {
			return <Step1Content onContinue={handleNextStep} />;
		}
		return <Step2Content onBack={handlePreviousStep} />;
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 1000,
				},
				overlay: {
					zIndex: 1001,
				},
			}}
		>
			<div className={s.modal1Wrapper}>
				<div className={s.modal1Header}>
					{info.activeTab[1].status === 'active' && (
						<div className={s.backButtonWrapper} onClick={handlePreviousStep}>
							<ArrowLeft />
							<div className={s.backButton}>Back</div>
						</div>
					)}
					<div className={s.modalSteps}>
						{info.activeTab.map((step) => (
							<div key={step.id} className={s.modalStepItem}>
								<div className={s.modalStepItemLabel}>
									<span
										className={`${s.modalStepItemLabelTitle} ${
											step.status === 'active' ? s.active : s.inactive
										}`}
									>
										{step.label}
									</span>
									<span
										className={`${s.modalStepItemLabelCount} ${
											step.status === 'active' ? s.active : s.inactive
										}`}
									>
										{step.id}
									</span>
								</div>
								<span
									className={`${s.modalStepStatus} ${
										step.status === 'active' ? s.active : s.inactive
									}`}
								></span>
							</div>
						))}
					</div>
				</div>
				<div className={s.modal1Content}>{renderStepContent()}</div>
			</div>
		</ReactModal>
	);
};

export default memo(Modal1);
