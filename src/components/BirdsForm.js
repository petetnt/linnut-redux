import React from 'react';
import 'react-dates/initialize';
import InputMoment from 'input-moment';
import moment from 'moment';
import { shape } from 'prop-types';
// import 'moment/locale/fi';
import styled from 'styled-components';
import update from 'immutability-helper';
import helpers from '../helpers';
import BirdsFormMap from './BirdsFormMap';
import BirdsFormSearch from './BirdsFormSearch';
import Header from './shared/Header';
import IconButton from './shared/IconButton';
import Icon from './shared/Icons';
import Button from './shared/Button';
import Select from './shared/Select';
import Input from './shared/Input';

// moment.locale('fi');

const FormContainer = styled.form`
  margin: 0 auto;
  max-width: 720px;
  height: 100%;
  display: grid;
  grid-template-rows: auto auto auto;
`;
const DateTimePicker = styled(InputMoment)`
  position: absolute;
  z-index: 10;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: ${props =>
    props.visible === 'true' ? 'block!important' : 'none!important'};
`;
const GeolocationIconButton = IconButton.extend`
  position: absolute;
  right: 10px;
  top: 10px;
`;
const FormTextFieldset = styled.fieldset`
  padding: 10px;
  border: none;
`;
const FormMapFieldset = styled.fieldset`
  padding: 0;
  height: 100%;
  border: none;
`;
const FormSubmitFielset = styled.fieldset`
  padding: 0;
  text-align: center;
  border: none;
`;
class BirdsForm extends React.Component {
  constructor(props) {
    super(props);
    this.getBirdsByFamily = this.getBirdsByFamily.bind(this);
    this.handleMapLocation = this.handleMapLocation.bind(this);
    this.handleMapPlaces = this.handleMapPlaces.bind(this);
    this.handleMapAddress = this.handleMapAddress.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDateSave = this.handleDateSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showDatetime = this.showDatetime.bind(this);
    this.triggerGetCurrentPosition = this.triggerGetCurrentPosition.bind(this);
    this.state = {
      datetimeshown: false,
      date: moment(),
      families: props.families,
      allBirds: [],
      birds: [],
      places: [],
      sighting: {
        bird: '',
        location: {
          target: {
            coords: {
              lat: '',
              lng: '',
            },
          },
          observer: {
            coords: {
              lat: '',
              lng: '',
            },
          },
          place: '',
          address: {
            name: '',
            address: '',
            country: '',
          },
        },
        date: moment().toISOString(),
      },
    };
  }
  componentWillMount() {
    const { families } = this.state;
    const allBirds = [];
    Object.keys(families).map(key =>
      families[key].species.forEach(bird => {
        const birdObj = bird;
        birdObj.familyName = helpers.slugify(families[key].name);
        allBirds.push(birdObj);
      }),
    );
    this.setState({
      allBirds,
    });
  }
  getBirdsByFamily(currentFamilyName) {
    const { families } = this.state;
    return Object.keys(families)
      .map(key => families[key])
      .filter(family => family.name === currentFamilyName)[0].species;
    // return Object.keys(families).filter(key => families[key].name === currentFamilyName)[0]
    //   .species;
  }
  updateBirdsList(e) {
    const birds = this.getBirdsByFamily(e.currentTarget.value);
    this.setState({
      birds,
    });
  }
  handleMapLocation(location) {
    const newSighting = update(this.state.sighting, {
      location: { target: { coords: { $set: location } } },
    });
    this.setState({
      sighting: newSighting,
    });
  }
  handleMapAddress(address) {
    const newSighting = update(this.state.sighting, {
      location: { address: { $set: address } },
    });
    this.setState({
      sighting: newSighting,
    });
  }
  handleMapPlaces(places) {
    this.setState({ places });
  }
  showDatetime(show = true) {
    const newShowState = show || false;
    this.setState({
      datetimeshown: newShowState,
    });
  }
  triggerGetCurrentPosition(e) {
    e.preventDefault();
    this.refs.birdsformmap.getCurrentPosition(); // eslint-disable-line react/no-string-refs
  }
  handleDateSave() {
    this.setState({ datetimeshown: false });
  }
  handleDateChange(date) {
    const dateString = date.toISOString();
    const newSighting = update(this.state.sighting, {
      date: { $set: dateString },
    });
    this.setState({
      sighting: newSighting,
    });
  }
  handleSearchChange(selectedItem) {
    const newSighting = update(this.state.sighting, {
      bird: { $set: selectedItem },
    });
    this.setState({
      sighting: newSighting,
    });
  }
  handleChange(e) {
    const { target } = e;
    const { value, name } = target;
    let newSighting = {};
    if (name === 'family') {
      this.updateBirdsList(e);
      return;
    }
    if (name === 'place') {
      newSighting = update(this.state.sighting, {
        location: { [name]: { $set: value } },
      });
    } else {
      newSighting = update(this.state.sighting, {
        [name]: { $set: value },
      });
    }
    console.log(
      // eslint-disable-line no-console
      newSighting,
    );
    this.setState({
      sighting: newSighting,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const { sighting } = this.state;
    console.log(sighting); // eslint-disable-line no-console
    // return this.props.firebase
    //   .push('/sightings', { sighting })
    //   .then(() => {
    //     console.log('Sighting added!');
    //   });
  }
  render() {
    const { families } = this.state;
    return (
      <FormContainer onSubmit={this.handleSubmit}>
        <FormTextFieldset>
          <Header>Lisää havainto</Header>
          <GeolocationIconButton onClick={this.triggerGetCurrentPosition}>
            <Icon icon="compass" />
          </GeolocationIconButton>
          <BirdsFormSearch
            items={this.state.allBirds}
            onChange={selectedItem => this.handleSearchChange(selectedItem)}
            // onChange={selectedItem => console.log(selectedItem)}
          />
          {/* 
          <select name="family" onChange={this.handleChange}>
            <option value="">Valitse suku</option>
            {Object.keys(families).map(key => (
              <option value={families[key].name} key={key}>
                {families[key].displayName}
              </option>
            ))}
          </select>
          <select
            value={this.state.sighting.bird.value}
            name="bird"
            onChange={this.handleChange}
          >
            <option value="">Valitse lintu</option>
            {this.state.birds.map(bird => (
              <option value={bird.name} key={bird.name}>
                {bird.displayName}
              </option>
            ))}
          </select>
          */}
          <Select
            value={this.state.sighting.location.place.value}
            name="place"
            onChange={this.handleChange}
          >
            <option value="">Valitse paikka</option>
            {this.state.places.map(place => (
              <option value={place.name} key={place.place_id}>
                {place.name}
              </option>
            ))}
          </Select>
          <Input
            type="text"
            name="date"
            value={this.state.date.format()}
            onChange={this.handleChange}
            onClick={this.showDatetime}
          />
          <DateTimePicker
            moment={this.state.date}
            onChange={this.handleDateChange}
            onSave={this.handleDateSave}
            minStep={5}
            visible={this.state.datetimeshown ? 'true' : 'false'}
          />
        </FormTextFieldset>
        <FormMapFieldset>
          <BirdsFormMap
            ref="birdsformmap" // eslint-disable-line
            handleMapLocation={this.handleMapLocation}
            handleMapAddress={this.handleMapAddress}
            handleMapPlaces={this.handleMapPlaces}
          />
        </FormMapFieldset>
        <FormSubmitFielset>
          <Button primary onClick={this.handleAdd}>
            Lisää
          </Button>
        </FormSubmitFielset>
      </FormContainer>
    );
  }
}
const PropTypes = {
  families: shape({}),
  // firebase: shape({}),
};

const DefaultProps = {
  families: [],
  // firebase: {},
};
BirdsForm.propTypes = PropTypes;
BirdsForm.defaultProps = DefaultProps;
export default BirdsForm;
