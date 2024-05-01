import {Box, IconButton, ImageList, ImageListItem, Typography} from "@mui/material";
import React from "react";
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import {X as XIcon} from "../../../icons/x";
import _ from "lodash";
import {ImageInFormWidget} from "../../widgets/image-widget";
import toast from "react-hot-toast";

const StyleImageBox = (props) => {

  const {gender, header, index, category, deleteStyleImage, productHandler} = props;

  const [image, setImage] = React.useState<string>(null);

  const handleClick = () => {
    if(header == 'TOP(OUT)' && category.items.length == 0) {
      return toast.error('TOP(IN)을 먼저 선택해 주세요.')
    }
    if(header == 'OUTER(OUT)' && category.items.length == 0) {
      return toast.error('OUTER(IN)을 먼저 선택해 주세요.')
    }
    if(gender == 'M') {
      switch (category.header) {
        case 'OUTER':
          productHandler('361', header);
          break
        case 'BOTTOM':
          productHandler('362', header);
          break
        case 'TOP':
          productHandler('363', header);
          break
        case 'ACC':
          productHandler('365', header);
          break
        case 'BAG':
          productHandler('376', header);
          break
        case 'SHOES':
          productHandler('377', header);
          break
        case 'HAT':
          productHandler('378', header);
          break
        case 'GLASSES':
          productHandler('379', header);
          break
        case 'SCARF':
          productHandler('380', header);
          break
        case 'MUFFLER':
          productHandler('381', header);
          break
        case 'SOCKS':
          productHandler('382', header);
          break
        case 'TIE':
          productHandler('383', header);
          break
        case 'ETC':
          productHandler('384', header);
          break
        case 'DRESSSHIRT':
          productHandler('455', header);
          break
        case 'SUITJACKET':
          productHandler('456', header);
          break
        case 'SUITPANTS':
          productHandler('457', header);
          break
        case 'SUITVEST':
          productHandler('458', header);
          break
      }
    } else {
      switch (category.header) {
        case 'OUTER':
          productHandler('1', header);
          break
        case 'BOTTOM':
          productHandler('2', header);
          break
        case 'TOP':
          productHandler('3', header);
          break
        case 'DRESS':
          productHandler('4', header);
          break
        case 'ACC':
          productHandler('5', header);
          break
        case 'BAG':
          productHandler('21', header);
          break
        case 'SHOES':
          productHandler('22', header);
          break
        case 'HAT':
          productHandler('23', header);
          break
        case 'GLASSES':
          productHandler('24', header);
          break
        case 'SCARF':
          productHandler('25', header);
          break
        case 'MUFFLER':
          productHandler('26', header);
          break
        case 'SOCKS':
          productHandler('27', header);
          break
      }
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
          {header}
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
        {header == 'TOP(OUT)' && category.items.length == 2 ?
            <>
              <ImageListItem key={1}
                             sx={{pt: 1, pr: 1, pl: 1}}>
                <ImageInFormWidget imageUrl={category.items[1].imageUrl} />
                <div style={{position: 'absolute', right: 15, top: 10}}>
                  <IconButton
                      edge="end"
                      color={'error'}
                      onClick={() => onDelete(category.items[1])}
                  >
                    <XIcon fontSize="small"/>
                  </IconButton>
                </div>
              </ImageListItem>
              <Box sx={{backgroundColor: 'lightgrey'}}>
                <Typography display={'flex'}
                            justifyContent={'center'}>
                  {category.items[1].brandName}
                </Typography>
              </Box>
            </>
            :
            header == 'TOP(IN)' && category.items.length > 0 ?
                <>
                  <ImageListItem key={1}
                                 sx={{pt: 1, pr: 1, pl: 1}}>
                    <ImageInFormWidget imageUrl={category.items[0].imageUrl} />
                    <div style={{position: 'absolute', right: 15, top: 10}}>
                      <IconButton
                          edge="end"
                          color={'error'}
                          onClick={() => onDelete(category.items[0])}
                      >
                        <XIcon fontSize="small"/>
                      </IconButton>
                    </div>
                  </ImageListItem>
                  <Box sx={{backgroundColor: 'lightgrey'}}>
                    <Typography sx={{backgroundColor: 'rgba(162,162,162,0)'}}
  display={'flex'}
                                justifyContent={'center'}>
                      {category.items[0].brandName}
                    </Typography>
                  </Box>
                </>
                :
                header == 'OUTER(OUT)' && category.items.length == 2 ?
                    <>
                      <ImageListItem key={1}
                                     sx={{pt: 1, pr: 1, pl: 1}}>
                        <ImageInFormWidget imageUrl={category.items[1].imageUrl} />
                        <div style={{position: 'absolute', right: 15, top: 10}}>
                          <IconButton
                              edge="end"
                              color={'error'}
                              onClick={() => onDelete(category.items[1])}
                          >
                            <XIcon fontSize="small"/>
                          </IconButton>
                        </div>
                      </ImageListItem>
                      <Box sx={{backgroundColor: 'lightgrey'}}>
                        <Typography sx={{backgroundColor: 'rgba(162,162,162,0)'}}
  display={'flex'}
                                    justifyContent={'center'}>
                          {category.items[1].brandName}
                        </Typography>
                      </Box>
                    </>
                    :
                    header == 'OUTER(IN)' && category.items.length > 0 ?
                        <>
                          <ImageListItem key={1}
                                         sx={{pt: 1, pr: 1, pl: 1}}>
                            <ImageInFormWidget imageUrl={category.items[0].imageUrl} />
                            <div style={{position: 'absolute', right: 15, top: 10}}>
                              <IconButton
                                  edge="end"
                                  color={'error'}
                                  onClick={() => onDelete(category.items[0])}
                              >
                                <XIcon fontSize="small"/>
                              </IconButton>
                            </div>
                          </ImageListItem>
                          <Box sx={{backgroundColor: 'lightgrey'}}>
                            <Typography sx={{backgroundColor: 'rgba(162,162,162,0)'}}
  display={'flex'}
                                        justifyContent={'center'}>
                              {category.items[0].brandName}
                            </Typography>
                          </Box>
                        </>
          :
                    category.items.length > 0 && header != "TOP(OUT)" && header != "OUTER(OUT)" ?
                      <>
                        <ImageListItem key={index}
              sx={{pt: 1, pr: 1, pl: 1}}>
                          <ImageInFormWidget imageUrl={category.items[0].imageUrl} />
                          <div style={{position: 'absolute', right: 15, top: 10}}>
                            <IconButton
                              edge="end"
                              color={'error'}
                              onClick={() => onDelete(category.items[0])}
                            >
                              <XIcon fontSize="small"/>
                            </IconButton>
                          </div>
                        </ImageListItem>
                        <Box sx={{backgroundColor: 'lightgrey'}}>
                          <Typography sx={{backgroundColor: 'rgba(162,162,162,0)'}}
  display={'flex'}
              justifyContent={'center'}>
                            {category.items[0].brandName}
                          </Typography>
                        </Box>
                      </>
                        : ''
        }
      </ImageList>
    </Box>
  )
}

export default StyleImageBox;