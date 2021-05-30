import React from 'react';
import { useParams } from "react-router";
import styles from "../Person/Person.module.css"
import spinner from "../../resources/spinner.svg"
import axios from 'axios';
import {useHistory} from "react-router"


function Person() {
  const {id} = useParams(); //Get character id from param
  const [imageData, setImageData] = React.useState({}); //For storing image
  const [data, setData] = React.useState({}); //For storing the rest of the data
  const [isLoading, setIsLoading] = React.useState(false);

  const history = useHistory();

  //Function to make the API call
  const fetchData = () => {
    setIsLoading(true);
    const personImage = axios.get(`https://akabab.github.io/starwars-api/api/id/${id}.json`);
    const personData = axios.get(`https://swapi.dev/api/people/${id}`);

    // Combining two axios call and populating the states
    axios.all([personImage, personData]).then(axios.spread((...res) => {
      setImageData(res[0].data.image);
      setData(res[1].data);
      setIsLoading(false);
    })).catch(e => console.log(e));
  }

  const handleGoBack = () => {
    history.push("/");
  }

  console.log(imageData, data)


  React.useEffect(()=> {
    fetchData();
  }, [])

  return (
    <div className={styles.personCont}>
      {isLoading ? 
        (<div className={styles.spinnerCont}>
          <img src={spinner} alt="loading.." className={styles.spinner}/>
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
            <div className={styles.detailsGrid}>
            <div>
                <p>BORN : {data.birth_year?.toUpperCase()}</p>
              </div>
              <div>
                <p>GENDER : {data.gender?.toUpperCase()}</p>
              </div>
              <div>
                <p>EYE : {data.eye_color?.toUpperCase()}</p>
              </div>
              <div>
                <p>HAIR : {data.hair_color?.toUpperCase()}</p>
              </div>
              <div>
                <p>HEIGHT : {data.height?.toUpperCase()}</p>
              </div>
              <div>
                <p>WEIGHT : {data.mass?.toUpperCase()}</p>
              </div>
            </div>
          </div>
          </>
        )
    }
    </div>
  );
}

export default Person;
