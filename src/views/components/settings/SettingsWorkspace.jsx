import React, { useState } from 'react';
import ReusableButtonSettings from '../../features/workspace_settings/ReusableButtonSettings';
import { ReactComponent as GlobeSettings } from '../../../assets/svg/workspaceSettings/globeSettings.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/close.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/seach-magnifier.svg';
import ReactModal from '../modalsV2';
import { TimeZoneList, CurrencyList } from '../../features/settings/indexConstant';

export const WorkspaceHandleComponent = () => {
	const [domainUpdate, setdomainUpdate] = useState(true);

	const isActiveComponentFunc = () => {
		return (
			<div className="activeDomainDiv">
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="11"
						height="10"
						viewBox="0 0 11 10"
						fill="none"
					>
						<circle cx="5.5" cy="5" r="5" fill="#09A935" fill-opacity="0.36" />
						<circle cx="5.5" cy="5" r="2.5" fill="#09A935" />
					</svg>
				</span>
				<p>Active</p>
			</div>
		);
	};

	return (
		<div>
			<div>
				<h1>Your workspace handle</h1>
			</div>

			<div className="domainContainer">
				<h2>Domain Name</h2>

				<div className="domainInput">
					<div className="inputDiv">
						<input placeholder="minimun 4 letters" value={'shahid'} />
						<p className="domainName">ve.ai</p>
					</div>
					{domainUpdate ? isActiveComponentFunc() : null}
				</div>
			</div>
		</div>
	);
};

const TimeZoneCurrencyPopup = ({
	openPopup,
	setopenPopup,
	popupType = 'timezone',
	setpopupType,
}) => {
	const closePopupFunc = () => {
		setopenPopup(false);
		setpopupType(null);
	};
	return (
		<ReactModal isOpen={openPopup} closeModal={closePopupFunc}>
			<div className="timezonePopupDiv">
				<div className="header">
					<h1>{popupType === 'timezone' ? 'Time Zone' : 'Currency'}</h1>

					<span onClick={closePopupFunc}>
						<CloseSvg />
					</span>
				</div>

				<div className="inputSearchDiv">
					<span>
						<SearchSvg />
					</span>
					<input
						type="text"
						placeholder={popupType === 'time' ? 'Pick a Timezone' : 'Pick a Currency'}
					/>
				</div>

				<div className="searchListDiv">
					<ul style={{ listStyle: 'none' }}>
						{popupType === 'timezone' &&
							TimeZoneList.map((timeZone, index) => (
								<li key={timeZone?.label}>
									<div>
										<input
											type="radio"
											id={timeZone.label}
											className="radioItem"
											name="timezone"
										/>
										<label for={timeZone.label}>{timeZone.label}</label>
									</div>
									<p>{timeZone.value}</p>
								</li>
							))}
						{popupType === 'currency' &&
							CurrencyList.map((currencyItem, index) => (
								<li key={currencyItem?.label}>
									<div>
										<input
											type="radio"
											id={currencyItem.label}
											className="radioItem"
											name="currency"
										/>
										<label for={currencyItem.label}>{currencyItem.label}</label>
									</div>
									<p>{currencyItem.value}</p>
								</li>
							))}
					</ul>
				</div>
			</div>
		</ReactModal>
	);
};

export const TimeZoneCurrencyComponent = ({ overviewState }) => {
	const [openPopup, setopenPopup] = useState(false);
	const [popupType, setpopupType] = useState(null);
	return (
		<>
			<div className="timeZone">
				<div className="timeZoneHeadding">
					<h1>Time Zone </h1>
					<p>
						Your email send times, account data, and analytics information will be
						displayed in the timezone you select below.
					</p>
				</div>
				{/* Options container for the time zone */}
				<div>
					<ReusableButtonSettings
						text={overviewState?.timeZone}
						icon={<GlobeSettings />}
						downArrow={true}
						disableHover={true}
						func={() => {
							setpopupType('timezone');
							setopenPopup(true);
						}}
					/>
				</div>
			</div>

			<div className="currency">
				<div className="currencyheadding">
					<h1>Currency</h1>
					<p>
						Note that once selected, the currency symbol will change, but the values
						won't be converted. For example, switching from ₹ to $ will change the
						symbol but not the actual value displayed.
					</p>
				</div>
				<div>
					<ReusableButtonSettings
						text={overviewState?.currency}
						icon={'₹'}
						downArrow={true}
						disableHover={true}
						func={() => {
							setpopupType('currency');
							setopenPopup(true);
						}}
					/>
				</div>
			</div>

			<TimeZoneCurrencyPopup
				openPopup={openPopup}
				setopenPopup={setopenPopup}
				popupType={popupType}
				setpopupType={setpopupType}
			/>
		</>
	);
};

export const DeleteWorkpsaceComponent = () => {
	return (
		<>
			<h1>Do you want to delete your workspace?</h1>
			<p>
				You will be billed for the month, but you'll receive a refund for the remaining, if
				you paid for some duration.
			</p>
		</>
	);
};
