import {Badge, Box, Grid} from "@mui/material";
import BtbFitKanbanCard from "./b2b-fit-kanban-card";
import React from "react";


const BtbFitKanbanColumn = (props) => {
    const {items, status, setTotalData, totalData, setLoading} = props;
    return (
        <div>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%',
                mx: 1,
                mt: 2,
                overflowX: 'hidden',
                overflowY: 'hidden',
                width: {
                    xs: 300,
                    sm: 380
                }
            }}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pr: 2,
                    py: 1
                }}>
                {status}
                <Badge color="primary"
                       overlap="circular"
                       badgeContent={items.length}>
                </Badge>
            </Box>
                <Box
                    sx={{
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                            ? 'neutral.800'
                            : 'neutral.200',
                        borderRadius: 1,
                    }}
                >
                    <Grid
                        container
                        spacing={1.5}
                        justifyContent={'start'}
                        sx={{p: 2}}
                    >
                        {items.map((item) => {
                            return (
                                <BtbFitKanbanCard item={item} key={item.id} setTotalData={setTotalData} totalData={totalData} setLoading={setLoading}/>
                            )
                        })}
                    </Grid>
                </Box>
        </Box>
        </div>
    )

}

export default BtbFitKanbanColumn;