import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <div className='h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center'>
                        <span className='text-white font-bold text-sm'>
                            {captain?.fullname?.firstname?.charAt(0)}{captain?.fullname?.lastname?.charAt(0)}
                        </span>
                    </div>
                    <h4 className='text-lg font-medium capitalize'>
                        {captain?.fullname?.firstname + " " + captain?.fullname?.lastname}
                    </h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>$45.000 COP</h4>
                    <p className='text-sm text-gray-600'>Ganado hoy</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Horas en línea</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>30 km</h5>
                    <p className='text-sm text-gray-600'>Distancia</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>5</h5>
                    <p className='text-sm text-gray-600'>Viajes</p>
                </div>

            </div>
        </div>
    )
}

export default CaptainDetails