import axios from '../lib/axios'

export const forgotPasswordMail = async (data:any) => {
    const response = await axios.post('/public/forgot-password/', data)
    return response
}

export const forgotPasswordOtp = async (data:any) => {
    const response = await axios.post('/public/verify-reset-otp/', data)
    return response
}
export const resetPassword = async (data:any) => {
    const response = await axios.post('/public/reset-password/', data)
    return response
}

export const tenantLogin = async (data: any) => {
    const response = await axios.post('/tenant/login/', data)
    return response
}
 
export const getDomain = async (data: any) => {
    const response = await axios.post('/public/lookup-domains/', data)
    return response
}

export const getUserProfile = async () => {
    const response = await axios.get('/tenant/user/profile/')
    return response
}

export const createTenantRole = async (data: any) => {
    const response = await axios.post('/tenant/roles/', data)
    return response
}

export const editTenantRole = async (param: Number,data: any) => {
    const response = await axios.put(`/tenant/roles/${param}`, data)
    return response
}

export const getTenantRole = async () => {
    const response = await axios.get('/tenant/roles/')
    return response
}

export const deleteTenantRole = async (param: Number) => {
    const response = await axios.delete(`/tenant/roles/${param}/`)
    return response
}

export const getSingleTenantRole = async (param: Number) => {
    const response = await axios.get(`/tenant/roles/${param}`)
    return response
}

export const createTenantUser = async (data: any) => {
    const response = await axios.post('/tenant/users/create/', data)
    return response
}

export const getAllTenants = async () => {
    const response = await axios.get('/tenant/admin/')
    return response
}






