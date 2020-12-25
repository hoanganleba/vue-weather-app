import axios from 'axios'

const weatherApi = axios.create({
    baseURL: 'https://weather-proxy.freecodecamp.rocks/api'
})

export default {
    getWeatherData(latitude, longitude) {
        return weatherApi.get(`/current?lat=${latitude}&lon=${longitude}`)
    }
}