import {Box, Button, Grid, IconButton, ListItem, ListItemText, Stack, Typography} from "@mui/material";
import React, {useContext, useEffect} from "react";
import 'react-simple-tree-menu/dist/main.css';
import {DataContext} from "../../contexts/data-context";
import {getDataContextValue} from "../../utils/data-convert";
import {CategoryDialog, ColorDialog, PatternDialog} from "../dialog/category-dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import {typeApi} from "../../api/type-api";

interface Category {
    id: string;
    name: string;
    children?: readonly Category[];
}

const WordsBox = (props) => {
    const dataContext = useContext(DataContext);

    const {item, keyword, setKeyword, index} = props;
    const [open, setOpen] = React.useState(false);
    const [patternOpen, setPatternOpen] = React.useState(false);
    const [colorOpen, setColorOpen] = React.useState(false);

    const [categoryItem, setCategoryItem] = React.useState<any>({});
    const [category, setCategory] = React.useState(null);
    const [color, setColor] = React.useState(null);
    const [pattern, setPattern] = React.useState(null);

    // 초기값 셋팅
    useEffect(() => {
        if (dataContext.CATEGORY_MAP && dataContext.COLOR  && dataContext.PATTERN) {
            const categoryId = item[index].category;
            if (categoryId && categoryId.id != null && categoryId.id != 0) {
                    setCategory(getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId.id, 'path'));
            }

            setColor(item ? item[index].colorType : '')
            setPattern(item ? item[index].patternType : '');
            }

    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        if (value) {
            setCategoryItem(value);
            setCategory(getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path'));
        }
        setOpen(false);
    };

    const handleClickPatternOpen = () => {
        setPatternOpen(true);
    };

    const handlePatternClose = (value) => {
        console.log(value, '###########new Pattern')
        if (value) {
            setPattern(value.name);
        }
        setPatternOpen(false);
    };

    const handleClickColorOpen = () => {
        setColorOpen(true);
    };

    const handleColorClose = (value) => {
        if (value) {
            setColor(value.name);
        }
        setColorOpen(false);
    };

    useEffect(() => {
        if (Object.keys(categoryItem).length > 0) {
            let categoryId = item[index].category;
            categoryId.id = null;

            let keywordId = keyword.category;
            if (keyword != undefined && keywordId != null) {
                keywordId.id = null;
            }
            const path = categoryItem.key.split('/');
            path.forEach((id, index) => {
                categoryId.id = path[path.length - 1];
                if (keyword != undefined) {
                    keywordId.id = path[path.length - 1];
                }
            })
        }
    }, [categoryItem]);

    useEffect(() => {
        //item[index].patternType = pattern;
        if (keyword != undefined) {
            keyword.patternType = pattern;
        }
    }, [pattern]);
    //
    useEffect(() => {
       // item[index].colorType = color;
        if (keyword != undefined) {
            keyword.colorType = color;
        }
    }, [color]);

    const categoryText = () => {
        return (
            <Typography variant="caption"
                        style={{color: '#ff6f00', fontWeight: 600}}>{category}</Typography>
        )
    }

    const colorAndPatternText = () => {
        return <Typography variant="caption">
            <Stack direction="row"
                   justifyContent={"space-between"}>
                <Stack>
                    {pattern}
                </Stack>
                <Stack>
                    {color}
                </Stack>
            </Stack>
        </Typography>
    }

    const handleClickDelete = () => {
        setCategory(null)
        setColor(null)
        setPattern(null)
    }

    return (
        <Box sx={{
            width: '100%',
            border: 1,
            borderRadius: 1,
            pt: 0.4,
            pb: 0.4
        }}>
            <Grid container
                  spacing={1}
                  justifyContent={"space-between"}
                  alignItems={"center"}>
                <Grid item
                      xs={7}>
                    <ListItem sx={{pt: 0, pb: 0, pr: 5}}>
                        <ListItemText primary={categoryText()}
                                      secondary={colorAndPatternText()}/>
                    </ListItem>
                </Grid>
                <Grid item
                      xs={5}
                      justifyContent={"flex-end"}
                      sx={{display: 'flex'}}>
                    <Button size='small'
                            variant="outlined"
                            sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                            onClick={handleClickOpen}>
                        카테고리
                    </Button>
                    <Button size='small'
                            variant="outlined"
                            sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                            onClick={handleClickPatternOpen}>
                        패턴
                    </Button>
                    <Button size='small'
                            variant="outlined"
                            sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                            onClick={handleClickColorOpen}>
                        색상
                    </Button>
                    <IconButton color="error"
                                component="span"
                                sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                onClick={handleClickDelete}>
                        <DeleteIcon/>
                    </IconButton>
                </Grid>
            </Grid>
            <CategoryDialog
                keepMounted
                open={open}
                onClose={handleClose}
                category={dataContext.CATEGORY}
                value={category}
            />
            <PatternDialog
                keepMounted
                open={patternOpen}
                onClose={handlePatternClose}
                items={dataContext.PATTERN}
                value={pattern}
            />
            <ColorDialog
                keepMounted
                open={colorOpen}
                onClose={handleColorClose}
                items={dataContext.COLOR}
                value={color}
            />
        </Box>
    )
}

export default WordsBox;