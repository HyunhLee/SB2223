import {Box, IconButton, ImageList, ImageListItem, Typography} from "@mui/material";
import React from "react";
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import {X as XIcon} from "../../icons/x";
import _ from "lodash";
import {ImageInFormWidget} from "../widgets/image-widget";

const StyleImageBox = (props) => {

  const {category, deleteStyleImage, productHandler} = props;

  const [image, setImage] = React.useState<string>(null);

  const handleClick = () => {
    switch (category.header) {
      case 'OUTER':
        productHandler('1');
        break
      case 'BOTTOM':
        productHandler('2');
        break
      case 'TOP':
        productHandler('3');
        break
      case 'DRESS':
        productHandler('4');
        break
      case 'ACC':
        productHandler('5');
        break
      case 'BAG':
        productHandler('21');
        break
      case 'SHOES':
        productHandler('22');
        break
    }
  };

  const handleImageClick = (item) => {
    setImage(item.imageUrl);
  }

  const onDelete = (deleteItem): void => {
    const items = [...category.items];
    _.remove(items, function(item) {
      return item === deleteItem;
    });
    deleteStyleImage(items, deleteItem, category.header);
  }

  return (
    <Box
      sx={{ border: 1, borderRadius: 1 }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#383838',
          pr: 0.6,
          pl: 2,
          borderRadius: 0.5
        }}
      >
        <Typography sx={{color: '#ffffff'}}>
          {category.header}
        </Typography>
        <IconButton aria-label="add"
sx={{color: '#ffffff'}}
onClick={handleClick} >
          <AddBoxRoundedIcon />
        </IconButton>
      </Box>
      <ImageList sx={{m: 0, mb: 1}}
cols={1}
variant="quilted"
rowHeight={164}>
        {category.items.map((item, index) => (
          <ImageListItem key={index}
sx={{pt: 1, pr: 1, pl: 1}}>
            <ImageInFormWidget imageUrl={item.imageUrl} />
            <div style={{position: 'absolute', right: 15, top: 10}}>
              <IconButton
                edge="end"
                color={'error'}
                onClick={() => onDelete(item)}
              >
                <XIcon fontSize="small"/>
              </IconButton>
            </div>

          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  )
}

export default StyleImageBox;