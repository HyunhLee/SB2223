import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import {Scrollbar} from "../scrollbar";
import {DataContext} from "../../contexts/data-context";
import {ImageInListWidget} from "../widgets/image-widget";
import {SearchStyle, StyleModel} from "../../types/marketing-model/marketing-style-model";
import moment from "moment/moment";
import {endPointConfig} from "../../config";

interface ListProps {
    lists: StyleModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    search: SearchStyle;
    setSearch: (e) => void;
    setRequestList: (e) => void;
}

export const StyleDetailList: FC<ListProps> = (props) => {

    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        search,
        setSearch,
        setRequestList,
        ...other
    } = props;

    const dataContext = useContext(DataContext);
    const url = `${endPointConfig.styleBotBtbStyleImage}`;

    const renderBrand = (brandId) => {
        return (dataContext.MALL_BRAND.find((item) => item.id === brandId)) ? dataContext.MALL_BRAND.find((item) => item.id === brandId).nameKo : '';
    }

    const renderCategory = (categoryId) => {
        return (dataContext.CATEGORY_GROUP.find((item) => item.groupId === categoryId)) ? dataContext.CATEGORY_GROUP.find((item) => item.groupId === categoryId).groupName : '';
    }

    const changeSort = (e) => {
        setSearch({...search, sort: e});
        setRequestList(true);
    }

    const textArea = (content) => {
        if (content.length > 40) {
            return content.substr(0, 35) + '...';
        }else{
            return content
        }
    }

    const renderItemImage = (items) => {
        const data = items.sort((a, b) => b.count - a.count);
        if (data) {
            return data.map((item,idx) => {
                if(data.length - 1 == idx){
                    return (
                      <Stack key={item.id}
sx={{alignItems: 'center', justifyContent: 'center', display: 'flex', padding: 2}}>
                          {
                              item.thumbnailImageUrl
                                ? (
                                  <ImageInListWidget
                                    imageName={item.thumbnailImageUrl}
                                    imageUrl={item.thumbnailImageUrl}
                                    height={35}
                                    width={35}
                                  />
                                )
                                : (
                                  <Box
                                    sx={{
                                        alignItems: 'center',
                                        backgroundColor: 'background.default',
                                        borderRadius: 1,
                                        display: 'flex',
                                        height: 80,
                                        justifyContent: 'center',
                                        width: 80
                                    }}
                                  >
                                  </Box>
                                )
                          }
                      </Stack>
                    )
                } else {
                    return (
                      <Stack key={item.id}
sx={{alignItems: 'center', borderBottom: '1px solid #efefef', display: 'flex', justifyContent: 'center', padding: 2}}>
                          {
                              item.thumbnailImageUrl
                                ? (
                                  <ImageInListWidget
                                    imageName={item.thumbnailImageUrl}
                                    imageUrl={item.thumbnailImageUrl}
                                    height={35}
                                    width={35}
                                  />
                                )
                                : (
                                  <Box
                                    sx={{
                                        alignItems: 'center',
                                        backgroundColor: 'background.default',
                                        borderRadius: 1,
                                        display: 'flex',
                                        height: 80,
                                        justifyContent: 'center',
                                        width: 80
                                    }}
                                  >
                                  </Box>
                                )
                          }
                      </Stack>
                    )
                }

            });
        }
    }

    const checkProductId = (id, brandName) => {
        if(brandName === 'femaleDefault'|| brandName === 'maleDefault'){
            return ''
        }else{
            return id
        }
    }

    const renderItem = (items, info) => {
        const data = items.sort((a, b) => b.count - a.count);
        if (data) {
            if (info == 'id') {
                return data.map((item, idx) => {
                    if(data.length -1 == idx){
                        return (
                          <Stack key={item.id} sx={{paddingTop:3, paddingBottom: 1, alignItems: 'center',display: 'flex', justifyContent: 'center',}}>
                          <Stack sx={{height: 35}}>
                              {checkProductId(item.id, item.brandNameKo)}
                          </Stack>
                          </Stack>
                        )
                    }else{
                        return (
                          <Stack key={item.id} sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack sx={{height: 35}}>
                              {checkProductId(item.id, item.brandNameKo)}
                          </Stack>
                          </Stack>
                        )
                    }

                });
            } else if (info == 'productNo') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, alignItems: 'center',display: 'flex', justifyContent: 'center',}}>
                          <Stack sx={{height: 35}}>
                              {item.productNo}
                          </Stack>
                          </Stack>
                        )
                    }else{
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack sx={{height: 35}}>
                              {item.productNo}
                          </Stack>
                          </Stack>
                        )
                    }

                });
            }else if (info == 'name') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', justifyContent: 'center',}}>
                          <Stack sx={{height: 35, paddingLeft: 2}}>
                              {textArea(item.nameKo)}
                          </Stack >
                          </Stack>
                        )
                    }else{
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack sx={{height:35, paddingLeft: 2}}>
                              {textArea(item.nameKo)}
                          </Stack>
                              </Stack>
                        )
                    }

                });
            }else if (info == 'category') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                          <Stack sx={{height: 35}}>
                              {renderCategory(item.closetCategoryId)}
                          </Stack>
                          </Stack>
                        )
                    }else{
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack sx={{height: 35}}>
                              {renderCategory(item.closetCategoryId)}
                          </Stack>
                              </Stack>
                        )
                    }

                });
            } else if (info == 'brand') {
                return data.map((item,idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                          <Stack sx={{height: 35}}>
                              {/*{renderBrand(item.brandId)}*/}
                              {item.brandNameKo == 'femaleDefault' || item.brandNameKo == 'maleDefault' ? '기본 아이템' : item.brandNameKo}
                          </Stack>
                          </Stack>
                        )
                    }else{
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack sx={{height: 35}}>
                              {/*{renderBrand(item.brandId)}*/}
                              {item.brandNameKo == 'femaleDefault' || item.brandNameKo == 'maleDefault' ? '기본 아이템' : item.brandNameKo}
                          </Stack>
                          </Stack>
                        )
                    }

                });
            } else if (info == 'count') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                          <Stack sx={{height:35}}>
                              {item.count}
                          </Stack>
                          </Stack>
                        )
                    }else{
                        return (
                          <Stack key={item.id}
sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack sx={{height:35}}>
                              {item.count}
                          </Stack>
                          </Stack>
                        )
                    }

                });
            }
        }
    }





    return (
        <div {...other}>
            <Box>
                <Stack direction='row'
justifyContent='space-between'>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="h6">총 {count} 건</Typography>
                    </Grid>
                    <Select
                        size={"small"}
                        sx={{m: 1, width: 150}}
                        value={search.sort}
                        onChange={e => {
                            changeSort(e.target.value)
                        }}
                    >
                        <MenuItem value={'desc'}>최신순</MenuItem>
                        <MenuItem value={'id'}>오래된순</MenuItem>
                    </Select>
                </Stack>
            </Box>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
                showFirstButton
                showLastButton
            />
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'center'}>
                                이미지
                            </TableCell>
                            <TableCell align={'center'}>
                                스타일ID
                            </TableCell>
                            <TableCell sx={{maxWidth: 60}}
align={'center'}>
                                상품이미지
                            </TableCell>
                            <TableCell align={'center'}>
                                상품ID
                            </TableCell>
                            <TableCell align={'center'}>
                                상품번호
                            </TableCell>
                            <TableCell align={'center'}>
                                상품명
                            </TableCell>
                            <TableCell align={'center'}>
                                카테고리
                            </TableCell>
                            <TableCell align={'center'}>
                                브랜드
                            </TableCell>
                            <TableCell align={'center'}>
                                저장횟수
                            </TableCell>
                            <TableCell align={'center'}>
                                유저ID
                            </TableCell>
                            <TableCell align={'center'}>
                                등록일
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists && lists.length > 0 ? lists.map((item) => {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell align={'center'}
sx={{borderBottom: '1px solid #efefef'}}>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {
                                                    item.styleAvatarImageUrl
                                                        ? (
                                                            <ImageInListWidget
                                                                imageName={`${url}${item.styleAvatarImageUrl}`}
                                                                imageUrl={`${url}${item.styleAvatarImageUrl}`}/>
                                                        )
                                                        : (
                                                            <Box
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    backgroundColor: 'background.default',
                                                                    borderRadius: 1,
                                                                    display: 'flex',
                                                                    height: 80,
                                                                    justifyContent: 'center',
                                                                    width: 80
                                                                }}
                                                            >
                                                            </Box>
                                                        )
                                                }
                                            </Box>
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef', borderLeft: '1px solid #efefef', borderBottom: '1px solid #efefef'}}>
                                            {item.id}
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef',  justifyContent: 'center'}}>
                                                {renderItemImage(item.products)}
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'id')}
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'productNo')}
                                        </TableCell>
                                        <TableCell sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'name')}
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'category')}
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                           {renderItem(item.products, 'brand')}
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'count')}
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{borderRight: '1px solid #efefef', borderBottom: '1px solid #efefef'}}>
                                            {item.userLogin}
                                        </TableCell>
                                        <TableCell align={'center'}
sx={{borderRight: '1px solid #efefef', borderBottom: '1px solid #efefef'}}>
                                            {moment(item.createdDate).format('YYYY-MM-DD')}
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        })
                            :
                            <Fragment>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align={'center'}>
                                        현재 해당하는 자료가 없습니다.
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </Fragment>
                        }
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
                showFirstButton
                showLastButton
            />
        </div>
    );
};

StyleDetailList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};