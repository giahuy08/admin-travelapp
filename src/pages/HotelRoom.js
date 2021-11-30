import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import * as React from 'react';
// import { sentenceCase } from 'change-case';
import { useState ,useEffect} from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import callApi from 'src/api/apiService';
// material
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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';
//css
import AddTour from './AddTour.css'
import RoomMenu from 'src/components/_dashboard/user/RoomMenu';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'size', label: 'Size', alignRight: false },
    { id: 'floor', label: 'Floor', alignRight: false },
    { id: 'bed', label: 'Bed', alignRight: false },
    { id: 'detail', label: 'Detail', alignRight: false },
    { id: 'price', label: 'Price', alignRight: false },   
    { id: 'checkIn', label: 'Check In', alignRight: false },
    { id: 'checkOut', label: 'Check Out', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'delete', label: 'Delete', alignRight: false },
    { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}






        

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

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

export default function HotelRoom() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  


  //biến add tour
  const [openAddTour, setOpenAddTour] = React.useState(false);
  const handleOpenAddTour = () => setOpenAddTour(true);
  const handleCloseAddTour = () => setOpenAddTour(false);
  
  const [enterprise, setEnterprise] = React.useState([]);
  const [idEnterprise, setIDEnterprise] = React.useState('');


  const [name, setName] = React.useState('');
  const [size, setSize] = React.useState('');
  const [floor, setFloor] = React.useState('');
  const [bed, setBed] = React.useState('');
  const [detail, setDetail] = React.useState('');
  const [checkIn, setCheckIn] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');

  const [category, setCategory] = React.useState(0);
  const [openCategory, setOpenCategory] = React.useState(false);

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleCloseCategory = () => {
    setOpenCategory(false);
  };

  const handleOpenCategory = () => {
    setOpenCategory(true);
  };

  //sửa lý add tour
  useEffect(() => {
    (       
            async () => {

            const response = await fetch('https://app-travelbe.herokuapp.com/enterprise/getAllEnterprise',{
                method: 'GET',
                headers: {'Content-Type': 'application/json',  "Authorization":"Bearer " + localStorage.getItem("accessToken")}
            });
            
            const content = await response.json();            
            setEnterprise(content.data)
      }    
    )();
},[])






const clickAddTour = async () =>{
    console.log({
        idEnterprise,
        name,
        size,
        floor,
        bed,
        detail,
        price,
        checkIn,
        checkOut
      })
    
      let link = 'https://app-travelbe.herokuapp.com/hotelroom/createHotelRoom'
      
      const response = await fetch(link, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("accessToken")},
          body : JSON.stringify({
            idEnterprise,
            name,
            size,
            floor,
            bed,
            detail,
            price,
            checkIn,
            checkOut
          })
      });
      const content = await response.json();
      console.log(content.data)
      if(content.data){
        window.confirm('Add thành công !')
        window.location.reload()
      }else {
        window.alert('Thất bại !')
      }
  
}



  //
  const [tours, setTours] = useState([]);
  
  useEffect(() => {
    callApi(
      `hotelroom/getAllHotelRoom`,
      "GET"
      
    ).then((res) => {
      console.log(res.data.data)
      setTours(res.data.data);
    });
  }, []);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tours.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tours.length) : 0;

  const filteredUsers = applySortFilter(tours, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Room {tours.length}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleOpenAddTour}
          >
            New Room 
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tours.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, name,detail,size,floor,bed,price,status, checkIn, checkOut, deleted } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none" sx={{ maxWidth: 400 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>                           
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                         <TableCell align="left">{size}</TableCell>
                         <TableCell align="left">{floor}</TableCell>
                         <TableCell align="left">{bed}</TableCell>
                         <TableCell align="left">{detail}</TableCell>
                          <TableCell align="left">{price.toLocaleString('en-US')}  VNĐ</TableCell>
                          <TableCell align="left" >{(checkIn != null && new Date(checkIn).toISOString('vi-VN').slice(0, 10)) || ''}</TableCell> 
                          <TableCell align="left" >{(checkOut != null && new Date(checkOut).toISOString('vi-VN').slice(0, 10)) || ''}</TableCell> 
                          
                          <TableCell align="left">{(status === 0 && "Còn") || "Hết"}</TableCell>
                       
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(deleted !== false && "error") || "success"}
                            >
                              {(deleted === false && "Active") || "Error"}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <RoomMenu id={_id} name={name} detail={detail} size={size} floor={floor} bed={bed} price={price}  checkIn={checkIn} checkOut={checkOut} deleted={deleted}/>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tours.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddTour}
        onClose={handleCloseAddTour}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openAddTour}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Add Room
            </Typography>

            <Autocomplete
              style={{marginTop: '10px'}}
              id="free-solo-demo"
              disableClearable             
              options={enterprise.map((enterprise) => enterprise.name)}
              renderInput={(params) => <TextField {...params} label="Eterprise" />}
              onChange={(event, newValue) => {
                enterprise.map((enterprise) => {if(newValue == enterprise.name) setIDEnterprise(enterprise._id) 
                })
                console.log(idEnterprise)
              }}
            />

          

          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" label="Name" variant="outlined" value={name} onChange={(event)=>setName(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="number" label="Size" variant="outlined" value={size} onChange={(event)=>setSize(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="number" label="Floor" variant="outlined" value={floor} onChange={(event)=>setFloor(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="number" label="Bed" variant="outlined" value={bed} onChange={(event)=>setBed(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} multiline rows={2} id="outlined-basic" label="Detail" variant="outlined" value={detail} onChange={(event)=>setDetail(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="number" label="Price(VNĐ)" variant="outlined" value={price} onChange={(event)=>setPrice(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="date" label="" variant="outlined" value={checkIn} onChange={(event)=>setCheckIn(event.target.value)}/>        
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="date" label="" variant="outlined" value={checkOut} onChange={(event)=>setCheckOut(event.target.value)}/>
        
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Nhớ điền đầy đủ thông tin nha!
            </Typography>

            <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={clickAddTour}
          >
            ADD
          </Button>

          </Box>
        </Fade>
      </Modal>
      
    </Page>
  );
}
