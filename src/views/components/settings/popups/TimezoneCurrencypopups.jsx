import React from 'react';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/seach-magnifier.svg';
import ReactModal from '../../modalsV2';
import { TimeZoneList, CurrencyList } from '../../../features/settings/indexConstant';

export const TimeZoneCurrencyPopup = ({
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
