import Head from 'next/head';
import type {NextPage} from "next";
import {Box, Button, Card, CardContent, Container, Divider, Grid, IconButton, Typography} from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useCallback, useContext, useEffect, useState} from "react";
import _ from 'lodash';
import {useRouter} from "next/router";
import {useMounted} from "../../../hooks/use-mounted";
import {DataContext} from "../../../contexts/data-context";
import SaveIcon from '@mui/icons-material/Save';
import toast from "react-hot-toast";
import {sortBySeason} from "../../../utils/data-convert";
import StyleItemChoice from "../../../components/b2b-partner/style-recommendation/style-item-choice";
import StyleProcedure from "../../../components/b2b-partner/style-recommendation/style-procedure";
import styled from "styled-components";
import type {StyleRecommend} from "../../../types/b2b-partner-model/b2b-style";
import {b2bStyleRecommendApi} from "../../../b2b-partner-api/b2b-style-recommend-api";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";

const defaultItem = (index: number) => {
    return {
        productColorId: null,
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

const B2bStyleRecommend: NextPage = () => {
    const router = useRouter();
    const dataContext = useContext(DataContext);
    const isMounted = useMounted();
    const {id} = router.query;

    const [brand, setBrand] = useState(null);
    const [gender, setGender] = useState<string>('M');
    const [itemStyle, setItemStyle] = useState<string>('D');
    const [isDoubleClick, setDoubleClick] = useState(false);
    const [styleRecommend, setStyleRecommend] = useState<StyleRecommend>({
        activated: true,
        imageUrlList: [],
        items: [],
        registerType: 'Daily',
        seasonTypes: '',
        loaded: false,
        gender: gender
    });

    const [pageState, setPageState] = useState('INIT');

    const [style, setStyle] = useState({
        acc: {
            header: 'ACC',
            items: [],
        },
        hat: {
            header: 'HAT',
            items: [],
        },
        glasses: {
            header: 'GLASSES',
            items: [],
        },
        socks: {
            header: 'SOCKS',
            items: [],
        },
        scarf: {
            header: 'SCARF',
            items: [],
        },
        tie: {
            header: 'TIE',
            items: [],
        },
        muffler: {
            header: 'MUFFLER',
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
        },
        dressshirt: {
            header: 'DRESSSHIRT',
            items: [],
        },
        suitpants: {
            header: 'SUITPANTS',
            items: [],
        },
        suitjacket: {
            header: 'SUITJACKET',
            items: [],
        },
        suitvest: {
            header: 'SUITVEST',
            items: [],
        },
        etc: {
            header: 'ETC',
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
        const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
        if(router.query){
            console.log(router.query, 'router query')
            if (id === undefined) {
                return
            }
            if(id && id !== '0') {
                (async () => {
                    await wait(500)
                    await getStyleRecommend(id);
                })()
            }
        }

    }, [router.query]);

    const getStyleRecommend = useCallback(async (id) => {
        try {
            const result = await b2bStyleRecommendApi.getStyleRecommend(id);
            setGender(result.gender);

            if (isMounted()) {
                // 스타일 데이터 변환
                const newStyle = Object.assign({}, style);
                result.imageUrlList.forEach(image => {
                    const category = result.gender == 'M' ? dataContext.MALE_CATEGORY_MAP[image.categoryId] : dataContext.CATEGORY_MAP[image.categoryId]
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
                if(result.registerType == "Daily") {
                    setItemStyle('D');
                } else if(result.registerType == "Suit") {
                    setItemStyle('S');
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMounted]);



    useEffect(() => {
        if(id == '0') {
            setStyleRecommend({
                activated: true,
                imageUrlList: [],
                items: [],
                registerType: 'Daily',
                seasonTypes: '',
                loaded: false,
                gender: gender
            });
            setStyle({
                acc: {
                    header: 'ACC',
                    items: [],
                },
                hat: {
                    header: 'HAT',
                    items: [],
                },
                glasses: {
                    header: 'GLASSES',
                    items: [],
                },
                socks: {
                    header: 'SOCKS',
                    items: [],
                },
                scarf: {
                    header: 'SCARF',
                    items: [],
                },
                tie: {
                    header: 'TIE',
                    items: [],
                },
                muffler: {
                    header: 'MUFFLER',
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
                },
                dressshirt: {
                    header: 'DRESSSHIRT',
                    items: [],
                },
                suitpants: {
                    header: 'SUITPANTS',
                    items: [],
                },
                suitjacket: {
                    header: 'SUITJACKET',
                    items: [],
                },
                suitvest: {
                    header: 'SUITVEST',
                    items: [],
                },
                etc: {
                    header: 'ETC',
                    items: [],
                }
            });
            setItemStyle('D');
        }
    }, [gender]);

    useEffect(() => {
        console.log(styleRecommend.loaded);
        if (pageState === 'INIT' && styleRecommend.loaded) {
            setPageState('READY');
        }
        if (pageState === 'READY' || pageState === 'SAVE') {
            setPageState('CHANGE');
        }
        console.log('change: styleRecommend', styleRecommend)
    }, [styleRecommend]);

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
            styleData.colorType = item.colorName;
            styleData.patternType = item.patternName;
            styleData.colorName = item.colorName;
            styleData.patternName = item.patternName;
            styleData.brandId = item.brandId;
            styleData.productId = item.productId;
            styleData.productColorId = item.id;
            styleData.productType = item.productType;
            if (item.mainImageUrl) {
                let category = gender == 'F' ? dataContext.CATEGORY_MAP[styleData.category1] : dataContext.MALE_CATEGORY_MAP[styleData.category1];
                if (styleData.category2) {
                    if (styleData.category2 >= 21 && styleData.category2 <= 28) {
                        category = dataContext.CATEGORY_MAP[styleData.category2];
                    } else if(styleData.category2 >= 376 && styleData.category2 <= 384) {
                        category = dataContext.MALE_CATEGORY_MAP[styleData.category2];
                    }
                }
                if(styleData.category3) {
                    if(styleData.category3 === 455 || styleData.category3 === 456 || styleData.category3 === 457 || styleData.category3 === 458) {
                        category = dataContext.MALE_CATEGORY_MAP[styleData.category3];
                    }
                }
                const topLength = styleRecommend.items.filter(v => {
                    return v.category1 == 3 || v.category1 == 363
                }).length;
                const outerLength = styleRecommend.items.filter(v => {
                    return v.category1 == 1 || v.category1 == 361
                }).length;
                const topTrue = category.name == "TOP" && topLength == 0;
                const outerTrue = category.name == "OUTER" && outerLength == 0;
                const imageData = {
                    productColorId: item.id,
                    imageUrl: item.mainImageUrl,
                    categoryId: category.id,
                    categoryType: (category.id == 3 || category.id == 363) && topTrue ? "IN" : (category.id == 3 || category.id == 363) && !topTrue ? "OUT" : (category.id == 1 || category.id == 361) && outerTrue ? "IN" : (category.id == 3 || category.id == 363) && !outerTrue ? "OUT" : "",
                    imageOrder: styleRecommend.items.length + 1,
                    putOnImageUrl: item.putOnImageUrl
                }
                if(category.id == 455 || category.id == 456 || category.id == 457 || category.id == 458) {
                    newStyle[category.name.toLowerCase().replace(" ", "")].items.push(imageData);
                } else {
                    newStyle[category.name.toLowerCase()].items.push(imageData);
                }
                imageUrlItems.push(imageData)
            }
            styleItems.push(styleData);
        })

        let newImageItems = [];

        if(styleRecommend.imageUrlList.filter(v => {return v.categoryId == 27 || v.categoryId == 382}).length > 0) {
            if(imageUrlItems[0].categoryId != 22 && imageUrlItems[0].categoryId != 377) {
                newImageItems = [...styleRecommend.imageUrlList, ...imageUrlItems];
            } else {
                styleRecommend.imageUrlList.splice(1,0, imageUrlItems[0]);
                newImageItems = [...styleRecommend.imageUrlList];
            }
        } else if(styleRecommend.imageUrlList.filter(v => {return v.categoryId == 27 || v.categoryId == 382}).length == 0 && (imageUrlItems[0].categoryId == 22 || imageUrlItems[0].categoryId == 27 || imageUrlItems[0].categoryId == 377 || imageUrlItems[0].categoryId == 382)) {
            newImageItems = [...imageUrlItems, ...styleRecommend.imageUrlList];
        } else {
            newImageItems = [...styleRecommend.imageUrlList, ...imageUrlItems];
        }

        let newStyleItems = [...styleRecommend.items, ...styleItems];
        // categoryId 로 정렬
        //newItems = _.sortBy(newItems, 'category1').reverse();
        // 1) SHOES: 22  2) TOP:3   3) DRESS: 4   4) BOTTOM: 2  5) OUTER: 1   6) ACC: 5   7) BAG: 21 순으로 재정렬

        newStyleItems = _.sortBy(newStyleItems, (item) => {
            if (item.category2) {
                switch (item.category2) {
                    case 27:
                        return 0
                    case 382:
                        return 0
                    case 22:
                        return 1;
                    case 377:
                        return 1;
                    case 21:
                        return 7;
                    case 376:
                        return 7;
                }
            }
            switch (item.category1) {
                case 3:
                    return 2;
                case 363:
                    return 2;
                case 4:
                    return 3;
                case 364:
                    return 3;
                case 2:
                    return 4;
                case 362:
                    return 4;
                case 1:
                    return 5;
                case 361:
                    return 5;
                case 5:
                    return 6;
                case 365:
                    return 6;
            }
            return 9999;
        })

        const Arr = _.uniqBy(newImageItems, "imageUrl");
        setStyleRecommend(prevData => ({
            ...prevData,
            items: newStyleItems,
            imageUrlList: Arr,
            loaded: true
        }))
        setStyle(newStyle);
    }

    // 뒤로 돌아가기
    const handleBack = (e) => {
        e.preventDefault();
        if (pageState === 'READY' || pageState === 'CHANGE') {
            if (!window.confirm('스타일 수정이 되었습니다. 변경사항을 저장하지 않고 나가시겠습니까?')) {
                return;
            }
        }
        router.push(`/b2b-partner/style-recommendation?storeSearch=true`);
    }

    // 빈 스타일(착장) 데이터 생성
    const addStyleBlankHandler = (): void => {
        setDoubleClick(false);
        const addStyleItems = [defaultItem(styleRecommend.items.length + 1)];
        let newItems = [...styleRecommend.items, ...addStyleItems];
        setStyleRecommend(prevData => ({
            ...prevData,
            items: newItems,
            loaded: true
        }))
    }

    // 스타일(착장) 삭제
    const deleteStyleHandler = (deleteItem, deleteImageUrl): void => {
        let newItems = [...styleRecommend.items];
        const newImageUrlList = [...styleRecommend.imageUrlList];
        _.remove(newItems, function(item) {
            return item.key == deleteItem.key;
        });
        _.remove(newImageUrlList, function(item) {
            return item.productColorId == deleteImageUrl.productColorId;
        });
        if(newImageUrlList.length > 0) {
            if(newImageUrlList.filter(v => {
                return v.categoryId == 3 || v.categoryId == 363
            }).length > 0) {
                newImageUrlList.filter(v => {
                    return v.categoryId == 3 || v.categoryId == 363
                })[0].categoryType = 'IN'
            }
            if(newImageUrlList.filter(v => {
                return v.categoryId == 1 || v.categoryId == 361
            }).length > 0) {
                newImageUrlList.filter(v => {
                    return v.categoryId == 1 || v.categoryId == 361
                })[0].categoryType = 'IN'
            }
        }
        setStyleRecommend(prevData => ({
            ...prevData,
            items: newItems,
            imageUrlList: newImageUrlList,
            loaded: true
        }))
        let top = [];
        let outer = [];
        if(deleteImageUrl.categoryId == 1 || deleteImageUrl.categoryId == 361) {
            outer.push(newImageUrlList.filter(v => {
                return v.categoryId == 1 || v.categoryId == 361
            }))
        }
        if(deleteImageUrl.categoryId == 3 || deleteImageUrl.categoryId == 363) {
            top.push(newImageUrlList.filter(v => {
                return v.categoryId == 3 || v.categoryId == 363
            }))
        }
        if(gender == 'M' && deleteImageUrl && deleteImageUrl.categoryId == 361) {
            setStyle(prevData => ({
                ...prevData,
                [dataContext.MALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", "").toLowerCase()]: {
                    header: dataContext.MALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", ""),
                    items: [...outer[0]],
                },
            }))
        } else if(gender == 'F' && deleteImageUrl && deleteImageUrl.categoryId == 1) {
            setStyle(prevData => ({
                ...prevData,
                [dataContext.FEMALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", "").toLowerCase()]: {
                    header: dataContext.FEMALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", ""),
                    items: [...outer[0]],
                },
            }))
        } else if(gender == 'M' && deleteImageUrl && deleteImageUrl.categoryId == 363) {
            setStyle(prevData => ({
                ...prevData,
                [dataContext.MALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", "").toLowerCase()]: {
                    header: dataContext.MALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", ""),
                    items: [...top[0]],
                },
            }))
        } else if(gender == 'F' && deleteImageUrl && deleteImageUrl.categoryId == 3) {
            setStyle(prevData => ({
                ...prevData,
                [dataContext.FEMALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", "").toLowerCase()]: {
                    header: dataContext.FEMALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", ""),
                    items: [...top[0]],
                },
            }))
        } else if(gender == 'M' && deleteImageUrl) {
            setStyle(prevData => ({
                ...prevData,
                [dataContext.MALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", "").toLowerCase()]: {
                    header: dataContext.MALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", ""),
                    items: [],
                },
            }))
        } else if(gender == 'F' && deleteImageUrl) {
            setStyle(prevData => ({
                ...prevData,
                [dataContext.FEMALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", "").toLowerCase()]: {
                    header: dataContext.FEMALE_CATEGORY_MAP[deleteImageUrl.categoryId].name.replace(" ", ""),
                    items: [],
                },
            }))
        }
            }

    // 스타일(이미지) 삭제
    const deleteStyleImageHandler = (items, deleteItem, header): void => {
        const newImageUrlList = [...styleRecommend.imageUrlList];
        let newItems = [...styleRecommend.items];
        _.remove(newImageUrlList, function(item) {
            return item.productColorId == deleteItem.productColorId;
        });
        _.remove(newItems, function(item) {
            return item.productColorId == deleteItem.productColorId;
        });
        if(newImageUrlList.length > 0) {
            if(newImageUrlList.filter(v => {
                return v.categoryId == 3 || v.categoryId == 363
            }).length > 0) {
                newImageUrlList.filter(v => {
                    return v.categoryId == 3 || v.categoryId == 363
                })[0].categoryType = 'IN'
            }
            if(newImageUrlList.filter(v => {
                return v.categoryId == 1 || v.categoryId == 361
            }).length > 0) {
                newImageUrlList.filter(v => {
                    return v.categoryId == 1 || v.categoryId == 361
                })[0].categoryType = 'IN'
            }
        }
        setStyleRecommend(prevData => ({
            ...prevData,
            items: newItems,
            imageUrlList: newImageUrlList,
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

    const saveHandler = async (): Promise<void> => {
        console.log('saveHandler', styleRecommend);
        if(pageState == 'INIT' || pageState == 'READY') {
            toast.error('변경 사항이 없습니다.');
            return;
        }
        if (_.isEmpty(styleRecommend.items)) {
            toast.error('등록된 추천이 없습니다.');
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
        let checkDressShirts = false;
        let checkSuitPants = false;
        let checkSuitJacket = false;
        let checkSuitVest = false;
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
            if (category === 4 || category === 364) {
                if (checkOuter) {
                    checkFitOrderOuter = false;
                }
                checkDress = true;
            }
            if (category === 3 || category === 363) {
                if (checkOuter) {
                    checkFitOrderOuter = false;
                }
                checkTop = true;
            }
            if (category === 2 || category === 362) {
                if (checkOuter) {
                    checkFitOrderOuter = false;
                }
                checkBottom = true;
            }
            if (category === 1 || category === 361) {
                // 아웃터 체크. TOP, DRESS, BOTTOM 보다 후순위로 나와야함.
                checkOuter = true;
            }
            if (Number(item.category3) === 455) {
                checkDressShirts = true;
            }
            if (Number(item.category3) === 457) {
                checkSuitPants = true;
            }
            if (Number(item.category3) === 456) {
                checkSuitJacket = true;
            }
            if (Number(item.category3) === 458) {
                checkSuitVest = true;
            }
            if (Number(item.category2) === 22 || Number(item.category2) === 377) {
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
        if(!checkTop && !checkBottom) {
            if(!checkDress) {
                toast.error(`DRESS 카테고리를 추가해주세요.`);
                return;
            }
        }
        if(itemStyle === 'S') {
            if (!checkDressShirts) {
                toast.error(`DRESS SHIRT 카테고리를 추가해주세요.`);
                return;
            }
            if (!checkSuitPants) {
                toast.error(`SUIT PANTS 카테고리를 추가해주세요.`);
                return;
            }
            if (!checkSuitJacket) {
                toast.error(`SUIT JACKET 카테고리를 추가해주세요.`);
                return;
            }
            if (!checkSuitVest) {
                toast.error(`SUIT VEST 카테고리를 추가해주세요.`);
                return;
            }
        }
        if (!checkFitOrderOuter) {
            toast.error(`OUTER 카테고리의 착장순서를 확인해주세요. TOP/BOTTOM/DRESS 보다 후순위여야 합니다.`);
            return;
        }
        if (window.confirm('저장하시겠습니까?')) {
            const saveData = {...styleRecommend};
            // 데이터 소트 적용(시즌, 취향)
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
                result = await b2bStyleRecommendApi.putStyleRecommend(saveData).catch((res) => {
                    if (res == 'Error: Request failed with status code 400') toast.error('이미 등록된 스타일입니다')})
            } else {
                result = await b2bStyleRecommendApi.postStyleRecommend(saveData).catch((res) => {
                    if (res == 'Error: Request failed with status code 400') toast.error('이미 등록된 스타일입니다')
                });
            }
            if (result) {
                toast.success('스타일 추천이 저장 되었습니다.');
                setPageState('SAVE');
                setDoubleClick(true);
            }
        }
    }

    const handleOpenSave = () => {
        saveHandler();
        setStyleRecommend({...styleRecommend, gender: gender});
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
                <Container maxWidth="xl">
                    <Box sx={{mb: 2}}>
                        <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                            <IconButton
                                edge="end"
                                onClick={handleBack}
                            >
                                <ArrowBackIcon
                                    fontSize="small"
                                    sx={{mr: 1}}
                                />
                                <Typography variant="h5">
                                    스타일 세트 리스트
                                </Typography>
                            </IconButton>
                        </Grid>
                    </Box>
                    <Box>
                        <Grid sx={{mb: 1, display: 'flex', justifyContent: "flex-end"}}>
                            <Button variant="contained"
                                    disabled={isDoubleClick}
                                    startIcon={<SaveIcon />}
                                    onClick={handleOpenSave}
                            >
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
                                lg={8}
                            >
                                <Card>
                                    <CardContent>
                                        <StyleItemChoice
                                            style={style}
                                            brand={brand}
                                            setBrand={setBrand}
                                            itemStyle={itemStyle}
                                            setItemStyle={setItemStyle}
                                            gender={gender}
                                            setGender={setGender}
                                            addStyleItem={addStyleItemHandle}
                                            deleteStyleImage={deleteStyleImageHandler}
                                            styleRecommend={styleRecommend}
                                            setStyleRecommend={setStyleRecommend}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                lg={4}
                            >
                                <Divider/>
                                <Card>
                                    <CardContent>
                                        <StyleProcedure
                                            brand={brand}
                                            gender={gender}
                                            addStyleBlank={addStyleBlankHandler}
                                            deleteStyle={deleteStyleHandler}
                                            reOrderItems={reOrderItems}
                                            data={styleRecommend}
                                            items={(styleRecommend && styleRecommend.items) ? styleRecommend.items : []}
                                            imageUrl={(styleRecommend && styleRecommend.imageUrlList) ? styleRecommend.imageUrlList : []}
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

// image-mask
const Mask = styled.img`
    mask-image: ${(p) => `url("${p.mask}")`};
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    -webkit-mask-image:  ${(p) => `url("${p.mask}")`};
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    `

B2bStyleRecommend.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default B2bStyleRecommend;