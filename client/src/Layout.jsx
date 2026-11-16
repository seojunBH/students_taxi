
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Header from './components/Header'
import Footer from './components/Footer'

const Layout = ({
  isLoggedIn,
  setIsLoggedIn,
  currentUserId,
  setCurrentUserId,
  currentUserGender,
  setCurrentUserGender,
  currentUserSchool,
  setCurrentUserSchool
}) => {
  return (
    <PageWrapper>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUserId={setCurrentUserId}
        setCurrentUserGender={setCurrentUserGender}
        setCurrentUserSchool={setCurrentUserSchool}
      />
      <MainContent>
        <Outlet
          context={{
            isLoggedIn,
            setIsLoggedIn,
            currentUserId,
            setCurrentUserId,
            currentUserGender,
            setCurrentUserGender,
            currentUserSchool,
            setCurrentUserSchool
          }}
        />
      </MainContent>
      <Footer />
    </PageWrapper>
  )
}

export default Layout

const PageWrapper = styled.div`
  // max-width: 600px;
  // margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`
