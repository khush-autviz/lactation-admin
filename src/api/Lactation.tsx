import axios from '../lib/axios'

export const getRolesPermissions = async () => {
    const response = await axios.get('/lactation/roles-with-permissions/')
    return response
}

export const getLactationRoom = async () => {
    const response = await axios.get('/lactation/room/')
    return response
}

export const getSingleLactationRoom = async (param: Number) => {
    const response = await axios.get(`/lactation/room/${param}`)
    return response
}

export const createLactationRoom = async (data: any) => {
    const response = await axios.post('/lactation/room/', data)
    return response
}

export const EditLactationRoom = async (param: Number,data: any) => {
    const response = await axios.put(`/lactation/room/${param}/`, data)
    return response
}