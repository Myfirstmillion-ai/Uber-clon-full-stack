import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [currentPosition, setCurrentPosition] = useState({
        lat: 7.8134,  // San Antonio del Táchira por defecto
        lng: -72.4407
    })

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ride, setRide] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)
    const navigate = useNavigate()

    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const newPosition = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        
                        setCurrentPosition(newPosition);

                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: {
                                ltd: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        })
                    },
                    error => {
                        console.error('Error al obtener ubicación:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                )
            }
        }

        // Actualizar ubicación cada 30 segundos (más razonable que 10 segundos)
        const locationInterval = setInterval(updateLocation, 30000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [captain._id])

    socket.on('new-ride', (data) => {
        setRide(data)
        setRidePopupPanel(true)
    })

    async function confirmRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    const mapContainerStyle = {
        width: '100%',
        height: '100%',
    };

    return (
        <div className='h-screen flex flex-col'>
            {/* Header */}
            <div className='fixed p-4 sm:p-6 top-0 flex items-center justify-between w-full z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm'>
                <img className='w-12 sm:w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Logo" />
                
                <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className='h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all'
                >
                    <i className="ri-menu-line text-xl"></i>
                </button>
            </div>

            {/* Menú lateral */}
            {menuOpen && (
                <>
                    <div 
                        className='fixed inset-0 bg-black bg-opacity-50 z-20'
                        onClick={() => setMenuOpen(false)}
                    ></div>
                    <div className='fixed right-0 top-0 h-full w-64 sm:w-80 bg-white z-30 shadow-2xl p-6 overflow-y-auto'>
                        <button 
                            onClick={() => setMenuOpen(false)}
                            className='absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100'
                        >
                            <i className="ri-close-line text-xl"></i>
                        </button>
                        
                        <div className='mt-12'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='h-16 w-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center'>
                                    <i className="ri-steering-2-fill text-2xl text-white"></i>
                                </div>
                                <div>
                                    <h3 className='font-semibold text-lg'>
                                        {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                                    </h3>
                                    <p className='text-sm text-gray-500'>{captain?.email}</p>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <button 
                                    onClick={() => {
                                        navigate('/captain-profile')
                                        setMenuOpen(false)
                                    }}
                                    className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'
                                >
                                    <i className="ri-user-settings-line text-xl"></i>
                                    <span>Editar Perfil</span>
                                </button>

                                <button className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'>
                                    <i className="ri-car-line text-xl"></i>
                                    <span>Mi Vehículo</span>
                                </button>

                                <button className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'>
                                    <i className="ri-history-line text-xl"></i>
                                    <span>Historial de Viajes</span>
                                </button>

                                <button className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'>
                                    <i className="ri-money-dollar-circle-line text-xl"></i>
                                    <span>Ganancias</span>
                                </button>

                                <button className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'>
                                    <i className="ri-settings-line text-xl"></i>
                                    <span>Configuración</span>
                                </button>

                                <button className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'>
                                    <i className="ri-question-line text-xl"></i>
                                    <span>Ayuda</span>
                                </button>

                                <button 
                                    onClick={() => navigate('/captain-logout')}
                                    className='w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-all mt-4'
                                >
                                    <i className="ri-logout-box-line text-xl"></i>
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Mapa con Google Maps */}
            <div className='flex-1 mt-16 sm:mt-20'>
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={currentPosition}
                        zoom={15}
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
                            ]
                        }}
                    >
                        <Marker 
                            position={currentPosition}
                            icon={{
                                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                                scale: 10,
                                fillColor: "#FF6B00",
                                fillOpacity: 1,
                                strokeColor: "#ffffff",
                                strokeWeight: 3
                            }}
                        />
                    </GoogleMap>
                </LoadScript>
            </div>

            {/* Panel de detalles del conductor */}
            <div className='p-4 sm:p-6 bg-white border-t'>
                <CaptainDetails />
            </div>

            {/* Popup de nueva solicitud de viaje */}
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 sm:px-4 py-6 sm:py-10 pt-8 sm:pt-12 max-h-[80vh] overflow-y-auto'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* Popup de confirmación de viaje */}
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 sm:px-4 py-6 sm:py-10 pt-8 sm:pt-12 overflow-y-auto'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
                    setRidePopupPanel={setRidePopupPanel} 
                />
            </div>
        </div>
    )
}

export default CaptainHome