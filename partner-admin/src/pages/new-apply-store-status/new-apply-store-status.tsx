import React, {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import toast from 'react-hot-toast';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {useRouter} from "next/router";
import {format} from "date-fns";
import {ApplyStoreList} from "../../components/new-apply-store-status/apply-store-list";
import {newApplyStoreStatusApi} from "../../api/new-apply-store-status-api";
import {ApplyStoreModels, Brand, Business} from "../../types/apply-store-model";
import {useTranslation} from "react-i18next";

interface Search {
    id?: number;
    userId: string;
    password: string;
    passwordCheck: string;
    managerName: string;
    managerPhoneNumber: number;
    certificationNumber: string;
    companyRegistrationNumber: number;
    companyName: string;
    representativeName: string;
    business: Business[];
    companyAddress: string;
    companyDetailAddress: string;
    businessRegistration: File[];
    mailOrderBusinessCertificate: File[];
    companyUrl: string;
    brand: Brand[];
    agreePolicy: boolean;
    agreeTerm: boolean;
    agreeTenor: boolean;
    createdDate: string;
    applyStatus: string;
    size: number;
    page: number;
    startDate: Date;
    endDate: Date;
}

const defaultSearch = () => {
    return {
        id: null,
        userId: "",
        password: "",
        passwordCheck: "",
        managerName: "",
        managerPhoneNumber: null,
        certificationNumber: "",
        companyRegistrationNumber: null,
        companyName: "",
        representativeName: "",
        business: [{
            businessStatus: "",
            businessEvent: ""
        }],
        companyAddress: "",
        companyDetailAddress: "",
        businessRegistration: [],
        mailOrderBusinessCertificate: [],
        businessRegistrationUrl: "",
        mailOrderBusinessCertificateUrl: "",
        companyUrl: "",
        brand: [{
            brandNameKo: "",
            brandNameEn: "",
            brandShopUrl: "",
            brandIntroduce: "",
            brandIntroduction: [],
            brandIntroductionUrl: ""
        }],
        agreePolicy: false,
        agreeTerm: false,
        agreeTenor: false,
        createdDate: "",
        applyStatus: "",
        startDate: null,
        endDate: null,
        size: 10,
        page: 0
    }
}


export const NewApplyStoreStatus: NextPage = () => {

    const {t} = useTranslation();
    const [list, setLists] = useState<ApplyStoreModels[]>([]);
    const [count, setCount] = useState<number>(0);

    const [requestList, setRequestList] = useState<boolean>(false);

    const [search, setSearch] = useState<Search>(defaultSearch());

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

    const router = useRouter();
    const {storeSearch} = router.query;

    useEffect(() => {
        if (storeSearch === 'true') {
            const NewApplyStoreStatusSearch = sessionStorage.getItem('NewApplyStoreStatusSearch');
            setSearch(JSON.parse(NewApplyStoreStatusSearch));
        }
        setRequestList(true);
    }, []);

    useEffect(
        () => {
            sessionStorage.setItem('NewApplyStoreStatusSearch', JSON.stringify(search));
        },
        [search]
    );

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

    const handleRefreshList = async (): Promise<void> => {
        setRequestList(true);
    };

    const getLists = async () => {
        try {
            const query = {
                ...search
            }
            const result = await newApplyStoreStatusApi.getStatusList(query);
            setLists(result.lists);
            setCount(result.count);

        } catch (err) {
            console.error(err);
            toast.error('데이터를 불러오는데 실패하였습니다.');
        }
    }

    const handleChange =
        (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
            setSearch({...search, [prop]: event.target.value});
        };

    const changeApplyStatus = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            applyStatus: value
        }))
    }

    const handleChangeDate =
        (prop: keyof Search) => (value) => {
            setSearch({...search, [prop]: format(value, 'yyyy-MM-dd')});
        };

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const getApplyStatus = () => {
        return (search.applyStatus) ? search.applyStatus : '';
    }

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setRequestList(true);
    }

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleClickSearch()
        }
    }

    return (
        <>
            <Head>
                Style | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2
                }}
            >
                <Container maxWidth="xl">
                    <Card sx={{py: 1}}>
                        <CardContent sx={{py: 1}}>
                            <Stack direction={"row"}>
                                <Grid
                                    sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Typography
                                        variant="h4">{t("pages_newApplyStoreStatus_newApplyStoreStatus_typography_header")}</Typography>
                                </Grid>
                            </Stack>
                            <Stack direction="row"
                                   sx={{mb: 1, mt: 2}}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 3, mt: 1}}>
                                    <FormLabel
                                        component="legend">{t("pages_newApplyStoreStatus_newApplyStoreStatus_formLabel_status")}</FormLabel>
                                </Stack>
                                <Select
                                    size={"small"}
                                    value={getApplyStatus()}
                                    onChange={e => {
                                        changeApplyStatus(e.target.value)
                                    }}
                                >
                                    <MenuItem value={''}>전체</MenuItem>
                                    <MenuItem value={'APPLY'}>신청</MenuItem>
                                    <MenuItem value={'APPLY_COMPLETED'}>입점 승인</MenuItem>
                                    <MenuItem value={'REJECTED'}>반려</MenuItem>
                                </Select>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 1}}>
                                    <FormLabel
                                        component="legend">{t("pages_newApplyStoreStatus_newApplyStoreStatus_formLabel_date")}</FormLabel>
                                </Stack>
                                <Stack>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={search.startDate}
                                            inputFormat={"yyyy-MM-dd"}
                                            mask={"____-__-__"}
                                            onChange={handleChangeDate('startDate')}
                                            renderInput={({inputRef, inputProps, InputProps}) => (
                                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                    <input ref={inputRef}
                                                           {...inputProps}
                                                           readOnly={true}
                                                           style={{
                                                               height: 30,
                                                               width: 150,
                                                               borderTop: 1,
                                                               borderRight: 1,
                                                               borderLeft: 1,
                                                               fontSize: 15
                                                           }}/>
                                                    {InputProps?.endAdornment}
                                                </Box>
                                            )}
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
                                            inputFormat={"yyyy-MM-dd"}
                                            mask={"____-__-__"}
                                            onChange={handleChangeDate('endDate')}
                                            renderInput={({inputRef, inputProps, InputProps}) => (
                                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                    <input ref={inputRef}
                                                           {...inputProps}
                                                           readOnly={true}
                                                           style={{
                                                               height: 30,
                                                               width: 150,
                                                               borderTop: 1,
                                                               borderRight: 1,
                                                               borderLeft: 1,
                                                               fontSize: 15
                                                           }}/>
                                                    {InputProps?.endAdornment}
                                                </Box>
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                            </Stack>
                            <Stack sx={{ml: 2}} direction="row">
                                <TextField
                                    label={t("pages_newApplyStoreStatus_newApplyStoreStatus_textField_componyName")}
                                    variant="standard"
                                    value={search.companyName == null ? '' : search.companyName}
                                    onChange={handleChange('companyName')}
                                    onKeyUp={handleKeyUp}
                                    sx={{m: 1}}
                                />
                            </Stack>
                            <Stack direction="row"
                                   justifyContent={"flex-end"}>
                                <Button size='small'
                                        variant="outlined"
                                        sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                        onClick={handleClickReset}>
                                    {t("button_clickClear")}
                                </Button>
                                <Button size='small'
                                        color="primary"
                                        variant="contained"
                                        sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                        startIcon={<SearchIcon/>}
                                        onClick={handleClickSearch}>
                                    {t("button_clickSearch")}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card sx={{mt: 1}}>
                        <ApplyStoreList
                            lists={list}
                            count={count}
                            refreshList={handleRefreshList}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={search.size}
                            page={search.page}
                            getLists={getLists}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
}

NewApplyStoreStatus.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default NewApplyStoreStatus;