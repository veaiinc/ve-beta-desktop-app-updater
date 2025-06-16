import { memo } from 'react';
import s from './toolInfo.module.scss';
import { ReactComponent as ArrowRightSvg } from '../../../../../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SettingsSvg } from '../assets/settings.svg';
import EmailDropdown from './EmailDropdown';

const ToolInfo = ({ onBackButtonClick }) => {
	return (
		<div className={s.addToolContainer}>
			<button className={s.backButton} onClick={onBackButtonClick}>
				<ArrowRightSvg className={s.backButtonIcon} />
				<div className={s.backButtonText}>Back</div>
			</button>
			<div className={s.toolInfoContainer}>
				<div className={s.toolTitleContainer}>
					<div className={s.leftContainer}>
						<div className={s.toolIconContainer}></div>
						<div className={s.toolTitle}>Google Search, Scrape and Summarise</div>
					</div>
					<div className={s.rightContainer}>
						<button className={s.configureButton}>
							<SettingsSvg />
							Configure
						</button>
					</div>
				</div>
				<hr className={s.divider} />
				<div className={s.inputsText}>Inputs</div>

				<div className={s.toolInputsContainer}>
					<div className={s.toolInputContainer}>
						<div className={s.toolInfo}>
							<div className={s.leftContainer}>
								<div className={s.title}>Google Account</div>
								<div className={s.description}>
									Select the Google account to use for accessing email details.
									Add new connections in the integrations tab or your Relevance
									project.
								</div>
							</div>
							<div className={s.rightContainer}>
								<div className={s.dropdownContainer}></div>
							</div>
						</div>
						<div className={s.dropdownContainer}>
							<input
								type="text"
								placeholder="Select connected account"
								className={s.inputField}
							/>
							<EmailDropdown>
								<ChevronRightThinSvg className={s.dropdownIcon} />
							</EmailDropdown>
						</div>
					</div>
				</div>
			</div>
			<button className={s.addToolButton}>Add Tool</button>
		</div>
	);
};

export default memo(ToolInfo);
