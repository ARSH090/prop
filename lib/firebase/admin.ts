import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY

const hasCredentials = !!(clientEmail && privateKey)

let firebaseApp: any
let db: any
let auth: any
let storage: any

if (hasCredentials) {
  const apps = getApps()
  if (!apps.length) {
    const formattedPrivateKey = privateKey
      .replace(/^["']|["']$/g, '') // Strip leading/trailing quotes if they exist
      .replace(/\\n/g, '\n')       // Replace literal '\n' with actual newlines

    firebaseApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  } else {
    firebaseApp = getApp()
  }

  db = getFirestore(firebaseApp)
  auth = getAuth(firebaseApp)
  storage = getStorage(firebaseApp)
} else {
  // Stubs that throw a clear error message when database/auth/storage operations are attempted.
  // This avoids background GCP auth library initialization and warning print loops.
  const createMock = (serviceName: string) => {
    return new Proxy({} as any, {
      get(target, prop) {
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          return undefined
        }
        return () => {
          throw new Error(
            `Firebase Admin ${serviceName} is not initialized. Please configure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local.`
          )
        }
      },
    })
  }

  firebaseApp = null
  db = createMock('Firestore')
  auth = createMock('Auth')
  storage = createMock('Storage')
}

export { firebaseApp as app, db, auth, storage }

