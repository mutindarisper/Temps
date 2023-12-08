import React, { useEffect, useRef, useState } from 'react';
import { Button, Typography, Container, Grid, Paper, TextField, } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import axios from 'axios';
import './Map.css'
import markerIcon from '../assets/marker.svg'
import { CloudOutlined, Opacity, AirOutlined, Compress, QueryBuilder, Landscape, AspectRatio, Language} from '@mui/icons-material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Chart from 'chart.js'






const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'temperature' | 'elevation'>('temperature');

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [height, setHeight] = useState<string>('');
  const [cloudDetail, setCloudDetail] = useState<string>('');
  const [humidity, setHumidity] = useState<string>('');
  const [wind, setWind] = useState<string>('');
  const [airPressure, setAirPressure] = useState<string>('');
  const [temperatureCelcius, setTemperatureCelcius] = useState<number>()
  const [placeName, setplaceName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [tempData, setTempData] = useState<any>([]);
  const [tempLabels, setTempLabels] = useState<any>([])
  const tempRef = useRef<number>()

  const [unit, setUnit] = useState('');
  const [elevation, setelevation] = useState<string>();
  const [acquisitionDate, setAcquisitionDate] = useState<string>('');
  const [spatialReference, setspatialReference] = useState<string>('');
  const [resolution, setResolution] = useState<string>('');
  const [heightData, setheightData] = useState<any>([]);
  const [heightLabels, setheightLabels] = useState<any>([]);


  const API_KEY = 'c8de53bec21fd6904f961b4f2759445a'


  const formatData = (data: number[], backgroundColor: string): Chart.ChartData => ({
    labels:activeTab === 'temperature' ? tempLabels : heightLabels,
    datasets: [{ data, backgroundColor, }],
  });

  const chartRef = useRef<Chart | null>(null);

  const canvasCallback = (canvas: HTMLCanvasElement | null) => { 
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: "bar",
        data: formatData(activeTab === 'temperature' ? tempData: heightData, '#fff'),

        options: {
          responsive: true,
          plugins: {
            // Add background color here
            legend: false
          }
        }
      });
    }
  };


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

 

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUnit(event.target.value as string);
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
      // tempRef.current = Math.trunc(tempResponse.data.main.temp - 273.15)
      setplaceName(tempResponse.data.name)
      const milliseconds = tempResponse.data.dt

      const datenew = new Date(milliseconds * 1000);
      console.log(datenew.toUTCString())
      setDate(datenew.toUTCString())

      var code = tempResponse.data.weather[0].icon
      console.log(code)

      const temp_labels = tempResponse.data.main
      const { temp_min, temp_max } = temp_labels;
      const new_data = { temp_min, temp_max }
      const temperature_labels = Object.keys(new_data)
      var temperature_values = Object.values(new_data)
      setTempData(temperature_values)
      setTempLabels(temperature_labels)

      console.log(Object.keys(new_data))
      console.log(Object.values(new_data))




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


  const fetchHeightData = async () => {
    try {
      const elevationResponse = await axios.get(`https://epqs.nationalmap.gov/v1/json?x=${latitude}&y=${longitude}&wkid=4326&units=${unit}&includeDate=true&format=application/json`)
console.log(elevationResponse.data)
const elevation_value = Number(elevationResponse.data.value).toFixed(2)

setelevation(elevation_value)
setAcquisitionDate(elevationResponse.data.attributes.AcquisitionDate)
setspatialReference(elevationResponse.data.location.spatialReference.latestWkid)
setResolution(elevationResponse.data.resolution)

var number_height = parseInt(elevation_value)
console.log(typeof(number_height))
setheightData([number_height])
setheightLabels(['Elevation'])
console.log(heightLabels)



const customIcon = L.icon({
  iconUrl: markerIcon, // Path to your custom marker image
  iconSize: [40, 40], // Set the size of the icon
  iconAnchor: [20, 40] // Set the anchor point of the icon
});

 // Add a marker to the map at a specific location
 const marker = L.marker([longitude, latitude, ], { icon: customIcon }).addTo(mapRef.current)
 //.addTo(mapRef.current);
 mapRef.current.flyTo([longitude, latitude ], 15);

 // You can also add a popup to the marker if needed
 marker.bindPopup(`<b>Elevation:</b> ${Number(elevationResponse.data.value).toFixed(2)} Metres<br>
<b>Acquisition date:</b> ${elevationResponse.data.attributes.AcquisitionDate} <br>
<b>Spatial Reference:</b> ${elevationResponse.data.location.spatialReference.latestWkid}<br> `)
    } catch (error) {

    }

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


    if (chartRef.current) {
      chartRef.current.data = formatData(activeTab === 'temperature' ? tempData : heightData, '#fff');
      chartRef.current.update();
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
                          <span>Units</span>
                          <FormControl fullWidth style={{ marginLeft: '9px'}}>
                            {/* <InputLabel id="select-label">Select Option</InputLabel> */}
                            <Select
                              labelId="select-label"
                              id="select"
                              value={unit}
                              label="Select unit"
                              style={{width:'220px', backgroundColor: '#FFFFFF', }}
                              onChange={handleChange}
                            >
                              <MenuItem value=""></MenuItem>
                              <MenuItem value="Meters">Meters</MenuItem>
                              <MenuItem value="Feet">Feet</MenuItem>
                             
                            </Select>
                          </FormControl>

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
                                Elevation
                              </Typography>
                              <Landscape style={{ marginTop: '12px' }} />

                            </div>
                            <p>{elevation} {unit}</p>

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
                                Resulution
                              </Typography>
                              <AspectRatio style={{ marginTop: '12px' }} />

                            </div>
                            <p>{resolution} </p>

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
                                Acquisition Date
                              </Typography>
                              <QueryBuilder style={{ marginTop: '12px' }} />

                            </div>
                            <p>{acquisitionDate}</p>

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
                                Spatial Reference
                              </Typography>
                              <Language style={{ marginTop: '12px' }} />
                              {/* < img src={pressure} style={{ marginTop: '1px' }} /> */}

                            </div>
                            <p>{spatialReference}</p>

                          </div>


                        </div>


                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Bottom div with statistics */}
              <div>

                <div className='stats' style={{ width: '71.5%', height: '31vh', position: 'absolute', top: '66vh', zIndex: 150 }}>
                  {activeTab === 'temperature' && (
                    <div style={{ color: '#fff', display: 'flex', flexDirection: 'row', gap: '8rem' }}>

                      <div style={{ display: 'flex', flexDirection: 'row' }}>

                        {
                          tempData.length !== 0 ?
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

                            </Typography> : ''


                        }


                        {/* <br/> */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '-8vh', marginTop: '8vh' }}>
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

                        {
                          tempData.length !== 0 ?
                            <div style={{ color: '#fff', marginLeft: '18vw' }}>
                              <h2>Temperature for {placeName}</h2>
                              <canvas ref={canvasCallback}></canvas>
                            </div> : <div style={{ marginTop: '10vh', marginLeft: '27vw', fontWeight: 500 }}>Input Latitude and Longitude</div>



                        }



                      </div>

                    </div>
                  )}
                  {
                    activeTab === 'elevation' && (
                      <div style={{ color: '#fff', display: 'flex', flexDirection: 'row', gap: '8rem' }}>
                        {
                          heightData.length !== 0 ? 
                            <div style={{ color: '#fff', display: 'flex', flexDirection: 'row',  }}>
                      

                          <Landscape  style={{ fontSize:'2rem',   marginTop: '13vh'}} />
                          <Typography
                            style={{
                              padding: '0px',
                              cursor: 'pointer',
                              fontSize: '50px',
                              fontWeight: '500',
                              marginTop: '10vh',
                              // marginLeft: '1vh'
                            }}

                          >
                            {elevation} {unit}

                          </Typography>

                        </div> : ''

                          


                        }

                        

                        {
                          heightData.length !== 0 ?
                            <div style={{ color: '#fff', marginLeft: '18vw' }}>
                              <h2>Elevation in {unit} </h2>
                              <canvas ref={canvasCallback}></canvas>
                            </div> : <div style={{ marginTop: '10vh', marginLeft: '27vw', fontWeight: 500 }}>Input Latitude and Longitude</div>



                        }

                      </div>

                    )
                  }


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