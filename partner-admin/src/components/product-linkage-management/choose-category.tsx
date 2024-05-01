import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Card,
    Checkbox,
    Stack, IconButton, TextField, Typography
} from "@mui/material";
import {Scrollbar} from "../scrollbar";
import React, {Fragment, useEffect, useState} from "react";
import {X as XIcon} from "../../icons/x";
import {useTranslation} from "react-i18next";
import {toast} from "react-hot-toast";

export const ChooseCategory = (props) => {
    const {categoryList, filteredList, setFilteredList} = props;
    const {t} = useTranslation();
    const sortCategoryList = categoryList.sort((a, b) => a.fullCategoryName.localeCompare(b.fullCategoryName))
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [categories, setCategories] = useState(sortCategoryList);


    useEffect(() => {
        (async () => {
            setCategories(sortCategoryList);
            if (filteredList.length !== 0) {
                setSelectedLists(filteredList.map(item => {
                    return item.categoryNo
                }))
            }
        })()
    }, [])


    const getCategoriesList = (value) => {
        let names = []
        if (typeof value == 'undefined') {
            return;
        } else {
            for (let i in value) {
                if (value[i] != null) {
                    names.push(value[i])
                }
            }
            return names.join(' > ')
        }
    }

    const handleSelectOneList = (
        id: number
    ): void => {
        if (selectedLists.length >= 5 && !selectedLists.includes(id)) {
            toast.error(`${t("component_dialog_productLinkageManagement_chooseCategory_select")}`)
        } else {
            if (!selectedLists.includes(id)) {
                setSelectedLists((prevSelected) => [...prevSelected, id]);
                setFilteredList([...filteredList, ...categories.filter((item) => item.categoryNo == id)])

            } else {
                setSelectedLists((prevSelected) => prevSelected.filter((itemId) => itemId !== id));
                setFilteredList([...filteredList.filter((item) => item.categoryNo !== id)])

            }
        }

    };

    return (
        <Box>
            <Stack direction='column'>
                <Stack sx={{display: 'flex', justifyContent: 'space-around'}} direction='row'>
                    <Stack direction='column'>
                        <Box sx={{mt: 1, mb: 1,}}>
                            {t("component_dialog_productLinkageManagement_chooseCategory_box")}
                        </Box>
                        <Card sx={{border: 2, width: 700, maxHeight: 420,mb:0}}>
                            <Scrollbar style={{height: '100%'}}>
                                <Table>
                                    <TableBody>
                                        {categories.map((item) => {
                                            const isListSelected = selectedLists.includes(item.categoryNo);
                                            return (
                                                <Fragment key={item.categoryNo}>
                                                    <TableRow
                                                        hover
                                                        sx={{cursor: 'pointer'}}
                                                        key={item.categoryNo}
                                                        onClick={() => handleSelectOneList(
                                                            item.categoryNo
                                                        )}
                                                    >
                                                        <TableCell align="left" sx={{px: 4}}>
                                                            {item.fullCategoryName}({item.count})
                                                        </TableCell>
                                                        <TableCell
                                                            padding="checkbox"
                                                            width="25%"
                                                        >
                                                            <Checkbox
                                                                checked={isListSelected}
                                                                // onChange={() => handleSelectOneList(
                                                                //     item.categoryNo
                                                                // )}
                                                                value={isListSelected}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </Card>
                    </Stack>
                </Stack>
                <Stack>
                    <Typography variant='body2' sx={{color: 'darkGrey', whiteSpace: 'pre-wrap', mt: 3, ml: 4, mb:3}}>
                        {t("component_dialog_productLinkageManagement_chooseCategory_typography")}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    )
}