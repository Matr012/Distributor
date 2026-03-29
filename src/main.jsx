import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global CSS – ugyanazok mint az eredeti HTML-ben
import './styles/general.css'
import './styles/navbar.css'
import './styles/home.css'
import './styles/music.css'
import './styles/footer.css'
import './styles/auth.css'
import './styles/contact.css'
import './styles/prods.css'
import './styles/promo.css'
import './styles/profile.css'
import './styles/upload.css'
import './styles/album.css'
import './styles/albums_list.css'
import './styles/admin.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
