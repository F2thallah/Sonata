
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.77b02cbd4914460e8c5a5782a19eb8f5',
  appName: 'SpotifyClone - A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://77b02cbd-4914-460e-8c5a-5782a19eb8f5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
