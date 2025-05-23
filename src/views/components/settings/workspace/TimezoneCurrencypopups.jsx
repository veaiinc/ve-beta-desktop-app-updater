import React, { useState, memo, useEffect } from 'react';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/seach-magnifier.svg';
import ReactModal from '../../modalsV2';
import { timeZoneList, currencyList } from '../../../features/settings/indexConstant';
import getSymbolFromCurrency from 'currency-symbol-map';

const TimeZoneCurrencyPopup = ({
	openPopup,
	setopenPopup,
	popupType = 'timezone',
	setpopupType,
	selectedCurrency,
	setSelectedCurrency,
	countryCurrencyCodes,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredList, setFilteredList] = useState([]);

	useEffect(() => {
		// Reset search term when popup opens
		if (openPopup) {
			setSearchTerm('');
		}

		// Filter the appropriate list based on search term
		if (popupType === 'timezone') {
			setFilteredList(
				timeZoneList.filter(
					(item) =>
						item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
						item.value.toLowerCase().includes(searchTerm.toLowerCase()),
				),
			);
		} else if (popupType === 'currency') {
			setFilteredList(
				currencyList.filter(
					(item) =>
						item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
						item.value.toLowerCase().includes(searchTerm.toLowerCase()),
				),
			);
		}
	}, [searchTerm, popupType, openPopup]);

	const closePopupFunc = () => {
		setopenPopup(false);
		setpopupType(null);
		setSearchTerm('');
	};

	const handleSelectCurrency = (currencyCode) => {
		setSelectedCurrency(currencyCode);
		closePopupFunc();
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
						placeholder={
							popupType === 'timezone'
								? 'Search for timezone...'
								: 'Search for currency...'
						}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				<div className="searchListDiv">
					<ul style={{ listStyle: 'none', maxHeight: '300px', overflowY: 'auto' }}>
						{popupType === 'timezone' &&
							(filteredList.length > 0 ? filteredList : timeZoneList).map(
								(timeZone, index) => (
									<li key={timeZone?.label} className="timezone-currency-item">
										<div>
											<input
												type="radio"
												id={timeZone?.label}
												className="radioItem"
												name="timezone"
												checked={timeZone?.value === selectedCurrency}
												onChange={() => {}}
											/>
											<label htmlFor={timeZone?.label}>
												{timeZone?.label}
											</label>
										</div>
										<p>{timeZone?.value}</p>
									</li>
								),
							)}
						{popupType === 'currency' &&
							(filteredList.length > 0 ? filteredList : currencyList).map(
								(currencyItem, index) => (
									<li
										key={currencyItem?.value}
										className="timezone-currency-item"
										onClick={() => handleSelectCurrency(currencyItem?.value)}
									>
										<div>
											<input
												type="radio"
												id={currencyItem?.value}
												className="radioItem"
												name="currency"
												checked={currencyItem?.value === selectedCurrency}
												readOnly
											/>
											<label htmlFor={currencyItem?.value}>
												{currencyItem?.label} ({currencyItem?.value})
											</label>
										</div>
										<p>
											{getSymbolFromCurrency(currencyItem?.value) ||
												currencyItem?.symbol}
										</p>
									</li>
								),
							)}
					</ul>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(TimeZoneCurrencyPopup);
