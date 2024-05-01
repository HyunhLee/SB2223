import React, {useEffect, useRef, useState} from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import TreeMenu from "react-simple-tree-menu";
import 'react-simple-tree-menu/dist/main.css';
import toast from "react-hot-toast";

export const CategoryDialog = (props) => {
  const {
    category,
    imageUrl,
    onClose,
    selectedLastDepth = false,
    parent = 'NONE',
    value: valueProp,
    open,
    ...other
  } = props;
  const [value, setValue] = React.useState(valueProp);
  const treeMenuRef = useRef<TreeMenu>();

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
    if (treeMenuRef && treeMenuRef.current) {
      treeMenuRef.current.resetOpenNodes([], '', '');
    }
  }, [valueProp, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleApply = (item) => {
    if (parent === 'STYLE') {
      if (item.level <= 1 && item.label !=='BUSTIER' && item.label !== 'GLOVES') {
        toast.error('2단계 이하는 선택할 수 없습니다.');
        return;
      }
      const categories = item.ids.split('/');
      const category1 = categories[0];
      const category2 = categories[1];
      if (category1 === '2' && category2 === '14') {
        if (item.children && item.children.length > 0) {
          toast.error('스커트는 마지막 단계까지 선택해주세요.');
          return;
        }
      } else {
        if (item.level > 2) {
          toast.error('3단계에서만 선택해주세요.');
          return;
        }
      }
    }
    if(parent === 'UPLOAD') {
      if (item.label !=='OUTER' && item.label !== 'DRESS' && item.label !== 'VEST' && item.label !== 'TOP' && item.label !== 'PANTS' && item.label !== 'SKIRT') {
        toast.error('지정된 카테고리 이외에는 선택할 수 없습니다.');
        return;
      }
    }
    onClose(item);
  };

  return (
      <Dialog
          /*PaperProps={{
            sx: {
              position: 'absolute',
              right: 300,
              top: 150
            }
          }}*/
          sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: '100%'}}}
          maxWidth="md"
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
          {...other}
      >
        <DialogTitle>Category</DialogTitle>
        <DialogContent dividers>
          <Box sx={{display: 'flex', direction: 'row'}}>
            <Box>
              {
                imageUrl != null ?
                    <img
                        src={imageUrl}
                        style={{objectFit: 'contain'}}
                        width={500}
                        loading="lazy"
                    /> : <></>
              }
            </Box>
            <Box sx={{width: '100%'}}>
              <TreeMenu
                  ref={treeMenuRef}
                  data={category}
                  onClickItem={(item) => handleApply(item)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus
                  onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export const PatternDialog = (props) => {
  const {items, imageUrl, multiple = false, onClose, value: valueProp, open, ...other} = props;
  // 패턴데이터 멀티선택이 필요하여 클론함.
  const [cloneItems, setCloneItems] = React.useState([]);
  const [value, setValue] = React.useState(valueProp);
  const [changed, setChanged] = React.useState(false);

  React.useEffect(() => {
    if (open && multiple) {
      const colors = [];
      items.forEach(item => {
        colors.push(Object.assign(item, {selected: false}));
      })
      setCloneItems(colors);
    }
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleSelectedItem = (item) => {
    if (!multiple) {
      onClose(item);
    }
    if (item.selected !== undefined && item.selected === true) {
      item.selected = false;
    } else {
      item.selected = true;
    }
    setChanged(!changed);
  };

  const handleOk = (value) => {
    if (multiple) {
      const selectedItems = cloneItems.filter(item => {
        if (item.selected !== undefined && item.selected === true) {
          return item;
        }
      })
      value = selectedItems;
    }
    onClose(value);
  };

  const getBorder = (item) => {
    if (item.selected !== undefined && item.selected === true) {
      return '2px solid red';
    }
    return '';
  }

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 800}}}
          maxWidth="lg"
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
          {...other}
      >
        <DialogTitle>Pattern</DialogTitle>
        <DialogContent dividers>
          <Box sx={{display: 'flex', direction: 'row'}}>
            <Box>
              {
                imageUrl != null ?
                    <img
                        src={imageUrl}
                        style={{objectFit: 'contain'}}
                        width={500}
                        loading="lazy"
                    /> : <></>
              }
            </Box>
            <Box sx={{width: '100%'}}>
              <Grid container
                    spacing={0.5}>
                {multiple ? cloneItems.map((item) => (
                    <Grid
                        item
                        key={item.id}
                        xs={2}
                    >
                      <Box sx={{textAlign: 'center'}}>
                        <img
                            src={`/static/pattern/${item.name}.png`}
                            style={{
                              cursor: 'pointer',
                              border: getBorder(item)
                            }}
                            onClick={() => handleSelectedItem(item)}
                        />
                        <Typography variant={'subtitle2'}
                                    component="div"
                                    sx={{lineHeight: 1}}>{item.name}</Typography>
                      </Box>
                    </Grid>
                )) : items.map((item) => (
                    <Grid
                        item
                        key={item.id}
                        xs={2}
                    >
                      <Box sx={{textAlign: 'center'}}>
                        <img
                            src={`/static/pattern/${item.name}.png`}
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => handleSelectedItem(item)}
                        />
                        <Typography variant={'subtitle2'}
                                    component="div"
                                    sx={{lineHeight: 1}}>{item.name}</Typography>
                      </Box>
                    </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {
            multiple ?
                <Button variant={'contained'}
                        onClick={handleOk}>
                  Apply
                </Button> : <></>
          }
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export const ColorDialog = (props) => {
  const {items, imageUrl, multiple = false, onClose, value: valueProp, open, ...other} = props;
  const [value, setValue] = React.useState(valueProp);
  // 컬러데이터 멀티선택이 필요하여 클론함.
  const [cloneItems, setCloneItems] = React.useState([]);
  const [changed, setChanged] = React.useState(false);

  React.useEffect(() => {
    if (open && multiple) {
      const patterns = [];
      items.forEach(item => {
        patterns.push(Object.assign(item, {selected: false}));
      })
      setCloneItems(patterns);
    }
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleSelectedItem = (item) => {
    if (!multiple) {
      onClose(item);
    }
    if (item.selected !== undefined && item.selected === true) {
      item.selected = false;
    } else {
      item.selected = true;
    }
    setChanged(!changed);
  };

  const handleOk = (value) => {
    if (multiple) {
      const selectedItems = cloneItems.filter(item => {
        if (item.selected !== undefined && item.selected === true) {
          return item;
        }
      })
      value = selectedItems;
    }
    onClose(value);
  };

  const getBackgroundColor = (item) => {
    return item.rgb
  }

  const getColor = (item) => {
    if (item.name === 'BLACK' || item.name === 'BLUE' || item.name === 'NAVY' || item.name === 'BROWN' || item.name === 'WINE') {
      return 'rgb(255, 255, 255)'
    }
    return 'rgb(0, 0, 0)'
  }

  const getBorder = (item) => {
    if (item.selected !== undefined && item.selected === true) {
      return '2px solid red';
    }
    return '';
  }

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {width: '100%', maxHeight: 700}}}
          maxWidth="md"
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
          {...other}
      >
        <DialogTitle>Color</DialogTitle>
        <DialogContent dividers>
          <Box sx={{display: 'flex', direction: 'row'}}>
            <Box>
              {
                imageUrl != null ?
                    <img
                        src={imageUrl}
                        style={{objectFit: 'contain'}}
                        width={500}
                        loading="lazy"
                    /> : <></>
              }
            </Box>
            <Box sx={{width: '100%'}}>
              <Grid container
                    spacing={1}>
                {multiple ? cloneItems.map((item) => (
                    <Grid
                        item
                        key={item.id}
                        xs={4}
                    >
                      <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            display: 'flex', color: getColor(item),
                            '&.MuiButtonBase-root:hover': {
                              backgroundColor: getBackgroundColor(item)
                            }
                          }}
                          style={{
                            background: getBackgroundColor(item),
                            border: getBorder(item),
                          }}
                          onClick={() => handleSelectedItem(item)}
                      >
                        {item.name}
                      </Button>
                    </Grid>
                )) : items.map((item) => (
                    <Grid
                        item
                        key={item.id}
                        xs={4}
                    >
                      <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            display: 'flex', color: getColor(item),
                            '&.MuiButtonBase-root:hover': {
                              backgroundColor: getBackgroundColor(item)
                            }
                          }}
                          style={{
                            background: getBackgroundColor(item),
                          }}
                          onClick={() => handleSelectedItem(item)}
                      >
                        {item.name}
                      </Button>
                    </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {
            multiple ?
                <Button variant={'contained'}
                        onClick={handleOk}>
                  Apply
                </Button> : <></>
          }
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export const JennieFitDialog = (props) => {
  const {items, category, onClose, value: valueProp, open, ...other} = props;
  const [value, setValue] = React.useState(valueProp);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = (value) => {
    onClose(value);
  };

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {maxWidth: 550, maxHeight: 700}}}
          maxWidth="xs"
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
          {...other}
      >
        <DialogTitle>Jennie Fit</DialogTitle>
        <DialogContent dividers>
          <Grid container
                spacing={1}>
            {items.filter(item => {
              // if (category != null && category[0].trim() != 'ACC') {
              if (category != null) {
                // return item.name.includes(category[0].trim());
                if(category.length > 1 && category[0].trim() != 'ACC') {
                  return item.name.includes(`${category[0].trim()}_${category[1].trim()}`);
                } else {
                  return item.name.includes(category[0].trim());
                }
              }
              return true;
            }).map((item) => (
                <Grid
                    item
                    key={item.id}
                    xs={6}
                >
                  <Button
                      variant="contained"
                      size="small"
                      sx={{display: 'flex'}}
                      onClick={() => handleOk(item)}
                  >
                    {item.name}
                  </Button>
                </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus
                  onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export const JennieFitAiDialog = (props) => {
  const {thirdItems, items, fourthItems, category, onClose, value: valueProp, open, ...other} = props;
  const [value, setValue] = React.useState(valueProp);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [jennieFitCategoryThird, setJennieFitCategoryThird] = React.useState('');
  const [jennieFitCategoryFourth, setJennieFitCategoryFourth] = React.useState('');


  const [thirdDepth, setThirdDepth] = React.useState([]);
  const [fourthDepth, setFourDepth] = React.useState([]);


  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    } else {
      const thirdSet = new Set(thirdItems);
      setThirdDepth([...thirdSet]);

      const fourthSet = new Set(fourthItems);
      setFourDepth([...fourthSet]);
    }
  }, [valueProp, open]);

  useEffect(() => {
    if(category) {
      if (category.length == 1) {
        if(category[0].trim() === 'OUTER' || category[0].trim() === 'BOTTOM' || category[0].trim() === 'TOP' || category[0].trim() === 'ACC') {
          setImageUrl('')
        }
      } else if(category.length > 1) {
        if (category[0].trim() === 'DRESS') {
          setImageUrl("/static/automatic-guide-images/DRESS.png");
        } else if (category[1].trim() === 'PANTS') {
          setImageUrl("/static/automatic-guide-images/PANTS.png");
        } else if (category[1].trim() === 'SKIRT') {
          setImageUrl("/static/automatic-guide-images/SKIRT.png");
        } else if (category[1].trim() === 'BLOUSE') {
          setImageUrl("/static/automatic-guide-images/TOP_BLOUSE.png");
        } else if (category[1].trim() === 'BUSTIER') {
          setImageUrl("/static/automatic-guide-images/TOP_BUSTIER.png");
        } else if (category[1].trim() === 'KNIT') {
          setImageUrl("/static/automatic-guide-images/TOP_KNIT.png");
        } else if (category[1].trim() === 'SHIRT') {
          setImageUrl("/static/automatic-guide-images/TOP_SHIRT.png");
        } else if (category[1].trim() === 'T-SHIRT' || category[1].trim() === 'TSHIRT') {
          setImageUrl("/static/automatic-guide-images/TOP_T-SHIRT.png");
        } else if (category[1].trim() === 'COAT') {
          setImageUrl("/static/automatic-guide-images/OUTER_COAT.png");
        } else if (category[1].trim() === 'JACKET') {
          setImageUrl("/static/automatic-guide-images/OUTER_JACKET.png");
        } else if (category[1].trim() === 'JUMPER') {
          setImageUrl("/static/automatic-guide-images/OUTER_JUMPER.png");
        } else if (category[1].trim() === 'VEST') {
          setImageUrl("/static/automatic-guide-images/OUTER_VEST.png");
        } else if (category[1].trim() === 'CARDIGAN') {
          setImageUrl("/static/automatic-guide-images/OUTER_CARDIGAN.png");
        }
      }
    }
  },[open])

  const handleCancel = () => {
    setJennieFitCategoryFourth('')
    setJennieFitCategoryThird('')
    setImageUrl('')
    onClose();
  };

  const handleThirdDepth = (value) => {
    setJennieFitCategoryThird(value)
    let jennieFitCategory = ''
    if(category !== undefined) {
      if(category[0].trim() == 'ACC') {
        jennieFitCategory = category[0].trim() + '_' + 'ETC' + '_' + value + '_' + jennieFitCategoryFourth
      } else if(category[1].trim() == 'T-SHIRT') {
        jennieFitCategory = category[0].trim() + '_' + category[1].trim().replace('-', '') + '_' + value + '_' + jennieFitCategoryFourth
      } else {
        jennieFitCategory = category[0].trim() + '_' + category[1].trim() + '_' + value + '_' + jennieFitCategoryFourth
      }
    }
    let test = items.find(item => item.name == jennieFitCategory)
    if (test !== undefined) {
      setJennieFitCategoryFourth('')
      setJennieFitCategoryThird('')
      setImageUrl('')
      onClose(test)
    }
    if(category[0].trim() === 'TOP' && category[1].trim() !== 'BUSTIER') {
      setImageUrl("/static/automatic-guide-images/TOP_SLEEVE.png")
    } else if(category[0].trim() === 'OUTER') {
      setImageUrl("/static/automatic-guide-images/OUTER_SLEEVE.png")
    } else if(category[0].trim() === 'DRESS') {
      setImageUrl("/static/automatic-guide-images/DRESS_SLEEVE.png")
    } else if(category[1].trim() === 'BUSTIER' && value == 'SLING') {
      setImageUrl("/static/automatic-guide-images/TOP_BUSTIER.png")
    } else if(category[1].trim() === 'BUSTIER' && value == 'SLEEVELESS') {
      setImageUrl("/static/automatic-guide-images/TOP_BUSTIER_SLEEVELESS.png")
    }
  };

  const handleFourthDepth = (value) => {
    setJennieFitCategoryFourth(value)
    let jennieFitCategory = ''
    if(category !== undefined) {
      if(category[0].trim() == 'ACC') {
        jennieFitCategory = category[0].trim() + '_' + 'ETC' + '_' + jennieFitCategoryThird + '_' + value
      } else if(category[1].trim() == 'T-SHIRT') {
        jennieFitCategory = category[0].trim() + '_' + category[1].trim().replace('-', '') + '_' + jennieFitCategoryThird + '_' + value
      } else {
        jennieFitCategory = category[0].trim() + '_' + category[1].trim() + '_' + jennieFitCategoryThird + '_' + value
      }
    }
    let test = items.find(item => item.name == jennieFitCategory)
    if (test !== undefined) {
      setJennieFitCategoryFourth('')
      setJennieFitCategoryThird('')
      setImageUrl('')
      onClose(test)
    }
  };

  const handleValue = () => {
    return ((category && category[0].trim() != 'ACC') ? (category[0] + ' > ' + category[1]) : (category && category[0].trim() == 'ACC') ? (category[0] + ' > ' + 'ETC') : (category))
  }

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {maxWidth: 950, maxHeight: 1000, minHeight: 803, minWidth: 650}}}
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
          {...other}
      >
        <Stack direction='row'
               sx={{display: 'flex', justifyContent: 'space-between'}}>
          <DialogTitle sx={{mt: 2,}}>Jennie Fit AI</DialogTitle>
          <Typography
              color="primary"
              variant="body2"
          >
            <TextField
                sx={{width: 350, height: 20, m: 2}}
                value={`${handleValue()}` + ' > ' + jennieFitCategoryThird + ' > ' + jennieFitCategoryFourth}
                inputProps={{readOnly: true}}
            />
          </Typography>
        </Stack>
        <DialogContent dividers
                       sx={{mt: 2, height: 403}}>
          <Stack direction='row'
                 sx={{mt: 2, height: 403}}>
            <Stack direction='column'
                   spacing={1}>
              {thirdDepth.map(item => (
                  <Grid
                      item
                      key={item}
                  >
                    <Button
                        variant="contained"
                        size="medium"
                        sx={{display: 'flex'}}
                        onClick={() => handleThirdDepth(item)}
                    >
                      {item}
                    </Button>
                  </Grid>
              ))}
            </Stack>
            <Stack direction={'column'}>
              {imageUrl ?
                  <img
                      src={imageUrl}
                      style={{objectFit: 'contain', width: '100%', height: 613, cursor: 'pointer'}}
                      loading="eager"
                  />
                  :
                  <Box sx={{width: 385, height: 613}}></Box>
              }
            </Stack>
            <Stack direction='column'
                   spacing={1}>
              {fourthDepth.map(item => (
                  <Grid
                      item
                      key={item}
                  >
                    <Button
                        variant="contained"
                        size="medium"
                        sx={{display: 'flex'}}
                        onClick={() => handleFourthDepth(item)}
                    >
                      {item}
                    </Button>
                  </Grid>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button autoFocus
                  onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}