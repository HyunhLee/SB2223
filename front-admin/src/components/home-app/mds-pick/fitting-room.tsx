import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack} from "@mui/material";
import React, {useCallback, useContext, useEffect, useState} from "react";
import FittingRoomItems from "./fitting-room-items";
import CloseIcon from "@mui/icons-material/Close";
import styled from 'styled-components';


const ItemDialog = (props) => {
    const {dialogOpen, handleClose, selectedItems, setSelectedItems,selectedItemsForSave, setSelectedItemsForSave, selectedTemp, setSelectedTemp} = props;

    return (
        <>
            <Dialog open={dialogOpen}
                    sx={{'& .MuiDialog-paper': {maxWidth: 1600, width: 1600, maxHeight: 920}}}
                    maxWidth="xs"
            >
                <DialogTitle>전체 상품 리스트</DialogTitle>
                <DialogActions>
                        <CloseIcon onClick={handleClose}
                                   sx={{
                                       fontSize: 30,
                                       mr: 3,
                                       mt: -5,
                                       cursor: 'pointer'
                                   }}/>
                </DialogActions>
                <DialogContent sx={{overflow: 'hidden'}}>
                    <FittingRoomItems selectedItems={selectedItems}
                                      setSelectedItems={setSelectedItems}
                                      selectedItemsForSave={selectedItemsForSave}
                                      setSelectedItemsForSave={setSelectedItemsForSave}
                                      selectedTemp={selectedTemp}
                                      setSelectedTemp={setSelectedTemp}
                                      handleClose={handleClose}/>
                </DialogContent>
            </Dialog>
        </>
    )
}


const FittingRoom = (props) => {
    const {item, setItems, avatarType, mergeImage,} = props;

    let styleItem = item

  //selectedItems가 선택된 아이템 개별로 볼 수 있게 팝업에 뿌려지는 것
  //selectedItemsForSave가 다 선택이 되고 아바타에도 입혀지고 하는 것
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItemsForSave, setSelectedItemsForSave] = useState<any>( styleItem.imageUrl != ''  ? styleItem.items : [])
    const [selectedItems, setSelectedItems] = useState<any>(styleItem.imageUrl != ''  ? styleItem.items : [])
    const [selectedTemp, setSelectedTemp] = useState([]);

    const handleClose = () => {
        setDialogOpen(false)
        setSelectedItems([])
    }


    //수정할 데이터 초기에 넣어주는 것
    useEffect(() =>{
      if(styleItem.imageUrl != ''){
        setSelectedItemsForSave(styleItem.items)
        // setSelectedItems(styleItem.items)
      }

    },[styleItem])

  //신규 등록할 때 초기 데이터 넣어주기
  useEffect(() =>{
     setSelectedItemsForSave([])
     setSelectedItems([])
  },[])


    useEffect(() => {
        if(avatarType === "one"){
          setItems({...item , listOrder: 1, imageUrl: '', items: selectedItemsForSave})
        }else if(avatarType === "two"){
          setItems({...item , listOrder: 2, imageUrl: '', items: selectedItemsForSave})
        }else{
          setItems({...item , listOrder: 3, imageUrl: '', items: selectedItemsForSave})
        }
        mergeImage(selectedItemsForSave,avatarType)

    },[selectedItemsForSave])


  const handleImageMask = (categoryId, imageUrl) => {
    if(categoryId[1] == 11){ //vest
      return <Mask src={imageUrl} width={'100%'} loading={'lazy'} mask={'/mask/topMaskWide.png'}/>
    }else if(categoryId[0] == 1) { //outer
      return <Mask src={imageUrl} width={'100%'} loading={'lazy'} mask={'/mask/outerMask.png'} />
    }else if(categoryId[0] == 4) { //dress
      return <Mask src={imageUrl} width={'100%'} loading={'lazy'} mask={'/mask/topMask.png'}  />
    }else if(categoryId[0] == 3) { //top
      return <Mask src={imageUrl} width={'100%'} loading={'lazy'} mask={'/mask/topMask.png'}/>
    }else if(categoryId[2] == 138){ //hoodie
      return <Mask src={imageUrl} width={'100%'} loading={'lazy'} mask={'/mask/hoodMask.png'} />
    } else if(categoryId[1] == 23 || categoryId[0] == 5 || categoryId[1] == 21 || categoryId[1] == 22 || categoryId[1]==13 || categoryId[1]==14) { //hat, Acc, bag, shoes, pants
      return <Mask src={imageUrl} width={'100%'} loading={'lazy'}/>
    }
    else{
      return <img src={imageUrl} width={'100%'} loading={'lazy'} />
    }
  }


  //masking logic
  let wearHat = [];
  const handelHatItem = (items) => {
    //등록되는 상품 중에 모자 아이템이 있다면 모자 마스킹을 올리고
    items?.map((v) => {
      if (v?.product.categoryIds[1] == 23) {
        wearHat.push(v)
      }
    })
  }

  //쌓여있는 악세 제외한 의류 아이템 인덱스 찾아서 마스킹하기 위한 함수
  let clothesArr = [];
  const viewArr = (items) => {
   return items?.map((v, idx) => {
      if(v.product.categoryIds[1] !== 23 && v.product.categoryIds[1] !== 22 && v.product.categoryIds[0] !== 5 && v.product.categoryIds[1] !== 21 && v.product.categoryIds[1] !== 22 && v.product.categoryIds[1]!==13 && v.product.categoryIds[1]!==14){
        clothesArr.push(idx)
      }
    })
  }

  return (
    <>
      <Box sx={{px: 10, py: 3}}
           key= {item.id}>
        <Stack  width={300}
                sx={{backgroundColor : 'lightgray', borderRadius: '15px', position: 'relative'}}>
          {handelHatItem(selectedItemsForSave)}
          {viewArr(selectedItemsForSave)}
          {avatarType === 'one' || styleItem.listOrder == 1 ? wearHat.length > 0 ?  <Mask src='/mdpick_avatar1.png' width={300} mask={'/mask/hat_mask.png'}/> :  <img src='/mdpick_avatar1.png' width={300}/> : <></>}
          {avatarType === 'two' || styleItem.listOrder == 2 ? wearHat.length > 0 ?  <Mask src='/mdpick_avatar2.png' width={300} mask={'/mask/hat_mask.png'}/> :  <img src='/mdpick_avatar2.png' width={300}/> : <></>}
          {avatarType === 'three' || styleItem.listOrder == 3 ? wearHat.length > 0 ?  <Mask src='/mdpick_avatar3.png' width={300} mask={'/mask/hat_mask.png'}/> :  <img src='/mdpick_avatar3.png' width={300}/> : <></>}
          {selectedItemsForSave?.map((v, idx) => {
            let lastIndex = clothesArr[clothesArr.length - 1]
            return (
              <>
                <Stack sx={{position: 'absolute', top: 0, left: 0}}
                       key={v.product.id}>
                  {idx == lastIndex ? <img src={`${v.product.putOnImageUrl}?t=${new Date().getTime()}`} width={'100%'} loading={'lazy'}/> :
                    (v.product.categoryIds[1] ==21 ) ? <img src={`${v.product.putOnImageUrl}?t=${new Date().getTime()}`} width={'100%'} loading={'lazy'}/>:
                    handleImageMask(selectedItemsForSave[lastIndex]?.product.categoryIds, `${v.product.putOnImageUrl}?t=${new Date().getTime()}`)}
                </Stack>

              </>

            )
          })}
        </Stack>
        <Stack sx={{display:'flex', justifyContent: 'center', alignItems:'center'}}>
          <Button sx={{mt: 5}}
                  variant='outlined'
                  onClick={() => setDialogOpen(true)}>상품 선택</Button>
        </Stack>
      </Box>
      <ItemDialog dialogOpen={dialogOpen}
                  handleClose={handleClose}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  selectedItemsForSave={selectedItemsForSave}
                  setSelectedItemsForSave={setSelectedItemsForSave}
                  selectedTemp={selectedTemp}
                  setSelectedTemp={setSelectedTemp}
      />
    </>
  )
}


// image-mask
const Mask = styled.img`
    mask-image: ${(p) => `url("${p.mask}")`};
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    -webkit-mask-image:  ${(p) => `url("${p.mask}")`};
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    `

export default FittingRoom;