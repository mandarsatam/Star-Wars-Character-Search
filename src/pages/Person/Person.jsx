import React from 'react';
import { getPersonImage, getPersonData, getAllData } from '../../utils';
import { useParams } from "react-router";
import styles from "../Person/Person.module.css"
import spinner from "../../resources/spinner.svg"
import axios from 'axios';

function Person() {
  const {id} = useParams();
  const [imageData, setImageData] = React.useState({});
  const [data, setData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = () => {
    setIsLoading(true);
    const personImage = axios.get(`https://akabab.github.io/starwars-api/api/id/${id}.json`);
    const personData = axios.get(`https://swapi.dev/api/people/${id}`);
    axios.all([personImage, personData]).then(axios.spread((...res) => {
      setImageData(res[0].data);
      setData(res[1].data);
      setIsLoading(false);
    })).catch(e => console.log(e));
  }

  React.useEffect(()=> {
    // setIsLoading(true);
    // getPersonImage(id)
    // .then(res => setImageData(res.data));
    // getPersonData(id)
    // .then()
    // .then(()=> getPersonData(id).then(res => {
    //   setData(res.data)
    //   setIsLoading(false);
    //   }
    // ))
    fetchData();
  }, [])

  console.log(data, imageData)

  return (
    <div className={styles.personCont}>
      {isLoading ? 
        (<div className={styles.spinnerIcon}>
          <img src={spinner} alt="loading.." />
        </div>):
        (
          <h1>{data.name}</h1>
        )
        }
    </div>
  );
}

export default Person;
