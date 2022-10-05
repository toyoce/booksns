import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import Link from '../src/Link';

const Home = ({ highlyRatedBooks }) => {
  const [title, setTitle] = useState('');

  const handleTextChange = (event) => {
    setTitle(event.target.value);
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
        value={title}
        onChange={handleTextChange}
      />
      <Box mt={2} display="flex" alignItems="center">
        <Typography variant="h6">評価が高い本</Typography>
        <Link
          variant="body2"
          ml={1}
          underline="hover"
          color="text.primary"
          href="/books"
        >
          もっと見る &gt;
        </Link>
      </Box>
      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap" }}>
        {highlyRatedBooks.map((book) => (
          <Box key={book.isbn} sx={{ mr: 3, mb: 1, border: 1, borderColor: "grey.400" }}>
            <img src={book.img} width="136" />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/highly-rated-books`);
  const highlyRatedBooks = res.data.bookrecords;

  return { props: { highlyRatedBooks } };
};