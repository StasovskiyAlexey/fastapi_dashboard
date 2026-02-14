import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  withCredentials: true
});

// Обработка запроса отправки данных, с конфигом и прочим
axiosClient.interceptors.request.use(
  (config) => {
    // Место в котором мы пишем код который выполнится при успешном запросе
    return config;
  },
  (error) => {
    // Место в котором мы пишем код который выполнится при неудачном запросе
    return Promise.reject(error);
  },
);

// Обработка запроса получения данных, ответа
axiosClient.interceptors.response.use(
  (response) => {
    // Место в котором мы пишем код который выполнится при успешном ответе, своего рода мидлвейр который отслеживает ответы и отталкиваются от этого
    return response.data;
  },
  (error) => {
    // Место в котором выполнится код при ошибке, выход из аккаунта, удаление токена и т.д.
    return Promise.reject(error);
  },
);
