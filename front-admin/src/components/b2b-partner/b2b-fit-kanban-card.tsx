import {
    Card, CardHeader, CardMedia, Grid, Typography,
} from "@mui/material";
import React, { useState} from "react";
import InspectionProductDialog from "./b2b-fit-inspection-dialog";


const BtbFitKanbanCard = (props)=> {
    const { item, setTotalData, setLoading, totalData} = props;

    const [openInspection, setOpenInspection] = useState(false);

    const toggleOpenInspection = () => {
        if(openInspection){
            setOpenInspection(false)
        }else{
            setOpenInspection(true)
        }

    }

    const headerColor = () => {
        if (item.priorityType === 'Urgency') {
            return 'red';
        }
        return 'green';
    }

    return(
        <>
        <Grid item xs={6} >
            <Card>
                <CardHeader
                    sx={{maxHeight: 40, p: 0.4, backgroundColor: headerColor()}}
                    title={<Typography sx={{ml: 1}}>{item.productId} / {item.id}</Typography>}/>
                <CardMedia
                    component="img"
                    height="200"
                    image={item.fitRefImageUrl}
                    style={{objectFit: 'contain', cursor: 'pointer'}}
                    onClick={toggleOpenInspection}
                />
            </Card>
        </Grid>
        <InspectionProductDialog open={openInspection} item={item} onClose={toggleOpenInspection} totalData={totalData} setTotalData={setTotalData} setLoading={setLoading} setOpenInspection={setOpenInspection}/>
        </>
    )
}

export default BtbFitKanbanCard;