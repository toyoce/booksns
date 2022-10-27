import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from '../src/Link';

const Home = ({ highlyRatedBooks, mostReviewedBooks }) => {
  const router = useRouter();
  
  const [keyword, setKeyword] = useState("");

  const handleTextChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && keyword) {
      router.push({
        pathname: "/books",
        query: { keyword }
      });
    }
  };

  return (
    <Container>
      <TextField
        fullWidth
        placeholder="気になる本のタイトルを入力してください"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 3 }}
        variant="outlined"
        value={keyword}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
      />
      <Typography variant="h6" sx={{ mt: 3 }}>評価が高い本</Typography>
      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap" }}>
        {highlyRatedBooks.map((book) => (
          <Box key={book.isbn} sx={{ mr: 3, mb: 1, border: 1, borderColor: "grey.400" }}>
            <Link href={`/books/${book.isbn}`}>
              <img src={book.img} width="128" />
            </Link>
          </Box>
        ))}
      </Box>
      <Typography variant="h6" sx={{ mt: 3 }}>レビュー数が多い本</Typography>
      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap" }}>
        {mostReviewedBooks.map((book) => (
          <Box key={book.isbn} sx={{ mr: 3, mb: 1, border: 1, borderColor: "grey.400" }}>
            <Link href={`/books/${book.isbn}`}>
              <img src={book.img} width="128" />
            </Link>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const responses = await Promise.all([
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/highly-rated-books`),
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/most-reviewed-books`)
  ]);
  
  const highlyRatedBooks = responses[0].data.books;
  const mostReviewedBooks = responses[1].data.books;

  return { props: { highlyRatedBooks, mostReviewedBooks } };
};