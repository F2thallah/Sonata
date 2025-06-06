import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.alternative.77b02cbd4914460e8c5a5782a19eb8f5',
  appName: 'SpotifyClone - An Alternative project',
  webDir: 'dist',
  server: {
    url: 'https://77b02cbd-4914-460e-8c5a-5782a19eb8f5.alternativeproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
