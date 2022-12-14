import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link, { NextLinkComposed } from "../../src/Link";
import { formatDate, getCookie } from "../../src/utils";
import { UserContext } from "../_app";

const UserPage = ({ user }) => {
  const router = useRouter();
  const { user_id } = router.query;
  const { currentUser } = useContext(UserContext);

  const [bookreviews, setBookreviews] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [avatar, setAvatar] = useState(user.avatar);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    (async () => {
      let config = {
        params: { user_id },
      };
      if (currentUser.userId) {
        config = {
          ...config,
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": getCookie("csrf_access_token"),
          },
        };
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/bookreviews`,
          config
        );
        const initialBookreviews = response.data.bookreviews
          .map((br) => ({ ...br, updated_at: new Date(br.updated_at) }))
          .sort((a, b) =>
            a.updated_at.getTime() < b.updated_at.getTime() ? 1 : -1
          );
        setBookreviews(initialBookreviews);
      } catch {
        setBookreviews(undefined);
      }
    })();
  }, []);

  const handleDeleteIconClick = (id) => {
    setSelected(id);
    setOpen(true);
  };

  const handleDeleteButtonClick = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/bookreviews/${selected}`,
        {
          headers: {
            "X-CSRF-TOKEN": getCookie("csrf_access_token"),
          },
          withCredentials: true,
        }
      );
    } catch {
      return;
    }
    const newBookreviews = bookreviews
      .slice()
      .filter((br) => br.id !== selected);
    setBookreviews(newBookreviews);
    setSelected(undefined);
    setOpen(false);
    toast.success("?????????????????????????????????");
  };

  const handleDialogClose = () => {
    setSelected(undefined);
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
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/likes`, {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token"),
        },
        withCredentials: true,
        data: {
          bookreview_id: bookreviewId,
        },
      });
    } catch {
      return;
    }

    const newBookreviews = bookreviews.slice();
    const targetBookreview = newBookreviews.find(
      (br) => br.id === bookreviewId
    );
    targetBookreview.like_count -= 1;
    targetBookreview.my_like = 0;
    setBookreviews(newBookreviews);
  };

  const createLike = async (bookreviewId) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/likes`,
        {
          bookreview_id: bookreviewId,
        },
        {
          headers: {
            "X-CSRF-TOKEN": getCookie("csrf_access_token"),
          },
          withCredentials: true,
        }
      );
    } catch {
      return;
    }

    const newBookreviews = bookreviews.slice();
    const targetBookreview = newBookreviews.find(
      (br) => br.id === bookreviewId
    );
    targetBookreview.like_count += 1;
    targetBookreview.my_like = 1;
    setBookreviews(newBookreviews);
  };

  const handleFileChange = async (event) => {
    setErrorMessage("");
    const { name, files } = event.target;
    const formData = new FormData();
    formData.append(name, files[0]);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/avatars`,
        formData,
        {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": getCookie("csrf_access_token"),
          },
        }
      );
      setAvatar(response.data.avatar);
    } catch {
      setErrorMessage("?????????????????????????????????????????????????????????????????????");
      event.target.value = "";
      return;
    }

    toast.success("???????????????????????????????????????");
    event.target.value = "";
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
          <Box
            key={br.isbn}
            sx={{
              py: 2,
              display: "flex",
              borderBottom: 1,
              borderColor: "grey.400",
            }}
          >
            <Box
              component="img"
              src={br.img}
              sx={{
                width: 80,
                height: 110,
                border: 1,
                borderColor: "grey.400",
              }}
            />
            <Box sx={{ ml: 2 }}>
              {currentUser.userId === user_id ? (
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
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteIconClick(br.id)}
                  >
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
              <Typography variant="body2" sx={{ mt: 1 }}>
                {br.comment}
              </Typography>
              <Box sx={{ mt: 0.5, display: "flex", alignItems: "center" }}>
                <IconButton
                  size="small"
                  color={br.my_like ? "primary" : "default"}
                  disabled={Boolean(
                    !currentUser.userId || currentUser.userId === user_id
                  )}
                  onClick={() => handleThumpUpIconClick(br)}
                >
                  <ThumbUpIcon fontSize="inherit" />
                </IconButton>
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {br.like_count}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  } else {
    bookreviewRows = (
      <Typography variant="body2" sx={{ mt: 6, textAlign: "center" }}>
        ????????????????????????????????????
      </Typography>
    );
  }

  return (
    <>
      <Container>
        <Box sx={{ my: 2, display: "flex", alignItems: "flex-end" }}>
          <Avatar
            src={
              avatar
                ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/static/avatar/${avatar}`
                : ""
            }
            sx={{ width: 96, height: 96 }}
          />
          {currentUser.userId === user_id && (
            <IconButton component="label">
              <input
                hidden
                accept="image/*"
                type="file"
                name="avatar"
                onChange={handleFileChange}
              />
              <PhotoCamera />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: "error.light" }}>
          {errorMessage}
        </Typography>
        <Typography variant="h6" sx={{ my: 1 }}>
          {`${user_id} ??????????????????`}
        </Typography>
        <Box sx={{ mt: 3, mb: 1, display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            ??????????????????
          </Typography>
          {currentUser.userId === user_id && (
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
              ?????????????????????
            </Button>
          )}
        </Box>
        {bookreviewRows}
      </Container>
      <Dialog open={open} onClose={handleDialogClose}>
        <Box sx={{ pr: 2, pb: 1 }}>
          <DialogContent>
            <DialogContentText>
              ????????????????????????????????????????????????
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              sx={{ color: "grey.500", borderColor: "grey.500" }}
              onClick={handleDialogClose}
            >
              ???????????????
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteButtonClick}
            >
              ??????
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default UserPage;

export const getServerSideProps = async ({ params }) => {
  let user;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/${params.user_id}`
    );
    user = response.data;
  } catch {
    user = null;
  }

  return { props: { user } };
};
