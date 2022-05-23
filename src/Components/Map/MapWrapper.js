import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import {useState} from "react";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";

const MapWrapper = (props) => {

    const getUser = (users, record) => {
        const user = users.find(snapshot => snapshot.id === record.userId).data();
        return user.firstName + ' ' + user.lastName;
    }

    const Map = () => {

        const [selectedRecord, setSelectedRecord] = useState(null);

        return <GoogleMap
            defaultZoom={3}
            defaultCenter={{lat: 45.421532, lng: -75.697189}}>
            {props.translations.map(record => {
                const data = record.data();
                return <Marker
                    key={record.id}
                    position={{
                        lat: data.latitude,
                        lng: data.longitude
                    }}
                    onClick={() => {
                        setSelectedRecord(data)
                    }}
                />
            })}
            {
                selectedRecord && <InfoBox
                    onCloseClick={() => {
                        setSelectedRecord(null);
                    }}
                    position={{
                        lat: selectedRecord.latitude,
                        lng: selectedRecord.longitude
                    }}
                >
                    <div
                        style={{backgroundColor: `yellow`, padding: `20px`}}>
                        <div style={{fontSize: `16px`, fontColor: `#08233B`}}>
                            <b>User: </b>{getUser(props.users, selectedRecord)}<br/>
                            <b>Text: </b>{selectedRecord.text}
                        </div>
                    </div>
                </InfoBox>
            }
        </GoogleMap>
    }

    const WrappedMap = withScriptjs(withGoogleMap(Map));

    return <div style={{width: '100%', height: '100vh'}}>
        <WrappedMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
                process.env.REACT_APP_GOOGLE_KEY
            }`}
            loadingElement={<div style={{height: `100%`}}/>}
            containerElement={<div style={{height: `100%`}}/>}
            mapElement={<div style={{height: `100%`}}/>}
        />
    </div>
}

export default MapWrapper;