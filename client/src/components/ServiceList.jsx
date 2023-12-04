import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

export default function ClientList({ name, data, onDsAdd, onCreate, onUpdate, onDelete, onDsDelete, error, onActiveToggle, defaultServices, selectedList, onBulkCreate }) {
  const [formData, setFormData] = useState({ id: '', name: ''});
  const [editingId, setEditingId] = useState(null);
  const [fromDefaultsOpen, setFromDefaultsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const params = useParams();
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onCreate(params.id, formData);
    }
    handleCancelEdit();
  };

  const handleDsSave = (event) => {
    event.preventDefault();
    onBulkCreate(params.id);
    setFromDefaultsOpen(false);
    };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setOpen(true);
    setFormData({
      name: item.name,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: ''});
    setOpen(false);
    setFromDefaultsOpen(false);
  };

  const styles = {

    largeIcon: {
      width: 60,
      height: 60,
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
    <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box className="Box" sx={{pt:3, display: 'flex', flexDirection: 'column'}}>
    <Box className="Box" sx={{display: 'flex', flexDirection: 'column', }}>
    <Button onClick={() => {setOpen(true)}} color="success" variant="outlined" size="large" endIcon={<AddIcon/>} edge="end">
                <Typography fontSize={"small"}>Agregar nuevo</Typography>
              </Button>
              </Box>
              <Box className="Box" sx={{pt: 2, display: 'flex', flexDirection: 'column'}}>
    <Button onClick={() => {setFromDefaultsOpen(true)}} color="secondary"variant="outlined" size="large" endIcon={<AddIcon/>} edge="end">
                <Typography fontSize={"small"}>Agregar Desde Default</Typography>
              </Button>
         </Box>
         </Box>
         <Dialog fullWidth maxWidth="xs" open={open} onClose={handleCancelEdit}>
          <DialogTitle>{
           !editingId && <Typography sx={{fontWeight: 'bold', pt: 2}}>Nuevo Servicio </Typography> ||
           editingId && <Typography sx={{fontWeight: 'bold', pt: 2}}>Editar Servicio </Typography>
          }</DialogTitle>
          <DialogContent>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
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
              <Button onClick={handleSubmit} sx={{ mr: 1 }} size="medium" type="submit">{editingId ? <Typography sx={{fontSize: 14}}>Actualizar</Typography> : <Typography sx={{fontSize: 14}}>Crear</Typography>}</Button>
              <Button onClick={handleCancelEdit} size="medium" color="secondary" >Cancelar</Button>
            </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="xs" scroll="paper" open={fromDefaultsOpen} onClose={handleCancelEdit}>
        <DialogTitle><Typography sx={{fontWeight: 'bold', pt: 2}}>Servicios default </Typography></DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <List sx={{ pt: 0}}>
          {defaultServices.length > 0 ? defaultServices.map(item => (
            <ListItem key={item._id} secondaryAction={
              <>
              {
              selectedList.get(item._id) &&
              <IconButton edge="end" aria-label="edit" onClick={() => {onDsDelete(item)}}>
                  <RemoveShoppingCartIcon fontSize="large"/>
                </IconButton>
              }
                <IconButton edge="end" aria-label="edit" onClick={() => {onDsAdd(item)}}>
                  <AddIcon fontSize="large"/>
                </IconButton>
              </>
            }>
              <ListItemText primary={item.name} secondary={selectedList.get(item._id) ? `Agregando ${selectedList.get(item._id).length}` : ""}/>
            </ListItem>
          )) :
          <ListItem>
            <ListItemText>
              <Typography align="center">No hay servicios default</Typography>
            </ListItemText>
          </ListItem>}
          </List>
          </DialogContent>
          <DialogActions>
              <Button sx={{ mr: 1 }} size="medium" onClick={handleDsSave}><Typography sx={{fontSize: 14}}>Guardar</Typography></Button>
              <Button size="medium" color="secondary" onClick={handleCancelEdit}>Cancelar</Button>
            </DialogActions>
      </Dialog>


      {error && <div>{error.message}</div>}
      <Typography align="center" sx={{m: 1, fontFamily: 'Monospace', fontSize: 'h5.fontSize', fontWeight:"bold", pt: 3  }}>Servicios de {name}</Typography>
      <List sx={{ width: '100%', maxWidth: 360 }}>
        {data.length > 0 ? data.map(item => item._id ? (
          <ListItem key={item._id} secondaryAction={
            <>
              <IconButton iconstyle={styles.largeIcon} edge="end" aria-label="edit" onClick={() => onActiveToggle(item._id)}>
              {!item.active && <ToggleOffOutlinedIcon color="error" fontSize="large" /> || <ToggleOnOutlinedIcon fontSize="large" color="success"/>}
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(item)}>
                <EditIcon fontSize="large" />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item._id)}>
                <DeleteIcon fontSize="large" />
              </IconButton>
            </>
          }>
            <ListItemText sx={{
            maxWidth: {xs: 200, md:"13rem"}
            }}primaryTypographyProps={{style: {
                whiteSpace: 'normal',
            }}} primary={item.name} secondary={new Date(item.updatedAt).toUTCString()} />
          </ListItem>
        ) : <ListItem style={{display: "flex", justifyContent: 'center'}} key={Math.random()}><CircularProgress/></ListItem>) : <ListItem><ListItemText><Typography align="center">No se han agregado servicios</Typography></ListItemText></ListItem>}
      </List>
    </Box>
    </main>
    </ThemeProvider>
  );
}