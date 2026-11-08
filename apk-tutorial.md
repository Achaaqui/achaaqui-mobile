Sempre que mudar o código e quiser gerar outro APK:
cd /home/gabrielsdw/Documentos/projects/if/acha-aqui/achaaqui-mobile

EXPO_PUBLIC_API_URL=http://31.220.85.190:8090/api \
  ./android/gradlew assembleRelease --no-daemon

O novo arquivo ficará em:
android/app/build/outputs/apk/release/app-release.apk

Se trocar a URL da API, altere o valor de EXPO_PUBLIC_API_URL no comando.
Importante: o ajuste de HTTP foi feito no AndroidManifest.xml gerado, e a pasta android/ é ignorada pelo Git. Se você apagar ou regenerar essa pasta, será preciso habilitar android:usesCleartextTraffic="true" de novo — ou, idealmente, publicar a API em HTTPS.