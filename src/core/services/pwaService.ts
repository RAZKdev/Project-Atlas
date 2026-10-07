/**
 * pwaService.ts
 * Manages Progressive Web App (PWA) lifecycle, Service Worker registration,
 * and offline status indicators.
 */

export interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  hasUpdate: boolean;
}

class PWAService {
  private deferredPrompt: any = null;
  private listeners: Set<(state: PWAState) => void> = new Set();
  private state: PWAState = {
    isInstalled: false,
    isInstallable: false,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    hasUpdate: false,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Check standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    this.state.isInstalled = isStandalone;

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.state.isInstallable = true;
      this.notify();
    });

    // Listen for appinstalled
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.state.isInstalled = true;
      this.state.isInstallable = false;
      this.notify();
    });

    // Online / Offline tracking
    window.addEventListener('online', () => {
      this.state.isOffline = false;
      this.notify();
    });

    window.addEventListener('offline', () => {
      this.state.isOffline = true;
      this.notify();
    });
  }

  /**
   * Register the Service Worker
   */
  public registerServiceWorker(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Only register in supported secure or localhost context
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (
                  installingWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  this.state.hasUpdate = true;
                  this.notify();
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('PWA: Service Worker registration failed:', err);
        });
    });
  }

  /**
   * Prompt user to install the app
   */
  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      this.state.isInstallable = false;
      this.notify();
      return choiceResult.outcome === 'accepted';
    } catch {
      return false;
    }
  }

  public getState(): PWAState {
    return { ...this.state };
  }

  public subscribe(listener: (state: PWAState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.getState()));
  }
}

export const pwaService = new PWAService();
