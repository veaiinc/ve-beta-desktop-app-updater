import React, { memo } from 'react';
import './divider.scss';
``;
const GRID_UNIT = 8;

const Divider = ({
	align = 'center',
	borderColor = '#000',
	borderStyle = 'solid',
	borderWidth = 1,
	isHorizontal = true,
	height = '100%',
	width = '100%',
	gridSize = 5,
}) => {
	const gridSizePx = gridSize * GRID_UNIT;

	if (isHorizontal) {
		return (
			<div
				className="divider-container"
				style={{
					width: '100%',
					height: height === '100%' ? `${gridSizePx}px` : height,
				}}
			>
				<div
					className="divider-container-wrapper"
					style={{
						display: 'flex',
						justifyContent: borderStyle !== 'arrow' && align,
						alignItems: 'center',
						flexDirection: borderStyle === 'arrow' ? 'row' : 'column',
						gap: '2px',
						position: 'relative',
						rotate: '0deg',
						width: '100%',
						height: '100%',
					}}
				>
					<div
						className="divider-line"
						style={{
							borderColor: borderColor,
							borderStyle:
								borderStyle !== 'double' && borderStyle !== 'arrow' && borderStyle,
							borderWidth:
								borderStyle !== 'arrow' && borderWidth && `${borderWidth}px`,
							borderImage:
								borderStyle === 'dashed' &&
								`repeating-linear-gradient(90deg, ${borderColor} 0px, ${borderColor} 10px, transparent 10px, transparent 20px) 10`,
						}}
					></div>
					{borderStyle === 'double' && (
						<div
							className="divider-line"
							style={{
								borderColor: borderColor,
								borderStyle: borderStyle,
								borderWidth: `${borderWidth}px`,
							}}
						></div>
					)}
					{borderStyle === 'arrow' && (
						<>
							<div
								className="diamond-box"
								style={{
									left: '0px',
									backgroundColor: borderColor,
								}}
							></div>
							<div
								className="diamond-box"
								style={{
									right: '0px',
									backgroundColor: borderColor,
								}}
							></div>
						</>
					)}
				</div>
			</div>
		);
	} else {
		return (
			<div
				className="divider-container"
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: height,
					position: 'relative',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: `${borderWidth}px`,
						height: '100%',
					}}
				>
					{borderStyle === 'arrow' ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								width: '100%',
								height: '100%',
								position: 'relative',
							}}
						>
							<div
								className="diamond-box"
								style={{
									top: '0px',
									backgroundColor: borderColor,
								}}
							></div>
							<div
								style={{
									flexGrow: 1,
									borderLeft: `${borderWidth}px solid ${borderColor}`,
									width: '0px',
								}}
							></div>
							<div
								className="diamond-box"
								style={{
									bottom: '0px',
									backgroundColor: borderColor,
								}}
							></div>
						</div>
					) : borderStyle === 'double' ? (
						<>
							<div
								className="divider-line"
								style={{
									borderColor: borderColor,
									borderStyle: borderStyle,
									borderWidth: `${borderWidth}px`,
									width: '0px',
									height: '100%',
									margin: '0 2px',
								}}
							></div>
							<div
								className="divider-line"
								style={{
									borderColor: borderColor,
									borderStyle: borderStyle,
									borderWidth: `${borderWidth}px`,
									width: '0px',
									height: '100%',
									margin: '0 2px',
								}}
							></div>
						</>
					) : (
						<div
							className="divider-line"
							style={{
								borderColor: borderColor,
								borderStyle: borderStyle,
								borderWidth: `${borderWidth}px`,
								width: '0px',
								height: '100%',
								borderImage:
									borderStyle === 'dashed'
										? `repeating-linear-gradient(0deg, ${borderColor} 0px, ${borderColor} 10px, transparent 10px, transparent 20px) 10`
										: 'none',
							}}
						></div>
					)}
				</div>
			</div>
		);
	}
};

export default memo(Divider);
