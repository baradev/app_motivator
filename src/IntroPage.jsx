import React from 'react'
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
  return (
    <View padding="3rem" textAlign="center">
      <Heading level={1}>Welcome to My Bucket List App</Heading>
      <Text margin="2rem 0">
        This app helps you create and manage your personal bucket list. Sign in
        to get started!
      </Text>
      <Link to="/app">
        <Button variation="primary">Go to My Bucket List</Button>
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
      },
      components: {
        button: {
          primary: {
            backgroundColor: tokens.colors.purple[80],
            _hover: {
              backgroundColor: tokens.colors.purple[90],
            },
          },
        },
        heading: {
          color: tokens.colors.purple[100],
        },
        text: {
          color: tokens.colors.neutral[80],
        },
      },
    },
  }

  return (
    <ThemeProvider theme={theme}>
      <IntroPageContent />
    </ThemeProvider>
  )
}
