import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
import {useState} from "react";

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const center = {
    lat: 44.512176,
    lng: 9.124193
};


const MapWrapper = (props) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY
    });

    const getUser = (users, record) => {
        const user = users.find(snapshot => snapshot.id === record.userId).data();
        return user.firstName + ' ' + user.lastName;
    }

    const [selectedRecord, setSelectedRecord] = useState(null);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={3}
        >
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
                selectedRecord && <InfoWindow
                    onCloseClick={() => {
                        setSelectedRecord(null);
                    }}
                    position={{
                        lat: selectedRecord.latitude,
                        lng: selectedRecord.longitude
                    }}
                    options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                >
                    <div style={{width: '250px'}}>
                        <div style={{fontSize: `16px`, fontColor: `#08233B`}}>
                            <p><b>User: </b>{getUser(props.users, selectedRecord)}</p>
                            <p><b>Text: </b>{selectedRecord.text}</p>
                        </div>
                    </div>
                </InfoWindow>
            }
        </GoogleMap>
    ) : <></>;
}

export default MapWrapper;