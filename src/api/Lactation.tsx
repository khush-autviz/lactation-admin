import axios from '../lib/axios'

export const getLactationRoom = async () => {
    const response = await axios.get('/lactation/room/')
    return response
}

export const createLactationRoom = async (data: any) => {
    const response = await axios.post('/lactation/room/', data)
    return response
}

// export const EditLactationRoom = async (param: Number,data: any) => {
//     const response = await axios.post('/lactation/room/', data)
//     return response
// }