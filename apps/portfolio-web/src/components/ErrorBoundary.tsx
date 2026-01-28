import React, { useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BugReportIcon from '@mui/icons-material/BugReport';
import LockIcon from '@mui/icons-material/Lock';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorDebugDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  error: Error;
}> = ({ open, onClose, error }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  const handlePasswordSubmit = () => {
    const debugPassword = import.meta.env.VITE_DEBUG_PASSWORD;
    if (password === debugPassword) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 3000);
    }
  };

  const handleClose = () => {
    setPassword('');
    setIsAuthenticated(false);
    setAuthError(false);
    onClose();
  };

  // Extract error details
  const getErrorLocation = () => {
    if (!error.stack) return null;
    
    const stackLines = error.stack.split('\n');
    const fileMatch = stackLines.find(line => 
      line.includes('.tsx') || line.includes('.ts') || line.includes('.jsx') || line.includes('.js')
    );
    
    if (fileMatch) {
      const match = fileMatch.match(/([^/\\]+\.(tsx?|jsx?)):(\d+):(\d+)/);
      if (match) {
        return {
          file: match[1],
          line: match[3],
          column: match[4]
        };
      }
    }
    return null;
  };

  const getComponentStack = () => {
    if (!error.stack) return null;
    
    const stack = error.stack
      .split('\n')
      .filter(line => line.includes('at ') && (line.includes('.tsx') || line.includes('.jsx') || line.includes('Component')))
      .slice(0, 5)
      .map(line => {
        // Safe string processing without trim
        const lineStr = String(line || '');
        // Remove leading and trailing whitespace manually
        return lineStr.replace(/^\s+|\s+$/g, '');
      });
    
    return stack.length > 0 ? stack : null;
  };

  const errorLocation = getErrorLocation();
  const componentStack = getComponentStack();

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          color: 'white',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: '#2d2d2d',
        color: '#ff6b6b'
      }}>
        <BugReportIcon />
        Mobile Error Debug Console
      </DialogTitle>
      
      <DialogContent sx={{ bgcolor: '#1a1a1a', color: 'white' }}>
        {!isAuthenticated ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, color: '#ccc' }}>
              Enter debug password to view error details:
            </Typography>
            
            <TextField
              fullWidth
              type="password"
              label="Debug Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              error={authError}
              helperText={authError ? 'Invalid password' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#2d2d2d',
                  color: 'white',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#777' },
                  '&.Mui-focused fieldset': { borderColor: '#90caf9' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' },
                '& .MuiFormHelperText-root': { color: '#ff6b6b' }
              }}
            />
            
            {authError && (
              <Alert severity="error" sx={{ mt: 2, bgcolor: '#3d1a1a' }}>
                Incorrect password. Access denied.
              </Alert>
            )}
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            {/* Error Location */}
            {errorLocation && (
              <Accordion sx={{ bgcolor: '#2d2d2d', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="📁 Location" size="small" color="error" />
                    Error Location
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#1a1a1a' }}>
                  <Typography variant="body2" component="div">
                    <strong>File:</strong> {errorLocation.file}<br/>
                    <strong>Line:</strong> {errorLocation.line}<br/>
                    <strong>Column:</strong> {errorLocation.column}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Error Message */}
            <Accordion sx={{ bgcolor: '#2d2d2d', color: 'white', mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="⚠️ Message" size="small" color="warning" />
                  Error Message
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#1a1a1a' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    color: '#ff6b6b',
                    wordBreak: 'break-all'
                  }}
                >
                  {error.message || 'Unknown error occurred'}
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Component Stack */}
            {componentStack && componentStack.length > 0 && (
              <Accordion sx={{ bgcolor: '#2d2d2d', color: 'white', mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="🔗 Stack" size="small" color="info" />
                    Component Stack
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#1a1a1a' }}>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {componentStack.map((line, index) => (
                      <Typography 
                        key={index}
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: '#90caf9',
                          borderBottom: index < componentStack.length - 1 ? '1px solid #333' : 'none',
                          py: 0.5
                        }}
                      >
                        {line}
                      </Typography>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Full Stack Trace */}
            {error.stack && (
              <Accordion sx={{ bgcolor: '#2d2d2d', color: 'white' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="🔍 Full" size="small" color="default" />
                    Full Stack Trace
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#1a1a1a' }}>
                  <Box 
                    sx={{ 
                      maxHeight: 300, 
                      overflow: 'auto',
                      bgcolor: '#0d1117',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid #333'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      component="pre"
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        color: '#8b949e',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        margin: 0
                      }}
                    >
                      {error.stack}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ bgcolor: '#2d2d2d', gap: 1 }}>
        {!isAuthenticated ? (
          <>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordSubmit}
              variant="contained"
              startIcon={<LockIcon />}
              disabled={!password}
            >
              Authenticate
            </Button>
          </>
        ) : (
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  
  const showDebugInfo = import.meta.env.VITE_DEBUG_PASSWORD; // Show debug button only if password is configured

  return (
    <>
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-tertiary rounded-lg p-6 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              🚫 Application Error
            </h2>
            <p className="text-secondary text-sm mb-4">
              An unexpected error occurred. We apologize for the inconvenience.
            </p>
          </div>
          
          {/* User-friendly error message */}
          <div className="mb-4 p-4 bg-primary rounded border border-gray-600">
            <h3 className="text-yellow-400 font-semibold mb-2 flex items-center justify-center gap-2">
              ⚠️ Error Message
            </h3>
            <p className="text-red-400 text-sm font-mono break-all">
              {error.message || 'Unknown error occurred'}
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
            >
              🔄 Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
            >
              🔃 Reload Page
            </button>
            
            {/* Mobile Debug Button - Only show if debug password is configured */}
            {showDebugInfo && (
              <button
                onClick={() => setShowDebugDialog(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🐛 Debug Error (Mobile)
              </button>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <p className="text-secondary text-xs">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      </div>
      
      {/* Debug Dialog */}
      <ErrorDebugDialog 
        open={showDebugDialog}
        onClose={() => setShowDebugDialog(false)}
        error={error}
      />
    </>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  fallbackComponent: FallbackComponent = ErrorFallback 
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Enhanced error logging with more context
    console.group('🚫 Error Boundary Caught an Error');
    console.error('Error:', error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Info:', errorInfo);
    
    // Log the current URL and timestamp
    console.error('URL:', window.location.href);
    console.error('Timestamp:', new Date().toISOString());
    
    // Log user agent for device/browser debugging
    console.error('User Agent:', navigator.userAgent);
    console.groupEnd();
    
    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: Send to error reporting service
      // You could use Sentry, LogRocket, Bugsnag, etc.
      console.error('Production Error:', {
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      
      // Example integration (uncomment when you have a service):
      // if (typeof window !== 'undefined' && window.gtag) {
      //   window.gtag('event', 'exception', {
      //     description: error.message,
      //     fatal: false
      //   });
      // }
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={() => {
        // Reset any state or perform cleanup if needed
        window.location.hash = '';
        console.clear();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;