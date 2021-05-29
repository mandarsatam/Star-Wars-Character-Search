import React from 'react'
import styles from "./SearchItem.module.css"

const SearchItem = ({name, gender, year, selected}) => {
    return (
        <div className={selected? styles.active: styles.dropDownContent}>
            <div className={styles.dropDownContentLeft}>
                <h3>{name}</h3>
                <p>{year}</p>
            </div>
            <p className={styles.dropDownContentRight}>{gender}</p>
        </div>
    )
}

export { SearchItem }
