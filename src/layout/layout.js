import React, { Component } from "react";
import { Row, Col } from "antd";
import { ContextProvider } from "../storeByHooks/reducer";
import "./index.scss";

export default class Layout extends Component {
  render() {
    return (
      <ContextProvider>
        <Row>
          <Col>
            <Header />
            <div className="layout-content">{this.props.children}</div>
            <Footer />
          </Col>
        </Row>
      </ContextProvider>
    );
  }
}

const Header = () => {
  return (
    <div className="header">
      <h2>南充力腾机动车服务有限公司</h2>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="footer">
      <h3 className="title">南充力腾机动车服务有限公司</h3>
      <Row className="info" type="flex" justify="center">
        <Col lg={10} xs={20}>
          <Col lg={12} xs={20}>
            地址：四川省南充市顺庆区伍家坡132号
          </Col>
          <Col lg={12} xs={20}>
            <a href="tel:18181071666">电话：18181071666</a>
          </Col>
        </Col>
      </Row>
    </div>
  );
};
