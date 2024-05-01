import React, {FC, useState} from 'react';
import {Box, FormLabel, IconButton, Input, InputAdornment, Stack} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import BrandDialogCustom from "../dialog/brand-dialog-custom";
import {Brand} from "../../types/popular-search-words";

interface BrandViewSearchProps {

    /**
     * 브랜드 모델 상태 끌어올리기
     */
    getBrandModel?: (brandObject: Brand)=> void

    /**
     * 브랜드명
     */
    brandItemName ?: string

}

/**
 *
 * @param getBrandModel
 * @constructor
 */
const BrandViewSearch:FC <BrandViewSearchProps> = ({ getBrandModel , brandItemName}) => {


    /**
     * 브랜드 다이얼로그 팝업 상태값
     */
    const [brandOpen, setBrandOpen] = useState(false);
    const [brandName, setBrandName] = useState<string>(brandItemName);

    /**
     * 돋보기 버튼 이벤트 함수
     */
    const handleClickBrandOpen = () => {
        setBrandOpen(prevState => !prevState);
    };

    /**
     * 다이얼 로그에서 id 값 받기
     * @param brandObject
     */
    const getBrandObject = (brandObject?:Brand) => {
        getBrandModel(brandObject)
        setBrandName(brandObject.name)
    }

    /**
     * x 버튼 클릭시 브랜드 명 초기화
     */
    const handleBrandClear =()=>{
        setBrandName('')
    }

    return (

        <>
        <Stack direction='row'>
            <FormLabel component="legend"
                       sx={{m: 1}}>브랜드</FormLabel>
            <Box>
                <Input
                    type='text'
                    value={brandName || ''}
                    readOnly={true}
                    disabled={true}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                sx={{p: 0}}
                                onClick={handleBrandClear}
                            >
                                <ClearIcon/>
                            </IconButton>
                            <IconButton
                                sx={{p: 0}}
                                onClick={handleClickBrandOpen}
                            >
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </Box>
        </Stack>
            <BrandDialogCustom
                dialogControl={brandOpen}
                selectBrandItem={getBrandObject}
            />
        </>
    );
};

export default BrandViewSearch;