import axios from "axios";

const getCharacters = async (query) =>{
    let res = await axios.get(`https://swapi.dev/api/people/?search=${query}`);
    return res;
}

const getPersonImage = async (id) => {
    let res = await axios.get(`https://akabab.github.io/starwars-api/api/id/${id}.json`)
    return res;
}

const getPersonData = async (id) => {
    let res = await axios.get(`https://swapi.dev/api/people/${id}`);
    return res;
}

const getAllData = () => {
    return axios.all([getPersonData, getPersonImage]);
}

axios.all([getPersonData, getPersonImage]).then(
    
)


export {getCharacters, getPersonImage, getPersonData, getAllData}