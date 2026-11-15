
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    isLoggedIn,
    currentUserId,
    currentUserGender,
    currentUserSchool
  } = useOutletContext()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/ride-posts/${id}`)
        setPost(response.data)
      } catch (error) {
        alert(error.response?.data?.message || '게시글을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('정말 이 모집 글을 삭제할까요?')) return

    try {
      await axios.delete(`/api/ride-posts/${id}`, {
        data: {
          user_id: Number(currentUserId)
        }
      })

      alert('게시글이 삭제되었습니다.')
      navigate('/', { replace: true })
    } catch (error) {
      alert(error.response?.data?.message || '게시글 삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return <Message>게시글을 불러오는 중...</Message>
  }

  if (!post) {
    return <Message>게시글을 찾을 수 없습니다.</Message>
  }

  const isAuthor = isLoggedIn && Number(currentUserId) === Number(post.user_id)
  const isSameSchool = currentUserSchool === post.school
  const isSameGender = currentUserGender === post.gender
  const canApply = isLoggedIn && !isAuthor && isSameSchool && isSameGender
  console.log('로그인 사용자 성별:', currentUserGender)
  console.log('게시글 작성자 성별:', post.gender)
  console.log('작성자 여부:', isAuthor)
  console.log('신청 가능 여부:', canApply)

  const formatDate = (value) => {
    if (!value) return '미정'
    return new Date(value).toLocaleString('ko-KR')
  }

  return (
    <Container>
      <TopBar>
        <BackButton onClick={() => navigate(-1)}>← 목록으로</BackButton>

        {isAuthor && (
          <Actions>
            <EditButton onClick={() => navigate(`/product/edit/${id}`)}>수정</EditButton>
            <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
          </Actions>
        )}
      </TopBar>

      <Content>
        <Title>{post.title}</Title>

        <AuthorInfo>
          작성자: {post.real_name} ({post.gender === 'MALE' ? '남성' : '여성'} / {post.school})
        </AuthorInfo>

        <RouteBox>
          <RouteLabel>출발지</RouteLabel>
          <RouteValue>{post.departure}</RouteValue>
          <Arrow>↓</Arrow>
          <RouteLabel>도착지</RouteLabel>
          <RouteValue>{post.destination}</RouteValue>
        </RouteBox>

        <InfoList>
          <InfoRow>
            <InfoLabel>출발 예정 시간</InfoLabel>
            <InfoValue>{formatDate(post.departure_time)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>예상 택시 요금</InfoLabel>
            <InfoValue>
              {post.estimated_fare == null
                ? '미정'
                : `${Number(post.estimated_fare).toLocaleString()}원`}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>탑승 인원</InfoLabel>
            <InfoValue>{post.current_people} / {post.max_people}명</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>작성 시기</InfoLabel>
            <InfoValue>{formatDate(post.created_at)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>최종 수정 시기</InfoLabel>
            <InfoValue>{formatDate(post.updated_at)}</InfoValue>
          </InfoRow>
        </InfoList>

        <DescriptionSection>
          <DescriptionTitle>상세 설명</DescriptionTitle>
          <DescriptionText>{post.description || '등록된 상세 설명이 없습니다.'}</DescriptionText>
        </DescriptionSection>

        {isAuthor ? (
          <DisabledButton disabled>
            내가 작성한 게시글입니다.
          </DisabledButton>
        ) : !isLoggedIn ? (
          <ApplyButton onClick={() => navigate('/login')}>
            로그인 후 신청 가능
          </ApplyButton>
        ) : !isSameSchool ? (
          <DisabledButton disabled>
            같은 학교 학생만 신청할 수 있습니다.
          </DisabledButton>
        ) : !isSameGender ? (
          <DisabledButton disabled>
            작성자와 성별이 같은 사용자만 신청할 수 있습니다.
          </DisabledButton>
        ) : (
          <ApplyButton onClick={() => alert('신청 기능은 현재 화면만 구현되어 있습니다.')}>
            합승 신청
          </ApplyButton>
        )}
      </Content>
    </Container>
  )
}

export default ProductDetailPage

const Container = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 30px 20px 50px;
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
`

const BackButton = styled.button`
  border: none;
  background: none;
  color: #495057;
  cursor: pointer;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
`

const EditButton = styled.button`
  padding: 7px 13px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: white;
  cursor: pointer;
`

const DeleteButton = styled.button`
  padding: 7px 13px;
  border: 1px solid #ffa8a8;
  border-radius: 6px;
  background: white;
  color: #e03131;
  cursor: pointer;
`

const Content = styled.div`
  padding: 25px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
`

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 23px;
  color: #212529;
`

const AuthorInfo = styled.p`
  margin: 0 0 25px;
  font-size: 13px;
  color: #868e96;
`

const RouteBox = styled.div`
  padding: 22px;
  background: #edf5ff;
  border-radius: 10px;
`

const RouteLabel = styled.div`
  font-size: 12px;
  color: #6c829d;
`

const RouteValue = styled.div`
  margin-top: 5px;
  font-size: 18px;
  font-weight: 700;
  color: #174d91;
`

const Arrow = styled.div`
  margin: 10px 0;
  color: #2675d8;
`

const InfoList = styled.div`
  margin: 25px 0;
  border-top: 1px solid #e9ecef;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 13px 0;
  border-bottom: 1px solid #f1f3f5;
`

const InfoLabel = styled.span`
  color: #868e96;
  font-size: 13px;
`

const InfoValue = styled.span`
  color: #343a40;
  font-size: 13px;
  text-align: right;
`

const DescriptionSection = styled.div`
  margin: 25px 0;
`

const DescriptionTitle = styled.h3`
  font-size: 15px;
  color: #343a40;
`

const DescriptionText = styled.p`
  white-space: pre-wrap;
  line-height: 1.7;
  color: #495057;
  font-size: 14px;
`

const ApplyButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: #2675d8;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`

const DisabledButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: #e9ecef;
  color: #868e96;
  font-size: 13px;
`

const Message = styled.div`
  padding: 70px 20px;
  text-align: center;
  color: #868e96;
`
