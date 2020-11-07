import React from 'react';
import {
    Geography,
    Marker,
    Annotation
} from 'react-simple-maps';
import { geoCentroid } from "d3-geo";
import './UsState.css'

// import states' abbreviations and indices:
import allStatesJson from "./data/allStates.json";
const allStates: { [key: string]: { id: string, val: string } } = allStatesJson;

const STATE_NAME_SIZE = 10;
const STATE_NAME_OFFSETS: { [key: string]: number[]; } = {
    VT: [50, -8],
    NH: [34, 2],
    MA: [30, -1],
    RI: [28, 2],
    CT: [35, 10],
    NJ: [34, 1],
    DE: [33, 0],
    MD: [47, 10],
    DC: [49, 21]
};

function UsState({ geo, showName, hintUsed, currQuizState, handleStateClick }:
    { geo: any, showName: boolean, hintUsed: boolean, currQuizState: string, handleStateClick: any }) {
    const stateName = (geo?.properties?.name || '') as string;
    const currState = allStates[stateName];
    if (!currState) { return (<></>); }

    const centroid = geoCentroid(geo);
    return (
        <>
            <Geography
                stroke="#FFF"
                geography={geo}
                fill={!hintUsed ? "#DDD" : '#FFD700'}
                style={{
                    default: {
                        outline: 'none'
                    },
                    hover: {
                        outline: 'none',
                        fill: '#3C3B6E'
                    },
                    pressed: {
                        outline: 'none',
                        fill: stateName === currQuizState ? 'green' : 'red'
                    }
                }}
                onClick={() => handleStateClick(geo)}
            />
            {showName &&
                <g>
                    {
                        !STATE_NAME_OFFSETS[currState.id] ?
                            (
                                <Marker coordinates={centroid}>
                                    <text y="3" fontSize={STATE_NAME_SIZE} textAnchor="middle">
                                        {geo.properties.name}
                                    </text>
                                </Marker>
                            ) :
                            (
                                <Annotation
                                    subject={centroid}
                                    dx={STATE_NAME_OFFSETS[currState.id][0]}
                                    dy={STATE_NAME_OFFSETS[currState.id][1]}
                                    connectorProps={{}}
                                >
                                    <text x={4} fontSize={STATE_NAME_SIZE} alignmentBaseline="middle">
                                        {geo.properties.name}
                                    </text>
                                </Annotation>
                            )}
                </g>
            }
        </>
    );
}

export default UsState;