import Head from 'next/head';
import type {NextPage} from "next";
import {Box, Button, Card, CardContent, Container, Divider, Grid, Typography} from '@mui/material';
import StyleChoice from "../../components/style/style-choice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DressUpProcedure from "../../components/style/dressup-procedure";
import React, {useCallback, useContext, useEffect, useState} from "react";
import _ from 'lodash';
import {useRouter} from "next/router";
import {useMounted} from "../../hooks/use-mounted";
import type {StyleRecommend} from "../../types/style";
import {styleApi} from "../../api/style-api";
import {DataContext} from "../../contexts/data-context";
import SaveIcon from '@mui/icons-material/Save';
import {fileApi} from "../../api/file-api";
import toast from "react-hot-toast";
import {sortBySeason, sortByTaste} from "../../utils/data-convert";

const defaultItem = (index: number) => {
  return {
    category1: null,
    category2: null,
    category3: null,
    category4: null,
    category5: null,
    colorType: null,
    patternType: null,
    fitOrder: index,
    key: Math.random().toString(36).substr(2,11)
  }
}

const StyleManual: NextPage = () => {
  const router = useRouter();
  const dataContext = useContext(DataContext);
  const isMounted = useMounted();
  const [isDoubleClick, setDoubleClick] = useState(false);

  const {id} = router.query;

  const [styleRecommend, setStyleRecommend] = useState<StyleRecommend>({
    activated: true,
    imageUrlList: [],
    items: [],
    lookBookImageUrl: null,
    lookBookImage: [],
    registerType: 'MANUAL',
    seasonTypes: null,
    putOnImageUrl: [],
    tasteCode: null,
    tpoType: null,
    loaded: false,
  });

  // lookbook 파일
  const [files, setFiles] = useState([]);

  const [pageState, setPageState] = useState('INIT');

  const [style, setStyle] = useState({
    lookbook: {
      header: 'LOOKBOOK',
      file: {},
      items: [],
    },
    acc: {
      header: 'ACC',
      items: [],
    },
    outer: {
      header: 'OUTER',
      items: [],
    },
    dress: {
      header: 'DRESS',
      items: [],
    },
    top: {
      header: 'TOP',
      items: [],
    },
    bottom: {
      header: 'BOTTOM',
      items: [],
    },
    shoes: {
      header: 'SHOES',
      items: [],
    },
    bag: {
      header: 'BAG',
      items: [],
    }
  });

  const beforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
    console.log('##############refresh#############')

  };


  //새로고침시 경고 팝업창
  useEffect(() => {
    try {
      window.addEventListener('beforeunload', beforeUnload);
      return () => {
        window.removeEventListener('beforeunload', beforeUnload);
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (id && id !== '0') {
      (async () => {
        await getStyleRecommend(id);
      })()
    }
  }, [id]);

  const getStyleRecommend = useCallback(async (id) => {
    try {
      const result = await styleApi.getStyleRecommend(id);
      if (isMounted()) {
        // 스타일 데이터 변환
        const newStyle = Object.assign({}, style);
        result.imageUrlList.forEach(image => {
          const category = dataContext.CATEGORY_MAP[image.categoryId];
          if (category) {
            newStyle[category.name.toLowerCase()].items.push(image);
          }
        });
        result.items.forEach(item => {
          item.key = Math.random().toString(36).substr(2,11);
        })
        result.loaded = true;
        setStyleRecommend(result);
        setStyle(newStyle);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    if (pageState === 'INIT' && styleRecommend.loaded) {
      setPageState('READY');
    }
    if (pageState === 'READY' || pageState === 'SAVE') {
      setPageState('CHANGE');
    }
  }, [styleRecommend]);

  useEffect(() => {
    console.log('change: files', files)
    setStyleRecommend({
      ...styleRecommend,
      lookBookImageUrl: (files.length > 0) ? files[0].preview : null,
    })
  }, [files]);

  const addStyleItemHandle = (items) => {
    const styleItems = [];
    const imageUrlItems = [];
    const newStyle = Object.assign({}, style);
    setDoubleClick(false);

    items.forEach((item, index) => {
      const count = (styleRecommend.items.length) + index + 1;
      const styleData: any = {
        category1: null,
        category2: null,
        category3: null,
        category4: null,
        category5: null,
        fitOrder: count,
        key: Math.random().toString(36).substr(2,11)
      };
      console.log('item.categoryIds.length', item.categoryIds);
      if (item.categoryIds.length === 0) {
        toast.error('카테고리가 등록되지 않은 상품은 선택할 수 없습니다.');
        return true;
      }

      if (item.categoryIds.length > 0) {
        item.categoryIds.forEach((categoryId, index) => {
          if (index == 0) {
            styleData.category1 = categoryId;
          } else if (index == 1) {
            styleData.category2 = categoryId;
          } else if (index == 2) {
            styleData.category3 = categoryId;
          } else if (index == 3) {
            styleData.category4 = categoryId;
          } else if (index == 4) {
            styleData.category5 = categoryId;
          }
        });
      }
      styleData.colorType = item.colorType;
      styleData.patternType = item.patternType;
      if (item.mainImageUrl) {
        let category = dataContext.CATEGORY_MAP[styleData.category1];
        if (styleData.category2) {
          if (styleData.category2 === 22 || styleData.category2 === 21) {
            category = dataContext.CATEGORY_MAP[styleData.category2];
          }
        }
        const imageData = {
          imageUrl: item.mainImageUrl,
          categoryId: category.id,
        }
        newStyle[category.name.toLowerCase()].items.push(imageData);
        imageUrlItems.push(imageData)
      }
      styleItems.push(styleData);
    })

    let newStyleItems = [...styleRecommend.items, ...styleItems];
    let newImageItems = [...styleRecommend.imageUrlList, ...imageUrlItems];
    // categoryId 로 정렬
    //newItems = _.sortBy(newItems, 'category1').reverse();
    // 1) SHOES: 22  2) TOP:3   3) DRESS: 4   4) BOTTOM: 2  5) OUTER: 1   6) ACC: 5   7) BAG: 21 순으로 재정렬

    newStyleItems = _.sortBy(newStyleItems, (item) => {
      if (item.category2) {
        switch (item.category2) {
          case 27:
            return 0
          case 22:
            return 1;
          case 21:
            return 7;
        }
      }
      switch (item.category1) {
        case 3:
          return 2;
        case 4:
          return 3;
        case 2:
          return 4;
        case 1:
          return 5;
        case 5:
          return 6;
      }
      return 9999;
    })

    setStyleRecommend(prevData => ({
      ...prevData,
      items: newStyleItems,
      imageUrlList: newImageItems
    }))
    setStyle(newStyle);
  }

  // 뒤로 돌아가기
  const handleBack = (e) => {
    e.preventDefault();
    console.log(pageState);
    if (pageState === 'CHANGE') {
      if (!window.confirm('스타일 수정이 되었습니다. 변경사항을 저장하지 않고 나가시겠습니까?')) {
        return;
      }
    }
    router.push(`/style/jennies-pick?storeSearch=true`);
  }

  // 빈 스타일(착장) 데이터 생성
  const addStyleBlankHandler = (): void => {
    setDoubleClick(false);
    const addStyleItems = [defaultItem(styleRecommend.items.length + 1)];
    let newItems = [...styleRecommend.items, ...addStyleItems];
    setStyleRecommend(prevData => ({
      ...prevData,
      items: newItems
    }))
  }

  // 스타일(착장) 삭제
  const deleteStyleHandler = (deleteItem): void => {
    let newItems = [...styleRecommend.items];
    _.remove(newItems, function(item) {
      return item.key === deleteItem.key;
    });
    setStyleRecommend(prevData => ({
      ...prevData,
      items: newItems
    }))
  }

  // 스타일(이미지) 삭제
  const deleteStyleImageHandler = (items, deleteItem, header): void => {
    const newImageUrlList = [...styleRecommend.imageUrlList];
    _.remove(newImageUrlList, function(item) {
      return item.imageUrl === deleteItem.imageUrl;
    });
    setStyleRecommend(prevData => ({
      ...prevData,
      imageUrlList: newImageUrlList
    }))
    setStyle(prevData => ({
      ...prevData,
      [header.toLowerCase()]: {
        header: header,
        items: items,
      },
    }))
  }

  // 스타일(착장) 정렬
  const reOrderItems = (items): void => {
    setStyleRecommend(prevData => ({
      ...prevData,
      items: items
    }))
  }

  const changeTasteHandler = (value, checkValues): void => {
    let tasteCode = [];
    if (styleRecommend.tasteCode) {
      tasteCode = Array.from(styleRecommend.tasteCode);
    }
    if (tasteCode.length > 0) {
      const findValue = checkValues.find(checkValue => tasteCode.includes(checkValue));
      if (findValue) {
        _.remove(tasteCode, (data) => {
          return data == findValue;
        })
      }
    }
    tasteCode.push(value);

    setStyleRecommend(prevData => ({
      ...prevData,
      tasteCode: tasteCode.join('')
    }))
  }

  const changeTasteRecommendHandler = (tasteCode): void => {
    setStyleRecommend(prevData => ({
      ...prevData,
      tasteCode: (tasteCode) ? tasteCode : []
    }))
  }

  const changeTpoHandler = (value: string): void => {
    setStyleRecommend(prevData => ({
      ...prevData,
      tpoType: value
    }))
  }

  const changeSeasonHandler = (value: string, checked: boolean): void => {
    let season = []
    if (styleRecommend.seasonTypes) {
      season = styleRecommend.seasonTypes.split(',');
    }
    if (checked) {
      season.push(value);
    } else {
      _.remove(season, (data) => {
        return data == value;
      });
    }
    setStyleRecommend(prevData => ({
      ...prevData,
      seasonTypes: season.join(',')
    }))
  }

  // 룩북 파일 추가시
  const addFileImageHandler = (imageFiles) => {
    console.log(imageFiles);
    setFiles(imageFiles);
  }

  const saveHandler = async (): Promise<void> => {
    console.log('saveHandler', styleRecommend);

    if (_.isEmpty(styleRecommend.items)) {
      toast.error('등록된 추천이 없습니다.');
      return;
    }
    if (_.isEmpty(styleRecommend.tpoType)) {
      toast.error('TPO를 선택해 주세요.');
      return;
    }
    if (_.isEmpty(styleRecommend.tasteCode)) {
      toast.error('취향을 선택해 주세요.');
      return;
    }
    if (_.isEmpty(styleRecommend.seasonTypes)) {
      toast.error('시즌을 선택해 주세요.');
      return;
    }
    let shoesCount = 0;
    let checkEmptyCategory = false;
    let checkEmptyColor = false;
    let checkEmptyPattern = false;
    let checkEmptyIndex = -1;
    let checkDress = false;
    let checkTop = false;
    let checkBottom = false;
    let checkOuter = false;
    let checkFitOrderOuter = true;
    // 1. OUTER, 2. BOTTOM, 3. TOP, 4. DRESS, 5. ACC -> 착장 순서
    styleRecommend.items.forEach((item, index) => {
      if (!checkEmptyCategory && checkEmptyIndex === -1 && item.category1 == null) {
        checkEmptyCategory = true;
        checkEmptyIndex = index;
      }
      if (!checkEmptyPattern && checkEmptyIndex === -1 && _.isEmpty(item.patternType)) {
        checkEmptyPattern = true;
        checkEmptyIndex = index;
      }
      if (!checkEmptyColor && checkEmptyIndex === -1 && _.isEmpty(item.colorType)) {
        checkEmptyColor = true;
        checkEmptyIndex = index;
      }
      // 디버깅중 타입오류가 있어서 넘버로 변경.
      const category = Number(item.category1);
      if (category === 4) {
        if (checkOuter) {
          checkFitOrderOuter = false;
        }
        checkDress = true;
      }
      if (category === 3) {
        if (checkOuter) {
          checkFitOrderOuter = false;
        }
        checkTop = true;
      }
      if (category === 2) {
        if (checkOuter) {
          checkFitOrderOuter = false;
        }
        checkBottom = true;
      }
      if (category === 1) {
        // 아웃터 체크. TOP, DRESS, BOTTOM 보다 후순위로 나와야함.
        checkOuter = true;
      }
      if (Number(item.category2) === 22) {
        shoesCount += 1;
      }
    });
    if (checkEmptyCategory) {
      toast.error(`${checkEmptyIndex + 1}번째 카테고리를 선택해주세요.`);
      return;
    }
    if (checkEmptyColor) {
      toast.error(`${checkEmptyIndex + 1}번째 색상을 선택해주세요.`);
      return;
    }
    if (checkEmptyPattern) {
      toast.error(`${checkEmptyIndex + 1}번째 패턴을 선택해주세요.`);
      return;
    }
    if (shoesCount === 0) {
      toast.error('신발 카테고리를 추가해주세요.');
      return;
    }
    if (shoesCount > 1) {
      toast.error('신발은 하나만 선택할 수 있습니다.');
      return;
    }
    if (styleRecommend.items.length === 1) {
      toast.error('의류 카테고리를 추가해주세요.');
      return;
    }
    if (!checkDress) {
      if (!checkTop) {
        toast.error(`TOP 카테고리를 추가해주세요.`);
        return;
      }
      if (!checkBottom) {
        toast.error(`BOTTOM 카테고리를 추가해주세요.`);
        return;
      }
    }
    if (!checkFitOrderOuter) {
      toast.error(`OUTER 카테고리의 착장순서를 확인해주세요. TOP/BOTTOM/DRESS 보다 후순위여야 합니다.`);
      return;
    }
    if (window.confirm('저장하시겠습니까?')) {
      const saveData = {...styleRecommend};
      if (files.length > 0) {
        saveData.lookBookImageUrl = await fileApi.uploadFile('style-recommend', files[0]);
      }
      // 데이터 소트 적용(시즌, 취향)
      if (saveData.tasteCode) {
        saveData.tasteCode = sortByTaste(Array.from(saveData.tasteCode)).join('');
      }
      if (saveData.seasonTypes) {
        saveData.seasonTypes = sortBySeason(saveData.seasonTypes.split(',')).join(',');
      }

      if (saveData.items) {
        saveData.items.forEach((item, index) => {
          item.fitOrder = index + 1;
        });
      }

      let result = null;
      if (saveData.id) {
        result = await styleApi.putStyleRecommend(saveData).catch((res) => {
          if (res == 'Error: Request failed with status code 400') toast.error('이미 등록된 스타일입니다')})
      } else {
        result = await styleApi.postStyleRecommend(saveData).catch((res) => {
          if (res == 'Error: Request failed with status code 400') toast.error('이미 등록된 스타일입니다')
        });
      }
      if (result && result.id) {
        toast.success('스타일 추천이 저장 되었습니다.');
        setPageState('SAVE');
        setDoubleClick(true);
      }

    }
  }

  return (
      <>
        <Head>
          Style | StyleBot
        </Head>
        <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8
            }}
        >
          <Container maxWidth="lg">
            <Box sx={{mb: 2}}>
              <a onClick={handleBack}
                 style={{cursor: 'pointer'}}>
                <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                  <ArrowBackIcon
                      fontSize="small"
                      sx={{mr: 1}}
                  />
                  <Typography variant="subtitle2">
                    Style
                  </Typography>
                </Grid>
              </a>
            </Box>
            <Box>
              <Grid sx={{mb: 1, display: 'flex', justifyContent: "flex-end"}}>
                <Button variant="contained"
                        disabled={isDoubleClick}
                        startIcon={<SaveIcon />}
                        onClick={ () => { saveHandler() }}>
                  {id === '0' ? '스타일 저장' : '스타일 수정'}
                </Button>
              </Grid>
            </Box>
            <Box>
              <Grid
                  container
                  spacing={2}
              >
                <Grid
                    item
                    xs={12}
                    lg={6}
                >
                  <Card>
                    <CardContent>
                      <StyleChoice
                          style={style}
                          addStyleItem={addStyleItemHandle}
                          addFileImage={addFileImageHandler}
                          deleteStyleImage={deleteStyleImageHandler}
                          imageUrlData={styleRecommend.lookBookImageUrl}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                    lg={6}
                >
                  <Divider/>
                  <Card>
                    <CardContent>
                      <DressUpProcedure
                          addStyleBlank={addStyleBlankHandler}
                          deleteStyle={deleteStyleHandler}
                          reOrderItems={reOrderItems}
                          changeSeason={changeSeasonHandler}
                          changeTpo={changeTpoHandler}
                          changeTaste={changeTasteHandler}
                          changeTasteRecommend={changeTasteRecommendHandler}
                          data={styleRecommend}
                          items={(styleRecommend && styleRecommend.items) ? styleRecommend.items : []}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </>
  )
}

export default StyleManual;