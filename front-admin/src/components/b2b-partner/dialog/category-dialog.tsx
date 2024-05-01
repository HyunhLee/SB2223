import React, {useRef, useState} from "react";
import TreeMenu from "react-simple-tree-menu";
import toast from "react-hot-toast";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

export const CategoryDialog = (props) => {
    const {
        category,
        imageUrl,
        onClose,
        selectedLastDepth = false,
        parent = 'NONE',
        value: valueProp,
        open,
        ...other
    } = props;
    const [value, setValue] = useState(valueProp);
    const treeMenuRef = useRef<TreeMenu>();

    React.useEffect(() => {
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
            if (item.level <= 1 && item.label !=='BUSTIER' && item.label !== 'GLOVES') {
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
        if(parent === 'UPLOAD') {
            if (item.label !=='OUTER' && item.label !== 'DRESS' && item.label !== 'VEST' && item.label !== 'TOP' && item.label !== 'PANTS' && item.label !== 'SKIRT') {
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
                        <TreeMenu
                            ref={treeMenuRef}
                            data={category}
                            onClickItem={(item) => handleApply(item)}
                        />
                    </Box>
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
