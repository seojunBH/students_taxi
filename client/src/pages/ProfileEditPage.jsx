
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useOutletContext } from 'react-router-dom'
import axios from 'axios'

const ProfileEditPage = () => {
  const navigate = useNavigate()
  const { setIsLoggedIn, setCurrentUserId, setCurrentUserGender } = useOutletContext()

  const userId = localStorage.getItem('userId')

  const [profile, setProfile] = useState({
    email: '',
    real_name: '',
    gender: 'MALE',
    phone_number: '',
    school: '',
    entry_year: '',
    student_id: '',
    currentPassword: ''
  })

  const [loading, setLoading] = useState(true)
  const [withdrawPassword, setWithdrawPassword] = useState('')

  useEffect(() => {
    if (!userId) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`)
        const data = response.data

        setProfile(prev => ({
          ...prev,
          email: data.email || '',
          real_name: data.real_name || '',
          gender: data.gender || 'MALE',
          phone_number: data.phone_number || '',
          school: data.school || '',
          entry_year: data.entry_year || '',
          student_id: data.student_id || ''
        }))
      } catch (error) {
        alert(error.response?.data?.message || '회원정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!profile.currentPassword.trim()) {
      alert('현재 비밀번호를 입력해 주세요.')
      return
    }

    try {
      await axios.put(`/api/users/${userId}`, {
        email: profile.email,
        real_name: profile.real_name,
        gender: profile.gender,
        phone_number: profile.phone_number,
        school: profile.school,
        entry_year: Number(profile.entry_year),
        student_id: profile.student_id,
        currentPassword: profile.currentPassword
      })

      localStorage.setItem('userGender', profile.gender)
      setCurrentUserGender(profile.gender)

      alert('회원정보가 수정되었습니다.')
      navigate('/')
    } catch (error) {
      alert(error.response?.data?.message || '회원정보 수정에 실패했습니다.')
    }
  }

  const handleWithdrawal = async (e) => {
    e.preventDefault()

    if (!window.confirm('정말 회원 탈퇴를 진행할까요? 작성한 게시글도 삭제될 수 있습니다.')) {
      return
    }

    try {
      await axios.delete(`/api/users/${userId}`, {
        data: {
          password: withdrawPassword
        }
      })

      localStorage.removeItem('userId')
      localStorage.removeItem('userGender')
      setIsLoggedIn(false)
      setCurrentUserId(null)
      setCurrentUserGender(null)

      alert('회원 탈퇴가 완료되었습니다.')
      navigate('/', { replace: true })
    } catch (error) {
      alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다.')
    }
  }

  if (loading) {
    return <Message>회원정보를 불러오는 중...</Message>
  }

  return (
    <Container>
      <Title>회원정보 수정</Title>

      <Form onSubmit={handleSubmit}>
        <Label>이메일</Label>
        <DisabledInput value={profile.email} disabled />

        <Label>이름</Label>
        <Input
          name="real_name"
          value={profile.real_name}
          onChange={handleChange}
          required
        />

        <Label>성별</Label>
        <Select name="gender" value={profile.gender} onChange={handleChange}>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </Select>

        <Label>전화번호</Label>
        <Input
          name="phone_number"
          value={profile.phone_number}
          onChange={handleChange}
          required
        />

        <Label>학교</Label>
        <Input
          name="school"
          value={profile.school}
          onChange={handleChange}
          required
        />

        <Label>입학년도</Label>
        <DisabledInput value={`${profile.entry_year}년`} disabled />

        <Label>학번</Label>
        <Input
          name="student_id"
          value={profile.student_id}
          onChange={handleChange}
          required
        />

        <Label>현재 비밀번호</Label>
        <Input
          type="password"
          name="currentPassword"
          value={profile.currentPassword}
          onChange={handleChange}
          placeholder="본인 확인용 비밀번호"
          required
        />

        <SubmitButton type="submit">수정사항 저장</SubmitButton>
      </Form>

      <WithdrawalSection>
        <WithdrawalTitle>회원 탈퇴</WithdrawalTitle>
        <WithdrawalDescription>
          탈퇴하면 계정 및 작성한 게시글이 모두 삭제됩니다.
        </WithdrawalDescription>
        <WithdrawalForm onSubmit={handleWithdrawal}>
          <Input
            type="password"
            value={withdrawPassword}
            onChange={e => setWithdrawPassword(e.target.value)}
            placeholder="탈퇴 확인용 비밀번호"
            required
          />
          <WithdrawalButton type="submit">회원 탈퇴</WithdrawalButton>
        </WithdrawalForm>
      </WithdrawalSection>
    </Container>
  )
}

export default ProfileEditPage

const Container = styled.div`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 40px 20px 50px;
`

const Title = styled.h2`
  margin: 0 0 25px;
  text-align: center;
  color: #212529;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 9px;
`

const Label = styled.label`
  margin-top: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #495057;
`

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 7px;
  font-size: 14px;
`

const DisabledInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 7px;
  background: #f8f9fa;
  color: #868e96;
`

const Select = styled.select`
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 7px;
  background: white;
  font-size: 14px;
`

const SubmitButton = styled.button`
  margin-top: 15px;
  padding: 13px;
  border: none;
  border-radius: 7px;
  background: #2675d8;
  color: white;
  font-weight: 700;
  cursor: pointer;
`

const WithdrawalSection = styled.section`
  margin-top: 40px;
  padding-top: 22px;
  border-top: 1px solid #e9ecef;
`

const WithdrawalTitle = styled.h3`
  margin: 0 0 8px;
  color: #e03131;
  font-size: 16px;
`

const WithdrawalDescription = styled.p`
  color: #868e96;
  font-size: 12px;
`

const WithdrawalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const WithdrawalButton = styled.button`
  padding: 12px;
  border: 1px solid #ffa8a8;
  border-radius: 7px;
  background: white;
  color: #e03131;
  font-weight: 700;
  cursor: pointer;
`

const Message = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #868e96;
`
