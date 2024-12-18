import React, { memo } from 'react';
// import { ReactComponent as UpArrow } from '../../../../assets/svg/workflow/downArrow.svg';
// import ToggleSlider from '../../../../views/components/input/slider';
import { ReactComponent as GridStyleVertical } from '../../../../assets/svg/gallery/gridStyleVertical.svg';
import { ReactComponent as ThumbnailV } from '../../../../assets/svg/gallery/thumbnailV.svg';
import { ReactComponent as GridStyleHorizontal } from '../../../../assets/svg/gallery/gridStyleH.svg';
import { ReactComponent as ThumbnailH } from '../../../../assets/svg/gallery/thumbnailH.svg';

const DesignOverviewComp = ({ info, handleLayoutType }) => {
	return (
		<div id="design" className="settings-overview">
			<div className="designaContainer">
				<p className="heading">Design</p>
				{/* <div className="previewLayout">
					<p className="subTitle">Preview layout</p>
					<UpArrow />
				</div> */}
			</div>
			{/* <div className="coverDesign">
				<p className="subHeading">Select gallery cover design</p>
				<div className="selectDesign">
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
					<div className="cover-images"></div>
				</div>
			</div>
			<div className="aiBackground">
				<p className="subHeading">AI Background</p>
				<div className="aiTogglebar">
					<ToggleSlider />
					<p className="subTitle">Automatically choose cover color based on photo</p>
				</div>
			</div>
			<div className="titleText">
				<p className="subHeading">Title text</p>
				<div className="textContainer">
					<input type="text" placeholder="FreightText Pro + Futura PT " />
					<UpArrow />
				</div>
			</div> */}
			<div className="grid-style">
				<p className="subHeading">Grid Style</p>
				<div className="grid-types">
					<div
						className={`box ${info?.gridStyle?.vertical ? 'activeBorder' : ''}`}
						onClick={() => handleLayoutType('gridStyle', 'vertical')}
					>
						<GridStyleVertical className={info?.gridStyle?.vertical ? 'active' : ''} />
						<p className={`subTitle ${info?.gridStyle?.vertical ? 'active' : ''}`}>
							Vertical
						</p>
					</div>
					<div
						className={`box ${info?.gridStyle?.horizontal ? 'activeBorder' : ''}`}
						onClick={() => handleLayoutType('gridStyle', 'horizontal')}
					>
						<GridStyleHorizontal
							className={info?.gridStyle?.horizontal ? 'active' : ''}
						/>
						<p className={`subTitle ${info?.gridStyle?.horizontal ? 'active' : ''}`}>
							Horizontal
						</p>
					</div>
				</div>
			</div>
			<div className="thumbnail-size">
				<p className="subHeading">Thumbnail Size</p>
				<div className="thumbnail-types">
					<div
						className={`box ${info?.thumbnailSize?.regular ? 'activeBorder' : ''}`}
						onClick={() => handleLayoutType('thumbnailSize', 'regular')}
					>
						<ThumbnailV className={info?.thumbnailSize?.regular ? 'active' : ''} />
						<p className={`subTitle ${info?.thumbnailSize?.regular ? 'active' : ''}`}>
							Regular
						</p>
					</div>
					<div
						className={`box ${info?.thumbnailSize?.large ? 'activeBorder' : ''}`}
						onClick={() => handleLayoutType('thumbnailSize', 'large')}
					>
						<ThumbnailH className={info?.thumbnailSize?.large ? 'active' : ''} />
						<p className={`subTitle ${info?.thumbnailSize?.large ? 'active' : ''}`}>
							Large
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(DesignOverviewComp);
