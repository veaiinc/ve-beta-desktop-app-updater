import { useState, memo, useEffect } from 'react';
import { themesList } from '../../../features/settings/indexConstant';
import ClientPortalView from './ClientPortalView';
import ColorPicker from '../../colorPicker/ColorPicker';

const ClientPortalComponent = ({ brandState, setbrandState, updateSubmitThemeHandler }) => {
	const [selectedTheme, setselectedTheme] = useState('theme1');
	const [themeProperties, setthemeProperties] = useState({
		...(themesList?.[0]?.properties || {}),
	});
	const [colorPopup, setcolorPopup] = useState({ isOpen: false, colorValue: '', property: '' });

	useEffect(() => {
		if (brandState?.clientPortalPreferences?.activeId) {
			setselectedTheme(brandState?.clientPortalPreferences?.activeId || '');
			setthemeProperties({ ...(brandState?.clientPortalPreferences?.properties || {}) });
		}
	}, [
		brandState?.clientPortalPreferences?.activeId,
		brandState?.clientPortalPreferences?.properties,
	]);

	const openColorPickerFunction = (key, value) => {
		setcolorPopup({ isOpen: true, colorValue: value, property: key });
	};

	const getSelectedColorFunc = (selectedvalue) => {
		if (!brandState?.isThemeChange) {
			setbrandState((prev) => ({ ...prev, isThemeChange: true }));
		}
		const { property } = colorPopup;
		const updateProperties = { ...(JSON.parse(JSON.stringify(themeProperties)) || {}) };
		updateProperties[property].value = selectedvalue;
		setthemeProperties(updateProperties);
		setcolorPopup((prev) => ({ ...prev, colorValue: '', property: '' }));
	};

	const colorInputChangeFunc = (e) => {
		const { name, value } = e.target;
		const updateProperties = { ...(JSON.parse(JSON.stringify(themeProperties)) || {}) };
		updateProperties[name].value = value?.toUpperCase() || '';
		setthemeProperties(updateProperties);
	};

	const themOnButtonClikck = async (themeIndex) => {
		setthemeProperties((prev) => ({
			...prev,
			...themesList?.[themeIndex]?.properties,
		}));
		setselectedTheme(themesList?.[themeIndex]?.id);
		if (!brandState?.isThemeChange) {
			setbrandState((prev) => ({
				...prev,
				isThemeChange: true,
			}));
		}
	};

	return (
		<>
			<div className="mainContainer">
				<div className="title">
					{' '}
					<h1>Client Portal</h1>{' '}
				</div>

				<div className="containerBody">
					<div
						className="ClientViewContainer"
						style={{ background: themeProperties?.backgroundColor?.value }}
					>
						<ClientPortalView
							themeProperties={themeProperties}
							logoUrl={brandState?.brandLogo || ''}
						/>
					</div>

					<div className="optionsContainer">
						<h3>Choose Theme</h3>

						<div className="themesList">
							{themesList?.map((prefinedThems, index) => (
								<div
									key={index}
									className="singleTheme"
									onClick={() => {
										themOnButtonClikck(index);
									}}
									style={{
										border:
											prefinedThems?.id !== selectedTheme
												? ''
												: '2px solid #6055ec',
									}}
								>
									<img src={prefinedThems?.imageUrl} alt="" />
								</div>
							))}

							{/* <div className="singleTheme"></div> */}
						</div>

						<div className="lineDiv"></div>

						<div className="propertiesContainer">
							{Object.entries(themeProperties).map(([key, singleProperty]) => (
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										alignSelf: 'stretch',
										flexDirection: 'column',
									}}
									key={key}
								>
									<div className="singlePropertyDiv" key={key}>
										<h6>{singleProperty?.label}</h6>

										<div className="property_name">
											<div
												className="color"
												style={{
													background: singleProperty?.value || '',
												}}
												onClick={() =>
													openColorPickerFunction(
														key,
														singleProperty?.value,
													)
												}
											></div>
											<input
												type="text"
												value={singleProperty?.value || ''}
												name={key}
												onChange={colorInputChangeFunc}
											/>
										</div>
									</div>

									<div className="lineDiv"></div>
								</div>
							))}

							<div className="singlePropertyDiv">
								<h6>Client Name Font</h6>

								<div className="property_name"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="buttonDiv">
				<button
					className="buttonApplyTheme"
					onClick={() => {
						if (!brandState?.isThemeChange) return;
						updateSubmitThemeHandler(selectedTheme, themeProperties);
					}}
				>
					Apply Theme{' '}
				</button>
			</div>

			{colorPopup?.isOpen && (
				<ColorPicker
					closeModal={() => setcolorPopup((prev) => ({ ...prev, isOpen: false }))}
					isOpen={colorPopup?.isOpen}
					colorValue={colorPopup?.colorValue}
					getSelectedColorFunc={getSelectedColorFunc}
				/>
			)}
		</>
	);
};

export default memo(ClientPortalComponent);
