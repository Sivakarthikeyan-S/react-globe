import React from "react";
import Globe from "react-globe.gl";
import chroma from "chroma-js";
import './GlobeComponent.css';

export default function GlobeComponent() {
    const [setHoverD] = React.useState();
    const globeEl = React.useRef();
    const [globeData, setGlobeData] = React.useState({
        countries: {
            features: []
        },
        points: {
            features: []
        }
    });

    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const colorScale = chroma.scale(['#1177e1', '#1177e1']);
    const emptycolorScale = chroma.scale(['#1a1a1a', '#1a1a1a']);


    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {

                fetch(
                    "./correctedData.json"
                )
                    .then((response) => response.json())
                    .then((data) => {
                        const sortedData = data.sort((a, b) => a.countryName.localeCompare(b.countryName));
                        console.log(sortedData);
                        setData(sortedData);
                    });

                fetch(
                    "https://raw.githubusercontent.com/iamanas20/geojson/main/map11.geojson"
                )
                    .then((res) => res.json())
                    .then(function (res) {
                        console.log(res);
                        setGlobeData({
                            countries: res[0],
                            points: res[1]
                        });
                    });


            } catch (error) {
                console.error(error.message);
            }
            setLoading(false);
        };

        fetchData();
    }, []);


    React.useEffect(
        function () {
            if (globeEl.current !== undefined) {
                const scene = globeEl.current.scene();
                if (scene.children.length === 4) {
                    scene.children[1].intensity = 1.5;
                    scene.children[2].visible = false;
                }

                globeEl.current.controls().autoRotate = true;
                globeEl.current.controls().autoRotateSpeed = 0.5;
                globeEl.current.controls().enableZoom = false;
            }
        },
        [globeData]
    );

    let lookup = [];

    return (
        <div id="globe">       
            {loading && <div>Loading...</div>}
            {!loading && (
                <Globe
                    ref={globeEl}
                    width={600}
                    height={600}
                    backgroundColor="#000"
                    // globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    // backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    showAtmosphere={false}
                    polygonsData={globeData.countries.features}
                    polygonStrokeColor={() => "#1177e1"}
                    polygonSideColor={() => "rgba(0,0,0)"}
                    onPolygonHover={setHoverD}
                    polygonCapColor={function ({ properties: d }) {
                        for (let i = 0, len = data.length; i < len; i++) {
                            lookup[data[i].countryName] = data[i];
                        }
                        if(lookup[d.ADMIN]?.cbdcValue) {
                            return colorScale(lookup[d.ADMIN]?.cbdcValue * 0.1).brighten(0.5).hex();
                        }
                        else {
                            return emptycolorScale(0.1).brighten(0.5).hex();
                        }
                    }}
                    polygonLabel={function ({ properties: d }) {

                        for (let i = 0, len = data.length; i < len; i++) {
                            lookup[data[i].countryName] = data[i];
                        }

                        if(lookup[d.ADMIN]?.cbdcValue)
                        return `
                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif; margin-bottom:10px;font-weight: 600;font-size: 16px;line-height: 16px;text-transform: capitalize;color: #1177e1;">
                                ${d.ADMIN}
                            </div>
                        </div>

                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif;font-size: 14px;line-height: 16px;color: #c1c1c1;">
                                Status: ${lookup[d.ADMIN]?.status}
                            </div>
                        </div>

                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif;font-size: 14px;line-height: 16px;color: #c1c1c1;">
                                Use Case: ${lookup[d.ADMIN]?.useCase}
                            </div>
                        </div>

                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif;font-size: 14px;line-height: 16px;color: #c1c1c1;">
                                Technology: ${lookup[d.ADMIN]?.technology}
                            </div>
                        </div>

                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif;font-size: 14px;line-height: 16px;color: #c1c1c1;">
                                Architecture: ${lookup[d.ADMIN]?.architecture}
                            </div>
                        </div>

                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif;font-size: 14px;line-height: 16px;color: #c1c1c1;">
                                Underlying Technology: ${lookup[d.ADMIN]?.underlyingTechnology}
                            </div>
                        </div>

                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif;font-size: 14px;line-height: 16px;color: #c1c1c1;">
                                Access: ${lookup[d.ADMIN]?.access}
                            </div>
                        </div>

                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif;font-size: 14px;line-height: 16px;color: #c1c1c1;">
                                Technology partnerships: ${lookup[d.ADMIN]?.technologyPartnerships}
                            </div>
                        </div>

                        <div style="position: relative; z-index: 4; min-width: 180px; padding: 12px 10px;background: #1a1a1a;border: 1px solid #cacaca;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px; text-align: left;">
                            <div style="font-family: 'Open sans', sans-serif;font-size: 14px;line-height: 16px;color: #c1c1c1;">
                                Cross-border Projects: ${lookup[d.ADMIN]?.crossborderProjects}
                            </div>
                        </div>
                    `;
                    }}
                />
            )}

        </div>
    );
}
