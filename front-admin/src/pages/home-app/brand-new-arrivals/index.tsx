import React, {useContext, useEffect, useState} from "react";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import {
    Box,
    Button,
    Card,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import {BrandDialog} from "../../../components/dialog/brand-dialog";
import {DataContext} from "../../../contexts/data-context";
import {ImageDialog} from "../../../components/widgets/image-widget";
import {brandUpdateList} from "../../../types/brand-model";
import {brandApi} from "../../../api/brand-api";
import toast from "react-hot-toast";
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';


const BrandNewArrivals = () => {
    const dataContext = useContext(DataContext);
    const [itemsList, setItemsList] = useState<brandUpdateList[]>()
    const [indexNum, setIndexNum] = useState(null);
    const [brandOpen, setBrandOpen] = useState<boolean>(false);
    const [openImg, setOpenImg] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [reset, setReset] = useState<boolean>(false)


    useEffect(() => {
        (async  () => {
            const result = await brandApi.getBrandUpdateList()
            setItemsList(result)
        })()
    },[reset])


    const toggleActivatedBtn = (value, index) => {
        if(itemsList[index-1]?.activated == false && value == false) {
            window.confirm(`순차적으로 활성화시켜주세요`);
            return;
        }
        setItemsList(itemsList.map((v, i) =>
            i == index ? {
            ...v,
            activated : !v.activated,
            listOrder: i + 1
        } : v))
    }

    const handleClickBrandOpen = (index) => {
        setBrandOpen(true);
        setIndexNum(index)

    };

    const handleBrandClose = (value) : any => {
        if (value) {
            if(value.activated){
                const temp = itemsList.filter((v) => v.brand.id === value.id)
                if (temp.length > 0) {
                    window.confirm('브랜드가 중복선택 되었습니다. 브랜드 입력란을 확인해주세요')
                    return;
                } else {
                    setItemsList(itemsList.map((v, i) => i == indexNum ? {
                        ...v,
                        brand: {...value},
                        listOrder: i + 1
                    } : v))
                }
            }else {
                window.confirm(`현재 진열중지 된 브랜드입니다!`)
                return;
            }
        }
        setBrandOpen(false);
    };

    const handleCloseImg = () => {
        setOpenImg(false);
    }

    const openImgDialog = (id) => {
        let temp = itemsList.filter((v, i) => v.brand.id == id ? setPreviewUrl(v.brand.thumbnailImageUrl) : null)
        console.log(temp)
        setOpenImg(true)
    }


    const handleSave = async () => {
        //활성화칸이 최소5개인지
        let falseCount = 0;
        itemsList.forEach((v, index) => {
            if(!v.activated) return falseCount++
        })
        if(falseCount > 5){
            window.confirm('최소 5개의 브랜드를 활성화해주세요.')
            return;
        }else{
            for(let el of itemsList){
                if(el.brand.id == null){
                    window.confirm('브랜드가 미선택 되었습니다. 브랜드 입력란을 확인해주세요')
                    return;
                }
            }

            const status = await brandApi.putBrandUpdateList(itemsList)
            if(status == 200){
                window.confirm(`브랜드 리스트 적용이 완료되었습니다.`)
            }
        }
    }

    const handleReset = () => {
        setReset(!reset)
    }

    const reorder = (list, startIndex, endIndex) => {
        console.log(list, startIndex);
        const result = [...list]
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.forEach((v, idx) => { v.listOrder = idx + 1, v.id= idx + 1})

        return result;
    };

    const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
        try {
            if (!destination) {
                return;
            }
            const orderItems = reorder(
              itemsList,
              source.index,
              destination.index
            );
            // @ts-ignore
            setItemsList(orderItems)
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };



    return(
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                    px:2
                }}
            >
            <Box sx={{mb: 4, px: 4}}>
                <Stack
                    direction={'row'}
                    sx={{justifyContent: "space-between"}}
                >
                    <Grid item>
                        <Typography variant="h4">
                            브랜드 신상품 업데이트
                        </Typography>
                    </Grid>
                    <Grid>
                        <Button variant="outlined"
                                size="small"
                                onClick={handleReset}
                                sx={{mr: 2}}
                        >
                            초기화
                        </Button>
                        <Button size='small'
                                color="primary"
                                variant="contained"
                                startIcon={<SaveIcon/>}
                                onClick={handleSave}>
                            저장
                        </Button>
                    </Grid>
                </Stack>
            </Box>
                <Card>
                    <Table sx={{ width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    no.
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                   브랜드
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    썸네일
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    활성화 여부
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="droppable"
direction="vertical">
                                {(provided) => (
                                    <TableBody ref={provided.innerRef}
                                               {...provided.droppableProps}>
                                        {itemsList?.slice(0,10).map((item, index) => {
                                            return (
                                              <Draggable
                                                key={`${item.id}`}
                                                draggableId={`${item.id}`}
                                                index={index}>
                                                  {(provided) => (
                                                    <TableRow
                                                      sx={{width: '100%'}}
                                                      key={index}
                                                      ref={provided.innerRef}
                                                      {...provided.dragHandleProps}
                                                      {...provided.draggableProps}>
                                                        <TableCell sx={{ textAlign: 'center' }}>
                                                            {item.id}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }}>
                                                            <Stack justifyContent={"center"}
                                                                   sx={{mt: 1.5, ml:1, height: 50, border: '1px solid #dfdfdf', borderRadius: 1, px: 1}}>
                                                                <Input
                                                                    type='text'
                                                                    value={item?.brand.name || ''}
                                                                    readOnly={true}
                                                                    disabled={true}
                                                                    disableUnderline={true}
                                                                    endAdornment={
                                                                        <InputAdornment position="end" >
                                                                            <IconButton
                                                                                sx={{p: 0}}
                                                                                onClick={() => handleClickBrandOpen(index)}
                                                                            >
                                                                                <SearchIcon />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    }
                                                                />
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell sx={{
                                                            textAlign: 'center',
                                                            // display: "flex",
                                                            // alignItems: 'center',
                                                            // justifyContent: "center",
                                                            // verticalAlign: 'middle',
                                                            py: 3,
                                                        }}>
                                                            {item.brand.thumbnailImageUrl == null || item.brand.thumbnailImageUrl.length > 0 ?
                                                                <>
                                                                    <img
                                                                        src={`${item.brand.thumbnailImageUrl}`}
                                                                        style={{width: 100, height: 100, borderRadius: '50%', cursor : 'pointer',}}
                                                                        loading="lazy"
                                                                        onClick={() => openImgDialog (item.brand.id)}
                                                                    />
                                                                    <ImageDialog  open={openImg}
                                                                                  onClose={handleCloseImg}
                                                                                  imageName={previewUrl}
                                                                                  imageUrl={previewUrl} />
                                                                </> : <>
                                                                    <div
                                                                    style={{width: 100, height: 100, borderRadius: '10%', backgroundColor: 'lightgrey'}}
                                                                /></>}

                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}>
                                                            <Button
                                                                color={item.activated ? 'primary' : 'error'}
                                                                variant={item.activated ? 'contained' : 'outlined'}
                                                                onClick={() => toggleActivatedBtn(item.activated, index)}
                                                            >
                                                                { item.activated ? '활성화' : '비활성화'}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                  )}
                                              </Draggable>
                                            );
                                        })}
                                    </TableBody>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Table>
                </Card>
            </Box>
            <BrandDialog
                open={brandOpen}
                onClose={handleBrandClose}
                items={dataContext.BRAND}
            />
        </>
    )
}


BrandNewArrivals.getLayout = (page ) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);


export default BrandNewArrivals;
