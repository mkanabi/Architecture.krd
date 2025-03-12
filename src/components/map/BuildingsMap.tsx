import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Building, Language } from '@/types';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

interface BuildingsMapProps {
  buildings: Building[];
  language: Language;
  onBuildingSelect?: (building: Building) => void;
}

const BuildingsMap: React.FC<BuildingsMapProps> = ({
  buildings,
  language,
  onBuildingSelect
}) => {
  // Center the map on Kurdistan region
  const defaultCenter = { lat: 36.204824, lng: 44.009924 };
  const defaultZoom = 8;

  // Create custom marker icon
  const customIcon = new Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 25],
    iconAnchor: [12, 41]
  });

  return (
    <div className="h-[600px] border-4 border-black">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full"
      >
      <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}"
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          ext="png"
        />
        
        {buildings.map((building) => (
          <Marker
            key={building.id}
            position={building.coordinates}
            icon={customIcon}
            eventHandlers={{
              click: () => onBuildingSelect?.(building)
            }}
          >
            <Popup>
              <div className="font-mono">
                <h3 className="text-lg font-bold">
                  {building.translations[language].title}
                </h3>
                <p className="text-sm">
                  {building.translations[language].location}
                </p>
                <p className="text-sm mt-2">
                  {building.period}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BuildingsMap;