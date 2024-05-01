import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import PropTypes from 'prop-types';
import {Box, Chip, Divider, Input, Stack, TextField, Typography} from '@mui/material';
// @ts-ignore
import { Search as SearchIcon } from '/src/icons/search';
// @ts-ignore
import { MultiSelect } from '/src/components/multi-select';
import {DatePicker} from "@mui/lab";

export interface Filters {
	name?: string;
	category: string[];
	status: string[];
	inStock?: boolean;
	startDate?: Date;
	endDate?: Date;
	type: string[];
}

interface StyleListFiltersProps {
	filters?: Filters;
	onChange?: (filters: Filters) => void;
}

interface FilterItem {
	label: string;
	field: 'name' | 'category' | 'status' | 'inStock' | 'type' ;
	value: unknown;
	displayValue?: unknown;
}

const categoryOptions = [
	{
		label: 'Healthcare',
		value: 'healthcare'
	},
	{
		label: 'Makeup',
		value: 'makeup'
	},
	{
		label: 'Dress',
		value: 'dress'
	},
	{
		label: 'Skincare',
		value: 'skincare'
	},
	{
		label: 'Jewelry',
		value: 'jewelry'
	},
	{
		label: 'Blouse',
		value: 'blouse'
	}
];

const statusOptions = [
	{
		label: 'Published',
		value: 'published'
	},
	{
		label: 'Draft',
		value: 'draft'
	}
];

const stockOptions = [
	{
		label: 'All',
		value: 'all'
	},
	{
		label: 'Available',
		value: 'available'
	},
	{
		label: 'Out of Stock',
		value: 'outOfStock'
	}
];

const typeOptions = [
	{
		label: 'Healthcare',
		value: 'healthcare'
	},
	{
		label: 'Makeup',
		value: 'makeup'
	},
	{
		label: 'Dress',
		value: 'dress'
	},
	{
		label: 'Skincare',
		value: 'skincare'
	},
	{
		label: 'Jewelry',
		value: 'jewelry'
	},
	{
		label: 'Blouse',
		value: 'blouse'
	}
];

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
const useUpdateEffect = (effect, dependencies = []) => {
	const isInitialMount = useRef(true);

	useEffect(
		() => {
			if (isInitialMount.current) {
				isInitialMount.current = false;
			} else {
				return effect();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		dependencies
	);
};

export const StyleListFilters: FC<StyleListFiltersProps> = (props) => {
	const { onChange, filters, ...other } = props;
	const [queryValue, setQueryValue] = useState<string>('');
	const [filterItems, setFilterItems] = useState<FilterItem[]>([]);

	useUpdateEffect(
		() => {
			const filter = {
				name: undefined,
				category: [],
				status: [],
				inStock: undefined,
				type: []
			};

			// Transform the filter items in an object that can be used by the parent component to call the
			// serve with the updated filters
			filterItems.forEach((filterItem) => {
				switch (filterItem.field) {
					case 'name':
						// There will (or should) be only one filter item with field "name"
						// so we can setup it directly
						filter.name = filterItem.value;
						break;
					case 'category':
						filter.category.push(filterItem.value);
						break;
					case 'status':
						filter.status.push(filterItem.value);
						break;
					case 'inStock':
						// The value can be "available" or "outOfStock" and we transform it to a boolean
						filter.inStock = filterItem.value === 'available';
						break;
					case 'type':
						filter.type.push(filterItem.value);
						break;
					default:
						break;
				}
			});

			onChange?.(filter);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[filterItems]
	);

	const handleDelete = (filterItem: FilterItem): void => {
		setFilterItems((prevState) => prevState.filter((_filterItem) => {
			return !(filterItem.field === _filterItem.field && filterItem.value === _filterItem.value);
		}));
	};

	const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setQueryValue(event.target.value);
	};

	const handleQueryKeyup = (event: KeyboardEvent<HTMLInputElement>): void => {
		if (event.code === 'Enter' && queryValue) {
			// We only allow one chip for the name field

			const filterItem = filterItems.find((filterItem) => filterItem.field === 'name');

			if (filterItem) {
				setFilterItems((prevState => prevState.map((filterItem) => {
					if (filterItem.field === 'name') {
						return {
							...filterItem,
							value: queryValue
						};
					}

					return filterItem;
				})));
			} else {
				setFilterItems((prevState) => [
					...prevState,
					{
						label: 'Name',
						field: 'name',
						value: queryValue
					}
				]);
			}

			setQueryValue('');
		}
	};

	const handleCategoryChange = (values: unknown[]): void => {
		setFilterItems((prevState) => {
			const valuesFound = [];

			// First cleanup the previous filter items
			const newFilterItems = prevState.filter((filterItem) => {
				if (filterItem.field !== 'category') {
					return true;
				}

				const found = values.includes(filterItem.value);

				if (found) {
					valuesFound.push(filterItem.value);
				}

				return found;
			});

			// Nothing changed
			if (values.length === valuesFound.length) {
				return newFilterItems;
			}

			values.forEach((value) => {
				if (!valuesFound.includes(value)) {
					const option = categoryOptions.find((option) => option.value === value);

					newFilterItems.push({
						label: 'Category',
						field: 'category',
						value,
						displayValue: option.label
					});
				}
			});

			return newFilterItems;
		});
	};

	const handleStatusChange = (values: unknown[]): void => {
		setFilterItems((prevState) => {
			const valuesFound = [];

			// First cleanup the previous filter items
			const newFilterItems = prevState.filter((filterItem) => {
				if (filterItem.field !== 'status') {
					return true;
				}

				const found = values.includes(filterItem.value);

				if (found) {
					valuesFound.push(filterItem.value);
				}

				return found;
			});

			// Nothing changed
			if (values.length === valuesFound.length) {
				return newFilterItems;
			}

			values.forEach((value) => {
				if (!valuesFound.includes(value)) {
					const option = statusOptions.find((option) => option.value === value);

					newFilterItems.push({
						label: 'Status',
						field: 'status',
						value,
						displayValue: option.label
					});
				}
			});

			return newFilterItems;
		});
	};

	const handleStockChange = (values: unknown[]): void => {
		// Stock can only have one value, even if displayed as multi-select, so we select the first one.
		// This example allows you to select one value or "All", which is not included in the
		// rest of multi-selects.

		setFilterItems((prevState) => {
			// First cleanup the previous filter items
			const newFilterItems = prevState.filter((filterItem) => filterItem.field !== 'inStock');
			const latestValue = values[values.length - 1];

			switch (latestValue) {
				case 'available':
					newFilterItems.push({
						label: 'Stock',
						field: 'inStock',
						value: 'available',
						displayValue: 'Available'
					});
					break;
				case 'outOfStock':
					newFilterItems.push({
						label: 'Stock',
						field: 'inStock',
						value: 'outOfStock',
						displayValue: 'Out of Stock'
					});
					break;
				default:
					// Should be "all", so we do not add this filter
					break;
			}

			return newFilterItems;
		});
	};

	const handleTypeChange = (values: unknown[]): void => {
		setFilterItems((prevState) => {
			const valuesFound = [];

			// First cleanup the previous filter items
			const newFilterItems = prevState.filter((filterItem) => {
				if (filterItem.field !== 'type') {
					return true;
				}

				const found = values.includes(filterItem.value);

				if (found) {
					valuesFound.push(filterItem.value);
				}

				return found;
			});

			// Nothing changed
			if (values.length === valuesFound.length) {
				return newFilterItems;
			}

			values.forEach((value) => {
				if (!valuesFound.includes(value)) {
					const option = typeOptions.find((option) => option.value === value);

					newFilterItems.push({
						label: 'Type',
						field: 'type',
						value,
						displayValue: option.label
					});
				}
			});

			return newFilterItems;
		});
	};

	// We memoize this part to prevent re-render issues
	const categoryValues = useMemo(
		() => filterItems
			.filter((filterItems) => filterItems.field === 'category')
			.map((filterItems) => filterItems.value),
		[filterItems]
	);

	const statusValues = useMemo(
		() => filterItems
			.filter((filterItems) => filterItems.field === 'status')
			.map((filterItems) => filterItems.value),
		[filterItems]
	);

	const stockValues = useMemo(
		() => {
			const values = filterItems
				.filter((filterItems) => filterItems.field === 'inStock')
				.map((filterItems) => filterItems.value);

			// Since we do not display the "all" as chip, we add it to the multi-select as a selected value
			if (values.length === 0) {
				values.unshift('all');
			}

			return values;
		},
		[filterItems]
	);

	const typeValues = useMemo(
		() => filterItems
			.filter((filterItems) => filterItems.field === 'type')
			.map((filterItems) => filterItems.value),
		[filterItems]
	);

	const handleStartDateChange = (date: Date | null): void => {
		const newFilters = {
			...filters,
			startDate: date
		};

		// Prevent end date to be before start date
		if (newFilters.endDate && date > newFilters.endDate) {
			newFilters.endDate = date;
		}

		onChange?.(newFilters);
	};

	const handleEndDateChange = (date: Date | null): void => {
		const newFilters = {
			...filters,
			endDate: date
		};

		// Prevent start date to be after end date
		if (newFilters.startDate && date < newFilters.startDate) {
			newFilters.startDate = date;
		}

		onChange?.(newFilters);
	};

	return (
		<div {...other}>
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
					flexWrap: 'wrap',
					p: 1
				}}
			>
				<MultiSelect
					label="Category"
					onChange={(value) => handleCategoryChange(value)}
					options={categoryOptions}
					value={categoryValues}
				/>
				<MultiSelect
					label="스타일취향"
					onChange={(value) => handleStatusChange(value)}
					options={statusOptions}
					value={statusValues}
				/>
				<MultiSelect
					label="TPO"
					onChange={(value) => handleStockChange(value)}
					options={stockOptions}
					value={stockValues}
				/>
				<MultiSelect
					label="등록유형"
					onChange={(value) => handleTypeChange(value)}
					options={typeOptions}
					value={typeValues}
				/>
				<Box
					style={{ margin: '10px' }}
				>
					<DatePicker
						inputFormat="dd/MM/yyyy"
						label="From"
						onChange={handleStartDateChange}
						renderInput={(inputProps) => <TextField {...inputProps} />}
						value={filters.startDate}
					/>
					<DatePicker
						inputFormat="dd/MM/yyyy"
						label="To"
						onChange={handleEndDateChange}
						renderInput={(inputProps) => <TextField {...inputProps} />}
						value={filters.endDate}
					/>
				</Box>
			</Box>
			<Divider />
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
					p: 2
				}}
			>
				<SearchIcon fontSize="small" />
				<Box
					sx={{
						flexGrow: 1,
						ml: 3
					}}
				>
					<Input
						disableUnderline
						fullWidth
						onChange={handleQueryChange}
						onKeyUp={handleQueryKeyup}
						placeholder="스타일 ID를 입력하세요"
						value={queryValue}
					/>
				</Box>
			</Box>
			<Divider />
			{
				filterItems.length > 0
					? (
						<Box
							sx={{
								alignItems: 'center',
								display: 'flex',
								flexWrap: 'wrap',
								p: 2
							}}
						>
							{filterItems.map((filterItem, i) => (
								<Chip
									key={i}
									label={(
										<Box
											sx={{
												alignItems: 'center',
												display: 'flex',
												'& span': {
													fontWeight: 600
												}
											}}
										>
                  <span>
                    {filterItem.label}
                  </span>
											:
											{' '}
											{filterItem.displayValue || filterItem.value}
										</Box>
									)}
									onDelete={(): void => handleDelete(filterItem)}
									sx={{ m: 1 }}
									variant="outlined"
								/>
							))}
						</Box>
					)
					: (
						<Box sx={{ p: 3 }}>
							<Typography
								color="textSecondary"
								variant="subtitle2"
							>
								No filters applied
							</Typography>
						</Box>
					)
			}
		</div>
	);
};

StyleListFilters.propTypes = {
	// @ts-ignore
	filters: PropTypes.object,
	onChange: PropTypes.func
};
