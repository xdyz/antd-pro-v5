import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'DevOps',
  pwa: false,
  menu: {
    locale: true
  },
  iconfontUrl: '//at.alicdn.com/t/font_2127206_jd9ab7j3ra.js',
};

export default Settings;
