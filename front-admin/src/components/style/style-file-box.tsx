import {Box, Button, Grid, IconButton, Menu, Paper, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {X as XIcon} from "../../icons/x";
import Dropzone from "./dropzone";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import {ImageInFormWidget} from "../widgets/image-widget";

const img = {
  display: 'block',
  width: '100%',
  height: '100%'
};

const StyleFileBox = (props) => {

  const {header, imageUrlData, addFileImage} = props;

  let [files, setFiles] = useState<any[]>([]);
  let [imageUrl, setImageUrl] = useState<string>(null);
  const [visible, setVisible] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setImageUrl(imageUrlData);
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      //setImageUrl(files[files.length + 1].preview);
    }
  }, [files]);

  const handleDrop = (newFiles: any): void => {
    newFiles.forEach(file => {
      file.preview = URL.createObjectURL(file)
    })
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleVisible = () => {
    setVisible(!visible);
  };

  const onRemove = (): void => {
    setFiles([]);
  }

  useEffect(() => {
    addFileImage(files);
    handleClose();
    if (!visible) {
      handleVisible();
    }
  }, [files]);

  return (
    <Box
      sx={{ border: 1, borderRadius: 1 }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          pr: 0.6,
          pl: 2
        }}
      >
        <Typography>
          {header}
        </Typography>
        <IconButton aria-label="add" onClick={handleClick} >
          <AddBoxRoundedIcon />
        </IconButton>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Box sx={{m: 2, p: 2}}>
          <Dropzone
            accept="image/*"
            files={files}
            onDrop={handleDrop}
            maxFiles={1}
          />
        </Box>
      </Menu>
      <Box sx={{m: 1}}>
        {
          imageUrlData != null ? <div style={{position: 'relative'}}>
            <ImageInFormWidget imageUrl={imageUrlData} />
            <div style={{position: 'absolute', right: 10, top: 0}}>
              <IconButton
                edge="end"
                color={'error'}
                onClick={() => onRemove()}
              >
                <XIcon fontSize="small"/>
              </IconButton>
            </div>
          </div> : <></>
        }
      </Box>
    </Box>
  )
}

export default StyleFileBox;