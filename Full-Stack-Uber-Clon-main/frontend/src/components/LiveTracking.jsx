import React, { useState, useEffect } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '100%',
};

// Coordenadas de San Antonio del Táchira, Venezuela
// Centro de la zona de operación en la frontera
const defaultCenter = {
    lat: 7.8134,  // San Antonio del Táchira
    lng: -72.4407
};

// Límites aproximados de la zona de operación
// Incluye: Cúcuta, Villa del Rosario, Los Patios, Chinácota, San Antonio, Ureña, etc.
const operationBounds = {
    north: 8.0,    // Límite norte (aprox. norte de Cúcuta)
    south: 7.6,    // Límite sur (aprox. sur de San Cristóbal)
    east: -72.2,   // Límite este
    west: -72.6    // Límite oeste
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [hasUserLocation, setHasUserLocation] = useState(false);

    useEffect(() => {
        // Intentar obtener la ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Verificar si la ubicación está dentro de la zona de operación
                    const isInOperationZone = 
                        latitude >= operationBounds.south &&
                        latitude <= operationBounds.north &&
                        longitude >= operationBounds.west &&
                        longitude <= operationBounds.east;

                    if (isInOperationZone) {
                        const userLocation = {
                            lat: latitude,
                            lng: longitude
                        };
                        setCurrentPosition(userLocation);
                        setMapCenter(userLocation);
                        setHasUserLocation(true);
                    } else {
                        // Si está fuera de la zona, mantener San Antonio del Táchira como centro
                        console.log('Usuario fuera de la zona de operación');
                        setMapCenter(defaultCenter);
                    }
                },
                (error) => {
                    console.error('Error al obtener ubicación:', error);
                    // Mantener San Antonio del Táchira como centro por defecto
                    setMapCenter(defaultCenter);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );

            // Actualizar la ubicación cada 10 segundos solo si el usuario está en la zona
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    const isInOperationZone = 
                        latitude >= operationBounds.south &&
                        latitude <= operationBounds.north &&
                        longitude >= operationBounds.west &&
                        longitude <= operationBounds.east;

                    if (isInOperationZone) {
                        setCurrentPosition({
                            lat: latitude,
                            lng: longitude
                        });
                        setHasUserLocation(true);
                    }
                },
                (error) => {
                    console.error('Error al rastrear ubicación:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 30000 // 30 segundos
                }
            );

            return () => {
                if (watchId) {
                    navigator.geolocation.clearWatch(watchId);
                }
            };
        } else {
            console.log('Geolocalización no soportada');
            setMapCenter(defaultCenter);
        }
    }, []);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={hasUserLocation ? 15 : 13}
                options={{
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ],
                    restriction: {
                        latLngBounds: operationBounds,
                        strictBounds: false
                    }
                }}
            >
                {hasUserLocation && (
                    <Marker 
                        position={currentPosition}
                        icon={{
                            path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                            scale: 8,
                            fillColor: "#4285F4",
                            fillOpacity: 1,
                            strokeColor: "#ffffff",
                            strokeWeight: 3
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    )
}

export default LiveTracking