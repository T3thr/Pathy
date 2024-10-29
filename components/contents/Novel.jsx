'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { novels, recommendationText } from './NovelList';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fdfdfd;
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 30px;
`;

const TextSection = styled.p`
  font-size: 1.2rem;
  color: #34495e;
  text-align: center;
  margin-bottom: 40px;
`;

const GenreSection = styled.div`
  margin-bottom: 40px;
`;

const GenreHeader = styled.div`
  padding: 15px;
  border-radius: 10px;
  color: white;
  font-size: 1.5rem;
  text-align: left;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  background: ${({ gradient }) => gradient}; // Dynamic background
`;

const NovelList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const NovelCard = styled.a`
  background-color: #ecf0f1;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  width: 200px;
  text-decoration: none;
  color: #2c3e50;

  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s;
  }
`;

const NovelImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px 10px 0 0;
`;

const NovelTitle = styled.h3`
  font-size: 1.1rem;
  margin: 10px 0 0;
  padding: 10px;
`;

export default function Novel() {
  const [categorizedNovels, setCategorizedNovels] = useState({});

  // Categorize novels by genre
  useEffect(() => {
    const savedNovels = localStorage.getItem('categorizedNovels');
    if (savedNovels) {
      setCategorizedNovels(JSON.parse(savedNovels));
    } else {
      const newCategorizedNovels = {
        รักหวานแหวว: novels.filter(novel => novel.genre === "รักหวานแหวว"),
        ตลกขบขัน: novels.filter(novel => novel.genre === "ตลกขบขัน"),
        สยองขวัญ: novels.filter(novel => novel.genre === "สยองขวัญ"),
        แฟนตาซี: novels.filter(novel => novel.genre === "แฟนตาซี"),
      };
      setCategorizedNovels(newCategorizedNovels);
      localStorage.setItem('categorizedNovels', JSON.stringify(newCategorizedNovels));
    }
  }, []);

  // Define gradients for each genre
  const genreGradients = {
    รักหวานแหวว: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    ตลกขบขัน: 'linear-gradient(135deg, #f6d365, #fda085)',
    สยองขวัญ: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    แฟนตาซี: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  };

  return (
    <Container>
      <Header>ยินดีต้อนรับ</Header>
      <TextSection>{recommendationText}</TextSection>

      {Object.entries(categorizedNovels).map(([genre, novels]) => (
        <GenreSection key={genre}>
          <GenreHeader gradient={genreGradients[genre]}>
            {`${genre} `}
          </GenreHeader>
          <NovelList>
            {novels.map((novel, index) => (
              <NovelCard key={index} href={`/novel/${novel.title.replace(/\s+/g, '-').toLowerCase()}`}>
                <NovelImage src={novel.imageUrl} alt={`Cover of ${novel.title}`} />
                <NovelTitle>{novel.title}</NovelTitle>
              </NovelCard>
            ))}
          </NovelList>
        </GenreSection>
      ))}
    </Container>
  );
}
