import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from '../src/Link';

const BooksPage = () => {
  const router = useRouter();

  const [keyword, setKeyword] = useState(router.query.keyword || "");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(router.query.keyword ? true : false);

  useEffect(() => {
    if (keyword) {
      (async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/books`,
          { params: { keyword } }
        );
        setBooks(response.data.books);
        setLoading(false);
      })();
    }
  }, []);

  const handleTextChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && keyword) {
      setBooks([]);
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/books`,
        { params: { keyword } }
      );
      setBooks(response.data.books);
      setLoading(false);
    }
  };

  const bookRows = (
    <Box>
      {books.map((b) => (
        <Box key={b.isbn} sx={{ py: 2, display: "flex", borderBottom: 1, borderColor: "grey.400" }}>
          <Box sx={{ border: 1, borderColor: "grey.400" }}>
            <img src={b.img} width="80" />
          </Box>
          <Box sx={{ ml: 2 }}>
            <Link
              variant="body2"
              color="text.primary"
              underline="hover"
              href={router.query.addReview ? {
                pathname: "/bookreviews/new",
                query: { isbn: b.isbn },
              } : `/books/${b.isbn}`}
            >
              {b.title}
            </Link>
            <Typography variant="body2" sx={{ mt: 1 }}>{b.author}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );

  let bookRowsArea;

  if (loading) {
    bookRowsArea = (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  } else if (books.length) {
    bookRowsArea = bookRows;
  }

  return (
    <Container>
      <TextField
        fullWidth
        placeholder={router.query.addReview ? (
          "レビューを追加したい本のタイトルを入力してください"
        ) : "気になる本のタイトルを入力してください"}
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
      {bookRowsArea}
    </Container>
  );
};

export default BooksPage;