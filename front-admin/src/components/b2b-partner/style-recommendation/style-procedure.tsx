import {Box, Divider, IconButton, Stack} from '@mui/material';
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import StyleBox from "./style-box";
import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../../contexts/data-context";
import styled from "styled-components";

const reorder = (list, startIndex, endIndex) => {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);

    return list;
};

const StyleProcedure = (props) => {

    const {brand, gender, items, data, addStyleBlank, deleteStyle, reOrderItems, imageUrl} = props;
    const dataContext = useContext(DataContext);

    const [selectedItemsForSave, setSelectedItemsForSave] = useState<any>( []);

    useEffect(() => {
        if(data.imageUrlList.length > 0) {
            setSelectedItemsForSave(data.items);
        }
    }, [gender, data])

    let wearHat = [];
    const handelHatItem = (items) => {
        //등록되는 상품 중에 모자 아이템이 있다면 모자 마스킹을 올리고
        items?.map((v, idx) => {
            if (v?.category2 == 23 || v?.category2 == 378) {
                wearHat.push(data.imageUrlList[idx])
            }
        })
    }

    let clothesArr = [];
    const viewArr = (items) => {
        return items?.map((v, idx) => {
            if(v.category2 !== 23 && v.category2 !== 378 && v.category2 !== 22 && v.category2 !== 377 && v.category1 !== 5 && v.category1 !== 365 && v.category2 !== 21 && v.category2 !== 376 && v.category2 !== 13 && v.category2 !== 14 && v.category2 !== 371){
                clothesArr.push(idx)
            }
        })
    }

    const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
        try {
            // Dropped outside the column
            if (!destination) {
                return;
            }
            const orderItems = reorder(
                items,
                source.index,
                destination.index
            );
            reOrderItems(orderItems);
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    return (
        <>
            <Box
                sx={{
                    pb: 1,
                    pt: 1
                }}
            >
                <Box sx={{
                    pb: 1, ml: 11
                }}>
                    <Stack  width={300}
                            sx={{backgroundColor : 'lightgray', borderRadius: '15px', position: 'relative'}}>
                        {handelHatItem(selectedItemsForSave)}
                        {viewArr(selectedItemsForSave)}
                        {wearHat.length > 0 ?  <Mask src={gender == 'F' ? '/avatar0.png' : '/avatar1.png'}
                                                     width={300}
                                                     mask={'/mask/hat_mask.png'}/> :  <img src={gender == 'F' ? '/avatar0.png' : '/avatar1.png'}
                                                                                           width={300}/>
                        }
                        {selectedItemsForSave?.map((v, idx) => {
                            return (
                                <>
                                    <Stack sx={{position: 'absolute', top: 0, left: 0}}
                                           key={v.fitOrder}>
                                        <img src={data.imageUrlList[idx]?.putOnImageUrl}
                                             width={'100%'}
                                             loading={'lazy'}/>
                                    </Stack>
                                </>
                            )
                        })}
                    </Stack>
                </Box>
                <Divider />
                <Box>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="items">
                            {(provided) => (
                                <Box {...provided.droppableProps}
                                     ref={provided.innerRef}>
                                    {items.map((item, index) => {
                                        let image;
                                        if(item.category3 == 455 || item.category3 == 456 || item.category3 == 457 || item.category3 == 458) {
                                            image = imageUrl.filter(v => {
                                                return v.categoryId == item.category3
                                            })[0]
                                        } else if(item.category2 >= 21 && item.category2 <= 28) {
                                            image = imageUrl.filter(v => {
                                                return v.categoryId == item.category2
                                            })[0]
                                        } else if(item.category2 >= 376 && item.category2 <= 384) {
                                            image = imageUrl.filter(v => {
                                                return v.categoryId == item.category2
                                            })[0]
                                        } else if(item.category1 == 3 || item.category1 == 363) {
                                            image = imageUrl.filter(v => {
                                                return v.productColorId == item.productColorId
                                            })[0]
                                        } else if(item.category1 == 1 || item.category1 == 361) {
                                            image = imageUrl.filter(v => {
                                                return v.productColorId == item.productColorId
                                            })[0]
                                        } else {
                                            image = imageUrl.filter(v => {
                                                return v.categoryId == item.category1
                                            })[0]
                                        }
                                        return (
                                            <Draggable key={item.key}
                                                       draggableId={item.key}
                                                       index={index}>
                                                {(provided) => (
                                                    <Box sx={{pt: 1}}
                                                         ref={provided.innerRef}
                                                         {...provided.dragHandleProps}
                                                         {...provided.draggableProps}
                                                    >
                                                        <StyleBox
                                                            item={item}
                                                            imageUrl={image}
                                                            gender={gender}
                                                            deleteStyle={deleteStyle}
                                                        />
                                                    </Box>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <IconButton aria-label="add"
                                onClick={addStyleBlank} >
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>
        </>
    )
}

// image-mask
const Mask = styled.img`
    mask-image: ${(p) => `url("${p.mask}")`};
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    -webkit-mask-image:  ${(p) => `url("${p.mask}")`};
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    `

export default StyleProcedure;