import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:9090",
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers?.set("Authorization", `Bearer ${token}`);
    }

    return config;
});


export default axiosClient;
