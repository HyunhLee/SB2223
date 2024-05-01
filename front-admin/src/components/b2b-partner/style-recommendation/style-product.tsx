import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField
} from "@mui/material";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {StyleProductList} from "./style-product-list";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {ColorDialog, PatternDialog} from "../../dialog/category-dialog";
import {getDataContextValue} from "../../../utils/data-convert";
import {DataContext} from "../../../contexts/data-context";
import {B2bDefaultItemModel} from "../../../types/b2b-partner-model/b2b-default-item-model";
import {b2bPartnerStyleItemApi} from "../../../b2b-partner-api/b2b-partner-style-item-api";
import toast from "react-hot-toast";
import _ from "lodash";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Search {
  categoryId: number;
  categoryName: string;
  colorName: string;
  colorTypes: string;
  patternName: string;
  brandId: any;
  nameKo: string;
  name: string;
  id: string;
  registrationType: string;
  displayStatus: string;
  startDate?: Date;
  endDate?: Date;
  seasonTypes: string;
  fitRequestStatus: string;
}

const StyleProduct = (props) => {
  const {brand, gender, categoryId, changeSelectedList, onClickApply } = props;

  const dataContext = useContext(DataContext);

  const [lists, setLists] = useState<B2bDefaultItemModel[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);

  const [selectedLists, setSelectedLists] = useState<B2bDefaultItemModel[]>([]);
  const [search, setSearch] = useState<Search>({
    categoryId: categoryId,
    categoryName: '',
    colorName: '',
    colorTypes: '',
    patternName: '',
    brandId: brand ? [brand] : [],
    nameKo: '',
    name: gender == 'M' ? (dataContext.B2B_MALE_MALL_BRANDS[brand]) ? dataContext.B2B_MALE_MALL_BRANDS[brand].name : '' : (dataContext.B2B_FEMALE_MALL_BRANDS[brand]) ? dataContext.B2B_FEMALE_MALL_BRANDS[brand].name : '',
    id: '',
    registrationType: '',
    displayStatus: '',
    startDate: null,
    endDate: null,
    seasonTypes: '',
    fitRequestStatus: ''
  });

  const [patternOpen, setPatternOpen] = React.useState(false);
  const [colorOpen, setColorOpen] = React.useState(false);
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

  useEffect(
    () => {
      (async () => {
        if (requestList && search.brandId.length > 0) {
          await getLists()
          setRequestList(false);
        } else if(requestList && search.brandId.length == 0) {
          toast.error('브랜드를 선택해주세요.')
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
      const result = await b2bPartnerStyleItemApi.getStyleItems(query);
      const Arr = _.uniqBy(result.lists, "id");
      setLists(Arr);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(
    () => {
      if (categoryId) {
        setSearch({
          ...search,
          categoryId: categoryId,
          categoryName: gender == 'F' ? getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'path') : getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', categoryId, 'path')
        });
      }
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
    item: B2bDefaultItemModel
  ): void => {
    if (!selectedLists.includes(item)) {
      setSelectedLists([item]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== item));
    }
  };

  const handleClickPatternOpen = () => {
    setPatternOpen(true);
  };

  const handlePatternClose = (value) => {
    if (value) {
      setSearch({
        ...search,
        patternName: value.name,
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
          colorName: values.map(item => {
            return item.name;
          }).join(','),
          colorTypes: values.map(item => {
            return item.name;
          }).join(',')
        });
      }
      setColorOpen(false);
    };

  const handleClickReset = () => {
      setSearch({
        categoryId: categoryId,
        categoryName: '',
        colorName: '',
        colorTypes: '',
        patternName: '',
        brandId: [],
        nameKo: '',
        name: '',
        id: '',
        registrationType: '',
        displayStatus: '',
        startDate: null,
        endDate: null,
        seasonTypes: '',
        fitRequestStatus: ''
      });
  };

  const handleClickSearch = async () => {
    setPage(0);
    setRequestList(true);
  }

  const handleChangeBrand = (event: SelectChangeEvent<typeof search.name>) => {
    const ids = [];
    [...event.target.value].forEach((v) => {
      if(gender == 'M') {
        ids.push(dataContext.B2B_MALE_MALL_BRANDS.filter((e) => {
          return e.id === v
        })[0].id);
      } else {
        ids.push(dataContext.B2B_FEMALE_MALL_BRANDS.filter((e) => {
          return e.id === v
        })[0].id);
      }
    })
    setSearch({...search, name: [...event.target.value].join(','), brandId: ids})
  };

  const renderBrand = () => {
    if(gender == 'M') {
      return dataContext.B2B_MALE_MALL_BRANDS.map((brand, idx) => {
        return (<MenuItem key={idx}
                          value={brand.id}>
          <Checkbox checked={search.brandId?.indexOf(brand.id) > -1}/>
          <ListItemText primary={brand.name}/>
        </MenuItem>)
      })
    } else {
      return dataContext.B2B_FEMALE_MALL_BRANDS.map((brand, idx) => {
        return (<MenuItem key={idx}
                          value={brand.id}>
          <Checkbox checked={search.brandId?.indexOf(brand.id) > -1}/>
          <ListItemText primary={brand.name}/>
        </MenuItem>)
      })
    }
  }

  return (
    <Box sx={{p: 1}}>
      <Stack direction="row">
        <Stack justifyContent={"center"}
               sx={{mr: 2, ml: 1}}>
          <FormLabel component="legend">브랜드</FormLabel>
        </Stack>
          <Stack direction="row"
                 justifyContent={"space-between"}>
            <Select
                name="brand"
                onChange={handleChangeBrand}
                multiple={true}
                sx={{minWidth: 450, height: 50}}
                value={search.brandId || ''}
                renderValue={(selected) => {
                  const names = [];
                  selected.forEach((v) => {
                    if(gender == 'M') {
                      names.push(dataContext.B2B_MALE_MALL_BRANDS.filter((e) => {
                        return e.id === v
                      })[0].name);
                    } else {
                      names.push(dataContext.B2B_FEMALE_MALL_BRANDS.filter((e) => {
                        return e.id === v
                      })[0].name);
                    }
                  })
                  return names.join(',')
                }}
                MenuProps={MenuProps}
            >
              {renderBrand()}
            </Select>
          </Stack>
      </Stack>
      <Stack direction="row">
        <Stack>
          <FormControl sx={{ m: 1, width: '25ch' }}
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
              value={search.patternName}
              readOnly={true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{p: 0}}
                    onClick={() => handleClickClear('patternName')}
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
        <Stack direction="row">
          <Stack justifyContent={"center"}
                 sx={{m: 1, mt: 3}}>
            <FormLabel component="legend">등록일</FormLabel>
          </Stack>
          <Stack sx={{m: 1, mt: 3}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  inputFormat={"yyyy-MM-dd"}
                  mask={"____-__-__"}
                  value={search.startDate}
                  onChange={handleChangeDate('startDate')}
                  renderInput={(params) => <TextField {...params}
                                                      variant="standard" />}
              />
            </LocalizationProvider>
          </Stack>
          <Stack sx={{m: 1, mt: 4}}>
            ~
          </Stack>
          <Stack sx={{m: 1, mt: 3}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  inputFormat={"yyyy-MM-dd"}
                  mask={"____-__-__"}
                  value={search.endDate}
                  onChange={handleChangeDate('endDate')}
                  renderInput={(params) => <TextField {...params}
                                                      variant="standard" />}
              />
            </LocalizationProvider>
          </Stack>
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
          <TextField
              label="상품ID"
              variant="standard"
              value={search.id}
              onChange={handleChange('id')}
              sx={{ m: 1 }}
          />
        </Stack>
      </Stack>
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
        <Box sx={{flexGrow: 1}}>
          <StyleProductList
            lists={lists}
            count={count}
            gender={gender}
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
      <PatternDialog
        keepMounted
        open={patternOpen}
        onClose={handlePatternClose}
        items={dataContext.PATTERN}
        value={search.patternName}
      />
      <ColorDialog
        keepMounted
        open={colorOpen}
        onClose={handleColorClose}
        items={dataContext.COLOR}
        value={search.colorTypes}
        multiple={true}
      />
    </Box>
  )
}

export default StyleProduct;