import React from 'react';
import { getPersonImage, getPersonData, getAllData } from '../../utils';
import { useParams } from "react-router";
import styles from "../Person/Person.module.css"
import spinner from "../../resources/spinner.svg"
import axios from 'axios';
import {useHistory} from "react-router"


function Person() {
  const {id} = useParams();
  const [imageData, setImageData] = React.useState({});
  const [data, setData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const history = useHistory();

  const fetchData = () => {
    setIsLoading(true);
    const personImage = axios.get(`https://akabab.github.io/starwars-api/api/id/${id}.json`);
    const personData = axios.get(`https://swapi.dev/api/people/${id}`);
    axios.all([personImage, personData]).then(axios.spread((...res) => {
      setImageData(res[0].data.image);
      setData(res[1].data);
      setIsLoading(false);
    })).catch(e => console.log(e));
  }

  const handleGoBack = () => {
    history.push("/");
  }


  React.useEffect(()=> {
    fetchData();
  }, [])

  return (
    <div className={styles.personCont}>
      {isLoading ? 
        (<div className={styles.spinnerIcon}>
          <img src={spinner} alt="loading.." styles={{maxWidth: "25px", marginTop: "3em"}}/>
        </div>):
        (
          <>
          <div className={styles.backButton} onClick={handleGoBack}>
            <i class="fas fa-chevron-left"></i>
          </div>
          <div className={styles.personContLeft}>
            <img src={imageData} alt="character image" className={styles.characterImage}/>
          </div>
          <div className={styles.personContRight}>
            <h1>{data.name}</h1>
          </div>
          </>
        )
        }
    </div>
  );
}

export default Person;
