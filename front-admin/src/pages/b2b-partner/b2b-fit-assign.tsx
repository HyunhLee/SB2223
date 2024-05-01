import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {NextPage} from "next";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ProductFitAssign from "../../components/b2b-partner/b2b-product-fit-assign";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import BtbFitStatusList from "../../components/b2b-partner/b2b-fit-status-list";
import SearchIcon from "@mui/icons-material/Search";
import {
    BtbJennieFitWorkersWorks,
    defaultFitAssignSearch,
    FitAssignSearch,
} from "../../types/b2b-partner-model/b2b-jennie-fit-worker-model";
import {btbJennieFitProductAssignmentApi} from "../../b2b-partner-api/b2b-jennie-fit-assignment-api";
import ProductFitReassign from "../../components/b2b-partner/b2b-product-fit-reassign";

const BtbProductAssignDialog = (props) => {
    const {open, onClose} = props;

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={open}
                sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
                maxWidth="xl"
                fullWidth={true}>
            <DialogTitle>Product</DialogTitle>
            <DialogContent>
                <ProductFitAssign/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const BtbProductReassignDialog = (props) => {
    const {open, onClose} = props;
    const handleClose = () => {
        onClose();
    }
    return (
        <Dialog open={open}
                sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
                maxWidth="xl"
                fullWidth={true}>
            <DialogTitle>Product</DialogTitle>
            <DialogContent>
                <ProductFitReassign/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const BtbProductFitAssign: NextPage = () => {
    const [search, setSearch] = useState<FitAssignSearch>(defaultFitAssignSearch)
    const [worksList, setWorksList] = useState([]);
    const [list, setList] = useState<BtbJennieFitWorkersWorks[]>([]);

    const [openAssign, setOpenAssign] = useState(false);
    const [openReassign, setOpenReassign] = useState(false);

    const handleProductAssign = async () => {
        if (openAssign) {
            setOpenAssign(false)
            await getLists();
            await getWorkers();
        } else {
            setOpenAssign(true)
        }
    }

    const handleProductReassign = async () => {
        if (openReassign) {
            setOpenReassign(false)
            await getLists();
            await getWorkers();
        } else {
            setOpenReassign(true)
        }
    }

    const handleClickReset = () => {
        setSearch(defaultFitAssignSearch)
    }

    const handleSearchDate = (prop: keyof FitAssignSearch) => (value) => {
        setSearch({...search, [prop]: value});
    };


    const getWorkers = async () => {
        const response = await btbJennieFitProductAssignmentApi.getJennieFitAssignmentWorkerList({workType: 'FitProduct'});
        setWorksList(response)

    }

    const filterWorkerList = () => {
        return worksList?.map((worker) => {
            const workerId = String(worker.workerId);
            return (<MenuItem key={workerId}
                              value={workerId}>{worker.workerName}</MenuItem>)
        });
    }

    const handleWorkerName = (event) => {
        setSearch({...search, workerId: event.target.value})
    }


    const getLists = async () => {
        const result = await btbJennieFitProductAssignmentApi.getJennieFitAssignmentWorkers(search)
        setList(result)
    }

    useEffect(() => {
        (async () => {
            await getLists();
            await getWorkers();
        })()
    }, [])

    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2
                }}>
                <Container maxWidth="xl">
                    <Box sx={{mb: 1, py: 2, ml: 3, mt: 2}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Typography variant="h4">
                                B2B Product Fit Assign
                            </Typography>
                        </Grid>
                    </Box>
                    <Grid container>
                        <Grid sx={{width: "100%"}}>
                            <Card>
                                <Stack direction="row"
                                       sx={{ml: 1, mt: 2}}>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 2, ml: 1, mt: 2}}>
                                        <FormLabel> 작업일 </FormLabel>
                                    </Stack>
                                    <Stack sx={{mt: 2, px: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.workDayFrom}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleSearchDate('workDayFrom')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{width: 200}}/>}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                    <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                                        ~
                                    </Stack>
                                    <Stack sx={{mt: 2, px: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.workDayTo}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleSearchDate('workDayTo')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{width: 200}}/>}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                    <Stack direction="row"
                                           sx={{ml: 5, mt: 2}}>
                                        <FormLabel sx={{mt: 1}}>ADMIN DD</FormLabel>
                                        <Select
                                            value={search.workerId || ''}
                                            size={"small"}
                                            sx={{minWidth: 200, ml: 2}}
                                            onChange={handleWorkerName}
                                        >
                                            <MenuItem value={'0'}>전체</MenuItem>
                                            {filterWorkerList()}
                                        </Select>
                                    </Stack>
                                </Stack>
                                <Stack direction="row"
                                       justifyContent={"flex-end"}
                                       sx={{mb: 3, mr: 2}}>
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
                                            onClick={getLists}>
                                        검색
                                    </Button>
                                </Stack>
                                <Divider/>
                                <CardHeader
                                    action={
                                        <>
                                            <Button size='small'
                                                    variant="outlined"
                                                    sx={{mr: 1}}
                                                    onClick={handleProductAssign}>
                                                상품 데이터 - 수동 배정
                                            </Button>
                                            <Button size='small'
                                                    variant="outlined"
                                                    onClick={handleProductReassign}>
                                                작업 재배정
                                            </Button>
                                        </>
                                    }/>
                                <BtbFitStatusList lists={list}
                                                  searchQuery={search}
workDayFrom={search.workDayFrom}
workDayTo={search.workDayTo}/>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <BtbProductAssignDialog open={openAssign}
                                    onClose={handleProductAssign}/>
            <BtbProductReassignDialog open={openReassign}
                                      onClose={handleProductReassign}/>
        </>
    )

}

BtbProductFitAssign.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default BtbProductFitAssign;
