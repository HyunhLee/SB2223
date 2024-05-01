import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React, {useState} from "react";
import {ImageDialog} from "../../widgets/image-widget";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {toast} from "react-hot-toast";

export const PlanManagementDetail = (props) => {
    const {plan, setPlan} = props;
    const [openImg, setOpenImg] = useState(false);
    const [idx, setIdx] = useState<number>(null);

    const handleClickOpenImg = (index) => {
        setIdx(index);
        setOpenImg(true);
    }

    const handleCloseImg = () => {
        setOpenImg(false);
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
        try {
            if (!destination) {
                return;
            }
            const orderItems = reorder(
                plan,
                source.index,
                destination.index
            );
            setPlan(orderItems)
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    return (
        <>
            <Table sx={{ minWidth: '100%' }}>
                <TableHead>
                    <TableRow>
                        <TableCell align={'center'}>
                            No.
                        </TableCell>
                        <TableCell align={'center'}>
                            ID
                        </TableCell>
                        <TableCell align={'center'}>
                            TITLE
                        </TableCell>
                        <TableCell align={'center'}>
                            기획전 이미지
                        </TableCell>
                    </TableRow>
                </TableHead>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="droppable"
direction="vertical">
                        {(provided) => (
                            <TableBody ref={provided.innerRef}
                                       {...provided.droppableProps}>
                                {plan?.map((item, index) => {
                                    return (
                                        <Draggable
                                            key={`${item.id}`}
                                            draggableId={`${item.id}`}
index={index}>
                                            {(provided) => (
                                                <TableRow
                                                    hover
                                                    key={item.id}
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                >
                                                    <TableCell align={'center'}>
                                                        {index+1}
                                                    </TableCell>
                                                    <TableCell align={'center'}>
                                                        {item.id}
                                                    </TableCell>
                                                    <TableCell align={'center'}>
                                                        {item.title}
                                                    </TableCell>
                                                    <TableCell align={'center'}>
                                                        <img
                                                            src={`${item.imageUrl}`}
                                                            style={{
                                                                objectFit: 'contain',
                                                                height: 100,
                                                                cursor: 'pointer'
                                                            }}
                                                            loading="lazy"
                                                            onClick={() => handleClickOpenImg(index)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </TableBody>
                        )}
                    </Droppable>
                </DragDropContext>
                <ImageDialog
                    open={openImg}
                    onClose={handleCloseImg}
                    imageUrl={idx != null ? plan[idx].imageUrl : ''}
                />
            </Table>
        </>
    )
};

