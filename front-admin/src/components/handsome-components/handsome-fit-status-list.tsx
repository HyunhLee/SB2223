import type {FC} from 'react';
import React, {Fragment, useEffect, useRef, useState} from 'react';
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
} from '@mui/material';
import {Scrollbar} from "../scrollbar";
import {HandsomeFitKanbanColumn} from "./handsome-fit-kanban-column";
import {jennieFitProductAssignmentApi} from "../../handsome-api/jennie-fit-product-assignment-api";
import {HandsomeJennieFitStatus} from "../../types/handsome-model/handsome-jennie-fit-assignment-model";

interface ListProps {
    lists: HandsomeJennieFitStatus[];
    target: string;
}

const defaultData = () => {
    return {
        size: 20,
        page: 1,
    }
}
const ProductWorkerStatusDialog = (props) => {
    const {onClose, open, target, workerId, totalCount} = props;

    const ref = useRef();
    const [search, setSearch] = useState(defaultData)
    const [requestList, setRequestList] = useState<boolean>(true);
    const [columns, setColumns] = useState({
        assign: [],
        inspection: [],
        reject: [],
        complete: [],
    });



    const getFetchData = async () => {
        const query = {
            size: totalCount,
            page: search.page,
            workerId
        }

        const result = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(query);

        let assign ;
        let inspection ;
        let reject ;
        let complete;

            columns.assign = []
            columns.inspection = []
            columns.reject = []
            columns.complete = []
            setColumns(columns)

            assign = columns.assign;
            inspection = columns.inspection;
            reject = columns.reject;
            complete = columns.complete;


        result.lists.forEach(item => {
            switch (item.status) {
                case 'ASSIGNED':
                    assign.push(item);
                    break;
                case 'REQUESTED':
                    inspection.push(item);
                    break;
                case 'REJECTED':
                    reject.push(item);
                    break;
                case 'COMPLETED':
                    complete.push(item);
                    break;
            }
        });
        setRequestList(false);
        setColumns({
            assign,
            inspection,
            reject,
            complete,
        })

    }

    useEffect(
        () => {
            if (open) {
                    (async () => {
                        await getFetchData();
                    })()
            }
        },
        [open,requestList]
    );


    const handleCancel = () => {
        onClose();
        setColumns({
            assign: [],
            inspection: [],
            reject: [],
            complete: [],
        })
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            onClose={handleCancel}
            onBackdropClick={handleCancel}

        >
            <DialogTitle>Jennie Fit Product</DialogTitle>
            <DialogContent dividers>
                <div ref={ref}>
                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        flexShrink: 1,
                        overflowX: 'auto',
                        overflowY: 'none'
                    }}
                >
                    <HandsomeFitKanbanColumn name={'배정됨'}
                                             items={columns.assign}
                                             target={target}
                                             readonly={true}
                                             setRequest={setRequestList}
                    />
                    <HandsomeFitKanbanColumn name={'검수신청'}
                                             items={columns.inspection}
                                             target={target}
                                             readonly={true}
                                             setRequest={setRequestList}/>
                    <HandsomeFitKanbanColumn name={'반려'}
                                             items={columns.reject}
                                             target={target}
                                             readonly={true}
                                             setRequest={setRequestList}/>
                    <HandsomeFitKanbanColumn name={'승인'}
                                             items={columns.complete}
                                             target={target}
                                             readonly={true}
                                             setRequest={setRequestList}/>
                </Box>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const HandsomeFitStatusList: FC<ListProps> = (props) => {
    const {lists, target} = props;

    const [selectedWorkerId, setSelectedWorkerId] = React.useState<number>(null);

    const [openProductWorkerStatus, setOpenProductWorkerStatus] = React.useState(false);

    const [totalCount, setTotalCount] = useState(0);

    const handleClose = () => {
        setOpenProductWorkerStatus(false);
    };

    const handleClick = (workerId, count) => {
        setSelectedWorkerId(workerId);
        setTotalCount(count)
        setOpenProductWorkerStatus(true);

    }

    return (
        <div>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.map((item) => {
                            return (
                                <Fragment key={item.workerId}>
                                    <TableRow
                                        hover
                                        onClick={() => handleClick(item.workerId, item.countNormal + item.countUrgency)}
                                    >
                                        <TableCell align={'center'}>
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
                                    </TableRow>
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <ProductWorkerStatusDialog
                open={openProductWorkerStatus}
                onClose={handleClose}
                target={target}
                workerId={selectedWorkerId}
                totalCount = {totalCount}
            />
        </div>
    );
};