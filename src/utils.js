import axios from "axios";

const getCharacters = async (query) =>{
    let res = await axios.get(`https://swapi.dev/api/people/?search=${query}`);
    return res;
}


export {getCharacters}