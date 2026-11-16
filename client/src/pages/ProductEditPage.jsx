
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

const ProductEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departure: '',
    destination: '',
    departure_time: '',
    max_people: '',
    current_people: '',
    estimated_fare: ''
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/ride-posts/${id}`)
        const data = response.data

        setFormData({
          title: data.title || '',
          description: data.description || '',
          departure: data.departure || '',
          destination: data.destination || '',
          departure_time: data.departure_time
            ? new Date(data.departure_time).toISOString().slice(0, 16)
            : '',
          max_people: String(data.max_people ?? ''),
          current_people: String(data.current_people ?? ''),
          estimated_fare: data.estimated_fare == null
            ? ''
            : String(data.estimated_fare)
        })
      } catch (error) {
        alert(error.response?.data?.message || '게시글을 불러오지 못했습니다.')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, navigate])

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

    if (formData.departure.trim() === formData.destination.trim()) {
      alert('출발지와 도착지는 달라야 합니다.')
      return
    }

    if (Number(formData.current_people) > Number(formData.max_people)) {
      alert('최대 인원은 현재 인원보다 작을 수 없습니다.')
      return
    }

    try {
      setSubmitting(true)

      await axios.put(`/api/ride-posts/${id}`, {
        user_id: Number(userId),
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        departure: formData.departure.trim(),
        destination: formData.destination.trim(),
        departure_time: formData.departure_time || null,
        max_people: Number(formData.max_people),
        current_people: Number(formData.current_people),
        estimated_fare: formData.estimated_fare === ''
          ? null
          : Number(formData.estimated_fare)
      })

      alert('게시글이 수정되었습니다.')
      navigate(`/product/${id}`, { replace: true })
    } catch (error) {
      alert(error.response?.data?.message || '게시글 수정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Message>게시글 정보를 불러오는 중...</Message>
  }

  return (
    <Container>
      <Title>모집 글 수정</Title>
      <p>( * 표시는 입력 필수 사항입니다. )</p>

      <Form onSubmit={handleSubmit}>
        <Label>제목 *</Label>
        <Input name="title" value={formData.title} onChange={handleChange} required />

        <Label>출발지 *</Label>
        <Input name="departure" value={formData.departure} onChange={handleChange} required />

        <Label>도착지 *</Label>
        <Input name="destination" value={formData.destination} onChange={handleChange} required />

        <Label>출발 예정 시간</Label>
        <Input
          type="datetime-local"
          name="departure_time"
          value={formData.departure_time}
          onChange={handleChange}
        />

        <Label>최대 탑승 인원 *</Label>
        <Input
          type="number"
          name="max_people"
          min="1"
          value={formData.max_people}
          onChange={handleChange}
          required
        />

        <Label>현재 탑승 인원 *</Label>
        <Input
          type="number"
          name="current_people"
          min="1"
          value={formData.current_people}
          onChange={handleChange}
          required
        />

        <Label>예상 요금</Label>
        <Input
          type="number"
          name="estimated_fare"
          min="0"
          value={formData.estimated_fare}
          onChange={handleChange}
        />

        <Label>상세 설명</Label>
        <TextArea
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
        />

        <ButtonGroup>
          <CancelButton type="button" onClick={() => navigate(-1)}>
            취소
          </CancelButton>
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? '수정 중...' : '수정 완료'}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </Container>
  )
}

export default ProductEditPage

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 30px auto;
  padding: 25px 20px;
  p {
    margin: 0 0 25px;
    color: #868e96;
    font-size: 14px;
  }
`

const Title = styled.h2`
  margin: 0 0 25px;
  color: #212529;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Label = styled.label`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #495057;
`

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 7px;
  font-size: 14px;
`

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 7px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`

const CancelButton = styled.button`
  flex: 1;
  padding: 13px;
  border: 1px solid #dee2e6;
  border-radius: 7px;
  background: white;
  cursor: pointer;
`

const SubmitButton = styled.button`
  flex: 2;
  padding: 13px;
  border: none;
  border-radius: 7px;
  background: #2675d8;
  color: white;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }
`

const Message = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #868e96;
`
