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
import React, {ChangeEvent, useContext, useRef, useState} from "react";
import {defaultPKeywordGroupModel, defaultPKeywordItemModel, PKeywordGroupModel} from "../../types/popular-keywords";
import {useRouter} from "next/router";
import {popularSearchWordsApi} from "../../api/popular-search-words-api";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WordsBox from "../../components/popular-search-words-component/words-box";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {BrandDialog} from "../../components/dialog/brand-dialog";
import {DataContext} from "../../contexts/data-context";
import DeleteIcon from "@mui/icons-material/Delete";

const PopularSearchWordsRegistration: NextPage = () => {
    const router = useRouter();
    const dataContext = useContext(DataContext);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [brandOpen, setBrandOpen] = useState(false);
    const [idx, setIdx] = useState<number>(null);
    const [pKeywordGroupModel, setPKeywordGroupModel] = useState<PKeywordGroupModel>(defaultPKeywordGroupModel)

    const handleChangeDate = (prop: keyof PKeywordGroupModel) => (value) => {
        console.log('time ->', value)
        setPKeywordGroupModel({ ...pKeywordGroupModel, [prop]: value });
    };

    const handleAddCard = () => {
        let keywordItemsTemp = pKeywordGroupModel.keywordItems;
        let keywordItemTemp = defaultPKeywordItemModel();
        keywordItemTemp.listOrder = pKeywordGroupModel.keywordItems.length+1;
        keywordItemsTemp.push(keywordItemTemp);
        setPKeywordGroupModel({ ...pKeywordGroupModel, keywordItems: keywordItemsTemp });
    }

    const handleAdd = async (): Promise<void> => {
        console.log("############# pKeywordGroupModel : " , pKeywordGroupModel)
        if(pKeywordGroupModel.description === '') {
            toast.error("타이틀을 입력해주세요.")
            return;
        }
        if(pKeywordGroupModel.keywordItems.length === 0) {
            toast.error("키워드를 최소한 1가지는 입력해주세요.")
            return;
        }
        if(pKeywordGroupModel.startDate === "" || pKeywordGroupModel.expireDate === "") {
            toast.error("게시 기간을 입력해주세요.")
            return;
        }

        if(window.confirm("저장하시겠습니까?")) {
            await popularSearchWordsApi.postKeywordGroup(pKeywordGroupModel)
                .then(res => {
                    console.log(res)
                    toast.success("키워드 그룹이 저장되었습니다.");
                    router.push('/popular-search-words/popular-search-words')
                })
                .catch((err) => {
                    console.log(err)
                    toast.error("키워드 그룹 저장에 실패하였습니다.");
                })
        }
    }

    const onDelete = (item) => {
        if(pKeywordGroupModel.keywordItems.length > 1) {
            let keywordItemsTemp = pKeywordGroupModel.keywordItems
            keywordItemsTemp.splice(keywordItemsTemp.indexOf(item), 1);
            keywordItemsTemp.map((value, index) => {
                value.listOrder = index + 1;
            })
            setPKeywordGroupModel({...pKeywordGroupModel, keywordItems: keywordItemsTemp});
        }
    }

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setPKeywordGroupModel({ ...pKeywordGroupModel, description: event.target.value });
    }

    const handleKeywordChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number): void => {
        let word = pKeywordGroupModel.keywordItems;
        word[index].keyword = event.target.value;
        setPKeywordGroupModel({...pKeywordGroupModel, keywordItems: word});
    }

    const handleBack = (e) => {
        e.preventDefault();
        router.push(`/popular-search-words/popular-search-words?storeSearch=true`);
    }

    const getType = (checkValues, index) => {
        const keywordTemp = pKeywordGroupModel.keywordItems;
        if (keywordTemp[index].type) {
            const findValue = checkValues.find(value => keywordTemp[index].type.includes(value));
            return (findValue) ? findValue : '';
        }
        return '';
    }

    const handleClickClear = (index) => {
        const keywordTemp = pKeywordGroupModel.keywordItems;
        keywordTemp[index].brand.id = null;
        setPKeywordGroupModel({...pKeywordGroupModel, keywordItems: keywordTemp});
    };

    const changeTypeHandler = (value, index): void => {
        const keywordTemp = pKeywordGroupModel.keywordItems;
        keywordTemp[index].type = value
        setPKeywordGroupModel({...pKeywordGroupModel, keywordItems: keywordTemp});
    }

    const handleClickBrandOpen = (index) => {
        setIdx(index);
        setBrandOpen(true);
    };

    const handleBrandClose = (value) => {
        if (value) {
            const keywordTemp = pKeywordGroupModel.keywordItems;
            keywordTemp[idx].brand.id = value.id
            setPKeywordGroupModel({...pKeywordGroupModel, keywordItems: keywordTemp});
        }
        setBrandOpen(false);
    };

    return (
        <>
            <Head>
                Popular Search Words | Style Bot
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
                        <Stack
                            direction={'row'}
                            sx={{justifyContent: "space-between"}}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    인기 키워드 등록
                                </Typography>
                            </Grid>
                            <Grid>
                                <Button variant="contained"
                                        sx={{mt: 0.5}}
                                        startIcon={<SaveIcon />}
                                        size="small"
                                        onClick={handleAdd}>
                                    저장
                                </Button>
                            </Grid>
                        </Stack>
                    </Box>
                    <Divider />
                    <Card sx={{py: 1}}>
                        <CardContent>
                            <Stack direction="row"
                                   sx={{ mb: 2 }}>
                                <Stack justifyContent={"center"}
                                       sx={{mt: 1, ml: 1}}>
                                    <FormLabel component="legend">TITLE</FormLabel>
                                </Stack>
                                <Stack>
                                    <Typography sx={{m:1}}>
                                        <TextField
                                            id='description'
                                            value={pKeywordGroupModel.description || ''}
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
                                                value={pKeywordGroupModel.startDate}
                                                inputFormat={"yyyy-MM-dd-HH:mm"}
                                                mask={"____-__-__-__:__"}
                                                onChange={handleChangeDate('startDate')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{width: 180}} />}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                    <Stack sx={{mt: 2, mr: 1, ml: 1}}>
                                        ~
                                    </Stack>
                                    <Stack sx={{mt: 2, mr: 1, ml: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={pKeywordGroupModel.expireDate}
                                                inputFormat={"yyyy-MM-dd-HH:mm"}
                                                mask={"____-__-__-__:__"}
                                                onChange={handleChangeDate('expireDate')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{width: 180}} />}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                        <Divider />
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
                                            삭제
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                {pKeywordGroupModel.keywordItems?.map((item, index) => (
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
                                            {item.type === 'CATEGORY' ? <WordsBox item={pKeywordGroupModel.keywordItems}
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
                                            <Button variant="outlined"
                                                    color={'error'}
                                                    sx={{mb: 2, mt: 2}}
                                                    startIcon={<DeleteIcon />}
                                                    size="small"
                                                    onClick={() => onDelete(item)}>
                                                {'삭제'}
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

PopularSearchWordsRegistration.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default PopularSearchWordsRegistration;