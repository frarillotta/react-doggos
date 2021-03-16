import axios, { AxiosResponse } from "axios"

const endpoint = "https://random.dog/woof.json"

export async function getManyDogs(filter = "jpg") {

    const queryString = `?include=${filter}`;

    return axios.get(`${endpoint}${queryString}`).then((response: AxiosResponse)=>{

        if (response.status === 200) {

            return response.data;

        };

    });

}

export async function getRandomDoggo(filter = "jpg") {

    const queryString = `?include=${filter}`;

    return axios.get<{url: string}>(`${endpoint}${queryString}`).then((response)=>{

        if (response.status === 200) {

            return response.data.url;

        } else {

            return "error";

        };

    })

}