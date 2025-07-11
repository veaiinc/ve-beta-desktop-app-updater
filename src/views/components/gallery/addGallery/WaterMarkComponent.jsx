import React, { useState, useRef, useContext, memo } from 'react';
import { Switch, Tooltip } from 'antd';
import { ReactComponent as DownArrowSvg } from '../../../../assets/svg/sidebar/downarrowsmall.svg';
import Context from '../../../../context/context';
import { ReactComponent as DeleteIcon } from '../../../../assets/svg/gallery/delete-red.svg';
import { message } from '../../globalComponents/CustomToast';
import { Slider } from 'antd/lib';

const watermarkPositions = [
	{
		position: 'northwest',
		top: 10,
		left: 10,
		bottom: 'auto',
		right: 'auto', // Fixed to 'auto' for consistency
		transformOrigin: 'top left',
	},
	{
		position: 'north',
		top: 10,
		left: 10,
		bottom: 'auto',
		right: 'auto',
		transformOrigin: 'top center',
	},
	{
		position: 'northeast',
		top: 10,
		left: 'auto',
		bottom: 'auto',
		right: 10, // Fixed to align with top-right corner
		transformOrigin: 'top right',
	},
	{
		position: 'west',
		top: 'calc(50% - 20px)',
		left: 10,
		bottom: 'auto',
		right: 'auto',
		transformOrigin: 'left center',
	},
	{
		position: 'center',
		top: '45%',
		left: 10,
		bottom: 'auto',
		right: 'auto',
		transformOrigin: 'center center',
	},
	{
		position: 'east',
		top: 'calc(50% - 20px)',
		left: 'auto',
		bottom: 'auto',
		right: -10,
		transformOrigin: 'right center',
	},
	{
		position: 'southwest',
		top: 'auto',
		left: 10,
		bottom: 10,
		right: 'auto',
		transformOrigin: 'bottom left',
	},
	{
		position: 'south',
		top: 'auto',
		left: 10,
		bottom: 10,
		right: 'auto',
		transformOrigin: 'bottom center', // Fixed from 'center '
	},
	{
		position: 'southeast',
		top: 'auto',
		left: 'auto',
		bottom: 10,
		right: 10,
		transformOrigin: 'bottom right',
	},
];

const WaterMarkComponent = ({
	waterMarkApply,
	startedUploading,
	isPopupOpen,
	watermarkPosition,
	watermarkProfileId,
	watermarkOpacity,
	scaleWatermark,
	setinfo,
	waterMarks,
	onSaveClick,
}) => {
	// Context
	const {
		galleryInfo: { uploadWaterMark, getWaterMarks, deleteWaterMark },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		profileInfo: { tenantUserAccessControls },
	} = useContext(Context);

	// States
	const [showMoreOptions, setshowMoreOptions] = useState(false);
	const fileInputRef = useRef();
	const region = localStorage.getItem('region');
	// functions
	const posactive = async (e, t, r, b, l, transformOrigin) => {
		setinfo((prev) => ({
			...prev,
			watermarkPosition: {
				name: e,
				tpos: t,
				rpos: r,
				bpos: b,
				lpos: l,
				transformOrigin: transformOrigin || 'center center',
			},
		}));
	};

	const switchChangeHandler = (checked) => {
		if (waterMarkApply === checked || startedUploading) return;
		setinfo((prev) => ({ ...prev, isWaterMarkApply: checked }));
	};

	const uploadWaterMarkChangeHandler = async (e) => {
		if (
			validateExpiryData &&
			validateExpiryData?.restrictGalleries &&
			validateExpiryData?.isExpired
		) {
			return updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Classic-Gallery',
			});
		}
		const response = await uploadWaterMark(e.target.files[0]);
		if (response) {
			setTimeout(() => {
				getWaterMarks();
			}, 6000);
		}
	};

	const changeWaterMarkFunction = (id) => {
		setinfo((prev) => ({ ...prev, watermarkProfileId: id }));
	};

	const deleteWaterMarkFunction = async (e, watermarkId) => {
		e.stopPropagation();
		let json = {
			watermarkProfileId: watermarkId,
		};
		const response = await deleteWaterMark(json);
		if (response[0] === true) {
			message.success('Watermark deleted successfully');
		} else {
			message.error(response[1]?.message || 'Something went wrong');
		}
	};

	return (
		<div className="watermark_div">
			<div className="option_div">
				<div className="text_div">
					<h1>Apply watermark</h1>
					<p>Use AI people on edited photos for delightful client experience.</p>
				</div>

				<Switch checked={waterMarkApply || false} onChange={switchChangeHandler} />
			</div>

			{waterMarkApply && (
				<>
					<div className="watermark_container">
						<img
							src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fHdlZGRpbmd8ZW58MHx8MHx8fDA%3D"
							alt="bgwatermark"
							style={{
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>

						<div className="grid-overlay" style={{ zIndex: isPopupOpen ? '0' : '1' }}>
							{watermarkPositions?.map(
								({ position, top, left, bottom, right, transformOrigin }) => (
									<div
										key={position}
										className={`grid-item ${
											watermarkPosition?.name === position ? 'selected' : ''
										}`}
										onClick={() =>
											posactive(
												position,
												top,
												left,
												bottom,
												right,
												transformOrigin,
											)
										}
									></div>
								),
							)}

							{watermarkProfileId && (
								<img
									src={
										waterMarks?.find(
											(wm) => wm?.profileId === watermarkProfileId,
										)?.resizedWatermakrUrl || ''
									}
									alt="Logo"
									style={{
										left: watermarkPosition?.lpos,
										right: watermarkPosition?.rpos,
										top: watermarkPosition?.tpos,
										bottom: watermarkPosition?.bpos,
										opacity: watermarkOpacity, // 0 to 1
										transform: `scale(${scaleWatermark})`,
										transition: 'all 0.2s ease-in-out',
										transformOrigin: watermarkPosition?.transformOrigin,
									}}
									className="watermarklogo"
								/>
							)}
						</div>
					</div>
					{tenantUserAccessControls?.role === 'admin' && region === 'us-east-1' && (
						<div className="sliderContainers">
							<div className="eachSliderContainer">
								<span>Opacity</span>
								<Slider
									min={0}
									max={100}
									defaultValue={watermarkOpacity * 100}
									style={{ width: '70%' }}
									tooltip={{ open: false }}
									trackStyle={{ backgroundColor: 'var(--primary-button)' }}
									railStyle={{ backgroundColor: 'var(--stroke)' }}
									onChange={(value) =>
										setinfo((prev) => ({
											...prev,
											watermarkOpacity: value / 100,
										}))
									}
								/>
							</div>
							<div className="eachSliderContainer">
								<span>Scale</span>
								<Slider
									min={0}
									max={100}
									defaultValue={scaleWatermark * 100}
									style={{ width: '70%' }}
									tooltip={{ open: false }}
									trackStyle={{ backgroundColor: 'var(--primary-button)' }}
									railStyle={{ backgroundColor: 'var(--stroke)' }}
									onChange={(value) =>
										setinfo((prev) => ({
											...prev,
											scaleWatermark: value / 100,
										}))
									}
								/>
							</div>
						</div>
					)}
					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'flex-end',
							marginTop: '12px',
						}}
					>
						{waterMarks?.length > 0 ? (
							<Tooltip
								open={showMoreOptions}
								placement="bottomLeft"
								onOpenChange={setshowMoreOptions}
								color="transparent"
								arrow={false}
								trigger={'click'}
								title={
									<>
										{showMoreOptions ? (
											<div className="logos-dropdown">
												{waterMarks?.map((watermark, key) => (
													<a
														onClick={() =>
															changeWaterMarkFunction(
																watermark?.profileId,
															)
														}
														key={key}
													>
														<img src={watermark.resizedWatermakrUrl} />

														<div
															className="delete-icon-div"
															onClick={(e) =>
																deleteWaterMarkFunction(
																	e,
																	watermark?.profileId,
																)
															}
														>
															<DeleteIcon />
														</div>
													</a>
												))}
												<button
													className="upload-watermark-button"
													onClick={() => fileInputRef.current.click()}
												>
													Upload Watermark
												</button>
												<input
													ref={fileInputRef}
													type="file"
													hidden
													onChange={uploadWaterMarkChangeHandler}
												/>
											</div>
										) : (
											''
										)}
									</>
								}
							>
								<div className="dropdown_div_container">
									<a
										className="select-logo"
										onClick={() => setshowMoreOptions(!showMoreOptions)}
									>
										<img
											src={
												waterMarks?.find(
													(wm) => wm?.profileId === watermarkProfileId,
												)?.resizedWatermakrUrl || ''
											}
										/>
										<span>
											{showMoreOptions ? (
												<DownArrowSvg
													style={{ transform: 'rotate(180deg)' }}
												/>
											) : (
												<DownArrowSvg />
											)}
										</span>
									</a>
								</div>
							</Tooltip>
						) : (
							<>
								<button
									className="upload-watermark-button"
									onClick={() => fileInputRef.current.click()}
								>
									Upload Watermark
								</button>
								<input
									ref={fileInputRef}
									type="file"
									hidden
									onChange={uploadWaterMarkChangeHandler}
								/>
							</>
						)}
					</div>
					{tenantUserAccessControls?.role === 'admin' && region === 'us-east-1' && (
						<div className="saveButtonContainer">
							<button onClick={onSaveClick} className="watermarkSaveButton">
								Save
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default memo(WaterMarkComponent);
