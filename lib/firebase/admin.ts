import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

const apps = getApps()
let firebaseApp

if (!apps.length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (clientEmail && privateKey) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  } else {
    firebaseApp = initializeApp({
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  }
} else {
  firebaseApp = getApp()
}

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
const storage = getStorage(firebaseApp)

export { firebaseApp as app, db, auth, storage }
