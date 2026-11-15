
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

const MyProductPage = () => {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/ride-posts/user/${userId}`)
        setPosts(response.data)
      } catch (error) {
        alert(error.response?.data?.message || '내 게시글을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [userId, navigate])

  if (loading) {
    return <Message>내 게시글을 불러오는 중...</Message>
  }

  return (
    <Container>
      <Header>
        <Title>내가 작성한 글</Title>
        <Count>{posts.length}개</Count>
      </Header>

      {posts.length === 0 ? (
        <EmptyState>
          <EmptyText>아직 작성한 모집 글이 없습니다.</EmptyText>
          <WriteButton onClick={() => navigate('/write')}>
            합승 모집 글 작성하기
          </WriteButton>
        </EmptyState>
      ) : (
        <PostList>
          {posts.map(post => (
            <PostCard
              key={post.post_id}
              onClick={() => navigate(`/product/${post.post_id}`)}
            >
              <PostTitle>{post.title}</PostTitle>
              <RouteText>{post.departure} → {post.destination}</RouteText>
              <PostInfo>
                <span>
                  {post.current_people} / {post.max_people}명
                </span>
                <span>
                  {post.estimated_fare == null
                    ? '요금 미정'
                    : `${Number(post.estimated_fare).toLocaleString()}원`}
                </span>
              </PostInfo>
            </PostCard>
          ))}
        </PostList>
      )}
    </Container>
  )
}

export default MyProductPage

const Container = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 35px 20px 50px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  color: #212529;
`

const Count = styled.span`
  color: #868e96;
  font-size: 13px;
`

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PostCard = styled.div`
  padding: 18px;
  border: 1px solid #e9ecef;
  border-radius: 9px;
  cursor: pointer;

  &:hover {
    background: #f8fbff;
    border-color: #b6d4fe;
  }
`

const PostTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;
  color: #212529;
`

const RouteText = styled.p`
  margin: 0 0 12px;
  color: #2675d8;
  font-size: 14px;
  font-weight: 600;
`

const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #868e96;
  font-size: 12px;
`

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 10px;
`

const EmptyText = styled.p`
  margin-bottom: 18px;
  color: #868e96;
`

const WriteButton = styled.button`
  padding: 11px 18px;
  border: none;
  border-radius: 7px;
  background: #2675d8;
  color: white;
  font-weight: 600;
  cursor: pointer;
`

const Message = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #868e96;
`
