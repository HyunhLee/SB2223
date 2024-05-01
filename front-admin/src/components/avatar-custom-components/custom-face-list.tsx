import {NextPage} from "next";
import {Box, Button, CardContent,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import {avatarApi} from "../../api/avatar-api";
import {AvatarCustomModel} from "../../types/avatar-custom";
import {ListManager} from "react-beautiful-dnd-grid";
import CustomFaceCard from "./custom-face-card";
import SaveIcon from "@mui/icons-material/Save";

export const CustomFaceList: NextPage = () => {
    const [faces, setFaces] = useState<AvatarCustomModel[]>([]);

    useEffect(() => {
        getFaces();
    }, []);

    const getFaces = async () => {
        try {
            const query = {}
            const result = await avatarApi.getAvatars(query);
            setFaces(result.lists);
            console.log(result.lists)
        } catch (err) {
            console.error(err);
            toast.error('얼굴 데이터를 불러오는데 실패하였습니다.');
        }
    }

    const reorder = (startIndex, endIndex) => {
        const list = [...faces];
        const [removed] = list.splice(startIndex, 1);
        list.splice(endIndex, 0, removed);
        list.forEach((item, index) => {item.listOrder = index + 1})
        setFaces(list)
    };

    const handleDragEnd = async (source, destination): Promise<void> => {
        try {
            // Dropped outside the column
            if (destination === source) {
                return;
            }

            reorder( source, destination );
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    const router = useRouter();
    const handleNewFace = () => {
        router.push(`/avatar-custom/new-face`);
    }

    const handlePatchFace = async (): Promise<void> => {
        console.log(faces)
        if (window.confirm('수정하시겠습니까?')) {
            for(let i = 0; i < faces.length; i++) {
                const setData = faces[i];
                await avatarApi.patchAvatar(setData.id, {
                    id: setData.id,
                    listOrder: i+1,
                    activated: setData.activated
                })
                    .then(res => {
                        toast.success('수정되었습니다.');
                    })
                    .catch((err) => {
                        console.log(err)
                        toast.error("수정에 실패했습니다.")
                    })
            }
        }
    };

    const ListElement = ({ item: { id, listOrder } }): any  => {
        return (
            <Box sx={{width: 175, pt: 1, m: 1}}
                 justifyContent="start"
                 display="flex"
            >
                <CustomFaceCard
                    data={faces}
                    setData={setFaces}
                    item={faces.find((element) => element.id === id)}
                    index={listOrder-1}
                />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                    size='small'
                    color="primary"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{height: 40, mr: 0.5, p: 1}}
                    onClick={handlePatchFace}
                >
                    수정
                </Button>
            </Box>
            <CardContent>
                <Box
                    sx={{ border: 1, borderRadius: 1, width: '100%' }}>
                    <ListManager
                        items={faces}
                        direction="horizontal"
                        maxItems={8}
                        render={(item) => <ListElement item={item}/>}
                        onDragEnd={handleDragEnd} />
                    <Button sx={{border: 1, borderRadius: 1, borderColor: 'black', m: 1}}
                            onClick={handleNewFace}>
                        <AddIcon />
                    </Button>
                </Box>
            </CardContent>
        </>
    )
};