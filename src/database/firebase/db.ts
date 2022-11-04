import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import config from './config'

const app = initializeApp(config)
const db = getFirestore()
const storage = getStorage(app)

export {
  db,
  storage
}