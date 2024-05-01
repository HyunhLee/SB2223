import React, {FC, useContext, useState} from "react";
import {
    Box, Button,
    Card,
    CardHeader, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, Grid,
    IconButton,
    Table, TableBody,
    TableCell,
    TableHead,
    TableRow, TableSortLabel,
    Tooltip, Typography
} from "@mui/material";
import {DataContext} from "../../contexts/data-context";

export const ColorWidget = (props) => {
    const {colorName} = props;
    const dataContext = useContext(DataContext);

    const getBackgroundColor = () => {
        if (dataContext.COLOR_MAP[colorName]) {
            return `rgb(${dataContext.COLOR_MAP[colorName].rgb})`
        }
    }

    const getColor = () => {
        if (colorName === 'BLACK' || colorName === 'BLUE' || colorName === 'NAVY' || colorName === 'BROWN' || colorName === 'WINE') {
            return 'rgb(255, 255, 255)'
        }
        return 'rgb(0, 0, 0)'
    }

    return (
        <>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex'
                }}
            >
                {
                    colorName ? <Box sx={{
                        display: 'flex', backgroundColor: getBackgroundColor(), color: getColor(),
                        '&.MuiButtonBase-root:hover': {
                            backgroundColor: getBackgroundColor()
                        }
                    }}>{colorName}</Box> : <></>
                }
            </Box>
        </>
    );
};