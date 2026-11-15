
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.main`
  width: 100%;
  max-width: 1200px;
  min-height: 800px;
  margin: 0 auto;
  padding: 48px 40px 80px;

  @media (max-width: 768px) {
    padding: 32px 20px 60px;
  }
`

const Intro = styled.section`
  margin-bottom: 36px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #222;
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
    color: #777;
  }
`

const SearchForm = styled.form`
  display: flex;
  gap: 10px;
  padding: 20px;
  margin-bottom: 36px;
  background: #f7f8fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 15px;

  &:focus {
    outline: 2px solid #2878e5;
    border-color: transparent;
  }
`

const SearchButton = styled.button`
  height: 46px;
  padding: 0 24px;
  border: none;
  border-radius: 8px;
  background: #2878e5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #1766d0;
  }
`

const ResetButton = styled.button`
  height: 46px;
  padding: 0 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #555;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 22px;
    font-weight: 700;
    color: #222;
  }
`

const PostList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

const PostCard = styled(Link)`
  display: block;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #2878e5;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  }
`

const PostTitle = styled.h3`
  margin-bottom: 18px;
  font-size: 19px;
  font-weight: 700;
  color: #222;
`

const RouteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  font-size: 15px;
  color: #444;
`

const RoutePoint = styled.span`
  padding: 7px 12px;
  background: #f2f6fc;
  border-radius: 6px;
`

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  font-size: 13px;
  color: #888;
`

const StatusMessage = styled.p`
  padding: 50px 20px;
  text-align: center;
  color: #888;
  background: #f8f9fb;
  border-radius: 12px;
`

const ErrorMessage = styled(StatusMessage)`
  color: #d9534f;
`

function Home() {
  const [posts, setPosts] = useState([])
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPosts = async (searchDeparture = '', searchDestination = '') => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get('/api/ride-posts', {
        params: {
          departure: searchDeparture,
          destination: searchDestination
        }
      })

      setPosts(response.data)
    } catch (err) {
      setError('게시물을 불러오지 못했습니다. 서버 연결을 확인해 주세요.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const loadPosts = async () => {
      try {
        const response = await axios.get('/api/ride-posts')

        if (!cancelled) {
          setPosts(response.data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError('게시물을 불러오지 못했습니다. 서버 연결을 확인해 주세요.')
          console.error(err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPosts(departure, destination)
  }

  const handleReset = () => {
    setDeparture('')
    setDestination('')
    fetchPosts('', '')
  }

  return (
    <Container>
      <Intro>
        <h1>함께 이동할 학생을 찾아보세요.</h1>
        <p>같은 방향으로 이동하는 학생들과 택시를 함께 이용해 보세요.</p>
      </Intro>

      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          placeholder="출발지를 입력하세요"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />

        <SearchInput
          placeholder="도착지를 입력하세요"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <SearchButton type="submit">검색</SearchButton>
        <ResetButton type="button" onClick={handleReset}>
          초기화
        </ResetButton>
      </SearchForm>

      <SectionHeader>
        <h2>합승 모집</h2>
      </SectionHeader>

      {loading ? (
        <StatusMessage>게시물을 불러오는 중입니다.</StatusMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : posts.length === 0 ? (
        <StatusMessage>아직 등록된 게시물이 없습니다.</StatusMessage>
      ) : (
        <PostList>
          {posts.map((post) => (
            <PostCard
              key={post.post_id}
              to={`/product/${post.post_id}`}
            >
              <PostTitle>{post.title}</PostTitle>

              <RouteInfo>
                <RoutePoint>{post.departure}</RoutePoint>
                <span>→</span>
                <RoutePoint>{post.destination}</RoutePoint>
              </RouteInfo>

              <PostMeta>
                <span>
                  작성자 {post.real_name} (
                  {post.gender === 'MALE' ? '남성' : '여성'})
                </span>
                <span>
                  {post.departure_time
                    ? new Date(post.departure_time).toLocaleString('ko-KR')
                    : '시간 미정'}
                </span>
                <span>
                  {post.estimated_fare != null
                    ? `${Number(post.estimated_fare).toLocaleString()}원`
                    : '요금 미정'}
                </span>
                <span>
                  {post.current_people}/{post.max_people}명
                </span>
              </PostMeta>
            </PostCard>
          ))}
        </PostList>
      )}
    </Container>
  )
}

export default Home
