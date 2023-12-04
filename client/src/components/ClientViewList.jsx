import { useState, forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Logo from'../assets/logo.png';
import LogoHead from'../assets/logohead.png';
import TextField from '@mui/material/TextField';
import QRCode from "react-qr-code";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


    export default function ClientViewList({data, onOk, client, onSearch, filteredServices, scanResult, isConnected}) {

      const [searchTerm, setSearchTerm] = useState("");
      const [searching, setSearching] = useState(false);
      const [open, setOpen] = useState(false);
      const [claimService, setClaimService] = useState("");
    

      const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });
      
        return (
          <main>
          <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box className="Box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CssBaseline />
                 
                <Dialog open={open && !scanResult} onClose={() => {setOpen(false)}}> 
                <DialogTitle><Typography sx={{fontWeight: 'bold', pt: 2}}>{isConnected ? "Presenta este código para reclamar el ticket" : "Conexión con el servidor no establecida"}</Typography> </DialogTitle>
                <DialogContent style={{display: 'flex', justifyContent: 'center'}}>
                  {
                    !isConnected ? <CircularProgress/> : 
                <QRCode
                  size={512}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={JSON.stringify({name: client.name, clientid: client._id, service: claimService})}
                  viewBox={`0 0 256 256`}
                />
                  }
              </DialogContent>
                </Dialog>
                <Snackbar anchorOrigin={{ vertical:"top", horizontal:"center" }} open={(client._id && scanResult && client._id == scanResult[0] && scanResult[1]) ? true : false} autoHideDuration={6000} onClose={() => {onOk(), setOpen(false)}}>
                    <Alert onClose={() => {onOk(), setOpen(false)}} severity="success" sx={{ width: '100%' }}>
                  Operación realizada con éxito
                 </Alert>
                  </Snackbar>
      
                  <Snackbar anchorOrigin={{ vertical:"top", horizontal:"center" }} open={(client._id && scanResult && client._id == scanResult[0] && !scanResult[1]) ? true : false} autoHideDuration={6000} onClose={() => {onOk(), setOpen(false)}}>
                  <Alert onClose={() => {onOk(), setOpen(false)}} severity="error" sx={{ width: '100%' }}>
                    Hubo un error en la operación
                   </Alert>
                  </Snackbar>

                <Typography color="primary" align="center" sx={{m: 1, fontFamily: '"Helvetica Neue"', fontWeight: 500, fontSize: 'h4.fontSize', pt: 3  }}>Tickets de {client.name}</Typography>
                <Box>
                {
                 !data.length &&  <Box><Typography align="center" sx={{m: 2, fontFamily: 'Monospace', fontSize: 'h6.fontSize', fontWeight:"bold", p: 3  }}>No hay servicios todavía</Typography></Box> ||
                 !filteredServices && <Typography align="center" sx={{m: 2, fontFamily: 'Monospace', fontSize: 'h6.fontSize', fontWeight:"bold", p: 3  }}> ""</Typography> ||
                 filteredServices.map((x) => {
                    return(
                    <Box key={x._id} sx={{ minWidth: 300, border: 1, maxWidth: 320, m: 2, p: 2 }}>
                    <Card style={{backgroundColor: "primary"}} variant="outlined">
      <CardContent >
        <Typography sx={{ fontSize: 14 }} color="secondary" gutterBottom>
          Ticket Open 2023
        </Typography>
        <Typography variant="h5" component="div">
        {x.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color={x.active ? "secondary" : "grey"}>
          {x.active && "Usable 1 vez" || "Usado"}
        </Typography>
        <Typography variant="body2">
          Fecha de expiración:
          <br />
          {new Date(x.updatedAt).toUTCString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => {setOpen(true), setClaimService(x)}} variant="contained"color="secondary" disabled={!x.active} size="small">Claim</Button>
      </CardActions>
      </Card>
      </Box>)
            })}
            </Box>
      </Box>
      </Box>
      <AppBar position={filteredServices.length < 3 ? "fixed" : "sticky"} color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
      <Box
        component="img"
        sx={{
        height: searching ? 53 : 53,
        width: searching ? 40: 300,
        maxHeight: { xs: 233, md: 167 },
        maxWidth: { xs: 350, md: 250 },
      }}
      alt="Logo del CGU"
      src={!searching ? Logo : LogoHead}
      />
        <Box sx={{ flexGrow: 1 }} />
        {searching && 
        <TextField  
        type='search'
        name="Buscar"
        placeholder="Buscar"
        value={searchTerm}
        onChange={(e) => {setSearchTerm(e.target.value), onSearch(e.target.value)}}
         sx={{
      backgroundColor: "white",
      borderRadius: 10,
    }} autoFocus onBlur={() => {setSearching(false)}} InputProps={{ sx: { color: "primary", borderRadius: 10 } }} size="small"></TextField>}
        <IconButton  onFocus={() => {setSearching(true)}}color="inherit">
          <SearchIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
      </main>
    );
};