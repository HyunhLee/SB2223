import {NextPage} from "next";
import {
    Box,
    Button,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import moment from 'moment';
import * as XLSX from "xlsx"
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CustomHairDetail} from "../../components/avatar-custom-components/custom-hair-detail";
import AddIcon from "@mui/icons-material/Add";
import {useRouter} from "next/router";
import {AvatarHair} from "../../types/avatar-custom";
import toast from "react-hot-toast";
import CustomHairCard from "./custom-hair-card";
import {avatarApi} from "../../api/avatar-api";
import AvatarBoard from "../../pages/avatar-custom/avatar-board";
import ReactToPrint from "react-to-print";
import {ListManager} from "react-beautiful-dnd-grid";
import SaveIcon from "@mui/icons-material/Save";
import ListIcon from '@mui/icons-material/List';
import DownloadIcon from "@mui/icons-material/Download";

const AvatarDialog = (props) => {
    const {hairs, setHairs, items, lookbookImage, onClose, open, categoryId = null, ...other} = props;
    const [lists, setLists] = useState<AvatarHair[]>([]);

    const headers = [
        {label:"이미지 URL", key:"mainImageUrl"},
        {label:"기장", key:"hairLengthType"},
        {label:"앞머리", key:"hasBangs"},
        {label:"머리상태", key:"hairType"},
        {label:"등록일", key:"createdDate"}
    ]


    const ComponentToPrint = () => {
        return (
            <AvatarBoard ref={componentRef}
hairs={hairs}
setHairs={setHairs}
onClickApply={handleApply}
changeSelectedList={changeSelectedList}
categoryId={categoryId}
lookbookImage={lookbookImage} />
        );
    };

    const onClickPrint = () => {

    };
    const handleCancel = () => {
        onClose();
    };

    const handleApply = () => {
        onClose(lists);
    };

    const changeSelectedList = (lists) => {
        setLists(lists);
    }

    const originalResultsExcelDownload = useCallback(() => {
        const excelHandler = {
            getExcelFileName:() => {
                return "아바타_헤어_현황_"+ moment().format('YYYYMMDD')+'.xlsx';
            },

            getSheetName: () => {
                return '아바타_헤어'
            },

            getExcelData: () =>{
                return hairs
            },

            getWorksheet: () => {
                return XLSX.utils.json_to_sheet(excelHandler.getExcelData())
            }
        };

        const datas = excelHandler.getWorksheet();
        ['id', '메인이미지', '헤어 길이 타입', '앞머리 유무(TRUE:앞머리있음, FALSE:앞머리 없음)','헤어 타입', '순서', '활성화(TRUE:활성화, FALSE:비활성화)', '생성일', '수정일'].forEach((x, idx) => {
            const cellAdd = XLSX.utils.encode_cell({c:idx, r:0});
            datas[cellAdd].v = x;
        })
        datas['!cols'] = [];
        datas['!cols'][9] = { hidden: true };
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, datas, excelHandler.getSheetName());
        XLSX.writeFile(workbook, excelHandler.getExcelFileName());
    }, [hairs]);


    const componentRef = useRef();

    const pageStyle = `
      @page {
        // size: auto
      }
    
      @media all {
        .page-break {
          display: none;
        }
      }
    
      @media print {
        @page {
          size: A4
        }
        .page-break {
          page-break-after: always;
          margin-top: 5rem;
          display: block;
        }
      }
  `;

    // @ts-ignore
    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            {...other}
        >
            <Stack
                direction='row'
                justifyContent='space-between'>
                <DialogTitle sx={{mt: 1, ml: 1}}>헤어스타일 리스트</DialogTitle>
                <Box display='flex'
sx={{mr:2}}>
                    <Button variant="contained"
                            startIcon={<DownloadIcon/>}
sx={{m:2}}
onClick={originalResultsExcelDownload}>
                        엑셀 다운로드
                    </Button>

                    <ReactToPrint
                        trigger={() =>
                            <Button variant="outlined"
                                    color='info'
sx={{m:2}}
onClick={onClickPrint}>
                                출력
                            </Button>}
                        content={() => componentRef.current}
                        pageStyle={pageStyle}
                    />

                </Box>
            </Stack>
            <DialogContent dividers
ref={componentRef}>
                <ComponentToPrint />
                {/*<AvatarBoard ref={componentRef} hairs={hairs} setHairs={setHairs} onClickApply={handleApply} changeSelectedList={changeSelectedList} categoryId={categoryId} lookbookImage={lookbookImage} />*/}
            </DialogContent>
            <DialogActions>
                <Button color="error"
variant="contained"
onClick={handleCancel}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const AvatarDetailDialog = (props) => {
    const {setData, hair,register,  items, hairLengthType, lookbookImage, onClose, detailOpen, categoryId = null, ...other} = props;
    const [lists, setLists] = useState<AvatarHair[]>([]);

    const handleCancel = () => {
        onClose();
        // location.reload();
    };

    const handleApply = () => {
        onClose(lists);
    };

    const changeSelectedList = (lists) => {
        setLists(lists);
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 1500}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            {...other}
        >

            <DialogContent dividers
style={{height:'800px'}}>
                {/*<AvatarBoard onClickApply={handleApply} changeSelectedList={changeSelectedList} categoryId={categoryId} lookbookImage={lookbookImage} />*/}
                <CustomHairDetail
                    hair={hair}
                    register={register}
                    onClose={onClose}
                    setHair={setData}
                    hairLengthType={hairLengthType}
                />
            </DialogContent>
            <DialogActions>
                <Button color="error"
variant="contained"
onClick={handleCancel}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const CustomHairList: NextPage = () => {
    const [HairCount, setHairCount] = useState<number>(0);
    const [hairs, setHairs] = useState<AvatarHair[]>([])
    const [hair, setHair] = useState<AvatarHair>()
    const [open, setOpen] = React.useState(false);
    const [detailOpen, setDetailOpen] = React.useState(false);
    const [register, setRegister] = React.useState(false);
    const [hairLengthType, setHairLengthType] = useState<string>('LONG');

    useEffect(() => {
        getHairs();
    }, []);

    const getHairs = async () => {
        try {
            const query = {}
            const result = await avatarApi.getAvatarHairs(query);
            setHairs(result.lists);
            setHairCount(result.count);
            // lengthChangeHandler(result.lists);
        } catch (err) {
            console.error(err);
            toast.error('헤어 데이터를 불러오는데 실패하였습니다.');
        }
    }


    const reorder = (startIndex, endIndex) => {
        const list = [...hairs];
        const [removed] = list.splice(startIndex, 1);
        list.splice(endIndex, 0, removed);
        list.filter(hair => hair.hairLengthType === 'LONG').forEach((long,index) => { long.listOrder = index+1; })
        list.filter(hair => hair.hairLengthType === 'MIDDLE').forEach((middle,index) => { middle.listOrder = index+1; })
        list.filter(hair => hair.hairLengthType === 'SHORT').forEach((short,index) => { short.listOrder = index+1; })
        setHairs(list);
    };

    const handleLongDragEnd = (source, destination) => {
        try {
            if (destination === source) {
                return;
            }

            reorder( source, destination );
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    const handleShortDragEnd = (source, destination) => {
        try {
            if (destination === source) {
                return;
            }

            let temp = hairs.filter(hair => hair.hairLengthType === 'LONG').length + hairs.filter(hair => hair.hairLengthType === 'MIDDLE').length

            reorder(source + temp, destination + temp);
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    const handleMiddleDragEnd = (source, destination) => {
        try {
            if (destination === source) {
                return;
            }

            let temp = hairs.filter(hair => hair.hairLengthType === 'LONG').length

            reorder(source + temp, destination + temp);
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    const router = useRouter();
    const handleNewHair = (hairLengthType) => {
        // router.push(`/avatar-custom/new-hair`);
        setRegister(true);
        setDetailOpen(true);
        setHairLengthType(hairLengthType);
    }
    const handleUpdateHair = () => {
        setRegister(false);
        setDetailOpen(true);
    }

    const handlePatchHair = async (id): Promise<void> => {
        if (window.confirm('수정하시겠습니까?')) {
            await avatarApi.postAvatarHairList(hairs);
            toast.success('수정되었습니다.');
        }
    };

    const openAvatarHandler = () => {
        setOpen(true);
    }

    const handleClose = (items) => {
        if (items) {
            // console.log('product', items);
            // addStyleItem(items);
        }
        setOpen(false);
        setDetailOpen(false);
    };

    return (
        <>
            <AvatarDetailDialog
                open={detailOpen}
                onClose={handleClose}
                register={register}
                hair={hair}
                setData={setHairs}
                hairLengthType={hairLengthType}
            />
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                    size='small'
                    color="info"
                    variant="contained"
                    startIcon={<ListIcon />}
                    sx={{height: 40, mr: 2, p: 1}}
                    onClick={() => openAvatarHandler()}
                >
                    현황보기
                </Button>
                <Button
                    size='small'
                    color="primary"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{height: 40, mr: 0.5, p: 1}}
                    onClick={handlePatchHair}
                >
                    수정
                </Button>
            </Box>
            <Typography variant="h5">
                LONG
            </Typography>
            <Stack
                direction='row'>
                <CardContent>
                    <Box
                        sx={{ border: 1, borderRadius: 1, width: '100%' }}>
                        <ListManager
                            items={hairs.filter(hair => hair.hairLengthType === 'LONG')}
                            direction="horizontal"
                            maxItems={8}
                            onDragEnd={handleLongDragEnd}
                            render={(item) => <ListElement item={item}/>
                            }/>
                        <Button sx={{border: 1, borderRadius: 1, borderColor: 'black', m: 1}}
onClick={() => handleNewHair('LONG')}>
                            <AddIcon />
                        </Button>
                    </Box>
                </CardContent>
            </Stack>
            <Divider />
            <Typography variant="h5">
                MIDDLE
            </Typography>
            <Stack
                direction='row'>
                <CardContent>
                    <Box
                        sx={{ border: 1, borderRadius: 1, width: '100%' }}>
                        <ListManager
                            items={hairs.filter(hair => hair.hairLengthType === 'MIDDLE')}
                            direction="horizontal"
                            maxItems={8}
                            onDragEnd={handleMiddleDragEnd}
                            render={(item) => <ListElement item={item}/>
                            }/>

                        <Button sx={{border: 1, borderRadius: 1, borderColor: 'black', m: 1}}
onClick={() => handleNewHair('MIDDLE')}>
                            <AddIcon />
                        </Button>
                    </Box>
                </CardContent>
            </Stack>
            <Divider />
            <Typography variant="h5">
                SHORT
            </Typography>
            <Stack
                direction='row'>
                <CardContent>
                    <Box
                        sx={{ border: 1, borderRadius: 1, width: '100%' }}>
                        <ListManager
                            items={hairs.filter(hair => hair.hairLengthType === 'SHORT')}
                            direction="horizontal"
                            maxItems={8}
                            onDragEnd={handleShortDragEnd}
                            render={(item) => <ListElement item={item}/>
                            }/>
                        <Button sx={{border: 1, borderRadius: 1, borderColor: 'black', m: 1}}
onClick={() => handleNewHair('SHORT')}>
                            <AddIcon />
                        </Button>
                    </Box>
                </CardContent>
            </Stack>
            <AvatarDialog
                open={open}
                onClose={handleClose}
                hairs={hairs}
                setHairs={setHairs}
            />
        </>
    )

    function ListElement({ item: { id, listOrder } }) {
        return (
            <Box sx={{pt: 1, m: 1}}
                 justifyContent="center"
                 display="flex"
            >
                <CustomHairCard
                    data = {hairs}
                    setData={setHairs}
                    item={hairs.find((element) => element.id ===id)}
                    index={listOrder-1}
                    handleUpdateHair={handleUpdateHair}
                    setHairModify={setHair}/>
            </Box>
        );
    }
};
