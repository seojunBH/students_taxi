
import styled from 'styled-components'

const Footer = () => {
  return (
    <FooterContainer>
      <CompanyTitle>Students Taxi</CompanyTitle>
      <InfoText>선린인터넷고등학교 학생 합승 모집 서비스</InfoText>
      <InfoText>소프트웨어과 프로젝트</InfoText>
      <MetaGroup>
        <MetaItem>Database <span>MySQL</span></MetaItem>
        <MetaItem>Frontend <span>React</span></MetaItem>
        <MetaItem>Backend <span>Node.js</span></MetaItem>
      </MetaGroup>
      <Copyright>© {new Date().getFullYear()} Students Taxi</Copyright>
    </FooterContainer>
  )
}

export default Footer

const FooterContainer = styled.footer`
  padding: 28px 20px 32px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  font-size: 12px;
  color: #868e96;
  line-height: 1.7;
`

const CompanyTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #495057;
  margin: 0 0 6px;
`

const InfoText = styled.p`
  margin: 2px 0;
`

const MetaGroup = styled.div`
  margin: 12px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`

const MetaItem = styled.span`
  span {
    color: #495057;
    font-weight: 600;
  }
`

const Copyright = styled.p`
  margin: 14px 0 0;
  font-size: 11px;
  color: #adb5bd;
`
