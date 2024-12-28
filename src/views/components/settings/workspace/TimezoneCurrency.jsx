import { useState, memo } from 'react';
import ReusableButtonSettings from '../ReusableButtonSettings';
import { ReactComponent as GlobeSettings } from '../../../../assets/svg/workspaceSettings/globeSettings.svg';
import TimezoneCurrencypopups from './TimezoneCurrencypopups';
import getSymbolFromCurrency from 'currency-symbol-map';
const TimeZoneCurrencyComponent = ({ overviewState }) => {
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
						downArrow={false}
						disableHover={true}
						// func={() => {
						// 	setpopupType('timezone');
						// 	setopenPopup(true);
						// }}
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
						text={
							getSymbolFromCurrency(overviewState?.currency) +
							' ' +
							overviewState?.currency
						}
						// icon={getSymbolFromCurrency(overviewState?.currency)}
						downArrow={false}
						disableHover={true}
						// func={() => {
						// 	setpopupType('currency');
						// 	setopenPopup(true);
						// }}
					/>
				</div>
			</div>

			<TimezoneCurrencypopups
				openPopup={openPopup}
				setopenPopup={setopenPopup}
				popupType={popupType}
				setpopupType={setpopupType}
			/>
		</>
	);
};

export default memo(TimeZoneCurrencyComponent);
