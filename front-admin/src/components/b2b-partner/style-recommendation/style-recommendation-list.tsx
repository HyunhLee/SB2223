import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import {getDataContextValue, getNumberComma} from "../../../utils/data-convert";
import DeleteIcon from "@mui/icons-material/Delete";
import {DataContext} from "../../../contexts/data-context";
import styled from 'styled-components';
import moment from "moment/moment";
import {useRouter} from "next/router";
import {b2bStyleRecommendApi} from "../../../b2b-partner-api/b2b-style-recommend-api";
import toast from "react-hot-toast";


const PreviewPopup = (props) => {
  const { totalList, gender, styleId,selectedIdx, styleList, previewOpen, onClose, viewArr, clothesArr, handleImageMask, ...other} = props;

  const handleClose = () => {
    onClose();
  }

  let wearHat = [];
  const handelHatItem = (items) => {
    //등록되는 상품 중에 모자 아이템이 있다면 모자 마스킹을 올리고
    items?.map((v) => {
      if (v?.categoryId == 23 || v?.categoryId == 378 ) {
        wearHat.push(v)
      }
    })
  }


  let temp = []
  const getGender = (id) =>{
    temp = totalList.filter((v) => v.id === id)
    return temp[0]?.gender
  }

  useEffect(() => {
     if(styleId == selectedIdx){
       const tempArr = totalList.filter((v) => v.id === selectedIdx)
      handelHatItem(tempArr[0].imageUrlList)
     }
  },[previewOpen])

  return (
    <Dialog
      open={previewOpen}
      onClose={handleClose}
      onBackdropClick={handleClose}
      {...other}
    >
      <DialogTitle>{selectedIdx}</DialogTitle>
      <DialogContent>
            <Stack sx={{position: 'relative', width: 300, height: 600}}>
              {viewArr(styleList)}
              {getGender(selectedIdx) == 'F' ?
                wearHat.length > 0 ? <Mask src='/avatar0.png'
                                           width={"100%"}
                                           mask={'/mask/hat_mask.png'}/> :
                  <img src="/avatar0.png"
width={"100%"}/>
                :
                wearHat.length > 0 ? <Mask src='/avatar_mask.png'
                                             width={"100%"}
                                             mask={'/mask/hat_mask.png'}/> :
                  <img src='/avatar1.png'
width={"100%"}/>
              }
              {styleList.map((v, idx) => {
                let lastIndex = clothesArr[clothesArr.length - 1]
                return (
                  <>
                    <Stack sx={{position: 'absolute', top: 0, left: 0}}
                           key={v.categoryId}>
                      {idx == lastIndex ? <img src={v.putOnImageUrl}
                                               width={'100%'}
                                               loading={'lazy'}/> :
                        (v.categoryId == 21) ? <img src={v.putOnImageUrl}
                                                    width={'100%'}
                                                    loading={'lazy'}/> :
                          handleImageMask(styleList[lastIndex]?.categoryId, v.putOnImageUrl)}
                    </Stack>
                  </>
                )
              })}
            </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  )
};

const StyleRecommendationList = (props) => {
  const {list, count, handlePageChange, handleRowsPerPageChange, rowsPerPage, page, setRequestList, isLoaded} = props;
  const router = useRouter();
  const dataContext = useContext(DataContext);
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<[]>([]);

  const [selectedIdx, setSelectedIdx] = useState(null);



  const renderSeason = (value) => {
    const seasonArr = value.split(',')
    let arr = []
    seasonArr.map((v) => {
      arr.push(dataContext.BTB_DEFAULT_PRODUCT_SEASON[v])
    })
    return arr.join(',')

  }

  const renderKeywords = (value) => {
    const keywordArr = value
    let arr = []
    keywordArr?.map((v) => {
      arr.push(dataContext.B2BKEYWORDS[v])
    })
    return arr.join(',')

  }


  const renderStyleItem = (items, gender) => {
    if(gender == 'F'){
      return items.map(item => {
        return (
          <div key={item.id}>
            <span style={{marginRight: 8}}>{item.fitOrder}.</span>
            {getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category1, 'name')}+
            {getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category2, 'name')}+
            {getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category3, 'name')}+
            {getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category4, 'name')}+
            {getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category5, 'name')}++
            {item.colorType}+
            {item.patternType}
          </div>
        )
      });
    }else{
      return items.map(item => {
        return (
          <div key={item.id}>
            <span style={{marginRight: 8}}>{item.fitOrder}.</span>
            {getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category1, 'name')}+
            {getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category2, 'name')}+
            {getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category3, 'name')}+
            {getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category4, 'name')}+
            {getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category5, 'name')}++
            {item.colorType}+
            {item.patternType}
          </div>
        )
      });
    }

  }

  const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedAllLists(event.target.checked);
    setSelectedLists(event.target.checked
      ? list.map((list) => list.id)
      : []);
  };

  const handleSelectOneList = (
    event: ChangeEvent<HTMLInputElement>,
    listId: number
  ): void => {
    setSelectedAllLists(false)
    if (!selectedLists.includes(listId)) {
      setSelectedLists((prevSelected) => [...prevSelected, listId]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
    }
  };

  const handleDelete = async() =>{
    if(selectedLists.length > 0){
      if(window.confirm(`스타일 세트 삭제\n선택한 ${selectedLists.length}개의 스타일 세트를 삭제하시겠습니까?`)){
        const result = await b2bStyleRecommendApi.deleteJenniePickRecommend(selectedLists)
        if(result == 204){
          toast.success('삭제가 완료 되었습니다.')
          setRequestList(true);
        }else{
          toast.error('삭제가 실패했습니다. 다시 시도해주세요.')
        }
      }else{
        return;
      }
    }else{
      window.confirm(`선택된 스타일 세트가 없습니다.`)
    }

  }

  const handleClick = (id) => {
    router.push(`/b2b-partner/style-recommendation/b2b-style-recommend?id=${id}`);
  }

  const handleImageMask = (categoryId, imageUrl) => {
    if (categoryId == 11) { //vest
      return <Mask src={imageUrl}
width={'100%'}
loading={'lazy'}
mask={'/mask/topMaskWide.png'}/>
    } else if (categoryId == 1) { //outer
      return <Mask src={imageUrl}
                   width={'100%'}
                   loading={'lazy'}
                   mask={'/mask/outerMask.png'}/>
    } else if (categoryId == 4) { //dress
      return <Mask src={imageUrl}
                   width={'100%'}
                   loading={'lazy'}
                   mask={'/mask/topMask.png'}/>
    } else if (categoryId == 3) { //top
      return <Mask src={imageUrl}
                   width={'100%'}
                   loading={'lazy'}
                   mask={'/mask/topMask.png'}/>
    } else if (categoryId == 138) { //hoodie
      return <Mask src={imageUrl}
                   width={'100%'}
                   loading={'lazy'}
                   mask={'/mask/hoodMask.png'}/>
    } else if (categoryId == 23 || categoryId == 5 || categoryId == 21 || categoryId == 22 || categoryId == 13 || categoryId == 14) { //hat, Acc, bag, shoes, pants
      return <Mask src={imageUrl}
                   width={'100%'}
                   loading={'lazy'}/>
    } else {
      return <img src={imageUrl}
                  width={'100%'}
                  loading={'lazy'}/>
    }
  }

  //masking logic
  const handelHatItem = (items) => {
    let wearHat = [];
    //등록되는 상품 중에 모자 아이템이 있다면 모자 마스킹을 올리고
    items?.map((v) => {
      if (v?.categoryId == 23 || v?.categoryId == 378 ) {
        wearHat.push(v)
      }
    })

    return wearHat.length
  }

  //쌓여있는 악세 제외한 의류 아이템 인덱스 찾아서 마스킹하기 위한 함수
  let clothesArr = [];
  const viewArr = (items) => {
    return items?.map((v, idx) => {
      if(v.categoryId !== 23 && v.categoryId !== 22 && v.categoryId !== 5 && v.categoryId !== 21 && v.categoryId !== 22 && v.categoryId!==13 && v.categoryId!==14){
        clothesArr.push(idx)
      }
    })
  }
  const handlePreview = (items, gender) => {
    return (
      <Stack sx={{position: 'relative', width: 80, height: 150}}>
        {viewArr(items)}
        {gender == 'F' ?
          handelHatItem(items) > 0 ? <Mask src='/avatar0.png'
                                      width={"100%"}
                                      mask={'/mask/hat_mask.png'}/> : <img src="/avatar0.png"
                                                                           width={"100%"}/>
        :
          handelHatItem(items) > 0 ? <Mask src='/avatar_mask.png'
                                      width={"100%"}
                                      mask={'/mask/hat_mask.png'}/> : <img src='/avatar1.png'
                                                                           width={"100%"}/>
        }
        {items.map((v, idx) => {
          let lastIndex = clothesArr[clothesArr.length - 1]
          return (
            <>
              <Stack sx={{position: 'absolute', top: 0, left: 0}}
                     key={v.categoryId}>
                {idx == lastIndex ? <img src={v.putOnImageUrl}
                                         width={'100%'}
                                         loading={'lazy'}/> :
                  (v.categoryId == 21) ? <img src={v.putOnImageUrl}
                                              width={'100%'}
                                              loading={'lazy'}/> :
                    handleImageMask(items[lastIndex]?.categoryId, v.putOnImageUrl)}
              </Stack>
            </>
          )
        })}
      </Stack>
    )
  }

  const handlePreviewPopup =() =>{
    setPreviewOpen(false)
  }

  const openPreviewDialog = (id) => {
    let temp = list.filter((v, i) => v.id == id ? setPreviewUrl(v.imageUrlList) : null)
    setPreviewOpen(true)
    setSelectedIdx(id)
  }

  const renderMallBrandList = (value) => {
    if(value.length > 1){
      return value.join(',')
    }else if(value.length === 1){
      return value[0]
    }else{
      return ""
    }
  }

  return (
    <>
      <Box>
        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant="h6">{isLoaded && `총 ${getNumberComma(count? count : 0)} 건`}</Typography>
              <Button variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={handleDelete}  >
                삭제
              </Button>
        </Grid>
      </Box>
      <TablePagination
          component="div"
          count={count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          showFirstButton
          showLastButton
      />
        <Table sx={{ minWidth: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllLists}
                  onChange={handleSelectAllLists}
                />
              </TableCell>
              <TableCell align={'center'}>
                스타일 ID
              </TableCell>
              <TableCell align={'center'}
sx={{width: '10%'}}>
                회사
              </TableCell>
              <TableCell align={'center'}
sx={{width: '10%'}}>
                브랜드
              </TableCell>
              <TableCell align={'center'}
sx={{width: '10%'}}>
                스타일 키워드
              </TableCell>
              <TableCell align={'center'}>
                시즌
              </TableCell>
              <TableCell align={'center'}>
                착장 구성목록
              </TableCell>
              <TableCell sx={{width :90, align:'center'}}>
                착장 프리뷰
              </TableCell>
              <TableCell align={'center'}>
                등록일
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoaded && list?.map((style) => {
              const isListSelected = selectedLists.includes(style.id);
              return (
                <TableRow
                  hover
                  key={style.id}
                >
                  <TableCell
                    padding="checkbox"
                    width="25%"
                  >
                    <Checkbox
                      checked={isListSelected}
                      onChange={(event) => handleSelectOneList(
                        event,
                        style.id
                      )}
                      value={isListSelected}
                    />
                  </TableCell>
                  <TableCell
                    align={'center'}
                    onClick={() => handleClick(style.id)}
                  >
                    <Link sx={{cursor: 'pointer'}}>
                      {style.id}
                    </Link>
                  </TableCell>
                  <TableCell align={'center'}>
                    {renderMallBrandList(style.mallList)}
                  </TableCell>
                  <TableCell align={'center'}>
                      {renderMallBrandList(style.brandList)}
                  </TableCell>
                  <TableCell align={'center'}>
                      {renderKeywords(style.keywords)}
                  </TableCell>
                  <TableCell align={'center'}>
                    {renderSeason(style.seasonTypes)}
                  </TableCell>
                  <TableCell>
                    {renderStyleItem(style.items, style.gender)}
                  </TableCell>
                  <TableCell
                    sx={{cursor:'pointer'}}
                      onClick={() => openPreviewDialog(style.id)}>
                    {handlePreview(style.imageUrlList, style.gender)}
                  </TableCell>
                  <TableCell align={'center'}>
                    {moment(style.createdDate).format('YYYY-MM-DD')}
                  </TableCell>
                  <PreviewPopup
                    gender={style.gender}
                    totalList={list}
                    styleId={style.id}
                    styleList={previewUrl}
                    previewOpen={previewOpen}
                    onClose={handlePreviewPopup}
                    viewArr={viewArr}
                    selectedIdx={selectedIdx}
                    handleImageMask={handleImageMask}
                    clothesArr={clothesArr}
                  />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      {isLoaded && list?.length === 0 ?  <Stack
        sx={{
          height: 100,
          width: '100%',
          textAlign:'center',
          mt: 15
        }}>검색한 자료가 없습니다.</Stack> : <></>}
      {!isLoaded &&
          <Stack
              sx={{
                height: 100,
                width: '100%',
                textAlign:'center',
                mt: 15
              }}>데이터 로딩 중입니다...</Stack>}
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        showFirstButton
        showLastButton
      />
    </>

  )
};


// image-mask
const Mask = styled.img`
    mask-image: ${(p) => `url("${p.mask}")`};
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    -webkit-mask-image:  ${(p) => `url("${p.mask}")`};
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    `


export default StyleRecommendationList;