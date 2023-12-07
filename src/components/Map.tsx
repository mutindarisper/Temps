import React, { useEffect, useRef, useState } from 'react';
import { Button, Typography, Container, Grid, Paper, TextField, } from '@mui/material';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import axios from 'axios';
import './Map.css'
import markerIcon from '../assets/marker.svg'
import { CloudOutlined, Opacity, AirOutlined, Compress} from '@mui/icons-material';
import pressure from '../assets/heat.svg'





const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'temperature' | 'elevation'>('temperature');
  
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [height, setHeight] = useState<string >('');
  const [cloudDetail, setCloudDetail] = useState<string >('');
  const [humidity, setHumidity] =useState<string >('');
  const [wind, setWind] = useState<string >('');
  const [airPressure, setAirPressure] = useState<string >('');
  const [temperatureCelcius, setTemperatureCelcius] = useState<number>()
  const [placeName, setplaceName] = useState<string >('');
  const [date, setDate] = useState<string >('');

  const API_KEY = 'c8de53bec21fd6904f961b4f2759445a'


  // const milliseconds = 1701900784

  // const date = new Date(milliseconds);
  // console.log(date)


  const handleTabChange = (tab: 'temperature' | 'elevation') => {
    setActiveTab(tab);
  };
  const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Validate and set the number value
    const inputValue = event.target.value;
    console.log(inputValue)
    if (!isNaN(Number(inputValue))) {
      setLatitude(Number(inputValue));
    }
  };

  const handleLongitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Validate and set the number value
    const inputValue = event.target.value;
    if (!isNaN(Number(inputValue))) {
      setLongitude(Number(inputValue));
    }
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Validate and set the number value
    const inputValue = event.target.value;
    if (!isNaN(Number(inputValue))) {
      setHeight(Number(inputValue));
    }
  };
  const fetchTempData = async () => {

    try {
      const tempResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
      console.log(tempResponse.data)

      setCloudDetail(tempResponse.data.clouds.all)
      setHumidity(tempResponse.data.main.humidity)
      setWind(tempResponse.data.wind.speed)
      setAirPressure(tempResponse.data.main.pressure)
      setTemperatureCelcius(Math.trunc(tempResponse.data.main.temp - 273.15))
      setplaceName(tempResponse.data.name)
      const milliseconds = tempResponse.data.dt

  const datenew = new Date(milliseconds * 1000 );
  console.log(datenew.toUTCString())
  setDate(datenew.toUTCString())

  var code = tempResponse.data.weather[0].icon
  console.log(code)


  // const getWeatherIcon = (code: string) => { new Date(timestamp * 1000)
  //   switch (code) {
  //     case '02n':
  //       return <CloudOutlined />; // Use the appropriate icon component for each code
  //     // Add more cases for other weather conditions
  //     default:
  //       return null; // Return null or a default icon for unknown codes
  //   }
  // };



      const customIcon = L.icon({
        iconUrl: markerIcon, // Path to your custom marker image
        iconSize: [40, 40], // Set the size of the icon
        iconAnchor: [20, 40] // Set the anchor point of the icon
      });


      // Add a marker to the map at a specific location
      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current)
      //.addTo(mapRef.current);
      mapRef.current.flyTo([latitude, longitude], 15);

      // You can also add a popup to the marker if needed
      marker.bindPopup(`<b>Placename:</b> ${tempResponse.data.name}<br>
    <b>Temperature:</b> ${(tempResponse.data.main.temp - 273.15).toFixed(2)} °C <br>
    <b>Weather:</b> ${tempResponse.data.weather[0].main}<br> `)
      //.openPopup();

    } catch (error) {

    }

  }


  const fetchHeightData = () => {

  }

  useEffect(() => {
    if (mapRef.current !== undefined && mapRef.current !== null) { mapRef.current.remove() }

    // Initialize the map
    mapRef.current = L.map("map").setView([-1.2, 30.8], 3);

    // Add a tile layer to the map (you can use different tile providers)
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(mapRef.current);

    // Initialize the geocoding control
    const provider = new OpenStreetMapProvider();
    const searchControl = GeoSearchControl({
      provider,
      autoComplete: true,
      style: 'bar',
      autoClose: true,
      keepResult: true
    });

    mapRef.current.addControl(searchControl);
    // Set z-index for search control elements
    const searchContainer = document.querySelector('.leaflet-control-geosearch') as HTMLElement;
    if (searchContainer) {
      searchContainer.style.zIndex = '1000';
    }

  }, []);

  return (
    <Container maxWidth="lg">

      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Paper style={{ height: '99vh', overflow: 'hidden', width: '98vw', position: 'absolute', top: '1vh' }}>
            {/* Top div with map */}
            <div style={{}}>
              {/* Your map component */}
              {/* Replace this with your actual map component */}
              <div id="map" style={{ width: '100%', height: '97vh', zIndex: 100 }}>

              </div>

              <div>

                <div className='selections' style={{ width: '30vw', height: '97vh', position: 'absolute', top: 0, left: '70vw', zIndex: 150 }}>
                  <div style={{ color: '#fff', padding: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '7rem', color: '#fff', padding: '20px' }}>
                      <Typography
                        onClick={() => handleTabChange('temperature')}
                        style={{
                          borderBottom: activeTab === 'temperature' ? '2px solid #fff' : 'none',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }}
                      >
                        Temperature
                      </Typography>
                      <Typography
                        onClick={() => handleTabChange('elevation')}
                        style={{
                          borderBottom: activeTab === 'elevation' ? '2px solid #fff' : 'none',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }}
                      >
                        Elevation
                      </Typography>
                    </div>
                    {activeTab === 'temperature' && (
                      <div>
                        {/* Content for temperature tab  number === '' ? '' : number */}
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                          <span>Lat</span>
                          <TextField
                            style={{ backgroundColor: '#FFFFFF', borderRadius: '5px' }}
                            type="number"

                            value={latitude}
                            onChange={handleLatitudeChange}
                            variant="filled"
                            InputLabelProps={{
                              shrink: true,

                            }}
                          />

                        </div>
                        <br />

                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                          <span>Lon</span>
                          <TextField
                            style={{ backgroundColor: '#FFFFFF', borderRadius: '5px' }}
                            type="number"

                            value={longitude}
                            onChange={handleLongitudeChange}
                            variant="filled"
                            InputLabelProps={{
                              shrink: true,

                            }}
                          />

                        </div>
                        <br />

                        <Button variant="contained" color="primary" style={{
                          textTransform: 'none',
                          marginLeft: '46px',
                          width: '226px',
                          height: '55px',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }}
                          onClick={fetchTempData}
                        >Fetch Data</Button>

                        <div style={{
                          width: '26vw',
                          height: 0,
                          border: '.5px gray solid',
                          marginTop: '50px'
                        }

                        } className="separator"></div>

                        <Typography

                          style={{

                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: '600'
                          }}
                        >
                          Weather details
                        </Typography>
                        <div className="weather_items" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                          <div className="weather_cloudy" style={{ display: 'flex', flexDirection: 'row', gap: '12rem' }}>

                            <div className="cloudy" style={{ display: 'flex', flexDirection: 'row' }}>
                              <Typography

                                style={{
                                  padding: '8px 16px',
                                  cursor: 'pointer',
                                  fontSize: '20px',
                                  fontWeight: '500'
                                }}
                              >
                                Cloudy
                              </Typography>
                              <CloudOutlined style={{ marginTop: '12px' }} />

                            </div>
                            <p>{cloudDetail}%</p>

                          </div>

                          <div className="weather_humidity" style={{ display: 'flex', flexDirection: 'row', gap: '12rem' }}>

                            <div className="humid" style={{ display: 'flex', flexDirection: 'row' }}>
                              <Typography

                                style={{
                                  padding: '8px 16px',
                                  cursor: 'pointer',
                                  fontSize: '20px',
                                  fontWeight: '500'
                                }}
                              >
                                Humidity
                              </Typography>
                              <Opacity style={{ marginTop: '12px' }} />

                            </div>
                            <p>{humidity} %</p>

                          </div>


                          <div className="weather_cloudy" style={{ display: 'flex', flexDirection: 'row', gap: '12rem' }}>

                            <div className="cloudy" style={{ display: 'flex', flexDirection: 'row' }}>
                              <Typography

                                style={{
                                  padding: '8px 16px',
                                  cursor: 'pointer',
                                  fontSize: '20px',
                                  fontWeight: '500'
                                }}
                              >
                                Wind
                              </Typography>
                              <AirOutlined style={{ marginTop: '12px' }} />

                            </div>
                            <p>{wind} m/s</p>

                          </div>


                          <div className="weather_cloudy" style={{ display: 'flex', flexDirection: 'row', gap: '12rem' }}>

                            <div className="cloudy" style={{ display: 'flex', flexDirection: 'row' }}>
                              <Typography

                                style={{
                                  padding: '8px 16px',
                                  cursor: 'pointer',
                                  fontSize: '20px',
                                  fontWeight: '500'
                                }}
                              >
                                Pressure
                              </Typography>
                              <Compress style={{ marginTop: '12px' }} />
                              {/* < img src={pressure} style={{ marginTop: '1px' }} /> */}

                            </div>
                            <p>{airPressure} hPa</p>

                          </div>


                        </div>





                      </div>
                    )}
                    {activeTab === 'elevation' && (
                      <div>
                        {/* Content for temperature tab */}
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                          <span>Lat</span>

                          <TextField
                            style={{ backgroundColor: '#FFFFFF', borderRadius: '5px', marginLeft: '20px' }}
                            type="number"

                            value={latitude}
                            onChange={handleLatitudeChange}
                            variant="filled"
                            InputLabelProps={{
                              shrink: true,

                            }}
                          />

                        </div>
                        <br />

                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                          <span>Lon</span>

                          <TextField
                            style={{ backgroundColor: '#FFFFFF', borderRadius: '5px', marginLeft: '20px' }}
                            type="number"

                            value={longitude}
                            onChange={handleLongitudeChange}
                            variant="filled"
                            InputLabelProps={{
                              shrink: true,

                            }}
                          />

                        </div>

                        <br />

                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                          <span>Height</span>
                          <TextField
                            style={{ backgroundColor: '#FFFFFF', borderRadius: '5px' }}
                            type="number"
                            label="Enter height in meters"
                            value={height}
                            onChange={handleHeightChange}
                            variant="filled"
                            InputLabelProps={{
                              shrink: true,

                            }}
                          />

                        </div>
                        <br />

                        <Button variant="contained"
                          color="primary"
                          style={{
                            textTransform: 'none',
                            marginLeft: '65px',
                            width: '226px',
                            height: '55px',
                            fontSize: '20px',
                            fontWeight: 'bold'
                          }}
                          onClick={fetchHeightData}
                        >Fetch Data</Button>

                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Bottom div with statistics */}
              <div>

                <div className='stats' style={{ width: '71.5%', height: '31vh', position: 'absolute', top: '66vh', zIndex: 150 }}>
                {activeTab === 'temperature' && (
                  <div style={{color:'#fff'}}>

                    <div style={{ display:'flex', flexDirection:'row'}}>

                    <Typography
                      style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '98px',
                        fontWeight: '500',
                        marginTop: '5vh' 
                      }}
                    
                    >
                      {temperatureCelcius}°

                    </Typography>
                    {/* <br/> */}
                    <div style={{display:'flex', flexDirection:'column', gap:'-8vh',   marginTop: '8vh' }}>
                    <Typography
                      style={{
                        padding: '0px',
                        cursor: 'pointer',
                        fontSize: '30px',
                        fontWeight: '500',
                        marginTop: '20px' 
                      }}
                    
                    >
                      {placeName} 

                    </Typography>
                    <br />
                    <Typography
                      style={{
                        padding: '0px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        fontWeight: '500',
                        marginTop: '-3vh' 
                      }}
                    
                    >
                      {date} 

                    </Typography>

                    </div>
                  
                      
                    </div>
                    
                  </div>
                )}


                </div>
              </div>
            </div>




          </Paper>

        </Grid>



      </Grid>


      {/* <Typography variant="h1" align="center">
        Map Component
        
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button> to be used later */}
    </Container>
  )
}

export default Map