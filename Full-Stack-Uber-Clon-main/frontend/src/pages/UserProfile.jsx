import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Elige un Vehículo</h3>
            
            {/* Solo opción de Moto */}
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex border-2 active:border-black hover:border-gray-400 mb-2 rounded-xl w-full p-4 items-center justify-between transition-all cursor-pointer'>
                <img 
                    className='h-12 w-12 object-contain' 
                    src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_638/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" 
                    alt="Moto" 
                />
                <div className='flex-1 ml-4'>
                    <h4 className='font-medium text-base flex items-center gap-2'>
                        Moto 
                        <span className='flex items-center gap-1 text-sm'>
                            <i className="ri-user-3-fill"></i>1
                        </span>
                    </h4>
                    <h5 className='font-medium text-sm text-gray-600'>2-3 min de distancia</h5>
                    <p className='font-normal text-xs text-gray-500'>Viaje rápido y económico</p>
                </div>
                <h2 className='text-lg font-semibold whitespace-nowrap'>
                    ${props.fare.moto?.toLocaleString('es-CO')} COP
                </h2>
            </div>

            <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
                <p className='text-xs text-gray-600 text-center'>
                    <i className="ri-information-line mr-1"></i>
                    Los precios pueden variar según la distancia y demanda
                </p>
            </div>
        </div>
    )
}

export default VehiclePanel