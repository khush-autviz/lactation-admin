import axios from "../lib/axios";


export const registerCompany = async (data: any) => {
    const response = await axios.post('/public/register/',data)
    return response
}
export const getTenantTypes = async () => {
    const response = await axios.get('/public/tenant-types/')
    return response
}

export const verifyOtp = async (data: any) => {
   const response = await axios.post('/public/verify-otp/', data)
   return response
}

export const resendOtp = async (data: any) => {
    const response = await axios.post('/public/resend-otp/', data)
    return response
}