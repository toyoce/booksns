import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Link, { NextLinkComposed } from '../../src/Link';
import { convertToHalf, formatDate, getCookie } from '../../src/utils';
import { UserContext } from '../_app';

const BookPage = ({ book }) => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);

  const [myReview, setMyReview] = useState(undefined);
  const [othersReviews, setOthersReviews] = useState(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      let config = {
        params: { isbn: router.query.isbn }
      };
      if (currentUser.userId) {
        config = {
          ...config,
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": getCookie("csrf_access_token")
          }
        };
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/bookreviews`,
        config
      );
      const bookreviews = response.data.bookreviews.map((br) => (
        { ...br, updated_at: new Date(br.updated_at) }
      ));
      if (currentUser.userId) {
        setMyReview(bookreviews.filter((br) => (
          br.user_id === currentUser.userId
        ))[0]);
      }
      const initialOthersReviews = bookreviews.filter((br) => (
        br.user_id !== currentUser.userId
      )).sort((a, b) => (
        a.updated_at.getTime() < b.updated_at.getTime() ? 1 : -1
      ));
      setOthersReviews(initialOthersReviews);
    })();
  }, []);

  const handleDeleteButtonClick = async () => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/bookreviews/${myReview.id}`,
      {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token")
        },
        withCredentials: true
      }
    );
    setMyReview(undefined);
    setOpen(false);
  };

  const handleThumpUpIconClick = (bookreview) => {
    if (bookreview.my_like) {
      deleteLike(bookreview.id);
    } else {
      createLike(bookreview.id);
    }
  };

  const deleteLike = async (bookreviewId) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/likes`,
      {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token")
        },
        withCredentials: true,
        data: {
          bookreview_id: bookreviewId
        }
      }
    );

    const newOthersReviews = othersReviews.slice();
    const targetBookreview = newOthersReviews.find((br) => br.id === bookreviewId);
    targetBookreview.like_count -= 1;
    targetBookreview.my_like = 0;
    setOthersReviews(newOthersReviews);
  };

  const createLike = async (bookreviewId) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/likes`,
      {
        bookreview_id: bookreviewId
      },
      {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token")
        },
        withCredentials: true,
      }
    );

    const newOthersReviews = othersReviews.slice();
    const targetBookreview = newOthersReviews.find((br) => br.id === bookreviewId);
    targetBookreview.like_count += 1;
    targetBookreview.my_like = 1;
    setOthersReviews(newOthersReviews);
  };

  let bookreviewRows;

  if (!othersReviews) {
    bookreviewRows = (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  } else if (othersReviews.length) {
    bookreviewRows = (
      <Box>
        {othersReviews.map((br) => (
          <Box key={br.user_id} sx={{ pt: 2, pb: 1, borderBottom: 1, borderColor: "grey.400" }}>
            <Box sx={{ display: "flex" }}>
              <Link
                variant="body2"
                underline="hover"
                color="text.primary"
                href={`/users/${br.user_id}`}
              >
                {br.user_id}
              </Link>
              <Typography variant="body2" sx={{ ml: 1, color: "grey.700" }}>
                {`(${formatDate(br.updated_at)})`}
              </Typography>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Rating value={br.star} size="small" readOnly />
            </Box>
            <Typography variant="body2">{br.comment}</Typography>
            <Box sx={{ mt: 0.5, display: "flex", alignItems: "center" }}>
              <IconButton
                size="small"
                color={br.my_like ? "primary" : "default"}
                disabled={Boolean(!currentUser.userId)}
                onClick={() => handleThumpUpIconClick(br)}
              >
                <ThumbUpIcon fontSize="inherit" />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 0.5 }}>{br.like_count}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  } else {
    bookreviewRows = (
      <Typography variant="body2" sx={{ mt: 6, textAlign: "center" }}>
        まだレビューはありません
      </Typography>
    );
  }

  return (
    <>
      <Container>
        <Box sx={{ mt: 2, display: "flex" }}>
          <Box
            component="img"
            src={book.img}
            sx={{ width: 128, height: 176, border: 1, borderColor: "grey.400" }}
          />
          <Box sx={{ ml: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link
                variant="h6"
                underline="hover"
                color="text.primary"
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {book.title}
              </Link>
              <OpenInNewIcon fontSize="inherit" sx={{ ml: 0.5 }} />
            </Box>
            <Typography variant="body2">{book.author}</Typography>
            <Box sx={{ mt: 1, display: "flex" }}>
              <Rating value={Math.round(book.star*2)/2} precision={0.5} readOnly />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {`${book.star.toFixed(1)} (${book.reviewCount})`}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {convertToHalf(book.description)}
            </Typography>
          </Box>
        </Box>
        {myReview && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 4 }}>自分のレビュー</Typography>
            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
              <Rating value={myReview.star} size="small" readOnly />
              <Typography
                variant="body2"
                sx={{ ml: 1, color: "grey.700" }}
              >
                {`(${formatDate(myReview.updated_at)})`}
              </Typography>
              <IconButton
                component={NextLinkComposed}
                to={`/bookreviews/${myReview.id}/edit`}
                size="small"
                sx={{ ml: 0.5 }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="small" onClick={() => setOpen(true)}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>{myReview.comment}</Typography>
            <Box sx={{ mt: 0.5, display: "flex", alignItems: "center" }}>
              <IconButton size="small" disabled>
                <ThumbUpIcon fontSize="inherit" />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 0.5 }}>{myReview.like_count}</Typography>
            </Box>
          </>
        )}
        <Box sx={{ mt: 4, display: "flex", alignItems: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ flexGrow: 1 }}
          >
            レビュー一覧
          </Typography>
          {(currentUser.userId && !myReview && othersReviews) && (
            <Button
              variant="contained"
              component={NextLinkComposed}
              to={{
                pathname: "/bookreviews/new",
                query: { isbn: book.isbn },
              }}
              color="info"
              size="small"
            >
              レビューを作成
            </Button>
          )}
        </Box>
        {bookreviewRows}
      </Container>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box sx={{ pr: 2, pb: 1 }}>
          <DialogContent>
            <DialogContentText>
              この本のレビューを削除しますか？
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              sx={{ color: "grey.500", borderColor: "grey.500" }}
              onClick={() => setOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteButtonClick}
            >
              削除
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default BookPage;

export const getServerSideProps = async ({ params }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/books/${params.isbn}`
  );
  const book = response.data;

  return { props: { book } };
};