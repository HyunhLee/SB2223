import React, {ChangeEvent, Fragment, MouseEvent, useContext, useEffect, useState} from "react";
import {DataContext} from "../../../contexts/data-context";
import {productApi} from "../../../api/product-api";
import {format} from "date-fns";
import {getDataContextValue, getDate} from "../../../utils/data-convert";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    IconButtonProps,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import _ from "lodash";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {Scrollbar} from "../../scrollbar";
import {ImageInListWidget} from "../../widgets/image-widget";
import {styled} from "@mui/material/styles";
import {defaultSearch, Search} from "../../../types/home-app-model/mds-pick";
import {CategoryDialog, ColorDialog, PatternDialog} from "../../dialog/category-dialog";


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


const FittingRoomItemsList = (props) => {
    const { setSelectedItems, selectedItems, selectedTemp, setSelectedTemp} = props;
    const dataContext = useContext(DataContext);
    const [expanded, setExpanded] = useState(false);
    const [search, setSearch] = useState<Search>(defaultSearch)
    const [products, setProducts] = useState<any>([])
    const [count, setCount] = useState(0)
    const [selectedAllLists, setSelectedAllLists] = useState(false)
    const [open, setOpen] = useState(false)
    const [openColor, setOpenColor] = useState(false)
    const [openPattern, setOpenPattern] = useState(false)
    const [disabledBtn, setDisabledBtn] = useState(true)
    const [requestList, setRequestList] = useState<boolean>(true);

    const getItemsList = async (search) => {
        const result = await productApi.getProducts(search)
        setProducts(result.lists)
        setCount(result.count)
    }

    useEffect(() => {
        setDisabledBtn(false)
    },[search])

    useEffect(() => {
        (async () => {
            if (requestList) {
                await getItemsList(search);
                setRequestList(false);
            }
        })()
    },[requestList])

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const addItems = (event, value) => {
        setSelectedAllLists(false)
            if (!selectedItems.includes(value) && !selectedTemp.includes(value)) {
                setSelectedItems((prev) => [...prev, {fitOrder: selectedItems.length - 1, product: value}])
            }else {
                setSelectedItems((prev) => prev.filter((v) => v.product !== value))
            }

            if(!selectedTemp.includes(value)){
                setSelectedTemp((prev) => [...prev, value])
            }else{
                setSelectedTemp((prev) => prev.filter((v) => v !== value))
            }
    }



    const handleChange = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>)  : void  => {
            setSearch({ ...search, [prop]: event.target.value });
        };

    const changeDisplayStatus = (value) => {
        setSearch(prevData => ({
            ...prevData,
            displayStatus: value
        }))
    }

    const changeRegistrationType = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            registrationType: value
        }))
    }

    const changeFitRequestStatus = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            fitRequestStatus: value
        }))
    }

    const handleChangeDate =
        (prop: keyof Search) => (value) => {
            setSearch({ ...search, [prop]: format(value, 'yyyy-MM-dd') });
        };

    const handleClickOpen = (value) => {
        if(value === 'category'){
            setOpen(true);
        }else if(value ==='color'){
            setOpenColor(true);
        }else if(value ==='pattern'){
            setOpenPattern(true)
        }

    };

    const handleCloseCategory = (value) : void => {
        if (value) {
            setSearch({
                ...search,
                categoryId: value.id,
                categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpen(false);
    };

    const handleClickClearCategory = (prop) : void => {
        setSearch({ ...search,
            categoryId: '',
            categoryName: ''
        });
    };

    const getBrandId = () => {
        return (search.brandId) ? search.brandId : '';
    }

    const changeBrandNameHandler = (changeValues) => {
        setSearch(prevData => ({
            ...prevData,
            brandId: changeValues
        }))
    }

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const getFitRequestStatus = () => {
        return (search.fitRequestStatus) ? search.fitRequestStatus : '';
    }

    const getDisplayStatus = () => {
        return (search.displayStatus) ? search.displayStatus : '';
    }

    const getRegistrationType = () => {
        return (search.registrationType) ? search.registrationType : '';
    }

    const renderTypes = (value) => {
        return Object.keys(dataContext[value]).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext[value][key]}</MenuItem>)
        })
    }

    const renderSeason = () => {
        return Object.keys(dataContext.PRODUCT_SEASON_TYPE).map(key => {
            return (
                <Grid key={key}
                      item
                      xs={6}>
                    <FormControlLabel
                        value={key}
                        control={<Checkbox
                            onChange={e=> {changeSeason(e.target.defaultValue, e.target.checked)}}
                            checked={checkedSeason(key)}
                        />}
                        label={dataContext.PRODUCT_SEASON_TYPE[key]} />
                </Grid>
            )
        });
    }

    const checkedSeason = (season) => {
        if (search.seasonTypes) {
            return search.seasonTypes.includes(season)
        }
        return false;
    }

    const changeSeason = (value: string, checked: boolean): void => {
        let season = []
        if (search.seasonTypes) {
            season = search.seasonTypes.split(',');
        }
        if (checked) {
            season.push(value);
        }
        else {
            _.remove(season, (data) => {
                return data == value;
            });
        }
        setSearch(prevData => ({
            ...prevData,
            seasonTypes: season.join(',')
        }))
    }

    const handleCloseColor = (values) => {
        if (values) {
            setSearch({
                ...search,
                colorTypes: values.map(item => {
                    return item.name;
                }).join(',')
            });
        }
        setOpenColor(false);
    };

    const handleClosePattern = (values) => {
        if (values) {
            setSearch({
                ...search,
                patternTypes: values.map(item => {
                    return item.name;
                }).join(',')
            });
        }
        setOpenPattern(false);
    };

    const handleClickSearch = async () => {
        let query = { ...search, page: 0}
        await getItemsList(query)
    }

    const handleKeyUp = (e) => {
        if(e.key === 'Enter') {
            handleClickSearch()
        }
    }

    const handleClickClear = (prop: keyof Search) => {
        setSearch({ ...search, [prop]: '' });
    };

    const renderDatePicker = ({inputRef, inputProps, InputProps}) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <input ref={inputRef}
                   {...inputProps}
                   readOnly={true}
                   style={{
                       width: 150,
                       height: 40,
                       border: 1,
                       fontSize: 15,
                       outline: 'none'
                   }}/>
            {InputProps?.endAdornment}
        </Box>
    )

    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAllLists(event.target.checked);
        //이미 리스트에 들어가있는 데이터와 중복 방지를 위한 코드
        let selectedArr = [...selectedItems, ...products]
        const Arr = new Set(selectedArr)
        setSelectedItems(event.target.checked
            ? (selectedItems.length > 0) ? [...Arr] : products.map((list) => list)
            : []);
    };

    const onPageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setSearch({
            ...search,
            page: newPage,
        });
        setSelectedAllLists(false)
        setRequestList(true);
    };

    const onRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({
            ...search,
            size: parseInt(event.target.value, 10),
        });
        setRequestList(true);
    };

    return (
        <>
            <Box>
                <Card sx={{py: 0,mb: 1, mt: -2}}>
                    <CardContent sx={{py: 0}}>
                        <Stack direction="row">
                            <Stack>
                                <FormControl sx={{ m: 1, width: '30ch' }}
                                             variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password">카테고리</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        type='text'
                                        value={search.categoryName}
                                        readOnly={true}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={handleClickClearCategory}
                                                >
                                                    <ClearIcon />
                                                </IconButton>
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={() => handleClickOpen('category')}
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Stack>
                            <Stack justifyContent={"center"}
                                   sx={{mr: 1, ml: 2}}>
                                <TextField
                                    label="상품명"
                                    variant="standard"
                                    value={search.nameKo==null?'':search.nameKo}
                                    onChange={handleChange('nameKo')}
                                    onKeyUp={handleKeyUp}
                                    sx={{ m: 1 }}
                                />
                            </Stack>

                            <Stack justifyContent={"center"}
                                   sx={{mr: 1, ml: 2}}>
                                <TextField
                                    label="상품ID"
                                    variant="standard"
                                    value={search.id==null?'':search.id}
                                    onChange={handleChange('id')}
                                    onKeyUp={handleKeyUp}
                                    sx={{ m: 1 }}
                                />
                            </Stack>
                        </Stack>
                        <Stack direction="row">
                            <Stack>
                                <FormControl sx={{ m: 1, width: '30ch' }}
                                             variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password">컬러</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        type='text'
                                        value={search.colorTypes}
                                        onChange={handleChange('colorTypes')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={() => handleClickClear('colorTypes')}
                                                >
                                                    <ClearIcon />
                                                </IconButton>
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={() => handleClickOpen('color')}
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Stack>
                            <Stack>
                                <FormControl sx={{ ml: 3, mt: 1, width: '30ch' }}
                                             variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password">패턴</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        type='text'
                                        value={search.patternTypes}
                                        onChange={handleChange('patternTypes')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={() => handleClickClear('patternTypes')}
                                                >
                                                    <ClearIcon />
                                                </IconButton>
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={() => {handleClickOpen('pattern')}}
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Stack>
                            <Stack justifyContent={"center"}
                                   sx={{mr: 1, ml: 3, mt:1,}}>
                                <FormLabel component="legend">브랜드</FormLabel>
                            </Stack>
                            <Select
                                sx={{minWidth:200, height: 50, mt: 2}}
                                size={"small"}
                                value={getBrandId()}
                                onChange={e=> {changeBrandNameHandler(e.target.value)}}
                            >
                                <MenuItem value={''}>전체</MenuItem>
                                {_.sortBy(dataContext.BRAND, 'name').map((brand) => {
                                    return (
                                        <MenuItem key={brand.id}
                                                  value={brand.id}>{brand.name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Stack>
                        <Collapse in={expanded}
                                  timeout="auto"
                                  unmountOnExit>
                            <Stack direction="row"
                                   sx={{mb: 1, mt:2}}>
                                <Stack direction="row"
sx={{mb: 3}}>
                                    <Stack justifyContent={"center"}
sx={{mr: 2, mt: 2, ml:1}}>
                                        <FormLabel>등록일</FormLabel>
                                    </Stack>
                                    <Stack sx={{mt: 2.5, border: '1px solid #dfdfdf', borderRadius: 1, px: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.startDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleChangeDate('startDate')}
                                                renderInput={renderDatePicker}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                    <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                                        ~
                                    </Stack>
                                    <Stack sx={{mt: 2.5, border: '1px solid #dfdfdf', borderRadius: 1, px: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.expireDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleChangeDate('expireDate')}
                                                renderInput={renderDatePicker}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5, mt:0 }}>
                                    <FormLabel component="legend">제니FIT</FormLabel>
                                </Stack>
                                <Select
                                    sx={{minWidth: 180,height: 48, mt: 2.5}}
                                    size={"small"}
                                    value={getFitRequestStatus()}
                                    onChange={e=> {changeFitRequestStatus(e.target.value)}}
                                >
                                    <MenuItem value={''}>전체</MenuItem>
                                    {renderTypes('FIT_REQUEST_STATUS')}
                                </Select>


                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 3, mt:1}}>
                                    <FormLabel component="legend">생성타입</FormLabel>
                                </Stack>
                                <Select
                                    sx={{minWidth: 200,height: 48, mt: 2.5}}
                                    size={"small"}
                                    value={getRegistrationType()}
                                    onChange={e=> {changeRegistrationType(e.target.value)}}
                                >
                                    <MenuItem value={''}>전체</MenuItem>
                                    {renderTypes('REGISTRATION_TYPE')}
                                </Select>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 3, mt:1}}>
                                    <FormLabel component="legend">진열상태</FormLabel>
                                </Stack>
                                <Select
                                    sx={{minWidth: 180,height: 48, mt: 2.5}}
                                    size={"small"}
                                    value={getDisplayStatus()}
                                    onChange={e=> {changeDisplayStatus(e.target.value)}}
                                >
                                    <MenuItem value={''}>전체</MenuItem>
                                    {renderTypes('DISPLAY_STATUS')}
                                </Select>
                            </Stack>
                            <Stack direction="row">
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 1}}>
                                    <FormLabel component="legend">시즌</FormLabel>
                                </Stack>
                                <Stack direction="row"
                                       justifyContent={"space-between"}>
                                    {renderSeason()}
                                </Stack>
                            </Stack>
                        </Collapse>
                        <Stack direction="row"
                               justifyContent={"flex-end"}>
                            <ExpandMore expand={expanded}
                                        aria-expanded={expanded}
                                        sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                        onClick={handleExpandClick}>
                                <ExpandMoreOutlinedIcon />
                            </ExpandMore >
                            <Button size='small'
                                    variant="outlined"
                                    sx={{mr: 1}}
                                    onClick={handleClickReset}>
                                초기화
                            </Button>
                            <Button size='small'
                                    color="primary"
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    disabled={disabledBtn}
                                    onClick={handleClickSearch}>
                                검색
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
            <Stack sx={{mb:60}}>
                <Scrollbar sx={{height: expanded ? '280px' : '440px'}}>
                    <Stack sx={{justifyContent: 'space-between'}}
                           direction={'row'}>
                        <Grid sx={{m: 1, display: 'flex', alignItems: 'center'}}>
                            <Typography variant={'h6'}>총 {count} 건</Typography>
                        </Grid>
                        <TablePagination
                            component="div"
                            count={count}
                            onPageChange={onPageChange}
                            onRowsPerPageChange={onRowsPerPageChange}
                            page={search.page}
                            rowsPerPage={search.size}
                            rowsPerPageOptions={[10, 25, 50]}
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                    <Table sx={{ minWidth: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedAllLists}
                                        onChange={handleSelectAllLists}
                                    />
                                </TableCell>
                                <TableCell align='center'>
                                    이미지
                                </TableCell>
                                <TableCell align='center'>
                                    상품ID
                                </TableCell>
                                <TableCell align='center'>
                                    상품명
                                </TableCell>
                                <TableCell align='center'>
                                    브랜드
                                </TableCell>
                                <TableCell align='center'>
                                    카테고리
                                </TableCell>
                                <TableCell align='center'>
                                    컬러
                                </TableCell>
                                <TableCell align='center'>
                                    패턴
                                </TableCell>
                                <TableCell align='center'>
                                    제니FIT
                                </TableCell>
                                <TableCell align='center'>
                                    진열상태
                                </TableCell>
                                <TableCell align='center'>
                                    생성타입
                                </TableCell>
                                <TableCell align='center'>
                                    등록일
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((item) => {
                                const isListSelected = selectedTemp?.includes(item)
                                return (
                                    <Fragment key={item.id}>
                                        <TableRow
                                            hover
                                            key={item.id}
                                        >
                                            <TableCell
                                                padding="checkbox"
                                                width="25%"
                                            >
                                                <Checkbox
                                                    checked={isListSelected}
                                                    onChange={(event) => addItems(event, item)}
                                                    value={isListSelected}
                                                />
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.imageUrlList.length >= 1 ? <ImageInListWidget imageName={item.imageUrlList[0].imageUrl}
                                                                                                    imageUrl={item.imageUrlList[0].imageUrl} /> : <ImageInListWidget imageName={item.mainImageUrl}
                                                                                                                                                                     imageUrl={item.mainImageUrl} />}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.id}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.nameKo}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {(dataContext.BRAND_MAP[item.brandId]) ? dataContext.BRAND_MAP[item.brandId].nameEn : item.brandId}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.categoryIds.length>0?getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryIds[item.categoryIds.length-1], 'path'):''}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.colorType}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.patternType}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {dataContext.FIT_REQUEST_STATUS[item.fitRequestStatus]}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {dataContext.DISPLAY_STATUS[item.displayStatus]}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {dataContext.REGISTRATION_TYPE[item.registrationType]}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {getDate(item.createdDate)}
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={count}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        page={search.page}
                        rowsPerPage={search.size}
                        rowsPerPageOptions={[10, 25, 50]}
                        showFirstButton
                        showLastButton
                    />
                </Scrollbar>
            </Stack>
            <CategoryDialog
                keepMounted
                open={open}
                onClose={handleCloseCategory}
                category={dataContext.CATEGORY}
                value={search.categoryId}
            />
            <ColorDialog
                keepMounted
                open={openColor}
                onClose={handleCloseColor}
                items={dataContext.COLOR}
                value={search.colorTypes}
                multiple={true}
            />
            <PatternDialog
                keepMounted
                open={openPattern}
                onClose={handleClosePattern}
                items={dataContext.PATTERN}
                value={search.patternTypes}
                multiple={true}
            />
        </>
    )
}

export default FittingRoomItemsList;