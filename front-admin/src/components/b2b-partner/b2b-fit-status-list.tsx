import {Scrollbar} from "../scrollbar";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import React, {Fragment, useContext, useEffect, useState} from "react";
import BtbFitKanbanColumn from "./b2b-fit-kanban-column";
import {DataContext} from "../../contexts/data-context";
import {btbJennieFitProductAssignmentApi} from "../../b2b-partner-api/b2b-jennie-fit-assignment-api";


const WorkerStatusDialog = (props) => {
    const {open, onClose, selectedWorker} = props;

    const dataContext = useContext(DataContext);
    const [loading, setLoading] = useState(false)
    const [columns, setColumns] = useState({
        assign: [],
        inspection: [],
        reject: [],
        complete: [],
    });

    const handleCancel = () => {
        onClose();
    }

    useEffect(() => {
        if(open){
            (async () => {
                await getFetchData();
            })()
        }

    },[open, loading])

    const getFetchData = async () => {
        const result = await btbJennieFitProductAssignmentApi.getJennieFitAssignmentWorkersWorkList(selectedWorker)

        const assign = [];
        const inspection = [];
        const reject = [];
        const complete = [];
        result.forEach(( item ) =>{
            switch (item.jennieFitAssignmentStatus) {
                case 'Assigned':
                    assign.push(item);
                    break;
                case 'Requested':
                    inspection.push(item);
                    break;
                case 'Rejected':
                    reject.push(item);
                    break;
                case 'Completed':
                    complete.push(item);
                    break;
            }
        });
        setColumns({
            assign,
            inspection,
            reject,
            complete,
        })

    }

    return (
        <Dialog
            open={open}
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}>
            <DialogTitle>B2B Product Jennie Fit Assign</DialogTitle>
            <DialogContent dividers>
                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        flexShrink: 1,
                        overflowX: 'auto',
                        overflowY: 'none',
                        justifyContent: 'center'
                    }}>
                    <BtbFitKanbanColumn items={columns.assign}
status={dataContext.BTB_ASSIGN_STATUS['Assigned']}
setLoading={setLoading} />
                    <BtbFitKanbanColumn items={columns.inspection}
status={dataContext.BTB_ASSIGN_STATUS['Requested']}
setLoading={setLoading} />
                    <BtbFitKanbanColumn items={columns.reject}
status={dataContext.BTB_ASSIGN_STATUS['Rejected']}
setLoading={setLoading} />
                    <BtbFitKanbanColumn items={columns.complete}
status={dataContext.BTB_ASSIGN_STATUS['Completed']}
setLoading={setLoading}/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );

}

const BtbFitStatusList = (props) => {
    const { lists, workDayTo, workDayFrom} = props;
    let totalCount ;

    const [openWorkerStatusList, setOpenWorkerStatusList] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState({workerId: null , size: null, workDayFrom: null, workDayTo: null, jennieFitAssignmentStatus:''});

    const handleClick = (id, count) => {
        setOpenWorkerStatusList(true);
        setSelectedWorker({workerId : id, size : count, workDayFrom: workDayFrom, workDayTo: workDayTo, jennieFitAssignmentStatus: 'Unworkable'})
    }

    const handleClose = ()=> {
        if(openWorkerStatusList){
            setOpenWorkerStatusList(false)
        }else{
            setOpenWorkerStatusList(true)
        }
    }

    return (
        <>
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                ADMIN_DD
                            </TableCell>
                            <TableCell align="center">
                                총 작업
                            </TableCell>
                            <TableCell align="center">
                                일반작업
                            </TableCell>
                            <TableCell align="center">
                                긴급작업
                            </TableCell>
                            <TableCell align="center">
                                반려
                            </TableCell>
                            <TableCell align="center">
                                승인
                            </TableCell>
                            <TableCell align="center">
                                근무상태
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.map((item) => {
                            totalCount = item.countNormal + item.countUrgency
                            return (
                                <Fragment key={item.workerId}>
                                    <TableRow
                                        hover
                                        onClick={() => handleClick(item.workerId, item.countNormal + item.countUrgency, )}
                                    >
                                        <TableCell>
                                            <Link sx={{cursor: 'pointer'}}>
                                                {item.workerName}
                                            </Link>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.countNormal + item.countUrgency}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.countNormal}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.countUrgency}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.countRejected}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.countCompleted}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            -
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <WorkerStatusDialog
                open={openWorkerStatusList}
                onClose ={handleClose}
                selectedWorker={selectedWorker}
            />
        </>
    )
}

export default BtbFitStatusList;
