import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [user])

    socket.on('ride-confirmed', ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } })
    })

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePanel])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])

    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setFare(response.data)
    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            {/* Header con logo y menú hamburguesa */}
            <div className='absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4 sm:p-5'>
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
                                <div className='h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center'>
                                    <i className="ri-user-line text-2xl text-gray-600"></i>
                                </div>
                                <div>
                                    <h3 className='font-semibold text-lg'>{user?.fullname?.firstname} {user?.fullname?.lastname}</h3>
                                    <p className='text-sm text-gray-500'>{user?.email}</p>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <button 
                                    onClick={() => {
                                        navigate('/user-profile')
                                        setMenuOpen(false)
                                    }}
                                    className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'
                                >
                                    <i className="ri-user-settings-line text-xl"></i>
                                    <span>Editar Perfil</span>
                                </button>

                                <button className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'>
                                    <i className="ri-history-line text-xl"></i>
                                    <span>Historial de Viajes</span>
                                </button>

                                <button className='w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-all'>
                                    <i className="ri-wallet-line text-xl"></i>
                                    <span>Métodos de Pago</span>
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
                                    onClick={() => navigate('/user-logout')}
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

            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>

            <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-4 sm:p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-4 sm:right-6 top-4 sm:top-6 text-2xl cursor-pointer'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-xl sm:text-2xl font-semibold'>Buscar un viaje</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-base sm:text-lg rounded-lg w-full'
                            type="text"
                            placeholder='¿Dónde te recogemos?'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-base sm:text-lg rounded-lg w-full mt-3'
                            type="text"
                            placeholder='¿A dónde vas?' 
                        />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 sm:py-3 rounded-lg mt-3 w-full font-medium hover:bg-gray-800 transition-all'>
                        Buscar Viaje
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0 overflow-y-auto'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 sm:px-4 py-6 sm:py-10 pt-8 sm:pt-12 max-h-[80vh] overflow-y-auto'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} 
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehiclePanel={setVehiclePanel} 
                />
            </div>

            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 sm:px-4 py-4 sm:py-6 pt-8 sm:pt-12 max-h-[80vh] overflow-y-auto'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehicleFound={setVehicleFound} 
                />
            </div>

            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 sm:px-4 py-4 sm:py-6 pt-8 sm:pt-12 max-h-[80vh] overflow-y-auto'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} 
                />
            </div>

            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white px-3 sm:px-4 py-4 sm:py-6 pt-8 sm:pt-12 max-h-[80vh] overflow-y-auto'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} 
                />
            </div>
        </div>
    )
}

export default Home