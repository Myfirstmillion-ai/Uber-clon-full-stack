import React, { useState } from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {
    const [loadingLocation, setLoadingLocation] = useState(false)

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
    }

    const handleCurrentLocation = async () => {
        if (activeField !== 'pickup') {
            alert('Este botón solo funciona para el punto de recogida')
            return
        }

        setLoadingLocation(true)

        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización')
            setLoadingLocation(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                
                try {
                    // Usar geocoding reverso para obtener la dirección
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
                    )
                    const data = await response.json()
                    
                    if (data.results && data.results[0]) {
                        const address = data.results[0].formatted_address
                        setPickup(address)
                        setPanelOpen(false)
                    } else {
                        setPickup(`${latitude}, ${longitude}`)
                        setPanelOpen(false)
                    }
                } catch (error) {
                    console.error('Error al obtener dirección:', error)
                    setPickup(`${latitude}, ${longitude}`)
                    setPanelOpen(false)
                }
                
                setLoadingLocation(false)
            },
            (error) => {
                console.error('Error al obtener ubicación:', error)
                alert('No se pudo obtener tu ubicación. Verifica los permisos de ubicación.')
                setLoadingLocation(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
    }

    return (
        <div>
            {/* Botón de Usar Ubicación Actual */}
            {activeField === 'pickup' && (
                <button
                    onClick={handleCurrentLocation}
                    disabled={loadingLocation}
                    className='flex gap-4 items-center justify-center w-full p-4 mb-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md'
                >
                    {loadingLocation ? (
                        <>
                            <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                            </svg>
                            <span>Obteniendo ubicación...</span>
                        </>
                    ) : (
                        <>
                            <i className="ri-map-pin-user-fill text-xl"></i>
                            <span>Usar mi ubicación actual</span>
                        </>
                    )}
                </button>
            )}

            {/* Sugerencias */}
            {suggestions && suggestions.length > 0 && (
                <div className='mb-2'>
                    <h5 className='text-xs font-semibold text-gray-500 mb-2 px-2'>SUGERENCIAS</h5>
                </div>
            )}

            {suggestions.map((elem, idx) => (
                <div 
                    key={idx} 
                    onClick={() => handleSuggestionClick(elem)} 
                    className='flex gap-4 border-2 p-3 border-gray-50 active:border-black hover:bg-gray-50 rounded-xl items-center my-2 justify-start cursor-pointer transition-all'
                >
                    <h2 className='bg-[#eee] h-10 w-10 flex items-center justify-center rounded-full flex-shrink-0'>
                        <i className="ri-map-pin-fill text-gray-600"></i>
                    </h2>
                    <h4 className='font-medium text-sm flex-1'>{elem}</h4>
                </div>
            ))}

            {suggestions && suggestions.length === 0 && !loadingLocation && (
                <div className='text-center py-8 text-gray-400'>
                    <i className="ri-search-line text-3xl mb-2"></i>
                    <p className='text-sm'>Escribe para buscar direcciones</p>
                </div>
            )}
        </div>
    )
}

export default LocationSearchPanel