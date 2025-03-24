import { useState, memo } from 'react';
import ReusableButtonSettings from '../ReusableButtonSettings';
import { ReactComponent as GlobeSettings } from '../../../../assets/svg/workspaceSettings/globeSettings.svg';
import getSymbolFromCurrency from 'currency-symbol-map';
import { ReactComponent as ChevronDown } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import currencyList from '../../../../helpers/Country-By-Currency-Code.json';
const TimeZoneCurrencyComponent = ({ overviewState }) => {
	const [selectedCurrency, setSelectedCurrency] = useState(currencyList);

	const handleCurrencyChange = (e) => {
		setSelectedCurrency(e.target.value);
	};

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
				<div className="currency-select-wrapper">
					{/* <select
						value={selectedCurrency}
						onChange={handleCurrencyChange}
						className="currency-select"
					>
						{currencyList.map((currency) => (
							<option key={currency.value} value={currency.value}>
								{`${getSymbolFromCurrency(currency.currency_code)} - ${
									currency.country
								}`}
							</option>
						))}
					</select> */}
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
		</>
	);
};

export default memo(TimeZoneCurrencyComponent);
