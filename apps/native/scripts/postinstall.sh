yarn patch-package
(cd app && yarn build:env .env);

if (cd ../.. && git apply ./apps/native/patches/react-native+0.64.1.manualpatch 2>/dev/null); then
  echo "applied RN patch"
fi
