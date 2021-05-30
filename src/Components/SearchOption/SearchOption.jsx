import React from 'react'
import styles from "./SearchOption.module.css"

const SearchOption = ({selected, name, handleMouseHover, idx, handleMouseClick, year, gender}) => {

    return (
        <div className={styles.dropDownContent} style={{ backgroundColor: selected ? "#242627" : "" }}
            onMouseEnter={() => handleMouseHover(idx)}
            onClick={handleMouseClick}
            >
            <div>
                <h4>{name}</h4>
                <p>{year}</p>
            </div>
            <p>{gender}</p>
        </div>
    )
}

export { SearchOption }
