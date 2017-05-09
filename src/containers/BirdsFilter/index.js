import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BirdsFilter from '../../components/BirdsFilter';
import { formValueChange } from '../../actions/birds-filter';
import BirdsMap from '../BirdsMap';

const BirdsFilterContainer = (props) => {
  const {
    onChange,
  } = props;
  return (
    <div>
      <BirdsFilter
        {...props}
        onChange={onChange}
      />
      <BirdsMap
        {...props}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const {
    birds,
    filters,
    filteredBirds,
    mapConfig,
    } = state;

  return {
    birds,
    filteredBirds,
    filters,
    mapConfig,
  };
}

const mapDispatchToProps = dispatch => ({
  onChange: (event) => {
    dispatch(formValueChange(event.currentTarget.value, event.currentTarget.name));
  },
});

BirdsFilterContainer.propTypes = {
  onChange: PropTypes.func.isRequired,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BirdsFilterContainer);
