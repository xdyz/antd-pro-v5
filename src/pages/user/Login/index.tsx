import {LockOutlined, UserOutlined} from '@ant-design/icons'
import {Alert, message, Tabs} from 'antd'
import React, {useState} from 'react'
import ProForm, {ProFormText} from '@ant-design/pro-form'
import {useIntl, Link, history, FormattedMessage, SelectLang, useModel} from 'umi'
import {login} from '@/services/login/index'
import logo from '@/assets/images/Icon.png'
import Cookies from 'js-cookie'
import styles from './index.less'

const LoginMessage: React.FC<{
  content: string
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24
    }}
    message={content}
    type="error"
    showIcon
  />
)

/** 此方法会跳转到 redirect 参数所在的位置 */
const goto = () => {
  if (!history) return
  setTimeout(() => {
    const {query} = history.location
    const {redirect} = query as {redirect: string}
    history.push(redirect || '/')
  }, 10)
}

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false)
  const [userLoginState, setUserLoginState] = useState<Login.LoginResult>({})
  const [type, setType] = useState<string>('account')
  const {initialState, setInitialState} = useModel('@@initialState')

  const intl = useIntl()

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo
      })
    }
  }

  const handleSubmit = async (values: Login.Login) => {
    setSubmitting(true)
    try {
      // 登录
      const res = await login(values)
      if (res?.code === 0) {
        Cookies.set('Authorization', `Bearer ${res?.data?.access_token}`)
        message.success('登录成功！')
        await fetchUserInfo()
        goto()
        return
      }
      // 如果失败去设置用户错误信息
      setUserLoginState({status: 'error', type: 'account'})
    } catch (error) {
      message.error('登录失败，请重试！')
    }
    setSubmitting(false)
  }
  const {status, type: loginType} = userLoginState

  return (
    <div className={styles.container}>
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>DevOps</span>
            </Link>
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录'
                })
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%'
                }
              }
            }}
            onFinish={async (values) => {
              handleSubmit(values as Login.Login)
            }}>
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录'
                })}
              />
              {/* <Tabs.TabPane
                key="mobile"
                tab={intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                })}
              /> */}
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误'
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                    defaultMessage: '用户名'
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                          defaultMessage="请输入用户名!"
                        />
                      )
                    }
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                    defaultMessage: '密码'
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      )
                    }
                  ]}
                />
              </>
            )}
          </ProForm>
        </div>
      </div>
    </div>
  )
}

export default Login
