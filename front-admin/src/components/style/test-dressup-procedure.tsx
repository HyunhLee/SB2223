import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Stack
} from '@mui/material';
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import DressupBox from "./dressup-box";
import React, {useContext} from "react";
import {DataContext} from "../../contexts/data-context";
import _ from "lodash";
import {styleTasteMapApi} from "../../api/style-taste-map-api";
import {ListManager} from "react-beautiful-dnd-grid";

const TestDressUpProcedure = (props) => {

    const {items, data, addStyleBlank, deleteStyle, reOrderItems, changeTaste, changeTasteRecommend, changeSeason, changeTpo} = props;
    const dataContext = useContext(DataContext);

    const reorder = (startIndex, endIndex) => {
        const result = items;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.forEach((item, index) => {item.fitOrder = index + 1})

        return result;
    };

    const handleDragEnd = async (source, destination): Promise<void> => {
        try {
            // Dropped outside the column
            if (destination === source) {
                return;
            }

            reOrderItems(reorder( source, destination ));
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    const checkedSeason = (season) => {
        if (data.seasonTypes) {
            return data.seasonTypes.includes(season)
        }
        return false;
    }

    const handleStyleTasteMapRecommend = async () => {
        if (_.isEmpty(items)) {
            toast.error('등록된 추천이 없습니다.');
            return
        }
        const result = await styleTasteMapApi.postStyleTasteMapRecommend(items);
        if (result.tasteCode === '') {
            changeTasteRecommend(null);
            toast.error('추천 취향 코드가 없습니다.');
            return
        }
        changeTasteRecommend(result.tasteCode);
    }

    const getTasteCode = (checkValues) => {
        if (data.tasteCode) {
            const findValue = checkValues.find(value => data.tasteCode.includes(value));
            return (findValue) ? findValue : '';
        }
        return '';
    }

    const getTpo = () => {
        return (data.tpoType) ? data.tpoType : '';
    }

    const renderTpo = () => {
        return dataContext.TPO.map(item => {
            return (<MenuItem key={item.id}
                              value={item.name}>{item.name}</MenuItem>)
        })
    }

    const renderSeason = () => {
        return Object.keys(dataContext.SEASON).map(key => {
            return (
                <Grid key={key}
                      item
                      xs={6}>
                    <FormControlLabel
                        value={key}
                        control={<Checkbox
                            onChange={e=> {changeSeason(e.target.defaultValue, e.target.checked)}}
                            checked={checkedSeason(key)}
                        />}
                        label={dataContext.SEASON[key]} />
                </Grid>
            )
        });
    }

    const ListElement = ({ item: { fitOrder } }): any  => {
        return (
            <Box sx={{pt: 1}}>
                <DressupBox
                    item={items.find((value) => value.fitOrder == fitOrder)}
                    deleteStyle={deleteStyle}
                />
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    pb: 1,
                    pt: 1
                }}
            >
                <Box sx={{
                    pb: 1,
                }}>
                    <Stack direction="row"
                           sx={{mb: 1.5}}>
                        <Stack justifyContent={"center"}
                               sx={{mr: 1, ml: 1}}>
                            <FormLabel component="legend">취향 조회</FormLabel>
                        </Stack>
                        <Stack>
                            <Select
                                size={"small"}
                                value={getTasteCode(['F', 'D'])}
                                onChange={e=> {changeTaste(e.target.value, ['F', 'D'])}}
                            >
                                <MenuItem value={''}>-</MenuItem>
                                <MenuItem value={'F'}>F</MenuItem>
                                <MenuItem value={'D'}>D</MenuItem>
                            </Select>
                        </Stack>
                        <Stack>
                            <Select
                                size={"small"}
                                value={getTasteCode(['C', 'O'])}
                                onChange={e=> {changeTaste(e.target.value, ['C', 'O'])}}
                            >
                                <MenuItem value={''}>-</MenuItem>
                                <MenuItem value={'C'}>C</MenuItem>
                                <MenuItem value={'O'}>O</MenuItem>
                            </Select>
                        </Stack>
                        <Stack>
                            <Select
                                size={"small"}
                                value={getTasteCode(['U', 'B'])}
                                onChange={e=> {changeTaste(e.target.value, ['U', 'B'])}}
                            >
                                <MenuItem value={''}>-</MenuItem>
                                <MenuItem value={'U'}>U</MenuItem>
                                <MenuItem value={'B'}>B</MenuItem>
                            </Select>
                        </Stack>
                        <Stack>
                            <Select
                                size={"small"}
                                value={getTasteCode(['T', 'M'])}
                                onChange={e=> {changeTaste(e.target.value, ['T', 'M'])}}
                            >
                                <MenuItem value={''}>-</MenuItem>
                                <MenuItem value={'T'}>T</MenuItem>
                                <MenuItem value={'M'}>M</MenuItem>
                            </Select>
                        </Stack>
                        <Stack justifyContent={"center"}>
                            <Button
                                component="a"
                                size="small"
                                sx={{ml: 1}}
                                color={"error"}
                                variant="contained"
                                onClick={handleStyleTasteMapRecommend}
                            >
                                취향 추천
                            </Button>
                        </Stack>
                    </Stack>
                    <Stack direction="row"
                           sx={{mb: 1.5}}>
                        <Stack justifyContent={"center"}
                               sx={{mr: 1, ml: 1}}>
                            <FormLabel component="legend">TPO</FormLabel>
                        </Stack>
                        <Stack>
                            <Select
                                size={"small"}
                                value={getTpo()}
                                onChange={e=> {changeTpo(e.target.value)}}
                            >
                                {renderTpo()}
                            </Select>
                        </Stack>
                    </Stack>
                    <Stack direction="row"
                           sx={{mb: 1.5}}>
                        <Stack justifyContent={"center"}
                               sx={{mr: 1, ml: 1}}>
                            <FormLabel component="legend">시즌</FormLabel>
                        </Stack>
                        <Grid container
                              rowSpacing={0}
                              columnSpacing={0}
                              justifyContent={'start'}>
                            {renderSeason()}
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <ListManager
                    items={items}
                    direction="vertical"
                    maxItems={500}
                    render={(item) => <ListElement item={item}/>}
                    onDragEnd={handleDragEnd} />
                {/*<Box>*/}
                {/*	<DragDropContext onDragEnd={handleDragEnd}>*/}
                {/*		<Droppable droppableId="items">*/}
                {/*			{(provided) => (*/}
                {/*				<Box {...provided.droppableProps}*/}
                {/*						 ref={provided.innerRef}>*/}
                {/*					{items.map((item, index) => (*/}
                {/*						<Draggable key={item.key} draggableId={item.key} index={index}>*/}
                {/*							{(provided) => (*/}
                {/*								<Box sx={{pt: 1}}*/}
                {/*										 ref={provided.innerRef}*/}
                {/*										 {...provided.dragHandleProps}*/}
                {/*										 {...provided.draggableProps}*/}
                {/*								>*/}
                {/*									<DressupBox*/}
                {/*										item={item}*/}
                {/*										deleteStyle={deleteStyle}*/}
                {/*									/>*/}
                {/*								</Box>*/}
                {/*							)}*/}
                {/*						</Draggable>*/}
                {/*					))}*/}
                {/*					{provided.placeholder}*/}
                {/*				</Box>*/}
                {/*			)}*/}
                {/*		</Droppable>*/}
                {/*	</DragDropContext>*/}
                <IconButton aria-label="add"
                            onClick={addStyleBlank} >
                    <AddIcon />
                </IconButton>
                {/*</Box>*/}
            </Box>
        </>
    )
}

export default TestDressUpProcedure;