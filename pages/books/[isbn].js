import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useContext, useState } from 'react';
import Link, { NextLinkComposed } from '../../src/Link';
import { formatDate, getCookie } from '../../src/utils';
import { UserContext } from '../_app';

const BookPage = ({ book }) => {
  const { currentUser } = useContext(UserContext);

  const bookreviews = book.bookreviews.map((br) => (
    { ...br, updated_at: new Date(br.updated_at) }
  ));

  const [myReview, setMyReview] = useState(currentUser.userId ? (
    bookreviews.filter((br) => (
      br.user_id === currentUser.userId
    ))[0]
  ) : undefined);
  const [open, setOpen] = useState(false);
  
  let otherUsersReviews;
  
  if (currentUser.userId) {
    otherUsersReviews = bookreviews.filter((br) => (
      br.user_id !== currentUser.userId
    ));
  } else {
    otherUsersReviews = bookreviews;
  }

  otherUsersReviews.sort((a, b) => (
    a.updated_at.getTime() < b.updated_at.getTime() ? 1 : -1
  ));

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

  const bookreviewRows = (
    <Box>
      {otherUsersReviews.map((br) => (
        <Box key={br.user_id} sx={{ py: 2, borderBottom: 1, borderColor: "grey.400" }}>
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
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <Container>
        <Box sx={{ mt: 2, display: "flex" }}>
          <Box sx={{ border: 1, borderColor: "grey.400" }}>
            <img src={book.img} />
          </Box>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h6">{book.title}</Typography>
            <Typography variant="body2">{book.author}</Typography>
            <Box sx={{ mt: 1, display: "flex" }}>
              <Rating value={Math.round(book.star*2)/2} precision={0.5} readOnly />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {`${Math.round(book.star*10)/10} (${book.reviewCount})`}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>{book.description}</Typography>
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
          </>
        )}
        <Box sx={{ mt: 4, display: "flex", alignItems: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ flexGrow: 1 }}
          >
            レビュー一覧
          </Typography>
          {(currentUser.userId && !myReview) && (
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
        {otherUsersReviews.length ? bookreviewRows: (
          <Typography variant="body2" sx={{ mt: 6, textAlign: "center" }}>
            まだレビューはありません
          </Typography>
        )}
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
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/books/${params.isbn}`,
    { params: { withReviews: 1 } }
  );
  const book = response.data;

  return { props: { book } };
};