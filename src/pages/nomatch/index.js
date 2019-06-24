import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

export default class NoMatch extends Component {
  render() {
    return (
      <div className="nomatch-container">
        <span>页面丢了。</span>
        <Link to="/">返回首页</Link>
      </div>
    );
  }
}
