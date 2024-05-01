import React from 'react';
import {Badge, Box, Grid} from '@mui/material';
import {HandsomeFitKanbanCard} from "./handsome-fit-kanban-card";

export const HandsomeFitKanbanColumn = (props) => {
  const {name, target, items, readonly=false, setRequest} = props;
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          mx: 2,
          overflowX: 'hidden',
          overflowY: 'hidden',
          width: {
            xs: 300,
            sm: 380
          }
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            pr: 2,
            py: 1
          }}
        >
          {name}
          <Badge color="primary"
overlap="circular"
badgeContent={items.length}>
          </Badge>
        </Box>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.800'
              : 'neutral.200',
            borderRadius: 1,
          }}
        >
          <Grid container
spacing={1.5}
justifyContent={'start'}
sx={{p: 2}}>
            {items.map((item) => {
              return (
                <HandsomeFitKanbanCard key={item.id}
item={item}
target={target}
readonly={readonly} setRequest={setRequest}
                />
              )
            })}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};