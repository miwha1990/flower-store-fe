import RefreshIcon from '@mui/icons-material/Refresh';
import { alpha, Autocomplete, Box, Button, Paper, Slider, Stack, styled, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router';

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

type filterDataType = Partial<{
	priceRange: [number, number];
	color: string[];
	category: string[];
}>
type FilterProps = {
	onFilterChange: (filter: filterDataType) => void;
	filterData?: filterDataType;
};
export const Filter = ({ onFilterChange, filterData = {} }: FilterProps) => {
	const { priceRange, color, category } = filterData;
	const [searchParams, setSearchParams] = useSearchParams();
	const [filter, setFilter] = useState<filterDataType>({});
	const [sliderValue, setSliderValue] = useState<[number, number]>(priceRange || [20, 100]);

	const handleSliderChange = (_: Event, newValue: number | number[]) => {
		if (Array.isArray(newValue)) {
			setSliderValue([newValue[0], newValue[1]]);
		}
	};

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			setFilter((prev) => ({ ...prev, priceRange: sliderValue }));
		}, 300);
		return () => window.clearTimeout(timeoutId);
	}, [sliderValue]);

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
		onFilterChange(activeFilter);
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
					min={20}
					max={100}
					valueLabelDisplay="auto"
					disableSwap
					value={sliderValue}
					onChange={handleSliderChange}
					aria-label="Price Range"
				/>
			</Box>
			<Autocomplete
				size="small"
				disablePortal
				options={category || []}
				fullWidth
				onChange={(_, value) => setFilter((prev) => ({ ...prev, category: value ? [value] : [] }))}
				renderInput={(params) => <TextField {...params} label="Категорія" />}
			/>
			<Autocomplete
				size="small"
				disablePortal
				options={color || []}
				fullWidth
				onChange={(_, value) => setFilter((prev) => ({ ...prev, color: value ? [value] : [] }))}
				renderInput={(params) => <TextField {...params} label="Колір" />}
			/>
			<Stack direction="row" spacing={1} alignItems="center">
				<Button variant="contained" onClick={applyFilter}>Застосувати</Button>
				<Button disabled={!Object.entries(filter).length} color="error" variant="outlined" onClick={() => setFilter(filterData)}>
					<RefreshIcon />
				</Button>
			</Stack>

		</StyledPaper>

	);
}