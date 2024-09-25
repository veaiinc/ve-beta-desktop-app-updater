import { useState, memo } from 'react';
import { themesList } from '../../../features/settings/indexConstant';
import ClientPortalView from './ClientPortalView';

const ClientPortalComponent = () => {
	const [selectedTheme, setselectedTheme] = useState('theme1');
	return (
		<>
			<div className="mainContainer">
				<div className="title">
					{' '}
					<h1>Client Portal</h1>{' '}
				</div>

				<div className="containerBody">
					<div className="ClientViewContainer">
						<ClientPortalView />
					</div>

					<div className="optionsContainer">
						<h3>Choose Theme</h3>

						<div className="themesList">
							{themesList?.map((singleTheme) => (
								<div
									className="singleTheme"
									onClick={() => setselectedTheme(singleTheme?.id)}
								>
									<img src={singleTheme?.imageUrl} alt="" />
								</div>
							))}

							{/* <div className="singleTheme"></div> */}
						</div>

						<div className="lineDiv"></div>

						<div className="propertiesContainer">
							{themesList
								.find((item) => item?.id === selectedTheme)
								?.properties?.map((singleProperty) => (
									<>
										<div className="singlePropertyDiv">
											<h6>{singleProperty?.label}</h6>

											<div className="property_name">
												<div
													className="color"
													style={{
														background: singleProperty?.value || '',
													}}
												></div>
												<input
													type="text"
													value={singleProperty?.value || ''}
												/>
											</div>
										</div>

										<div className="lineDiv"></div>
									</>
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
				<button className="buttonApplyTheme">Apply Theme </button>
			</div>
		</>
	);
};

export default memo(ClientPortalComponent);
