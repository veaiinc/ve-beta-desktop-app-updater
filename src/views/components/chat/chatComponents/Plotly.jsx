// import { memo, useContext, useLayoutEffect, useState } from 'react';
// import s from '../../../../assets/scss/chat/chatComponents/plotly.module.scss';

// import Context from '../../../../context/context';
// import Plotlyy from 'plotly.js-basic-dist';
// import createPlotlyComponent from 'react-plotly.js/factory';

// const Plot = createPlotlyComponent(Plotlyy);

// const updatePlotData = (plotData, theme = 'dark') => {
// 	const primaryFont = theme === 'dark' ? '#f2f2f3' : '#18181b';
// 	const stroke = theme === 'dark' ? '#2c2d2e' : '#e3e3e3';
// 	const secondaryFont = theme === 'dark' ? '#94989e' : '#7f858f';
// 	const backgroundColor = theme === 'dark' ? '#121212' : '#fff';

// 	const data = plotData?.data ?? [];
// 	const layout = plotData?.layout ?? {};
// 	const template = layout?.template ?? {};
// 	const templateLayout = template?.layout ?? {};

// 	data?.forEach((item) => {
// 		item.hoverlabel = {
// 			bgcolor: backgroundColor,
// 			bordercolor: stroke,
// 			font: { color: primaryFont, size: 13 },
// 			align: 'left',
// 		};
// 		item.marker = { ...(item.marker || {}), line: { width: 0.5 } };
// 	});

// 	if (layout.width) {
// 		delete layout.width;
// 	}

// 	if (layout.height) {
// 		delete layout.height;
// 	}

// 	layout.title = {
// 		text: layout?.title?.text ?? '',
// 		font: { size: 15, weight: 500, color: primaryFont },
// 	};

// 	layout.xaxis = {
// 		...(layout.xaxis || {}),
// 		title: {
// 			...(layout.xaxis?.title || {}),
// 			font: { size: 10, color: secondaryFont },
// 		},
// 		ticklabelstandoff: 10,
// 	};

// 	layout.yaxis = {
// 		...(layout.yaxis || {}),
// 		title: {
// 			...(layout.yaxis?.title || {}),
// 			font: { size: 10, color: secondaryFont },
// 		},
// 		ticklabelstandoff: 10,
// 	};

// 	layout.xaxis2 = {
// 		...(layout.xaxis2 || {}),
// 		title: {
// 			...(layout.xaxis2?.title || {}),
// 			font: { size: 10, color: secondaryFont },
// 		},
// 		ticklabelstandoff: 10,
// 	};

// 	layout.yaxis2 = {
// 		...(layout.yaxis2 || {}),
// 		title: {
// 			...(layout.yaxis2?.title || {}),
// 			font: { size: 10, color: secondaryFont },
// 		},
// 		ticklabelstandoff: 10,
// 		showgrid: false,
// 	};

// 	layout.legend = {
// 		...(layout.legend || {}),
// 		font: { size: 10, color: secondaryFont },
// 		bgcolor: backgroundColor,
// 		orientation: 'h',
// 	};

// 	layout.bargap = 0.2;
// 	layout.bargroupgap = 0.15;

// 	templateLayout.font = {
// 		color: primaryFont,
// 		family: 'Inter, GeneralSans, Arial, Segoe UI, Helvetica, Apple, "Courier New", Consolas, monospace',
// 	};

// 	templateLayout.paper_bgcolor = 'transparent';
// 	templateLayout.plot_bgcolor = 'transparent';

// 	templateLayout.xaxis = {
// 		...(templateLayout.xaxis || {}),
// 		gridcolor: stroke,
// 		linecolor: stroke,
// 		ticks: '',
// 		title: { standoff: 15 },
// 		zerolinecolor: stroke,
// 		showgrid: false,
// 		automargin: true,
// 		zerolinewidth: 1,
// 		tickfont: { size: 10, color: secondaryFont },
// 	};

// 	templateLayout.yaxis = {
// 		...(templateLayout.yaxis || {}),
// 		gridcolor: stroke,
// 		linecolor: stroke,
// 		ticks: '',
// 		title: { standoff: 15 },
// 		zerolinecolor: stroke,
// 		automargin: true,
// 		zerolinewidth: 1,
// 		tickfont: { size: 10, color: secondaryFont },
// 	};

// 	return {
// 		data,
// 		layout,
// 	};
// };

// const Plotly = ({ attachmentId = null, plotly = [] }) => {
// 	const {
// 		themeInfo: { theme },
// 	} = useContext(Context);

// 	const [info, setInfo] = useState({ plotData: null });

// 	useLayoutEffect(() => {
// 		if (plotly?.length > 0) {
// 			const index = plotly?.findIndex((item) => item?.attachmentId === attachmentId);

// 			if (index !== -1) {
// 				const data = plotly[index]?.data || {};
// 				const updatedData = updatePlotData(data, theme);
// 				setInfo((prev) => ({
// 					...prev,
// 					plotData: updatedData,
// 				}));
// 			}
// 		}
// 	}, [plotly, attachmentId]);

// 	return (
// 		<div className={s.plotlyContainer}>
// 			{info?.plotData ? (
// 				<Plot
// 					plotly={Plotlyy}
// 					data={info?.plotData?.data}
// 					layout={info?.plotData?.layout}
// 					config={{
// 						responsive: true,
// 						displaylogo: false,
// 						showTips: false,
// 						modeBarButtonsToRemove: [
// 							'zoom2d',
// 							'pan2d',
// 							'select2d',
// 							'lasso2d',
// 							'toImage',
// 							'zoomOut2d',
// 							'autoScale2d',
// 							'resetScale2d',
// 							'zoomIn2d',
// 						],
// 					}}
// 					useResizeHandler={true}
// 					style={{
// 						width: '100%',
// 						aspectRatio: '4/3',
// 						backgroundColor: 'transparent',
// 					}}
// 				/>
// 			) : null}
// 		</div>
// 	);
// };

// export default memo(Plotly);
