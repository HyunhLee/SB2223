import {Box, Button, Card, FormLabel, IconButton, Link, Stack, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {X as XIcon} from "../../icons/x";
import {AvatarHair} from "../../types/avatar-custom";

export const CustomHairCard = (props) => {
    const {data, setData,item,index, handleUpdateHair, setHairModify} = props;
    const [hair, setHair] = useState<AvatarHair>(item);

    const switchActivated = () => {
        setHair(prevData => ({
            ...prevData,
            activated: !hair.activated
        }))
        setData(data.map(element => {
            if(element.id === item.id){
                element.activated = !element.activated
            }
            return element
        }))
    }

    const router = useRouter();
    const handleHairModify = () => {
        setHairModify(hair);
        handleUpdateHair();
    }

    return (
        <Card sx={{ border: 5, borderRadius: 1, borderColor: `${hair.activated?'green':'red'}`, pr:2}}
             >
            <Box sx={{display: 'flex', justifyContent: 'space-between', m: 1}}
                 onClick={() => switchActivated()}>
                {index+1}
                <Button
                    size='small'
                    sx={{height: 35, fontSize: 12}}

                >
                    {hair.activated?'활성화':'비활성화'}
                </Button>
            </Box>
            <Stack
                direction='row'>
                    <img style={{width: '100%', height: 150}} onDoubleClick={() => handleHairModify()} src={`${hair.mainImageUrl}`}/>
            </Stack>
        </Card>
    )
}

export default CustomHairCard;