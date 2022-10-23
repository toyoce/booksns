import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getCookie } from '../../src/utils';
import { UserContext } from '../_app';

const BookreviewCreatePage = () => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  
  const [book, setBook] = useState(undefined);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!currentUser.userId) {
      router.push("/login");
    }
    (async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/books/${router.query.isbn}`
      );
      setBook(response.data);
    })();
  }, []);

  const createBookreview = async () => {
    if (!star) {
      setErrorMessage("5段階の評価のどれかを選んでください");
      return;
    }
    setErrorMessage("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/bookreviews`,
        { ...book, star, comment },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": getCookie("csrf_access_token")
          }
        }
      );
      router.push(`/users/${currentUser.userId}`);
    } catch {
      setErrorMessage("エラーにより、レビューの追加に失敗しました");
    }
  };

  if (!book) {
    return (
      <Container>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 2, display: "flex" }}>
        <Box>
          <img src={book.img} width="128" style={{ border: "1px solid silver" }} />
        </Box>
        <Box sx={{ ml: 3, flexGrow: 1 }}>
          <Typography variant="h6">{book.title}</Typography>
          <Typography variant="body2">{book.author}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>{book.description}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 3 }}>評価</Typography>
          <Rating
            value={star}
            onChange={(event, newValue) => setStar(newValue)}
            sx={{ mt: 1 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>コメント</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              multiline
              rows={3}
              placeholder="面白かった！"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              sx={{ width: 4/5 }}
            />
          </Box>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={createBookreview}
          >
            登録
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            sx={{ mt: 3, ml: 1, color: "grey.500", borderColor: "grey.500" }}
          >
            キャンセル
          </Button>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: "error.light" }}
          >
            {errorMessage}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default BookreviewCreatePage;