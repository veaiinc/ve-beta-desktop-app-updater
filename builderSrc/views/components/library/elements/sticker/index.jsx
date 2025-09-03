import React, { Component } from 'react';
import './sticker.scss';

import Text from '../text';
import FlowerSticker from '../../svgs/stickerShapes/flower';
import CircleSticker from '../../svgs/stickerShapes/circle';
import SquareSticker from '../../svgs/stickerShapes/square';
import BloomSticker from '../../svgs/stickerShapes/bloom';
import BlossomSticker from '../../svgs/stickerShapes/blossom';
import DecagramSticker from '../../svgs/stickerShapes/decagram';
import PolygonSticker from '../../svgs/stickerShapes/polygon';
import Flower5SidesSticker from '../../svgs/stickerShapes/flower5sides';
//! not using after popup added
// import FluidSticker from '../../svgs/fluidShapes/circle';
// import Shape2 from '../../svgs/fluidShapes/shape2';
// import Shape3 from '../../svgs/fluidShapes/shape3';
// import Shape4 from '../../svgs/fluidShapes/shape4';
// import Shape5 from '../../svgs/fluidShapes/shape5';
// import Shape6 from '../../svgs/fluidShapes/shape6';
// import Shape14 from '../../svgs/fluidShapes/shape14';

import Shape7 from '../../svgs/fluidShapes/shape7';
import Shape8 from '../../svgs/fluidShapes/shape8';
import Shape9 from '../../svgs/fluidShapes/shape9';
import Shape10 from '../../svgs/fluidShapes/shape10';
import Shape11 from '../../svgs/fluidShapes/shape11';
import Shape12 from '../../svgs/fluidShapes/shape12';
import Shape13 from '../../svgs/fluidShapes/shape13';
import Shape15 from '../../svgs/fluidShapes/shape15';
import Shape16 from '../../svgs/fluidShapes/shape16';
import Shape17 from '../../svgs/fluidShapes/shape17';
import Shape18 from '../../svgs/fluidShapes/shape18';
import Shape19 from '../../svgs/fluidShapes/shape19';

import NormalStickerShapes from '../../svgs/stickerShapes/NormalStickerShapes';
import _ from 'lodash';
class Sticker extends Component {
	constructor(props) {
		super();
		this.state = {
			actionType: props.actionType,
			actionValue: props.actionValue,
			isSticker: props?.isSticker,
			preview: props.preview,
			refID: props?.refID,
			isFluid: props?.isFluid,
			width: props?.width,
			height: props?.height,
			stretch: props?.stretch || false,
		};
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}
		if (this.state.width !== nextProps.width) {
			this.setState({
				width: nextProps.width,
			});
		}
		if (this.state.height !== nextProps.height) {
			this.setState({
				height: nextProps.height,
			});
		}
		if (this.state.isFluid !== nextProps.isFluid) {
			this.setState({
				isFluid: nextProps.isFluid,
			});
		}
		if (this.state.refID !== nextProps.refID) {
			this.setState({
				refID: nextProps.refID,
			});
		}
		if (this.state.isSticker !== nextProps.isSticker && nextProps.isSticker) {
			this.setState({
				isSticker: nextProps.isSticker,
			});
		}
		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.stretch !== nextProps.stretch) {
			this.setState({
				stretch: nextProps.stretch,
			});
		}
	};

	render() {
		const stickersMap = {
			flower: (
				<FlowerSticker
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					preserveAspectRatio={this.state?.isFluid ? true : undefined}
				/>
			),
			circle: (
				<CircleSticker
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					preserveAspectRatio={this.state?.isFluid ? true : undefined}
				/>
			),
			square: this.state.isFluid ? (
				<div
					className="square-fluid-shape"
					style={{
						backgroundColor: this.props?.stickerFill,
						border: `5px solid ${this.props?.stickerStroke}`,
						opacity: this.props?.opacity,
					}}
				></div>
			) : (
				<SquareSticker
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					preserveAspectRatio={this.state?.isFluid ? true : undefined}
				/>
			),
			bloom: (
				<BloomSticker
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					preserveAspectRatio={this.state?.isFluid ? true : undefined}
				/>
			),
			decagram: (
				<DecagramSticker
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					preserveAspectRatio={this.state?.isFluid ? true : undefined}
				/>
			),
			flower5Sides: (
				<Flower5SidesSticker
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					preserveAspectRatio={this.state?.isFluid ? true : undefined}
				/>
			),
			polygon: (
				<PolygonSticker
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					preserveAspectRatio={this.state?.isFluid ? true : undefined}
				/>
			),
			blossom: (
				<BlossomSticker
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					preserveAspectRatio={this.state?.isFluid ? true : undefined}
				/>
			),
		};
		const fluidStickerMap = {
			circle: (
				// <FluidSticker
				// 	stickerFill={this.props.stickerFill}
				// 	stickerStroke={this.props.stickerStroke}
				// 	width={this.state.height}
				// 	opacity={this.props?.opacity || 1}
				// 	stretch={this.state.stretch}
				// 	stretchWidth={this.props.width}
				// 	stretchHeight={this.props.height}
				// />

				<NormalStickerShapes
					className="circle-sticker"
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					strokeStyles={this.props?.strokeStyles}
					stretch={this.state?.stretch}
					shadowStyles={this.props?.shadowStyles}
					opacity={this.props?.opacity ?? 1}
				/>
			),
			shape2: (
				// <Shape2
				// 	stickerFill={this.props.stickerFill}
				// 	stickerStroke={this.props.stickerStroke}
				// 	width={this.state.height}
				// 	opacity={this.props?.opacity || 1}
				// 	stretch={this.state.stretch}
				// />

				<NormalStickerShapes
					className="rounded-square-sticker"
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					strokeStyles={this.props?.strokeStyles}
					stretch={this.state?.stretch}
					shadowStyles={this.props?.shadowStyles}
					opacity={this.props?.opacity ?? 1}
				/>
			),
			shape3: (
				// <Shape3
				// 	stickerFill={this.props.stickerFill}
				// 	stickerStroke={this.props.stickerStroke}
				// 	width={this.state.height}
				// 	opacity={this.props?.opacity || 1}
				// 	stretch={this.state.stretch}
				// />

				<NormalStickerShapes
					className="square-sticker"
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					strokeStyles={this.props?.strokeStyles}
					stretch={this.state?.stretch}
					shadowStyles={this.props?.shadowStyles}
					opacity={this.props?.opacity ?? 1}
					cornerRadius={this.props?.cornerRadius || 0}
					showCornerRadius={true}
					corners={this.props?.corners || {}}
					isDiffCorners={this.props?.isDiffCorners}
				/>
			),
			shape4: (
				// <Shape4
				// 	stickerFill={this.props.stickerFill}
				// 	stickerStroke={this.props.stickerStroke}
				// 	width={this.state.height}
				// 	opacity={this.props?.opacity || 1}
				// 	stretch={this.state.stretch}
				// />

				<NormalStickerShapes
					className="rotated-square-sticker"
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					strokeStyles={this.props?.strokeStyles}
					stretch={this.state?.stretch}
					shadowStyles={this.props?.shadowStyles}
					opacity={this.props?.opacity ?? 1}
				/>
			),
			shape5: (
				// <Shape5
				// 	stickerFill={this.props.stickerFill}
				// 	stickerStroke={this.props.stickerStroke}
				// 	width={this.state.height}
				// 	opacity={this.props?.opacity || 1}
				// 	stretch={this.state.stretch}
				// />

				<NormalStickerShapes
					className="half-circle-sticker"
					stickerFill={this.props?.stickerFill}
					width={this.state?.height}
					stickerStroke={this.props?.stickerStroke}
					strokeStyles={this.props?.strokeStyles}
					stretch={this.state?.stretch}
					shadowStyles={this.props?.shadowStyles}
					opacity={this.props?.opacity ?? 1}
				/>
			),
			shape6: (
				// <Shape6
				// 	stickerFill={this.props.stickerFill}
				// 	stickerStroke={this.props.stickerStroke}
				// 	width={this.state.height}
				// 	opacity={this.props?.opacity || 1}
				// 	stretch={this.state.stretch}
				// />

				<NormalStickerShapes
					className="capsule-sticker"
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					strokeStyles={this.props?.strokeStyles}
					stretch={this.state?.stretch}
					shadowStyles={this.props?.shadowStyles}
					opacity={this.props?.opacity || 1}
				/>
			),
			shape7: (
				<Shape7
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity ?? 1}
					stretch={this.state?.stretch}
				/>
			),
			shape8: (
				<Shape8
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape9: (
				<Shape9
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape10: (
				<Shape10
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape11: (
				<Shape11
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape12: (
				<Shape12
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape13: (
				<Shape13
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape14: (
				// <Shape14
				// 	stickerFill={this.props.stickerFill}
				// 	stickerStroke={this.props.stickerStroke}
				// 	width={this.state.height}
				// 	opacity={this.props?.opacity || 1}
				// 	stretch={this.state.stretch}
				// />

				<NormalStickerShapes
					className="square-sticker"
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					strokeStyles={this.props?.strokeStyles}
					stretch={this.state?.stretch}
					shadowStyles={this.props?.shadowStyles}
					opacity={this.props?.opacity || 1}
				/>
			),
			shape15: (
				<Shape15
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape16: (
				<Shape16
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape17: (
				<Shape17
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape18: (
				<Shape18
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
			shape19: (
				<Shape19
					stickerFill={this.props?.stickerFill}
					stickerStroke={this.props?.stickerStroke}
					width={this.state?.height}
					opacity={this.props?.opacity || 1}
					stretch={this.state?.stretch}
				/>
			),
		};

		const RenderSticker = this.state.isFluid
			? fluidStickerMap[this.props.isSticker || 'circle']
			: stickersMap[this.props.isSticker || 'circle'];

		return (
			<div
				className={` Classticker ${this.props.isSticker} `}
				onClick={() => this.props.setTab('sticker')}
				style={{
					position: 'relative',
					...(this.state.isFluid
						? {
								display: 'flex',
								gridArea: 'inherit',
								flex: 1,
						  }
						: {}),
				}}
			>
				<div
					style={{
						...(this.state.isFluid
							? {
									display: 'flex',
									gridArea: 'inherit',
									flex: 1,
									justifyContent: 'center',
							  }
							: {}),
					}}
				>
					{RenderSticker}
				</div>
				{_.has(this.props, 'isFluid') ? (
					''
				) : (
					<Text
						isWorkflow={this.props.isWorkflow}
						text={this.props?.content}
						divStyles={{ ...this.props?.textStyles }}
						className={this.props?.className}
						activeFontColor={this.props?.activeFontColor}
						refID={this.props.refID}
						reference={this.props.reference}
						actionType={this.state.actionType}
						actionValue={this.state.actionValue}
						handleSelection={(e, activeTextBlock) =>
							this.props?.handleSelection(e, activeTextBlock)
						}
						activeSectionID={this.props.activeSectionID}
						sectionID={this.props.sectionID}
						activeTextBlock={this.props.activeTextBlock}
						setContent={(e) => this.props.setContent(e)}
						preview={this.state.preview}
						setTab={(e) => this.props.setTextTab(e)}
						activeVariableID={this.props?.activeVariableID}
						activeVariableName={this.props?.activeVariableName}
						subBlockID={this.props.subBlockID}
						variables={this.props.variables}
						client={this.props.client}
						module={this.props.module}
						activeVariable={(e) => this.props.activeVariable(e)}
						activeSubBlockId={this.props?.activeSubBlockId}
						sectionType={this.props.sectionType}
						header={this.props?.header}
						clearStyling={() => this.props.clearStyling()}
						label={this.props?.label}
					/>
				)}
			</div>
		);
	}
}

export default Sticker;
