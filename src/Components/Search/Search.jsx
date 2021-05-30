import React from 'react'
import styles from "./Search.module.css"
import spinner from "../../resources/spinner.svg"
import axios from 'axios';
import { useHistory } from "react-router"
import {SearchOption} from "../SearchOption/SearchOption"


const Search = () => {
    const [query, setQuery] = React.useState(""); //Input Query
    const [characterList, setCharacterList] = React.useState([]); //List Of fetched characters
    const [dropDownActive, setDropDownActive] = React.useState(false); //Set the visibility of dropdown
    const [index, setIndex] = React.useState(-1); //Index of selected option in dropdown
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [reqStatus, setReqStatus] = React.useState(false); //Set the status of API request for conditionally rendering results not found message

    const history = useHistory();

    let characterListRef = React.useRef(); //To keep track of list of options in dropdown
    let debounceTimer = React.useRef(); // Reference to debouncer
    const searchRef = React.useRef(); // To keep track of user clicks 
    const inputRef = React.useRef(null); //To keep track of the input

    //Set the number of options in dropdown
    characterListRef.current = characterList.length;


    //Input change handler
    const handleQuery = (e) => {
        setQuery(e.target.value);
        inputRef.current = e.target.value;
    }

    //Function to make api request and set state for the app
    const getSearchResults = () => {
        if (query.length > 0) {
            axios.get("https://swapi.dev/api/people/", {
                params: { search: query }
            })
                .then(res => {
                    //Showing only top 5 results and setting the visibility of dropdown to true and loading to false if res is positive
                    setCharacterList(res.data.results.filter((_, idx) => idx < 5));
                    if (res.data.results.length > 0) {
                        setDropDownActive(true);
                        setIsLoading(false);
                        setReqStatus(false);
                    } else {
                        setDropDownActive(false);
                        setIsLoading(false);
                        setReqStatus(true);
                    }
                })
                .catch((e) => {
                    setIsError(true);
                })
        } else {
            //Resetting the characterList to empty array and visibility of dropDown to false
            setCharacterList([]);
            setDropDownActive(false);
            setIsLoading(false);
        }
    }

    //Debouncing the query so that the api request is made after 500ms of user typing
    React.useEffect(() => {
        //If the current input is null or empty, return to avoid making api request
        if (
            inputRef.current === null || inputRef.current === "" || query ===""
        ) {
            setCharacterList([]);
            setDropDownActive(false);
            setIsLoading(false);
            setReqStatus(false);
            return; 
        }

        //cleanup
        debounceTimer.current && clearTimeout(debounceTimer.current);
    
        setIsLoading(true);
        //settimeout
        debounceTimer.current = setTimeout(() => {
            getSearchResults();
        }, 500);

        //Resetting selection index to -1
        setIndex(-1);

    }, [query]);


    //Function to reset the state if user clears the input using the cross button
    const handleClearInput = () => {
        setIsLoading(false);
        setQuery("");
        setCharacterList([]);
        setDropDownActive(false);
        setReqStatus(false);
    }


    //Function to close the dropdown when user clicks outside the search bar or dropdown
    const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setDropDownActive(false);
        } else if (searchRef.current.contains(e.target) && characterListRef.current > 0) {
            //If data is there in characterList then make dropDown as active
            setDropDownActive(true);
        }
    }

    //Listening to user clicks outside the search
    React.useEffect(() => {
        //Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])


    //Handle Mouse Hover over the drop down and set the index to that value
    const handleMouseHover = (idx) => {
        setIndex(idx);
    }

    //Handle Mouse click and route to the corresponding page
    const handleMouseClick = () => {
        if (index >= 0) {
            let arr = characterList[index].url?.trim().split("/");
            let id = arr[arr?.length - 2];
            history.push({
                pathname: `/person/${id}`
            })

        }
    }

    // Function to move up-down the dropDown list
    // If keypress is arrow up/down check if the index is out of bound and setIndex
    // If keypress is ESC, hide the dropDown list
    // If the keypress is ENTER, push the corresponding number into url to go to that characters page
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
        <>
        <div className={styles.searchCont} ref={searchRef}>
            <div className={styles.searchBarCont}>
                {/* Input Bar */}
                <input
                    style={{ borderRadius: dropDownActive ? "25px 25px 0 0" : "25px" }}
                    className={styles.searchInput}
                    placeholder="Search by name"
                    onChange={handleQuery}
                    onKeyDown={(e) => moveUpDown(e)}
                    value={query}
                />
                {/* Check for query length to display cross icon along with a vertical line */}
                {query.length > 0 ?
                    (
                        <div className={styles.clearInputIcon}>
                            <div className={styles.crossIcon} onClick={handleClearInput}>
                                <i className="fas fa-times"></i>
                            </div>
                            <div className={styles.verticalLine}></div>
                        </div>
                    ) : ""
                }
                {/* Conditionally render spinner */}
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
            {/* The Dropdown  */}
            <div className={styles.dropDown} style={{ display: dropDownActive ? "block" : "none" }}>
                {
                    characterList?.map((char, idx) => (
                        // Individual Option in dropdown, Mouse Over event handler and event handler for clicks
                        // <div className={styles.dropDownContent} style={{ backgroundColor: index === idx ? "#242627" : "" }}
                        //     onMouseEnter={() => handleMouseHover(idx)}
                        //     onClick={handleMouseClick}
                        //     key ={char.name}>
                        //     <div>
                        //         <h4>{char.name}</h4>
                        //         <p>{char.birth_year}</p>
                        //     </div>
                        //     <p>{char.gender}</p>
                        // </div>
                        <SearchOption 
                        // onMouseEnter={() => handleMouseHover(idx)}
                        handleMouseClick={handleMouseClick}
                        selected={index === idx ? true : false}
                        name={char.name}
                        handleMouseHover={handleMouseHover}
                        idx = {idx}
                        key={char.name}
                        year={char.birth_year}
                        gender= {char.gender}/>
                    ))
                }
            </div>
        </div>
        {
            isError?
            <p className={styles.errorMessage}>Something went Wrong</p>
            : ""
        }
        {
            characterList.length === 0 && reqStatus === true?
            <p className={styles.errorMessage}>You have reached the dark side!</p>
            : ""
        }
        </>
    )
}

export { Search }
