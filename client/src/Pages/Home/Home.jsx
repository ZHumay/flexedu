import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, ButtonGroup, Modal, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DatePicker } from '@mui/lab';
import Navbar from '../../Components/Navbar/Navbar';

function Home() {
  const [data, setData] = useState([
    { id: 1, name: 'Eli', surname: 'Eliyev', status: 'Pending' },
    { id: 2, name: 'Akif', surname:"Memmedov", status: 'Pending' },
    { id: 3, name: 'Musa', surname:"Isayev", status: 'Pending' },
    { id: 4, name: 'Ibrahim', surname:"Isgenderov", status: 'Pending' },
    { id: 5, name: 'Nihad', surname:"Musayev", status: 'Pending' }
  ]);

  const [filteredData, setFilteredData] = useState(data);
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(null)


  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleFilter = (event) => {
    const { value } = event.target;
    setFilterStatus(value); 
    filterData(value); 
  };

  const filterData = (status) => {
    if (status === 'All') {
      setFilteredData(data); 
    } else {
      const filteredItems = data.filter((item) => item.status === status);
      setFilteredData(filteredItems); 
    }
  };

  const handleDateSelect = (date) => {
    const updatedData = [...data];
    const dataIndex = updatedData.findIndex(item => item.id === selectedRowId);
    if (dataIndex !== -1) {
      updatedData[dataIndex].status = 'Accepted';
      updatedData[dataIndex].selectedDate = date;
      setData(updatedData);
    }

    setOpenModal(false);
  };

  function handleDelete(id) {
        const updatedData = [...data];
        const dataIndex = updatedData.findIndex(item => item.id === id);
        if (dataIndex !== -1 && updatedData[dataIndex].status === 'Pending') {
          updatedData[dataIndex].status = 'Removed';
          setData(updatedData);
        }
      }
  function handleAccepted(id) {
    setSelectedRowId(id);
    setOpenModal(true);
  }
  const filterByNameOrSurname = (term) => {
    const filteredItems = data.filter((item) => {
      const fullName = `${item.name} ${item.surname}`.toLowerCase();
      return fullName.includes(term.toLowerCase());
    });
    setFilteredData(filteredItems);
  };
  

  return (
    <>
  
    <Navbar/>
    <div>
        {console.log(data)}
        <TextField
  label="Search by Name or Surname"
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    filterByNameOrSurname(e.target.value);
  }}
/>
      <ButtonGroup>
        <Button value="All" onClick={handleFilter}>
          All
        </Button>
        <Button value="Pending" onClick={handleFilter}>
          Pending
        </Button>
        <Button value="Accepted" onClick={handleFilter}>
          Accepted
        </Button>
        <Button value="Removed" onClick={handleFilter}>
          Removed
        </Button>
      </ButtonGroup>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.surname}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  {row.status === 'Pending' && (
                    <>
                      <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => handleDelete(row.id)} />
                      <CheckCircleIcon  style={{ cursor: 'pointer' }} onClick={() => handleAccepted(row.id)} />
                    </>
                    
                  )}
                </TableCell>
                <TableCell>
                  {row.status === 'Accepted' && (
                    <>
                     <p>{date}</p>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={openModal}
        onClose={handleModalClose}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <input onChange={(e) => setDate(e.target.value)} type='date'></input>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
          <Button onClick={() => handleDateSelect(selectedDate)}>Save</Button>
        </Box>
      </Modal>
      {console.log(date)}
    </div>
    </>
  );
}

export default Home;