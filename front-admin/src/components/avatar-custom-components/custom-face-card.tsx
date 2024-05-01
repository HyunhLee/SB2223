import {Box, Button, Card, FormLabel, Link, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {AvatarCustomModel} from "../../types/avatar-custom";

export const CustomFaceCard = (props) => {
    const {data, setData, index, item} = props;
    const [face, setFace] = useState<AvatarCustomModel>(data[index]);

    const switchActivated = () => {
        setFace({
            ...face,
            activated: !face.activated
        })
        data[index].activated = !face.activated
    }

    const router = useRouter();
    const handleFaceModify = () => {
        router.push(`/avatar-custom/${face.id}/face-modify`);
    }

    return (
        <Card sx={{ border: 5, borderRadius: 1, borderColor: `${face.activated?'green':'red'}`, pr:2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', m: 1}}
                 onClick={switchActivated}>
                {index+1}
                <Button
                    size='small'
                    sx={{height: 35, fontSize: 12}}

                >
                    {face.activated?'활성화':'비활성화'}
                </Button>
            </Box>
            <Stack
                direction='row'>
                <FormLabel component="legend"
sx={{m:1}}>이름</FormLabel>
                <Typography sx={{m:1}}
onClick={() => handleFaceModify()}>
                    {face.avatarName}
                </Typography>
            </Stack>
            <Stack
                direction='column'>
                <FormLabel component="legend"
sx={{m:1}}>메인 이미지</FormLabel>
                <Link sx={{cursor: 'pointer'}}>
                <img onDoubleClick={() => handleFaceModify()}
style={{width: '100%', height: 150, margin: 10}}
src={`${data[index].mainImageUrl}`}/>
                </Link>
            </Stack>
        </Card>
    )
}

export default CustomFaceCard;