import React from 'react'
import styles from "./Search.module.css"
import { getCharacters } from '../../utils';
import { SearchItem } from "../SearchItem/SearchItem"
import spinner from "../../resources/spinner.svg"
import axios from 'axios';


const Search = () => {
    const [query, setQuery] = React.useState("");
    const [characterList, setCharacterList] = React.useState([]);
    const [active, setActive] = React.useState(false);
    const [index, setIndex] = React.useState(-1);
    const [isLoading, setIsLoading] = React.useState(false);

    let debounceTimer = React.useRef();

    const getSearchResults = () => {
        if(query.length > 0){
            setIsLoading(true);
            axios.get("https://swapi.dev/api/people/", {
                params: { search : query}
            })
            .then(res => setCharacterList(res.data.results.filter((_, idx) => idx < 5)))
            .then(() => {
                setActive(true);
                setIsLoading(false);
            })
        }else{
            setCharacterList([]);
            setActive(false);
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        debounceTimer.current && clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            getSearchResults();
        }, 500);
    }, [query]);

    const moveUpDown = (e) => {
        if (e.key === "ArrowDown") {
            if (active) {
                let idx = index;
                if (index < characterList.length - 1) {
                    idx++;
                }
                setIndex(idx);
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
                <input className={styles.searchInput} placeholder="Search by name" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => moveUpDown(e)} />
                {
                    isLoading ?
                        (<div className={styles.spinnerIcon}>
                            <img src={spinner} alt="loading.." />
                        </div>)
                        :
                        (<div className={styles.searchIcon}>
                            <i className="fas fa-search"></i>
                        </div>)
                }
            </div>
            <div className={styles.dropDown}>
                {
                    characterList?.map((char, idx) => (
                        <SearchItem name={char.name} gender={char.gender} year={char.year} selected={index === idx ? true : false} key={char.name} />
                    ))
                }
            </div>
        </div>
    )
}

export { Search }
