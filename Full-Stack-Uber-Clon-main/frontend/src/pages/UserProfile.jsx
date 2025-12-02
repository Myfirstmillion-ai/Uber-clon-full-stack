import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const UserProfile = () => {
    const { user, setUser } = useContext(UserDataContext)
    const navigate = useNavigate()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        firstname: user?.fullname?.firstname || '',
        lastname: user?.fullname?.lastname || '',
        email: user?.email || '',
        phone: user?.phone || ''
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
                `${import.meta.env.VITE_BASE_URL}/users/profile`,
                {
                    fullname: {
                        firstname: formData.firstname,
                        lastname: formData.lastname
                    },
                    email: formData.email,
                    phone: formData.phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            if (response.status === 200) {
                setUser(response.data.user)
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
            <div className='bg-white shadow-sm'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4'>
                    <button
                        onClick={() => navigate('/home')}
                        className='h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all'
                    >
                        <i className="ri-arrow-left-line text-xl"></i>
                    </button>
                    <h1 className='text-xl sm:text-2xl font-semibold'>Mi Perfil</h1>
                </div>
            </div>

            {/* Contenido */}
            <div className='max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
                {/* Avatar y nombre */}
                <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6'>
                    <div className='flex flex-col sm:flex-row items-center gap-6'>
                        <div className='h-24 w-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0'>
                            <span className='text-3xl font-bold text-white'>
                                {user?.fullname?.firstname?.charAt(0)}{user?.fullname?.lastname?.charAt(0)}
                            </span>
                        </div>
                        <div className='text-center sm:text-left flex-1'>
                            <h2 className='text-2xl font-bold mb-1'>
                                {user?.fullname?.firstname} {user?.fullname?.lastname}
                            </h2>
                            <p className='text-gray-600'>{user?.email}</p>
                            <button
                                onClick={() => setEditing(!editing)}
                                className='mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm'
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

                        <form onSubmit={handleSubmit} className='space-y-4'>
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
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Correo Electrónico
                                </label>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    required
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Teléfono (opcional)
                                </label>
                                <input
                                    type='tel'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    placeholder='+57 300 123 4567'
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all'
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8'>
                        <h3 className='text-lg font-semibold mb-6'>Información Personal</h3>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                                <i className="ri-user-line text-2xl text-gray-600"></i>
                                <div>
                                    <p className='text-sm text-gray-600'>Nombre completo</p>
                                    <p className='font-medium'>
                                        {user?.fullname?.firstname} {user?.fullname?.lastname}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                                <i className="ri-mail-line text-2xl text-gray-600"></i>
                                <div>
                                    <p className='text-sm text-gray-600'>Correo electrónico</p>
                                    <p className='font-medium'>{user?.email}</p>
                                </div>
                            </div>

                            {user?.phone && (
                                <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                                    <i className="ri-phone-line text-2xl text-gray-600"></i>
                                    <div>
                                        <p className='text-sm text-gray-600'>Teléfono</p>
                                        <p className='font-medium'>{user?.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Opciones adicionales */}
                <div className='bg-white rounded-xl shadow-sm p-6 sm:p-8 mt-6'>
                    <h3 className='text-lg font-semibold mb-4'>Configuración de la Cuenta</h3>
                    <div className='space-y-2'>
                        <button className='w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all'>
                            <span className='flex items-center gap-3'>
                                <i className="ri-lock-password-line text-xl text-gray-600"></i>
                                <span>Cambiar contraseña</span>
                            </span>
                            <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                        </button>

                        <button className='w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all'>
                            <span className='flex items-center gap-3'>
                                <i className="ri-notification-line text-xl text-gray-600"></i>
                                <span>Notificaciones</span>
                            </span>
                            <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                        </button>

                        <button className='w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all'>
                            <span className='flex items-center gap-3'>
                                <i className="ri-shield-check-line text-xl text-gray-600"></i>
                                <span>Privacidad y seguridad</span>
                            </span>
                            <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile