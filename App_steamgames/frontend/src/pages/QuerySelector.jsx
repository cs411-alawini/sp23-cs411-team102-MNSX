import React, { useEffect, useRef, useState } from "react";

const QuerySelector = (props) => {
    const {setQueryParams, setAdditionQparams, welcomeSectionRef} = props;
    const [genrelist, setGenrelist] = useState([]);
    const [platformlist, setPlatformlist] = useState([]);
    const [offsetLeft, setOffsetLeft] = useState("214.5px");
    const [genreIntersect, setGenreIntersect] = useState(false);
    const [platformIntersect, setPlatformIntersect] = useState(false);

    const querySelectorStyle = {left: offsetLeft};

    const querySelectorRef = useRef();

    window.addEventListener("click", e => {
        const steamRatingSelector = document.getElementsByClassName("steamRating")[0];
        const priceSelector = document.getElementsByClassName("price")[0];
        const genreSelector = document.getElementsByClassName("genre")[0];
        const platformSelector = document.getElementsByClassName("platform")[0];

        if (!steamRatingSelector?.contains(e.target)) steamRatingSelector.childNodes[1].style.display = "none";
        if (!priceSelector?.contains(e.target)) priceSelector.childNodes[1].style.display = "none";
        if (!genreSelector?.contains(e.target)) genreSelector.childNodes[1].style.display = "none";
        if (!platformSelector?.contains(e.target)) platformSelector.childNodes[1].style.display = "none";
    });

    useEffect(() => {
        setAdditionQparams((prev) => ({...prev, genreIntersect: genreIntersect}));
        setAdditionQparams((prev) => ({...prev, platformIntersect: platformIntersect}));
    }, [genreIntersect, platformIntersect, setAdditionQparams]);

    useEffect(() => {
        const welcomeSectionWidth = welcomeSectionRef.current.offsetWidth;
        const querySelectorWidth = querySelectorRef.current.offsetWidth;
        const offset = (welcomeSectionWidth - querySelectorWidth) / 2;
        setOffsetLeft(`${offset}px`);
    }, [welcomeSectionRef]);

    const dropdown = (e) => {
        const attributelist = e.target.parentNode.nextSibling;
        attributelist.style.display = "block";
    };

    const Setrange = (e) => {
        var currentvalue = e.target.value;
        if (e.target.name === "steamRating_low" && (currentvalue === "" || currentvalue < 0)) currentvalue = 0;
        if (e.target.name === "steamRating_high" && (currentvalue === "" || currentvalue > 100)) currentvalue = 100;
        if (e.target.name === "price_low" && (currentvalue === "" || currentvalue < 0)) currentvalue = 0;
        if (e.target.name === "price_high" && (currentvalue === "" || currentvalue > 450)) currentvalue = 450;
        if (e.target.name === "limit" && (currentvalue === "" || currentvalue < 0)) currentvalue = 30;

        if (e.target.name === "limit") setAdditionQparams((prev) => ({...prev, [e.target.name]: currentvalue}));
        else setQueryParams((prev) => ({...prev, [e.target.name]: currentvalue}));
    };

    const handleCheckbox = (e) => {
        if (e.target.name) {
            var currentlist = platformlist;
            if (currentlist.includes('"'+e.target.value+'"')) {
                currentlist = currentlist.filter((element) => {return element !== ('"'+e.target.value+'"')});
                setPlatformlist(currentlist);
                setQueryParams((prev) => ({...prev, platform: currentlist}));
            }
            else {
                currentlist.push('"'+e.target.value+'"');
                setPlatformlist(currentlist);
                setQueryParams((prev) => ({...prev, platform: currentlist}));
            }
        }
        else {
            currentlist = genrelist;
            if (currentlist.includes('"'+e.target.value+'"')) {
                currentlist = currentlist.filter((element) => {return element !== ('"'+e.target.value+'"')});
                setGenrelist(currentlist);
                setQueryParams((prev) => ({...prev, genre: currentlist}));
            }
            else {
                currentlist.push('"'+e.target.value+'"');
                setGenrelist(currentlist);
                setQueryParams((prev) => ({...prev, genre: currentlist}));
            }
        }
    };


    return (
        <div className="querySelector" ref={querySelectorRef} style={querySelectorStyle}>
            <div className="steamRating">
                <div className="selectTitle">steamRating (0-100): <i className="fa-solid fa-caret-down" onClick={dropdown}></i></div>
                <div className="attributelist">
                    <div className="attribute">Low : <input type="number" placeholder="0" name="steamRating_low" onChange={Setrange} /></div>
                    <div className="attribute">High: <input type="number" placeholder="100" name="steamRating_high" onChange={Setrange} /></div>
                </div>
            </div>
            <div className="price">
                <div className="selectTitle">price (0-450): <i className="fa-solid fa-caret-down" onClick={dropdown}></i></div>
                <div className="attributelist">
                    <div className="attribute">Low : <input type="number" placeholder="0" name="price_low" onChange={Setrange} /></div>
                    <div className="attribute">High: <input type="number" placeholder="450" name="price_high" onChange={Setrange} /></div>
                </div>
            </div>
            <div className="genre">
                <div className="selectTitle"><span onClick={() => setGenreIntersect(!genreIntersect)}>genres: {genreIntersect ? "(Intersect)" : "(Union)"}</span> <i className="fa-solid fa-caret-down" onClick={dropdown}></i></div>
                <div className="attributelist">
                    <div className="attribute">SinglePlayer <input type="checkbox" value="SinglePlayer" onChange={handleCheckbox} /></div>
                    <div className="attribute">Multiplayer <input type="checkbox" value="Multiplayer" onChange={handleCheckbox} /></div>
                    <div className="attribute">Coop <input type="checkbox" value="Coop" onChange={handleCheckbox} /></div>
                    <div className="attribute">CategoryMMO <input type="checkbox" value="CategoryMMO" onChange={handleCheckbox} /></div>
                    <div className="attribute">InAppPurchase <input type="checkbox" value="InAppPurchase" onChange={handleCheckbox} /></div>
                    <div className="attribute">IncludeSrcSDK <input type="checkbox" value="IncludeSrcSDK" onChange={handleCheckbox} /></div>
                    <div className="attribute">IncludeLevelEditor <input type="checkbox" value="IncludeLevelEditor" onChange={handleCheckbox} /></div>
                    <div className="attribute">VRSupport <input type="checkbox" value="VRSupport" onChange={handleCheckbox} /></div>
                    <div className="attribute">NonGame <input type="checkbox" value="NonGame" onChange={handleCheckbox} /></div>
                    <div className="attribute">Indie <input type="checkbox" value="Indie" onChange={handleCheckbox} /></div>
                    <div className="attribute">Action <input type="checkbox" value="Action" onChange={handleCheckbox} /></div>
                    <div className="attribute">Adventure <input type="checkbox" value="Adventure" onChange={handleCheckbox} /></div>
                    <div className="attribute">Casual <input type="checkbox" value="Casual" onChange={handleCheckbox} /></div>
                    <div className="attribute">Strategy <input type="checkbox" value="Strategy" onChange={handleCheckbox} /></div>
                    <div className="attribute">RPG <input type="checkbox" value="RPG" onChange={handleCheckbox} /></div>
                    <div className="attribute">Simulation <input type="checkbox" value="Simulation" onChange={handleCheckbox} /></div>
                    <div className="attribute">EarlyAccess <input type="checkbox" value="EarlyAccess" onChange={handleCheckbox} /></div>
                    <div className="attribute">FreetoPlay <input type="checkbox" value="FreetoPlay" onChange={handleCheckbox} /></div>
                    <div className="attribute">Sports <input type="checkbox" value="Sports" onChange={handleCheckbox} /></div>
                    <div className="attribute">Racing <input type="checkbox" value="Racing" onChange={handleCheckbox} /></div>
                    <div className="attribute">MassivelyMultiplayer <input type="checkbox" value="MassivelyMultiplayer" onChange={handleCheckbox} /></div>
                </div>
            </div>
            <div className="platform">
                <div className="selectTitle"><span onClick={() => setPlatformIntersect(!platformIntersect)}>platforms: {platformIntersect ? "(Intersect)" : "(Union)"}</span> <i className="fa-solid fa-caret-down" onClick={dropdown}></i></div>
                <div className="attributelist">
                    <div className="attribute">PlatformLinux <input type="checkbox" value="PlatformLinux" name="platform" onChange={handleCheckbox} /></div>
                    <div className="attribute">PlatformMac <input type="checkbox" value="PlatformMac" name="platform" onChange={handleCheckbox} /></div>
                    <div className="attribute">PlatformWindows <input type="checkbox" value="PlatformWindows" name="platform" onChange={handleCheckbox} /></div>
                </div>
            </div>
            <div className="limit">
                <div className="selectTitle">Limit: <input type="number" placeholder="30" name="limit" onChange={Setrange} /></div>
            </div>
        </div>
    )

};

export default QuerySelector;
