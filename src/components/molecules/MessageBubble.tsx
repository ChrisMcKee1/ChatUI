'use client';

import React from 'react';
import { Avatar, Box, Typography, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { User, Bot } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { Message } from './ChatMessagePanel'; // Import the Message type

export type Role = 'user' | 'assistant' | 'system' | 'tool';

export interface MessageBubbleProps {
  message: Message; // Use the full Message object
  className?: string;
}

// Default fallback colors - matching the AgentToggle component colors
const DEFAULT_USER_COLOR = '#ffd866'; // Warning color (yellow/orange) for user avatar
const DEFAULT_ASSISTANT_COLOR = '#78dce8';   // Secondary color (light blue) for assistant avatar
const DEFAULT_INFO_COLOR = '#a9dc76'; // Success/Info color (green)
const DEFAULT_ERROR_COLOR = '#ff6188'; // Error color (pink/red)

const DEFAULT_USER_BG_DARK = 'rgba(255, 216, 102, 0.2)'; // Semi-transparent yellow in dark mode
const DEFAULT_USER_BG_LIGHT = 'rgba(255, 216, 102, 0.3)'; // More vibrant yellow in light mode
const DEFAULT_ASSISTANT_BG_DARK = 'rgba(120, 220, 232, 0.2)'; // Semi-transparent blue in dark mode
const DEFAULT_ASSISTANT_BG_LIGHT = 'rgba(120, 220, 232, 0.3)'; // More vibrant blue in light mode
const DEFAULT_TEXT_DARK = '#fcfcfa';
const DEFAULT_TEXT_LIGHT = '#2c292d';

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

// Create a map to track agent color assignments and used colors
// Using a module-level variable to persist between renders
// This ensures consistent colors throughout the chat session
const agentColorAssignments: Record<string, string> = {};
const usedColors = new Set<string>();
let nextColorIndex = 0;

const agentBackgrounds = (color: string, isDarkMode: boolean) => {
  // Adjusted alpha values for better visibility and contrast
  const alpha = isDarkMode ? 0.9 : 0.4; // Less transparency in light mode for better contrast
  return `rgba(${hexToRgb(color)}, ${alpha})`;
};

export const MessageBubble = ({
  message, // Use the whole message object
  className = '',
}: MessageBubbleProps) => {
  const { theme, isDarkMode } = useTheme();
  const [timeAgo, setTimeAgo] = useState(message.timestamp || '');
  const muiTheme = useMuiTheme();
  
  // Add breakpoint checks for responsive design
  const isXsScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));
  
  // Extract properties from the message object
  const { content, role, agentName, agentIdentifier } = message;
  
  // Use agentName if available, otherwise fall back to agentIdentifier
  const agentId = agentName || agentIdentifier;

  // Reserve user color - this should never be assigned to any agent
  const userColor = theme?.colors?.warning || DEFAULT_USER_COLOR;
  
  // Get theme-based colors for agent assignment - excluding the user color
  // These colors are directly from the theme files, with an emphasis on 
  // colors designed for visual distinction
  const themeColorPool = [
    theme?.colors?.secondary || '#78dce8',   // Light blue
    theme?.colors?.success || '#a9dc76',     // Green
    theme?.colors?.danger || '#ff6188',      // Red/Pink
    theme?.colors?.info || '#78dce8',        // Light blue variant
    theme?.colors?.primary || '#ff6188',     // Pink/Purple
  ].filter(color => color !== userColor); // Exclude user color
  
  // Add fallback colors for additional visual variety
  // These are hardcoded based on colors from the VSCode theme files
  const additionalColors = [
    '#5ad4e6',  // Chart blue from theme
    '#7bd88f',  // Chart green from theme
    '#fc618d',  // Chart red from theme
    '#fce566',  // Chart yellow from theme
    '#fd9353',  // Chart orange from theme
    '#948ae3',  // Chart purple from theme
    '#ab9df2',  // Bracket color purple variant
    '#ff8f7e',  // Orange/salmon variant
    '#66d9ef',  // Bright cyan
    '#ae81ff',  // Lavender
  ].filter(color => color !== userColor); // Exclude user color
  
  // Combine the theme colors with additional colors, removing duplicates
  const combinedColorPool = Array.from(new Set([...themeColorPool, ...additionalColors]));

  // Function to get or assign a color for an agent
  const getAgentColor = (agentName: string): string => {
    // If we already assigned a color to this agent, use it
    if (agentColorAssignments[agentName]) {
      return agentColorAssignments[agentName];
    }
    
    // Find a color that hasn't been used yet if possible
    let color = '';
    
    // First try to find unused colors
    for (let i = 0; i < combinedColorPool.length; i++) {
      const candidateColor = combinedColorPool[(nextColorIndex + i) % combinedColorPool.length];
      if (!usedColors.has(candidateColor) && candidateColor !== userColor) {
        color = candidateColor;
        nextColorIndex = (nextColorIndex + i + 1) % combinedColorPool.length;
        break;
      }
    }
    
    // If all colors have been used, fall back to cycling through them
    if (!color) {
      color = combinedColorPool[nextColorIndex % combinedColorPool.length];
      nextColorIndex++;
    }
    
    // Store the assignment for future use and mark as used
    agentColorAssignments[agentName] = color;
    usedColors.add(color);
    
    return color;
  };

  // Get base theme colors with fallbacks
  const warningColor = userColor; // Use the reserved user color
  const secondaryColor = theme?.colors?.secondary || DEFAULT_ASSISTANT_COLOR;
  
  // Determine if this is a user message
  const isUserMessage = role === 'user';
  
  // Determine background and text color based on role and agent
  let bubbleBgColor = '';
  let textColor = '#222'; // Always use black text as requested
  let avatarBgColor = '';
  // Adjust icon color based on mode and background for better contrast
  let avatarIconColor = '#222'; 

  if (isUserMessage) {
    bubbleBgColor = isDarkMode 
      ? agentBackgrounds(warningColor, true) || DEFAULT_USER_BG_DARK
      : agentBackgrounds(warningColor, false) || DEFAULT_USER_BG_LIGHT;
    avatarBgColor = warningColor;
    // Ensure the avatar icon is clearly visible
    avatarIconColor = isDarkMode ? '#222' : '#222';
  } else if (role === 'assistant') {
    if (agentId) {
      // Get a consistent color for this agent from our theme-based pool
      const agentColor = getAgentColor(agentId);
      bubbleBgColor = agentBackgrounds(agentColor, isDarkMode);
      avatarBgColor = agentColor;
      // Calculate luminance to determine if we need white or black icon
      const luminance = calculateLuminance(agentColor);
      avatarIconColor = luminance > 0.5 ? '#222' : '#fff';
    } else {
      // Default assistant style when no agent is specified
      bubbleBgColor = isDarkMode 
        ? agentBackgrounds(secondaryColor, true) || DEFAULT_ASSISTANT_BG_DARK
        : agentBackgrounds(secondaryColor, false) || DEFAULT_ASSISTANT_BG_LIGHT;
      avatarBgColor = secondaryColor;
      // Calculate luminance to determine if we need white or black icon
      const luminance = calculateLuminance(secondaryColor);
      avatarIconColor = luminance > 0.5 ? '#222' : '#fff';
    }
  } else {
    // Handle system/tool messages (using secondary color as default)
    bubbleBgColor = isDarkMode 
      ? agentBackgrounds(secondaryColor, true)
      : agentBackgrounds(secondaryColor, false);
    avatarBgColor = secondaryColor;
    // Calculate luminance to determine if we need white or black icon
    const luminance = calculateLuminance(secondaryColor);
    avatarIconColor = luminance > 0.5 ? '#222' : '#fff';
  }

  // Helper function to calculate color luminance (brightness)
  function calculateLuminance(hexColor: string): number {
    // Convert hex to RGB
    const rgb = hexToRgb(hexColor).split(',').map(Number);
    
    // Calculate relative luminance using the formula for sRGB
    // L = 0.2126 * R + 0.7152 * G + 0.0722 * B (where R, G, B are in [0,1])
    return (0.2126 * (rgb[0]/255)) + (0.7152 * (rgb[1]/255)) + (0.0722 * (rgb[2]/255));
  }
  
  // Get font family with fallback
  const fontFamily = theme?.typography?.fontFamily || 'system-ui, sans-serif';
  const fontWeight = theme?.typography?.fontWeight?.normal || '400';
  const textSecondary = theme?.colors?.textSecondary || '#939293';
  
  // Determine label text for assistant messages
  const agentLabel = !isUserMessage ? (agentId || 'Assistant') : '';
  
  useEffect(() => {
    // Use the passed timestamp directly for now
    setTimeAgo(message.timestamp || '');
  }, [message.timestamp]);

  // Don't render system messages for now (or style them differently)
  if (role === 'system' || role === 'tool') {
     // Optionally render system messages differently or not at all
     // For now, just return null
     return null;
  }

  // Determine the max width based on screen size
  const getMaxWidth = () => {
    if (isXsScreen) return '95%'; // Wider bubbles on very small screens
    if (isSmScreen) return '85%'; // Slightly narrower on small screens
    return '80%'; // Default for larger screens
  };

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        width: '100%',
        gap: 1.5,
        alignItems: isUserMessage ? 'flex-end' : 'flex-start', // Align based on sender
      }}
    >
      {/* Show agent label for assistant messages */}
      {!isUserMessage && agentLabel && (
        <Typography
          component="div"
          variant="caption"
          sx={{
            fontWeight: 'bold',
            color: avatarBgColor,
            ml: isUserMessage ? 0 : 7, // Align with message bubble
            mb: -1,
          }}
        >
          {agentLabel}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          flexDirection: isUserMessage ? 'row-reverse' : 'row', // Reverse order for user messages
          maxWidth: getMaxWidth(), // Dynamic width based on screen size
          // Add responsive padding
          px: isXsScreen ? 1 : 0,
        }}
      >
        <Avatar
          sx={{
            bgcolor: avatarBgColor,
            width: isXsScreen ? 32 : 36, // Slightly smaller avatar on mobile
            height: isXsScreen ? 32 : 36,
          }}
        >
          {isUserMessage ? (
            <User size={isXsScreen ? 16 : 18} color={avatarIconColor} />
          ) : (
            <Bot size={isXsScreen ? 16 : 18} color={avatarIconColor} />
          )}
        </Avatar>
        <Box
          sx={{
            flex: '1 1 auto',
            overflow: 'hidden',
            fontSize: isXsScreen ? '0.8125rem' : '0.875rem', // Smaller font on mobile
            color: textColor, // Use determined text color
            backgroundColor: bubbleBgColor, // Use determined background color
            borderRadius: '0.75rem',
            p: isXsScreen ? 1.5 : 2, // Less padding on mobile
            boxShadow: 1,
            borderTopRightRadius: isUserMessage ? 0 : '0.75rem', // Adjust bubble shape
            borderTopLeftRadius: isUserMessage ? '0.75rem' : 0,  // Adjust bubble shape
          }}
        >
          <Typography
            component="div"
            variant="body2"
            sx={{ 
              fontFamily,
              fontWeight,
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word', // Ensure long words wrap
              hyphens: 'auto',
              color: 'inherit', // Inherit color from parent Box
              fontSize: 'inherit', // Inherit font size from parent Box
            }}
          >
            {content} {/* Use content from message object */}
          </Typography>
        </Box>
      </Box>
      <Typography
        component="div"
        variant="caption"
        sx={{
          alignSelf: isUserMessage ? 'flex-end' : 'flex-start',
          color: textSecondary,
          mt: -1,
          mx: isXsScreen ? 1 : 1.5, // Less margin on mobile
          fontWeight: 'medium',
          fontSize: isXsScreen ? '0.65rem' : '0.7rem', // Smaller font on mobile
        }}
      >
        {timeAgo}
      </Typography>
    </Box>
  );
}; 