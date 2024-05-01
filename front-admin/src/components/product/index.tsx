import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  IconButtonProps,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {productApi} from "../../api/product-api";
import type {ProductModel} from "src/types/product-model";
import {ProductList} from "./product-list";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {styled} from "@mui/material/styles";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {CategoryDialog, ColorDialog, PatternDialog} from "../dialog/category-dialog";
import {getDataContextValue} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import {BrandDialog} from "../dialog/brand-dialog";

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

interface Search {
  categoryId: number;
  categoryName: string;
  colorType: string;
  colorTypes: string;
  patternType: string;
  brandId: number;
  nameKo: string;
  name: string;
  registrationType: string;
  displayStatus: string;
  startDate?: Date;
  endDate?: Date;
}

const Product = (props) => {
  const { categoryId, changeSelectedList, lookbookImage, onClickApply } = props;

  const dataContext = useContext(DataContext);

  const [lists, setLists] = useState<ProductModel[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);

  const [selectedLists, setSelectedLists] = useState<ProductModel[]>([]);
  const [search, setSearch] = useState<Search>({
    categoryId: categoryId,
    categoryName: '',
    colorType: '',
    colorTypes: '',
    patternType: '',
    brandId: null,
    nameKo: '',
    name: '',
    registrationType: '',
    displayStatus: '',
    startDate: null,
    endDate: null,
  });
  const [expanded, setExpanded] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [patternOpen, setPatternOpen] = React.useState(false);
  const [colorOpen, setColorOpen] = React.useState(false);
  const [brandOpen, setBrandOpen] = React.useState(false);
  const [requestList, setRequestList] = useState<boolean>(false);

  const handleChange =
    (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearch({ ...search, [prop]: event.target.value });
    };

  const handleChangeDate =
    (prop: keyof Search) => (value) => {
      setSearch({ ...search, [prop]: value });
    };

  const handleClickClear = (prop: keyof Search) => {
    setSearch({ ...search, [prop]: '' });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(
    () => {
      (async () => {
        if (requestList) {
          await getLists()
          setRequestList(false);
        }
      })()
    },
    [requestList]
  );

  const getLists = async () => {
    try {
      const query = {
        size, page, ...search
      }
      const result = await productApi.getProducts(query);
      setLists(result.lists);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(
    () => {
      if (categoryId) {
        console.log(categoryId);
        setSearch({
          ...search,
          categoryId: categoryId,
          categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'path')
        });
      }
      setRequestList(true);
    },
    []
  );

  useEffect(() => {
    changeSelectedList(selectedLists)
  }, [selectedLists]);

  const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
    setPage(newPage);
    setRequestList(true);
  };

  const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSize(parseInt(event.target.value, 10));
    setRequestList(true);
  };

  const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedLists(event.target.checked ? lists : []);
  };

  const handleSelectOneList = (
    event: ChangeEvent<HTMLInputElement>,
    item: ProductModel
  ): void => {
    if (!selectedLists.includes(item)) {
      setSelectedLists((prevSelected) => [...prevSelected, item]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== item));
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    if (value) {
      setSearch({
        ...search,
        categoryId: value.id,
        categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
      });
    }
    setOpen(false);
  };

  const handleClickPatternOpen = () => {
    setPatternOpen(true);
  };

  const handlePatternClose = (value) => {
    if (value) {
      setSearch({
        ...search,
        patternType: value.name,
      });
    }
    setPatternOpen(false);
  };

  const handleClickColorOpen = () => {
    setColorOpen(true);
  };

  const handleColorClose = (values) => {
      if (values) {
        setSearch({
          ...search,
          colorTypes: values.map(item => {
            return item.name;
          }).join(',')
        });
      }
      setColorOpen(false);
    };

  const handleClickBrandOpen = () => {
    setBrandOpen(true);
  };

  const handleBrandClose = (value) => {
    if (value) {
      setSearch({
        ...search,
        brandId: value.id,
        name: value.name,
      });
    }
    setBrandOpen(false);
  };

  const getDisplayStatus = () => {
      return (search.displayStatus) ? search.displayStatus : '';
  };

  const changeDisplayStatus = (value): void => {
      setSearch(prevData => ({
          ...prevData,
          displayStatus: value
      }))
  };

  const handleClickReset = () => {
      setSearch({
        categoryId: categoryId,
        categoryName: '',
        colorType: '',
        colorTypes: '',
        patternType: '',
        brandId: null,
        nameKo: '',
        name: '',
        registrationType: '',
        displayStatus: '',
        startDate: null,
        endDate: null,
      });
  };

  const handleClickSearch = async () => {
          setPage(0);
          setRequestList(true);
      }

  return (
    <Box sx={{p: 1}}>
      <Stack direction="row">
        <Stack>
          <FormControl sx={{ m: 1, width: '30ch' }}
variant="standard">
            <InputLabel htmlFor="standard-adornment-password">카테고리</InputLabel>
            <Input
              type='text'
              value={search.categoryName}
              readOnly={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{p: 0}}
                    onClick={() => {
                      handleClickClear('categoryId');
                      handleClickClear('categoryName')
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    sx={{p: 0}}
                    onClick={handleClickOpen}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
        <Stack>
          <FormControl sx={{ m: 1, width: '20ch' }}
variant="standard">
            <InputLabel htmlFor="standard-adornment-password">컬러</InputLabel>
            <Input
              id="standard-adornment-password"
              type='text'
              value={search.colorTypes}
              readOnly={true}
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
                    onClick={handleClickColorOpen}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
        <Stack>
          <FormControl sx={{ m: 1, width: '25ch' }}
variant="standard">
            <InputLabel htmlFor="standard-adornment-password">패턴</InputLabel>
            <Input
              id="standard-adornment-password"
              type='text'
              value={search.patternType}
              readOnly={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{p: 0}}
                    onClick={() => handleClickClear('patternType')}
                  >
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    sx={{p: 0}}
                    onClick={handleClickPatternOpen}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
      </Stack>
      <Stack direction="row">
        <Stack>
          <TextField
            label="상품명"
            variant="standard"
            value={search.nameKo}
            onChange={handleChange('nameKo')}
            sx={{ m: 1 }}
          />
        </Stack>
        <Stack>
          <FormControl sx={{ m: 1, width: '25ch' }}
variant="standard">
            <InputLabel htmlFor="standard-adornment-brand">브랜드</InputLabel>
            <Input
              type='text'
              value={search.name}
              readOnly={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{p: 0}}
                    onClick={() => {
                      handleClickClear('brandId');
                      handleClickClear('name');
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    sx={{p: 0}}
                    onClick={handleClickBrandOpen}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
        <Stack justifyContent={"end"}>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Stack>
      </Stack>
      <Collapse in={expanded}
timeout="auto"
unmountOnExit>
        <Stack direction="row">
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">AI 적용 여부</FormLabel>
          </Stack>
          <Stack direction="row">
            <FormControlLabel control={<Checkbox />}
label="미신청" />
            <FormControlLabel control={<Checkbox />}
label="적용" />
            <FormControlLabel control={<Checkbox />}
label="검수중" />
            <FormControlLabel control={<Checkbox />}
label="적용불가" />
          </Stack>
        </Stack>
        <Stack direction="row">
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">진열 상태</FormLabel>
          </Stack>
          <Select
              size={"small"}
              value={getDisplayStatus()}
              onChange={e=> {changeDisplayStatus(e.target.value)}}
          >
              <MenuItem value={''}>전체</MenuItem>
              <MenuItem value={'DISPLAY_END'}>진열 중지</MenuItem>
              <MenuItem value={'DISPLAY_ON'}>진열중</MenuItem>
              <MenuItem value={'SOLD_OUT'}>품절</MenuItem>
          </Select>
        </Stack>
        <Stack direction="row">
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">등록일</FormLabel>
          </Stack>
          <Stack>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={search.startDate}
                onChange={handleChangeDate('startDate')}
                renderInput={(params) => <TextField {...params}
variant="standard" />}
               />
            </LocalizationProvider>
          </Stack>
          <Stack sx={{mr: 1, ml: 1}}>
            ~
          </Stack>
          <Stack>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={search.endDate}
                onChange={handleChangeDate('endDate')}
                renderInput={(params) => <TextField {...params}
variant="standard" />}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>
        <Stack direction="row">
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">등록 유형</FormLabel>
          </Stack>
          <Stack direction="row">
            <FormControlLabel control={<Checkbox />}
label="상품 연동" />
            <FormControlLabel control={<Checkbox />}
label="파트너사" />
            <FormControlLabel control={<Checkbox />}
label="스타일봇" />
            <FormControlLabel control={<Checkbox />}
label="기본 옷장 아이템" />
          </Stack>
        </Stack>
      </Collapse>
      <Stack direction="row"
justifyContent={"flex-end"}
sx={{mb: 1}}>
        <Button size='small'
variant="outlined"
sx={{mr: 1}}
onClick={handleClickReset}>
          초기화
        </Button>
        <Button size='small'
variant="contained"
                startIcon={<SearchIcon />}
onClick={handleClickSearch}>
          검색
        </Button>
      </Stack>
      <Box sx={{display: 'flex', direction: 'row'}}>
        {
          lookbookImage != null ?
            <Box sx={{p: 0.5}}><Typography variant="h6">Lookbook</Typography><img
            src={lookbookImage}
            style={{objectFit: 'contain'}}
            width={'100%'}
            height={500}
            loading="lazy"
          /></Box> : <></>
        }
        <Box sx={{flexGrow: 1}}>
          <ProductList
            lists={lists}
            count={count}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPage={size}
            page={page}
            selectedLists={selectedLists}
            selectAllLists={handleSelectAllLists}
            selectOneList={handleSelectOneList}
          />
        </Box>
      </Box>

      <CategoryDialog
        keepMounted
        open={open}
        onClose={handleClose}
        category={dataContext.CATEGORY}
        value={search.categoryId}
      />
      <PatternDialog
        keepMounted
        open={patternOpen}
        onClose={handlePatternClose}
        items={dataContext.PATTERN}
        value={search.patternType}
      />
      <ColorDialog
        keepMounted
        open={colorOpen}
        onClose={handleColorClose}
        items={dataContext.COLOR}
        value={search.colorTypes}
        multiple={true}
      />
      <BrandDialog
        keepMounted
        open={brandOpen}
        onClose={handleBrandClose}
        items={dataContext.BRAND}
        value={search.brandId}
      />
    </Box>
  )
}

export default Product;