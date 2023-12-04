import { useState, forwardRef } from 'react';
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { QrReader } from "react-qr-reader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import HistoryIcon from '@mui/icons-material/History';

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export default function ClientList({ history, name, onSuccesfulScan, filteredClients, onSearch, onCreate, onUpdate, onDelete, error, defaultServices, onDefaultServiceUpdate, onDefaultServiceDelete, onDefaultServiceCreate }) {
  const [formData, setFormData] = useState({ id: '', name: ''});
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [childModal, setChildModalOpen] = useState(false);
  const [dsopen, setDsOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDSSubmit = (event) => {
    event.preventDefault();
    if (editingId) {
      onDefaultServiceUpdate(formData);
    } else {
      onDefaultServiceCreate(formData);
    }
    handleChildCancelEdit();
  };

  const handleDSEdit = (item) => {
    setEditingId(item._id);
    setChildModalOpen(true);
    setFormData({_id: item._id, name: item.name});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingId) {
      onUpdate(formData);
      setEditingId(null);
    } else {
      onCreate(formData, searchTerm);
    }
    handleCancelEdit();
  };


  const handleEdit = (item) => {
    setEditingId(item._id);
    setModalOpen(true);
    setFormData({
      id: item._id,
      name: item.name,
    });
  };
  const handleScan = data => {
    if (data) {
        setQrscan(data)
    }
}

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ id: '', name: ''});
    setDsOpen(false);
    setModalOpen(false);
    setHistoryOpen(false);
    setScanning(false);
  };
   const handleChildCancelEdit = () => {
    setEditingId(null);
    setFormData({ id: '', name: ''});
    setChildModalOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
    <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box className="Box" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Box className="Box" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <TextField
          sx={{pt: 3}}
          type='search'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          name="Buscar"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value), onSearch(e.target.value)}}
        />
      </form>
      </Box>      

      <Snackbar anchorOrigin={{ vertical:"top", horizontal:"center" }} open={successOpen} autoHideDuration={6000} onClose={() => {setSuccessOpen(false)}}>
        <Alert onClose={() => {setSuccessOpen(false)}} severity="success" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar anchorOrigin={{ vertical:"top", horizontal:"center" }} open={errorOpen} autoHideDuration={6000} onClose={() => {setErrorOpen(false)}}>
        <Alert onClose={() => {setErrorOpen(false)}} severity="error" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    
    <Dialog fullWidth maxWidth="md" onClose={() => {handleCancelEdit(), setScanning(false) }} open={scanning}>
     <QrReader
              delay={300}
              onScan={handleScan}
              onResult={(result) => {!result ? "" : 
              (setScanning(false) || 1) && onSuccesfulScan(result).then((x) => {setAlertMessage(x), setSuccessOpen(true)}).catch((x) => {setAlertMessage(x), setErrorOpen(true)});
            }}
              style={{ width: "md" }}
      />
    </Dialog>

      <Dialog fullWidth maxWidth="xs" scroll="paper" open={dsopen} onClose={handleCancelEdit}>
        <DialogTitle><Typography sx={{fontWeight: 'bold', pt: 2}}>Servicios default </Typography></DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <List sx={{ pt: 0}}>
          {defaultServices.length > 0 ? defaultServices.map(item => (
            <ListItem key={item._id} secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => handleDSEdit(item)}>
                  <EditIcon fontSize="large"/>
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDefaultServiceDelete(item._id)}>
                  <DeleteIcon fontSize="large"/>
                </IconButton>
              </>
            }>
              <ListItemText primary={item.name}/>
            </ListItem>
          )) : <ListItem><ListItemText><Typography align="center">Aun no hay servicios</Typography></ListItemText></ListItem>}
          </List>
          <Dialog open={childModal} onClose={handleChildCancelEdit}>
        <DialogTitle>{!editingId && <Typography sx={{fontWeight: 'bold', pt: 2}} >Nuevo servicio default</Typography> || <Typography sx={{fontWeight: 'bold', pt: 2}}>Editar servicio default </Typography>}</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => {handleDSSubmit(e), setChildModalOpen(false)}} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
            <TextField
              label="Name"
              autoFocus
              margin="dense"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleFormChange}
              variant="standard"
            />
          </form>
          </DialogContent>
          <DialogActions>
              <Button sx={{ mr: 1 }} type="submit" size="medium" onClick={handleDSSubmit}>{editingId ? <Typography sx={{fontSize: 14}}>Actualizar</Typography> : <Typography sx={{fontSize: 14}}>Añadir</Typography>}</Button>
              <Button size="medium" color="secondary" onClick={handleChildCancelEdit}>Cancelar</Button>
            </DialogActions>
      </Dialog>
       </DialogContent>
          <DialogActions>
              <Button sx={{ mr: 1 }}  size="medium" onClick={() => {setChildModalOpen(true)}}><Typography sx={{fontSize: 14}}>Nuevo</Typography></Button>
              <Button size="medium" color="secondary" onClick={handleCancelEdit}>Cerrar</Button>
            </DialogActions>
      </Dialog>
      

      <Dialog fullWidth maxWidth="xs" open={modalOpen} onClose={handleCancelEdit}>
        <DialogTitle>{!editingId && <Typography sx={{fontWeight: 'bold', pt: 2}} >Nuevo {name}</Typography> || <Typography sx={{fontWeight: 'bold', pt: 2}}>Editar cliente </Typography>}</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => {handleSubmit(e), setModalOpen(false)}} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
            <TextField
              label="Nombre"
              autoFocus
              margin="dense"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleFormChange}
              variant="standard"
            />
          </form>
          </DialogContent>
          <DialogActions>
              <Button sx={{ mr: 1 }} onClick={handleSubmit} size="medium" type="submit">{editingId ? <Typography sx={{fontSize: 14}}>Actualizar</Typography> : <Typography sx={{fontSize: 14}}>Crear</Typography>}</Button>
              <Button size="medium" color="secondary" onClick={handleCancelEdit}>Cancelar</Button>
            </DialogActions>
      </Dialog>
     
     
      </Box>
      {error && <div>{error.message}</div>}
      <Typography sx={{m: 1, fontFamily: 'Monospace', fontSize: 'h5.fontSize', fontWeight:"bold", pt: 3}}>{name}s</Typography>
      <List sx={{ width: '100%', maxWidth:{xs: 360, md:"30rem"} }}>
        {filteredClients.length > 0 ? filteredClients.map(item => (
          <ListItem  key={item._id} secondaryAction={
            <>
             <IconButton component={Link} to={`/${item._id}/services`}>
             <AddShoppingCartIcon fontSize="large"/>
             </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(item)}>
                <EditIcon fontSize="large"/>
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item._id)}>
                <DeleteIcon fontSize="large"/>
              </IconButton>
            </>
          }>
            <ListItemText sx={{
            maxWidth: {xs:100, md:"15rem"}
            }}primaryTypographyProps={{style: {
                whiteSpace: 'normal',
            }}} primary={item.name} secondary={`Servicios: ${item.aproducts}/${item.tproducts} `} />
          </ListItem>
        )) : <ListItem><ListItemText><Typography align="center">Aun no hay clientes</Typography></ListItemText></ListItem>}
      </List>


      <Dialog scroll="paper" fullWidth onClose={() => {setHistoryOpen(false)}} open={historyOpen}>
        <DialogTitle>
          <Typography sx={{fontWeight: 'bold', pt: 2}}>Historia</Typography>
        </DialogTitle>
        <DialogContent>
          <List sx={{ width: '100%', maxWidth:{xs: 360, md:"30rem"} }}>
            {history.length <= 0 ? <ListItem><ListItemText><Typography align="center">Historia vacía</Typography></ListItemText></ListItem> :
            history.map(item => 
            <ListItem key={item._id}>
              <ListItemText primary={item.message} secondary={new Date(item.date).toUTCString()}></ListItemText>
            </ListItem>)
            }
          </List>
        </DialogContent>
        <DialogActions>
        <Button size="medium" color="secondary" onClick={handleCancelEdit}>Cerrar</Button>
        </DialogActions>
      </Dialog>


    </Box>
    <AppBar position={filteredClients.length < 10 ? "fixed" : "sticky"} color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
        <IconButton variant='contained' onClick={() => {setDsOpen(true)}} sx={{p: 2 }}><SettingsIcon fontSize="large"/></IconButton>
        <IconButton  onClick={() => {setHistoryOpen(true)}}> <HistoryIcon fontSize="large"/> </IconButton>
          <StyledFab onClick={() => {setScanning(true)}} color="secondary" aria-label="add">
            <QrCodeScannerIcon />
          </StyledFab>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="success" sx={{p: 2}} onClick={() => setModalOpen(true)}><PersonAddIcon fontSize="large"/></IconButton>
        </Toolbar>
      </AppBar>
    </main>
    </ThemeProvider>
  );
}
