import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";

export class SimpleMap extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
      };
     
      onMarkerClick = (props, marker, e) =>
        this.setState({
          selectedPlace: props,
          activeMarker: marker,
          showingInfoWindow: true
        });
     
      onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          })
        }
      };

  render() {
    return (
      <Map
        style={{ width: "95vw", height: "50vh", margin: "20px auto", border: "2px solid #343A40" }}
        initialCenter={{ lat: 41.735105, lng: 2.671568 }}
        zoom={18}
        google={this.props.google}
        onClick={this.onMapClicked}
      >
         <Marker onClick={this.onMarkerClick}
                name={'Padel Fogars de la Selva'} 
                />
 
        <InfoWindow 
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h3>{this.state.selectedPlace.name}</h3>
              <p>Camí de Sant Corneli, s/n, 08495 Fogars de la Selva, Barcelona</p>
              <img style={{width:'98%'}} src={'/foto1.jpg'} alt={this.state.selectedPlace.name}/>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLEKEY,
})(SimpleMap);
