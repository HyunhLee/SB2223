import {Box, Button, Grid, IconButton, ListItem, ListItemText, Stack, Typography} from "@mui/material";
import React, {useContext, useEffect} from "react";
import 'react-simple-tree-menu/dist/main.css';
import {DataContext} from "../../../contexts/data-context";
import {getDataContextValue} from "../../../utils/data-convert";
import {CategoryDialog, ColorDialog, PatternDialog} from "../../dialog/category-dialog";
import DeleteIcon from "@mui/icons-material/Delete";

interface Category {
  id: string;
  name: string;
  children?: readonly Category[];
}

const StyleBox = (props) => {
  const dataContext = useContext(DataContext);

  const {item, gender, deleteStyle, imageUrl} = props;
  const [open, setOpen] = React.useState(false);
  const [patternOpen, setPatternOpen] = React.useState(false);
  const [colorOpen, setColorOpen] = React.useState(false);

  const [categoryItem, setCategoryItem] = React.useState<any>({});
  const [category, setCategory] = React.useState(null);
  const [color, setColor] = React.useState(null);
  const [pattern, setPattern] = React.useState(null);

  // 초기값 셋팅
  useEffect(() => {
    if (dataContext.FEMALE_CATEGORY_MAP && gender == 'F') {
      if (item.category5 != null && item.category5 != 0) {
        setCategory(getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category5, 'path'));
      } else if (item.category4 != null && item.category4 != 0) {
        setCategory(getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category4, 'path'));
      } else if (item.category3 != null && item.category3 != 0) {
        setCategory(getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category3, 'path'));
      } else if (item.category2 != null && item.category2 != 0) {
        setCategory(getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category2, 'path'));
      } else if (item.category1 != null && item.category1 != 0) {
        setCategory(getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category1, 'path'));
      }
    }
    if (dataContext.MALE_CATEGORY_MAP && gender == 'M') {
      if (item.category5 != null && item.category5 != 0) {
        setCategory(getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category5, 'path'));
      } else if (item.category4 != null && item.category4 != 0) {
        setCategory(getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category4, 'path'));
      } else if (item.category3 != null && item.category3 != 0) {
        setCategory(getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category3, 'path'));
      } else if (item.category2 != null && item.category2 != 0) {
        setCategory(getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category2, 'path'));
      } else if (item.category1 != null && item.category1 != 0) {
        setCategory(getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category1, 'path'));
      }
    }
    if (dataContext.COLOR && item.colorType != null) {
      const findColor = dataContext.COLOR.find(color => color.name === item.colorType)
      setColor(findColor ? findColor.name: '');
    }
    if (dataContext.PATTERN && item.patternType != null) {
      const findPattern = dataContext.PATTERN.find(pattern => pattern.name === item.patternType)
      setPattern(findPattern ? findPattern.name: '');
    }
    if (dataContext.COLOR && item.colorName != null) {
      const findColor = dataContext.COLOR.find(color => color.name === item.colorName)
      setColor(findColor ? findColor.name: '');
    }
    if (dataContext.PATTERN && item.patternName != null) {
      const findPattern = dataContext.PATTERN.find(pattern => pattern.name === item.patternName)
      setPattern(findPattern ? findPattern.name: '');
    }
  }, [gender]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    if (value) {
      setCategoryItem(value);
      if(gender == 'F') {
        setCategory(getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', value.id, 'path'));
      } else {
        setCategory(getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', value.id, 'path'));
      }
    }
    setOpen(false);
  };

  const handleClickPatternOpen = () => {
    setPatternOpen(true);
  };

  const handlePatternClose = (value) => {
    if (value) {
      setPattern(value.name);
    }
    setPatternOpen(false);
  };

  const handleClickColorOpen = () => {
    setColorOpen(true);
  };

  const handleColorClose = (value) => {
    if (value) {
      setColor(value.name);
    }
    setColorOpen(false);
  };

  useEffect(() => {
    if (Object.keys(categoryItem).length > 0) {
      item.category1 = null;
      item.category2 = null;
      item.category3 = null;
      item.category4 = null;
      item.category5 = null;
      const path = categoryItem.key.split('/');
      path.forEach((id, index) => {
        const categoryIndex = `category${index + 1}`
        item[categoryIndex] = id;
      })
    }

  }, [categoryItem]);

  useEffect(() => {
      item.patternType = pattern;
  }, [pattern]);

  useEffect(() => {
      item.colorType = color;
  }, [color]);

  const categoryText = () => {
    return (
      <Typography variant="caption"
style={{ color: '#ff6f00', fontWeight: 600 }}>{category}</Typography>
    )
  }

  const colorAndPatternText = () => {
    return <Typography variant="caption">
      <Stack direction="row"
justifyContent={"space-between"}>
        <Stack>
          {pattern}
        </Stack>
        <Stack>
          {color}
        </Stack>
      </Stack>
    </Typography>
  }

  const handleClickDelete = () => {
    deleteStyle(item, imageUrl);
  }

  return (
    <Box sx={{
      width: '100%',
      border: 1,
      borderRadius: 1,
      pt: 0.4,
      pb: 0.4
    }}>
      <Grid container
spacing={1}
justifyContent={"space-between"}
alignItems={"center"}>
        <Grid item
xs={7}>
          <ListItem sx={{pt: 0, pb: 0, pr: 5}}>
            <ListItemText primary={categoryText()}
secondary={colorAndPatternText()} />
          </ListItem>
        </Grid>
        <Grid item
xs={5}
justifyContent={"flex-end"}
sx={{display: 'flex'}}>
          <Button size='small'
variant="outlined"
sx={{mr: 0.5, p: 0.3, fontSize: 12}}
onClick={handleClickOpen}>
            카테고리
          </Button>
          <Button size='small'
variant="outlined"
sx={{mr: 0.5, p: 0.3, fontSize: 12}}
onClick={handleClickPatternOpen}>
            패턴
          </Button>
          <Button size='small'
variant="outlined"
sx={{mr: 0.5, p: 0.3, fontSize: 12}}
onClick={handleClickColorOpen}>
            색상
          </Button>
          <IconButton color="error"
component="span"
sx={{mr: 0.7, p: 0.3, fontSize: 12}}
onClick={handleClickDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <CategoryDialog
        keepMounted
        parent={'STYLE'}
        open={open}
        onClose={handleClose}
        category={dataContext.CATEGORY}
        value={category}
      />
      <PatternDialog
        keepMounted
        open={patternOpen}
        onClose={handlePatternClose}
        items={dataContext.PATTERN}
        value={pattern}
      />
      <ColorDialog
        keepMounted
        open={colorOpen}
        onClose={handleColorClose}
        items={dataContext.COLOR}
        value={color}
      />
    </Box>
  )
}

export default StyleBox;