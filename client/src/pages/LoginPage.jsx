
import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    setIsLoggedIn,
    setCurrentUserId,
    setCurrentUserGender,
    setCurrentUserSchool
  } = useOutletContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = location.state?.redirectTo || '/'

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await axios.post('/api/users/login', {
        email,
        password
      })

      const user = response.data.user || response.data

      localStorage.setItem('userId', String(user.user_id))
      localStorage.setItem('userGender', user.gender)
      localStorage.setItem('userSchool', user.school)

      setIsLoggedIn(true)
      setCurrentUserId(String(user.user_id))
      setCurrentUserGender(user.gender)
      setCurrentUserSchool(user.school)

      alert('로그인되었습니다.')
      navigate(redirectTo)
    } catch (error) {
      alert(error.response?.data?.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Title>로그인</Title>
      <Description>Students Taxi 계정으로 로그인하세요.</Description>

      <Form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <SubmitButton type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </SubmitButton>
      </Form>

      <SignupText>
        아직 회원이 아니신가요?
        <SignupLink type="button" onClick={() => navigate('/signup')}>회원가입</SignupLink>
      </SignupText>
    </Container>
  )
}

export default LoginPage

const Container = styled.div`
  padding: 50px 20px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 23px;
  margin: 0 0 8px;
  color: #212529;
`

const Description = styled.p`
  margin: 0 0 25px;
  color: #868e96;
  font-size: 14px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Input = styled.input`
  padding: 13px;
  border: 1px solid #dee2e6;
  border-radius: 7px;
  font-size: 14px;
`

const SubmitButton = styled.button`
  padding: 14px;
  background: #2675d8;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }
`

const SignupText = styled.div`
  margin-top: 22px;
  text-align: center;
  font-size: 13px;
  color: #868e96;
`

const SignupLink = styled.button`
  margin-left: 8px;
  padding: 0;
  border: none;
  background: none;
  color: #2675d8;
  font-weight: 700;
  cursor: pointer;
`
