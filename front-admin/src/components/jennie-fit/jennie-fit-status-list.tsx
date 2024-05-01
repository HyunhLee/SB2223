import type {FC} from 'react';
import React, {Fragment, useEffect, useState} from 'react';
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
import {JennieFitStatus} from "../../types/jennie-fit-assignment-model";
import {jennieFitUserAssignmentApi} from "../../api/jennie-fit-user-assignment-api";
import {JennieFitKanbanColumn} from "./jennie-fit-kanban-column";
import {jennieFitProductAssignmentApi} from "../../api/jennie-fit-product-assignment-api";

interface ListProps {
  lists: JennieFitStatus[];
  target: string;
  workDayFrom: Date,
  workDayTo: Date,
}

const UserWorkerStatusDialog = (props) => {
  const {onClose, open, target, workerId, workDayFrom, workDayTo} = props;

  const [columns, setColumns] = useState({
    assign: [],
    inspection: [],
    reject: [],
    complete: [],
  });

  useEffect(
      () => {
        if (open) {
          (async () => {
            const query = {
              workerId,
              startDate: workDayFrom,
              endDate: workDayTo,
            }
            const result = await jennieFitUserAssignmentApi.getJennieFitAssignmentsWithUserDress(query);
            const assign = [];
            const inspection = [];
            const reject = [];
            const complete = [];
            result.lists.forEach(item => {
              // @ts-ignore
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
            setColumns({
              assign,
              inspection,
              reject,
              complete,
            })
          })()
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [open]
  );

  const handleCancel = () => {
    onClose();
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
        <DialogTitle>Jennie Fit User</DialogTitle>
        <DialogContent dividers>
          <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                flexShrink: 1,
                overflowX: 'auto',
                overflowY: 'none'
              }}
          >
            <JennieFitKanbanColumn name={'배정됨'}
items={columns.assign}
target={target}
readonly={true}/>
            <JennieFitKanbanColumn name={'검수신청'}
items={columns.inspection}
target={target}
readonly={true}/>
            <JennieFitKanbanColumn name={'반려'}
items={columns.reject}
target={target}
readonly={true}/>
            <JennieFitKanbanColumn name={'승인'}
items={columns.complete}
target={target}
readonly={true}/>
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

const ProductWorkerStatusDialog = (props) => {
  const {onClose, open, target, workerId, workDayFrom, workDayTo} = props;

  const [columns, setColumns] = useState({
    assign: [],
    inspection: [],
    reject: [],
    complete: [],
  });

  useEffect(
      () => {
        if (open) {
          (async () => {
            const query = {
              workerId,
              startDate: workDayFrom,
              endDate: workDayTo,
            }
            const result = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(query);
            const assign = [];
            const inspection = [];
            const reject = [];
            const complete = [];
            result.lists.forEach(item => {
              // @ts-ignore
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
            setColumns({
              assign,
              inspection,
              reject,
              complete,
            })
          })()
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [open]
  );

  const handleCancel = () => {
    onClose();
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
          <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                flexShrink: 1,
                overflowX: 'auto',
                overflowY: 'none'
              }}
          >
            <JennieFitKanbanColumn name={'배정됨'}
items={columns.assign}
target={target}
readonly={true}/>
            <JennieFitKanbanColumn name={'검수신청'}
items={columns.inspection}
target={target}
readonly={true}/>
            <JennieFitKanbanColumn name={'반려'}
items={columns.reject}
target={target}
readonly={true}/>
            <JennieFitKanbanColumn name={'승인'}
items={columns.complete}
target={target}
readonly={true}/>
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

export const JennieFitStatusList: FC<ListProps> = (props) => {
  const {lists, target, workDayFrom, workDayTo} = props;

  const [selectedWorkerId, setSelectedWorkerId] = React.useState<number>(null);

  const [openProductWorkerStatus, setOpenProductWorkerStatus] = React.useState(false);
  const [openUserWorkerStatus, setOpenUserWorkerStatus] = React.useState(false);

  const handleClose = () => {
    if (target === 'USER') {
      setOpenUserWorkerStatus(false);
    } else if (target === 'PRODUCT') {
      setOpenProductWorkerStatus(false);
    }
  };

  const handleClick = (workerId) => {
    setSelectedWorkerId(workerId);
    if (target === 'USER') {
      setOpenUserWorkerStatus(true);
    } else if (target === 'PRODUCT') {
      setOpenProductWorkerStatus(true);
    }
  }

  return (
      <div>
        <Scrollbar>
          <Table sx={{ minWidth: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  ADMIN_DD
                </TableCell>
                <TableCell>
                  총 작업
                </TableCell>
                <TableCell>
                  일반작업
                </TableCell>
                <TableCell>
                  긴급작업
                </TableCell>
                <TableCell>
                  반려
                </TableCell>
                <TableCell>
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
                          key={item.workerId}
                          onClick={() => handleClick(item.workerId)}
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
                      </TableRow>
                    </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
        <UserWorkerStatusDialog
            open={openUserWorkerStatus}
            onClose={handleClose}
            target={target}
            workerId={selectedWorkerId}
            workDayFrom={workDayFrom}
            workDayTo={workDayTo}
        />
        <ProductWorkerStatusDialog
            open={openProductWorkerStatus}
            onClose={handleClose}
            target={target}
            workerId={selectedWorkerId}
            workDayFrom={workDayFrom}
            workDayTo={workDayTo}
        />
      </div>
  );
};