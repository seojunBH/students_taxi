
import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Header = ({
  isLoggedIn,
  setIsLoggedIn,
  setCurrentUserId,
  setCurrentUserGender,
  setCurrentUserSchool
}) => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate('/write')
    } else {
      alert('게시글 작성을 위해 로그인이 필요합니다.')
      navigate('/login', { state: { redirectTo: '/write' } })
    }
  }


  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userGender')
    localStorage.removeItem('userSchool')

    setIsLoggedIn(false)
    setCurrentUserId(null)
    setCurrentUserGender(null)
    setCurrentUserSchool(null)

    setIsDropdownOpen(false)
    alert('로그아웃되었습니다.')
    navigate('/login')
  }

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate('/')}>Students Taxi</Logo>

      <NavGroup>
        <WriteButton onClick={handleWriteClick}>+ 합승 모집</WriteButton>

        {isLoggedIn ? (
          <DropdownContainer>
            <MyPageButton onClick={() => setIsDropdownOpen(prev => !prev)}>
              마이페이지 ▼
            </MyPageButton>

            {isDropdownOpen && (
              <DropdownMenu>
                <MenuItem onClick={() => { setIsDropdownOpen(false); navigate('/mypage/edit') }}>
                  회원정보 수정
                </MenuItem>
                <MenuItem onClick={() => { setIsDropdownOpen(false); navigate('/mypage/products') }}>
                  내가 작성한 글
                </MenuItem>
                <Divider />
                <LogoutItem onClick={handleLogout}>로그아웃</LogoutItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
        ) : (
          <AuthGroup>
            <AuthButton onClick={() => navigate('/login')}>로그인</AuthButton>
            <AuthButton onClick={() => navigate('/signup')}>회원가입</AuthButton>
          </AuthGroup>
        )}
      </NavGroup>
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #e9ecef;
  background-color: #fff;
`

const Logo = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #2675d8;
  cursor: pointer;
`

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const WriteButton = styled.button`
  background-color: #2675d8;
  color: #fff;
  border: none;
  padding: 9px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`

const AuthGroup = styled.div`
  display: flex;
  gap: 8px;
`

const AuthButton = styled.button`
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 7px;
  cursor: pointer;
`

const DropdownContainer = styled.div`
  position: relative;
`

const MyPageButton = styled.button`
  background: none;
  border: none;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 4px;
`

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 150px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 6px 0;
  z-index: 100;
`

const MenuItem = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: #343a40;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
    color: #2675d8;
  }
`

const Divider = styled.div`
  height: 1px;
  background: #f1f3f5;
  margin: 4px 0;
`

const LogoutItem = styled(MenuItem)`
  color: #e03131;
`
