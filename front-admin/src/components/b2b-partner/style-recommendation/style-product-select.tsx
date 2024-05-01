import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import {ImageInListWidget} from "../../widgets/image-widget";

const StyleProductSelect = (props) => {
  const {lists, clickApply} = props;

  const renderProduct = () => {
    return lists.map((item, index) => {
      return (
        <div key={item.id}
style={{marginRight: 8}}>
          <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                border: 1,
                borderRadius: 1
              }}
          >
            <Stack direction={'column'}>
                <Typography>{index+1}</Typography>
              <Box sx={{ml: 1}}>
                {
                  item.mainImageUrl
                      ? (
                          <ImageInListWidget
                              imageName={item.mainImageUrl}
                              imageUrl={item.mainImageUrl} />
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
              <Typography variant={'subtitle2'}>{`상품 ID: ${item.id}`}</Typography>
            </Stack>
          </Box>
        </div>
      )
    })
  }

  const handleClick = () => {
    clickApply(lists);
  }

  return (
    <Box sx={{p: 1, width: '100%'}}>
      <Box sx={{
        alignItems: 'start',
        display: 'flex',
        justifyContent: 'start',
      }}>
        {renderProduct()}
      </Box>
    </Box>
  )
};

export default StyleProductSelect;