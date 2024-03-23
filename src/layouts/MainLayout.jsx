import { useState, useEffect } from "react";

import TileGrid from "../components/TileGrid";
import Tile from "../components/Tile";
import SearchBar from "../components/SearchBar";

import "../styles.css"
import data from "../data/relations.json"

const MainLayout = () => {
    const [query, setQuery] = useState("");
    const [ishomepage, setIshompage] = useState(true);
    const [variablePageActive, setVariablePageActive] = useState(true);
    const [useFilter, setUseFilter] = useState(false);
    const [equations, setEquations] = useState(
        data.equations
    );

    const buildVariables = () => {
        let tempVars = [];
        let id = 0;
        data.equations.forEach((equation) => {
            for (let i = 0; i < equation.vars.length; i++)
            {
                    tempVars.push({ 
                        "id" : id,
                        "label" : equation.names[i],
                        "var" : equation.vars[i],
                        "isSelected" : false,
                        "hidden" : false
                    });
                    id++;
            }
        });

        const uniqueKeys = new Set();
        return tempVars.filter(v => {
            const keyValue = v['label'];
            if (!uniqueKeys.has(keyValue)) {
                uniqueKeys.add(keyValue);
                return true;
            }
            return false;
        });
    };

    const [variables, setVariables] = useState(buildVariables());

    const sortEquations = () => {
        const selectedVariables = variables.filter((variable) => {
            return variable.isSelected;
        })

        const rankedEquations = equations.map((equation) => {
            let n = 0;
            selectedVariables.forEach((variable) => {
                if (equation.names.includes(variable.label))
                    n++
            })
            return { ...equation, numMatched: n};
        });

        setEquations(rankedEquations.filter(e => {
            return e.numMatched > 0 && useFilter;
        }));

        setEquations(rankedEquations.sort((first, second) => {
            return second.numMatched - first.numMatched;
        }))
    };

    const sortVariables = (vars=variables) => {
        setVariables(vars.sort((first, second) => {
            if (first.isSelected && !second.isSelected)
                return -1;
            else if (!first.isSelected && second.isSelected)
                return 1;
            else
                return first.label.localeCompare(second.label);
        }))
    };

    const handleSearchInputChange = (e) => {
        sortVariables(variables.map((variable) => {
            if (variable.label.toLowerCase().includes(e.target.value.toLowerCase()))
                return { ...variable, hidden: false };
            else 
                return { ...variable, hidden: true };
        }));
        setQuery(e.target.value);
    }

    const handleVariableClick = (tileId) => {
        sortVariables(variables.map((variable) => {
            if (variable.id === tileId) 
                return { ...variable, isSelected: !variable.isSelected };
            else 
                return variable;
        }));
    }

    const handleEquationClick = (tileId) => {
        setVariablePageActive(!variablePageActive);
    }

    useEffect(() => {
        sortEquations();
    }, [variables]);

    if (ishomepage) 
        return (
            <div onClick={() => setIshompage(false)} className="main-layout-container">
                <img src="car.png" alt="Splashpage logo" />
                <p className="splashpage-info">Want to know what you can calculate with a few known quantities? CALPHYS knows! CALPHYS filters equations based on your given quantities, so you can just plug in values and get the answers!</p>
            </div>
        );

    return (
        <div className="main-layout-container">
            <div>
                <p id="heading-title">CALPHYS</p>
            </div>
            <div className="layout-section-container">
                <TileGrid>
                    { equations.map((equation) => {
                        return <Tile type="equation" data={equation} onClick={handleEquationClick} />;
                    })}
                </TileGrid>
            </div>
            {
            variablePageActive ?
                <div>
                    <div className="layout-section-container">
                        <SearchBar value={query} onChange={handleSearchInputChange} />
                    </div>
                    <div className="layout-section-container">
                        <TileGrid>
                            { variables.filter((variable) => !variable.hidden).map((variable) => {
                                return <Tile data={variable} onClick={handleVariableClick} />;
                            })}
                        </TileGrid>
                    </div>
                </div>
            :
                <div>

                </div>
            }
        </div>
    );
}

export default MainLayout;