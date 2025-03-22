import {
  Button,
  Heading,
  Text,
  View,
  ThemeProvider,
  useTheme,
} from '@aws-amplify/ui-react'
import { Link } from 'react-router-dom'

function IntroPageContent() {
  const { tokens } = useTheme()

  return (
    <View padding="3rem" textAlign="center">
      <Heading level={1} color="#FFFFFF">
        Welcome to Motivator!
      </Heading>
      <Text margin="2rem 0" fontSize="1.5rem" color={tokens.colors.neutral[20]}>
        Log in to start creating and tracking your personal goals and bucket
        list adventures.
      </Text>
      <Link to="/app">
        <Button variation="primary">Get started</Button>
      </Link>
    </View>
  )
}

export default function IntroPage() {
  const { tokens } = useTheme()
  const theme = {
    name: 'Intro Page Theme',
    tokens: {
      colors: {
        brand: {
          primary: {
            10: tokens.colors.purple[10],
            80: tokens.colors.purple[80],
            90: tokens.colors.purple[90],
            100: tokens.colors.purple[100],
          },
        },
        background: {
          primary: 'linear-gradient(135deg, #6C63FF, #FF6CAB)',
          card: 'rgba(255, 255, 255, 0.1)',
        },
      },
      components: {
        button: {
          primary: {
            backgroundColor: '#333333',
            color: '#FFFFFF',
            _hover: {
              backgroundColor: '#555555',
            },
            borderRadius: '24px',
            padding: '0.75rem 1.5rem',
          },
        },
        heading: {
          color: '#FFFFFF',
        },
        text: {
          color: tokens.colors.neutral[20],
        },
        view: {
          // Default View styles
        },
      },
    },
  }

  return (
    <ThemeProvider theme={theme}>
      <View
        height="60vh" // Reduced height to make it more landscape-like
        minHeight="400px" // Ensure it doesn't get too small on smaller screens
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{
          backgroundImage: theme.tokens.colors.background.primary,
          color: theme.tokens.colors.font?.primary || '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <View
          backgroundColor={theme.tokens.colors.background.card}
          style={{ maxWidth: '800px', width: '90%' }}
        >
          <IntroPageContent
          // Ensure it doesn't get too small on smaller screens
          />
        </View>
      </View>
    </ThemeProvider>
  )
}
