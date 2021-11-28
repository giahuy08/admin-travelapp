import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import callApi from 'src/api/apiService'
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import alertCircleOutline from '@iconify/icons-eva/alert-circle-outline';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import * as React from 'react';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useEffect} from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// ----------------------------------------------------------------------
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
export default function DiscountMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [openEditDiscount, setOpenEditDiscount] = React.useState(false);
  const handleOpenEditDiscount = () => setOpenEditDiscount(true);
  const handleCloseEditDiscount = () => setOpenEditDiscount(false);
    
  const [id, setID] = useState(props.id);
  const [discount, setDiscount] = useState(props.discount);
  const [code, setCode] = useState(props.code);
  const [idTour, setIDTour] = useState(props.idTour);
  const [status, setStatus] = useState(props.status);
  

  

  //các hàm xử lý
  const clickEditDiscount = () => {

    console.log(localStorage.getItem("accessToken"))   
    callApi(`discount/updateDiscount`, "PUT", {id, idTour, code, discount})
      .then((res) => {
        console.log(res);
        window.location.reload()
        
      })
      .catch((err) => {
        console.log(err);
      });
  }; 

  const handleCanelDiscount = ()=>{
    console.log(localStorage.getItem("accessToken"))
    console.log(id)
    callApi(`discount/deleteDiscount?id=${id}`, "DELETE")
      .then((res) => {
        console.log(res);
        window.location.reload()
        
      })
      .catch((err) => {
        console.log(err);
      });
  }  
 
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText onClick={handleOpenEditDiscount} primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>   
        {status == 0 && <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={alertCircleOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Cancel" primaryTypographyProps={{ variant: 'body2' }} onClick={handleCanelDiscount}/>
        </MenuItem> || ''}             
      </Menu>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditDiscount}
        onClose={handleCloseEditDiscount}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 0,
        }}
      >
        
        <Fade in={openEditDiscount}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit discount
            </Typography>

          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" label="Code" variant="outlined" value={code} onChange={(event)=>setCode(event.target.value)}/>               
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="number" label="Discount" variant="outlined" value={discount} onChange={(event)=>setDiscount(event.target.value)}/>          
        
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Kiểm tra trước khi nhấn save!
            </Typography>


            <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={clickEditDiscount}
          >
            Save
          </Button>

          </Box>
        </Fade>
      </Modal>     
    </>
  );
}
