import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    FormLabel,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    Table,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {NextPage} from "next";
import Head from "next/head";
import React, {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {PopularSearchWordsModel} from "../../types/popular-search-words";
import {useRouter} from "next/router";
import {popularSearchWordsApi} from "../../api/popular-search-words-api";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import WordsBox from "../../components/popular-search-words-component/words-box";
import ClearIcon from "@mui/icons-material/Clear";
import {DataContext} from "../../contexts/data-context";
import {BrandDialog} from "../../components/dialog/brand-dialog";

/**
 * 인기키워드 상세 / 등록 페이지
 * auth : Owen
 * @constructor
 */
const PopularSearchWordsDetail: NextPage = () => {
    const router = useRouter();
    const dataContext = useContext(DataContext);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const {id} = router.query;

    const [brandOpen, setBrandOpen] = useState(false);
    const [idx, setIdx] = useState<number>(null);
    const [popularSearchWordsModel, setPopularSearchWordsModel] = useState<PopularSearchWordsModel>({
        id: null,
        description: "",
        activated: true,
        displayStatus: "",
        keywordItems: [],
        createdBy: "",
        createdDate: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        startDate: "",
        expireDate: ""
    })

    const beforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
        console.log('##############refresh#############')

    };

    //새로고침시 경고 팝업창
    useEffect(() => {
        try {
            window.addEventListener('beforeunload', beforeUnload);
            return () => {
                window.removeEventListener('beforeunload', beforeUnload);
            };
        } catch (error) {
            console.log(error);
        }
    }, []);

    /**
     * 상세 데이터 불러오기
     */


    useEffect(() => {
        if(router.query){
            if (id && id !== '0') {
                (async () => {
                    await getLists();
                })()
            }
        }

    }, [router.query]);

    const getLists = async () => {
        try {
            const result = await popularSearchWordsApi.getPopularSearchWord(id);
            setPopularSearchWordsModel(result);
            console.log(result.keywordItems, '######result')
        } catch (err) {
            console.error(err);
        }
    }

    const handleChangeDate = (prop: keyof PopularSearchWordsModel) => (value) => {
        setPopularSearchWordsModel({...popularSearchWordsModel, [prop]: value});
    };

    const defaultItem = (index: number) => {
        return {
            id: null,
            type: "KEYWORD",
            keyword: "",
            listOrder: index,
            activated: true,
            createdBy: "",
            createdDate: "",
            lastModifiedBy: "",
            lastModifiedDate: "",
            category: {id: null},
            brand: {id: null},
            keywordGroup: {id: null},
            patternType: "",
            colorType: "",
            key: Math.random().toString(36).substr(2, 11)
        }
    }

    /**
     * 카드 추가 버튼 클릭 함수
     */
    const handleAddCard = () => {
        const addCards = [defaultItem(popularSearchWordsModel.keywordItems.length + 1)];
        let newItems = [...popularSearchWordsModel.keywordItems, ...addCards];
        // @ts-ignore
        addCards[0].keywordGroup.id = popularSearchWordsModel.id
        setPopularSearchWordsModel(prevData => ({
            ...prevData,
            keywordItems: newItems,
        }))
    }

    const onDelete = (item, index) => {
        let deleteItem = popularSearchWordsModel.keywordItems
        deleteItem[index].activated = !item.activated
        setPopularSearchWordsModel({...popularSearchWordsModel, keywordItems: deleteItem});
    }

    const handleDelete = async (id): Promise<void> => {
        if (window.confirm('삭제하시겠습니까?')) {
            await popularSearchWordsApi.patchPopularSearchWord(id, {
                id,
                activated: false,
            })
            toast.success('삭제되었습니다.');
            router.push('/popular-search-words/popular-search-words')
        }
    }

    const handlePost = async (): Promise<void> => {
        console.log(1111, popularSearchWordsModel.keywordItems)

        if(popularSearchWordsModel.description === '') {
            toast.error("타이틀을 입력해주세요.")
            return;
        }
        if (popularSearchWordsModel.keywordItems.length < 1) {
            toast.error('키워드를 입력해주세요.');
            return;
        }
        if (popularSearchWordsModel.startDate === "" || popularSearchWordsModel.expireDate === "") {
            toast.error("게시 기간을 입력해주세요.")
            return;
        }

        if (window.confirm('수정하시겠습니까?')) {
            await popularSearchWordsApi.putPopularSearchWord(popularSearchWordsModel)
                .then(res => {
                    console.log(res);
                    toast.success('키워드 그룹이 수정되었습니다.');
                    router.push('/popular-search-words/popular-search-words')
                })
                .catch((err) => {
                    console.log(err)
                    toast.error("키워드 그룹 수정에 실패하였습니다.");
                })
        }
    }

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setPopularSearchWordsModel({...popularSearchWordsModel, description: event.target.value});
    }

    const handleKeywordChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number): void => {
        let word = popularSearchWordsModel.keywordItems;
        word[index].keyword = event.target.value;
        setPopularSearchWordsModel({...popularSearchWordsModel, keywordItems: word});
    }

    const handleBack = (e) => {
        e.preventDefault();
        router.push(`/popular-search-words/popular-search-words?storeSearch=true`);
    }

    const getType = (checkValues, index) => {
        const keywordTemp = popularSearchWordsModel.keywordItems;
        if (keywordTemp[index].type) {
            const findValue = checkValues.find(value => keywordTemp[index].type.includes(value));
            return (findValue) ? findValue : '';
        }
        return '';
    }

    const changeTypeHandler = (value, index): void => {
        const keywordTemp = popularSearchWordsModel.keywordItems;
        keywordTemp[index].type = value
        setPopularSearchWordsModel({...popularSearchWordsModel, keywordItems: keywordTemp});
    }

    const handleClickClear = (index) => {
        const keywordTemp = popularSearchWordsModel.keywordItems;
        keywordTemp[index].brand.id = null;
        setPopularSearchWordsModel({...popularSearchWordsModel, keywordItems: keywordTemp});
    };

    const handleClickBrandOpen = (index) => {
        setIdx(index);
        setBrandOpen(true);
    };

    const handleBrandClose = (value) => {
        console.log(idx)
        if (value) {
            const keywordTemp = popularSearchWordsModel.keywordItems;
            keywordTemp[idx].brand.id = value.id
            setPopularSearchWordsModel({...popularSearchWordsModel, keywordItems: keywordTemp});
        }
        setBrandOpen(false);
    };

    return (
        <>
            <Head>
                Popular Search Words Detail | Style Bot
            </Head>
            <Box
                component="main"
                ref={rootRef}
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb: 2}}>
                        <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                            <IconButton
                                edge="end"
                                onClick={handleBack}
                            >
                                <ArrowBackIcon
                                    fontSize="small"
                                    sx={{mr: 1}}
                                />
                                <Typography variant="h5">
                                    인기 키워드 리스트
                                </Typography>
                            </IconButton>
                        </Grid>
                    </Box>
                    <Box sx={{mb: 4}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    인기 키워드 상세
                                </Typography>
                            </Grid>
                            <Grid>
                                <Button sx={{mt: 3, mr: 2}}
                                        color="error"
                                        variant="outlined"
                                        startIcon={<DeleteIcon/>}
                                        size="small"
                                        onClick={() => handleDelete(popularSearchWordsModel.id)}>
                                    삭제
                                </Button>
                                <Button sx={{mt: 3, mr: 2}}
                                        variant="contained"
                                        startIcon={<SaveIcon/>}
                                        size="small"
                                        onClick={handlePost}>
                                    수정
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider/>
                    <Card sx={{py: 1}}>
                        <CardContent>
                            <Stack direction="row"
                                   sx={{mb: 2}}>
                                <Stack justifyContent={"center"}
                                       sx={{mt: 1, ml: 1}}>
                                    <FormLabel component="legend">TITLE</FormLabel>
                                </Stack>
                                <Stack>
                                    <Typography sx={{m: 1}}>
                                        <TextField
                                            id='description'
                                            value={popularSearchWordsModel.description || ''}
                                            onChange={handleDescriptionChange}
                                        />
                                    </Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 1}}>
                                        <FormLabel component="legend">게시 기간 및 시간</FormLabel>
                                    </Stack>
                                    <Stack sx={{mt: 2, mr: 1, ml: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={popularSearchWordsModel.startDate}
                                                inputFormat={"yyyy-MM-dd-HH:mm"}
                                                mask={"____-__-__-__:__"}
                                                onChange={handleChangeDate('startDate')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{width: 180}}/>}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                    <Stack sx={{mt: 2, mr: 1, ml: 1}}>
                                        ~
                                    </Stack>
                                    <Stack sx={{mt: 2, mr: 1, ml: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={popularSearchWordsModel.expireDate}
                                                inputFormat={"yyyy-MM-dd-HH:mm"}
                                                mask={"____-__-__-__:__"}
                                                onChange={handleChangeDate('expireDate')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{width: 180}}/>}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                        <Divider/>
                        <CardContent>
                            <Box sx={{display: 'flex', justifyContent: 'end', mb: 4}}>
                                <Button variant="contained"
                                        startIcon={<AddIcon/>}
                                        size="small"
                                        onClick={handleAddCard}>
                                    키워드 추가
                                </Button>
                            </Box>
                            <Table sx={{ width: '100%' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            ID
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            키워드
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            유형
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            내용
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            활성화 여부
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                {popularSearchWordsModel.keywordItems?.map((item, index) => (
                                    <TableRow
                                        sx={{width: '100%'}}
                                        key={index}>
                                        <TableCell sx={{textAlign: 'center'}}>
                                            {item.id}
                                        </TableCell>
                                        <TableCell sx={{textAlign: 'center'}}>
                                            <Typography sx={{m: 1}}>
                                                <TextField
                                                    id='keyword'
                                                    value={item.keyword || ''}
                                                    onChange={(e) => handleKeywordChange(e, index)}
                                                />
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{textAlign: 'center'}}>
                                            <Box sx={{m: 1}}>
                                                <Select
                                                    value={getType(['CATEGORY', 'BRAND_VIEW', 'KEYWORD'], index)}
                                                    size={"small"}
                                                    onChange={e => {
                                                        changeTypeHandler(e.target.value, index)
                                                    }}
                                                >
                                                    <MenuItem value={'KEYWORD'}>KEYWORD</MenuItem>
                                                    <MenuItem value={'CATEGORY'}>CATEGORY</MenuItem>
                                                    <MenuItem value={'BRAND_VIEW'}>BRAND_VIEW</MenuItem>
                                                </Select>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{textAlign: 'center'}}>
                                            {item.type === 'CATEGORY' ? <WordsBox item={popularSearchWordsModel.keywordItems}
                                                                                  keyword={item}
                                                                                  index={index}
                                            /> : item.type === 'BRAND_VIEW' ?
                                                <Stack
                                                    direction='row'>
                                                    <Box>
                                                        <Input
                                                            type='text'
                                                            value={item.brand != null && item.brand != undefined ? (dataContext.BRAND_MAP[item.brand.id]) ? dataContext.BRAND_MAP[item.brand.id].name : '' : ''}
                                                            readOnly={true}
                                                            disabled={true}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        sx={{p: 0}}
                                                                        onClick={() => handleClickClear(index)}
                                                                    >
                                                                        <ClearIcon/>
                                                                    </IconButton>
                                                                    <IconButton
                                                                        sx={{p: 0}}
                                                                        onClick={() => handleClickBrandOpen(index)}
                                                                    >
                                                                        <SearchIcon/>
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                        />
                                                    </Box>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell sx={{textAlign: 'center'}}>
                                            <Button variant="contained"
                                                    color={item.activated ? 'success' : 'error'}
                                                    sx={{mb: 2, mt: 2}}
                                                    size="small"
                                                    onClick={() => onDelete(item, index)}>
                                                {item.activated ? '활성화' : '비활성화'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </CardContent>
                    </Card>
                </Container>
                <BrandDialog
                    keepMounted
                    open={brandOpen}
                    onClose={handleBrandClose}
                    items={dataContext.BRAND}
                />
            </Box>
        </>
    )
};

PopularSearchWordsDetail.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default PopularSearchWordsDetail;