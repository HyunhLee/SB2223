import {Box, Card, Checkbox, Divider, Grid, Stack, Table, Typography} from "@mui/material";
import React, {ChangeEvent, Fragment, useEffect, useState} from "react";
import {avatarApi} from "../../api/avatar-api";
import {AvatarHair} from "../../types/avatar-custom";
import {getNumberComma} from "../../utils/data-convert";
import {Scrollbar} from "../scrollbar";
import {ImageInListWidget} from "../widgets/image-widget";

const BackgroudRemoveHair = (props) => {
    const {hairId, changeSelectedList, onClickApply } = props;

    const [lists, setLists] = useState<AvatarHair[]>([]);
    const [count, setCount] = useState(0);

    const [selectedLists, setSelectedLists] = useState<AvatarHair[]>([]);

    const [requestList, setRequestList] = useState<boolean>(false);

    useEffect(
        () => {
            (async () => {
                if (requestList) {
                    await getLists()
                    setRequestList(false);
                }
            })()
        },
        [requestList]
    );

    useEffect(
        () => {
            if (hairId) {
                console.log(hairId);
            }
            setRequestList(true);
        },
        []
    );

    const getLists = async () => {
        try {
            const query = {}
            const result = await avatarApi.getAvatarHairs(query);
            setLists(result.lists);
            setCount(result.lists.length);
            lengthChangeHandler(result.lists);
            console.log(result)
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        changeSelectedList(selectedLists)
    }, [selectedLists]);

    const handleSelectOneList = (
        event: ChangeEvent<HTMLInputElement>,
        item: AvatarHair
    ): void => {
        if (!selectedLists.includes(item)) {
            setSelectedLists((prevSelected) => [...prevSelected, item]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== item));
        }
    };

    const [long, setLong] = useState([]);
    const [middle, setMiddle] = useState([]);
    const [short, setShort] = useState([]);

    const lengthChangeHandler = (value) => {
        for(let i = 0; i < value.length; i++) {
            if(value[i].hairLengthType == "LONG") {
                long.push(value[i]);
            } else if(value[i].hairLengthType == "MIDDLE") {
                middle.push(value[i]);
            } else if(value[i].hairLengthType == "SHORT") {
                short.push(value[i]);
            }
        }
    };

    return (
        <Box sx={{p: 1}}>
            <Box sx={{display: 'flex', direction: 'row'}}>
                <Box sx={{flexGrow: 1}}>
                    <Box>
                        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
                        </Grid>
                    </Box>
                    <Scrollbar>
                        <Table sx={{ minWidth: '100%' }}>
                            <Typography variant="h5">
                                LONG
                            </Typography>
                            <Stack
                                direction='row'>
                                {long.map((item) => {
                                    const isListSelected = selectedLists.includes(item);
                                    return (
                                        <Fragment key={item.mainImageUrl}>
                                            <Card sx={{border: 1, borderRadius: 1, borderColor: 'black', m: 1}}>
                                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Checkbox
                                                        checked={isListSelected}
                                                        onChange={(event) => handleSelectOneList(
                                                            event,
                                                            item
                                                        )}
                                                        value={isListSelected}
                                                    />
                                                </Box>
                                                <Stack
                                                    direction='row'>
                                                    <ImageInListWidget imageName={item.mainImageUrl}
                                                                       imageUrl={item.mainImageUrl} />
                                                </Stack>
                                            </Card>
                                        </Fragment>
                                    )
                                })}
                            </Stack>
                            <Divider />
                            <Typography variant="h5">
                                MIDDLE
                            </Typography>
                            <Stack
                                direction='row'>
                                {middle.map((item) => {
                                    const isListSelected = selectedLists.includes(item);
                                    return (
                                        <Fragment key={item.mainImageUrl}>
                                            <Card sx={{border: 1, borderRadius: 1, borderColor: 'black', m: 1}}>
                                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Checkbox
                                                        checked={isListSelected}
                                                        onChange={(event) => handleSelectOneList(
                                                            event,
                                                            item
                                                        )}
                                                        value={isListSelected}
                                                    />
                                                </Box>
                                                <Stack
                                                    direction='row'>
                                                    <ImageInListWidget imageName={item.mainImageUrl}
                                                                       imageUrl={item.mainImageUrl} />
                                                </Stack>
                                            </Card>
                                        </Fragment>
                                    )
                                })}
                            </Stack>
                            <Divider />
                            <Typography variant="h5">
                                SHORT
                            </Typography>
                            <Stack
                                direction='row'>
                                {short.map((item) => {
                                    const isListSelected = selectedLists.includes(item);
                                    return (
                                        <Fragment key={item.mainImageUrl}>
                                            <Card sx={{border: 1, borderRadius: 1, borderColor: 'black', m: 1}}>
                                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Checkbox
                                                        checked={isListSelected}
                                                        onChange={(event) => handleSelectOneList(
                                                            event,
                                                            item
                                                        )}
                                                        value={isListSelected}
                                                    />
                                                </Box>
                                                <Stack
                                                    direction='row'>
                                                    <ImageInListWidget imageName={item.mainImageUrl}
                                                                       imageUrl={item.mainImageUrl} />
                                                </Stack>
                                            </Card>
                                        </Fragment>
                                    )
                                })}
                            </Stack>
                        </Table>
                    </Scrollbar>
                </Box>
            </Box>
        </Box>
    )
}

export default BackgroudRemoveHair;