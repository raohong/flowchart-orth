import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  history: {
    type: 'hash',
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
});
