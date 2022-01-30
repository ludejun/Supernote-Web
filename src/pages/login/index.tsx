import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Form, Button, Input, Checkbox } from 'antd';

import { Dispatch, RootState } from '../../store';
import Storage from '../../utils/Storage';
import './index.less';
import { setUserInfo, UserInfo } from '../../utils/userInfo';

export interface Login {
  loginLoading?: boolean;
  userInfo?: UserInfo;
}
const Login: React.FC<Login> = props => {
  const { loginLoading, login } = props;
  const [form] = Form.useForm();
  const history = useHistory();

  const onFinish = (values: { mobile: string; password: string; remember: boolean }) => {
    login({
      params: values,
      apiName: 'sign'
    }).then((userInfo: UserInfo) => {
      if (userInfo.token) {
        setUserInfo(userInfo);
        history.push('/main/notelist');
      }
    });
  };

  return (
    <div className="login">
      <Form
        form={form}
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="手机号"
          name="mobile"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loginLoading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = ({ user }: RootState) => ({
  loginLoading: user.loginLoading,
  userInfo: user.userInfo
});
const mapDispatchToProps = ({ user: { login } }: Dispatch) => ({
  login
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
