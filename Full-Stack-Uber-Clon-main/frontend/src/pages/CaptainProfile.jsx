import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainProfile = () => {
    const { captain, setCaptain } = useContext(CaptainDataContext)
    const navigate = useNavigate()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        firstname: captain?.fullname?.firstname || '',
        lastname: captain?.fullname?.lastname || '',
        email: captain?.email || '',
        phone: captain?.phone || '',
        vehicleColor: captain?.vehicle?.color || '',
        vehiclePlate: captain?.vehicle?.plate || '',
        vehicleCapacity: captain?.vehicle?.capacity || '',
        vehicleType: captain?.vehicle?.vehicleType || ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/captains/profile`,
                {
                    fullname: {
                        firstname: formData.firstname,
                        lastname: formData.lastname
                    },
                    email: formData.email,
                    phone: formData.phone,
                    vehicle: {
                        color: formData.vehicleColor,
                        plate: formData.vehiclePlate,
                        capacity: formData.vehicleCapacity,
                        vehicleType: formData.vehicleType
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            if (response.status === 200) {
                setCaptain(response.data.captain)
                setSuccess('Perfil actualizado correctamente')
                setEditing(false)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el perfil')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <div className='bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4'>
                    <button
                        onClick={() => navigate('/captain-home')}
                        className='h-10 w-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all'
                    >
                        <i className="ri-arrow-left-line text-xl"></i>
                    </button>
                    <h1 className='text-xl sm:text-2xl font-semibold'>Mi Perfil de Conductor</h1>
                </div>
            </div>

            {/* Contenido */}
            <div className='max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
                {/* Avatar y nombre */}
                <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6'>
                    <div className='flex flex-col sm:flex-row items-center gap-6'>
                        <div className='h-24 w-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0'>
                            <i className="ri-steering-2-fill text-3xl text-white"></i>
                        </div>
                        <div className='text-center sm:text-left flex-1'>
                            <h2 className='text-2xl font-bold mb-1'>
                                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                            </h2>
                            <p className='text-gray-600'>{captain?.email}</p>
                            <div className='flex items-center gap-2 justify-center sm:justify-start mt-2'>
                                <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium'>
                                    ✓ Verificado
                                </span>
                            </div>
                            <button
                                onClick={() => setEditing(!editing)}
                                className='mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm'
                            >
                                {editing ? 'Cancelar edición' : 'Editar perfil'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Formulario de edición */}
                {editing ? (
                    <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8'>
                        <h3 className='text-lg font-semibold mb-6'>Editar Información</h3>

                        {error && (
                            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                                <p className='text-sm'>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                                <p className='text-sm'>{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Información Personal */}
                            <div>
                                <h4 className='font-semibold mb-4 text-gray-700'>Información Personal</h4>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Nombre
                                        </label>
                                        <input
                                            type='text'
                                            name='firstname'
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Apellido
                                        </label>
                                        <input
                                            type='text'
                                            name='lastname'
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                </div>

                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                        required
                                    />
                                </div>

                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Teléfono (opcional)
                                    </label>
                                    <input
                                        type='tel'
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                        placeholder='+57 300 123 4567'
                                    />
                                </div>
                            </div>

                            {/* Información del Vehículo */}
                            <div className='border-t pt-6'>
                                <h4 className='font-semibold mb-4 text-gray-700'>Información del Vehículo</h4>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Color
                                        </label>
                                        <input
                                            type='text'
                                            name='vehicleColor'
                                            value={formData.vehicleColor}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Placa
                                        </label>
                                        <input
                                            type='text'
                                            name='vehiclePlate'
                                            value={formData.vehiclePlate}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase'
                                            required
                                        />
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Capacidad
                                        </label>
                                        <input
                                            type='number'
                                            name='vehicleCapacity'
                                            value={formData.vehicleCapacity}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                            min='1'
                                            max='8'
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Tipo de Vehículo
                                        </label>
                                        <select
                                            name='vehicleType'
                                            value={formData.vehicleType}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                            required
                                        >
                                            <option value='moto'>Moto</option>
                                            <option value='car'>Carro</option>
                                            <option value='auto'>Auto</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all'
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        {/* Información Personal */}
                        <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6'>
                            <h3 className='text-lg font-semibold mb-6'>Información Personal</h3>
                            <div className='space-y-4'>
                                <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                                    <i className="ri-user-line text-2xl text-gray-600"></i>
                                    <div>
                                        <p className='text-sm text-gray-600'>Nombre completo</p>
                                        <p className='font-medium'>
                                            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                                    <i className="ri-mail-line text-2xl text-gray-600"></i>
                                    <div>
                                        <p className='text-sm text-gray-600'>Correo electrónico</p>
                                        <p className='font-medium'>{captain?.email}</p>
                                    </div>
                                </div>

                                {captain?.phone && (
                                    <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                                        <i className="ri-phone-line text-2xl text-gray-600"></i>
                                        <div>
                                            <p className='text-sm text-gray-600'>Teléfono</p>
                                            <p className='font-medium'>{captain?.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Información del Vehículo */}
                        <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8'>
                            <h3 className='text-lg font-semibold mb-6 flex items-center gap-2'>
                                <i className="ri-motorbike-fill text-orange-600"></i>
                                Mi Vehículo
                            </h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='p-4 bg-orange-50 rounded-lg'>
                                    <p className='text-sm text-gray-600 mb-1'>Color</p>
                                    <p className='font-medium capitalize'>{captain?.vehicle?.color}</p>
                                </div>
                                <div className='p-4 bg-orange-50 rounded-lg'>
                                    <p className='text-sm text-gray-600 mb-1'>Placa</p>
                                    <p className='font-medium uppercase'>{captain?.vehicle?.plate}</p>
                                </div>
                                <div className='p-4 bg-orange-50 rounded-lg'>
                                    <p className='text-sm text-gray-600 mb-1'>Capacidad</p>
                                    <p className='font-medium'>{captain?.vehicle?.capacity} pasajeros</p>
                                </div>
                                <div className='p-4 bg-orange-50 rounded-lg'>
                                    <p className='text-sm text-gray-600 mb-1'>Tipo</p>
                                    <p className='font-medium capitalize'>{captain?.vehicle?.vehicleType}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Estadísticas */}
                <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8 mt-6'>
                    <h3 className='text-lg font-semibold mb-4'>Estadísticas</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                        <div className='text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg'>
                            <p className='text-2xl font-bold text-green-700'>0</p>
                            <p className='text-xs text-gray-600 mt-1'>Viajes Totales</p>
                        </div>
                        <div className='text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg'>
                            <p className='text-2xl font-bold text-blue-700'>0</p>
                            <p className='text-xs text-gray-600 mt-1'>Calificación</p>
                        </div>
                        <div className='text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg'>
                            <p className='text-2xl font-bold text-yellow-700'>0h</p>
                            <p className='text-xs text-gray-600 mt-1'>Horas Online</p>
                        </div>
                        <div className='text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg'>
                            <p className='text-2xl font-bold text-purple-700'>$0</p>
                            <p className='text-xs text-gray-600 mt-1'>Ganancias</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaptainProfile