import { GoogleMap, Marker, InfoWindow, useJsApiLoader,DirectionsRenderer,} from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import axios from 'axios';
  
const MapComponent = () => {
    const [locations, setLocations] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: -29.8587, lng: 31.0218 }); // Default Durban
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [directions, setDirections] = useState(null);
    const [workerLocation, setWorkerLocation] = useState(null);
  
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: 'AIzaSyC9jEINsXbkly2I3jIyNH8eHJ6J19De-2w',
    });
  
    useEffect(() => {
      const fetchAddresses = async () => {
        try {
          const response = await axios.get('http://localhost:3000/user/addresses');
          const fetchedData = response.data;
  
          const geocodedData = await Promise.all(
            fetchedData.map(async (item) => {
              const geocodeRes = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(item.address)}&key=AIzaSyC9jEINsXbkly2I3jIyNH8eHJ6J19De-2w`
              );
              const geocodeData = await geocodeRes.json();
              if (geocodeData.status === 'OK') {
                const { lat, lng } = geocodeData.results[0].geometry.location;
                return { ...item, lat, lng };
              } else {
                return null;
              }
            })
          );
  
          const validMarkers = geocodedData.filter(item => item !== null);
  
          const workerLocationStr = sessionStorage.getItem('workerLocation');
          if (workerLocationStr) {
            const parsedLoc = JSON.parse(workerLocationStr);
            const worker = {
              name: "You (Worker)",
              description: "Your current location",
              lat: parsedLoc.lat,
              lng: parsedLoc.lng,
            };
            validMarkers.push(worker);
            setWorkerLocation(worker);
            setMapCenter({ lat: parsedLoc.lat, lng: parsedLoc.lng });
          }
  
          setLocations(validMarkers);
        if (workerLocation) {
            const parsedLoc = JSON.parse(workerLocation);
            setMapCenter({ lat: parsedLoc.lat, lng: parsedLoc.lng });
            } else if (validMarkers.length > 0) {
            setMapCenter({ lat: validMarkers[0].lat, lng: validMarkers[0].lng });
            }
              
        } catch (err) {
          console.error('Error loading map data:', err);
        }
      };
  
      fetchAddresses();
    }, []);

    const handleAccept = (userLocation) => {
        if (!workerLocation) {
          alert("Worker location not available");
          return;
        }
      
        const origin = `${workerLocation.lat},${workerLocation.lng}`;
        const destination = `${userLocation.lat},${userLocation.lng}`;
      
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
      
        // 👉 Opens the navigation in the current tab
        window.location.href = url;
      };
      
  
    const mapStyles = {
      height: "500px",
      width: "75%",
      position: 'absolute',
      left: '13%',
      bottom: '-10rem',
    };
  
    return isLoaded ? (
      <GoogleMap
        mapContainerStyle={mapStyles}
        center={mapCenter}
        zoom={12}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={`${location.name}: ${location.description}`}
            icon={location.name === "You (Worker)" ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" : undefined}
            onClick={() =>
              location.name !== "You (Worker)" && setSelectedMarker(location)
            }
          />
        ))}
  
        {/* InfoWindow for selected user */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h3>{selectedMarker.name}</h3>
              <p>{selectedMarker.description}</p>
              <button onClick={() => handleAccept(selectedMarker)}>Accept</button>
              <button onClick={() => setSelectedMarker(null)}>Decline</button>
            </div>
          </InfoWindow>
        )}
  
        {/* Render directions if available */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    ) : (
      <div>Loading Map...</div>
    );
};
  
  export default MapComponent;
  

