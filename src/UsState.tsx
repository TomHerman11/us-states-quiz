import React from 'react';
import {
    Geography,
    Marker,
    Annotation
} from 'react-simple-maps';
import { geoCentroid } from "d3-geo";
// import WashingtonDC from './WashingtonDC';
import './UsState.css'

// import states' abbreviations and indices:
import allStatesJson from "./data/allStates.json";
const allStates: { [key: string]: { id: string, val: string } } = allStatesJson;

const STATE_NAME_SIZE = 10;
const STATE_NAME_OFFSETS: { [key: string]: any; } = {
    VT: { xArrow: -50, yArrow: -20, xText: -45, optionsArrow: {} },
    NH: { xArrow: -25, yArrow: -50, xText: -85, optionsArrow: {} },
    MA: { xArrow: -20, yArrow: 0, xText: 4, optionsArrow: { stroke: "none" } },
    RI: { xArrow: -11, yArrow: 30, xText: 4, optionsArrow: {} },
    CT: { xArrow: 0, yArrow: 40, xText: 4, optionsArrow: {} },
    NJ: { xArrow: 10, yArrow: 25, xText: 4, optionsArrow: {} },
    DE: { xArrow: 20, yArrow: 20, xText: 4, optionsArrow: {} },
    MD: { xArrow: 30, yArrow: 30, xText: 4, optionsArrow: {} }
};

function UsState({ geo, showName, hintUsed, currQuizState, handleStateClick }:
    { geo: any, showName: boolean, hintUsed: boolean, currQuizState: string, handleStateClick: any }) {
    const stateName = (geo?.properties?.name || '') as string;
    if (stateName === "District of Columbia") {
        return (
            <WashingtonDC geo={geo} />);
    }

    const currState = allStates[stateName];
    if (!currState) { return (<></>); }

    const centroid = geoCentroid(geo);
    return (
        <>
            <Geography
                className="Geography"
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
                                    dx={STATE_NAME_OFFSETS[currState.id].xArrow}
                                    dy={STATE_NAME_OFFSETS[currState.id].yArrow}
                                    connectorProps={STATE_NAME_OFFSETS[currState.id].optionsArrow}
                                >
                                    <text x={STATE_NAME_OFFSETS[currState.id].xText} fontSize={STATE_NAME_SIZE} alignmentBaseline="middle">
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

function WashingtonDC({ geo }: { geo: any }) {
    const centroid = geoCentroid(geo);
    const offset = { xArrow: 40, yArrow: 50, xText: 1, optionsArrow: {} };

    return (
        <>
            <Geography
                className="Geography"
                stroke="#FFF"
                geography={geo}
                fill='red'
            />
            <g>
                <Annotation
                    subject={centroid}
                    dx={offset.xArrow}
                    dy={offset.yArrow}
                    connectorProps={offset.optionsArrow}
                >
                    <text x={offset.xText} fontSize={10} alignmentBaseline="middle">
                        {"Washington D.C."}
                    </text>
                </Annotation>
            </g>
        </>
    );
}