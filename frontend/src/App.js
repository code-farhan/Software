import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Link from '@material-ui/core/Link';

import axios from 'axios';
import logo from './logo.svg';
import './App.css';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  copyright:{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }
}));
// Compotent
function App() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    communes: null,
    commune: null,
    subsidiaries: null,
    subsidiary: null,
    auth: null,
    name: null,
    address: null,
    phone: null,
    lat: null,
    lng: null,
    onLoading: true,
    activeStep: 0
  });
  /* EVENTS */
  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleFind = (evt) => {
    let filters = {};
    if (state.commune)  filters.location = state.commune;
    if (state.name)     filters.name = state.name;
    if (state.address)  filters.address = state.address;
    if (state.phone)    filters.phone = state.phone;
    if (state.lat)      filters.lat = state.lat;
    if (state.lng)      filters.lng = state.lng;
    setState({...state, onLoading: true});
    axios({
      method: 'post',
      url: 'http://127.0.0.1:3333/filter/subsidiary',
      headers: {
        Authorization: state.auth.type + ' ' + state.auth.token,
        'Content-Type': 'application/json'
      },
      data: filters
    })
    .then(res => {
      setState({
        ...state,
        subsidiaries: res.data,
        activeStep: 1,
        onLoading: false
      });
    })
    .catch(console.error);
  }
  const handleBack = (evt) => {
    setState({ ...state, activeStep: 0});
  };

 /* PREPARE DATA */
  if (state.auth === null) {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:3333/auth/login',
      data: {
        email: 'victor.palma.melo@gmail.com',
        password: '123456'
      }
    })
    .then(res => {
      setState({
        ...state,
        auth: res.data.access_token
      });
    })
    .catch(console.error);
  }
  if (state.auth !== null && state.communes === null) {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:3333/filter/location',
      headers: {
        Authorization: state.auth.type + ' ' + state.auth.token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setState({
        ...state,
        communes: res.data,
        onLoading: false
      });
    })
    .catch(console.error);
  }


  return (
    <div className="App">
      <Container maxWidth="md" >
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Senior Software Developer
          </Typography>
          <Stepper activeStep={state.activeStep} className={classes.stepper}>
            <Step key="filter">
              <StepLabel>Filtros</StepLabel>
            </Step>
            <Step key="results">
              <StepLabel>Resultados</StepLabel>
            </Step>
          </Stepper>
          {(state.activeStep === 0)?
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Comunas</InputLabel>
                <Select
                  native
                  onChange={handleChange}
                  inputProps={{
                    name: 'commune',
                    id: 'age-native-simple',
                  }}
                >
                  <option>Selecciona una comuna</option>
                  {((state.communes!== null)?state.communes.map(o => <option key={o.value} value={o.value}>{o.name}</option>):null)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="name-input">Nombre de local</InputLabel>
                <Input id="name-input" name="name" onChange={handleChange} aria-describedby="my-helper-text" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="address-input">Dirección</InputLabel>
                <Input id="address-input" name="address" onChange={handleChange} aria-describedby="my-helper-text" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="phone-input">Teléfono</InputLabel>
                <Input id="phone-input" name="phone" onChange={handleChange} aria-describedby="my-helper-text" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="lat-input">Latitud</InputLabel>
                <Input id="lat-input" name="lat" onChange={handleChange} aria-describedby="my-helper-text" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="lng-input">Longitud</InputLabel>
                <Input id="lng-input" name="lng" onChange={handleChange} aria-describedby="my-helper-text" />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFind}
                disabled={state.onLoading}
              >Buscar</Button>
            </Grid>
          </Grid>:
            <Grid container spacing={4}>
            <Grid item xs={12} sm={12} justify="flex-start">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleBack}
              >Volver</Button>
            </Grid>
              {((state.subsidiaries ===null)?null:state.subsidiaries.map(subsidiary => (
                <Grid item key={subsidiary.local_id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={"https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAoJQOEIPySyBb6s3vVDUD2EimsSVjPE4M&center=" + subsidiary.local_lat + "," + subsidiary.local_lng + "&zoom=13&scale=1&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7C" + subsidiary.local_lat + "," + subsidiary.local_lng}
                      title={subsidiary.local_nombre}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {subsidiary.local_nombre}
                      </Typography>
                      <Typography>Dirección: {subsidiary.local_direccion}</Typography>
                      <Typography>Telefono: <Link href={'tel:'+subsidiary.local_telefono}>{subsidiary.local_telefono}</Link></Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )))}
              {state.subsidiaries.length > 6?
                <Grid item xs={12} sm={12}>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBack}
                  >Volver</Button>
                </Grid>:null}
            </Grid>
          }
        </Paper>
      </Container>

      <Typography className={classes.copyright} variant="body2" color="textSecondary" align="center">
        <Link color="inherit" href="https://material-ui.com/">© Victor Palma {new Date().getFullYear()}.</Link>
      </Typography>
    </div>
  );
}

export default App;
