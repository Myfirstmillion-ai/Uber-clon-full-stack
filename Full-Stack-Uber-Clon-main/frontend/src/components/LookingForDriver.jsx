import React, { useState } from 'react'

const LookingForDriver = (props) => {
    const [cancelling, setCancelling] = useState(false)

    const handleCancelRide = () => {
        if (window.confirm('¿Estás seguro de que quieres cancelar el viaje?')) {
            setCancelling(true)
            // Aquí puedes agregar la lógica para cancelar el viaje en el backend
            setTimeout(() => {
                props.setVehicleFound(false)
                setCancelling(false)
            }, 500)
        }
    }

    return (
        <div className='p-4'>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}>
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <div className='flex flex-col items-center mt-4 mb-6'>
                <div className='relative'>
                    <div className='animate-ping absolute h-20 w-20 rounded-full bg-yellow-400 opacity-20'></div>
                    <div className='relative h-20 w-20 rounded-full bg-yellow-400 flex items-center justify-center'>
                        <i className="ri-taxi-line text-3xl text-white"></i>
                    </div>
                </div>
                <h3 className='text-2xl font-semibold mt-4 mb-2'>Buscando conductor...</h3>
                <p className='text-sm text-gray-500'>Esto tomará solo unos segundos</p>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center bg-gray-50 rounded-xl p-4'>
                <img className='h-16 mb-2' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_638/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Moto" />
                
                <div className='w-full mt-3'>
                    <div className='flex items-center gap-4 p-3 bg-white rounded-lg mb-2'>
                        <div className='h-10 w-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <i className="ri-map-pin-user-fill text-green-600"></i>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <h3 className='text-sm font-semibold text-gray-700'>Recogida</h3>
                            <p className='text-xs text-gray-600 truncate'>{props.pickup}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-3 bg-white rounded-lg mb-2'>
                        <div className='h-10 w-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <i className="ri-map-pin-2-fill text-red-600"></i>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <h3 className='text-sm font-semibold text-gray-700'>Destino</h3>
                            <p className='text-xs text-gray-600 truncate'>{props.destination}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-3 bg-white rounded-lg'>
                        <div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <i className="ri-money-dollar-circle-fill text-blue-600"></i>
                        </div>
                        <div className='flex-1'>
                            <h3 className='text-sm font-semibold text-gray-700'>Tarifa</h3>
                            <p className='text-lg font-bold text-gray-900'>
                                ${props.fare[props.vehicleType]?.toLocaleString('es-CO')} COP
                            </p>
                            <p className='text-xs text-gray-500'>Pago en efectivo</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón de Cancelar Viaje */}
            <button
                onClick={handleCancelRide}
                disabled={cancelling}
                className='w-full mt-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2'
            >
                {cancelling ? (
                    <>
                        <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        Cancelando...
                    </>
                ) : (
                    <>
                        <i className="ri-close-circle-line text-xl"></i>
                        Cancelar Viaje
                    </>
                )}
            </button>

            <p className='text-xs text-center text-gray-500 mt-2'>
                Puedes cancelar sin costo antes de que un conductor acepte
            </p>
        </div>
    )
}

export default LookingForDriver