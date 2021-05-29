import React from 'react'
import styles from "./Search.module.css"
import { getCharacters } from '../../utils';
import { SearchItem } from "../SearchItem/SearchItem"
import spinner from "../../resources/spinner.svg"
import axios from 'axios';
import {useHistory} from "react-router"


const Search = () => {
    const [query, setQuery] = React.useState("");
    const [characterList, setCharacterList] = React.useState([]);
    const [dropDownActive, setDropDownActive] = React.useState(false);
    const [index, setIndex] = React.useState(-1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const history = useHistory();

    let characterListRef = React.useRef();
    let debounceTimer = React.useRef();
    const searchRef = React.useRef();

    characterListRef.current = characterList.length;

    const getSearchResults = () => {
        setIsLoading(true);
        if (query.length > 0) {
            axios.get("https://swapi.dev/api/people/", {
                params: { search: query }
            })
            .then(res => {
                setCharacterList(res.data.results.filter((_, idx) => idx < 5));
                if (res.data.results.length > 0) {
                    setDropDownActive(true);
                    setIsLoading(false);
                } else {
                    setDropDownActive(false);
                    setIsLoading(false);
                }
            })
        } else {
            setCharacterList([]);
            setDropDownActive(false);
            setIsLoading(false);
        }
    }

    const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setDropDownActive(false);
        } else if (searchRef.current.contains(e.target) && characterListRef.current > 0) {
            setDropDownActive(true);
        }
    }

    const handleClearInput = () => {
        setIsLoading(false);
        setQuery("");
        setCharacterList([]);
        setDropDownActive(false);
    }

    React.useEffect(() => {
        setIsLoading(true);
        debounceTimer.current && clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            getSearchResults();
        }, 500);
        setIndex(-1);
    }, [query]);
    

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])


    const moveUpDown = (e) => {
        if (e.key === "ArrowDown") {
            if (dropDownActive) {
                let idx = index;
                if (index < characterList.length - 1) {
                    idx++;
                }
                setIndex(idx);
            }
        }
        if (e.key === "ArrowUp") {
            setIndex(c => (c >= 0 ? c - 1 : -1));
        }
        if (e.key === "Escape") {
            setDropDownActive(false);
        }
        if (e.key === "Enter" && index >= 0) {
            let arr = characterList[index].url?.trim().split("/");
            let id = arr[arr?.length - 2];
            history.push({
                pathname: `/person/${id}`
            })
        }

    }


    return (
        <div className={styles.searchCont} ref={searchRef}>
            <div className={styles.searchBarCont}>
                <input 
                style={{ borderRadius: dropDownActive ? "25px 25px 0 0" : "25px" }} 
                className={styles.searchInput} 
                placeholder="Search by name" 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={(e) => moveUpDown(e)} 
                value={query} />
                {query.length > 0 ?
                    (
                        <div className={styles.clearInputIcon}>
                            <div className={styles.crossIcon} onClick={handleClearInput}>
                                <i class="fas fa-times"></i>
                            </div>
                            <div className={styles.verticalLine}></div>
                        </div>
                    ) : ""
                }
                <div className={styles.spinnerSearchIcon} style={{ borderRadius: dropDownActive ? "0 25px 0 0" : "0 25px 25px 0" }}>
                    {
                        isLoading ?
                            (
                                <img src={spinner} alt="loading.." />
                            ) :
                            (
                                <i className="fas fa-search"></i>
                            )
                    }
                </div>
            </div>
            {/* <hr className={styles.divider}/> */}
            <div className={styles.dropDown} style={{ display: dropDownActive ? "block" : "none" }}>
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
