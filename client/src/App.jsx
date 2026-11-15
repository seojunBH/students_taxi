
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProductCreatePage from './pages/ProductCreatePage'
import ProfileEditPage from './pages/ProfileEditPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductEditPage from './pages/ProductEditPage'
import MyProductPage from './pages/MyProductPage'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'))
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId'))
  const [currentUserGender, setCurrentUserGender] = useState(localStorage.getItem('userGender'))
  const [currentUserSchool, setCurrentUserSchool] = useState(localStorage.getItem('userSchool'))

  return (
    <Routes>
      <Route
        element={
          <Layout
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            currentUserId={currentUserId}
            setCurrentUserId={setCurrentUserId}
            currentUserGender={currentUserGender}
            setCurrentUserGender={setCurrentUserGender}
            currentUserSchool={currentUserSchool}
            setCurrentUserSchool={setCurrentUserSchool}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage/edit" element={<ProfileEditPage />} />
        <Route path="/mypage/products" element={<MyProductPage />} />
        <Route path="/write" element={<ProductCreatePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/product/edit/:id" element={<ProductEditPage />} />
      </Route>
    </Routes>
  )
}

export default App
