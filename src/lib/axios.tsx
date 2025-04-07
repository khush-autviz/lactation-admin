import axios from "axios";

const instance = axios.create({
    baseURL: "http://localost:8000/",
    timeout: 10000,
})

export default instance