import React, { useState, useEffect } from 'react'
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Loader,
  ThemeProvider,
  useTheme,
} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { getUrl } from 'aws-amplify/storage'
import { uploadData } from 'aws-amplify/storage'
import { generateClient } from 'aws-amplify/data'
import { useNavigate } from 'react-router-dom'

const client = generateClient({
  authMode: 'userPool',
})

function AppContent({ signOut }) {
  const { tokens } = useTheme() // Add this line to access theme tokens
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const { data: items } = await client.models.BucketItem.list()
    await Promise.all(
      items.map(async (item) => {
        if (item.image) {
          const linkToStorageFile = await getUrl({
            path: ({ identityId }) => `media/${identityId}/${item.image}`,
          })
          console.log(linkToStorageFile.url)
          item.image = linkToStorageFile.url
        }
        return item
      })
    )
    console.log(items)
    setItems(items)
  }

  async function createItem(event) {
    event.preventDefault()
    setIsLoading(true)
    const form = new FormData(event.target)

    try {
      const { data: newItem } = await client.models.BucketItem.create({
        title: form.get('title'),
        description: form.get('description'),
        image: form.get('image').name,
      })

      console.log(newItem)
      if (newItem.image) {
        await uploadData({
          path: ({ identityId }) => `media/${identityId}/${newItem.image}`,
          data: form.get('image'),
        }).result
      }

      await fetchItems()
      event.target.reset()
    } catch (error) {
      console.error('Error creating item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteItem({ id }) {
    setDeletingItemId(id)
    try {
      const toBeDeletedItem = { id: id }
      await client.models.BucketItem.delete(toBeDeletedItem)
      await fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      setDeletingItemId(null)
    }
  }

  return (
    <View className="App">
      <Heading level={1}>My Goal List</Heading>
      <View as="form" className="form-container" onSubmit={createItem}>
        <TextField
          name="title"
          placeholder="Goal List Item"
          label="Goal List Item"
          required
        />
        <TextField
          name="description"
          placeholder="Description"
          label="Description"
          required
        />
        <Flex direction="column">
          <Text style={{ color: '#304050' }}>Upload Image (optional)</Text>
          <View
            name="image"
            as="input"
            type="file"
            accept="image/png, image/jpeg"
          />
        </Flex>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add to Bucket List'}
        </Button>
        {isLoading && <Loader variation="linear" />}
      </View>
      <View className="divider" />
      <Heading level={2}>My Goal List Items</Heading>
      <View className="grid-container">
        {items.map((item) => (
          <View key={item.id || item.title} className="box">
            <Heading level={3}>{item.title}</Heading>
            <Text>{item.description}</Text>
            {item.image && (
              <Image src={item.image} alt={`Visual for ${item.title}`} />
            )}
            <Button
              onClick={() => deleteItem(item)}
              disabled={deletingItemId === item.id}
            >
              {deletingItemId === item.id ? 'Deleting...' : 'Delete Item'}
            </Button>
          </View>
        ))}
      </View>
      <Flex justifyContent="space-between" marginTop="2rem">
        <Button
          onClick={() => {
            signOut()
            navigate('/')
          }}
        >
          Sign Out
        </Button>
      </Flex>
    </View>
  )
}

export default function App() {
  const { tokens } = useTheme()
  const theme = {
    name: 'Auth Example Theme',
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
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay['10']}`,
            borderWidth: '0',
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: tokens.colors.purple[80],
            _hover: {
              backgroundColor: tokens.colors.purple[90],
            },
          },
          link: {
            color: tokens.colors.purple[80],
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px ${tokens.colors.purple['60']}`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.neutral['80'],
            _active: {
              borderColor: tokens.colors.purple[80],
              color: tokens.colors.purple[100],
            },
          },
        },
        loader: {
          strokeEmpty: { value: tokens.colors.purple[20] },
          strokeFilled: { value: tokens.colors.purple[80] },
          linear: {
            width: { value: '100%' },
            strokeWidth: { value: '0.25rem' },
            strokeFilled: { value: tokens.colors.purple[80] },
            strokeEmpty: { value: tokens.colors.purple[20] },
          },
        },
      },
    },
  }

  return (
    <ThemeProvider theme={theme}>
      <Authenticator>
        {({ signOut }) => <AppContent signOut={signOut} />}
      </Authenticator>
    </ThemeProvider>
  )
}
