import React from 'react'
import styles from "./Search.module.css"
import { getCharacters } from '../../utils';
import {SearchItem} from "../SearchItem/SearchItem"

const Search = () => {
    const [query, setQuery] = React.useState("");
    const [characterList, setCharacterList] = React.useState([]);
    const [active, setActive] = React.useState(false);
    const [index, setIndex] = React.useState(-1);

    React.useEffect(() => {
        if(query.length > 1){
            getCharacters(query)
            .then(res => setCharacterList(res.data.results))
            .then(() => setActive(true));
        }else{
            setCharacterList([]);
            setActive(false);
        }
        console.log(characterList, query);
    }, [query]);

    const moveUpDown = (e) => {
        if (e.key === "ArrowDown") {
            if(active){
                let idx = index;
                if(index < characterList.length-1){
                    idx++;
                }
                setIndex(idx);
                // setQuery(characterList[idx].name);
                // setIndex(c => (c < characterList.length - 1 ? c + 1 : c));
                // setQuery(characterList[])
            }
        }

        if (e.key === "ArrowUp") {
            setIndex(c => (c > 0 ? c - 1 : 0));
        }

        if (e.key === "Escape") {
            setActive(false);
        }

        // if (e.key === "Enter" && cursor > 0) {
        //     setSearch(suggestions[cursor].name);
        //     hideSuggestion();
        //     onSelect(suggestions[cursor]);
        // }

    }


    return (
        <div className={styles.searchCont}>
            <div className={styles.searchBarCont}>
                <input className={styles.searchInput} placeholder="Search by name" onChange={(e) => setQuery(e.target.value)}onKeyDown={(e) => moveUpDown(e)}/>
                <div className={styles.searchIcon}>
                    <i className="fas fa-search"></i>
                </div>
            </div>
            <div className={styles.dropDown}>
            {
                characterList?.map((char, idx) => (
                    <SearchItem name={char.name} gender={char.gender} year={char.year} selected={index === idx ? true : false} key={char.name}/>
                ))
            }
            </div>
        </div>
    )
}

export {Search}
