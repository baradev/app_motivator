import { Button, Heading, Text, View } from '@aws-amplify/ui-react'
import { Link } from 'react-router-dom'

export default function IntroPage() {
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
