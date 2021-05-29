import React from 'react'
import styles from "./SearchItem.module.css"

const SearchItem = ({name, gender, year, selected}) => {
    return (
        <div className={styles.dropDownContent} style={{backgroundColor: selected? "#242627" : ""}}>
            <div className={styles.dropDownContentLeft}>
                <h3>{name}</h3>
                <p>{year}</p>
            </div>
            <p className={styles.dropDownContentRight}>{gender}</p>
        </div>
    )
}

export { SearchItem }
