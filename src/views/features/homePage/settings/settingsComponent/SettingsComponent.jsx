import { memo } from 'react';
import s from './settingsComponent.module.scss';
import { Switch } from 'antd';
import { settingsArray } from './constants';
import { ReactComponent as SettingsIcon } from '../../../../../assets/svg/calendar/settings.svg';
import { ReactComponent as HamburgerIcon } from '../../../../../assets/svg/smartFiles/formResponse/hamburger.svg';

const SettingsComponent = ({ handleClose, handleComponentChange }) => {
	return (
		<main className={s.settingsPopup}>
			<div className={s.heading}>
				<h1>Personalize your card categories</h1>
				<p className={s.description}>
					Rename, toggle visibility, and add custom instructions to guide your Ambient AI
					precisely.
				</p>
			</div>
			<div className={s.divider}></div>
			<div className={s.settingsContainer}>
				{settingsArray.map((setting, index) => (
					<div className={s.setting} key={index}>
						<div className={s.settingTop}>
							<div className={s.settingTopLeft}>
								<h2>{setting.title}</h2>
								<div className={s.additionalOptionsContainer}>
									<button onClick={() => handleComponentChange('editCategory')}>
										<SettingsIcon />
									</button>
									<button>
										<HamburgerIcon />
									</button>
								</div>
							</div>
							<div className={s.settingTopRight}>
								<Switch
									checked={setting.on}
									style={{
										background: setting.on ? 'var(--primary-button)' : '',
									}}
									onChange={(e) => console.log(e)}
								/>
							</div>
						</div>
						<div className={s.settingBottom}>
							<div className={s.settingDescription}>{setting.description}</div>
						</div>
					</div>
				))}
			</div>
			<div className={s.buttonsContainer}>
				<button className={s.closeButton} onClick={handleClose}>
					Close
				</button>
				<button className={s.addNewCategoryButton}>Add New Category</button>
			</div>
		</main>
	);
};

export default memo(SettingsComponent);
