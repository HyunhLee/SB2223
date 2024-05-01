import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    Container,
    FormControl,
    FormLabel,
    Grid,
    IconButton,
    IconButtonProps,
    Input,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {getDataContextValue,} from "../../../utils/data-convert";
import {styled} from "@mui/material/styles";
import {defaultSearch, StyleRecommendationSearch} from "../../../types/b2b-partner-model/b2b-style";
import {DataContext} from "../../../contexts/data-context";
import _ from "lodash";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyleRecommendationList from "../../../components/b2b-partner/style-recommendation/style-recommendation-list";
import {CategoryDialog, ColorDialog, PatternDialog} from "../../../components/dialog/category-dialog";
import {brandApi} from "../../../api/brand-api";
import {useRouter} from "next/router";
import {StyleKeywordsStatus} from "../../../types/b2b-partner-model/b2b-default-item-model";
import toast from "react-hot-toast";
import {b2bStyleRecommendApi} from "../../../b2b-partner-api/b2b-style-recommend-api";
import {typeApi} from "../../../api/type-api";
import {Plus as PlusIcon} from "../../../icons/plus";

const SeasonOptions = ['SPRING', 'SUMMER', 'FALL', 'WINTER'];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


const IndexMale = () => {
    const dataContext = useContext(DataContext);

    const [search, setSearch] = useState<StyleRecommendationSearch>(defaultSearch);
    const [expanded, setExpanded] = useState(false);
    const [list, setList] = useState([]);
    const [count, setCount] = useState<number>(0);
    const [requestList, setRequestList] = useState(false);
    const [brand, setBrand] = useState([]);
    const [keywordFilter, setKeywordFilter] = useState([]);
    const [status, setStatus] = useState<StyleKeywordsStatus>();
    const [gender, setGender] = useState<string>('M');

    const router = useRouter();
    const {storeSearch} = router.query;

    const [openColor, setOpenColor] = useState(false);
    const [openPattern, setOpenPattern] = useState(false);
    const [cnt, setCnt] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isCountLoaded, setCountIsLoaded] = useState<boolean>(false);
    const [mallList, setMallList] = useState([]);
    const [control, setControl] = useState(true)

    const [openMaleCate, setOpenMaleCate] = useState(false);
    const [openFemaleCate, setOpenFemaleCate] = useState(false);

    useEffect(() => {
        if (storeSearch === 'true') {
            const styleRecommendationSearch = sessionStorage.getItem('StyleRecommendationSearch');
            let style = JSON.parse(styleRecommendationSearch)
            setSearch(style);
            // setGender(style.gender);
        }
        setRequestList(true);
    },[]);

    useEffect(
        () => {
            sessionStorage.setItem('StyleRecommendationSearch', JSON.stringify(search));
        },
        [search]
    );

    //datacontext에서 불러올 때 걸리는 타이밍때문에 전체탭에 진입시 불러올 수 있게 한다.
    // useEffect(() =>{
    //   (async()=>{
    //     const result = await typeApi.getMall();
    //     if(result){
    //       const mallsList = result.data.map((v) => v.mall)
    //       setMallList(mallsList)
    //     }
    //
    //   })()
    // },[])


    useEffect(
        () => {
            (async () => {
                if (requestList) {
                    if(search.mallId.length == 0 && search.brandId.length == 0 || search.mallId.length > 0 && search.brandId.length > 0){
                        setIsLoaded(false)
                        if(search.gender == ''){
                            setMallList(_.sortBy(dataContext.MALL, 'name').map((v) => v.mall));
                            await getLists()
                            setRequestList(false);
                        }else if(search.gender == 'M' || search.gender == 'F'){
                            // let malls = _.sortBy(dataContext.MALL, 'name').map((v) => v.mall)
                            const lists = await typeApi.getMall();
                            if(lists){
                                const list = lists.data.map((v) => v.mall)
                                const genderMallList = list.filter((v) => v.gender === search.gender)
                                setMallList(genderMallList);
                            }
                            await getLists()
                            setRequestList(false);
                        }
                    }else{
                        if(search.mallId.length > 0 && search.brandId.length == 0){
                            window.confirm('브랜드를 선택 후 검색해주세요.')
                            return;
                        }

                    }

                }
            })()
        },
        [requestList, gender]);


    const getLists = async () => {
        try {
            const query = {
                ...search,
                gender: gender
            }

            if(query.categories){
                const categories = query.categories
                categories.forEach((categoryId, index) => {
                    if (index == 0) {
                        query.category1 = categoryId;
                    } else if (index == 1) {
                        query.category2 = categoryId;
                    } else if (index == 2) {
                        query.category3 = categoryId;
                    } else if (index == 3) {
                        query.category4 = categoryId;
                    } else if (index == 4) {
                        query.category5 = categoryId;
                    }
                })
            }
            const result = await b2bStyleRecommendApi.getJenniePickRecommend(query);
            setList(result.lists);
            setCount(result.count);

            // if (control) {
            //   setCountIsLoaded(false)
            //   const statusResult = await b2bStyleRecommendApi.getStyleRecommendCount(search.gender);
            //   setStatus(statusResult);
            //
            //   let totalCount = 0;
            //   if (search.gender == '') {
            //     statusResult.gender.forEach((v) => totalCount += Number(v.cnt))
            //     setCnt(totalCount);
            //   } else {
            //     let temp = statusResult.gender.filter(v => v.gender == search.gender)
            //     setCnt(temp.length === 0 ? 0 : temp[0].cnt);
            //   }
            //   setControl(false)
            //   setCountIsLoaded(true)
            // }
            setIsLoaded(true)

        } catch (err) {
            console.error(err);
            toast.error('데이터를 불러오는데 실패하였습니다.');
        }
    }

    const getBrandList = async (id) =>{
        let idList = '';
        if(id.length > 1){
            idList = id.join(',')
            await brandApi.getMallBrands(idList).then(res => {
                setBrand(res.data);
            })
        }else if(id.length == 1){
            let idValue = id[0]
            await brandApi.getMallBrands(idValue).then(res => {
                setBrand(res.data);
            })
        }else{
            return;
        }
    }


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    const handleClickOpenMaleCate = () => {
        setOpenMaleCate(true);
    }
    const handleClickOpenfemaleCate = () => {
        setOpenFemaleCate(true);
    };

    const handleClickOpenColor = () => {
        setOpenColor(true);
    };

    const handleClickOpenPattern = () => {
        setOpenPattern(true);
    };


    const maleCateHandleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryId: value.id,
                maleCategoryId: value.id,
                categories : value.key.split('/'),
                maleCategoryName: getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpenMaleCate(false);
    };

    const femaleCateHandleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryId: value.id,
                femaleCategoryId: value.id,
                categories : value.key.split('/'),
                femaleCategoryName: getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpenFemaleCate(false);
    };

    const handleCloseColor = (values) => {
        if (values) {
            setSearch({
                ...search,
                colorType: values.map(item => {
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
                patternType: values.map(item => {
                    return item.name;
                }).join(',')
            });
        }
        setOpenPattern(false);
    };

    const handleClickClearCategory = (prop) => {
        if(prop == 'male'){
            setSearch({ ...search,
                maleCategoryId: null,
                maleCategoryName: ''
            });
        }else{
            setSearch({ ...search,
                femaleCategoryId: null,
                femaleCategoryName: ''
            });
        }

    };

    const handleClickClear = (prop: keyof StyleRecommendationSearch) => {
        setSearch({ ...search, [prop]: '' });
    };

    const renderKeywords = () => {
        if(gender == 'M') {
            return Object.keys(dataContext.B2BMALEKEYWORDS).map(key => {
                return (<MenuItem key={dataContext.B2BMALEKEYWORDS[key]}
                                  value={dataContext.B2BMALEKEYWORDS[key]}>
                    <Checkbox checked={keywordFilter.indexOf(dataContext.B2BMALEKEYWORDS[key]) > -1}/>
                    <ListItemText primary={dataContext.B2BMALEKEYWORDS[key]}/>
                </MenuItem>)
            })
        } else {
            return Object.keys(dataContext.B2BKEYWORDS).map(key => {
                return (<MenuItem key={dataContext.B2BKEYWORDS[key]}
                                  value={dataContext.B2BKEYWORDS[key]}>
                    <Checkbox checked={keywordFilter.indexOf(dataContext.B2BKEYWORDS[key]) > -1}/>
                    <ListItemText primary={dataContext.B2BKEYWORDS[key]}/>
                </MenuItem>)
            })
        }
    }

    const handleChange =
        (prop: keyof StyleRecommendationSearch) => (event: ChangeEvent<HTMLInputElement>) => {
            const {
                target: {value},
            } = event;


            setSearch({...search, [prop]:value});

        };

    const handleMallId = (event: SelectChangeEvent<typeof search.mallId>) => {
        const {
            target: {value},
        } = event;

        getBrandList(value)
        // @ts-ignore
        setSearch({...search, mallId: value});
    };

    const handleChangeDate =
        (prop: keyof StyleRecommendationSearch) => (value) => {
            setSearch({...search, [prop]: value});
        };

    const handleChangeKeyword = (event: SelectChangeEvent<typeof search.keywords>) => {
        const {
            target: {value},
        } = event;

        let arr: any[];
        if (value) {
            arr = [...value].map((v) => Object.keys(dataContext.B2BKEYWORDS).find((key) => dataContext.B2BKEYWORDS[key] == v));
        }

        // @ts-ignore
        setKeywordFilter(value)
        setSearch({...search, keywords: arr})

    };

    const renderSeason = () => {
        return SeasonOptions.map((season, idx) => {
            return (<MenuItem key={idx}
                              value={dataContext.BTB_DEFAULT_PRODUCT_SEASON[season]}>
                <Checkbox checked={search.seasonTypesList?.indexOf(dataContext.BTB_DEFAULT_PRODUCT_SEASON[season]) > -1}/>
                <ListItemText primary={dataContext.BTB_DEFAULT_PRODUCT_SEASON[season]}/>
            </MenuItem>)
        })
    }

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setControl(false)
        setRequestList(true);
        handlePageChange(null, 0)
    }

    const handleClickReset = () => {
        // @ts-ignore
        setSearch(defaultSearch);
        setKeywordFilter([]);
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleClickSearch()
        }
    }

    //page
    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setSearch({
            ...search,
            page: newPage,
        });
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({
            ...search,
            size: parseInt(event.target.value, 10),
        });
        setRequestList(true);
    };

    const handleGenderChange = (g) => {
        setGender(g);
        setSearch({
            ...search,
            page:0,
            id:null,
            categories: [],
            categoryId : '',
            femaleCategoryId : '',
            maleCategoryId : '',
            categoryName: '',
            femaleCategoryName: '',
            maleCategoryName: '',
            registerType: '',
            seasonType: '',
            seasonTypesList: [],
            colorType: '',
            patternType: '',
            styleId: null,
            startDate: null,
            endDate: null,
            styleKeyword: '',
            styleKeywordsList: [],
            keywords: [],
            brandId: [],
            mallId: [],
            gender: g});
        setBrand([])
        setKeywordFilter([])
        setControl(true)
        setRequestList(true);
    }

    const handleChangeSeason = (event: SelectChangeEvent<typeof search.seasonTypesList>) => {
        const {
            target: {value},
        } = event;

        //value 를 사용해서 key(영문찾아냄)
        let arr: any[];
        if (typeof value !== "string") {
            arr = value.map((v) => Object.keys(dataContext.BTB_DEFAULT_PRODUCT_SEASON).find((key) => dataContext.BTB_DEFAULT_PRODUCT_SEASON[key] == v));
        }
        setSearch({...search, seasonTypesList: event.target.value, seasonType:arr.join(',')})
    };


    const handleMovetoAddStyle = () => {
        router.push(`/b2b-partner/style-recommendation/b2b-style-recommend?id=0`);
    }


    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2
                }}
            >
                <Stack direction={'row'}
                       sx={{justifyContent: 'space-between'}}>
                    <Grid sx={{
                        ml: 4, mt: 2, mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant="h4">제니솔루션 Jennies Pick 남성</Typography>
                    </Grid>
                    <Stack direction={"row"}
                           sx={{display: 'flex', alignItems: 'end', justifyContent: 'end', mb: 2, mr: 2}}>
                        <Button
                            color="primary"
                            variant="contained"
                            sx={{mr: 2}}
                            startIcon={<PlusIcon fontSize="small"/>}
                            onClick={handleMovetoAddStyle}>
                            스타일 세트 등록
                        </Button>
                    </Stack>
                </Stack>
                <Container maxWidth="xl">
                    <Card sx={{p: 3, mt: 0.5, mb: 1}}>
                        {/*            <Stack direction="row"*/}
                        {/*                   justifyContent={"flex-end"}>*/}
                        {/*              <Box sx={{width: '100%', mt: 0.5}}>*/}
                        {/*                <Grid container*/}
                        {/*                      sx={{m: 0}}*/}
                        {/*                      justifyContent={'start'}>*/}
                        {/*                  <Stack direction={'row'}*/}
                        {/*sx={{mb: 3}}>*/}
                        {/*                    <Grid item*/}
                        {/*                          xs={12}>*/}
                        {/*                      <Typography variant={'h6'}>스타일 세트 현황 : {isCountLoaded ? getNumberComma(cnt) : ' 데이터 로딩 중..'}</Typography>*/}
                        {/*                    </Grid>*/}
                        {/*                    <Button size={'small'}*/}
                        {/*                            variant={gender == '' ? 'contained' : 'outlined'}*/}
                        {/*                            color={'success'}*/}
                        {/*                            sx={{ml: 2, mt: -1, height: 40}}*/}
                        {/*                            onClick={() => handleGenderChange('')}*/}
                        {/*                    >전체</Button>*/}
                        {/*                    <Button size={'small'}*/}
                        {/*                            variant={gender == 'M' ? 'contained' : 'outlined'}*/}
                        {/*                            color={'info'}*/}
                        {/*                            sx={{ml: 2, mt: -1, height: 40}}*/}
                        {/*                            onClick={() => handleGenderChange('M')}*/}
                        {/*                    >남성</Button>*/}
                        {/*                    <Button size={'small'}*/}
                        {/*                            variant={gender == 'F' ? 'contained' : 'outlined'}*/}
                        {/*                            color={'warning'}*/}
                        {/*                            sx={{ml: 2, mt: -1, height: 40}}*/}
                        {/*                            onClick={() => handleGenderChange('F')}*/}
                        {/*                    >여성</Button>*/}
                        {/*                  </Stack>*/}
                        {/*                </Grid>*/}
                        {/*                <Grid container*/}
                        {/*                      sx={{m: 1}}*/}
                        {/*                      spacing={1}*/}
                        {/*                      justifyContent={'start'}>*/}
                        {/*                  {status?.styleKeyword?.map((v) => {*/}
                        {/*                    return (*/}
                        {/*                      <>*/}
                        {/*                        <Grid item*/}
                        {/*                              xs={1.5}>*/}
                        {/*                          <Typography variant={'body2'}>{v.styleKeyword}: {v.cnt}</Typography>*/}
                        {/*                        </Grid>*/}
                        {/*                      </>*/}
                        {/*                    )*/}
                        {/*                  })}*/}
                        {/*                </Grid>*/}
                        {/*              </Box>*/}
                        {/*            </Stack>*/}
                        <CardContent sx={{py: 1}}>
                            <Collapse in={expanded}
                                      timeout="auto"
                                      unmountOnExit>
                                <Stack direction={'row'}
                                       sx={{mt:3}}>
                                    {gender !== '' ?
                                        <>
                                            <Stack direction="row"
                                                   sx={{mr:2}}>
                                                <Stack justifyContent={"center"}
                                                       sx={{mr: 1, ml: 1}}>
                                                    <FormLabel component="legend">회사</FormLabel>
                                                </Stack>
                                                {mallList.length > 0 ?
                                                    <Select
                                                        sx={{mt: 1.2, minWidth: 130, height: 40}}
                                                        size={"small"}
                                                        value={search.mallId}
                                                        onChange={handleMallId}
                                                        multiple={true}
                                                    >
                                                        {mallList.map((mall) => {
                                                            return (
                                                                <MenuItem key={mall.id}
                                                                          value={mall.id}>{mall.name}</MenuItem>
                                                            )
                                                        }) }
                                                    </Select>
                                                    :
                                                    <></>}
                                            </Stack>
                                            <Stack direction="row"
                                                   sx={{mr:3}}>
                                                <Stack justifyContent={"center"}
                                                       sx={{mr: 1, ml: 2}}>
                                                    <FormLabel component="legend">브랜드</FormLabel>
                                                </Stack>
                                                <Select
                                                    sx={{mt: 1.2, minWidth: 130, height: 40}}
                                                    size={"small"}
                                                    value={search.brandId ? search.brandId : ''}
                                                    onChange={handleChange('brandId')}
                                                    multiple={true}
                                                >
                                                    {brand?.map((brand) => {
                                                        return (
                                                            <MenuItem key={brand.id}
                                                                      value={brand.id}>{brand.nameKo}</MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </Stack>
                                        </>
                                        : <></>}
                                    <Stack direction="row">
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 1, ml: 1}}>
                                            <FormLabel component="legend">스타일 키워드</FormLabel>
                                        </Stack>
                                        <Select
                                            name="keyword"
                                            onChange={handleChangeKeyword}
                                            multiple={true}
                                            sx={{
                                                m: 1,
                                                minWidth: 180,
                                                height: 40,
                                                mt: 1.5,
                                            }}
                                            value={keywordFilter}
                                            renderValue={(selected) => selected.join(',')}
                                        >
                                            {renderKeywords()}
                                        </Select>
                                    </Stack>
                                </Stack>
                                <Stack direction="row">
                                    {search.gender == '' || search.gender == 'F' ?
                                        <>
                                            <Stack sx={{mr:2}}>
                                                <FormControl sx={{m: 1, width: '30ch',}}
                                                             variant="standard">
                                                    <InputLabel>여성 카테고리</InputLabel>
                                                    <Input
                                                        type='text'
                                                        value={search.femaleCategoryName}
                                                        readOnly={true}
                                                        disabled={search.maleCategoryName != ""}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    sx={{p: 0}}
                                                                    disabled={search.maleCategoryName != ""}
                                                                    onClick={() => handleClickClearCategory('female')}
                                                                >
                                                                    <ClearIcon/>
                                                                </IconButton>
                                                                <IconButton
                                                                    sx={{p: 0}}
                                                                    disabled={search.maleCategoryName != ""}
                                                                    onClick={handleClickOpenfemaleCate}
                                                                >
                                                                    <SearchIcon/>
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            </Stack>
                                            <CategoryDialog
                                                keepMounted
                                                open={openFemaleCate}
                                                onClose={femaleCateHandleClose}
                                                category={dataContext.FEMALE_CATEGORY}
                                                value={search.femaleCategoryId}
                                            /></>: <></>}
                                    {search.gender == '' || search.gender == 'M' ?
                                        <>
                                            <Stack sx={{mr:2}}>
                                                <FormControl sx={{m: 1, width: '30ch',}}
                                                             variant="standard">
                                                    <InputLabel>남성 카테고리</InputLabel>
                                                    <Input
                                                        type='text'
                                                        value={search.maleCategoryName}
                                                        readOnly={true}
                                                        disabled={search.femaleCategoryName != ""}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    sx={{p: 0}}
                                                                    disabled={search.femaleCategoryName != ""}
                                                                    onClick={() => handleClickClearCategory('male')}
                                                                >
                                                                    <ClearIcon/>
                                                                </IconButton>
                                                                <IconButton
                                                                    sx={{p: 0}}
                                                                    disabled={search.femaleCategoryName != ""}
                                                                    onClick={handleClickOpenMaleCate}
                                                                >
                                                                    <SearchIcon/>
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            </Stack>
                                            <CategoryDialog
                                                keepMounted
                                                open={openMaleCate}
                                                onClose={maleCateHandleClose}
                                                category={dataContext.MALE_CATEGORY}
                                                value={search.maleCategoryId}
                                            />
                                        </>
                                        :<></>}
                                    <Stack sx={{mr:2}}>
                                        <FormControl sx={{m: 1, width: '25ch'}}
                                                     variant="standard">
                                            <InputLabel>컬러</InputLabel>
                                            <Input
                                                type='text'
                                                value={search.colorType}
                                                readOnly={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={() => handleClickClear('colorType')}
                                                        >
                                                            <ClearIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={handleClickOpenColor}
                                                        >
                                                            <SearchIcon/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Stack>
                                    <ColorDialog
                                        keepMounted
                                        open={openColor}
                                        onClose={handleCloseColor}
                                        items={dataContext.COLOR}
                                        value={search.colorType}
                                        multiple={true}
                                    />
                                    <Stack sx={{mr:2}}>
                                        <FormControl sx={{m: 1, width: '25ch'}}
                                                     variant="standard">
                                            <InputLabel>패턴</InputLabel>
                                            <Input
                                                type='text'
                                                value={search.patternType}
                                                readOnly={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={() => handleClickClear('patternType')}
                                                        >
                                                            <ClearIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={handleClickOpenPattern}
                                                        >
                                                            <SearchIcon/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Stack>
                                    <PatternDialog
                                        keepMounted
                                        open={openPattern}
                                        onClose={handleClosePattern}
                                        items={dataContext.PATTERN}
                                        value={search.patternType}
                                        multiple={true}
                                    />
                                    <Stack>
                                        <TextField
                                            label="스타일 ID"
                                            variant="standard"
                                            value={search.id || ""}
                                            onChange={handleChange('id')}
                                            onKeyUp={handleKeyUp}
                                            sx={{m: 1}}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack direction="row"
                                       sx={{mb: 1, mt: 4}}>
                                    <Stack direction="row"
                                           sx={{mb: 1, mt: 1}}>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, ml: 1, mb: 1.5}}>
                                            <FormLabel component="legend">등록일</FormLabel>
                                        </Stack>
                                        <Stack sx={{mb: 2, border: '1px solid #dfdfdf', px: 1, borderRadius: 1}}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    inputFormat="yyyy-MM-dd"
                                                    value={search.startDate ? search.startDate : null}
                                                    onChange={handleChangeDate('startDate')}
                                                    renderInput={(params) => <TextField {...params}
                                                                                        variant="standard"
                                                                                        sx={{height: 40 ,width: 150}}/>}
                                                    maxDate={new Date(new Date().setDate(new Date().getDate()))}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                        <Stack sx={{mr: 2, ml: 2, mb: 1, mt: 1}}>
                                            ~
                                        </Stack>
                                        <Stack sx={{mb: 2, border: '1px solid #dfdfdf', px: 1, borderRadius: 1}}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    inputFormat="yyyy-MM-dd"
                                                    value={search.endDate ? search.endDate : null}
                                                    onChange={handleChangeDate('endDate')}
                                                    renderInput={(params) => <TextField {...params}
                                                                                        variant="standard"
                                                                                        sx={{height: 40 ,width: 150}}/>}
                                                    maxDate={new Date(new Date().setDate(new Date().getDate()))}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row">
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, ml: 2, mb: 2}}>
                                            <FormLabel component="legend">시즌</FormLabel>
                                        </Stack>
                                        <Stack direction="row"
                                               justifyContent={"space-between"}>
                                            <Select
                                                name="keyword"
                                                onChange={handleChangeSeason}
                                                multiple={true}
                                                sx={{minWidth: 220, height: 45, mt: 1}}
                                                value={search.seasonTypesList || ''}
                                                renderValue={(selected) => selected.join(',')}
                                                MenuProps={MenuProps}
                                            >
                                                {renderSeason()}
                                            </Select>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack direction={'row'}
                                       sx={{display: 'flex', justifyContent: 'end', alignItem: 'end'}}>
                                    <Button size='small'
                                            variant="outlined"
                                            sx={{mr: 1}}
                                            onClick={handleClickReset}>
                                        초기화
                                    </Button>
                                    <Button size='small'
                                            color="primary"
                                            variant="contained"
                                            startIcon={<SearchIcon/>}
                                            onClick={handleClickSearch}>
                                        검색
                                    </Button>
                                </Stack>
                            </Collapse>
                            <Stack direction="row"
                                   sx={{display: 'flex', justifyContent: 'end', alignItem: 'end', mt: 3}}>
                                {expanded ?
                                    <Button
                                        sx={{lineHeight: 2}}
                                        endIcon={<ExpandLessIcon/>}
                                        onClick={handleExpandClick}

                                    >
                                        검색 필터 닫기
                                    </Button> :
                                    <Button variant={'outlined'}
                                            endIcon={<ExpandMoreIcon/>}
                                            onClick={handleExpandClick}
                                            sx={{lineHeight: 2}}>
                                        검색 필터 열기</Button>}
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card>
                        <StyleRecommendationList
                            list={list}
                            count={count}
                            handlePageChange={handlePageChange}
                            handleRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={search.size}
                            size={search.size}
                            page={search.page}
                            setRequestList={setRequestList}
                            isLoaded={isLoaded}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    );
};

IndexMale.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default IndexMale;