import { Navigation } from 'react-native-navigation'
import { authStore } from '../stores/auth-store'
import { preferencesStore } from '../stores/preferences-store'
import { uiStore } from '../stores/ui-store'
import { ComponentRegistry } from './component-registry'
import { isOnboarded } from './onboarding'

export function skipAppLock() {
  const { authorizeResult } = authStore.getState()
  const { dev__useLockScreen } = preferencesStore.getState()

  const skip = !authorizeResult || !isOnboarded() || dev__useLockScreen === false;

  if (skip) {
    uiStore.setState({ initializedApp: true });
  }

  return skip
}

export function showLockScreenOverlay({
  enforceActivated = false,
  status = 'active',
}: {
  enforceActivated?: boolean
  status?: string
}) {
  if (skipAppLock()) {
    return Promise.resolve()
  }

  // set now
  let lockScreenActivatedAt = Date.now()
  if (enforceActivated) {
    // set yesterday
    lockScreenActivatedAt -= 86400 * 1000
    authStore.setState({
      lockScreenActivatedAt,
    })
  }

  return Navigation.showOverlay({
    component: {
      name: ComponentRegistry.AppLockScreen,
      passProps: { status, lockScreenActivatedAt },
    },
  })
}

export function hideLockScreenOverlay() {
  // reset lockscreen parameters
  authStore.setState({
    lockScreenActivatedAt: undefined,
    lockScreenComponentId: undefined,
  })

  // Dismiss all overlays
  Navigation.dismissAllOverlays()
}
