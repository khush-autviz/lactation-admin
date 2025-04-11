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

export const getUserProfile = async (data: any) => {
    const response = await axios.get('/tenant/user/profile/', data)
    return response
}





