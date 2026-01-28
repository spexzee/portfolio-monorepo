import { Component, ErrorInfo, ReactNode } from 'react';

interface MobileCompatibilityState {
  hasError: boolean;
  errorMessage?: string;
}

interface MobileCompatibilityProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

class MobileCompatibilityWrapper extends Component<MobileCompatibilityProps, MobileCompatibilityState> {
  constructor(props: MobileCompatibilityProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): MobileCompatibilityState {
    // Specifically catch trim-related errors that occur on mobile
    const isTrimError = error.message && (
      error.message.includes('trim') ||
      error.message.includes('Cannot read properties of null') ||
      error.message.includes('Cannot read property \'trim\' of null') ||
      error.message.includes('Cannot read property \'trim\' of undefined')
    );

    return {
      hasError: true,
      errorMessage: isTrimError ? 'Mobile compatibility issue detected' : error.message
    };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    const componentName = this.props.componentName || 'Unknown Component';
    
    console.warn(`Mobile Compatibility Error in ${componentName}:`, error);
    console.warn('Error Context:', {
      component: componentName,
      error: error.message,
      stack: error.stack,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    // Check if this is a known mobile compatibility issue
    const isTrimError = error.message && (
      error.message.includes('trim') ||
      error.message.includes('Cannot read properties of null')
    );

    if (isTrimError) {
      console.warn('Mobile trim compatibility issue detected. This is a known issue on some mobile browsers.');
    }
  }

  render() {
    if (this.state.hasError) {
      // Return custom fallback or default fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback for mobile compatibility issues
      return (
        <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">
              ⚠️ Mobile Compatibility Issue
            </div>
            <div className="text-xs text-gray-500">
              Component temporarily unavailable on this device
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MobileCompatibilityWrapper;