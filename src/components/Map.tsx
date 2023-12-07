import React, { useEffect, useRef, useState} from 'react';
import { Button, Typography, Container, Grid, Paper } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css'



const Map: React.FC = () => { 
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'temperature' | 'elevation'>('temperature');
  
  
  
 const milliseconds = 1701900784
  
  const date = new Date(milliseconds);
  console.log(date)


  const handleTabChange = (tab: 'temperature' | 'elevation') => {
    setActiveTab(tab);
  };


  useEffect(() => {
    if(mapRef.current !== undefined && mapRef.current !== null){mapRef.current.remove()}
    
      // Initialize the map
      mapRef.current = L.map("map").setView([-1.2, 30.8], 3);

      // Add a tile layer to the map (you can use different tile providers)
      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }).addTo(mapRef.current);
  
  }, []);

  return (
    <Container maxWidth="lg">

<Grid container spacing={2}>
      {/* Left Column */}
      <Grid item xs={12} md={8}>
        <Paper style={{ height: '99vh', overflow:'hidden',  width:'98vw' , position:'absolute', top:'1vh' }}>
          {/* Top div with map */}
          <div style={{ }}>
            {/* Your map component */}
            {/* Replace this with your actual map component */}
            <div id="map" style={{ width: '100%', height: '97vh', zIndex:100 }}>
              
            </div>

            <div>
         
         <div className='selections' style={{ width: '30vw', height: '97vh', position:'absolute', top:0, left:'70vw', zIndex:150}}>
         <div style={{ color:'#fff', padding:'20px'}}>
      <div style={{display:'flex', flexDirection:'row', gap:'7rem', color:'#fff', padding:'20px'}}>
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
          {/* Content for temperature tab */}
          <p>Temperature Content</p>
        </div>
      )}
      {activeTab === 'elevation' && (
        <div>
          {/* Content for elevation tab */}
          <p>Elevation Content</p>
        </div>
      )}
    </div>
         </div>
       </div>
             {/* Bottom div with statistics */}
          <div>
         
            <div className='stats' style={{ width: '71.5%', height: '31vh', position:'absolute', top:'66vh', zIndex:150}}>
              
              
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