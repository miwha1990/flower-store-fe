import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Accordion, AccordionDetails, AccordionSummary, alpha, Box, Button, Checkbox, Divider, FormControlLabel, Paper, Slider, Stack, styled, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router';

import { FiltersResponse } from '@/entities/flowers/FlowersService';
import css from './Filter.module.css';

const StyledPaper = styled(Paper)(({ theme }) => ({
	flexShrink: 0,
	borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
	backdropFilter: 'blur(4px)',
	border: '1px solid',
	borderColor: theme.palette.divider,
	backgroundColor: alpha(theme.palette.background.default, 0.8),
	boxShadow: theme.shadows[1],
}));

export const Filter = ({ filters }: { filters?: FiltersResponse }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [filter, setFilter] = useState<{ priceRange?: [number, number]; color?: string[]; category?: string[] }>({});
	const [sliderValue, setSliderValue] = useState<[number, number]>([20, 100]);

	const handleSliderChange = (_: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			setSliderValue([newValue[0], newValue[1]]);
		}
	};

	const { categories, colors, prices } = filters || {};

	useEffect(() => {
		if (prices) setSliderValue(prices)
	}, [prices])


	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			if (JSON.stringify(sliderValue) !== JSON.stringify(prices)) {
				setFilter((prev) => ({ ...prev, priceRange: sliderValue }));
			}
		}, 300);
		return () => window.clearTimeout(timeoutId);
	}, [sliderValue, prices]);

	// Apply filters from URL parameters
	useEffect(() => {
		const minPriceParam = searchParams.get('minPrice');
		const maxPriceParam = searchParams.get('maxPrice');
		const minPrice = minPriceParam === null ? NaN : Number(minPriceParam);
		const maxPrice = maxPriceParam === null ? NaN : Number(maxPriceParam);
		const hasPriceRange = Number.isFinite(minPrice) && Number.isFinite(maxPrice);
		const nextFilter = {
			category: searchParams.getAll('category'),
			color: searchParams.getAll('color'),
			...(hasPriceRange ? { priceRange: [minPrice, maxPrice] as [number, number] } : {}),
		};

		setFilter(nextFilter);
		if (hasPriceRange) {
			setSliderValue([minPrice, maxPrice]);
		} else if (prices) {
			setSliderValue(prices);
		}
	}, [searchParams, prices]);

	const applyFilter = () => {
		const params = new URLSearchParams(searchParams);
		const activeFilter = { ...filter, priceRange: sliderValue };

		params.delete('color');
		params.delete('category');
		params.delete('minPrice');
		params.delete('maxPrice');

		activeFilter.color?.forEach((value) => params.append('color', value));
		activeFilter.category?.forEach((value) => params.append('category', value));
		if (activeFilter.priceRange) {
			params.set('minPrice', String(activeFilter.priceRange[0]));
			params.set('maxPrice', String(activeFilter.priceRange[1]));
		}

		setSearchParams(params);
	};

	const resetFilter = () => {
		const params = new URLSearchParams(searchParams);
		params.delete('color');
		params.delete('category');
		params.delete('minPrice');
		params.delete('maxPrice');
		setSearchParams(params);
		setFilter({});
		if (prices) setSliderValue(prices);
	};

	return (

		<StyledPaper className={css.filterWrapper}>
			<Typography component="label" variant="h6" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
				Фільтр
			</Typography>
			<Stack direction="row" spacing={2} alignItems="center">
				<Typography variant="body2">Ціна, <br /> грн:</Typography>
				<Stack direction="row" spacing={1} alignItems="center">
					<TextField size="small" label="Від" variant="standard" value={sliderValue[0]} onChange={(e) => setSliderValue([Number(e.target.value), sliderValue[1]])} />
					<TextField size="small" label="До" variant="standard" value={sliderValue[1]} onChange={(e) => setSliderValue([sliderValue[0], Number(e.target.value)])} />
				</Stack>
			</Stack>
			<Box sx={{ px: 1 }}>
				<Slider
					min={(prices || [])[0] || 0}
					max={(prices || [])[1] || 100}
					valueLabelDisplay="auto"
					disableSwap
					value={sliderValue}
					onChange={handleSliderChange}
					aria-label="Price Range"
				/>
			</Box>
			<Divider />
			<Accordion defaultExpanded disableGutters elevation={0} sx={{ background: 'transparent', '&:before': { display: 'none' } }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
					<Typography>Категорія ({categories?.length ?? 0})</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ px: 0, py: 0 }}>
					<Stack>
						{categories?.map(({ id, name, count }) => {
							return (
								<FormControlLabel
									key={id}
									control={
										<Checkbox
											checked={filter.category?.includes(name) ?? false}
											onChange={(event) => {
												setFilter((prev) => {
													const selected = prev.category ?? [];
													return {
														...prev,
														category: event.target.checked
															? [...selected, name]
															: selected.filter((value) => value !== name),
													};
												});
											}}
										/>
									}
									label={`${name} (${count})`}
								/>
							);
						})}
					</Stack>
				</AccordionDetails>
			</Accordion>
			<Divider />
			<Accordion defaultExpanded disableGutters elevation={0} sx={{ background: 'transparent', '&:before': { display: 'none' } }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
					<Typography>Колір ({colors?.length ?? 0})</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ px: 0, py: 0 }}>
					<Stack>
						{colors?.map(({ value, count }) => (
							<FormControlLabel
								key={value}
								control={
									<Checkbox
										checked={filter.color?.includes(value) ?? false}
										onChange={(event) => {
											setFilter((prev) => {
												const selected = prev.color ?? [];
												return {
													...prev,
													color: event.target.checked
														? [...selected, value]
														: selected.filter((item) => item !== value),
												};
											});
										}}
									/>
								}
								label={
									<Stack direction="row" spacing={1} alignItems="center">
										<Box
											role="img"
											aria-label={value}
											title={value}
											sx={{ width: 18, height: 18, backgroundColor: value, border: '1px solid', borderColor: 'divider', borderRadius: 0.5 }}
										/>
										<Typography variant="body2">({count})</Typography>
									</Stack>
								}
							/>
						))}
					</Stack>
				</AccordionDetails>
			</Accordion>
			<Stack direction="row" spacing={1} alignItems="center">
				<Button disabled={!Object.entries(filter).length} variant="contained" onClick={applyFilter}>Застосувати</Button>
				<Button color="error" variant="outlined" onClick={resetFilter}>
					<RefreshIcon />
				</Button>
			</Stack>

		</StyledPaper>

	);
}