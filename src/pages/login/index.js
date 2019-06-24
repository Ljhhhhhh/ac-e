import React from "react";
import { Row, Col, Form, Input, Button, message } from "antd";
import UserApi from "../../api/user";
import Storage from "../../utils/storage";
import { withRouter } from "react-router";
import "./index.scss";

const FormItem = Form.Item;
const userApi = new UserApi();
const storage = new Storage();

const Login = props => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const data = props.form.getFieldsValue();
        userApi.login(data).then(res => {
          if (res.code === 0) {
            storage.setStorage("userinfo", res.data);
            message.success("登录成功");
            props.history.replace("/customer");
          }
        });
      } else {
        Object.keys(err).forEach(v => {
          message.error(err[v].errors[0].message)
        })
        return false;
      }
    });
  };

  return (
      <div className="form-content">
        <h2>登录</h2>
        <Row type="flex" justify="center">
          <Col xs={20} md={12} lg={6}>
            <Form layout="vertical">
              <FormItem label="姓名">
                {getFieldDecorator("username", {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: "姓名不能为空"
                    },
                    {
                      min: 2,
                      max: 4,
                      message: "长度不在范围内"
                    },
                    {
                      pattern: /^[\u4E00-\u9FA5A-Za-z]+$/,
                      message: "请输入姓名"
                    }
                  ]
                })(<Input placeholder="请输入姓名" />)}
              </FormItem>
              <FormItem label="密码">
                {getFieldDecorator("pwd", {
                  initialValue: "",
                  rules: [
                    {
                      required: true,
                      message: "密码不能为空"
                    }
                  ]
                })(<Input placeholder="请输入密码" type="password" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={handleSubmit}>登录</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
  );
}

export default withRouter(Form.create()(Login));