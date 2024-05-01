import {
    Box, Button, Grid, Stack, Typography
} from "@mui/material";
import React, {useState, useEffect} from "react";
import CloseIcon from '@mui/icons-material/Close';
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {ImageDialog } from "../../widgets/image-widget";
import FittingRoomItemsList from "./fitting-room-items-list";


const FittingRoomItems = (props) => {
    const {selectedItems, setSelectedItems, selectedItemsForSave, setSelectedItemsForSave, selectedTemp, setSelectedTemp, handleClose} = props;

    const [openImg, setOpenImage] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string>('');

    let order = selectedItemsForSave.sort((a,b) => a.fitOrder - b.fitOrder)
    console.log(order, 'selectedItems order ')

    //이미 데이터가 있을 경우, fitOrder순으로 들어오게 한다.
    useEffect(() => {
        if(selectedItemsForSave?.length > 0){
            setSelectedItems(order);
        }
    },[])

    const removeSelectedItems = (value) => {
        setSelectedItems(selectedItems.filter((v) => v.product.id !== value.product.id))
        setSelectedTemp(selectedTemp.filter((v) => v !== value.product))
    }

    const handleSaveFittingItems = () => {
        setSelectedItemsForSave(selectedItems)
        handleClose()
    }

    //fitorder 큰수가 제일 위에 입혀짐
    const reorder = (selectedItems, startIndex, endIndex) => {
        console.log(selectedItems, '처음에 리오더한 데이터')
        const list = [...selectedItems]
        const [removed] = list.splice(startIndex, 1);
        list.splice(endIndex, 0, removed);
        list.forEach((v, idx) => { v.fitOrder = idx})
        // console.log(list, 'foreach로 fitOrder 재정의하고 나서')
        // setSelectedItems(list)
        // setSelectedItemsForSave(list)
        return list
    };


    const handleDragEnd = async ({source, destination,}: DropResult): Promise<void> => {
        try {
            if (!destination) {
                return;
            }
            const orderItems = reorder(
                selectedItems,
                source.index,
                destination.index
            );
            setSelectedItems(orderItems)
            // setSelectedItemsForSave(orderItems)
        } catch (err) {
          //  console.log('drag', err)
        }

    }

    const openImageDialog = (id) => {
        selectedItems.filter((v) => v.product.id == id ? setPreviewUrl(v.product.putOnImageUrl) : null)
        setOpenImage(true)
    }

    const handleClickClose = () => {
        setOpenImage(false);
    };

    return (
        <>
            <Stack sx={{width: '100%'}}>
                <Box sx={{mt: 0}}>
                    <FittingRoomItemsList setSelectedItems={setSelectedItems}
                                          selectedItems={selectedItems}
                                          selectedTemp={selectedTemp}
                                          setSelectedTemp={setSelectedTemp}/>
                </Box>
                <Stack sx={{flexDirection: 'row', position: 'absolute', bottom: 10, backgroundColor: 'white', zIndex: 2}}>
                    <Grid
                          sx={{px: 3, py:1, flexDirection: 'row', width: '1405px', overflowX:'scroll', border:'1px solid lightGray',  borderRadius: '10px', }}>
                            <>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId='droppable'
                                               direction="horizontal">
                                        {(provided) =>  (
                                            <Box {...provided.droppableProps}
                                                 ref={provided.innerRef}
                                                 sx={{display: 'flex'}}>
                                                {selectedItems.map((v, index) => (
                                                    <Draggable key={String(v.product.id)}
                                                               draggableId={String(v.product.id)}
                                                               index={index}>
                                                        {(provided) => (
                                                            <Box ref={provided.innerRef}
                                                                 {...provided.dragHandleProps}
                                                                 {...provided.draggableProps}
                                                                 sx={{flexDirection: 'row',}}
                                                            >
                                                                <Stack sx={{
                                                                    border: '1px solid #DFD8CA',
                                                                    borderRadius: '10px',
                                                                    mr: 1,
                                                                    ml: 1,
                                                                    mt: 1,
                                                                    cursor: 'pointer',
                                                                    backgroundColor: 'white',
                                                                }}>
                                                                    <Stack sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'end',
                                                                        justifyContents: 'end',
                                                                        px: 0.5,
                                                                        py: 0.5
                                                                    }}>
                                                                        <CloseIcon onClick={() => removeSelectedItems(v)}
                                                                                   sx={{
                                                                                       fontSize: 16,
                                                                                       fontWeight: 'bold'
                                                                                   }}/></Stack>
                                                                    <Stack sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContents: 'center',}}>
                                                                        <img src={v.product.mainImageUrl}
                                                                             width={80}
                                                                             height={90}
                                                                             onClick={() => openImageDialog(v.product.id)}/>
                                                                        <Stack sx={{
                                                                            textAlign: 'center',
                                                                            backgroundColor: '#DFD8CA',
                                                                            borderRadius: '10px',
                                                                            fontSize: '13px',
                                                                            px: 1
                                                                        }}>상품 ID : {v.product.id}
                                                                        </Stack>
                                                                    </Stack>
                                                                </Stack>
                                                                <ImageDialog
                                                                    open={openImg}
                                                                    onClose={handleClickClose}
                                                                    imageName={previewUrl}
                                                                    imageUrl={previewUrl}
                                                                />
                                                            </Box>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </Box>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </>
                    </Grid>
                    <Box sx={{lineHeight: 12, ml:5}}>
                        <Button variant={'outlined'}
                                onClick={handleSaveFittingItems}
                                disabled={selectedItems?.length <= 0}>선택완료</Button>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}


export default FittingRoomItems;