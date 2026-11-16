
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

const ProductCreatePage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departure: '',
    destination: '',
    departure_time: '',
    max_people: '3',
    estimated_fare: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userId = localStorage.getItem('userId')

    if (!userId) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }

    if (formData.departure.trim() === formData.destination.trim()) {
      alert('출발지와 도착지는 달라야 합니다.')
      return
    }

    try {
      setLoading(true)

      await axios.post('/api/ride-posts', {
        user_id: Number(userId),
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        departure: formData.departure.trim(),
        destination: formData.destination.trim(),
        departure_time: formData.departure_time || null,
        max_people: Number(formData.max_people),
        estimated_fare: formData.estimated_fare === ''
          ? null
          : Number(formData.estimated_fare)
      })

      alert('합승 모집 글이 등록되었습니다.')
      navigate('/')
    } catch (error) {
      alert(error.response?.data?.message || '게시글 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Title>합승 모집 글 작성</Title>
      <Description>함께 이동할 학생을 모집해 보세요. ( * 표시는 입력 필수 사항입니다. )</Description>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>제목 *</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="예: 홍대입구역 방향 택시 같이 타요"
            maxLength="100"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>출발지 *</Label>
          <Input
            name="departure"
            value={formData.departure}
            onChange={handleChange}
            placeholder="예: 학교 정문"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>도착지 *</Label>
          <Input
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="예: 홍대입구역"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>출발 예정 시간</Label>
          <Input
            name="departure_time"
            type="datetime-local"
            value={formData.departure_time}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>최대 탑승 인원 *</Label>
          <Input
            name="max_people"
            type="number"
            min="1"
            max="10"
            value={formData.max_people}
            onChange={handleChange}
            required
          />
          <HelpText>작성자도 탑승 인원에 포함됩니다.</HelpText>
        </FormGroup>

        <FormGroup>
          <Label>예상 택시 요금 (원)</Label>
          <Input
            name="estimated_fare"
            type="number"
            min="0"
            value={formData.estimated_fare}
            onChange={handleChange}
            placeholder="모르면 비워 두세요."
          />
        </FormGroup>

        <FormGroup>
          <Label>상세 설명</Label>
          <TextArea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="추가로 전달할 내용을 작성해 주세요."
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            취소
          </CancelButton>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '등록 중...' : '모집 글 등록'}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </Container>
  )
}

export default ProductCreatePage

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 30px auto;
  padding: 25px 20px;
`

const Title = styled.h2`
  margin: 0 0 8px;
  color: #212529;
  font-size: 22px;
`

const Description = styled.p`
  margin: 0 0 25px;
  color: #868e96;
  font-size: 14px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #495057;
`

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 7px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2675d8;
  }
`

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 7px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #2675d8;
  }
`

const HelpText = styled.span`
  font-size: 12px;
  color: #868e96;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`

const CancelButton = styled.button`
  flex: 1;
  padding: 13px;
  border: 1px solid #dee2e6;
  background: #fff;
  color: #495057;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
`

const SubmitButton = styled.button`
  flex: 2;
  padding: 13px;
  border: none;
  background: #2675d8;
  color: #fff;
  border-radius: 7px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }
`
