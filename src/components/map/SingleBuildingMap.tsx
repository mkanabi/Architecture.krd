// src/components/map/SingleBuildingMap.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Building, Language } from '@/types';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface SingleBuildingMapProps {
  building: Building;
  language: Language;
}

const SingleBuildingMap: React.FC<SingleBuildingMapProps> = ({
  building,
  language
}) => {
  // Center on the building's coordinates
  const position = [building.coordinates.lat, building.coordinates.lng];
  
  // Create custom marker icon
  const customIcon = new Icon({
    iconUrl: '/marker-icon.png', // Make sure you have this file in your public folder
    iconSize: [25, 25],
    iconAnchor: [12, 41]
  });

  return (
    <MapContainer
      center={position as [number, number]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
     <TileLayer
               url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}"
               attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               ext="png"
             />
      <Marker position={position as [number, number]} icon={customIcon}>
        <Popup>
          <div className="font-mono">
            <h3 className="text-lg font-bold">{building.translations[language].title}</h3>
            <p className="text-sm">{building.translations[language].location}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default SingleBuildingMap;