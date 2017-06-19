import React from "react";
import PropTypes from "prop-types";
import DuckImage from "../assets/Duck.jpg";
import "./HomeView.scss";

export const HomeView = ({ loadTime, status, time }) => (
  <div>
    <h4>Welcome!</h4>
    <img
      alt="This is a sample, because Redux!"
      className="duck"
      src={DuckImage}
    />
    <button onClick={loadTime}>Load time</button>
    {status === "PENDING" ? "PENDING" : time}
  </div>
);

HomeView.propTypes = {
  loadTime: PropTypes.string,
  status: PropTypes.string,
  time: PropTypes.string
};

export default HomeView;
