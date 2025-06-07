import React, { Component } from 'react';
import Copy from '../actions/copy.jsx';
import Delete from '../actions/delete.jsx';
import Edit from '../actions/edit.jsx';
import Link from '../actions/link.jsx';

import Underlay from '../actions/underlay.jsx';
import Overlay from '../actions/overlay.jsx';
import { Tooltip } from 'antd/lib';
class FluidBlockOptionsControls extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				className="z-index-controls"
				style={{
					display: 'flex',
					gap: '10px',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'absolute',
					zIndex: '99',

					top: (() => {
						// Check if gridArea exists
						const gridArea =
							this.props.previewMode === 'm'
								? this.props.component.divStyles?.mGridArea
								: this.props.component.divStyles?.gridArea;

						if (gridArea) {
							// Extract the starting row from gridArea (first number before '/')
							const startRow = parseInt(gridArea.split('/')[0]);
							// If element starts in first 4 rows, position at 0, else -51
							return startRow <= 2 ? 0 : -65;
						}
						return -65; // Default position if no gridArea
					})(),
					left: 'calc(50% - 50px)',

					background: '#fff',
					padding: '10px',
					borderRadius: '4px',
					minWidth: '100px',
					boxShadow:
						'0 1px 1px hsl(0deg 0% 0% / 0.075),0 2px 2px hsl(0deg 0% 0% / 0.075),0 4px 4px hsl(0deg 0% 0% / 0.075),0 8px 8px hsl(0deg 0% 0% / 0.075),0 16px 16px hsl(0deg 0% 0% / 0.075),0 16px 16px hsl(0deg 0% 0% / 0.075)',
				}}
			>
				{/* {component.type === 'shape' && (
                <a
                    onClick={() =>
                        this.handleImageObjectFit(
                            'cover',
                            component,
                        )
                    }
                    style={{
                        cursor: 'pointer',
                        boxShadow:
                            '0 0 10px 0 rgba(0, 0, 0, 0.2)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        background: '#fff',
                        color: '#000',
                        fontSize: '14px',
                    }}
                >
                    Fill
                </a>
            )}
            {component.type === 'shape' && (
                <a
                    onClick={() =>
                        this.handleImageObjectFit(
                            'contain',
                            component,
                        )
                    }
                    style={{
                        cursor: 'pointer',
                        boxShadow:
                            '0 0 10px 0 rgba(0, 0, 0, 0.2)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        background: '#fff',
                        color: '#000',
                        fontSize: '14px',
                    }}
                >
                    Fit
                </a>
            )} */}
				{this.props.previewType === 'm' ? (
					''
				) : (
					<Tooltip title="Delete">
						<a
							onClick={(e) =>
								this.props.handleDeleteSubBlock(e, this.props.component?._id)
							}
							style={{ cursor: 'pointer' }}
						>
							<Delete />
						</a>
					</Tooltip>
				)}
				{/* {this.props.previewType == 'm' ? ( */}
				{/* // '' ) : (  */}
				<Tooltip title="Edit">
					<a
						onClick={(e) =>
							this.props.handleElementEdit(
								e,
								this.props.component,
								false,
								this.props.component?.type === 'text' ? false : true,
							)
						}
						style={{
							cursor: 'pointer',
							display: 'block',
						}}
					>
						<Edit />
					</a>
				</Tooltip>
				{/* // )}  */}
				{this.props.component.type === 'icon' &&
				this.props.component.iconName !== 'website' ? (
					<a
						onClick={(e) => this.props.handleSetLink(this.props.component?._id)}
						style={{ cursor: 'pointer' }}
					>
						<Link />
					</a>
				) : (
					''
				)}
				{this.props.previewType === 'm' ? (
					''
				) : (
					<Tooltip title="Copy">
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => this.props.pasteBlock(this.props.component)}
						>
							<Copy />
						</a>
					</Tooltip>
				)}
				{this.props.overlapOptions.hasOverlappingAbove && (
					<Tooltip title="Move Forward">
						<a
							onClick={(e) => {
								e.stopPropagation();
								this.props.adjustZIndex(this.props.component?._id, true);
							}}
							style={{ cursor: 'pointer' }}
						>
							<Overlay />
						</a>
					</Tooltip>
				)}
				{this.props.overlapOptions.hasOverlappingBelow && (
					<Tooltip title="Move Backwards">
						<a
							onClick={(e) => {
								e.stopPropagation();
								this.props.adjustZIndex(this.props.component?._id, false);
							}}
							style={{ cursor: 'pointer' }}
						>
							<Underlay />
						</a>
					</Tooltip>
				)}
				{/* {component.type === 'text' &&
                    this.props.previewType === 'm' && (
                        <a
                            style={{
                                cursor: 'pointer',
                                width: '200px',
                            }}
                            className="text-zoom-input"
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    marginLeft: 6,
                                }}
                            >
                                <input
                                    type="range"
                                    min={8}
                                    max={500}
                                    step={1}
                                    defaultValue={
                                        component
                                            ?.divStyles
                                            ?.mFontSize
                                    }
                                    onChange={(e) =>
                                        this.handleMobileTextZoom(
                                            e,
                                            component?._id,
                                        )
                                    }
                                />
                            </div>
                        </a>
                    )} */}
				{/* {component.type === 'shape' &&
                !this.props.isImageEdit &&
                this.props.previewType === 'm' && (
                    <a
                        onClick={(e) =>
                            this.setprops({
                                isImageEdit: true,
                            })
                        }
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        <Edit />
                    </a>
                )} */}
				{/* {component.type === 'shape' &&
                this.props.isImageEdit &&
                this.props.previewType === 'm' && (
                    <a
                        onClick={(e) =>
                            this.setprops({
                                isImageEdit: false,
                            })
                        }
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        Save
                    </a>
                )} */}
			</div>
		);
	}
}

export class ShowZIndexValues extends Component {
	render() {
		return (
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div> z - {this.props.component?.divStyles?.zIndex}</div>
				<div>m - {this.props.component?.divStyles?.mZIndex}</div>
			</div>
		);
	}
}

export default FluidBlockOptionsControls;
