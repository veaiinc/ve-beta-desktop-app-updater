import ReactModal from '../index';
import React from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import VerticalAlignSvg from '../../../../assets/svg/gallery/verticalAlignSvg.jsx';
import HorizontalAlignSvg from '../../../../assets/svg/gallery/gridStyleHorizontalSvg.jsx';
import ThumbnailVerticalSvg from '../../../../assets/svg/gallery/thumbnailVerticalSvg.jsx';
import ThumbnailHorizontalSvg from '../../../../assets/svg/gallery/thumbNailHorizontalSvg.jsx';
import GridSpacingVerticalSvg from '../../../../assets/svg/gallery/gridSpacingVerticalSvg.jsx';
import GridSpacingHorizontalSvg from '../../../../assets/svg/gallery/gridSpacingHorizontalSvg.jsx';

const GalleryStyles = (props) => {
	const { open, onClose, themeMode, handleLayoutType, gridStyle, thumbnailSize, gridSpacing } =
		props;
	return (
		<ReactModal isOpen={open} onClose={onClose} modalType="center">
			<div className="galleryStylesContainer">
				<div className="galleryStylesCloseButton">
					<div className="galleryStylesHeading">Gallery Styles</div>
					<CrossSvg onClick={onClose} style={{ cursor: 'pointer' }} />
				</div>
				<div className="galleryStylesTheme">
					<div className="galleryStylesThemeHeading">Theme</div>
					<div className="galleryStylesThemeOptions">
						<div
							className={`galleryStylesThemeOption ${
								themeMode === 'light' ? 'activeGrids' : ''
							}`}
							onClick={() => handleLayoutType('themeMode', 'light')}
						>
							<p>Light</p>
						</div>
						<div
							className={`galleryStylesThemeOption ${
								themeMode === 'dark' ? 'activeGrids' : ''
							}`}
							onClick={() => handleLayoutType('themeMode', 'dark')}
						>
							<p>Dark</p>
						</div>
					</div>
				</div>
				<div className="galleryStylesGridStyles">
					<div className="galleryStylesGridStylesHeading">Grid Styles</div>
					<div className="galleryStylesGridStylesOptions">
						<div
							className={`galleryStylesGridStylesOption ${
								gridStyle?.vertical ? 'activeGrids' : ''
							}`}
							onClick={() => handleLayoutType('gridStyle', 'vertical')}
						>
							<VerticalAlignSvg />
							<p>Vertical </p>
						</div>
						<div
							className={`galleryStylesGridStylesOption ${
								gridStyle?.horizontal ? 'activeGrids' : ''
							}`}
							onClick={() => handleLayoutType('gridStyle', 'horizontal')}
						>
							<HorizontalAlignSvg />
							<p>Horizontal</p>
						</div>
					</div>
				</div>
				<div className="galleryThumbnailSize">
					<div className="galleryThumbnailSizeHeading">Thumbnail Size</div>
					<div className="galleryThumbnailSizeOptions">
						<div
							className={`
							galleryThumbnailSizeOption ${thumbnailSize?.regular ? 'activeGrids' : ''}
						`}
							onClick={() => handleLayoutType('thumbnailSize', 'regular')}
						>
							<ThumbnailVerticalSvg />
							<p>Regular</p>
						</div>
						<div
							className={`galleryThumbnailSizeOption ${
								thumbnailSize?.large ? 'activeGrids' : ''
							}`}
							onClick={() => handleLayoutType('thumbnailSize', 'large')}
						>
							<ThumbnailHorizontalSvg />
							<p>Large</p>
						</div>
					</div>
				</div>
				<div className="galleryGridSpacing">
					<div className="galleryGridSpacingHeading">Grid Spacing</div>
					<div className="galleryGridSpacingOptions">
						<div
							className={`galleryGridSpacingOption ${
								gridSpacing?.regular ? 'activeGrids' : ''
							}`}
							onClick={() => handleLayoutType('gridSpacing', 'regular')}
						>
							<GridSpacingVerticalSvg />
							<p>Regular</p>
						</div>
						<div
							className={`galleryGridSpacingOption ${
								gridSpacing?.large ? 'activeGrids' : ''
							}`}
							onClick={() => handleLayoutType('gridSpacing', 'large')}
						>
							<GridSpacingHorizontalSvg />
							<p>Large</p>
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default GalleryStyles;
