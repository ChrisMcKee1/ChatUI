import { Avatar, Box, Typography } from '@mui/material';
import { User, Bot } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';

export type Role = 'user' | 'ai';

export interface MessageBubbleProps {
  message: string;
  role: Role;
  timestamp: string;
  className?: string;
}

// Default fallback colors
const DEFAULT_USER_COLOR = '#1976d2'; // Darker blue for user avatar
const DEFAULT_AI_COLOR = '#d32f2f';   // Darker red for AI avatar
const DEFAULT_USER_BG = '#0d47a1';    // Much deeper blue for user messages
const DEFAULT_AI_BG_DARK = 'rgba(211, 47, 47, 0.15)'; // Semi-transparent red in dark mode
const DEFAULT_AI_BG_LIGHT = 'rgba(211, 47, 47, 0.08)'; // More subtle red in light mode
const DEFAULT_TEXT_DARK = '#fcfcfa';
const DEFAULT_TEXT_LIGHT = '#2c292d';

// IMPORTANT: Override the color from the theme to ensure consistent chat colors
// This prevents the yellow color from being used for the AI avatar
const CHAT_AI_COLOR = DEFAULT_AI_COLOR; // This will always be dark red

export const MessageBubble = ({
  message,
  role,
  timestamp,
  className = '',
}: MessageBubbleProps) => {
  const { theme, isDarkMode } = useTheme();
  const [timeAgo, setTimeAgo] = useState(timestamp);

  // Safely get colors from theme with fallbacks
  const userAvatarColor = theme?.colors?.secondary || DEFAULT_USER_COLOR;
  // IMPORTANT: We're using CHAT_AI_COLOR instead of theme?.colors?.primary for the AI avatar
  const aiAvatarColor = CHAT_AI_COLOR;
  
  // Get primary color for AI bubbles with fallback
  const primaryColor = theme?.colors?.primary || DEFAULT_AI_COLOR;
  const secondaryColor = theme?.colors?.secondary || DEFAULT_USER_COLOR;
  
  // Darken the secondary color for user messages
  const darkenedSecondary = isDarkMode
    ? darkenColor(secondaryColor, 0.3) // Darken by 30% in dark mode
    : darkenColor(secondaryColor, 0.2); // Darken by 20% in light mode
  
  // Message bubble backgrounds
  const userBubbleBgColor = darkenedSecondary || DEFAULT_USER_BG;
  const aiBubbleBgColor = isDarkMode 
    ? `rgba(${hexToRgb(CHAT_AI_COLOR)}, 0.15)` || DEFAULT_AI_BG_DARK
    : `rgba(${hexToRgb(CHAT_AI_COLOR)}, 0.08)` || DEFAULT_AI_BG_LIGHT;
  
  // Ensure text colors have proper contrast
  const userTextColor = 'white'; // Always white for contrast against blue
  const aiTextColor = theme?.colors?.textPrimary || (isDarkMode ? DEFAULT_TEXT_DARK : DEFAULT_TEXT_LIGHT);
  
  // Get font family with fallback
  const fontFamily = theme?.typography?.fontFamily || 'system-ui, sans-serif';
  const fontWeight = theme?.typography?.fontWeight?.normal || '400';
  const textSecondary = theme?.colors?.textSecondary || '#939293';
  
  // Helper function to convert hex to rgb
  function hexToRgb(hex: string) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Return as comma-separated string for rgba()
    return `${r}, ${g}, ${b}`;
  }
  
  // Helper function to darken a color
  function darkenColor(hex: string, amount: number) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Darken by reducing RGB values
    r = Math.max(0, Math.floor(r * (1 - amount)));
    g = Math.max(0, Math.floor(g * (1 - amount)));
    b = Math.max(0, Math.floor(b * (1 - amount)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  useEffect(() => {
    // This would be a place to format the timestamp as a relative time
    // For now, just use the passed timestamp
    setTimeAgo(timestamp);
  }, [timestamp]);

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        width: '100%',
        gap: 1.5,
        alignItems: role === 'user' ? 'flex-end' : 'flex-start', // Align based on sender
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          flexDirection: role === 'user' ? 'row-reverse' : 'row', // Reverse order for user messages
          maxWidth: '80%', // Limit width of message bubbles
        }}
      >
        <Avatar
          sx={{
            bgcolor: role === 'user' ? darkenedSecondary : aiAvatarColor,
            width: 36,
            height: 36,
          }}
        >
          {role === 'user' ? (
            <User size={18} color='white' />
          ) : (
            <Bot size={18} color='white' />
          )}
        </Avatar>
        <Box
          sx={{
            flex: '1 1 auto',
            overflow: 'hidden',
            fontSize: '0.875rem',
            color: role === 'user' ? userTextColor : aiTextColor,
            backgroundColor: role === 'user' ? userBubbleBgColor : aiBubbleBgColor,
            borderRadius: '0.75rem',
            p: 2,
            boxShadow: 1,
            borderTopRightRadius: role === 'user' ? 0 : '0.75rem', // Adjust bubble shape
            borderTopLeftRadius: role === 'user' ? '0.75rem' : 0,  // Adjust bubble shape
          }}
        >
          <Typography
            variant="body2"
            sx={{ 
              fontFamily,
              fontWeight,
              whiteSpace: 'pre-wrap', 
              hyphens: 'auto',
              color: 'inherit'
            }}
          >
            {message}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{
          alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
          color: textSecondary,
          mt: -1,
          mx: 1.5, // Add some margin to align with the bubbles
          fontWeight: 'medium',
        }}
      >
        {timeAgo}
      </Typography>
    </Box>
  );
}; 