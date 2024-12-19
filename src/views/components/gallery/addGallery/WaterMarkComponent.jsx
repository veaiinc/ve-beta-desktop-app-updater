import React, { useState, useRef, useContext, memo } from 'react';
import { Switch } from 'antd';
import { ReactComponent as DownArrowSvg } from '../../../../assets/svg/sidebar/downarrowsmall.svg';
import Context from '../../../../context/context';

const watermarkPositions = [
	{ position: 'northwest', top: 10, left: 10, bottom: 'auto', right: 10 },
	{ position: 'north', top: 10, left: 'calc(50% - 45px)', bottom: 'auto', right: 'auto' },
	{ position: 'northeast', top: 10, left: 10, bottom: 'auto', right: 'auto' },
	{ position: 'west', top: 'calc(50% - 20px)', left: 'auto', bottom: 'auto', right: 10 },
	{
		position: 'center',
		top: 'calc(50% - 20px)',
		left: 'auto',
		bottom: 'auto',
		right: 'calc(50% - 45px)',
	},
	{ position: 'east', top: 'calc(50% - 20px)', left: 10, bottom: 'auto', right: 'auto' },
	{ position: 'southwest', top: 'auto', left: 'auto', bottom: 10, right: 10 },
	{ position: 'south', top: 'auto', left: 'auto', bottom: 10, right: 'calc(50% - 45px)' },
	{ position: 'southeast', top: 'auto', left: 10, bottom: 10, right: 'auto' },
];

const WaterMarkComponent = ({ info, setinfo, waterMarks }) => {
	// Context
	const {
		galleryInfo: { uploadWaterMark, getWaterMarks },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	// States
	const [showMoreOptions, setshowMoreOptions] = useState(false);
	const fileInputRef = useRef();

	// functions
	const posactive = async (e, t, r, b, l) => {
		setinfo((prev) => ({
			...prev,
			watermarkPosition: {
				name: e,
				tpos: t,
				rpos: r,
				bpos: b,
				lpos: l,
			},
		}));
	};

	const switchChangeHandler = (checked) => {
		if (info?.isWaterMarkApply === checked || info?.startedUploading) return;
		setinfo((prev) => ({ ...prev, isWaterMarkApply: checked }));
	};

	const uploadWaterMarkChangeHandler = async (e) => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
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

	return (
		<div className="watermark_div">
			<div className="option_div">
				<div className="text_div">
					<h1>Apply watermark</h1>
					<p>Use AI people on edited photos for delightful client experience.</p>
				</div>

				<Switch checked={info?.isWaterMarkApply || false} onChange={switchChangeHandler} />
			</div>

			{info?.isWaterMarkApply && (
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

						<div
							className="grid-overlay"
							style={{ zIndex: info?.isPopupOpen ? '0' : '1' }}
						>
							{watermarkPositions?.map(({ position, top, left, bottom, right }) => (
								<div
									key={position}
									className={`grid-item ${
										info?.watermarkPosition?.name === position ? 'selected' : ''
									}`}
									onClick={() => posactive(position, top, left, bottom, right)}
								></div>
							))}

							{info.watermarkProfileId && (
								<img
									src={
										waterMarks?.find(
											(wm) => wm?.profileId === info?.watermarkProfileId,
										)?.resizedWatermakrUrl || ''
									}
									alt="Logo"
									style={{
										left: info?.watermarkPosition?.lpos,
										right: info?.watermarkPosition?.rpos,
										top: info?.watermarkPosition?.tpos,
										bottom: info?.watermarkPosition?.bpos,
									}}
									className="watermarklogo"
								/>
							)}
						</div>
					</div>

					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							marginTop: '12px',
						}}
					>
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

						{waterMarks && waterMarks.length > 0 && (
							<div className="dropdown_div_container">
								<a
									className="select-logo"
									onClick={() => setshowMoreOptions(!showMoreOptions)}
								>
									<img
										src={
											waterMarks?.find(
												(wm) => wm?.profileId === info?.watermarkProfileId,
											)?.resizedWatermakrUrl || ''
										}
									/>
									<span>
										{showMoreOptions ? (
											<DownArrowSvg />
										) : (
											<DownArrowSvg style={{ transform: 'rotate(180deg)' }} />
										)}
									</span>
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
												</a>
											))}
										</div>
									) : (
										''
									)}
								</a>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default memo(WaterMarkComponent);
