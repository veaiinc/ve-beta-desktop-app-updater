import React, { Component } from 'react';
import { GRID_CONSTANTS, ELEMENT_DEFAULTS } from '../constants';
import Draggable from 'react-draggable';
import _ from 'lodash';

class LayoutCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridCols: props.previewMode === 'ml' ? GRID_CONSTANTS.MOBILE_COLS : GRID_CONSTANTS.DESKTOP_COLS,
            gridRows: GRID_CONSTANTS.MIN_ROWS,
            cellWidth: GRID_CONSTANTS.CELL_WIDTH,
            cellHeight: GRID_CONSTANTS.CELL_HEIGHT,
            gridGap: GRID_CONSTANTS.GRID_GAP,
            isDragging: false,
            isResizing: false,
            activeComponentId: null,
            components: props.blocks || [],
            placeholderPosition: null,
            previewGrid: false
        };

        this.containerRef = React.createRef();
        this.componentRefs = {};
    }

    calculateGridPosition = (mouseX, mouseY) => {
        const containerRect = this.containerRef.current.getBoundingClientRect();
        const { cellWidth, cellHeight, gridGap } = this.state;

        const relativeX = mouseX - containerRect.left;
        const relativeY = mouseY - containerRect.top;

        return {
            col: Math.floor(relativeX / (cellWidth + gridGap)),
            row: Math.floor(relativeY / (cellHeight + gridGap))
        };
    };

    handleDragStart = (e, data, component) => {
        const { cellWidth, cellHeight, gridGap } = this.state;
        const elementRect = this.componentRefs[component._id].getBoundingClientRect();

        // Calculate component dimensions in grid units
        const widthInCells = Math.max(
            Math.ceil(elementRect.width / (cellWidth + gridGap)),
            ELEMENT_DEFAULTS[component.type]?.minWidth || 1
        );
        const heightInCells = Math.max(
            Math.ceil(elementRect.height / (cellHeight + gridGap)),
            ELEMENT_DEFAULTS[component.type]?.minHeight || 1
        );

        this.setState({
            isDragging: true,
            previewGrid: true,
            activeComponentId: component._id,
            componentDimensions: { width: widthInCells, height: heightInCells }
        });
    };

    handleDrag = (e, data, component) => {
        const { col, row } = this.calculateGridPosition(e.clientX, e.clientY);
        const { componentDimensions } = this.state;

        // Update placeholder position
        const gridArea = `${row + 1} / ${col + 1} / ${row + componentDimensions.height + 1} / ${col + componentDimensions.width + 1}`;

        this.setState({
            placeholderPosition: { gridArea }
        });
    };

    handleDragStop = (e, data, component) => {
        const { placeholderPosition } = this.state;

        if (placeholderPosition) {
            // Update component position in the grid
            const updatedComponents = this.state.components.map(comp => {
                if (comp._id === component._id) {
                    return {
                        ...comp,
                        divStyles: {
                            ...comp.divStyles,
                            gridArea: placeholderPosition.gridArea
                        }
                    };
                }
                return comp;
            });

            this.setState({
                components: updatedComponents,
                isDragging: false,
                previewGrid: false,
                placeholderPosition: null
            }, () => {
                this.props.handleSaveblocks(updatedComponents);
            });
        }
    };

    renderGridOverlay = () => {
        const { gridCols, gridRows, cellWidth, cellHeight, gridGap } = this.state;

        return (
            <div className="grid-overlay">
                {Array.from({ length: gridCols * gridRows }).map((_, index) => (
                    <div
                        key={index}
                        className="grid-cell"
                        style={{
                            width: cellWidth,
                            height: cellHeight,
                            margin: gridGap / 2
                        }}
                    />
                ))}
            </div>
        );
    };

    render() {
        const { cellWidth, cellHeight, gridGap, gridCols } = this.state;

        return (
            <div
                className="layout-container"
                ref={this.containerRef}
            >
                <div
                    className="layout-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${gridCols}, ${cellWidth}px)`,
                        gridAutoRows: `${cellHeight}px`,
                        gap: `${gridGap}px`,
                        padding: `${gridGap}px`,
                        position: 'relative'
                    }}
                >
                    {this.state.previewGrid && this.renderGridOverlay()}

                    {this.state.components.map(component => (
                        <Draggable
                            key={component._id}
                            bounds="parent"
                            onStart={(e, data) => this.handleDragStart(e, data, component)}
                            onDrag={(e, data) => this.handleDrag(e, data, component)}
                            onStop={(e, data) => this.handleDragStop(e, data, component)}
                        >
                            <div
                                ref={el => this.componentRefs[component._id] = el}
                                className={`component ${this.state.isDragging ? 'dragging' : ''}`}
                                style={{
                                    gridArea: component.divStyles.gridArea,
                                    zIndex: component.divStyles.zIndex || 0
                                }}
                            >
                                {/* Render component content */}
                            </div>
                        </Draggable>
                    ))}
                </div>
            </div>
        );
    }
}

export default LayoutCanvas; 
