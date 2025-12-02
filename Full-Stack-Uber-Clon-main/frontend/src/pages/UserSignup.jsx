import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email: email,
        password: password
      }

      const baseURL = import.meta.env.VITE_BASE_URL
      
      if (!baseURL) {
        throw new Error('La URL del backend no está configurada. Por favor verifica las variables de entorno.')
      }

      const response = await axios.post(`${baseURL}/users/register`, newUser, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos de timeout
      })

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)

        // Limpiar campos
        setEmail('')
        setFirstName('')
        setLastName('')
        setPassword('')

        // Navegar a home
        navigate('/home')
      }
    } catch (err) {
      console.error('Error en registro:', err)

      // Manejar diferentes tipos de errores
      if (err.code === 'ECONNABORTED') {
        setError('La solicitud tardó demasiado. Por favor intenta de nuevo.')
      } else if (err.response) {
        // El servidor respondió con un código de error
        const status = err.response.status
        const message = err.response.data?.message || err.response.data?.error

        if (status === 400) {
          setError(message || 'Datos inválidos. Verifica que todos los campos estén correctos.')
        } else if (status === 409 || status === 422) {
          setError('Este correo ya está registrado. Por favor usa otro correo o inicia sesión.')
        } else if (status === 404) {
          setError('No se encontró el servicio. Verifica que el backend esté funcionando.')
        } else if (status === 500) {
          setError('Error del servidor. Por favor intenta más tarde.')
        } else {
          setError(message || 'Error al crear la cuenta. Por favor intenta de nuevo.')
        }
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet o que el backend esté activo.')
      } else {
        // Algo pasó al configurar la petición
        setError(err.message || 'Error desconocido. Por favor intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="Logo" />

          <form onSubmit={submitHandler}>
            <h3 className='text-lg w-1/2 font-medium mb-2'>¿Cuál es tu nombre?</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                type="text"
                placeholder='Nombre'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                type="text"
                placeholder='Apellido'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>¿Cuál es tu correo?</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='correo@ejemplo.com'
              disabled={loading}
            />

            <h3 className='text-lg font-medium mb-2'>Ingresa tu contraseña</h3>
            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder='contraseña'
              disabled={loading}
              minLength="6"
            />

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                <p className='text-sm'>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#111] hover:bg-[#333]'
              } text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg transition-colors`}
            >
              {loading ? (
                <span className='flex items-center justify-center'>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          <p className='text-center'>¿Ya tienes cuenta? <Link to='/login' className='text-blue-600 hover:underline'>Inicia sesión aquí</Link></p>
        </div>

        <div>
          <p className='text-[10px] leading-tight'>Este sitio está protegido por reCAPTCHA y aplican la <span className='underline'>Política de Privacidad</span> y los <span className='underline'>Términos de Servicio de Google</span>.</p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup