import axios from '../lib/axios'


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

export const deleteLactationRoom = async (param: Number) => {
    const response = await axios.delete(`/lactation/room/${param}/`)
    return response
}

export const getAllPermissions = async () => {
    const response = await axios.get('/lactation/permissions/')
    return response
}

export const getRolesPermissions = async () => {
    const response = await axios.get('/lactation/roles-with-permissions/')
    return response
}

export const assignPermissions = async (data: any) => {
    const response = await axios.post('/lactation/assign-role-permissions/', data)
    return response
}

export const unassignPermissions = async (data: any) => {
    const response = await axios.post('/lactation/unassign-role-permissions/', data)
    return response
}

export const getSlotsOfSpecificRoom = async (param: Number) => {
    const response = await axios.get(`/lactation/room-slots/by_room/?room_id=${param}`)
    return response
}

export const createSlots = async (data: any) => {
    const response = await axios.post(`/lactation/room-slots/`, data)
    return response
}