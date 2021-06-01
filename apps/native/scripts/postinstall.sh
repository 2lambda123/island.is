yarn patch-package
(cd app && yarn build:env .env);

if (cd ../.. && git apply ./apps/native/patches/react-native+0.64.1.manualpatch 2>/dev/null); then
  echo "Applied react-native patch"
else
  echo "Skipped react-native patch"
fi

if (cd ../.. && git apply ./apps/native/patches/styled-components+5.2.1.manualpatch 2>/dev/null); then
  echo "Applied styled-components patch"
else
  echo "Skipped styled-components patch"
fi
