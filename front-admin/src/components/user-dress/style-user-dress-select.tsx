import React from "react";
import {Box, Typography} from "@mui/material";

const StyleUserDressSelect = (props) => {
  const {lists, clickApply} = props;

  const renderUserDress = () => {
    return lists.map(item => {
      return (
          <div key={item.id}
style={{marginRight: 8}}>
            <Typography variant={'subtitle2'}>{item.id} ,</Typography>
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
          {renderUserDress()}
        </Box>
      </Box>
  )
};

export default StyleUserDressSelect;