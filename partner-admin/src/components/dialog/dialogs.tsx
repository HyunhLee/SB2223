import React, {useRef, useEffect, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@mui/material";
import TreeMenu from "react-simple-tree-menu";
import 'react-simple-tree-menu/dist/main.css';
import toast from "react-hot-toast";

export const CategoryDialog = (props) => {
    const {category, onClose, selectedLastDepth = false, parent = 'NONE', value: valueProp, open, ...other} = props;
    const [value, setValue] = useState(valueProp);
    const treeMenuRef = useRef<TreeMenu>();

    useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
        if (treeMenuRef && treeMenuRef.current) {
            treeMenuRef.current.resetOpenNodes([], '', '');
        }
    }, [valueProp, open]);

    const handleCancel = () => {
        onClose();
    };

    const handleApply = (item) => {
        if (parent === 'STYLE') {
            if (item.level <= 1 && item.label !== 'BUSTIER' && item.label !== 'GLOVES') {
                toast.error('2단계 이하는 선택할 수 없습니다.');
                return;
            }
            const categories = item.ids.split('/');
            const category1 = categories[0];
            const category2 = categories[1];
            if (category1 === '2' && category2 === '14') {
                if (item.children && item.children.length > 0) {
                    toast.error('스커트는 마지막 단계까지 선택해주세요.');
                    return;
                }
            } else {
                if (item.level > 2) {
                    toast.error('3단계에서만 선택해주세요.');
                    return;
                }
            }
        }
        if (parent === 'UPLOAD') {
            if (item.label !== 'OUTER' && item.label !== 'DRESS' && item.label !== 'VEST' && item.label !== 'TOP' && item.label !== 'PANTS' && item.label !== 'SKIRT') {
                toast.error('지정된 카테고리 이외에는 선택할 수 없습니다.');
                return;
            }
        }
        onClose(item);
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: '100%'}}}
            maxWidth="md"
            open={open}
            onClose={handleCancel}
            onBackdropClick={handleCancel}
            {...other}
        >
            <DialogTitle>Category</DialogTitle>
            <DialogContent dividers>
                <Box sx={{width: '100%'}}>
                    <TreeMenu
                        ref={treeMenuRef}
                        data={category}
                        onClickItem={(item) => handleApply(item)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus
                        onClick={handleCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const ColorDialog = (props) => {
    const {items, imageUrl, multiple = false, onClose, value: valueProp, open, ...other} = props;
    const [value, setValue] = React.useState(valueProp);
    // 컬러데이터 멀티선택이 필요하여 클론함.
    const [cloneItems, setCloneItems] = React.useState([]);
    const [changed, setChanged] = React.useState(false);

    React.useEffect(() => {
        if (open && multiple) {
            const patterns = [];
            items.forEach(item => {
                patterns.push(Object.assign(item, {selected: false}));
            })
            setCloneItems(patterns);
        }
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleCancel = () => {
        onClose();
    };

    const handleSelectedItem = (item) => {
        if (!multiple) {
            onClose(item);
        }
        if (item.selected !== undefined && item.selected === true) {
            item.selected = false;
        } else {
            item.selected = true;
        }
        setChanged(!changed);
    };

    const handleOk = (v) => {
        if (multiple) {
            const selectedItems = cloneItems.filter(item => {
                if (item.selected !== undefined && item.selected === true) {
                    return item;
                }
            })
            v = selectedItems;
        }
        onClose(v);
    };

    const getBackgroundColor = (item) => {
        return item.rgb
    }

    const getColor = (item) => {
        if (item.name === 'BLACK' || item.name === 'BLUE' || item.name === 'NAVY' || item.name === 'BROWN' || item.name === 'WINE') {
            return 'rgb(255, 255, 255)'
        }
        return 'rgb(0, 0, 0)'
    }

    const getBorder = (item) => {
        if (item.selected !== undefined && item.selected === true) {
            return '2px solid red';
        }
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 700}}}
            maxWidth="md"
            open={open}
            onClose={handleCancel}
            onBackdropClick={handleCancel}
            {...other}
        >
            <DialogTitle>Color</DialogTitle>
            <DialogContent dividers>
                <Box sx={{display: 'flex', direction: 'row'}}>
                    <Box>
                        {
                            imageUrl != null ?
                                <img
                                    src={imageUrl}
                                    style={{objectFit: 'contain'}}
                                    width={500}
                                    loading="lazy"
                                /> : <></>
                        }
                    </Box>
                    <Box sx={{width: '100%'}}>
                        <Grid container
                              spacing={1}>
                            {multiple ? cloneItems.map((item) => (
                                <Grid
                                    item
                                    key={item.id}
                                    xs={'auto'}
                                >
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            display: 'flex', color: getColor(item),
                                            '&.MuiButtonBase-root:hover': {
                                                backgroundColor: getBackgroundColor(item)
                                            }
                                        }}
                                        style={{
                                            background: getBackgroundColor(item),
                                            border: getBorder(item),
                                        }}
                                        onClick={() => handleSelectedItem(item)}
                                    >
                                        {item.name}
                                    </Button>
                                </Grid>
                            )) : items.map((item) => (
                                <Grid
                                    item
                                    key={item.id}
                                    xs={'auto'}
                                >
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            display: 'flex', color: getColor(item),
                                            '&.MuiButtonBase-root:hover': {
                                                backgroundColor: getBackgroundColor(item)
                                            }
                                        }}
                                        style={{
                                            background: getBackgroundColor(item),
                                        }}
                                        onClick={() => handleSelectedItem(item)}
                                    >
                                        {item.name}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                {
                    multiple ?
                        <Button variant={'contained'}
                                onClick={handleOk}>
                            Apply
                        </Button> : <></>
                }
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const PatternDialog = (props) => {
    const {items, imageUrl, multiple = false, onClose, value: valueProp, open, ...other} = props;
    // 패턴데이터 멀티선택이 필요하여 클론함.
    const [cloneItems, setCloneItems] = React.useState([]);
    const [value, setValue] = React.useState(valueProp);
    const [changed, setChanged] = React.useState(false);

    React.useEffect(() => {
        if (open && multiple) {
            const colors = [];
            items.forEach(item => {
                colors.push(Object.assign(item, {selected: false}));
            })
            setCloneItems(colors);
        }
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleCancel = () => {
        onClose();
    };

    const handleSelectedItem = (item) => {
        if (!multiple) {
            onClose(item);
        }
        if (item.selected !== undefined && item.selected === true) {
            item.selected = false;
        } else {
            item.selected = true;
        }
        setChanged(!changed);
    };

    const handleOk = (value) => {
        if (multiple) {
            const selectedItems = cloneItems.filter(item => {
                if (item.selected !== undefined && item.selected === true) {
                    return item;
                }
            })
            value = selectedItems;
        }
        onClose(value);
    };

    const getBorder = (item) => {
        if (item.selected !== undefined && item.selected === true) {
            return '2px solid red';
        }
        return '';
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 800}}}
            maxWidth="lg"
            open={open}
            onClose={handleCancel}
            onBackdropClick={handleCancel}
            {...other}
        >
            <DialogTitle>Pattern</DialogTitle>
            <DialogContent dividers>
                <Box sx={{display: 'flex', direction: 'row'}}>
                    <Box>
                        {
                            imageUrl != null ?
                                <img
                                    src={imageUrl}
                                    style={{objectFit: 'contain'}}
                                    width={500}
                                    loading="lazy"
                                /> : <></>
                        }
                    </Box>
                    <Box sx={{width: '100%'}}>
                        <Grid container
                              spacing={0.5}>
                            {multiple ? cloneItems.map((item) => (
                                <Grid
                                    item
                                    key={item.id}
                                    xs={2}
                                >
                                    <Box sx={{textAlign: 'center'}}>
                                        <img
                                            src={`/static/pattern/${item.name}.png`}
                                            style={{
                                                cursor: 'pointer',
                                                border: getBorder(item)
                                            }}
                                            onClick={() => handleSelectedItem(item)}
                                        />
                                        <Typography variant={'subtitle2'}
                                                    component="div"
                                                    sx={{lineHeight: 1}}>{item.name}</Typography>
                                    </Box>
                                </Grid>
                            )) : items.map((item) => (
                                <Grid
                                    item
                                    key={item.id}
                                    xs={2}
                                >
                                    <Box sx={{textAlign: 'center'}}>
                                        <img
                                            src={`/static/pattern/${item.name}.png`}
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleSelectedItem(item)}
                                        />
                                        <Typography variant={'subtitle2'}
                                                    component="div"
                                                    sx={{lineHeight: 1}}>{item.name}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                {
                    multiple ?
                        <Button variant={'contained'}
                                onClick={handleOk}>
                            Apply
                        </Button> : <></>
                }
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
