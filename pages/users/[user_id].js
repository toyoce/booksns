import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
import { formatDate, getCookie } from '../../src/utils';
import { UserContext } from '../_app';

const UserPage = () => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);

  const [bookreviews, setBookreviews] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(undefined);

  useEffect(() => {
    (async () => {
      let config = {
        params: { user_id: router.query.user_id }
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
      const initialBookreviews = response.data.bookreviews.map((br) => (
        { ...br, updated_at: new Date(br.updated_at) }
      )).sort((a, b) => (
        a.updated_at.getTime() < b.updated_at.getTime() ? 1 : -1
      ));
      setBookreviews(initialBookreviews);
    })();
  }, []);

  const handleDeleteIconClick = (id) => {
    setSelected(id);
    setOpen(true);
  };

  const handleDeleteButtonClick = async () => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/bookreviews/${selected}`,
      {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token")
        },
        withCredentials: true
      }
    );
    const newBookreviews = bookreviews.slice().filter((br) => br.id !== selected)
    setBookreviews(newBookreviews);
    setSelected(undefined);
    setOpen(false);
  };

  const handleDialogClose = () => {
    setSelected(undefined);
    setOpen(false);
  };

  let bookreviewRows;

  if (!bookreviews) {
    bookreviewRows = (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  } else if (bookreviews.length) {
    bookreviewRows = (
      <Box>
        {bookreviews.map((br) => (
          <Box key={br.isbn} sx={{ py: 2, display: "flex", borderBottom: 1, borderColor: "grey.400" }}>
            <Box>
              <img src={br.img} width="80" style={{ border: "1px solid silver" }} />
            </Box>
            <Box sx={{ ml: 2 }}>
              {currentUser.userId === router.query.user_id ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Link
                    variant="body2"
                    color="text.primary"
                    underline="hover"
                    href={`/books/${br.isbn}`}
                  >
                    {br.title}
                  </Link>
                  <IconButton
                    component={NextLinkComposed}
                    to={`/bookreviews/${br.id}/edit`}
                    size="small"
                    sx={{ ml: 0.5 }}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteIconClick(br.id)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              ) : (
                <Link
                  variant="body2"
                  color="text.primary"
                  underline="hover"
                  href={`/books/${br.isbn}`}
                >
                  {br.title}
                </Link>
              )}
              <Box sx={{ mt: 1, display: "flex" }}>
                <Rating value={br.star} size="small" readOnly />
                <Typography variant="body2" sx={{ ml: 1, color: "grey.700" }}>
                  {`(${formatDate(br.updated_at)})`}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>{br.comment}</Typography>
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
        <Typography variant="h6" sx={{ my: 2 }}>
          {`${router.query.user_id} さんのページ`}
        </Typography>
        <Box sx={{ mt: 3, mb: 1, display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            レビュー一覧
          </Typography>
          {currentUser.userId === router.query.user_id && (
            <Button
              variant="contained"
              component={NextLinkComposed}
              to={{
                pathname: "/books",
                query: { addReview: 1 },
              }}
              color="info"
              size="small"
            >
              レビューを追加
            </Button>
          )}
        </Box>
        {bookreviewRows}
      </Container>
      <Dialog open={open} onClose={handleDialogClose}>
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
              onClick={handleDialogClose}
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

export default UserPage;
