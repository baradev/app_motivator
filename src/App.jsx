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
} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { getUrl } from 'aws-amplify/storage'
import { uploadData } from 'aws-amplify/storage'
import { generateClient } from 'aws-amplify/data'
import { useNavigate } from 'react-router-dom'

const client = generateClient({
  authMode: 'userPool',
})

export default function App() {
  const [items, setItems] = useState([])
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
    const form = new FormData(event.target)
    console.log(form.get('image').name)

    const { data: newItem } = await client.models.BucketItem.create({
      title: form.get('title'),
      description: form.get('description'),
      image: form.get('image').name,
    })

    console.log(newItem)
    if (newItem.image)
      await uploadData({
        path: ({ identityId }) => `media/${identityId}/${newItem.image}`,
        data: form.get('image'),
      }).result

    fetchItems()
    event.target.reset()
  }

  async function deleteItem({ id }) {
    const toBeDeletedItem = {
      id: id,
    }

    const { data: deletedItem } = await client.models.BucketItem.delete(
      toBeDeletedItem
    )
    console.log(deletedItem)

    fetchItems()
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <View className="App">
          <Heading level={1}>My Bucket List</Heading>
          <View as="form" className="form-container" onSubmit={createItem}>
            <TextField
              name="title"
              placeholder="Bucket List Item"
              label="Bucket List Item"
              required
            />
            <TextField
              name="description"
              placeholder="Description"
              label="Description"
              required
            />
            <View
              name="image"
              as="input"
              type="file"
              accept="image/png, image/jpeg"
            />
            <Button type="submit">Add to Bucket List</Button>
          </View>
          <View className="divider" />
          <Heading level={2}>My Bucket List Items</Heading>
          <View className="grid-container">
            {items.map((item) => (
              <View key={item.id || item.title} className="box">
                <Heading level={3}>{item.title}</Heading>
                <Text>{item.description}</Text>
                {item.image && (
                  <Image src={item.image} alt={`Visual for ${item.title}`} />
                )}
                <Button onClick={() => deleteItem(item)}>Delete Item</Button>
              </View>
            ))}
          </View>
          <Flex justifyContent="space-between" marginTop="2rem">
            <Button onClick={signOut}>Sign Out</Button>
            <Button onClick={() => navigate('/')}>Back to Intro</Button>
          </Flex>
        </View>
      )}
    </Authenticator>
  )
}
