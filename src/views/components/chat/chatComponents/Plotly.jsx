import { memo, useContext, useLayoutEffect, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/plotly.module.scss';

import Context from '../../../../context/context';
import Plotlyy from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotlyy);

// const plots = [
// 	{
// 		data: [
// 			{
// 				marker: { color: '#A259EA' },
// 				name: 'CapEx ($B)',
// 				x: [
// 					'Q3 2023',
// 					'Q4 2023',
// 					'Q1 2024',
// 					'Q2 2024',
// 					'Q3 2024',
// 					'Q4 2024',
// 					'Q1 2025',
// 					'Q2 2025',
// 				],
// 				y: {
// 					dtype: 'f8',
// 					bdata: 'zczMzMzM\u002fD+amZmZmZkBQM3MzMzMzABAZmZmZmZmAkAzMzMzMzMDQAAAAAAAAARAzczMzMzMBECamZmZmZkFQA==',
// 				},
// 				type: 'bar',
// 			},
// 			{
// 				marker: { color: '#78D64B' },
// 				mode: 'lines+markers',
// 				name: 'Free Cash Flow ($M)',
// 				x: [
// 					'Q3 2023',
// 					'Q4 2023',
// 					'Q1 2024',
// 					'Q2 2024',
// 					'Q3 2024',
// 					'Q4 2024',
// 					'Q1 2025',
// 					'Q2 2025',
// 				],
// 				y: { dtype: 'i2', bdata: 'hANMBCADvAJYAvQBkAGSAA==' },
// 				yaxis: 'y2',
// 				type: 'scatter',
// 			},
// 		],
// 		layout: {
// 			template: {
// 				data: {
// 					histogram2dcontour: [
// 						{
// 							type: 'histogram2dcontour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					choropleth: [{ type: 'choropleth', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					histogram2d: [
// 						{
// 							type: 'histogram2d',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					heatmap: [
// 						{
// 							type: 'heatmap',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					contourcarpet: [
// 						{ type: 'contourcarpet', colorbar: { outlinewidth: 0, ticks: '' } },
// 					],
// 					contour: [
// 						{
// 							type: 'contour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					surface: [
// 						{
// 							type: 'surface',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					mesh3d: [{ type: 'mesh3d', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					scatter: [
// 						{
// 							fillpattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							type: 'scatter',
// 						},
// 					],
// 					parcoords: [
// 						{ type: 'parcoords', line: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatterpolargl: [
// 						{
// 							type: 'scatterpolargl',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					bar: [
// 						{
// 							error_x: { color: '#2a3f5f' },
// 							error_y: { color: '#2a3f5f' },
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'bar',
// 						},
// 					],
// 					scattergeo: [
// 						{
// 							type: 'scattergeo',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterpolar: [
// 						{
// 							type: 'scatterpolar',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					histogram: [
// 						{
// 							marker: { pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 } },
// 							type: 'histogram',
// 						},
// 					],
// 					scattergl: [
// 						{ type: 'scattergl', marker: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatter3d: [
// 						{
// 							type: 'scatter3d',
// 							line: { colorbar: { outlinewidth: 0, ticks: '' } },
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermap: [
// 						{
// 							type: 'scattermap',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermapbox: [
// 						{
// 							type: 'scattermapbox',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterternary: [
// 						{
// 							type: 'scatterternary',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattercarpet: [
// 						{
// 							type: 'scattercarpet',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					carpet: [
// 						{
// 							aaxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							baxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							type: 'carpet',
// 						},
// 					],
// 					table: [
// 						{
// 							cells: { fill: { color: '#EBF0F8' }, line: { color: 'white' } },
// 							header: { fill: { color: '#C8D4E3' }, line: { color: 'white' } },
// 							type: 'table',
// 						},
// 					],
// 					barpolar: [
// 						{
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'barpolar',
// 						},
// 					],
// 					pie: [{ automargin: true, type: 'pie' }],
// 				},
// 				layout: {
// 					autotypenumbers: 'strict',
// 					colorway: [
// 						'#636efa',
// 						'#EF553B',
// 						'#00cc96',
// 						'#ab63fa',
// 						'#FFA15A',
// 						'#19d3f3',
// 						'#FF6692',
// 						'#B6E880',
// 						'#FF97FF',
// 						'#FECB52',
// 					],
// 					font: { color: '#2a3f5f' },
// 					hovermode: 'closest',
// 					hoverlabel: { align: 'left' },
// 					paper_bgcolor: 'white',
// 					plot_bgcolor: '#E5ECF6',
// 					polar: {
// 						bgcolor: '#E5ECF6',
// 						angularaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						radialaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					ternary: {
// 						bgcolor: '#E5ECF6',
// 						aaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						baxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						caxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
// 					colorscale: {
// 						sequential: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						sequentialminus: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						diverging: [
// 							[0, '#8e0152'],
// 							[0.1, '#c51b7d'],
// 							[0.2, '#de77ae'],
// 							[0.3, '#f1b6da'],
// 							[0.4, '#fde0ef'],
// 							[0.5, '#f7f7f7'],
// 							[0.6, '#e6f5d0'],
// 							[0.7, '#b8e186'],
// 							[0.8, '#7fbc41'],
// 							[0.9, '#4d9221'],
// 							[1, '#276419'],
// 						],
// 					},
// 					xaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					yaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					scene: {
// 						xaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						yaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						zaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 					},
// 					shapedefaults: { line: { color: '#2a3f5f' } },
// 					annotationdefaults: { arrowcolor: '#2a3f5f', arrowhead: 0, arrowwidth: 1 },
// 					geo: {
// 						bgcolor: 'white',
// 						landcolor: '#E5ECF6',
// 						subunitcolor: 'white',
// 						showland: true,
// 						showlakes: true,
// 						lakecolor: 'white',
// 					},
// 					title: { x: 0.05 },
// 					mapbox: { style: 'light' },
// 				},
// 			},
// 			yaxis: { title: { text: 'CapEx ($B)' }, side: 'left' },
// 			yaxis2: { title: { text: 'Free Cash Flow ($M)' }, overlaying: 'y', side: 'right' },
// 			legend: { x: 0.01, y: 0.99 },
// 			title: { text: 'Tesla CapEx and Free Cash Flow Trend' },
// 			xaxis: { title: { text: 'Quarter' } },
// 		},
// 	},
// 	{
// 		data: [
// 			{
// 				marker: { color: '#FFB000' },
// 				name: 'Total Revenue',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'NltSYqBazFteYg==' },
// 				type: 'bar',
// 				xaxis: 'x',
// 				yaxis: 'y',
// 			},
// 			{
// 				marker: { color: '#F46821' },
// 				name: 'Gross Profit',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'UhCUEaAPshCFEw==' },
// 				type: 'bar',
// 				xaxis: 'x',
// 				yaxis: 'y',
// 			},
// 			{
// 				marker: { color: '#F43256' },
// 				name: 'Net Income',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'PQc0CLAEfwV3CA==' },
// 				type: 'bar',
// 				xaxis: 'x',
// 				yaxis: 'y',
// 			},
// 			{
// 				marker: { color: '#29BEFD' },
// 				mode: 'lines+markers',
// 				name: 'Automotive Revenue',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'qUwIUkRIREkwTg==' },
// 				type: 'scatter',
// 				xaxis: 'x2',
// 				yaxis: 'y2',
// 			},
// 			{
// 				marker: { color: '#78D64B' },
// 				mode: 'lines+markers',
// 				name: 'Energy Revenue',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'FwakBjQI9QlICQ==' },
// 				type: 'scatter',
// 				xaxis: 'x2',
// 				yaxis: 'y2',
// 			},
// 		],
// 		layout: {
// 			template: {
// 				data: {
// 					histogram2dcontour: [
// 						{
// 							type: 'histogram2dcontour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					choropleth: [{ type: 'choropleth', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					histogram2d: [
// 						{
// 							type: 'histogram2d',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					heatmap: [
// 						{
// 							type: 'heatmap',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					contourcarpet: [
// 						{ type: 'contourcarpet', colorbar: { outlinewidth: 0, ticks: '' } },
// 					],
// 					contour: [
// 						{
// 							type: 'contour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					surface: [
// 						{
// 							type: 'surface',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					mesh3d: [{ type: 'mesh3d', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					scatter: [
// 						{
// 							fillpattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							type: 'scatter',
// 						},
// 					],
// 					parcoords: [
// 						{ type: 'parcoords', line: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatterpolargl: [
// 						{
// 							type: 'scatterpolargl',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					bar: [
// 						{
// 							error_x: { color: '#2a3f5f' },
// 							error_y: { color: '#2a3f5f' },
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'bar',
// 						},
// 					],
// 					scattergeo: [
// 						{
// 							type: 'scattergeo',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterpolar: [
// 						{
// 							type: 'scatterpolar',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					histogram: [
// 						{
// 							marker: { pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 } },
// 							type: 'histogram',
// 						},
// 					],
// 					scattergl: [
// 						{ type: 'scattergl', marker: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatter3d: [
// 						{
// 							type: 'scatter3d',
// 							line: { colorbar: { outlinewidth: 0, ticks: '' } },
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermap: [
// 						{
// 							type: 'scattermap',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermapbox: [
// 						{
// 							type: 'scattermapbox',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterternary: [
// 						{
// 							type: 'scatterternary',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattercarpet: [
// 						{
// 							type: 'scattercarpet',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					carpet: [
// 						{
// 							aaxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							baxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							type: 'carpet',
// 						},
// 					],
// 					table: [
// 						{
// 							cells: { fill: { color: '#EBF0F8' }, line: { color: 'white' } },
// 							header: { fill: { color: '#C8D4E3' }, line: { color: 'white' } },
// 							type: 'table',
// 						},
// 					],
// 					barpolar: [
// 						{
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'barpolar',
// 						},
// 					],
// 					pie: [{ automargin: true, type: 'pie' }],
// 				},
// 				layout: {
// 					autotypenumbers: 'strict',
// 					colorway: [
// 						'#636efa',
// 						'#EF553B',
// 						'#00cc96',
// 						'#ab63fa',
// 						'#FFA15A',
// 						'#19d3f3',
// 						'#FF6692',
// 						'#B6E880',
// 						'#FF97FF',
// 						'#FECB52',
// 					],
// 					font: { color: '#2a3f5f' },
// 					hovermode: 'closest',
// 					hoverlabel: { align: 'left' },
// 					paper_bgcolor: 'white',
// 					plot_bgcolor: '#E5ECF6',
// 					polar: {
// 						bgcolor: '#E5ECF6',
// 						angularaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						radialaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					ternary: {
// 						bgcolor: '#E5ECF6',
// 						aaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						baxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						caxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
// 					colorscale: {
// 						sequential: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						sequentialminus: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						diverging: [
// 							[0, '#8e0152'],
// 							[0.1, '#c51b7d'],
// 							[0.2, '#de77ae'],
// 							[0.3, '#f1b6da'],
// 							[0.4, '#fde0ef'],
// 							[0.5, '#f7f7f7'],
// 							[0.6, '#e6f5d0'],
// 							[0.7, '#b8e186'],
// 							[0.8, '#7fbc41'],
// 							[0.9, '#4d9221'],
// 							[1, '#276419'],
// 						],
// 					},
// 					xaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					yaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					scene: {
// 						xaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						yaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						zaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 					},
// 					shapedefaults: { line: { color: '#2a3f5f' } },
// 					annotationdefaults: { arrowcolor: '#2a3f5f', arrowhead: 0, arrowwidth: 1 },
// 					geo: {
// 						bgcolor: 'white',
// 						landcolor: '#E5ECF6',
// 						subunitcolor: 'white',
// 						showland: true,
// 						showlakes: true,
// 						lakecolor: 'white',
// 					},
// 					title: { x: 0.05 },
// 					mapbox: { style: 'light' },
// 				},
// 			},
// 			xaxis: { anchor: 'y', domain: [0.0, 1.0], matches: 'x2', showticklabels: false },
// 			yaxis: { anchor: 'x', domain: [0.625, 1.0] },
// 			xaxis2: { anchor: 'y2', domain: [0.0, 1.0] },
// 			yaxis2: { anchor: 'x2', domain: [0.0, 0.375] },
// 			annotations: [
// 				{
// 					font: { size: 16 },
// 					showarrow: false,
// 					text: 'Revenue, Gross Profit, Net Income',
// 					x: 0.5,
// 					xanchor: 'center',
// 					xref: 'paper',
// 					y: 1.0,
// 					yanchor: 'bottom',
// 					yref: 'paper',
// 				},
// 				{
// 					font: { size: 16 },
// 					showarrow: false,
// 					text: 'Automotive vs Energy Revenue',
// 					x: 0.5,
// 					xanchor: 'center',
// 					xref: 'paper',
// 					y: 0.375,
// 					yanchor: 'bottom',
// 					yref: 'paper',
// 				},
// 			],
// 			title: { text: 'Tesla Financial Performance: Q3 2023 - Q3 2024' },
// 			legend: {
// 				orientation: 'h',
// 				yanchor: 'bottom',
// 				y: 1.02,
// 				xanchor: 'right',
// 				x: 1,
// 			},
// 			height: 700,
// 			width: 900,
// 			barmode: 'group',
// 		},
// 	},
// 	{
// 		data: [
// 			{
// 				marker: { color: '#FFB000' },
// 				name: 'Total Revenue',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'aFtwYgRbrFg8Wg==' },
// 				yaxis: 'y',
// 				type: 'bar',
// 			},
// 			{
// 				marker: { color: '#F46821' },
// 				name: 'Gross Profit',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'XBLsE\u002fgRaBAEEA==' },
// 				yaxis: 'y',
// 				type: 'bar',
// 			},
// 			{
// 				marker: { color: '#F43256' },
// 				name: 'Net Income',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'OgdcCFQGeAVGBQ==' },
// 				yaxis: 'y',
// 				type: 'bar',
// 			},
// 			{
// 				marker: { color: '#29BEFD' },
// 				mode: 'lines+markers',
// 				name: 'Automotive Revenue',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'kExsUlhNvE0sTA==' },
// 				yaxis: 'y2',
// 				type: 'scatter',
// 			},
// 			{
// 				marker: { color: '#78D64B' },
// 				mode: 'lines+markers',
// 				name: 'Energy Revenue',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'CAfQBzQI\u002fAjECQ==' },
// 				yaxis: 'y2',
// 				type: 'scatter',
// 			},
// 		],
// 		layout: {
// 			template: {
// 				data: {
// 					histogram2dcontour: [
// 						{
// 							type: 'histogram2dcontour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					choropleth: [{ type: 'choropleth', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					histogram2d: [
// 						{
// 							type: 'histogram2d',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					heatmap: [
// 						{
// 							type: 'heatmap',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					contourcarpet: [
// 						{ type: 'contourcarpet', colorbar: { outlinewidth: 0, ticks: '' } },
// 					],
// 					contour: [
// 						{
// 							type: 'contour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					surface: [
// 						{
// 							type: 'surface',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					mesh3d: [{ type: 'mesh3d', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					scatter: [
// 						{
// 							fillpattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							type: 'scatter',
// 						},
// 					],
// 					parcoords: [
// 						{ type: 'parcoords', line: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatterpolargl: [
// 						{
// 							type: 'scatterpolargl',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					bar: [
// 						{
// 							error_x: { color: '#2a3f5f' },
// 							error_y: { color: '#2a3f5f' },
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'bar',
// 						},
// 					],
// 					scattergeo: [
// 						{
// 							type: 'scattergeo',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterpolar: [
// 						{
// 							type: 'scatterpolar',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					histogram: [
// 						{
// 							marker: { pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 } },
// 							type: 'histogram',
// 						},
// 					],
// 					scattergl: [
// 						{ type: 'scattergl', marker: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatter3d: [
// 						{
// 							type: 'scatter3d',
// 							line: { colorbar: { outlinewidth: 0, ticks: '' } },
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermap: [
// 						{
// 							type: 'scattermap',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermapbox: [
// 						{
// 							type: 'scattermapbox',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterternary: [
// 						{
// 							type: 'scatterternary',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattercarpet: [
// 						{
// 							type: 'scattercarpet',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					carpet: [
// 						{
// 							aaxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							baxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							type: 'carpet',
// 						},
// 					],
// 					table: [
// 						{
// 							cells: { fill: { color: '#EBF0F8' }, line: { color: 'white' } },
// 							header: { fill: { color: '#C8D4E3' }, line: { color: 'white' } },
// 							type: 'table',
// 						},
// 					],
// 					barpolar: [
// 						{
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'barpolar',
// 						},
// 					],
// 					pie: [{ automargin: true, type: 'pie' }],
// 				},
// 				layout: {
// 					autotypenumbers: 'strict',
// 					colorway: [
// 						'#636efa',
// 						'#EF553B',
// 						'#00cc96',
// 						'#ab63fa',
// 						'#FFA15A',
// 						'#19d3f3',
// 						'#FF6692',
// 						'#B6E880',
// 						'#FF97FF',
// 						'#FECB52',
// 					],
// 					font: { color: '#2a3f5f' },
// 					hovermode: 'closest',
// 					hoverlabel: { align: 'left' },
// 					paper_bgcolor: 'white',
// 					plot_bgcolor: '#E5ECF6',
// 					polar: {
// 						bgcolor: '#E5ECF6',
// 						angularaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						radialaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					ternary: {
// 						bgcolor: '#E5ECF6',
// 						aaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						baxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						caxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
// 					colorscale: {
// 						sequential: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						sequentialminus: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						diverging: [
// 							[0, '#8e0152'],
// 							[0.1, '#c51b7d'],
// 							[0.2, '#de77ae'],
// 							[0.3, '#f1b6da'],
// 							[0.4, '#fde0ef'],
// 							[0.5, '#f7f7f7'],
// 							[0.6, '#e6f5d0'],
// 							[0.7, '#b8e186'],
// 							[0.8, '#7fbc41'],
// 							[0.9, '#4d9221'],
// 							[1, '#276419'],
// 						],
// 					},
// 					xaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					yaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					scene: {
// 						xaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						yaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						zaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 					},
// 					shapedefaults: { line: { color: '#2a3f5f' } },
// 					annotationdefaults: { arrowcolor: '#2a3f5f', arrowhead: 0, arrowwidth: 1 },
// 					geo: {
// 						bgcolor: 'white',
// 						landcolor: '#E5ECF6',
// 						subunitcolor: 'white',
// 						showland: true,
// 						showlakes: true,
// 						lakecolor: 'white',
// 					},
// 					title: { x: 0.05 },
// 					mapbox: { style: 'light' },
// 				},
// 			},
// 			yaxis: { title: { text: 'Financials (USD Millions)' }, side: 'left', showgrid: true },
// 			yaxis2: {
// 				title: { text: 'Segment Revenue (USD Millions)' },
// 				overlaying: 'y',
// 				side: 'right',
// 				showgrid: false,
// 			},
// 			legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, xanchor: 'right', x: 1 },
// 			title: { text: 'Tesla Financial Performance: Q3 2023 - Q3 2024' },
// 			xaxis: { title: { text: 'Quarter' } },
// 			barmode: 'group',
// 		},
// 	},
// 	{
// 		data: [
// 			{
// 				marker: { color: '#F46821' },
// 				mode: 'lines+markers',
// 				name: 'Deliveries (K)',
// 				x: [
// 					'Q3 2023',
// 					'Q4 2023',
// 					'Q1 2024',
// 					'Q2 2024',
// 					'Q3 2024',
// 					'Q4 2024',
// 					'Q1 2025',
// 					'Q2 2025',
// 				],
// 				y: { dtype: 'i2', bdata: 'swHkAaYBvgGzAdQBmgGAAQ==' },
// 				type: 'scatter',
// 			},
// 		],
// 		layout: {
// 			template: {
// 				data: {
// 					histogram2dcontour: [
// 						{
// 							type: 'histogram2dcontour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					choropleth: [{ type: 'choropleth', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					histogram2d: [
// 						{
// 							type: 'histogram2d',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					heatmap: [
// 						{
// 							type: 'heatmap',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					contourcarpet: [
// 						{ type: 'contourcarpet', colorbar: { outlinewidth: 0, ticks: '' } },
// 					],
// 					contour: [
// 						{
// 							type: 'contour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					surface: [
// 						{
// 							type: 'surface',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					mesh3d: [{ type: 'mesh3d', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					scatter: [
// 						{
// 							fillpattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							type: 'scatter',
// 						},
// 					],
// 					parcoords: [
// 						{ type: 'parcoords', line: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatterpolargl: [
// 						{
// 							type: 'scatterpolargl',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					bar: [
// 						{
// 							error_x: { color: '#2a3f5f' },
// 							error_y: { color: '#2a3f5f' },
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'bar',
// 						},
// 					],
// 					scattergeo: [
// 						{
// 							type: 'scattergeo',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterpolar: [
// 						{
// 							type: 'scatterpolar',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					histogram: [
// 						{
// 							marker: { pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 } },
// 							type: 'histogram',
// 						},
// 					],
// 					scattergl: [
// 						{ type: 'scattergl', marker: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatter3d: [
// 						{
// 							type: 'scatter3d',
// 							line: { colorbar: { outlinewidth: 0, ticks: '' } },
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermap: [
// 						{
// 							type: 'scattermap',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermapbox: [
// 						{
// 							type: 'scattermapbox',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterternary: [
// 						{
// 							type: 'scatterternary',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattercarpet: [
// 						{
// 							type: 'scattercarpet',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					carpet: [
// 						{
// 							aaxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							baxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							type: 'carpet',
// 						},
// 					],
// 					table: [
// 						{
// 							cells: { fill: { color: '#EBF0F8' }, line: { color: 'white' } },
// 							header: { fill: { color: '#C8D4E3' }, line: { color: 'white' } },
// 							type: 'table',
// 						},
// 					],
// 					barpolar: [
// 						{
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'barpolar',
// 						},
// 					],
// 					pie: [{ automargin: true, type: 'pie' }],
// 				},
// 				layout: {
// 					autotypenumbers: 'strict',
// 					colorway: [
// 						'#636efa',
// 						'#EF553B',
// 						'#00cc96',
// 						'#ab63fa',
// 						'#FFA15A',
// 						'#19d3f3',
// 						'#FF6692',
// 						'#B6E880',
// 						'#FF97FF',
// 						'#FECB52',
// 					],
// 					font: { color: '#2a3f5f' },
// 					hovermode: 'closest',
// 					hoverlabel: { align: 'left' },
// 					paper_bgcolor: 'white',
// 					plot_bgcolor: '#E5ECF6',
// 					polar: {
// 						bgcolor: '#E5ECF6',
// 						angularaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						radialaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					ternary: {
// 						bgcolor: '#E5ECF6',
// 						aaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						baxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						caxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
// 					colorscale: {
// 						sequential: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						sequentialminus: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						diverging: [
// 							[0, '#8e0152'],
// 							[0.1, '#c51b7d'],
// 							[0.2, '#de77ae'],
// 							[0.3, '#f1b6da'],
// 							[0.4, '#fde0ef'],
// 							[0.5, '#f7f7f7'],
// 							[0.6, '#e6f5d0'],
// 							[0.7, '#b8e186'],
// 							[0.8, '#7fbc41'],
// 							[0.9, '#4d9221'],
// 							[1, '#276419'],
// 						],
// 					},
// 					xaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					yaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					scene: {
// 						xaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						yaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						zaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 					},
// 					shapedefaults: { line: { color: '#2a3f5f' } },
// 					annotationdefaults: { arrowcolor: '#2a3f5f', arrowhead: 0, arrowwidth: 1 },
// 					geo: {
// 						bgcolor: 'white',
// 						landcolor: '#E5ECF6',
// 						subunitcolor: 'white',
// 						showland: true,
// 						showlakes: true,
// 						lakecolor: 'white',
// 					},
// 					title: { x: 0.05 },
// 					mapbox: { style: 'light' },
// 				},
// 			},
// 			title: { text: 'Tesla Quarterly Vehicle Deliveries' },
// 			xaxis: { title: { text: 'Quarter' } },
// 			yaxis: { title: { text: 'Deliveries (Thousands)' } },
// 		},
// 	},
// 	{
// 		data: [
// 			{
// 				labels: ['Automotive', 'Energy'],
// 				marker: { colors: ['#FFB000', '#29BEFD'] },
// 				values: [16.7, 3.2],
// 				type: 'pie',
// 			},
// 		],
// 		layout: {
// 			template: {
// 				data: {
// 					histogram2dcontour: [
// 						{
// 							type: 'histogram2dcontour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					choropleth: [{ type: 'choropleth', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					histogram2d: [
// 						{
// 							type: 'histogram2d',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					heatmap: [
// 						{
// 							type: 'heatmap',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					contourcarpet: [
// 						{ type: 'contourcarpet', colorbar: { outlinewidth: 0, ticks: '' } },
// 					],
// 					contour: [
// 						{
// 							type: 'contour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					surface: [
// 						{
// 							type: 'surface',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					mesh3d: [{ type: 'mesh3d', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					scatter: [
// 						{
// 							fillpattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							type: 'scatter',
// 						},
// 					],
// 					parcoords: [
// 						{ type: 'parcoords', line: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatterpolargl: [
// 						{
// 							type: 'scatterpolargl',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					bar: [
// 						{
// 							error_x: { color: '#2a3f5f' },
// 							error_y: { color: '#2a3f5f' },
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'bar',
// 						},
// 					],
// 					scattergeo: [
// 						{
// 							type: 'scattergeo',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterpolar: [
// 						{
// 							type: 'scatterpolar',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					histogram: [
// 						{
// 							marker: { pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 } },
// 							type: 'histogram',
// 						},
// 					],
// 					scattergl: [
// 						{ type: 'scattergl', marker: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatter3d: [
// 						{
// 							type: 'scatter3d',
// 							line: { colorbar: { outlinewidth: 0, ticks: '' } },
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermap: [
// 						{
// 							type: 'scattermap',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermapbox: [
// 						{
// 							type: 'scattermapbox',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterternary: [
// 						{
// 							type: 'scatterternary',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattercarpet: [
// 						{
// 							type: 'scattercarpet',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					carpet: [
// 						{
// 							aaxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							baxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							type: 'carpet',
// 						},
// 					],
// 					table: [
// 						{
// 							cells: { fill: { color: '#EBF0F8' }, line: { color: 'white' } },
// 							header: { fill: { color: '#C8D4E3' }, line: { color: 'white' } },
// 							type: 'table',
// 						},
// 					],
// 					barpolar: [
// 						{
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'barpolar',
// 						},
// 					],
// 					pie: [{ automargin: true, type: 'pie' }],
// 				},
// 				layout: {
// 					autotypenumbers: 'strict',
// 					colorway: [
// 						'#636efa',
// 						'#EF553B',
// 						'#00cc96',
// 						'#ab63fa',
// 						'#FFA15A',
// 						'#19d3f3',
// 						'#FF6692',
// 						'#B6E880',
// 						'#FF97FF',
// 						'#FECB52',
// 					],
// 					font: { color: '#2a3f5f' },
// 					hovermode: 'closest',
// 					hoverlabel: { align: 'left' },
// 					paper_bgcolor: 'white',
// 					plot_bgcolor: '#E5ECF6',
// 					polar: {
// 						bgcolor: '#E5ECF6',
// 						angularaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						radialaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					ternary: {
// 						bgcolor: '#E5ECF6',
// 						aaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						baxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						caxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
// 					colorscale: {
// 						sequential: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						sequentialminus: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						diverging: [
// 							[0, '#8e0152'],
// 							[0.1, '#c51b7d'],
// 							[0.2, '#de77ae'],
// 							[0.3, '#f1b6da'],
// 							[0.4, '#fde0ef'],
// 							[0.5, '#f7f7f7'],
// 							[0.6, '#e6f5d0'],
// 							[0.7, '#b8e186'],
// 							[0.8, '#7fbc41'],
// 							[0.9, '#4d9221'],
// 							[1, '#276419'],
// 						],
// 					},
// 					xaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					yaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					scene: {
// 						xaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						yaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						zaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 					},
// 					shapedefaults: { line: { color: '#2a3f5f' } },
// 					annotationdefaults: { arrowcolor: '#2a3f5f', arrowhead: 0, arrowwidth: 1 },
// 					geo: {
// 						bgcolor: 'white',
// 						landcolor: '#E5ECF6',
// 						subunitcolor: 'white',
// 						showland: true,
// 						showlakes: true,
// 						lakecolor: 'white',
// 					},
// 					title: { x: 0.05 },
// 					mapbox: { style: 'light' },
// 				},
// 			},
// 			title: { text: 'Tesla Q2 2025 Revenue Breakdown' },
// 		},
// 	},
// 	{
// 		data: [
// 			{
// 				marker: { color: '#FFB000' },
// 				name: 'Revenue ($B)',
// 				x: [
// 					'Q3 2023',
// 					'Q4 2023',
// 					'Q1 2024',
// 					'Q2 2024',
// 					'Q3 2024',
// 					'Q4 2024',
// 					'Q1 2025',
// 					'Q2 2025',
// 				],
// 				y: {
// 					dtype: 'f8',
// 					bdata: 'ZmZmZmZmN0AzMzMzMzM5QM3MzMzMTDdAMzMzMzOzNkCamZmZmRk3QM3MzMzMzDhAMzMzMzOzN0AAAAAAAIA2QA==',
// 				},
// 				type: 'bar',
// 			},
// 			{
// 				marker: { color: '#29BEFD' },
// 				mode: 'lines+markers',
// 				name: 'Net Income ($B)',
// 				x: [
// 					'Q3 2023',
// 					'Q4 2023',
// 					'Q1 2024',
// 					'Q2 2024',
// 					'Q3 2024',
// 					'Q4 2024',
// 					'Q1 2025',
// 					'Q2 2025',
// 				],
// 				y: {
// 					dtype: 'f8',
// 					bdata: 'mpmZmZmZ\u002fT8fhetRuB4BQOxRuB6F6\u002fk\u002fZmZmZmZm9j+amZmZmZn1P9ejcD0K1\u002fc\u002fH4XrUbge9T+4HoXrUbjyPw==',
// 				},
// 				yaxis: 'y2',
// 				type: 'scatter',
// 			},
// 		],
// 		layout: {
// 			template: {
// 				data: {
// 					histogram2dcontour: [
// 						{
// 							type: 'histogram2dcontour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					choropleth: [{ type: 'choropleth', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					histogram2d: [
// 						{
// 							type: 'histogram2d',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					heatmap: [
// 						{
// 							type: 'heatmap',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					contourcarpet: [
// 						{ type: 'contourcarpet', colorbar: { outlinewidth: 0, ticks: '' } },
// 					],
// 					contour: [
// 						{
// 							type: 'contour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					surface: [
// 						{
// 							type: 'surface',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					mesh3d: [{ type: 'mesh3d', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					scatter: [
// 						{
// 							fillpattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							type: 'scatter',
// 						},
// 					],
// 					parcoords: [
// 						{ type: 'parcoords', line: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatterpolargl: [
// 						{
// 							type: 'scatterpolargl',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					bar: [
// 						{
// 							error_x: { color: '#2a3f5f' },
// 							error_y: { color: '#2a3f5f' },
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'bar',
// 						},
// 					],
// 					scattergeo: [
// 						{
// 							type: 'scattergeo',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterpolar: [
// 						{
// 							type: 'scatterpolar',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					histogram: [
// 						{
// 							marker: { pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 } },
// 							type: 'histogram',
// 						},
// 					],
// 					scattergl: [
// 						{ type: 'scattergl', marker: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatter3d: [
// 						{
// 							type: 'scatter3d',
// 							line: { colorbar: { outlinewidth: 0, ticks: '' } },
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermap: [
// 						{
// 							type: 'scattermap',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermapbox: [
// 						{
// 							type: 'scattermapbox',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterternary: [
// 						{
// 							type: 'scatterternary',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattercarpet: [
// 						{
// 							type: 'scattercarpet',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					carpet: [
// 						{
// 							aaxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							baxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							type: 'carpet',
// 						},
// 					],
// 					table: [
// 						{
// 							cells: { fill: { color: '#EBF0F8' }, line: { color: 'white' } },
// 							header: { fill: { color: '#C8D4E3' }, line: { color: 'white' } },
// 							type: 'table',
// 						},
// 					],
// 					barpolar: [
// 						{
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'barpolar',
// 						},
// 					],
// 					pie: [{ automargin: true, type: 'pie' }],
// 				},
// 				layout: {
// 					autotypenumbers: 'strict',
// 					colorway: [
// 						'#636efa',
// 						'#EF553B',
// 						'#00cc96',
// 						'#ab63fa',
// 						'#FFA15A',
// 						'#19d3f3',
// 						'#FF6692',
// 						'#B6E880',
// 						'#FF97FF',
// 						'#FECB52',
// 					],
// 					font: { color: '#2a3f5f' },
// 					hovermode: 'closest',
// 					hoverlabel: { align: 'left' },
// 					paper_bgcolor: 'white',
// 					plot_bgcolor: '#E5ECF6',
// 					polar: {
// 						bgcolor: '#E5ECF6',
// 						angularaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						radialaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					ternary: {
// 						bgcolor: '#E5ECF6',
// 						aaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						baxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						caxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
// 					colorscale: {
// 						sequential: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						sequentialminus: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						diverging: [
// 							[0, '#8e0152'],
// 							[0.1, '#c51b7d'],
// 							[0.2, '#de77ae'],
// 							[0.3, '#f1b6da'],
// 							[0.4, '#fde0ef'],
// 							[0.5, '#f7f7f7'],
// 							[0.6, '#e6f5d0'],
// 							[0.7, '#b8e186'],
// 							[0.8, '#7fbc41'],
// 							[0.9, '#4d9221'],
// 							[1, '#276419'],
// 						],
// 					},
// 					xaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					yaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					scene: {
// 						xaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						yaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						zaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 					},
// 					shapedefaults: { line: { color: '#2a3f5f' } },
// 					annotationdefaults: { arrowcolor: '#2a3f5f', arrowhead: 0, arrowwidth: 1 },
// 					geo: {
// 						bgcolor: 'white',
// 						landcolor: '#E5ECF6',
// 						subunitcolor: 'white',
// 						showland: true,
// 						showlakes: true,
// 						lakecolor: 'white',
// 					},
// 					title: { x: 0.05 },
// 					mapbox: { style: 'light' },
// 				},
// 			},
// 			yaxis: { title: { text: 'Revenue ($B)' }, side: 'left' },
// 			yaxis2: { title: { text: 'Net Income ($B)' }, overlaying: 'y', side: 'right' },
// 			legend: { x: 0.01, y: 0.99 },
// 			title: { text: 'Tesla Quarterly Revenue and Net Income' },
// 			xaxis: { title: { text: 'Quarter' } },
// 		},
// 	},
// 	{
// 		data: [
// 			{
// 				marker: { color: '#29BEFD' },
// 				mode: 'lines+markers',
// 				name: 'Automotive Revenue',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'kExsUlhNvE0sTA==' },
// 				type: 'scatter',
// 			},
// 			{
// 				marker: { color: '#78D64B' },
// 				mode: 'lines+markers',
// 				name: 'Energy Revenue',
// 				x: ['Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024'],
// 				y: { dtype: 'i2', bdata: 'CAfQBzQI\u002fAjECQ==' },
// 				type: 'scatter',
// 			},
// 		],
// 		layout: {
// 			template: {
// 				data: {
// 					histogram2dcontour: [
// 						{
// 							type: 'histogram2dcontour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					choropleth: [{ type: 'choropleth', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					histogram2d: [
// 						{
// 							type: 'histogram2d',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					heatmap: [
// 						{
// 							type: 'heatmap',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					contourcarpet: [
// 						{ type: 'contourcarpet', colorbar: { outlinewidth: 0, ticks: '' } },
// 					],
// 					contour: [
// 						{
// 							type: 'contour',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					surface: [
// 						{
// 							type: 'surface',
// 							colorbar: { outlinewidth: 0, ticks: '' },
// 							colorscale: [
// 								[0.0, '#0d0887'],
// 								[0.1111111111111111, '#46039f'],
// 								[0.2222222222222222, '#7201a8'],
// 								[0.3333333333333333, '#9c179e'],
// 								[0.4444444444444444, '#bd3786'],
// 								[0.5555555555555556, '#d8576b'],
// 								[0.6666666666666666, '#ed7953'],
// 								[0.7777777777777778, '#fb9f3a'],
// 								[0.8888888888888888, '#fdca26'],
// 								[1.0, '#f0f921'],
// 							],
// 						},
// 					],
// 					mesh3d: [{ type: 'mesh3d', colorbar: { outlinewidth: 0, ticks: '' } }],
// 					scatter: [
// 						{
// 							fillpattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							type: 'scatter',
// 						},
// 					],
// 					parcoords: [
// 						{ type: 'parcoords', line: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatterpolargl: [
// 						{
// 							type: 'scatterpolargl',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					bar: [
// 						{
// 							error_x: { color: '#2a3f5f' },
// 							error_y: { color: '#2a3f5f' },
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'bar',
// 						},
// 					],
// 					scattergeo: [
// 						{
// 							type: 'scattergeo',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterpolar: [
// 						{
// 							type: 'scatterpolar',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					histogram: [
// 						{
// 							marker: { pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 } },
// 							type: 'histogram',
// 						},
// 					],
// 					scattergl: [
// 						{ type: 'scattergl', marker: { colorbar: { outlinewidth: 0, ticks: '' } } },
// 					],
// 					scatter3d: [
// 						{
// 							type: 'scatter3d',
// 							line: { colorbar: { outlinewidth: 0, ticks: '' } },
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermap: [
// 						{
// 							type: 'scattermap',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattermapbox: [
// 						{
// 							type: 'scattermapbox',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scatterternary: [
// 						{
// 							type: 'scatterternary',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					scattercarpet: [
// 						{
// 							type: 'scattercarpet',
// 							marker: { colorbar: { outlinewidth: 0, ticks: '' } },
// 						},
// 					],
// 					carpet: [
// 						{
// 							aaxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							baxis: {
// 								endlinecolor: '#2a3f5f',
// 								gridcolor: 'white',
// 								linecolor: 'white',
// 								minorgridcolor: 'white',
// 								startlinecolor: '#2a3f5f',
// 							},
// 							type: 'carpet',
// 						},
// 					],
// 					table: [
// 						{
// 							cells: { fill: { color: '#EBF0F8' }, line: { color: 'white' } },
// 							header: { fill: { color: '#C8D4E3' }, line: { color: 'white' } },
// 							type: 'table',
// 						},
// 					],
// 					barpolar: [
// 						{
// 							marker: {
// 								line: { color: '#E5ECF6', width: 0.5 },
// 								pattern: { fillmode: 'overlay', size: 10, solidity: 0.2 },
// 							},
// 							type: 'barpolar',
// 						},
// 					],
// 					pie: [{ automargin: true, type: 'pie' }],
// 				},
// 				layout: {
// 					autotypenumbers: 'strict',
// 					colorway: [
// 						'#636efa',
// 						'#EF553B',
// 						'#00cc96',
// 						'#ab63fa',
// 						'#FFA15A',
// 						'#19d3f3',
// 						'#FF6692',
// 						'#B6E880',
// 						'#FF97FF',
// 						'#FECB52',
// 					],
// 					font: { color: '#2a3f5f' },
// 					hovermode: 'closest',
// 					hoverlabel: { align: 'left' },
// 					paper_bgcolor: 'white',
// 					plot_bgcolor: '#E5ECF6',
// 					polar: {
// 						bgcolor: '#E5ECF6',
// 						angularaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						radialaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					ternary: {
// 						bgcolor: '#E5ECF6',
// 						aaxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						baxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 						caxis: { gridcolor: 'white', linecolor: 'white', ticks: '' },
// 					},
// 					coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
// 					colorscale: {
// 						sequential: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						sequentialminus: [
// 							[0.0, '#0d0887'],
// 							[0.1111111111111111, '#46039f'],
// 							[0.2222222222222222, '#7201a8'],
// 							[0.3333333333333333, '#9c179e'],
// 							[0.4444444444444444, '#bd3786'],
// 							[0.5555555555555556, '#d8576b'],
// 							[0.6666666666666666, '#ed7953'],
// 							[0.7777777777777778, '#fb9f3a'],
// 							[0.8888888888888888, '#fdca26'],
// 							[1.0, '#f0f921'],
// 						],
// 						diverging: [
// 							[0, '#8e0152'],
// 							[0.1, '#c51b7d'],
// 							[0.2, '#de77ae'],
// 							[0.3, '#f1b6da'],
// 							[0.4, '#fde0ef'],
// 							[0.5, '#f7f7f7'],
// 							[0.6, '#e6f5d0'],
// 							[0.7, '#b8e186'],
// 							[0.8, '#7fbc41'],
// 							[0.9, '#4d9221'],
// 							[1, '#276419'],
// 						],
// 					},
// 					xaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					yaxis: {
// 						gridcolor: 'white',
// 						linecolor: 'white',
// 						ticks: '',
// 						title: { standoff: 15 },
// 						zerolinecolor: 'white',
// 						automargin: true,
// 						zerolinewidth: 2,
// 					},
// 					scene: {
// 						xaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						yaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 						zaxis: {
// 							backgroundcolor: '#E5ECF6',
// 							gridcolor: 'white',
// 							linecolor: 'white',
// 							showbackground: true,
// 							ticks: '',
// 							zerolinecolor: 'white',
// 							gridwidth: 2,
// 						},
// 					},
// 					shapedefaults: { line: { color: '#2a3f5f' } },
// 					annotationdefaults: { arrowcolor: '#2a3f5f', arrowhead: 0, arrowwidth: 1 },
// 					geo: {
// 						bgcolor: 'white',
// 						landcolor: '#E5ECF6',
// 						subunitcolor: 'white',
// 						showland: true,
// 						showlakes: true,
// 						lakecolor: 'white',
// 					},
// 					title: { x: 0.05 },
// 					mapbox: { style: 'light' },
// 				},
// 			},
// 			legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, xanchor: 'right', x: 1 },
// 			title: { text: 'Automotive vs Energy Revenue' },
// 		},
// 	},
// ];
const updatePlotData = (plotData, theme = 'dark') => {
	const primaryFont = theme === 'dark' ? '#f2f2f3' : '#18181b';
	const stroke = theme === 'dark' ? '#2c2d2e' : '#e3e3e3';
	const secondaryFont = theme === 'dark' ? '#94989e' : '#7f858f';
	const backgroundColor = theme === 'dark' ? '#121212' : '#fff';

	const data = plotData?.data ?? [];
	const layout = plotData?.layout ?? {};
	const template = layout?.template ?? {};
	const templateLayout = template?.layout ?? {};

	data?.forEach((item) => {
		item.hoverlabel = {
			bgcolor: backgroundColor,
			bordercolor: stroke,
			font: { color: primaryFont, size: 13 },
			align: 'left',
		};
		item.marker = { ...(item.marker || {}), line: { width: 0.5 } };
	});

	if (layout.width) {
		delete layout.width;
	}

	if (layout.height) {
		delete layout.height;
	}

	layout.title = {
		text: layout?.title?.text ?? '',
		font: { size: 15, weight: 500, color: primaryFont },
	};

	layout.xaxis = {
		...(layout.xaxis || {}),
		title: {
			...(layout.xaxis?.title || {}),
			font: { size: 10, color: secondaryFont },
		},
		ticklabelstandoff: 10,
	};

	layout.yaxis = {
		...(layout.yaxis || {}),
		title: {
			...(layout.yaxis?.title || {}),
			font: { size: 10, color: secondaryFont },
		},
		ticklabelstandoff: 10,
	};

	layout.xaxis2 = {
		...(layout.xaxis2 || {}),
		title: {
			...(layout.xaxis2?.title || {}),
			font: { size: 10, color: secondaryFont },
		},
		ticklabelstandoff: 10,
	};

	layout.yaxis2 = {
		...(layout.yaxis2 || {}),
		title: {
			...(layout.yaxis2?.title || {}),
			font: { size: 10, color: secondaryFont },
		},
		ticklabelstandoff: 10,
		showgrid: false,
	};

	layout.legend = {
		...(layout.legend || {}),
		font: { size: 10, color: secondaryFont },
		bgcolor: backgroundColor,
		orientation: 'h',
	};

	layout.bargap = 0.2;
	layout.bargroupgap = 0.15;

	templateLayout.font = {
		color: primaryFont,
		family: 'FKGroteskNeue, GeneralSans, Arial, Segoe UI, Helvetica, Apple, "Courier New", Consolas, monospace',
	};

	templateLayout.paper_bgcolor = 'transparent';
	templateLayout.plot_bgcolor = 'transparent';

	templateLayout.xaxis = {
		...(templateLayout.xaxis || {}),
		gridcolor: stroke,
		linecolor: stroke,
		ticks: '',
		title: { standoff: 15 },
		zerolinecolor: stroke,
		showgrid: false,
		automargin: true,
		zerolinewidth: 1,
		tickfont: { size: 10, color: secondaryFont },
	};

	templateLayout.yaxis = {
		...(templateLayout.yaxis || {}),
		gridcolor: stroke,
		linecolor: stroke,
		ticks: '',
		title: { standoff: 15 },
		zerolinecolor: stroke,
		automargin: true,
		zerolinewidth: 1,
		tickfont: { size: 10, color: secondaryFont },
	};

	return {
		data,
		layout,
	};
};

const Plotly = ({ attachmentId = null, plotly = [] }) => {
	const {
		themeInfo: { theme },
	} = useContext(Context);

	const [info, setInfo] = useState({ plotData: null });

	useLayoutEffect(() => {
		if (plotly?.length > 0) {
			const index = plotly?.findIndex((item) => item?.attachmentId === attachmentId);

			if (index !== -1) {
				const data = plotly[index]?.data || {};
				const updatedData = updatePlotData(data, theme);
				setInfo((prev) => ({
					...prev,
					plotData: updatedData,
				}));
			}
		}
	}, [plotly, attachmentId]);

	return (
		<div className={s.plotlyContainer}>
			{info?.plotData ? (
				<Plot
					plotly={Plotlyy}
					data={info?.plotData?.data}
					layout={info?.plotData?.layout}
					config={{
						responsive: true,
						displaylogo: false,
						showTips: false,
						modeBarButtonsToRemove: [
							'zoom2d',
							'pan2d',
							'select2d',
							'lasso2d',
							'toImage',
							'zoomOut2d',
							'autoScale2d',
							'resetScale2d',
							'zoomIn2d',
						],
					}}
					useResizeHandler={true}
					style={{
						width: '100%',
						aspectRatio: '4/3',
						backgroundColor: 'transparent',
					}}
				/>
			) : null}
		</div>
	);
};

export default memo(Plotly);
