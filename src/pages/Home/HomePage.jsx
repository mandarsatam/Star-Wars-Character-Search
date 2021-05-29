import React from 'react';
import logo from './star-wars-logo.png';
import styles from './HomePage.module.css';
import {Search} from "../../Components/Search/Search"

function HomePage() {
  return (
    <div className={styles.homeCont}>
      <div className={styles.logo}>
        <img src={logo} alt="Star Wars Logo" styles={{width: "3em"}}/>
      </div>      
      <Search/>
    </div>
  );
}

export default HomePage;
