import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import { UserCreditsProvider } from './context/UserCreditsContext.jsx'

const CLERK_PUB_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={CLERK_PUB_KEY}>
        <UserCreditsProvider>
            <BrowserRouter>
                <Toaster />
                <App />
            </BrowserRouter>
        </UserCreditsProvider>
    </ClerkProvider>
)