
import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignupPage = () => {
  const navigate = useNavigate()

  const currentYear = new Date().getFullYear()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    real_name: '',
    gender: 'MALE',
    phone_number: '',
    school: '',
    entry_year: '',
    student_id: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      await axios.post('/api/users/signup', {
        ...formData,
        entry_year: Number(formData.entry_year)
      })

      alert('회원가입이 완료되었습니다. 로그인해 주세요.')
      navigate('/login')
    } catch (error) {
      alert(error.response?.data?.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Title>회원가입</Title>
      <Description>학생 정보를 입력해 계정을 만들어 주세요.</Description>

      <Form onSubmit={handleSignup}>
        <Label>이메일</Label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일"
          required
        />

        <Label>비밀번호</Label>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호"
          required
        />

        <Label>이름</Label>
        <Input
          name="real_name"
          value={formData.real_name}
          onChange={handleChange}
          placeholder="실명"
          required
        />

        <Label>성별</Label>
        <Select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </Select>

        <Label>전화번호</Label>
        <Input
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="전화번호"
          required
        />

        <Label>학교</Label>
        <Input
          name="school"
          value={formData.school}
          onChange={handleChange}
          placeholder="학교"
          required
        />

        <Label>입학년도</Label>
        <Input
          name="entry_year"
          type="number"
          value={formData.entry_year}
          onChange={handleChange}
          placeholder={`입학년도(예: ${currentYear})`}
          required
        />

        <Label>학번</Label>
        <Input
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          placeholder="학번"
          required
        />

        <SubmitButton type="submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </SubmitButton>
      </Form>
    </Container>
  )
}

export default SignupPage

const Container = styled.div`
  padding: 40px 20px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 23px;
  margin: 0 0 8px;
  color: #212529;
`

const Description = styled.p`
  margin: 0 0 24px;
  color: #868e96;
  font-size: 14px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 9px;
`

const Label = styled.label`
  margin-top: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #495057;
`

const Input = styled.input`
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 7px;
  font-size: 14px;
`

const Select = styled.select`
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 7px;
  background: #fff;
  font-size: 14px;
`

const SubmitButton = styled.button`
  margin-top: 15px;
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
